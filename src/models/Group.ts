import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IGroup {
  title: string;
  description?: string;
  createdAt?: Date;
  organization: Types.ObjectId;
  status: Status;
  admins: Types.ObjectId[];
}

const groupSchema = new Schema<IGroup, Model<IGroup>, IGroup>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: () => new Date(Date.now()),
  },
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
});

export const Group = model<IGroup>('Group', groupSchema);

export default Group;
