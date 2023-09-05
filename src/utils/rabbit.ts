import amqp from 'amqplib';

export class RabbitClient {
  public connection: amqp.Connection;
  public channel: amqp.Channel;
  public queue: string;

  public static instances: Map<string, RabbitClient> = new Map();

  static getInstanceForQueue(queue: string) {
    const instance = RabbitClient.instances.get(queue);
    if (!instance) {
      const newInstance = new RabbitClient();
      this.instances.set(queue, newInstance);
      return newInstance;
    } else {
      return instance;
    }
  }

  async connect(url: string, queue: string): Promise<amqp.Connection> {
    try {
      if (this.connection != null) return this.connection;
      this.connection = await amqp.connect(url);
      await this.createQueue(queue);
      return this.connection;
    } catch (error) {
      throw error;
    }
  }

  async createQueue(queue: string) {
    this.queue = queue;
    this.channel = await this.connection.createChannel();
    await this.channel.assertQueue(queue);
  }

  async listen(process: (arg0: any, arg1: any) => void) {
    return this.channel.consume(this.queue, async message => {
      if (message) {
        const data = JSON.parse(message.content.toString());
        console.log(data.type);
        process(data.type, data.data);
        this.channel.ack(message);
      }
    });
  }

  async send(msg: any) {
    this.channel.sendToQueue(this.queue, Buffer.from(JSON.stringify(msg)), {
      persistent: true,
    });
    console.log(' [x] Sent %s: %s', this.queue, JSON.stringify(msg));
    // this.close();
  }

  async close() {
    if (this.channel) await this.channel.close();
    await this.connection.close();
  }

  handleError(error: any) {
    console.log(error);
  }

  handleClose() {
    console.log('close...');
  }
}
