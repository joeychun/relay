import UserModel from "../models/User";
import nodemailer from "nodemailer";
import { NUM_PROBLEMS, Team, TypedRequestQuery, User } from "../../shared/apiTypes";
import { transporter } from "../server";

export type MailData = {
  subject: string;
  text: string;
  html: string;
};

async function sendMail(user: User, data: MailData) {
  console.log(process.env.GMAIL_USERNAME, process.env.GMAIL_PSW);
  if (!user.email) {
    throw new Error("No email found for user.");
  }
  const mailOptions = {
    from: process.env.GMAIL_USERNAME,
    to: user.email,
    subject: data.subject,
    text: data.text,
    html: data.html,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      throw new Error("Something went wrong while sending mail.");
    }
  });
}

export async function alertTurn(user: User) {
  const subject = "It's time to solve!";
  const text = `Hi ${user.name ?? "there"} from the Relay Game! It's your turn to start solving the Relay problem of the day!`;
  const html =
    '<p>Click <a href="https://daily-relay-81cc9e531698.herokuapp.com/problem">here</a> to start solving.</p>';
  await sendMail(user, { subject, text, html });
}

export async function alertSendback(user: User) {
  const subject = "Take another look";
  const text = `Hi ${user.name ?? "there"} from the Relay Game! Your teammate is asking you to double check your answers.`;
  const html =
    '<p>Click <a href="https://daily-relay-81cc9e531698.herokuapp.com/problem">here</a> to double check.</p>';
  await sendMail(user, { subject, text, html });
}
