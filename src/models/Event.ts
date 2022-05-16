import { Schema, Types, model, Model } from 'mongoose';
import { User } from './User';
import { Task } from './Task';
import { Status } from './types';

interface IUserAttende {
  userId: string;
  user: Types.ObjectId;
  status: Status;
  createdAt?: Date;
}

const UserAttendeSchema = new Schema<
  IUserAttende,
  Model<IUserAttende>,
  IUserAttende
>({
  userId: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
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
});

interface IEvent {
  title: string;
  description: string;
  attendees?: string;
  location?: string;
  recurring: boolean;
  allDay: boolean;
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  recurrance?: string;
  isPublic: boolean;
  isRegisterable: boolean;
  creator: Types.ObjectId;
  registrants: typeof UserAttendeSchema[];
  admins: Types.ObjectId[];
  organization: Types.ObjectId;
  tasks: Types.ObjectId[];
  status: Status;
}

//this is the Structure of the event
const eventSchema = new Schema<IEvent, Model<IEvent>, IEvent>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  attendees: {
    type: String,
    required: false,
  },
  location: {
    type: String,
  },
  recurring: {
    type: Boolean,
    required: true,
    default: false,
  },
  allDay: {
    type: Boolean,
    required: true,
  },
  startDate: {
    type: String,
    required: true,
  },
  endDate: {
    type: String,
    required: function () {
      // @ts-ignore
      return !this.allDay;
    },
  },
  startTime: {
    type: String,
    required: function () {
      // @ts-ignore
      return !this.allDay;
    },
  },
  endTime: {
    type: String,
    required: function () {
      // @ts-ignore
      return !this.allDay;
    },
  },
  recurrance: {
    type: String,
    default: 'ONCE',
    enum: ['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'ONCE'],
    required: function () {
      // @ts-ignore
      return this.recurring;
    },
  },
  isPublic: {
    type: Boolean,
    required: true,
  },
  isRegisterable: {
    type: Boolean,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  registrants: [UserAttendeSchema],
  admins: [
    {
      type: Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
  ],
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  tasks: [
    {
      type: Schema.Types.ObjectId,
      ref: Task,
    },
  ],
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
});

export const Event = model<IEvent>('Event', eventSchema);

export default Event;
