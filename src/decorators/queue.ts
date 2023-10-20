import { QueueService } from '../sugar/guts/QueueService'

/**
 * Used to mark a class to store its instances in a specific queue.
 * 
 * This decorator can be combined with @mu-ts/serialization to impact how the object is
 * handled before being added.
 * 
 * @param arn of the queue that this object will be used with.
 * @returns 
 */
export function queue(arn: string): any {
  return function queueDecorator(target: any, context: ClassDecoratorContext): typeof Function | void {
    context.addInitializer(function (this: any) {
      this[QueueService.PREFIX] = this[QueueService.PREFIX] ? this[QueueService.PREFIX].queue = arn : { queue: arn }
      /**
       * Creating an instance of the underlying class ensures that the field
       * and attribute level decorators will get picked up.
       */
      new this()
    })
  };
}
  