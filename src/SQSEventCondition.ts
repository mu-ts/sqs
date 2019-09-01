import { SQSListenerEvent } from './SQSListenerEvent';

/**
 * Function interface for the logic that will check if a route
 * should be executed or not.
 */
export interface SQSEventCondition {
  (event: SQSListenerEvent<any>): boolean;
}
