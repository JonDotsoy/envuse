import { getStorage } from "firebase/storage";
import { app } from "./app";

export const storage = getStorage(app);
