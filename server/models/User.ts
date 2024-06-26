import { Schema, Types, model, Document } from "mongoose";

const UserSchema = new Schema({
  name: String,
  email: String,
  googleid: String,
  cookieToken: String,
  isAdmin: Boolean,
});

export interface User extends Document {
  name: string;
  email: string;
  googleid: string;
  _id: string;
  cookieToken: string;
  isAdmin: boolean;
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
