import { User, Organization, Post } from '@talawa-api/models';
import adminCheck from '../functions/adminCheck';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const adminRemovePost: MutationResolvers['adminRemovePost'] = async (
  parent,
  args,
  context
) => {
  //ensure organization exists
  let org = await Organization.findOne({ _id: args.organizationId });
  if (!org) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'Organization not found'
        : requestContext.translate('organization.notFound'),
      'organization.notFound',
      'organization'
    );
  }

  //gets user in token - to be used later on
  let user = await User.findOne({ _id: context.userId });
  if (!user) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'User not found'
        : requestContext.translate('user.notFound'),
      'user.notFound',
      'user'
    );
  }

  //ensure user is an admin
  adminCheck(context, org);

  //find post
  let post = await Post.findOne({ _id: args.postId });
  if (!post) {
    throw new NotFoundError(
      process.env.NODE_ENV !== 'production'
        ? 'Post not found'
        : requestContext.translate('post.notFound'),
      'post.notFound',
      'post'
    );
  }

  //remove post from organization
  org.overwrite({
    ...org._doc,
    posts: org._doc.posts.filter((post) => post !== args.postId),
  });
  await org.save();

  // //remove post from user
  // user.overwrite({
  //   ...user._doc,
  //   posts: user._doc.posts.filter((post) => post != args.postId),
  // });
  // await user.save();

  //delete post
  await Post.deleteOne({ _id: args.postId });

  //return user
  return post._doc;
};

export default adminRemovePost;
