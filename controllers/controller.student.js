/**
 * @author Sravya Kancharla <S531500@nwmissouri.edu>
 */

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