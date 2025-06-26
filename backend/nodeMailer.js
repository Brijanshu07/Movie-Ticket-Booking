import dotenv from "dotenv";
dotenv.config();
import nodemailer from "nodemailer";

// const user = process.env.SMTP_USER;
// const pass = process.env.SMTP_PASS;

// console.log("SMTP creds:", user, pass);

// const sendEmail = async ({ to, subject, body }) => {
//   console.log("SMTP creds:", user, pass); // 👈 Should now print correctly

//   const transporter = nodemailer.createTransport({
//     host: "smtp-relay.brevo.com",
//     port: 587,
//     auth: {
//       user,
//       pass,
//     },
//   });
//   console.log("transporter", transporter);
//   try {
//     const response = await transporter.sendMail({
//       from: process.env.SENDER_EMAIL,
//       to,
//       subject,
//       html: body,
//     });

//     console.log("Email sent successfully:", response.messageId || response);
//     return response;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     throw error;
//   }
// };

// export default sendEmail;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;
// console.log("SMTP creds:", user, pass);
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user,
    pass,
  },
});
// console.log("Smtp cre:", process.env.SMTP_USER);
const sendEmail = async ({ to, from, subject, body }) => {
  const response = await transporter.sendMail({
    from: process.env.SENDER_EMAIL,
    to,
    subject,
    html: body,
  });
  return response;
};

export default sendEmail;
