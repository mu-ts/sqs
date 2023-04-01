import { MessageAttributeValue, SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput, SQSClient } from "@aws-sdk/client-sqs";
import { MessageReceipt } from "../model/MessageReceipt";
import { AddOptions } from "../model/AddOptions";

import { SQSClientWrapper } from "../service/SQSClientWrapper";

export async function add(queueURL: string, payload: Record<string, any> | string, options?: AddOptions): Promise<MessageReceipt> {

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
    QueueUrl: queueURL,
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
