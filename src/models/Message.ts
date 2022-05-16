import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IMessageSchema {
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  createdAt: Date;
  creator: Types.ObjectId;
  group: Types.ObjectId;
  status: Status;
}

const messageSchema = new Schema<
  IMessageSchema,
  Model<IMessageSchema>,
  IMessageSchema
>({
  text: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: false,
  },
  videoUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: () => new Date(Date.now()),
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  group: {
    type: Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
});

export const Message = model<IMessageSchema>('Message', messageSchema);

export default Message;
