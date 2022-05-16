import cls from 'cls-hooked';
// @ts-ignore
import clsBluebird from 'cls-bluebird';
import i18n from 'i18n';
import { NextFunction, Request, Response } from 'express';

const requestContextNamespace = cls.createNamespace('talawa-request-context');
clsBluebird(requestContextNamespace);

const setRequestContextValue = (key: any, value: any) => {
  return requestContextNamespace.set(key, value);
};

const getRequestContextValue = (key: any) => {
  return requestContextNamespace.get(key);
};

const setRequestContext = (obj: any) => {
  setRequestContextValue('translate', obj.__);
  setRequestContextValue('translatePlural', obj.__n);
};

export const middleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    requestContextNamespace.bindEmitter(req);
    requestContextNamespace.bindEmitter(res);

    requestContextNamespace.run(() => {
      setRequestContext(req);
      next();
    });
  };
};

export const init = async (options: any = {}) => {
  const obj: any = {};
  i18n.init(obj);
  obj.setLocale(options.lang);
  return requestContextNamespace.runAndReturn(async () => {
    setRequestContext({
      __: obj.__,
      __n: obj.__n,
    });
    return options.requestHandler();
  });
};

export const translate = (...args: any[]) => {
  const __ = getRequestContextValue('translate');
  if (typeof __ !== 'function') {
    throw new Error('i18n is not initialized, try app.use(i18n.init);');
  }
  return __(...args);
};

export const translatePlural = (...args: any[]) => {
  const __n = getRequestContextValue('translatePlural');
  if (typeof __n !== 'function') {
    throw new Error('i18n is not initialized, try app.use(i18n.init);');
  }
  return __n(...args);
};

export default { middleware, init, translate, translatePlural };
