import { SQSEventCondition } from './SQSEventCondition';

export interface SQSRoute {
    endpoint: Function;
    descriptor: PropertyDescriptor;
    condition?: SQSEventCondition;
    priority: number;
}
