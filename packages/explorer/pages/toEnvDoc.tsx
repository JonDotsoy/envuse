import { Timestamp } from 'firebase/firestore';
import { isObject, isObjectTimestamp, withProp } from '../lib/types';

export function toEnvDoc(data: any) {
  if (!isObject(data))
    return null;

  return {
    title: withProp(data, 'title', (v): v is string => typeof v === 'string') ? data.title : null,
    tags: withProp(data, 'tags', (v): v is string[] => Array.isArray(v) && v.every(v => typeof v === 'string')) ? data.tags : null,
    createdAt: isObjectTimestamp(data.createdAt) ? new Timestamp(data.createdAt.seconds, data.createdAt.nanoseconds) : null,
  };
}
