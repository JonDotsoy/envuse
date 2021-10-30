import { Timestamp } from 'firebase/firestore';
import { dateFormat } from "./date-format";

export const dateFormatStr = (date: any) => date instanceof Date ? dateFormat.format(date) : date instanceof Timestamp ? dateFormat.format(date.toDate()) : null;
