/**
 * @author Sravya Kancharla <S531500@nwmissouri.edu>
 */
// This is Course model 
var mongoose = require('mongoose');
var validator = require('validator');

var CourseModel = mongoose.model('courseModel', {
    courseNameKey: {
    type: String,
    required: true,
    trim: true,
    unique:true,
    minlength: 3
   },
   emailKey:{
    type: String,
    required: true,
    minlength: 3
   },
   codeWordSetName:{
    type: String,
    required: true,
    minlength: 5
   },
   Startdate: {
    type: String,
    required: true,
    minlength: 5
   },
   Enddate: {
    type: String,
    required: true,
    minlength: 5
   },
   PreSurveyURL: {
    type: String
   },
   PostSurveyURL: {
    type: String
   },
   oldCodewords: {
    type: Array,
    required: true
   }
});

module.exports.CourseModel = CourseModel
