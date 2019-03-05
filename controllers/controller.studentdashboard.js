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
            console.log(studentcourses)
            return res.json({ code: 400 ,data: studentcourses});
        })
    }
module.exports.getstudentDetails = getstudentDetails;

let updateAcknowledged=(req,res) =>{
    var body = _.pick(req.body,['acknowledgedStatus']);
    CourseStudentModel.updateOne({CourseNameKey: body.acknowledgedStatus.CourseNameKey, courseCreater: body.acknowledgedStatus.courseCreater, EmailKey: req.session.email}, { $set: { "Acknowledged" : true } }, function(err,updatecoursestudent){
        if(err){
            return res.json({ code:200, message:false});
        }
        return res.json({ code: 400, message:true})
    })
}
module.exports.updateAcknowledged = updateAcknowledged;

let getCourse = (req,res) => {
    var body = _.pick(req.body,['courseNameKey', 'emailKey']);
    CourseModel.find({courseNameKey: body.courseNameKey, EmailKey: body.emailKey}, function (err, courseDetails) {
            if(courseDetails)
            return res.json({ code: 200, data: courseDetails });
        }).catch((e) => {
        return res.json({ code: 400, message: e });
        })
}
module.exports.getCourse = getCourse;
