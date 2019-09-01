import 'reflect-metadata';
import { Logger, LoggerService, LogLevelString } from '@mu-ts/logger';
import { SQSEventCondition } from './SQSEventCondition';
import { Validation } from './Validation';
import { SQSRoute } from './SQSRoute';

const METADATA_KEY: string = '__mu-ts_sqs';
const METADATA_VALIDATE_KEY: string = '__mu-ts_validate';

export class SQSRoutes {

    private static _routes: SQSRoute[] = [];
    private static _validations: Validation[] = [];
    private static _instances: Map<string, any> = new Map();
    private static logger: Logger = LoggerService.named('SQSRoutes', { fwk: '@mu-ts' });

    private constructor() {}

    /**
     *
     * @param headers to set on every request.
     */
    public static setLogLevel(level: LogLevelString): void {
        this.logger.level(level);
    }

    /**
     *
     */
    public static getRoutes(): SQSRoute[] {
        return SQSRoutes._routes;
    }

    /**
     *
     * @param condition to execute against array of routes to determine if the route is located.
     */
    public static find(condition: Function): SQSRoute | undefined {
        this.logger.debug({ data: { condition } }, 'find()');
        return this._routes.find((value: SQSRoute, index: number) => condition(value, index));
    }

    /**
     *
     * @param target to attach endpoints to.
     * @param pathPrefix to put in front of every path.
     * @param instanceArgs arguments to supply into the constructor of the instance.
     */
    public static init(target: any, instanceArgs?: any[]): void {
        const validations: Validation[] = Reflect.getMetadata(METADATA_VALIDATE_KEY, target as Function) || [];
        this._validations = validations;

        const paths: SQSRoute[] = Reflect.getMetadata(METADATA_KEY, target as Function) || [];

        this.logger.debug({ data: { paths } }, 'init() -- ');

        paths.forEach((path: SQSRoute) => {

            const _instance: any = SQSRoutes.getInstance(target, instanceArgs);
            path.endpoint = path.endpoint.bind(_instance);

            this.logger.debug({ data: { path, name: target['name'] } }, 'init() path');
            this._routes.push(path);

            this.logger.debug({ data: { path } }, 'init() -- ');
        });

        this.logger.debug({ data: { paths } }, 'init() <-- ');
    }

    /**
     *
     * @param _constructor to invoke a new instance of.
     * @param instanceArgs arguments to supply into the constructor of the instance.
     */
    private static getInstance(_constructor: any, _instanceArgs?: any | any[]): any {
        this.logger.debug({ data: { _constructor, _instanceArgs } }, 'init() --> ');
        let instance = this._instances.get(_constructor['name']);
        if (!instance) {
            this.logger.debug({ data: { namne: _constructor['name'] } }, 'init() -- creating instance ');
            if (!_instanceArgs) {
                instance = new _constructor();
            } else {
                /**
                 * Apply is 1 based instead of 0 based, so instert a null at the begining
                 * to align values with apply.
                 */
                const instanceArgs: any | any[] = [undefined].concat(_instanceArgs);
                instance = new (Function.prototype.bind.apply(_constructor, instanceArgs))();
            }
            this._instances.set(_constructor['name'], instance);
        }
        this.logger.debug({ data: { instance: !!instance } }, 'init() <-- ');
        return instance;
    }

    /**
     *
     * @param target class to attach endpoints to.
     * @param resource to map this endpoint to.
     * @param action to map this endpoint to.
     * @param endpoint function that will take event: HTTPEvent as the first argument
     *        and context: LambdaContext as the second argument. It is expected that
     *        it will return Promise<HTTPResponse>
     * @param descriptor the property descriptor from the method, used to bind the
     *        validation back to the endpoint in the handle() phase
     * @param condition?, that if provided, will test if this endpoint should even
     *        be invoked.
     * @param priority? of this endpoint. A higher value indicates it should be
     *        executed ahead of other endpoints. Defaults to 0.
     *
     */
    public static register(
        target: any,
        endpoint: Function,
        descriptor: PropertyDescriptor,
        condition?: SQSEventCondition,
        priority?: number
    ): void {
        const paths: SQSRoute[] = Reflect.getMetadata(METADATA_KEY, target.constructor) || [];
        paths.push({
            descriptor: descriptor,
            endpoint: endpoint,
            condition: condition,
            priority: priority || 0,
        });

        Reflect.defineMetadata(METADATA_KEY, paths, target.constructor);
    }

    public static registerValidation(target: any, validation: Validation): void {
        const validators: Validation[] = Reflect.getMetadata(METADATA_VALIDATE_KEY, target.constructor) || [];
        validators.push(validation);
        Reflect.defineMetadata(METADATA_VALIDATE_KEY, validators, target.constructor);
    }

    public static getValidators(): Validation[] {
        return this._validations;
    }

}