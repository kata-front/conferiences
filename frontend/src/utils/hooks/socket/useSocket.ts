import { io, type Socket } from "socket.io-client";

class SocketManager {
  private static instance: Socket | null = null;

  public static getInstance(url?: string): Socket {
    if (!SocketManager.instance) {
        SocketManager.instance = io(url || 'http://localhost:3000');
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

const useSocket = (url?: string) => SocketManager.getInstance(url);

export default useSocket