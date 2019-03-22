/**
 * @author Sreelekha Vijaya <S531382@nwmissouri.edu>
 */

const _ = require('lodash');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var Codewordset = require('../model/model.codewordset');
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
let XLSX = require('xlsx')
let addcodewords = (req, res) => {
     var codewords = [];
    var body = _.pick(req.body,['CodeWordSetName','Codewords']);
    codewords = body.Codewords;
    codewords = _.map(codewords, function(codeword){
        return {
            CodeWordSetName: req.body.CodeWordSetName,
            Codeword: codewords
        }
    })
    CodeWord.insertMany(codewords).then((user) => {
        if (user)
            return res.json({ code: 200, message: true });
    }).catch((e) => {
        console.log(e);
        return res.json({ code: 400, message: e });
    })
}
module.exports.addcodewords = addcodewords;

let getCodewords = (req,res) => {
    var body = _.pick(req.body,['CodeWordSetKey']);
    Codewordset.findOne({CodeWordSetName : body.CodeWordSetKey}).then((codewordset) => {
        var codewordsjson = [];
        if (codewordset)
        {   
            _.forEach(codewordset.Codewords, (value) =>{
                var codeword = new Object()
                codeword.CodewordName = value;
                codewordsjson.push(codeword);    
            })
            console.log(codewordsjson)
            return res.json({ code: 200, codewords: codewordset.Codewords, isPermanent: codewordset.isPermanent});
        }
        })
}
module.exports.getCodewords = getCodewords;

let updatecodeword=(req,res) =>{
    var body = _.pick(req.body,['CodeWordSetKey','updatedCodewords']);  
    Codewordset.updateOne({CodeWordSetName: body.CodeWordSetKey}, { $set: { "Codewords" : body.updatedCodewords }}).then((updatecodeword) => {
        return res.json({ code: 400, message:true})
    }).catch((e) => {
        return res.json({ code: 400, message: 'Codeword is not updated' });
    })
}

module.exports.updatecodeword=updatecodeword;

let deleteCodewords=(req,res) =>{
    var body = _.pick(req.body,['CodeWordSetName','Codeword']);  
    CodeWord.deleteOne({Codeword: body.Codeword}, function(err,deleteCodewords){
        if(err){
            return res.json({ code:200, message:'Deletion of codewords'});
        }
        return res.json({ code: 400, message:true})
    })
}

module.exports.deleteCodewords=deleteCodewords;