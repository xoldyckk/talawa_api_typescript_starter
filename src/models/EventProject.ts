import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IEventProject {
  title: string;
  description: string;
  createdAt?: Date;
  event: Types.ObjectId;
  creator: Types.ObjectId;
  tasks?: Types.ObjectId[];
  status: Status;
}

//this is the Structure of the event project
const eventProjectSchema = new Schema<
  IEventProject,
  Model<IEventProject>,
  IEventProject
>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(Date.now()),
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: 'Event',
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Task',
    },
  ],
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
});

export const EventProject = model<IEventProject>(
  'EventProject',
  eventProjectSchema
);

export default EventProject;
