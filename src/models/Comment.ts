import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IComment {
  text: string;
  createdAt: Date;
  creator: Types.ObjectId;
  post: Types.ObjectId;
  likedBy: Types.ObjectId;
  likeCount: number;
  status: Status;
}

//this is the Structure of the Comments
const commentSchema = new Schema<IComment, Model<IComment>, IComment>({
  text: {
    type: String,
    required: true,
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
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
});

export const Comment = model<IComment>('Comment', commentSchema);

export default Comment;
