import { Schema, model, Model } from 'mongoose';
import { Status } from './types';

interface IImageHash {
  hashValue: string;
  fileName: string;
  numberOfUses: number;
  status: Status;
}

const imageHashSchema = new Schema<IImageHash, Model<IImageHash>, IImageHash>({
  hashValue: {
    type: String,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  numberOfUses: {
    type: Number,
    default: 0,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
});

export const ImageHash = model<IImageHash>('ImageHash', imageHashSchema);

export default ImageHash;
