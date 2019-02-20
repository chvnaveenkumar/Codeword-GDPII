/**
 * @author Sravya Kancharla <S531500@nwmissouri.edu>
**/
var { CourseStudentModel } = require('../model/model.coursestudent');

 let getstudentDetails = (req,res) => {
     var email = req.session.email.charAt(0).toUpperCase() + req.session.email.slice(1)
    CourseStudentModel.find({EmailKey: email}).then((studentcourses) => {
            if(!studentcourses){
                return res.json({ code: 200, message: 'Courses not exist'});
            }
            if (studentcourses === undefined || studentcourses.length === 0 ) {
                return res.json({ code: 400 ,data: 'No courses found'});
            }
            return res.json({ code: 400 ,data: studentcourses});
        })
    }
module.exports.getstudentDetails = getstudentDetails;
