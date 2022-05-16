import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface ITask {
  title: string;
  description?: string;
  status: Status;
  createdAt?: Date;
  deadline?: Date;
  event: Types.ObjectId;
  creator: Types.ObjectId;
}

const taskSchema = new Schema<ITask, Model<ITask>, ITask>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
  createdAt: { type: Date, default: () => new Date(Date.now()) },
  deadline: { type: Date },
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
});

export const Task = model<ITask>('Task', taskSchema);

export default Task;
