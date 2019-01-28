/**
 * @author Sravya Kancharla <S531500@nwmissouri.edu>
 */
var { CourseStudentModel } = require('../model/model.coursestudent');

 let getstudentDetails = (req,res) => {
    var body = _.pick(req.body,['EmailKey']);
    courseStudentModel.findOne({EmailKey: body.EmailKey}), function (err, course) {
            if(err){
                return res.json({ code: 200, message: 'Course Student not exist'});
            }
            return course;
        }
    } 
module.exports.getstudentDetails = getstudentDetails;

let getstudentcodeword=(req,res) =>{
    CourseStudentModel.find({EmailKey: req.session.email }, function(err,getstudentcodeword){
    if(err){
        return res.json({ code:200, message:'EmailKeys are fetched'});
    }
        if (getstudentcodeword)
        {
            return res.json({ code: 200, data: getstudentcodeword });
            // CourseModel.find({CourseNameKey: getstudentcodeword[0].CourseNameKey}, function(err,getstudentcodeword){
            // if(err){
            //     return res.json({ code:200,message:'URL is fetched'});
            // }
            // })
        }
    })
}
module.exports.getstudentcodeword=getstudentcodeword;
