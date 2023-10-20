import { expect } from 'chai';
import { describe, it } from 'mocha';

import { deduplicationId, KEY } from '../../src/decorators/deduplicationId';
import { QueueService } from '../../src/sugar/guts/QueueService';
import { queue } from '../../src/decorators/queue';

describe('@deduplicationId', () => {
  it('to decorate field', () => {
    
    @queue('arn:to:topic')
    class User {
      @deduplicationId
      public fieldName: string = 'field-1'
    }

    expect(User[QueueService.PREFIX]).to.have.property(KEY).that.equals('fieldName');
  })
})

