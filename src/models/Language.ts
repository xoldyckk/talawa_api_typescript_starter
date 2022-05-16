import { Schema, model, Model } from 'mongoose';

interface ILangModel {
  lang_code: string;
  value: string;
  verified: boolean;
  createdAt: Date;
}

const LangModelSchema = new Schema<ILangModel, Model<ILangModel>, ILangModel>({
  lang_code: {
    type: String,
    required: true,
    unique: false,
    lowercase: true,
  },
  value: {
    type: String,
    required: true,
    lowercase: true,
  },
  verified: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now()),
  },
});

interface ILanguage {
  en: string;
  translation?: typeof LangModelSchema[];
  createdAt: Date;
}

const LangSchema = new Schema<ILanguage>({
  en: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  translation: [LangModelSchema],
  createdAt: {
    type: Date,
    required: true,
    default: () => new Date(Date.now()),
  },
});

export const Language = model<ILanguage>('Language', LangSchema);

export default Language;
