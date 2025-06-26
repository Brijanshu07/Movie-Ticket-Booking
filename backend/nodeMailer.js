import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// console.log("hello");

// const sendEmail = async ({ to, subject, body }) => {
//   // console.log("Sending email to:", to);
//   const response = await transporter.sendMail({
//     from: process.env.SENDER_EMAIL,
//     to,
//     subject,
//     html: body,
//   });
//   return response;
// };

const sendEmail = async ({ to, subject, body }) => {
  // console.log("Sending email to:", to); // 👈 Ensure function is called

  try {
    const response = await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html: body,
    });

    // console.log("Email sent successfully:", response.messageId || response);
    return response;
  } catch (error) {
    // console.error("Error sending email:", error); // 👈 Catch all errors
    throw error; // Optional: Let it bubble up if needed
  }
};
export default sendEmail;
