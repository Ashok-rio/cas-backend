const { User, Post, SemesterFee } = require("../models");
const { to, ReE, ReS, isNull, isEmpty } = require("../services/util.service");
const HttpStatus = require("http-status");

exports.createSemFee = async (req, res) => {
  const user = req.user;

  let err, exisitingUser, createFee;

  [err, exisitingUser] = await to(User.findById(user._id));

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!exisitingUser.admin) {
    return ReE(
      res,
      { message: "You could not assign this process." },
      HttpStatus.BAD_REQUEST
    );
  }

  let fields = ["semesterName", "semesterFees", "regNo"];

  let invalidFields = fields.filter(field => {
    if (isNull(req.body[field])) {
      return true;
    }
  });

  if (invalidFields.length !== 0) {
    return ReE(
      res,
      { message: `Please enter ${invalidFields}` },
      HttpStatus.BAD_REQUEST
    );
  }

  let student;

  [err, student] = await to(User.findOne({ regNo: req.body.regNo }));

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!student) {
    return ReE(
      res,
      { message: "Registration Number is not found in document. Try again!" },
      HttpStatus.BAD_REQUEST
    );
  }

  let person, personId;

  [err, person] = await to(SemesterFee.findOne().sort({ _id: -1 }));

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!person) {
    personId = 1;
  }

  if (person) {
    personId = person.personId + 1;
  }

  [err, createFee] = await to(
    SemesterFee.create({
      personId: personId,
      userId: student._id,
      semester: {
        semesterName: req.body.semesterName,
        semesterFees: req.body.semesterFees,
        paidFees: req.body.paidFees,
        paid: req.body.paidFees ? true : false,
        pendingFees: req.body.semesterFees - req.body.paidFees,
        pending: req.body.semesterFees - req.body.paidFees === 0 ? false : true,
      },
    })
  );

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!createFee) {
    return ReE(
      res,
      { message: "Fees creation are invalid process try again!" },
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  if (createFee) {
    return ReS(
      res,
      { message: "Create successfully!", Sem: createFee },
      HttpStatus.OK
    );
  }
};

exports.addSemFee = async (req, res) => {
  const user = req.user;

  let err, exisitingUser, addFee;

  [err, exisitingUser] = await to(User.findById(user._id));

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!exisitingUser.admin) {
    return ReE(
      res,
      { message: "You could not assign this process." },
      HttpStatus.BAD_REQUEST
    );
  }

  let fields = ["semesterName", "semesterFees", "class"];

  let invalidFields = fields.filter(field => {
    if (isNull(req.body[field])) {
      return true;
    }
  });

  if (invalidFields.length !== 0) {
    return ReE(
      res,
      { message: `Please enter ${invalidFields}` },
      HttpStatus.BAD_REQUEST
    );
  }

  let semFess = {
    semesterName: req.body.semesterName,
    semesterFees: req.body.semesterFees,
  };

  [err, addFee] = await to(
    SemesterFee.updateMany(
      { course: req.body.class },
      { $push: { semester: semFess } }
    )
  );

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!addFee) {
    return ReE(
      res,
      { message: "invalid add fees process" },
      HttpStatus.BAD_REQUEST
    );
  }

  if (addFee) {
    return ReS(res, { message: "Added fees in all student" }, HttpStatus.OK);
  }
};

exports.paidFee = async (req, res) => {
  const user = req.user;

  let err, exisitingUser, paidFee;

  [err, exisitingUser] = await to(User.findById(user._id));

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!exisitingUser.admin) {
    return ReE(
      res,
      { message: "You could not assign this process." },
      HttpStatus.BAD_REQUEST
    );
  }

  let findFee;

  [err, findFee] = await to(SemesterFee.findOne({ userId: req.body.userId }));

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!findFee) {
    return ReE(
      res,
      { message: "cannot find this document" },
      HttpStatus.BAD_REQUEST
    );
  }

  let semeFee = findFee.semester.find(s => s._id.equals(req.body.id));

  let paidFees = {
    semesterName:semeFee.semesterName,
    semesterFees:semeFee.semesterFees,
    pending:
      semeFee.semesterFees - semeFee.paidFees + req.body.paidFees === 0
        ? false
        : true,
    paidFees: semeFee.paidFees + req.body.paidFees,
    pendingFees: semeFee.paidFees + req.body.paidFees - semeFee.semesterFees,
  };

  [err, paidFee] = await to(
    SemesterFee.updateOne(
      { userId: req.body.userId, "semester._id": req.body.id },
      { $set: { "semester.$[]": paidFees } }
    )
  );

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!paidFee) {
    return ReE(res, { message: "Invalid process" }, HttpStatus.BAD_REQUEST);
  }

  if (paidFee) {
    return ReS(
      res,
      { message: "Semester fees", semester: paidFee },
      HttpStatus.OK
    );
  }
};

exports.getSemFees = async (req, res) => {
  const user = req.user;

  let err, getFees;

  [err, getFees] = await to(SemesterFee.findOne({ userId: user._id }));

  if (err) {
    return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR);
  }

  if (!getFees) {
    return ReE(
      res,
      { message: "Document not found in your ID" },
      HttpStatus.BAD_REQUEST
    );
  }

  if (getFees) {
    return ReS(
      res,
      { message: "Semester feed detais fetched!", semester: getFees },
      HttpStatus.OK
    );
  }
};
