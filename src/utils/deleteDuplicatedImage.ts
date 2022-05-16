import { unlink } from 'fs';
import logger from '@talawa-api/logger';

export const deleteDuplicatedImage = (imagePath: string) => {
  unlink(imagePath, function (err) {
    if (err) throw err;
    // if no error, file has been deleted successfully
    logger.info('File was deleted as it already exists in the db!');
  });
};

export default deleteDuplicatedImage;
