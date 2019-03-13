/**
 * @author Sravya Kancharla <S531500@nwmissouri.edu>
**/
var { CourseStudentModel } = require('../model/model.coursestudent');
var { CourseModel } = require('../model/model.course');
const _ = require('lodash');

let getstudentDetails = (req,res) => {
    var email = req.session.email.charAt(0).toLowerCase() + req.session.email.slice(1)
   CourseStudentModel.find({EmailKey: email}).then((studentcourses) => {
           if(!studentcourses){
               return res.json({ code: 200, message: 'Courses not exist'});
           }
           if (studentcourses === undefined || studentcourses.length === 0 ) {
               return res.json({ code: 400 ,data: 'No courses found'});
           }
           return res.json({code: 400, data:studentcourses});
       })
   }
module.exports.getstudentDetails = getstudentDetails;

let updateAcknowledged=(req,res) =>{
    var body = _.pick(req.body,['acknowledgedStatus']);
    CourseStudentModel.update({CourseNameKey: body.acknowledgedStatus.courseInfo.courseNameKey, courseCreater: body.acknowledgedStatus.courseInfo.emailKey, EmailKey: req.session.email}, { $set: { Acknowledged : true } }, function(err,updatecoursestudent){
        if(err){
            return res.json({ code:200, message:false});
        }
        console.log(updatecoursestudent);
        return res.json({ code: 400, message:true})
    })
}
module.exports.updateAcknowledged = updateAcknowledged;

let getCourseDetails = (req,res) => {
    var body = _.pick(req.body,['courseName','courseCreater','codeword','ack']);
    CourseModel.find({courseNameKey: req.body.courseName, emailKey: req.body.courseCreater}, function (err, courseinfo) {
            return res.json({ code: 200, data: courseinfo, codeword:  req.body.codeword, Acknowledged: req.body.ack});
        }).catch((e) => {
        return res.json({ code: 400, message: e });
        })
}
module.exports.getCourseDetails = getCourseDetails;



