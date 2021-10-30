import { DocumentData } from 'firebase/firestore';

export interface EnvDoc extends DocumentData {
  createdAt: Date;
}
