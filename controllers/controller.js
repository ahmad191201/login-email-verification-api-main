const nodemailer = require("nodemailer");
const fs = require("fs");

const sendOtp = async (req, res, next) => {
  console.log(req.query.email)
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'untukkebaikan28@gmail.com',
        pass: 'ahmadal819'
    }
  });
  
  const otpCode = generateOTP();
  var mailOptions = {
      from: 'untukkebaikan28@gmail.com',
      to: req.query.email,
      subject: 'Login Verification',
      text: 'Login Verification',
      html: `This is your login otp ${otpCode}`
  };

  transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
          console.log(error);
          transporter.close();
          return res.json({ error: true, status: 500, message: error})
      } else {
          console.log('Message sent: ' + info.response);
          transporter.close();
          fs.writeFileSync("./data.json", JSON.stringify({email: mailOptions.to, otpCode: otpCode, isValid: true}, null, 4), (err) => {
            if (err) {  console.error(err);  return; };
            console.log("File has been created");
          });
          return res.json({ error: false, status: 200, message: 'email sent'})
      }
  });
};

const verificationOtp = (req, res) => {
  var obj;
  fs.readFile('./data.json', 'utf8', function (err, data) {
    if (err) throw err;
    obj = JSON.parse(data);
    console.log(obj)
    console.log(req.query.email, req.query.otpCode)
    if(obj.email == req.query.email && obj.otpCode == req.query.otpCode && obj.isValid) {
      fs.writeFileSync("./data.json", JSON.stringify({email: obj.email, otpCode: obj.otpCode, isValid: false}, null, 4), (err) => {
        if (err) {  console.error(err);  return; };
        console.log("File has been created");
      });
      return res.json({ error: false, status: 200, message: 'success verification login'})
    } else if (!obj.isValid) {
      return res.json({ error: true, status: 500, message: 'otp code expired or already used'})
    } else{
      return res.json({ error: true, status: 500, message: 'otp code incorrect'})
    }
  });
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000);
}

module.exports = {
    sendOtp,
    verificationOtp
};
