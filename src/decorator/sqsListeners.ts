import { SQSRoutes } from '../SQSRoutes';
import { Logger, LoggerService, LoggerConfig } from '@mu-ts/logger';

export function sqsListeners(instanceArgs?: any[]) {
  return function(target: any) {
    const parent: string = target.constructor.name;
    const logConfig: LoggerConfig = { name: `${parent}.sqsListeners`, adornments: { '@mu-ts': 'sqs' } };
    const logger: Logger = LoggerService.named(logConfig);
    logger.debug({ data: { instanceArgs } }, 'sqsListeners()', 'initializing SQSRoutes');
    SQSRoutes.init(target, instanceArgs);
  };
}
