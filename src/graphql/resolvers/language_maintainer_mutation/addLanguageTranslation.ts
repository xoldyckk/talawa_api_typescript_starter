import { ConflictError } from '@talawa-api/errors';
import { Language } from '@talawa-api/models';
import requestContext from '@talawa-api/request-context';
import { MutationResolvers } from '../generatedTypes';

export const addLanguageTranslation: MutationResolvers['addLanguageTranslation'] =
  async (parent, args) => {
    const langValue = await Language.findOne({
      en: args.data.en_value,
    });

    if (langValue) {
      langValue.translation.forEach((element) => {
        if (element.lang_code === args.data.translation_lang_code) {
          throw new ConflictError(
            process.env.NODE_ENV !== 'production'
              ? 'Already Present'
              : requestContext.translate('translation.alreadyPresent'),
            'translation.alreadyPresent',
            'translationAlreadyPresent'
          );
        }
      });

      const filter = {
        en: args.data.en_value,
      };

      const update = {
        $push: {
          translation: {
            lang_code: args.data.translation_lang_code,
            value: args.data.translation_value,
          },
        },
      };

      const langUpdate = await Language.findOneAndUpdate(filter, update, {
        new: true,
      });

      return langUpdate;
    }

    let lang = new Language({
      en: args.data.en_value,
      translation: [
        {
          lang_code: args.data.translation_lang_code,
          value: args.data.translation_value,
        },
      ],
    });

    lang = await lang.save();
    return lang._doc;
  };

export default addLanguageTranslation;
