/**
 *  @author Srimai Reddy Yanala <s531384@nwmissouri.edu>
  */
// This is codewordset model
var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var codeWordSetSchema = new Schema({
        CodeWordSetName: {
                type: String,
                require: true,
                minlength: 5,
                unique:true
        },
        CodeWordCreator: {
                type: String,
                required: true,
        },
        isPermanent : {
                type: Boolean,
                default : false
        },
        Codewords: {
                type: Array,
                required: true
        }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('CodeWordSet', codeWordSetSchema);

