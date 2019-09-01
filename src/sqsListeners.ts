import { SQSRoutes } from './SQSRoutes';
import { Logger, LoggerService } from '@mu-ts/logger';

export function sqsListeners(instanceArgs?: any[]) {
    const logger: Logger = LoggerService.named('sqsListeners', { fwk: '@mu-ts' });
    return function(target: any) {
        logger.debug({ data: { instanceArgs } }, 'sqsListeners() initializing');
        SQSRoutes.init(target, instanceArgs);
    };
}
