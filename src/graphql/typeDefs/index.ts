import { gql } from 'apollo-server-core';
import { mutation } from './mutation';
import { query } from './query';
import { utils } from './utils';
import { auth, user } from './user';
import { organization } from './organization';
import { event } from './event';
import { newsfeed } from './newsfeed';
import { chat, message } from './chat';
import { plugin, pluginField } from './plugin';
import { language } from './language';

const extraTypes = gql`
  directive @auth on FIELD_DEFINITION
  directive @role(requires: UserType) on FIELD_DEFINITION

  type Message {
    _id: ID!
    text: String
    createdAt: String
    imageUrl: String
    videoUrl: String
    creator: User
  }

  input GroupInput {
    title: String
    description: String
    organizationId: ID!
  }

  type Group {
    _id: ID
    title: String
    description: String
    createdAt: String
    organization: Organization!
    admins: [User]
  }

  type Subscription {
    messageSentToDirectChat: DirectChatMessage
    messageSentToGroupChat: GroupChatMessage
    directMessageChat: MessageChat
  }
`;

export const typeDefs = [
  chat,
  message,
  plugin,
  pluginField,
  auth,
  user,
  event,
  language,
  mutation,
  newsfeed,
  organization,
  query,
  utils,
  extraTypes,
];

export default typeDefs;
