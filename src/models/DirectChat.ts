import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IDirectChat {
  users: Types.ObjectId[];
  messages: Types.ObjectId[];
  creator: Types.ObjectId;
  organization: Types.ObjectId;
  status: Status;
}

//this is the Structure of the direct chat
const directChatSchema = new Schema<
  IDirectChat,
  Model<IDirectChat>,
  IDirectChat
>({
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
      ref: 'DirectChatMessage',
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

export const DirectChat = model<IDirectChat>('DirectChat', directChatSchema);

export default DirectChat;
