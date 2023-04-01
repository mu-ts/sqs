import { 
  SQSClient, MessageAttributeValue, SendMessageBatchRequestEntry,
  SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput, 
  SendMessageBatchCommand, SendMessageBatchCommandInput, SendMessageBatchCommandOutput,
} from "@aws-sdk/client-sqs";
import { MessageReceipt } from "../model/MessageReceipt";
import { AddOptions } from "../model/AddOptions";

import { SQSClientWrapper } from "./SQSClientWrapper";


/**
 * Wrapper around AWS SQS to normalize the 90% cases into a few common
 * calls.
 */
export class SQS {
  private queueURL: string;


  /**
   *
   * @param topicArn To bind this SQS instance to.
   */
  constructor(queueURL: string) {
    this.queueURL = queueURL;
  }

  public async addAll(... payloads: { payload: Record<string, any> | string, options: AddOptions }[]): Promise<SendMessageBatchCommandOutput> {
    const client: SQSClient = SQSClientWrapper.instance().client;

    const input: SendMessageBatchCommandInput = {
      QueueUrl: this.queueURL,
      Entries: payloads.map( ({ payload, options}:{ payload: Record<string, any>  | string, options: AddOptions }) => {
        const message: string = typeof payload === "string" ? payload : JSON.stringify(payload);
        const { delayInSeconds, deduplicationId, groupId, tags } = options || {};
        const messageAttributes: Record<string, MessageAttributeValue> | undefined = !tags ? undefined : Object.keys(tags).reduce((attributes: Record<string, MessageAttributeValue>, key: string) => {
          if (Array.isArray(tags[key])) {
            attributes[key] = {
              DataType: 'String.Array',
              StringValue: (tags[key] as string[]).join(',')
            }
          } else {
            attributes[key] = {
              DataType: 'String',
              StringValue: tags[key] as string
            }
          }
          return attributes;
        }, {})
        return {
          MessageBody: message,
          DelaySeconds: delayInSeconds,
          MessageAttributes: messageAttributes,
          MessageDeduplicationId: deduplicationId,
          MessageGroupId: groupId,
        } as SendMessageBatchRequestEntry
      }),
    };
    const command: SendMessageBatchCommand = new SendMessageBatchCommand(input);
    const response: SendMessageBatchCommandOutput = await client.send(command);
    return response;
  }

  /**
   * Convenience method around the publish behavior of SQS
   *
   * @param topicARN to send the message.
   * @param payload of the messgae to send.
   * @param options to decorate the publish with the request.
   */
  public async add(payload: Record<string, any> | string, options?: AddOptions): Promise<MessageReceipt> {

    const client: SQSClient = SQSClientWrapper.instance().client;
    const message: string = typeof payload === "string" ? payload : JSON.stringify(payload);
    const { delayInSeconds, deduplicationId, groupId, tags } = options || {};

    const messageAttributes: Record<string, MessageAttributeValue> | undefined = !tags ? undefined : Object.keys(tags).reduce((attributes: Record<string, MessageAttributeValue>, key: string) => {
      if (Array.isArray(tags[key])) {
        attributes[key] = {
          DataType: 'String.Array',
          StringValue: (tags[key] as string[]).join(',')
        }
      } else {
        attributes[key] = {
          DataType: 'String',
          StringValue: tags[key] as string
        }
      }
      return attributes;
    }, {})

    const input: SendMessageCommandInput = {
      QueueUrl: this.queueURL,
      MessageBody: message,
      DelaySeconds: delayInSeconds,
      MessageAttributes: messageAttributes,
      MessageDeduplicationId: deduplicationId,
      MessageGroupId: groupId,
    };
    const command: SendMessageCommand = new SendMessageCommand(input);
    const response: SendMessageCommandOutput = await client.send(command);
    return new MessageReceipt(response.MessageId as string)
  }
}
