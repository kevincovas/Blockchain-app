// Send Email
const sendEmail = async () => {

  const mailjet = require("node-mailjet").connect(
    "d1280878f3cb52d5c406cc6c4009d1d3",
    "4e000ea74e8233bfbe68ee08770edbf4"
  );
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "aitor.java@gmail.com",
          Name: "Aitor",
        },
        To: [
          {
            Email: "aitor.java@gmail.com",
            Name: "Aitor",
          },
        ],
        Subject: "Greetings from Mailjet.",
        TextPart: "My first Mailjet email",
        HTMLPart:
          "<h3>Dear passenger 1, welcome to <a href='Mailjet - Email Delivery Service for Marketing & Developer Teams'>Mailjet</a>!</h3><br />May the delivery force be with you!",
        CustomID: "AppGettingStartedTest",
      },
    ],
  });
  request
    .then((result) => {
      return result.body;
    })
    .catch((err) => {
      return err.statusCode;
    });

}

module.exports = {
  sendEmail,
};