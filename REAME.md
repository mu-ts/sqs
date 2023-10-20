# Summary

Easier AWS SQS interactions for both receipt and broadcasting of messages.

# Class Decoration

In orderto do all the neat behaviors around an objet, we need a class to associate the configurations with.

You can use any of the decoration from @mu-ts/serilialization and it will be applied before publishing.

```
import { queue, groupId, subject, deduplicationId } from '@mu-ts/sns';

@queue('some:arn:to:some:queue')
class User {
  public id: string = 'uuid'

  @groupId
  public group: string = 'blue'

  @deduplicationId
  public event: string = 'dedupe-1'

  @metadata()
  public owner: string ='owner-1'

  /**
   * Using the @mut-ts/serlization tag you can provide 'array' values
   * for message attributes.
   */
  @metadata((account: string ) => account.split('/'))
  public account: string = 'aprent/sub/child/account'
}
```

## Message Attributes

You can add message attributes via the @mu-ts/serilization library, by tagging each field with the @metadata() decorator.

## Behaviors

These are the commands you can use for interacting with an S3 bucket on a decorated object.

### add()

There are static/global functions and configurations as well as instance level ones.

Static

```
import { add } from '@mu-ts/sns';

const user: user = new User()
user.id = ''
...

await add(user);

```