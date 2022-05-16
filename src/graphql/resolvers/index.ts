import Query from './Query';
import Mutation from './Mutation';
import Subscription from './Subscription';
import Organization from './Organization';
import MembershipRequest from './MembershipRequest';
import DirectChat from './DirectChat';
import DirectChatMessage from './DirectChatMessage';
import GroupChat from './GroupChat';
import GroupChatMessage from './GroupChatMessage';

export const resolvers = {
  Query,
  Mutation,
  Subscription,
  Organization,
  MembershipRequest,
  DirectChat,
  DirectChatMessage,
  GroupChat,
  GroupChatMessage,
};

export default resolvers;
