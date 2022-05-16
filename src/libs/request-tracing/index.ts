import cls from 'cls-hooked';
// @ts-ignore
import clsBluebird from 'cls-bluebird';
import { customAlphabet } from 'nanoid';
import { NextFunction, Request, Response } from 'express';

const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';

const requestTracingNamespace = cls.createNamespace('request-tracing');
clsBluebird(requestTracingNamespace);

export const tracingIdHeaderName = 'X-Tracing-Id';
const tracingIdContextKeyName = 'tracingId';

const nanoid = customAlphabet(alphabet, 10);
const _newTraceId = () => nanoid(); // 10 character unique request ID

const setTracingId = (tracingId: string) => {
  return requestTracingNamespace.set(tracingIdContextKeyName, tracingId);
};

export const getTracingId = () => {
  return requestTracingNamespace.get(tracingIdContextKeyName);
};

export const middleware = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    requestTracingNamespace.bindEmitter(req);
    requestTracingNamespace.bindEmitter(res);

    const tracingId = req.header(tracingIdHeaderName) || _newTraceId();
    // We need to set header to ensure API gateway which proxies request, forwards the header as well
    req.headers[tracingIdHeaderName] = tracingId;
    res.header(tracingIdHeaderName, tracingId); // Adding tracing ID to response headers

    requestTracingNamespace.run(() => {
      setTracingId(tracingId);
      next();
    });
  };
};

export const trace = async (tracingId: string, method: () => any) => {
  await requestTracingNamespace.runAndReturn(async () => {
    setTracingId(tracingId || _newTraceId());
    return method();
  });
};

export default { tracingIdHeaderName, getTracingId, middleware, trace };
