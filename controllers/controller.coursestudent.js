const _ = require('lodash');
var { CourseStudentModel } = require('../model/model.coursestudent');
var { mongoose } = require('./../config/database')
var Codewordset = require('../model/model.codewordset');
let XLSX = require('xlsx')
var { CourseModel } = require('../model/model.course');
const fs = require('fs');
let xlsx2json = require('xlsx2json'); // added by Ujjawal Kumar
multer = require('multer')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './data')
    },
    filename: function (req, file, cb) {
        cb(null, 'student.xlsx')
    }
})

var upload = multer({ storage: storage }).single('file')

// Fetching data from uploaded xls file is added by Ujjawal Kumar
let getDataStudentXLSX = (req, res) => {
    upload(req, res, function (err) {
        if (req && (!req.file || req.file.size == 0)) {
            return res.status(500).json({ message: "Please provide proper file." });
        }
        xlsx2json("./data/student.xlsx",
            {
                // dataStartingRow: 2, (This would be required if header would be required in the cordword sheet which would be uploaded by the Instructor)
                //A, B , C , E is from the input sheet row numbers
                mapping: {
                    'email': 'A',
                    'name': 'B'
                }
            }).then(jsonArray => {
                var emails = _.map(jsonArray[0],'email')
                emails.splice(0,1)
                var checking_emails = true
                var email_duplicates = false
                var email_validation_row = false
                var name_validation_row = false
                _(emails).forEach(function(value,index) {
                    if(value.length === 0 || !(value.includes("@"))) {
                         checking_emails = false
                         email_validation_row = index 
                         return false
                    }
                    for(var i = 0; i <= emails.length; i++) {
                        for(var j = i; j <= emails.length; j++) {
                            if(i != j && emails[i] == emails[j]) {
                                email_duplicates = true
                                return false 
                            }
                        }
                    }
                }); 
                var names = _.map(jsonArray[0],'name')
                names.splice(0,1)
                var checking_names = true
                _(names).forEach(function(value, index) {
                    if(value.length === 0 || value.length < 3 || value.length > 40) {
                         checking_names = false
                         name_validation_row = index
                         return false
                    }
                });
                if(email_duplicates){
                    return res.status(200).json({ data: 'Duplicates found in uploaded excel!!', status: false })
                }else if(checking_emails === false){
                    return res.status(200).json({ data: 'Student email is not given format in the row '+ (email_validation_row +2), status: false })
                }else if(checking_names === false){
                    return res.status(200).json({ data: 'Student name should be 3-30 characters in the row '+ (name_validation_row+2) , status: false })
                }else{
                    return res.status(200).json({ count: emails.length, status: true })
                }
            })
    })

}
module.exports.getDataStudentXLSX = getDataStudentXLSX;

let addCourseStudent = (req,res) => {
    var codewordslist =[], remainingCodewordList = [];
    var shuffleCodeWords, studetList=[];
    var studentidList=[],studentNameList=[];
    var body = _.pick(req.body,['CourseNameKey','CodeWordSetName','id']);
    if(req.file != undefined){        
        var workbook = XLSX.read(req.file.buffer, {type:"buffer"});
        studetList = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);    
    }    
    Codewordset.find({CodeWordSetName: body.CodeWordSetName}, function (err, CodeWordset) {
        if(err){
            return res.status(200).json({ message: 'CodeWord Set Not found error'});
        }
        codewordslist = CodeWordset[0].Codewords
        
        if(codewordslist.length < studetList.length )
        {
            CourseModel.deleteOne({courseNameKey: body.CourseNameKey,emailKey: req.session.email }, function(err,deletecourse){
                if(err){
                    return res.status(200).json({ code:200, message:'Deletion of course'});
                }
                return res.status(200).json({ code: 400,  message: 'You have '+studetList.length +' students, But the codewordset has only '+ codewordslist.length + ' Codewords.'})
            })
        }else {
            shuffleCodeWords = shuffle(codewordslist);
            for(var i=0;i<studetList.length;i++) {
            var studentData = JSON.parse(JSON.stringify(studetList[i]))
            studentidList.push(studentData[Object.keys(studentData)[0]])
            studentNameList.push(studentData[Object.keys(studentData)[1]])
            }
            for(var j=studetList.length;j<shuffleCodeWords.length;j++) {
                remainingCodewordList.push(shuffleCodeWords[j]);
            }
            var coursestudent=[];
            for(var i=0;i<studentidList.length;i++){
                var courseStudentModel = CourseStudentModel({
                    CourseNameKey: body.CourseNameKey,
                    EmailKey:studentidList[i].charAt(0).toLowerCase() + studentidList[i].slice(1),
                    Codeword:shuffleCodeWords[i],
                    StudentName: studentNameList[i],
                    Acknowledged: false,
                    courseCreater: req.session.email
                });
                coursestudent.push(courseStudentModel);
            }
            CourseModel.updateOne({_id: body.id}, { $set: { "oldCodewords" : remainingCodewordList } }, function(err,updateoldCodewords){
                if(err){
                    return res.json({ code:200, message:err});
                }
            })
            CourseStudentModel.insertMany(coursestudent).then((courseStudent) => {
                return res.status(200).json({message: 'Course student successfully!'})    
            })
            .catch(error => {
                return res.status(403).json({ message:error.message});   
            })                 
        }
    })
}
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }
module.exports.addCourseStudent = addCourseStudent;

let getCourseStudent = (req,res) => {
    var body = _.pick(req.body,['CourseNameValue']);
    let AcknowledgedTrue = 0,ackPercent = 0;
    CourseStudentModel.find({$and: [{CourseNameKey: body.CourseNameValue}, {courseCreater: req.session.email}]}).exec( function (err, count){
        _.forEach(count, function(value) {
            if(value.Acknowledged === true){
                AcknowledgedTrue = AcknowledgedTrue + 1
            }
        });
        ackPercent = (AcknowledgedTrue / count.length) * 100;
        CourseStudentModel.find({$and: [{CourseNameKey: body.CourseNameValue}, {courseCreater: req.session.email}]}).exec(function (err, courseStudents) {
            if(err){
                return res.json({ code: 200, message: 'No courses created!!'});
            }
            if (courseStudents)
                        return res.json({ code: 200, CourseNameValue: body.CourseNameValue,AcknowledgedTrue: AcknowledgedTrue,Acknowledged: ackPercent, totalStudents: count.length, courseStudents });
            })    
    })
}

module.exports.getCourseStudent = getCourseStudent;

let deletecoursestudent=(req,res) =>{
    var body = _.pick(req.body,['CourseNameKey','EmailKey']);  
    CourseStudentModel.deleteOne({CourseNameKey: body.CourseNameKey,EmailKey: body.EmailKey}, function(err,deletecoursestudent){
        if(err){
            return res.json({ code:200, message:'Deletion of the EmailKey'});
        }
        return res.json({ code: 400, message: 'Deleted Student Successfully!'})
    })
}

module.exports.deletecoursestudent=deletecoursestudent;

let updatecoursestudent=(req,res) =>{
    var body = _.pick(req.body,['_id','NewEmailKey','Newstudentkey']);  
        CourseStudentModel.updateOne({_id: body._id}, { $set: { "StudentName" : body.Newstudentkey,"EmailKey":body.NewEmailKey } }, function(err,updatecoursestudent){
        if(err){
            return res.json({ code:200, message:err});
        }
        return res.json({ code: 400, message:true})
    })
}
module.exports.updatecoursestudent=updatecoursestudent;

let addStudent=(req,res) =>{
    var body = _.pick(req.body,['courseName','courseCreater','newStudentEmail','newStudentName','newCodeword','id','remainingCodewords']);  
        CourseStudentModel.insertMany([{
            Acknowledged: false,
            CourseNameKey: body.courseName,
            EmailKey: body.newStudentEmail,
            Codeword: body.newCodeword,
            StudentName: body.newStudentName,
            courseCreater: body.courseCreater
         }]).then((addStudentModel) => {
        if(addStudentModel){
            CourseModel.updateOne({_id: body.id}, { $set: { "oldCodewords" : body.remainingCodewords.slice(1, body.remainingCodewords.length) }}, function(err,updateoldCodewords){
                if(err){
                    return res.json({ code:200, message:err});
                }
            })
            return res.json({ code: 400, message:true})
        }
    }).catch((error) => {
        return res.status(403).json({ message:error.message})
    })
}
module.exports.addStudent=addStudent;