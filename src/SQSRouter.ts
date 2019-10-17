import { Callback, Context, SQSEvent } from 'aws-lambda';
import { SQSListenerEvent } from './SQSListenerEvent';
import { JSONSerializer } from './JSONSerializer';
import { SQSSerializer } from './SQSSerializer';
import { SQSRoute } from './SQSRoute';
import { Logger, LoggerService } from '@mu-ts/logger';
import { SQSRoutes } from './SQSRoutes';


/**
 * Singleton that contains all of the routes registered for this
 * endpoint.
 */
export abstract class SQSRouter {

  private static logger: Logger = LoggerService.named('SQSRouter', { fwk: '@mu-ts' });
  private static serializer: SQSSerializer = new JSONSerializer();

  public static validationHandler: any;

  private constructor() {}

  /**
   *
   * @param _event to invoke the endpoint with.
   * @param context of the invocation.
   * @param callback to execute when completed.
   */
  public static async handle(_event: SQSEvent, context: Context, callback: Callback) {

    try {

      for (const record of _event.Records) {

        const event: SQSListenerEvent<any> = {
          messageId: record.messageId,
          body: record.body ? SQSRouter.serializer.deserializeBody(record.body) : undefined,
          attributes: record.attributes,
          messageAttributes: record.messageAttributes,
          eventSourceARN: record.eventSourceARN
        };

        this.logger.debug({data: event}, 'handle()');
        this.logger.trace({data: SQSRoutes.getRoutes()}, 'handle() routes');

        const routeOptions: Array<SQSRoute> = SQSRoutes.getRoutes()
            .filter((route: SQSRoute) => {
              this.logger.trace({data: route}, 'check condition');
              if (route.condition) {
                return route.condition(event);
              }
              return route;
            })
            .map((route: SQSRoute) => {
              // TODO add this in for validation on the consumer.
              // const validators = SQSRoutes.getValidators() || [];
              // const validations = validators.filter(validator => validator.descriptor === route.descriptor);
              // route.validations = validations;
              return route;
            })
            .sort((first: SQSRoute, second: SQSRoute) => second.priority - first.priority);

        if (!routeOptions || routeOptions.length === 0) {
          this.logger.error('Action is not implemented at this path.');
          throw new Error('Action is not implemented');
        }

        for (const route of routeOptions) {
          await route.endpoint(event);
        }

      }

      callback(undefined);

    } catch (error) {
      callback(error);
    }
  }

}