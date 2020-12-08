const { User, SemesterFee, BusFee } = require("../models");
const { to, ReE, ReS, isNull, isEmpty } = require("../services/util.service");
const HttpStatus = require("http-status");


exports.createBusFee = async (req, res) =>{

    const user = req.user;

    let exisitingUser, busFee;

    [err, exisitingUser] = await to(User.findById(user._id));

    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }
  
    if (!exisitingUser.admin) { return ReE( res, { message: "You could not assign this process." }, HttpStatus.BAD_REQUEST )}

    let fields = ["semester", "semesterFees", "regNo"];

    let invalidFields = fields.filter(field => { if (isNull(req.body[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE( res, { message: `Please enter ${invalidFields}` }, HttpStatus.BAD_REQUEST )}

    let student;

    [err, student] = await to(User.findOne({ regNo: req.body.regNo }));

    if (err) {return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }

    if (!student) { return ReE( res, { message: "Registration Number is not found in document. Try again!" }, HttpStatus.BAD_REQUEST )}

    let personId

    [err, personId] = await to(SemesterFee.findOne({userId:student._id}));

    if (err) {return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }

    if(!personId){ return ReE( res, { message: "Registration Number is not found in document. Try again!" }, HttpStatus.BAD_REQUEST ) }


    [err,busFee] = await to(BusFee.create({
        userId: student._id,
        personId: personId.personId,
        busNumber: req.body.bus,
        busFees:
            {
                semesterName: req.body.semester,
                semesterFees: req.body.semesterFees,
                paidFees : req.body.paid,
                pendingFees : (req.body.semesterFees - req.body.paid),
                pending: req.body.semesterFees === req.body.paid ? false : true

            }
        

    }));


    if(err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR)}

    if(!busFee){ return ReE(res, {message:'Bus Fee doesn\'t created! Try again'},HttpStatus.BAD_REQUEST) }

    return ReS(res, {message:'Bus Fee created!', BusFee:busFee}, HttpStatus.OK)


}

exports.paidFee = async (req, res) =>{

    const user = req.user;

    let err, exisitingUser, paidFees;

    [err, exisitingUser] = await to(User.findById(user._id));

    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }

    if (!exisitingUser.admin) { return ReE( res, { message: "You could not assign this process." }, HttpStatus.BAD_REQUEST )}

    let fields = ["person","paid","id"];

    let invalidFields = fields.filter(field => { if (isNull(req.body[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE(res,{ message: `Please enter ${invalidFields}` },HttpStatus.BAD_REQUEST )}

    let exisitingFee;

    [err, exisitingFee] = await to(BusFee.findOne({personId:req.body.person}));

    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }

    if(!exisitingFee){ return ReE(res, {message:'Person doesn\'t fetch. try again!'}, HttpStatus.BAD_REQUEST) }

    

    let paidBusFee = exisitingFee.busFees.find(s => s._id.equals(req.body.id));

    

    let addPaidFee = {

        semesterFees :paidBusFee.semesterFees,
        paidFees : paidBusFee.paidFees + req.body.paid,
        pendingFees : paidBusFee.pendingFees - req.body.paid,
        pending : paidBusFee.pendingFees - req.body.paid === 0 ? false : true 


    };

    [err, paidFees] = await to(BusFee.updateOne(
        { personId: exisitingFee.personId, "busFees._id": req.body.id },
        { $set: { "busFees.$[]": addPaidFee } }
      ));

      if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }
    
      if (!paidFees) { return ReE(res, { message: "Invalid process" }, HttpStatus.BAD_REQUEST)}
    
      if (paidFees) { return ReS( res, { message: "Bus fees", semester: paidFees }, HttpStatus.OK)}


}

exports.addBusFee = async  (req, res) => {

    const user = req.user;

    let err, exisitingUser, addBusFee;

    [err, exisitingUser] = await to(User.findById(user._id));

    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }

    if (!exisitingUser.admin) { return ReE( res, { message: "You could not assign this process." }, HttpStatus.BAD_REQUEST )}

    let fields = ["bus","fee","semester"];

    let invalidFields = fields.filter(field => { if (isNull(req.body[field])) { return true }});

    if (invalidFields.length !== 0) { return ReE(res,{ message: `Please enter ${invalidFields}` },HttpStatus.BAD_REQUEST )}

    let newBusFee = {
      semesterName : req.body.semester,
      semesterFees : req.body.fee,
      pendingFees: req.body.fee
    }

    [err, addBusFee] = await to(BusFee.updateMany(
      {
        busNumber : req.body.bus
      },{
        $push : {busFees : newBusFee}
      }
    ));

    if (err) { return ReE(res, err, HttpStatus.INTERNAL_SERVER_ERROR) }
  
    if (!addBusFee) { return ReE( res, { message: "invalid add fees process" }, HttpStatus.BAD_REQUEST )}
  
    if (addBusFee) { return ReS(res, { message: "Added Busfee in all student" }, HttpStatus.OK) }



}