// Send Email
const sendEmail = async (
  from_mail,
  from_name,
  to_mail,
  to_name,
  subject,
  text_part,
  html_part,
  custom_id
) => {
  const mailjet = require("node-mailjet").connect(
    "d1280878f3cb52d5c406cc6c4009d1d3",
    "4e000ea74e8233bfbe68ee08770edbf4"
  );
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: from_mail,
          Name: from_name,
        },
        To: [
          {
            Email: to_mail,
            Name: to_name,
          },
        ],
        Subject: subject,
        TextPart: text_part,
        HTMLPart: html_part,
        CustomID: custom_id,
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
};

module.exports = {
  sendEmail,
};
