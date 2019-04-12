import { Context, SQSEvent } from 'aws-lambda';
import { SQSEventCondition } from './SQSEventCondition';

interface SQSRoute {
  endpoint: Function;
  condition?: SQSEventCondition;
  priority: number;
}

/**
 * Singleton that contains all of the routes registered for this
 * endpoint.
 */
export abstract class SQSRouter {
  private static routes: Array<SQSRoute> = new Array();

  private constructor() {}

  /**
   *
   * @param endpoint to be executed.
   * @param condition, that if provided, will test if this endpoint should even
   *        be invoked.
   * @param priority of this endpoint. A higher value indicates it should be
   *        executed ahead of other endpoints. Defaults to 0.
   *
   */
  public static register(endpoint: Function, condition?: SQSEventCondition, priority?: number): void {
    SQSRouter.routes.push({
      endpoint: endpoint,
      condition: condition,
      priority: priority || 0,
    });
  }

  /**
   *
   * @param event to invoke the endpoint with.
   * @param context of the invocation.
   * @param callback to execute when completed.
   */
  public static async handle(event: SQSEvent, context: Context): Promise<void> {
    const routeOptions: Array<SQSRoute> = SQSRouter.routes
      .filter((route: SQSRoute) => {
        console.log('check condition', route);
        if (route.condition) {
          return route.condition(event);
        }
        return route;
      })
      .sort((first: SQSRoute, second: SQSRoute) => second.priority - first.priority);

    if (!routeOptions || routeOptions.length === 0) {
      throw Error('Action is not implemented at this path.');
    }

    let promiseChain = Promise.resolve();

    for (const route of routeOptions) {
      promiseChain = promiseChain.then(() => route.endpoint(event, context));
    }

    return await promiseChain;
  }
}
