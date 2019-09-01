import { SQSEventCondition } from './SQSEventCondition';
import { SQSRoutes } from './SQSRoutes';

/**
 *
 * @param route for this function.
 */
export function sqsListener(condition?: SQSEventCondition, priority?: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const targetMethod = descriptor.value;

    descriptor.value = function(): Promise<void> {

      return targetMethod.apply(this, arguments);
    };

    SQSRoutes.register(
        target,
        descriptor.value,
        descriptor,
        condition,
        priority);

    return descriptor;
  };
}