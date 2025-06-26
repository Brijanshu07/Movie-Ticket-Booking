import sendEmail from "../nodeMailer.js";

sendEmail({
  to: "brijanshuchauhan7011@gmail.com",
  subject: "Manual Email Test",
  body: "<p>This is a manual test.</p>",
});
