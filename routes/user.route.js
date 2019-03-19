var express = require('express');
var router = express.Router();
var usersController = require('../controllers/controller.user')
var courseController = require('../controllers/controller.course')
var codewordsetController = require('../controllers/controller.codewordset')
var codewordController = require('../controllers/controller.codeword')
var courseStudentController = require('../controllers/controller.coursestudent')
var studentController = require('../controllers/controller.studentdashboard')
const bodyParser = require('body-parser');
let multer = require('multer')

router.use(bodyParser.json());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/signup', usersController.signUp);
router.post('/signin', usersController.signIn);
router.post('/details', usersController.details);
router.post('/validateEmail', usersController.validateEmail);
router.post('/sendmail', usersController.tempPassword);
router.post('/changepassword', usersController.changePassword);
router.post('/addnewCourse', courseController.addCourse);
router.get('/getCourseList', courseController.getCourses)
router.post('/getdataxlsx',codewordsetController.getDataFromXLS)
router.post('/deleteCourse', courseController.deleteCourse)
router.post('/addcoursestudent',multer().single('file'), courseStudentController.addCourseStudent)
router.post('/getcoursestudent', courseStudentController.getCourseStudent);
router.post('/deletecoursestudent', courseStudentController.deletecoursestudent);
router.post('/updatecoursestudent', courseStudentController.updatecoursestudent);
router.post('/updateCourse', courseController.updateCourse)

// Codeword Set API calls
router.post('/addcodewordset',codewordsetController.addcodewordset)
router.get('/getcodewordset', codewordsetController.getcodewordset)
router.delete('/deletecodewordset', codewordsetController.deletecodewordset)

// Codewords API calls
router.post('/getCodewords', codewordController.getCodewords)
router.post('/deleteCodewords', codewordController.deleteCodewords)
router.post('/updatecodeword', codewordController.updatecodeword);
router.post('/addnewcodewords', codewordController.addcodewords);

// API calls for student
router.get('/getstudentcourses', studentController.getstudentDetails);
router.post('/getcoursedetails', studentController.getCourseDetails);
router.post('/addstudent', courseStudentController.addStudent);
//Excel sheet validation
router.post('/getdatastudentxlsx', courseStudentController.getDataStudentXLSX);
router.post('/codewordAcknowledged', studentController.updateAcknowledged);

module.exports = router;
