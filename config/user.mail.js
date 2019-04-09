/**
 * @author Naveen Kumar Chandaluri <S530742@nwmissouri.edu>
 */
const nodemailer = require('nodemailer');
const _ = require('lodash');
var sendMail = function (email, temp_password) {
    var jwt = require('jsonwebtoken');
    var decodedvalue = "";
    var decodeJson="";
    nodemailer.createTestAccount((err, account) => {
    var newToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InM1MzA3NDJAbndtaXNzb3VyaS5lZHUiLCJwYXNzd29yZCI6Ik4wMjI1MTljIiwiaWF0IjoxNTU0ODQzNDY1LCJleHAiOjE1NjM0ODM0NjV9._932sKuPEAaPEhFfWA1NfQxIh6KlW6jUD4RPvmKjr_w';
    jwt.verify(newToken, 'donttry', (err, decoded, res) =>{
        if(err)
        {
            console.log(err);
        }
        decodedvalue = JSON.stringify(decoded);
        decodeJson = JSON.parse(decodedvalue);
        
        let transporter = nodemailer.createTransport({
            host: 'smtp.office365.com',
            port: 587,
            secure: false, 
            auth: {
                user: decodeJson.email,
                pass: decodeJson.password
            }
        });
    
        let mailOptions = {
            from: "CodeWord App",
            to: email,
            subject: 'CodeWord Temporary Password',
            text: 'Hello, '+ email,
            html: '<b>Your new temporary Password: </b>'+ temp_password // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
            console.log("sent mail");
        });
    });
});
}

module.exports.sendMail = sendMail;
