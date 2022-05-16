/* eslint-disable prettier/prettier */

import mongoosePaginate from 'mongoose-paginate-v2';
import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IPost {
  text: string;
  title?: string;
  status: Status;
  createdAt?: Date;
  imageUrl?: string;
  videoUrl?: string;
  creator: Types.ObjectId;
  organization: Types.ObjectId;
  likedBy?: Types.ObjectId[];
  comments?: Types.ObjectId[];
  likeCount?: number;
  commentCount?: number;
}

const postSchema = new Schema<IPost, Model<IPost>, IPost>({
  text: {
    type: String,
    required: true,
  },
  title: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
  createdAt: {
    type: Date,
    default: () => new Date(Date.now()),
  },
  imageUrl: {
    type: String,
    required: false,
  },
  videoUrl: {
    type: String,
    required: false,
  },
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
  likedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  likeCount: {
    type: Number,
    default: 0,
  },
  commentCount: {
    type: Number,
    default: 0,
  },
});

// @ts-ignore
postSchema.plugin(mongoosePaginate);

export const Post = model<IPost>('Post', postSchema);

export default Post;
