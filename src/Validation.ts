import { SQSEventCondition } from './SQSEventCondition';

export interface Validation {
    descriptor: PropertyDescriptor;
    schema: object;
    validatorCondition?: SQSEventCondition;
}
