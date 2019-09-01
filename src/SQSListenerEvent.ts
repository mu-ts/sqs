import { SQSMessageAttributes, SQSRecordAttributes } from 'aws-lambda';
import { SQSBody } from './SQSBody';

export class SQSListenerEvent<T extends any> {

    messageId: string;
    body: SQSBody<T>;
    attributes: SQSRecordAttributes;
    messageAttributes: SQSMessageAttributes;
    eventSourceARN: string;

}