const emailer = require("./Services/emailService");
const dotenv = require("dotenv");
const express = require("express");
const app = express();

// Config Dotenv
dotenv.config();
app.use(express.json());

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
