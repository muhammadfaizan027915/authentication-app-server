const emailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");

module.exports = (from, to, subject, name, role, message) => {
  const transport = emailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASS,
    },
  });

  transport.use(
    "compile",
    hbs({
      viewEngine: {
        extname: ".handlebars",
        partialsDir: "./Views",
        defaultLayout: false,
      },
      viewPath: "./Views",
      extname: ".handlebars",
    })
  );

  return transport.sendMail({
    subject,
    envelope: {
      from: `${from} <${from}>`,
      to: `${to} <${to}>`
    },
    template: "index",
    context: {
      name,
      role,
      message,
    },
  });
};
