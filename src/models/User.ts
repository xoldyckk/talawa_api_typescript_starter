import validator from 'validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

enum UserType {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPERADMIN = 'SUPERADMIN',
}

interface IUser {
  image: string;
  tokenVersion: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  appLanguageCode: string;
  createdOrganizations: Types.ObjectId[];
  createdEvents: Types.ObjectId[];
  userType: UserType;
  joinedOrganizations: Types.ObjectId[];
  registeredEvents: Types.ObjectId[];
  eventAdmin: Types.ObjectId[];
  adminFor: Types.ObjectId[];
  membershipRequests: Types.ObjectId[];
  organizationsBlockedBy: Types.ObjectId[];
  status: Status;
  organizationUserBelongsTo: Types.ObjectId;
  pluginCreationAllowed: boolean;
}

const userSchema = new Schema<IUser, Model<IUser>, IUser>({
  image: {
    type: String,
  },
  tokenVersion: {
    type: Number,
    default: 0,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    validate: [validator.isEmail, 'invalid email'],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  appLanguageCode: {
    type: String,
    default: 'en',
    required: true,
  },
  createdOrganizations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  ],
  createdEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
  userType: {
    type: String,
    enum: ['USER', 'ADMIN', 'SUPERADMIN'],
    default: UserType.USER,
    required: true,
  },
  joinedOrganizations: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  ],
  registeredEvents: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
  eventAdmin: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
  adminFor: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  ],
  membershipRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MembershipRequest',
    },
  ],
  organizationsBlockedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Organization',
    },
  ],
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
  organizationUserBelongsTo: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
  },
  pluginCreationAllowed: {
    type: Boolean,
    required: true,
    default: true,
  },
});

// @ts-ignore
userSchema.plugin(mongoosePaginate);
export const User = model<IUser>('User', userSchema);

export default User;
