import 'mocha';
import { SQS, sqsListener } from '../src';
import { Context, SQSEvent } from 'aws-lambda';
import { MockSQSEvent } from './mocks/MockSQSEvent';
// import { MockContext } from './mocks/MockContext';
// import { MockHTTPAPIGatewayProxyResult } from './mocks/MockHTTPAPIGatewayProxyResult';

import * as chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import { MockPropertyDescriptor } from './mocks/MockPropertyDescriptor';

chai.use(chaiAsPromised);
chai.should();

describe('SNSListnerDecorator', () => {

    it('should ', () => {

        const decorator = sqsListener('/list');

        const event: SQSEvent = new MockSQSEvent();
        // const descriptor = decorator(event, 'key', new MockPropertyDescriptor().setValue(result));

        // const endpointPromise: Promise<HTTPAPIGatewayProxyResult> = descriptor.value(event, new MockContext(), []);
        //
        // return Promise.all([
        //     endpointPromise.should.eventually.have.property('body'),
        //     endpointPromise.should.eventually.have.property('body').that.equals('{"hello":"world"}'),
        //     endpointPromise.should.eventually.have.property('statusCode'),
        //     endpointPromise.should.eventually.have.property('statusCode').that.equals(200)
        // ]);
    });

    it('should ', () => {

        const decorator = sqsListener('/list');

        const event: SQSEvent = new MockSQSEvent();
        // const descriptor = decorator(event, 'key', new MockPropertyDescriptor().setValue(result));

        // const endpointPromise: Promise<HTTPAPIGatewayProxyResult> = descriptor.value(event, new MockContext(), []);
        //
        // return Promise.all([
        //     endpointPromise.should.eventually.have.property('statusCode'),
        //     endpointPromise.should.eventually.have.property('statusCode').that.equals(420)
        // ]);
    });

});