import 'reflect-metadata';
import { SQSBody } from './interfaces/SQSBody';
import { SQSSerializer } from './interfaces/SQSSerializer';

/**
 * Default serializer that will serialize a SQS JSON object. It will grab the Message from the body and deserialize it
 * as well, if it exists. This has been verified with SNS topic messages to a queue, but unsure how it will be
 * represented by other means of populating an item on an SQS Queue.
 *
 * TODO investigate with other queue population means and see where it might fall apart outside of how we have used it.
 */
export class JSONSerializer implements SQSSerializer {
  constructor() {}

  public deserializeBody(eventBody: string): SQSBody<any> {
    const body: SQSBody<any> = <SQSBody<any>>JSON.parse(eventBody);
    if (body.Message) {
      body.messageBody = JSON.parse(body.Message);
    }
    return body;
  }
}
