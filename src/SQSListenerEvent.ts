import { SQSMessageAttributes, SQSRecordAttributes } from 'aws-lambda';
import { SQSBody } from './SQSBody';

export interface SQSListenerEvent<T extends any> {

    messageId: string;
    body: SQSBody<T> | undefined;
    attributes: SQSRecordAttributes;
    messageAttributes: SQSMessageAttributes;
    eventSourceARN: string;

}