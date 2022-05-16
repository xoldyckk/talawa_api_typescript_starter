import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IGroupChat {
  title: string;
  users: Types.ObjectId[];
  messages?: Types.ObjectId[];
  creator: Types.ObjectId;
  organization: Types.ObjectId;
  status: Status;
}

const groupChatSchema = new Schema<IGroupChat, Model<IGroupChat>, IGroupChat>({
  title: {
    type: String,
    required: true,
  },
  users: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  ],
  messages: [
    {
      type: Schema.Types.ObjectId,
      ref: 'GroupChatMessage',
    },
  ],
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
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
});

export const GroupChat = model<IGroupChat>('GroupChat', groupChatSchema);

export default GroupChat;
