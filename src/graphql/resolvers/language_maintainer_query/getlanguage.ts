import {Language} from '@talawa-api/models'';
//const { NotFoundError } = require('errors');
//const requestContext = require('talawa-request-context');
import { QueryResolvers } from '../generatedTypes';


export const getLanguage:QueryResolvers["getlanguage"] = async (parent, args) => {
  const translationFound = await Language.find({
    'translation.lang_code': args.lang_code,
  });

  // THE ERROR CASE IS NOT POSSIBLE AS QUERY WILL RETURN EMPTY ARRAY
  //
  // if (!translationFound) {
  //   throw new NotFoundError(
  //     process.env.NODE_ENV !== 'production'
  //       ? 'Translation not found'
  //       : requestContext.translate('translation.notFound'),
  //     'translation.notFound',
  //     'translationNotFound'
  //   );
  // }

  let languages = [];
  translationFound.forEach((element) => {
    element.translation.forEach((translated) => {
      if (translated.lang_code === args.lang_code) {
        languages.push({
          lang_code: translated.lang_code,
          en_value: element.en,
          translation: translated.value,
          verified: translated.verified,
        });
      }
    });
  });

  return languages;
};

export default getLanguage;
