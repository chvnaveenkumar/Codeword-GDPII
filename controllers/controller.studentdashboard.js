/**
 * @author Sravya Kancharla <S531500@nwmissouri.edu>
**/
var { CourseStudentModel } = require('../model/model.coursestudent');

 let getstudentDetails = (req,res) => {
    var body = _.pick(req.body,['EmailKey']);
    CourseStudentModel.findOne({EmailKey: body.EmailKey}), function (err, studentcourses) {
            if(err){
                return res.json({ code: 200, message: 'Course Student not exist'});
            }
            return studentcourses;
        }
    } 
module.exports.getstudentDetails = getstudentDetails;
