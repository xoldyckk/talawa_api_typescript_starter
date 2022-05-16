import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { Comment } from '@talawa-api/models';
import { QueryResolvers } from '../generatedTypes';

export const comments: QueryResolvers['comments'] = async () => {
  const commentFound = await Comment.find()
    .populate('creator', '-password')
    .populate('post')
    .populate('likedBy');
  if (!commentFound) {
    throw new NotFoundError(
      requestContext.translate('comment.notFound'),
      'comment.notFound',
      'comment'
    );
  }
  return commentFound;
};

export default comments;
