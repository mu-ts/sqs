import { SQSClient } from "@aws-sdk/client-sqs";

export class SQSClientWrapper {

  private static _instance: SQSClientWrapper;

  private snsClient: SQSClient;

  constructor(){
    this.snsClient = new SQSClient({region: (process.env.REGION as string || process.env.AWS_REGION as string || 'us-east-1')});
  }

  get client(): SQSClient {
    return this.snsClient;
  }

  set region(region: string) {
    this.snsClient = new SQSClient({region});
  }
  
  public static instance() {
    if(!SQSClientWrapper._instance) SQSClientWrapper._instance = new SQSClientWrapper();
    return SQSClientWrapper._instance;
  }
}