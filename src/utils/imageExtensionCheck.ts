import requestContext from '@talawa-api/request-context';
import { ValidationError } from '@talawa-api/errors';
import { deleteImage } from './deleteImage';

export const imageExtensionCheck = async (filename: string) => {
  const extension = filename.split('.').pop();
  if (extension !== 'png' && extension !== 'jpg' && extension !== 'jpeg') {
    await deleteImage(filename);
    throw new ValidationError(
      [
        {
          message: requestContext.translate('invalid.fileType'),
          code: 'invalid.fileType',
          param: 'fileType',
        },
      ],
      requestContext.translate('invalid.fileType')
    );
  }
};

export default imageExtensionCheck;
