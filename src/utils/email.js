var nodemailer = require("nodemailer");
var Promise = require("bluebird");

var transporter = nodemailer.createTransport({
    service: 'Outlook',
    auth: {
        user: 'dukecs308@outlook.com',
        pass: 'Potato123'
    }
});

var mailOptions = {
    from: 'Duke CS308 ✔ <dukecs308@outlook.com>', // sender address
    to: '',
    subject: '',
    text: '',
    html: ''
};

module.exports = {
    sendMail: function(mailText) {
        return new Promise(function(resolve, reject) {
            mailText.from = mailOptions.from;

            transporter.sendMail(mailText, function(error, info){
                if(error){
                    console.log(error);
                    reject(error);
                }
                else{
                    console.log('Message sent: ' + info.response);
                    resolve(info);
                }
            });
        });
    }
};