import { User, Organization } from '@talawa-api/models';
import adminCheck from '../functions/adminCheck';
import { deleteImage } from '@talawa-api/utils';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const removeOrganizationImage: MutationResolvers['removeOrganizationImage'] =
  async (parent, args, context) => {
    const user = await User.findById(context.userId);
    if (!user) {
      throw new NotFoundError(
        requestContext.translate('user.notFound'),
        'user.notFound',
        'user'
      );
    }

    const org = await Organization.findById(args.organizationId);
    if (!org) {
      throw new NotFoundError(
        requestContext.translate('organization.notFound'),
        'organization.notFound',
        'organization'
      );
    }

    adminCheck(context, org); // Ensures user is an administrator of the organization

    if (!org.image) {
      throw new NotFoundError(
        requestContext.translate('organization.profile.notFound'),
        'organization.notFound',
        'organization'
      );
    }

    await deleteImage(org.image);

    const newOrganization = await Organization.findOneAndUpdate(
      {
        _id: org.id,
      },
      {
        $set: {
          image: null,
        },
      },
      {
        new: true,
      }
    );
    return newOrganization;
  };

export default removeOrganizationImage;
