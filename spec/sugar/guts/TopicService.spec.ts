import { expect } from 'chai';
import { describe, it } from 'mocha';

import { QueueService } from '../../../src/sugar/guts/QueueService'; // Update the import path
import { queue } from '../../../src/decorators/queue';
import { deduplicationId } from '../../../src/decorators/deduplicationId';
import { groupId } from '../../../src/decorators/groupId';

describe('QueueService', () => {

  describe('getQueue', () => {
    it('should return topic from constructor metadata', () => {
      class MockClass {
        constructor() {
          this.constructor[QueueService.PREFIX] = { queue: 'someQueue' };
        }
      }

      const instance = new MockClass();
      expect(QueueService.getQueue(instance)).to.equal('someQueue');
    });
  });

  describe('getGroupId', () => {
    it('should return GroupId from instance', () => {
      @queue('x')
      class MockClass {
        @groupId
        public groupField: string = 'someGroupId'
      }

      const instance = new MockClass();
      expect(QueueService.getGroupId(instance)).to.equal('someGroupId');
    });
  });

  describe('getDeduplicationId', () => {
    it('should return DeduplicationId from instance', () => {
      @queue('x')
      class MockClass {
        @deduplicationId
        public deduplicationField: string = 'someDeduplicationId'
      }

      const instance = new MockClass();
      expect(QueueService.getDeduplicationId(instance)).to.equal('someDeduplicationId');
    });
  });
});
