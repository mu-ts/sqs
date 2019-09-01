import { SQSBody } from './SQSBody';

export interface SQSSerializer {

    deserializeBody(eventBody: string | undefined): SQSBody<any>;

}