import * as AWS from 'aws-sdk';
import {
  SendMessageRequest,
  SendMessageResult,
  ReceiveMessageRequest,
  ReceiveMessageResult,
  QueueAttributeMap,
  MessageBodyAttributeMap
} from 'aws-sdk/clients/sqs';

export class MessageReceipt {
  private messageId: string;
  constructor(messageId: string) {
    this.messageId = messageId;
  }
  public getMessageId(): string {
    return this.messageId;
  }
}

export interface SQSBodySerializer {
  (payload: object): string;
}

export function jsonSerializer(payload: object): string {
  return JSON.stringify(payload);
}

/**
 * Wrapper around AWS SQS to normalize the 90% cases into a few common
 * calls.
 */
export class SQS {
  private queueARN: string;
  private sqs: AWS.SQS;
  private serializer: SQSBodySerializer;
  private static globalSerializer: SQSBodySerializer = jsonSerializer;
  private static globalSQS: AWS.SQS;

  /**
   *
   * @param queueARN To bind this SQS instance to.
   * @param region to configure the AWS SQS client for.
   */
  constructor(queueARN: string, region?: string, serializer?: SQSBodySerializer) {
    this.queueARN = queueARN;
    this.sqs = new AWS.SQS({ apiVersion: '2012-11-05', region });
    this.serializer = serializer || jsonSerializer;
  }

  /**
   *
   * @param serializer to use for all static calls.
   */
  public static setSerializer(serializer: SQSBodySerializer): void {
    SQS.globalSerializer = serializer;
  }

  /**
   *
   * @param serializer to use on this instance.
   */
  public setSerializer(serializer: SQSBodySerializer): void {
    this.serializer = serializer;
  }

  /**
   *
   * @param region to configure the AWS SQS client for.
   */
  public static setRegion(region: string): void {
    AWS.config.update({ region });
  }
  /**
   *
   * @param region to configure the AWS SQS client for.
   */
  public setRegion(region: string): void {
    this.sqs.config.update({ region });
  }

  public static async sendMessage(
      queueARN: string,
      payload: string | object,
      subject?: string,
      tags?: Map<string, string>
  ): Promise<MessageReceipt> {
    if (!SQS.globalSQS) SQS.globalSQS = new AWS.SQS({ apiVersion: '2012-11-05' });
    const parameters: SendMessageRequest = SQS.buildParameters(SQS.globalSerializer, queueARN, payload, tags);
    const response: SendMessageResult = await SQS.send(SQS.globalSQS, parameters);
    const receipt: MessageReceipt = new MessageReceipt('' + response.MessageId);
    return receipt;
  }

  /**
   * Convenience method around the publish behavior of SNS
   *
   * @param payload of the messgae to send.
   * @param subject of the message to send. Optional
   * @param tags to attach to the message. Optional.
   */
  public async sendMessage(
      payload: string | object,
      subject?: string,
      tags?: Map<string, string>
  ): Promise<MessageReceipt> {
    const parameters: SendMessageRequest = SQS.buildParameters(this.serializer, this.queueARN, payload, tags);
    const response: SendMessageResult = await SQS.send(this.sqs, parameters);
    const receipt: MessageReceipt = new MessageReceipt('' + response.MessageId);
    return receipt;
  }

  private static buildParameters(
    serializer: SQSBodySerializer,
    queueUrl: string,
    payload: string | object,
    tags?: Map<string, string>,
    delaySeconds?: number
  ): SendMessageRequest {
    const body = typeof payload === 'string' ? payload : serializer(payload);
    const parameters: SendMessageRequest = {
      QueueUrl: queueUrl,
      MessageBody: body,
      DelaySeconds: delaySeconds || 0,
      MessageAttributes: !tags
        ? undefined
        : Object.keys(tags).reduce((current: MessageBodyAttributeMap, key: string) => {
            current[key] = {
              DataType: Array.isArray(tags.get(key)) ? 'String.Array' : 'String',
              StringValue: typeof tags.get(key) !== 'string' ? JSON.stringify(tags.get(key)) : tags.get(key),
            };
            return current;
          }, {}),
    };
    return parameters;
  }

  private static async send(sqs: AWS.SQS, parameters: SendMessageRequest): Promise<SendMessageResult> {
    return await sqs.sendMessage(parameters).promise()
  }
}
