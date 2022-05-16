import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IGroupChatMessage {
  groupChatMessageBelongsTo: Types.ObjectId;
  sender: Types.ObjectId;
  createdAt: Date;
  messageContent: string;
  status: Status;
}

const groupChatMessageSchema = new Schema<
  IGroupChatMessage,
  Model<IGroupChatMessage>,
  IGroupChatMessage
>({
  groupChatMessageBelongsTo: {
    type: Schema.Types.ObjectId,
    ref: 'GroupChat',
    required: true,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  messageContent: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
});

export const GroupChatMessage = model<IGroupChatMessage>(
  'GroupChatMessage',
  groupChatMessageSchema
);

export default GroupChatMessage;
