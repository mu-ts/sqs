import { expect } from 'chai';
import { describe, it } from 'mocha';

import { queue } from '../../src/decorators/queue';
import { QueueService } from '../../src/sugar/guts/QueueService';

describe('@topic', () => {
  it('to decorate class', () => {
    
    @queue('arn:to:topic')
    class User {}

    expect(User[QueueService.PREFIX]).to.have.property('queue').that.equals('arn:to:topic');
  })
})

