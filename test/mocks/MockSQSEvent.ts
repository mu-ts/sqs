import { SQSEvent, SQSRecord } from 'aws-lambda';

class MockSQSEvent implements SQSEvent {
    Records: SQSRecord[];
}

export { MockSQSEvent };