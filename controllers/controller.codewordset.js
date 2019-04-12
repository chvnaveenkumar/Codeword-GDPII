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
                var validatinglength = false
                var empty_codeword = false
                var validatecodeword = false
                var codeword_duplicates = false
                var codeword_space = false
                _.forEach(codewords, function(value) {
                    if(value.length<5 || value.length >15) {
                         if(value.length == 0){
                            empty_codeword = true
                            return true
                         }else{
                            validatinglength = true
                            return true
                         }
                    }
                    var tests = /[A-Za-z]/.test(value.toUpperCase())
                    if(!tests) {
                        validatecodeword = true
                        return true
                    }
                    if(value.includes(' ')){
                        codeword_space = true
                        return true
                    }
                    for(var i = 0; i < codewords.length; i++) {
                        for(var j = i; j < codewords.length; j++) {
                            if(i != j && codewords[i].toUpperCase() === codewords[j].toUpperCase()) {
                                codeword_duplicates = true
                                return true 
                            }
                        }
                    }
                });
                if(codeword_duplicates){
                    return res.status(200).json({ data: 'Uploaded excel has duplicates codewords!! Please choose another excel file!!', count: false })
                }else if(empty_codeword){
                    return res.status(200).json({ data: 'Uploaded excel sheet has empty data or empty cell!!', count: false })
                }
                else if(validatinglength){
                    return res.status(200).json({ data: 'Codewords in the uploaded set has less than 5 characters!!', count: false })
                }else if(validatecodeword){
                    return res.status(200).json({ data: 'Uploaded excel has special characters or numbers but it should have only characters.', count: false })
                }else if(codeword_space){
                    return res.status(200).json({ data: 'Uploaded excel has codeword with space!! space in the codeword should not be allowed!!', count: false })
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
