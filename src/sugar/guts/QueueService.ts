import { KEY as DEDPULICATIONID_KEY } from '../../decorators/deduplicationId'
import { KEY as GROUPID_KEY } from '../../decorators/groupId'

export class QueueService {
  public static readonly PREFIX: string = 'mu-ts/sqs'
  
  public static getQueue(topicOrInstance: string | any) {
    if (typeof topicOrInstance === 'string') return topicOrInstance;
    return topicOrInstance[this.PREFIX]?.queue || topicOrInstance.constructor?.[this.PREFIX]?.queue
  }

  public static getGroupId(instance: any): string {
    const key: string | undefined =  instance.constructor?.[this.PREFIX]?.[GROUPID_KEY];
    if (key) return instance[key]
    return undefined;
  }
  
  public static getDeduplicationId(instance: any): string {
    const key: string | undefined = instance.constructor?.[this.PREFIX]?.[DEDPULICATIONID_KEY];
    if (key) return instance[key]
    return undefined;
  }

}