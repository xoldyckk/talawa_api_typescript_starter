import { unlink } from 'fs';
import logger from '@talawa-api/logger';
import { ImageHash } from '@talawa-api/models';
import { reuploadDuplicateCheck } from './reuploadDuplicateCheck';

export const deleteImage = async (
  imageToBeDeleted: string,
  imageBelongingToItem?: any
) => {
  let tryingToReUploadADuplicate;
  if (imageBelongingToItem) {
    tryingToReUploadADuplicate = await reuploadDuplicateCheck(
      imageBelongingToItem,
      imageToBeDeleted
    );
  }

  if (!tryingToReUploadADuplicate) {
    // Only remove the old image if its different from the new one
    // Ensure image hash isn't used by multiple users/organization before deleting it
    let hash = await ImageHash.findOne({
      fileName: imageToBeDeleted,
    });

    if (hash && hash.numberOfUses > 1) {
      // image is only deleted if it is only used once
      logger.info('Image cannot be deleted');
    } else {
      logger.info('Image is only used once and therefore can be deleted');
      unlink(imageToBeDeleted, function (err) {
        if (err) throw err;
        // if no error, file has been deleted successfully
        logger.info('File deleted!');
      });
    }

    await ImageHash.findOneAndUpdate(
      {
        // decrement number of uses of hashed image
        fileName: imageToBeDeleted,
      },
      {
        $inc: {
          numberOfUses: -1,
        },
      },
      {
        new: true,
      }
    );
  }
};

export default deleteImage;
