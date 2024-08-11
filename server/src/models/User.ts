import { Document, model, Schema } from 'mongoose';

// Interface for the links object
interface LinksObj {
  github: string;
  linkedIn: string;
  portfolio: string;
  twitter: string;
  leetcode: string; 
}

// Main user interface extending Mongoose Document
interface IUser extends Document {
  clerkUserId: string;
  firstName: string;
  lastName?: string;
  profileUrl?: string;
  email: string;
  collegeName?: string;
  location?: string;
  links: LinksObj;
}

// Schema for the links object
const LinksSchema = new Schema<LinksObj>({
  github: { type: String, default: '' },
  linkedIn: { type: String, default: '' },
  portfolio: { type: String, default: '' },
  twitter: { type: String, default: '' },
  leetcode: { type: String, default: '' },
}, { _id: false }); // _id: false to prevent creating an _id for this subdocument

// Schema for the User
const UserSchema = new Schema<IUser>({
  clerkUserId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, default: '' }, 
  profileUrl: { type: String},
  email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
  collegeName: { type: String, default: '' }, 
  location: { type: String, default: '' }, 
  links: { type: LinksSchema, default: {} }, 
}, {
  timestamps: true, 
});

// Create and export the User model
export const User = model<IUser>('User', UserSchema);
export type {LinksObj};
