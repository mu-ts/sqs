/**
 * An SQS body.
 */
export interface SQSBody<T> {
    messageBody: T;
    [key: string]: any;
}
