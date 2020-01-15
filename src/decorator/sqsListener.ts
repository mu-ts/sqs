import { SQSEventCondition } from '../interfaces/SQSEventCondition';
import { SQSRoutes } from '../SQSRoutes';
import { LoggerConfig, Logger, LoggerService } from '@mu-ts/logger';

/**
 *
 * @param route for this function.
 */
export function sqsListener(condition?: SQSEventCondition, priority?: number) {
  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const parent: string = target.constructor.name;
    const logConfig: LoggerConfig = { name: `${parent}.sqsListener`, adornments: { '@mu-ts': 'sqs' } };
    const logger: Logger = LoggerService.named(logConfig);

    const targetMethod = descriptor.value;

    descriptor.value = function(): Promise<void> {
      return targetMethod.apply(this, arguments);
    };

    logger.debug('registering function as a route.', { propertyKey });

    SQSRoutes.register(target, descriptor.value, descriptor, condition, priority);

    return descriptor;
  };
}
