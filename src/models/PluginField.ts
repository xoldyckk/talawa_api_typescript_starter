import { Schema, model, Model } from 'mongoose';
import { Status } from './types';

interface IPluginField {
  key: string;
  value: string;
  status: Status;
  createdAt?: Date;
}

//this is the Structure of the Comments
const pluginFieldSchema = new Schema<
  IPluginField,
  Model<IPluginField>,
  IPluginField
>({
  key: {
    type: String,
    required: true,
  },
  value: {
    type: String,
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

export const PluginField = model<IPluginField>(
  'PluginField',
  pluginFieldSchema
);

export default PluginField;
