import { SNSClient, ServiceInputTypes, ServiceOutputTypes } from "@aws-sdk/client-sns";
import { Logger, LoggerService } from "@mu-ts/logger";

export class Client {
  private static _instance: Client;

  private readonly logger: Logger;

  private readonly client: Promise<SNSClient>;

  private constructor() {
    this.logger = LoggerService.named(this.constructor.name);
    this.client = new Promise((resolve) => resolve(new SNSClient({ region: process.env.REGION || process.env.AWS_REGION || process.env.AWS_LAMBDA_REGION })));
    this.logger.debug('init()');
  }

  public async send<Input extends ServiceInputTypes, Output extends ServiceOutputTypes>(command: Input): Promise<Output> {
    this.logger.trace('send()', 'input', { command });
    const client: SNSClient = await this.client;
    const response: Output = await client.send<Input, Output>(command as any);
    // It is unsafe to log the repsonse as it will have circular references.
    this.logger.trace('send()', 'response recieve');
    return response;
  }

  public static instance() {
    if (this._instance) return this._instance;
    this._instance = new Client();
    return this._instance;
  }
}