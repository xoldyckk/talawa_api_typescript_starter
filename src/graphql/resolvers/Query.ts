import groupChats from './group_chat_query/groupChats';
import groupChatMessages from './group_chat_query/groupChatMessages';
import directChats from './direct_chat_query/directChats';
import directChatMessages from './direct_chat_query/directChatMessages';
import organizations from './organization_query/organizations';
import event from './event_query/event';
import registrantsByEvent from './event_query/registrantsByEvent';
import events from './event_query/events';
import isUserRegister from './event_query/isUserRegister';
import eventsByOrganization from './event_query/eventsByOrganization';
import registeredEventsByUser from './event_query/registeredEventsByUser';
import tasksByEvent from './event_query/tasksByEvent';
import tasksByUser from './user_query/tasksByUser';
import comments from './post_query/comments';
import commentsByPost from './post_query/commentsByPost';
import post from './post_query/post';
import posts from './post_query/posts';
import postsByOrganization from './post_query/postsByOrganization';
import groups from './group_query/groups';
import organizationsConnection from './organization_query/organizations_pagination';
import postsByOrganizationConnection from '../resolvers/post_organization_query/organization_post_pagination';
import { users, user, me } from './user_query/users';
import { usersConnection } from './user_query/users';
import { organizationsMemberConnection } from './user_query/users';
import plugin from './plugin_query/super-admin-plugin-query';
import adminPlugin from './plugin_query/admin-plugin-query';
import myLanguage from '../resolvers/user_query/myLanguage';
import userLanguage from '../resolvers/user_query/userLanguage';
import getlanguage from '../resolvers/language_maintainer_query/getlanguage';
import directChatsByUserID from './direct_chat_query/directChatsByUserID';
import directChatMessagesByChatID from './direct_chat_query/directChatMessagesByChatID';

import { QueryResolvers } from './generatedTypes';

export const Query: QueryResolvers = {
  me,
  user,
  users,
  usersConnection,

  organizations,
  organizationsConnection,
  organizationsMemberConnection,

  isUserRegister,
  event,
  events,
  registrantsByEvent,
  eventsByOrganization,
  registeredEventsByUser,

  groupChats,
  groupChatMessages,
  directChats,
  directChatMessages,
  directChatsByUserID,
  directChatMessagesByChatID,

  tasksByEvent,
  tasksByUser,
  comments,
  commentsByPost,
  post,
  posts,
  postsByOrganization,
  postsByOrganizationConnection,
  groups,

  myLanguage,
  userLanguage,
  plugin,
  adminPlugin,

  getlanguage,
};

export default Query;
