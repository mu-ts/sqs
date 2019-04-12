import { SQSEvent } from 'aws-lambda';
import { SQSEventCondition } from './SQSEventCondition';
import { SQSRouter } from './SQSRouter';

/**
 *
 * @param route for this function.
 */
export function sqsListener<Of>(type: Of, condition?: SQSEventCondition, priority?: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const targetMethod = descriptor.value;

    descriptor.value = function() {
      const event: SQSEvent = arguments[0];

      return targetMethod.apply(this, arguments);
    };

    SQSRouter.register(descriptor.value, condition, priority);

    return descriptor;
  };
}
