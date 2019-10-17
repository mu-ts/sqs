import { SNSMessageAttribute } from 'aws-lambda';

/**
 * An SQS body.
 */
export interface SQSBody<T> {
    messageBody: T;
    MessageAttributes: SNSMessageAttribute;
    [key: string]: any;
}
