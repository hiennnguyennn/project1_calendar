var router = require("express").Router();

var mongo = require('../database/db');
mongo.connectToServer();
var twilio = require('twilio');

var client = new twilio('AC4055868cc357a597b324301d3aafe907', '3286b135a8b7fee9bd1029d77638adf7');
var config = require('../configuration/config')

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'null.4207.01@gmail.com',
        pass: 'hien2304'
    }
});


function send_email(taikhoan, matkhau) {
    var mailOptions = {
        from: 'null.4207.01@gmail.com',
        to: taikhoan,
        subject: 'This is your new password:',
        text: matkhau
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function set_send_message(){
    db = mongo.getDb();
    db.collection('event').find({}).toArray(function(err, result) {
        if (err) throw err;
        for (let i = 0; i < result.length; i++){
            var event = result[i];
            var now = new Date();
            var timeout = new Date(event.start) - now;
            if (timeout < 0) {
                continue;
            }
            var user = db.collection('account').findOne({"username": event.username},
                function(err, user) {
                    if (err) throw err;
                    if(user){
                    if(user.phone){
                            let fromPhone = '+14439988431';
                            let toPhone = user.phone;
                            if(toPhone != 'undefined'){
                                if (toPhone[0] == '0'){
                                    toPhone = '+84' + toPhone.substr(1);
                                }
                                let content = 'Reminder** You have an upcoming event: ' + event.title;
                                function sendsms(){
                                    client.messages.create({
                                      to: toPhone,
                                      from: fromPhone,
                                      body: content
                                    });
                                }
                                setTimeout(sendsms, timeout);
                            }  
                        } 

                    }
                }
            );  
            // console.l
        }
    });

}

router.post("/settime", function(req, res) {
    set_send_message();
})


router.post('/send', function(req, res) {
    var username = req.body.username
    var pwd = req.body.password;
    var query = {"username": username};
    db = mongo.getDb();
    db.collection("account").find(query).toArray(function(err, result) {
        if (err) throw err;
        if (result.length != 0) {
            send_email(result[0].email, 'Your new password: ' + pwd)
            res.send({"status": true, "message": 'Please check your mailbox to get a new password!', color: 'red' })
        } else {
            res.send( {"status": false, "message": 'Error, username does not exist', color: 'red' })
        }
    })
});

module.exports = router;

