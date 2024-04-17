import { Schema, Types, model, Document } from "mongoose";

const UserSchema = new Schema({
  name: String,
  googleid: String,
  cookieToken: String,
});

export interface User extends Document {
  name: string;
  googleid: string;
  _id: string;
  cookieToken: string;
}

const UserModel = model<User>("User", UserSchema);

export default UserModel;
