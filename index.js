const emailer = require("./Services/emailService");
const handlebars = require("express-handlebars");
const dotenv = require("dotenv");
const express = require("express");
const app = express();
const path = require("path");

// Config Dotenv
dotenv.config();
app.use(express.json());

// Setup View Engine
app.engine(".hbs", handlebars.engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", "./Views");

// Email route
app.post("/send-email", (req, res) => {
  const { from, to, subject, name, role, message } = req.body;

  if (!from || !to || !subject || !message)
    return res
      .status(400)
      .json({ message: "Please provide all the required fields!" });

  emailer(from, to, subject, name, role, message)
    .then((info) => {
      res.status(200).json({
        message: "Eamil sent successfully!",
        messageId: info.messageId,
      });
    })
    .catch((error) => {
      res.status(400).send(error.message);
    });
});

// PORT to run the server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});
