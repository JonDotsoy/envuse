import { getAnalytics } from "firebase/analytics";
import { logEvent as analyticsLogEvent } from "firebase/analytics";
import { app } from "./app";

export const analytics = !!globalThis.window ? getAnalytics(app) : null;

type ArgsAnalyticsLogEvent = typeof analyticsLogEvent extends (
  args0: any,
  ...args: infer U
) => any
  ? U
  : never;

export const logEvent = (...args: ArgsAnalyticsLogEvent) => {
  if (analytics) {
    analyticsLogEvent(analytics, ...args);
  }
};
