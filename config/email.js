const nodemailer = require('nodemailer');

const smtpTransport = nodemailer.createTransport({
    service: "google",
    auth: {
        user: "todayworkoutcomplete@gmail.com",
        pass: "dblab!23"
    },
    tls: {
        rejectUnauthorized: false
    }
  });

  module.exports={
      smtpTransport
  }