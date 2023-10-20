import { MessageAttributeValue, SendMessageCommand, SendMessageCommandInput, SendMessageCommandOutput } from '@aws-sdk/client-sqs'

import { MessageReceipt } from '../model/MessageReceipt'
import { QueueService } from './guts/QueueService'
import { Client } from './guts/Client'
import { toMetadata, toString } from '@mu-ts/serialization'

export async function add(instance: any, _topic?: string): Promise<MessageReceipt> {

  const queue: string = QueueService.getQueue(instance || _topic)
  const message: string = toString(instance)
  const metadata: Record<string, string | string[]> = toMetadata(instance)
  const groupId: string = QueueService.getGroupId(instance)
  const deduplicationId: string = QueueService.getDeduplicationId(instance)
  const messageAttributes: Record<string, MessageAttributeValue> | undefined = Object.keys(metadata).reduce((attributes: Record<string, MessageAttributeValue>, key: string) => {
    if (Array.isArray(metadata[key])) {
      attributes[key] = {
        DataType: 'String.Array',
        StringValue: (metadata[key] as unknown as string[]).join(',')
      }
    } else {
      attributes[key] = {
        DataType: 'String',
        StringValue: metadata[key] as string
      }
    }
    return attributes
  }, {})

  const input: SendMessageCommandInput = {
    QueueUrl: queue,
    MessageBody: message,
    // DelaySeconds: delayInSeconds,
    MessageAttributes: messageAttributes,
    MessageDeduplicationId: deduplicationId,
    MessageGroupId: groupId,
  }
  const command: SendMessageCommand = new SendMessageCommand(input)
  const response: SendMessageCommandOutput = await Client.instance().send(command)


  return new MessageReceipt(response.MessageId as string)
}
