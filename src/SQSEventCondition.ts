import { SQSEvent } from 'aws-lambda';

/**
 * Function interface for the logic that will check if a route
 * should be executed or not.
 */
export interface SQSEventCondition {
  (event: SQSEvent): boolean;
}
