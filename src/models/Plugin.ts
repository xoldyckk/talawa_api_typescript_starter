import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

enum PluginType {
  UNIVERSAL = 'UNIVERSAL',
  PRIVATE = 'PRIVATE',
}

interface IPlugin {
  orgId: Types.ObjectId;
  pluginName: string;
  pluginKey?: string;
  pluginStatus: Status;
  pluginType: PluginType;
  adminAccessAllowed: boolean;
  additionalInfo?: Types.ObjectId;
  createdAt?: Date;
}

//this is the Structure of the Comments
const pluginSchema = new Schema<IPlugin, Model<IPlugin>, IPlugin>({
  orgId: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  pluginName: {
    type: String,
    required: true,
  },
  pluginKey: {
    type: String,
    required: false,
  },
  pluginStatus: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
  pluginType: {
    type: String,
    required: true,
    default: PluginType.UNIVERSAL,
    enum: ['UNIVERSAL', 'PRIVATE'],
  },
  adminAccessAllowed: {
    type: Boolean,
    required: true,
    default: true,
  },
  additionalInfo: [
    {
      type: Schema.Types.ObjectId,
      ref: 'PluginField',
      required: false,
    },
  ],
  createdAt: {
    type: Date,
    default: () => new Date(Date.now()),
  },
});

export const Plugin = model<IPlugin>('Plugin', pluginSchema);

export default Plugin;
