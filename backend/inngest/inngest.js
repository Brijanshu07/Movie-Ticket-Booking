import { Inngest } from "inngest";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Show from "../models/Show.js";
import sendEmail from "../configs/nodeMailer.js";

export const inngest = new Inngest({ id: "ticket-movie-ki-hi" });

//function to save user data
const syncUserCreation = inngest.createFunction(
  {
    id: "sync-user-from-clerk",
  },
  {
    event: "clerk/user.created",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.create(userData);
  }
);
//function to delete user
const syncUserDeletion = inngest.createFunction(
  {
    id: "delete-user-with-clerk",
  },
  {
    event: "clerk/user.deleted",
  },
  async ({ event }) => {
    const { id } = event.data;

    await User.findByIdAndDelete(id);
  }
);

//function to update user
const syncUserUpdation = inngest.createFunction(
  {
    id: "update-user-from-clerk",
  },
  {
    event: "clerk/user.updated",
  },
  async ({ event }) => {
    const { id, first_name, last_name, email_addresses, image_url } =
      event.data;
    const userData = {
      _id: id,
      email: email_addresses[0].email_address,
      name: first_name + " " + last_name,
      image: image_url,
    };
    await User.findByIdAndUpdate(id, userData);
  }
);

const releaseSeatsAndDeleteBooking = inngest.createFunction(
  { id: "release-seats-and-delete-booking" },
  {
    event: "app/checkpayment",
  },
  async ({ event, step }) => {
    const tenMinutesLater = new Date(Date.now() + 10 * 60 * 1000);
    await step.sleepUntil("wait-for-ten-minutes", tenMinutesLater);
    await step.run("check-payment-status", async () => {
      const bookingId = event.data.bookingId;
      const booking = await Booking.findById(bookingId);
      if (!booking.isPaid) {
        const show = await Show.findById(booking.show);
        booking.bookedSeats.forEach((seat) => {
          delete show.occupiedSeats[seat];
        });
        show.markModified("occupiedSeats");
        await show.save();
        await Booking.findByIdAndDelete(booking._id);
      }
    });
  }
);

const sendBookingConfirmationEmail = inngest.createFunction(
  { id: "send-booking-confirmation-email" },
  { event: "app/show.booked" },
  async ({ event, step }) => {
    const { bookingId } = event.data;
    const booking = await Booking.findById(bookingId)
      .populate({
        path: "show",
        populate: {
          path: "movie",
          model: "Movie",
        },
      })
      .populate("user");
    // console.log(booking.user.email);

    await sendEmail({
      to: booking.user.email,
      subject: `Payment Confirmation : "${booking.show.movie.title}" booked `,
      body: ` <div style='font-family: Arial; sans-serif; line-height:1.5'>
      <h2>Hi ${booking.user.name},</h2>
      <p>Your Booking for <strong style="color: #f84565;">${
        booking.show.movie.title
      }</strong>is confirmed.</p>
      <p>
      <strong>Date: </strong> ${new Date(
        booking.show.showDateTime
      ).toLocaleDateString("en-US", { timeZone: "Asia/Kolkata" })} <br/>
      <strong>Time: </strong> ${new Date(
        booking.show.showDateTime
      ).toLocaleTimeString("en-US", { timeZone: "Asia/Kolkata" })} 
      </p>
      <p> Enjoy the show! 🍿 </p>
      <p> Thanks for booking with us! </br> --टिकट मूवी की ही Team</p>
      </div>`,
    });
  }
);

const sendShowRemainders = inngest.createFunction(
  { id: "send-show-reminders" },
  { cron: "0 */8 * * *" },
  async ({ step }) => {
    const now = new Date();
    const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    const windowStart = new Date(in8Hours.getTime() - 10 * 60 * 1000);
    const reminderTasks = await step.run("prepare-reminder-tasks", async () => {
      const shows = await Show.find({
        showTime: {
          $gte: windowStart,
          $lte: in8Hours,
        },
      }).populate("movie");

      for (const show of shows) {
        if (!show.movie || !show.occupiedSeats) continue;
        const userIds = [...new Set(Object.values(show.occupiedSeats))];
        if (userIds.length === 0) continue;
        const users = await User.find({ _id: { $in: userIds } }).select(
          "name email"
        );

        for (const user of users) {
          BackgroundTaskStatus.push({
            userEmail: user.email,
            userName: user.name,
            movieTitle: show.movie.title,
            showTime: show.showTime,
          });
        }
      }
      return tasks;
    });
    if (reminderTasks.length === 0) {
      return { sent: 0, message: "No reminder to send" };
    }
    const results = await step.run("send-all-reminders", async () => {
      return await Promise.allSettled(
        reminderTasks.map((task) =>
          sendEmail({
            to: task.userEmail,
            subject: `Reminder : Your movie "${task.movieTitle}" starts soon! `,
            body: `<p>Bole to picture shuru hone wali hai bhaai</p>`,
          })
        )
      );
    });
    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.length - sent;
    return {
      sent,
      failed,
      message: `Sent ${sent} reminders, failed ${failed} reminders`,
    };
  }
);
// Create an empty array where we'll export future Inngest functions

const sendNewShowNotification = inngest.createFunction(
  {
    id: "send-new-show-notification",
  },
  {
    event: "app/show.added",
  },
  async ({ event }) => {
    const { movieTitle } = event.data;
    const users = await User.find({});
    for (const user of users) {
      const userEmail = user.email;
      const userName = user.name;
      const subject = `New Show Added: ${movieTitle}`;
      const body = `<p>Nayi nayi picture lagi hai. Chalti hai kya 9-12?</p>`;
      await sendEmail({
        to: userEmail,
        subject,
        body,
      });
    }
    return { message: "Notification sent" };
  }
);

export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
  releaseSeatsAndDeleteBooking,
  sendBookingConfirmationEmail,
  sendShowRemainders,
  sendNewShowNotification,
];
