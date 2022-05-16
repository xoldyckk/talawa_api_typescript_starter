import { Schema, Types, model, Model } from 'mongoose';

interface IChat {
  message: string;
  languageBarrier?: boolean;
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  createdAt: Date;
}

const chatSchema = new Schema<IChat, Model<IChat>, IChat>({
  message: {
    type: String,
    required: true,
  },
  languageBarrier: {
    type: Boolean,
    required: false,
    default: false,
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now()),
  },
});

export const Chat = model<IChat>('MessageChat', chatSchema);

export default Chat;
