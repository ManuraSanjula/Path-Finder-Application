const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Manura Sanjula <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async send(text, subject) {
    const mailOptions = {
      from: 'w.m.manurasanjula2003@gmail.com',
      to: this.to,
      subject,
      html,
      text
    };
    await this.newTransport().sendMail(mailOptions);
  }
};