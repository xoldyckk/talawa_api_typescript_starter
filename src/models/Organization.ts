import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IOrganization {
  apiUrl?: string;
  image?: string;
  name: string;
  description: string;
  location?: string;
  isPublic: boolean;
  creator: Types.ObjectId;
  status: Status;
  members?: Types.ObjectId[];
  admins: Types.ObjectId[];
  groupChats?: Types.ObjectId[];
  posts?: Types.ObjectId[];
  membershipRequests?: Types.ObjectId[];
  blockedUsers?: Types.ObjectId[];
  visibleInSearch?: boolean;
  createdAt: Date;
}

const organizationSchema = new Schema<
  IOrganization,
  Model<IOrganization>,
  IOrganization
>({
  apiUrl: {
    type: String,
  },
  image: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
  members: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  groupChats: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Message',
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  membershipRequests: [
    {
      type: Schema.Types.ObjectId,
      ref: 'MembershipRequest',
    },
  ],
  blockedUsers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  visibleInSearch: Boolean,
  createdAt: {
    type: Date,
    default: () => new Date(Date.now()),
  },
});

export const Organization = model<IOrganization>(
  'Organization',
  organizationSchema
);

export default Organization;
