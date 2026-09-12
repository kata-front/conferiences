import { io, type Socket } from "socket.io-client";

class SocketManager {
  private static instance: Socket | null = null;

  public static getInstance(): Socket {
    if (!SocketManager.instance) {
        SocketManager.instance = io('http://localhost:3000');
    }
    return SocketManager.instance!;
  }

  public static disconnect() {
    if (SocketManager.instance) {
      SocketManager.instance.disconnect();
      SocketManager.instance = null;
    }
  }
}

export default SocketManager;
