import signUp from './auth_mutations/signup';
import login from './auth_mutations/login';
import refreshToken from './auth_mutations/refresh_token';
import revokeRefreshTokenForUser from './auth_mutations/revoke_refresh_token_for_user';

import createEvent from './event_mutations/createEvent';
import removeEvent from './event_mutations/removeEvent';
import updateEvent from './event_mutations/updateEvent';
import createOrganization from './organization_mutations/createOrganization';
import updateOrganization from './organization_mutations/updateOrganization';
import removeOrganization from './organization_mutations/removeOrganization';
import createAdmin from './admin_mutations/createAdmin';
import removeAdmin from './admin_mutations/removeAdmin';
import joinPublicOrganization from './member_mutations/join_public_organization';
import leaveOrganization from './member_mutations/leave_organization';
import removeMember from './member_mutations/removeMember';
import updateUserProfile from './user_mutations/updateUserProfile';
import registerForEvent from './event_mutations/registerForEvent';
import unregisterForEventByUser from './event_mutations/unregisterForEvent';
// import createEventProject from "./event_project_mutations/createProject")
// import removeEventProject from "./event_project_mutations/removeProject")
// import updateEventProject from "./event_project_mutations/updateProject")

import createTask from './project_task_mutations/createTask';
import removeTask from './project_task_mutations/removeTask';
import updateTask from './project_task_mutations/updateTask';
import adminRemovePost from './admin_mutations/admin-remove-post';
import adminRemoveEvent from './admin_mutations/admin-remove-event';
import adminRemoveGroup from './admin_mutations/admin-remove-group-chat';

import createPost from './post_mutations/createPost';
import removePost from './post_mutations/removePost';
import createComment from './post_mutations/createComment';
import removeComment from './post_mutations/removeComment';
import likeComment from './post_mutations/likeComment';
import unlikeComment from './post_mutations/unlikeComment';
import likePost from './post_mutations/likePost';
import unlikePost from './post_mutations/unlikePost';

import sendMembershipRequest from './membership_request_mutations/send_membership_request';
import acceptMembershipRequest from './membership_request_mutations/accept_membership_request';
import rejectMembershipRequest from './membership_request_mutations/reject_membership_request';
import cancelMembershipRequest from './membership_request_mutations/cancel_membership_request';

import blockUser from './block_user_mutations/block_user';
import unblockUser from './block_user_mutations/unblock_user';

import addUserImage from './user_image_mutations/add_user_image';
import removeUserImage from './user_image_mutations/remove_user_image';
import addOrganizationImage from './organization_image_mutations/add_organization_image';
import removeOrganizationImage from './organization_image_mutations/remove_organization_image';

import createDirectChat from './direct_chat_mutations/createDirectChat';
import removeDirectChat from './direct_chat_mutations/removeDirectChat';
import sendMessageToDirectChat from './direct_chat_mutations/sendMessageToDirectChat';
import createGroupChat from './group_chat_mutations/createGroupChat';
import removeGroupChat from './group_chat_mutations/removeGroupChat';
import sendMessageToGroupChat from './group_chat_mutations/sendMessageToGroupChat';
import addUserToGroupChat from './group_chat_mutations/addUserToGroupChat';
import removeUserFromGroupChat from './group_chat_mutations/removeUserFromGroupChat';
import updateLanguage from './language_mutation/updateLanguage';
import blockPluginCreationBySuperadmin from '../resolvers/user_mutations/blockForPlugin';

import createPlugin from './plugin_mutations/createPlugin';
import createMessageChat from './message_chat_mutation/createMessageChat';
import addLanguageTranslation from './language_maintainer_mutation/addLanguageTranslation';

import { MutationResolvers } from './generatedTypes';

export const Mutation: MutationResolvers = {
  signUp,
  login,
  refreshToken,
  revokeRefreshTokenForUser,
  updateLanguage,

  updateUserProfile,
  createOrganization,

  createEvent,
  registerForEvent,
  removeEvent,
  updateEvent,
  unregisterForEventByUser,

  createAdmin,
  removeAdmin,
  updateOrganization,
  removeOrganization,
  joinPublicOrganization,
  leaveOrganization,
  removeMember,
  //removeMultipleMembers,

  adminRemovePost,
  adminRemoveGroup,
  adminRemoveEvent,
  // createEventProject,
  // removeEventProject,
  // updateEventProject,
  createPost,
  removePost,
  likePost,
  unlikePost,
  createTask,
  removeTask,
  updateTask,
  sendMembershipRequest,
  acceptMembershipRequest,
  rejectMembershipRequest,
  cancelMembershipRequest,

  blockUser,
  unblockUser,

  createComment,
  removeComment,
  likeComment,
  unlikeComment,

  addUserImage,
  removeUserImage,
  addOrganizationImage,
  removeOrganizationImage,

  createDirectChat,
  removeDirectChat,
  sendMessageToDirectChat,

  createGroupChat,
  removeGroupChat,
  sendMessageToGroupChat,
  addUserToGroupChat,
  removeUserFromGroupChat,
  blockPluginCreationBySuperadmin,
  createPlugin,

  createMessageChat,
  addLanguageTranslation,
};

export default Mutation;
