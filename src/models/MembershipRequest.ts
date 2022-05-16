import { Schema, Types, model, Model } from 'mongoose';
import { Status } from './types';

interface IMembershipRequest {
  organization: Types.ObjectId;
  user?: Types.ObjectId;
  status: Status;
}

const membershipRequestSchema = new Schema<
  IMembershipRequest,
  Model<IMembershipRequest>,
  IMembershipRequest
>({
  organization: {
    type: Schema.Types.ObjectId,
    ref: 'Organization',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  status: {
    type: String,
    required: true,
    default: Status.ACTIVE,
    enum: ['ACTIVE', 'BLOCKED', 'DELETED'],
  },
});

export const MembershipRequest = model<IMembershipRequest>(
  'MembershipRequest',
  membershipRequestSchema
);

export default MembershipRequest;
