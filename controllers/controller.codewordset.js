const _ = require('lodash');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Codewordset = require('../model/model.codewordset');
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
let xlsx2json = require('xlsx2json'); // added by Ujjawal Kumar
multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data')
    },
    filename: function (req, file, cb) {
        cb(null, 'test.xlsx')
    }
})

var upload = multer({ storage: storage }).single('file')

// Fetching data from uploaded xls file is added by Ujjawal Kumar
let getDataFromXLS = (req, res) => {
    upload(req, res, function (err) {
        if (req && (!req.file || req.file.size == 0)) {
            return res.status(500).json({ message: "Please provide proper file." });
        }
        xlsx2json("./data/test.xlsx",
            {
                // dataStartingRow: 2, (This would be required if header would be required in the cordword sheet which would be uploaded by the Instructor)
                //A, B , C , E is from the input sheet row numbers
                mapping: {
                    'codeword': 'A',
                }
            }).then(jsonArray => {
                console.log(jsonArray[0]);
                var codewords = _.map(jsonArray[0],'codeword')
                var validatinglength = 0
                var empty_codeword = 0
                var validatecodeword = 0
                var codeword_duplicates_1 = 0
                var codeword_duplicates_2 = 0
                var codeword_space = 0
                _.forEach(codewords, function(value,index) {
                    if(value.length<5 || value.length >15) {
                         if(value.length == 0){
                            empty_codeword = index
                            return true
                         }else{
                            validatinglength = index
                            return true
                         }
                    }
                    if(value.includes(' ')){
                        if(codeword_space === 0){
                            codeword_space = index
                        }
                        return true  
                      }
                    var tests = /^([a-zA-Z]{5,15})$/.test(value.toUpperCase())
                    if(!tests) {
                        validatecodeword = index
                        return true
                    }
                    for(var i = 0; i < codewords.length; i++) {
                        for(var j = i; j < codewords.length; j++) {
                            if(i != j && codewords[i].toUpperCase() === codewords[j].toUpperCase()) {
                                codeword_duplicates_1 = i+1
                                codeword_duplicates_2 = j+1
                                return true 
                            }
                        }
                    }
                });
                if(codeword_duplicates_1 > 0){
                    return res.status(200).json({ data: 'Uploaded excel has duplicates codewords in row '+ codeword_duplicates_1 + ' and ' +codeword_duplicates_2 + ' has same! ', count: false })
                }else if(empty_codeword !== 0){
                    return res.status(200).json({ data: 'Uploaded excel sheet has empty!! ', count: false })
                }
                else if(validatinglength !== 0){
                    return res.status(200).json({ data: 'Codeword has less than 5 characters in the row '+ (validatinglength + 1), count: false })
                }else if(validatecodeword !== 0){
                    return res.status(200).json({ data: 'Codeword has special characters or numbers in the row '+ (validatecodeword + 1), count: false })
                }else if(codeword_space !== 0){
                    return res.status(200).json({ data: 'Codeword has empty space in the row '+ (codeword_space + 1), count: false })
                }else{
                    return res.status(200).json({ data: codewords, count: jsonArray[0].length })
                }
            })
    })

}
module.exports.getDataFromXLS = getDataFromXLS;

let addcodewordset = (req, res) => {
    var body = _.pick(req.body,['CodeWordSetName','Codewords']);
    for (var i = 0; i < body.Codewords.length; i++) {
        body.Codewords[i]=body.Codewords[i].toUpperCase();
      }
    var codewordset = new Codewordset({
        CodeWordSetName: body.CodeWordSetName,
        CodeWordCreator: req.session.email,
        Codewords: body.Codewords
    });
    codewordset.save().then((codes) => {
        return res.json({ code: 200, data: codes });
    }).catch((e) => {
        console.log(e);
        return res.json({ code: 400, message: e });
    })
}
module.exports.addcodewordset = addcodewordset;

let getcodewordset = (req, res) => {
    Codewordset.find({ $or: [{CodeWordCreator: req.session.email}, {isPermanent: true}] } ).then((codes) => {
        if (codes)
            return res.json({ code: 200, data: codes });
    }).catch((e) => {
        console.log(e);
        return res.json({ code: 400, message: e });
    })
}
module.exports.getcodewordset = getcodewordset;

let deletecodewordset = (req, res) => {
    var body = _.pick(req.body,['CodeWordSetName']);
    Codewordset.remove({ CodeWordSetName: body.CodeWordSetName } ).then((result) => {
        if (result)
            return res.json({ code: 200, data: true });
    }).catch((e) => {
        return res.json({ code: 400, message: e });
    })
}
module.exports.deletecodewordset = deletecodewordset;
