/**
 * @author Sravya Kancharla <S531500@nwmissouri.edu>
 */
const _ = require('lodash');
const bcrypt = require('bcryptjs');
var async = require("async");
var { CourseStudentModel } = require('../model/model.coursestudent');
var { CourseModel } = require('../model/model.course');
var { mongoose } = require('./../config/database')
var mailController = require('../config/user.mail.js')
let XLSX = require('xlsx')

let addCourse = (req,res) => {
    var body = _.pick(req.body,['courseNameKey',
    'codeWordSetName','startDate','endDate','preSurveyURL','postSurveyURL']);
    var courseModel = new CourseModel({
courseNameKey : body.courseNameKey,
emailKey: req.session.email,
codeWordSetName: body.codeWordSetName,
Startdate: body.startDate,
Startdate: body.startDate,
Enddate: body.endDate,
PreSurveyURL: body.preSurveyURL,
PostSurveyURL: body.postSurveyURL,
oldCodewords: []
});
    courseModel.save().then((course) => {
        if(course)
        return res.status(200).json({ message: "Course created successfully.", data: course});
    }).catch((error) => {
        if (error.name === 'MongoError' && error.code === 11000) {
            return res.status(403).json({message:'There was a duplicate course error'});
        }
        return res.status(403).json({ message:error.message});
    })
}
module.exports.addCourse = addCourse;

let getCourses = (req,res) => {
    CourseModel.find({emailKey: req.session.email}, function (err, courses) {
        if (courses) {
            async.forEach(courses, function(course, callback,index){
                CourseStudentModel.find({$and: [{CourseNameKey: course.courseNameKey}, {courseCreater: req.session.email}]}, function (err, courseStudents){
                    console.log(courseStudents);
                    courses[index]['courseStudent'] = courseStudents;
                    callback();
                })
            });
            console.log(courses)
            return res.json({ code: 200, data: courses });
        }
        }).catch((e) => {
        return res.json({ code: 400, message: e });
        })
}
module.exports.getCourses = getCourses;

let deleteCourse=(req,res) =>{
    var body = _.pick(req.body,['CourseNameKey']);  
    CourseModel.deleteOne({courseNameKey: body.CourseNameKey,emailKey: req.session.email }, function(err,deletecourse){
        if(err){
            return res.json({ code:200, message:'Deletion of course'});
        }
        CourseStudentModel.remove({courseNameKey: body.courseNameKey, courseCreater: req.session.email}, function(err, deleteCourseStudent){
            if(err){
                return res.json({ code:200, message:'Error in delete Course Student'});
            }   
            return res.json({ code: 400, message:true})
        })
        
    })
}

module.exports.deleteCourse=deleteCourse;

let updateCourse=(req,res) =>{
    var body = _.pick(req.body,['id','Startdate','Enddate','PreSurveyURL','PostSurveyURL']);  
        CourseModel.updateOne({_id: body.id}, { $set: { "Startdate" : new Date(body.Startdate) && new Date(body.Startdate).toISOString().split('T')[0],"Enddate":new Date(body.Enddate) && new Date(body.Enddate).toISOString().split('T')[0] , "PreSurveyURL":body.PreSurveyURL, "PostSurveyURL": body.PostSurveyURL } }, function(err,updatecoursestudent){
        if(err){
            return res.json({ code:200, message:err});
        }
        return res.json({ code: 400, message:true})
    })
}
module.exports.updateCourse = updateCourse;
