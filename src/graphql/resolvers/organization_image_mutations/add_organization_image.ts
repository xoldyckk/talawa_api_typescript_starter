import { User, Organization } from '@talawa-api/models';
import adminCheck from '../functions/adminCheck';
import { NotFoundError } from '@talawa-api/errors';
import requestContext from '@talawa-api/request-context';
import { uploadImage } from '@talawa-api/utils';
import { MutationResolvers } from '../generatedTypes';

export const addOrganizationImage: MutationResolvers['addOrganizationImage'] =
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

    // Upload Image
    let uploadImageObj = await uploadImage(args.file, org.image);

    const newOrganization = await Organization.findOneAndUpdate(
      { _id: org.id },
      {
        $set: {
          image: uploadImageObj.imageAlreadyInDbPath
            ? uploadImageObj.imageAlreadyInDbPath
            : uploadImageObj.newImagePath,
        },
      },
      {
        new: true,
      }
    );

    return newOrganization;
  };

export default addOrganizationImage;
