import { expect } from 'chai';
import { describe, it } from 'mocha';

import { groupId, KEY } from '../../src/decorators/groupId';
import { QueueService } from '../../src/sugar/guts/QueueService';
import { queue } from '../../src/decorators/queue';

describe('@groupId', () => {
  it('to decorate field', () => {
    
    @queue('arn:to:topic')
    class User {
      @groupId
      public fieldName: string = 'field-1'
    }

    expect(User[QueueService.PREFIX]).to.have.property(KEY).that.equals('fieldName');
  })
})

