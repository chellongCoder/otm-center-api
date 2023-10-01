import { Server } from 'socket.io';

let ioInstance: any;

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  hello: () => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export default function createSocket(server: Express.Application) {
  if (!ioInstance) {
    const io = new Server<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>(3001);
    io.attachApp(server);
    ioInstance = io;
    // Your Socket.IO configuration goes here
  }
  return ioInstance;
}
