import { useCallback, useEffect, useRef } from "react";
import useStateWithCallback from "./useStateWithCallback";
import useSocket from "./socket/useSocket";

const useWebRTC = (roomId: string) => {
  const socket = useSocket();
  const [clients, updateClients] = useStateWithCallback<string[]>([]);

  const addNewClient = useCallback(
    (newClient: string, cb?: () => void) => {
      if (!clients.includes(newClient)) {
        updateClients([...clients, newClient], cb);
      }
    },
    [clients, updateClients],
  );

  const localMediaStream = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const peerMediaElements = useRef<Record<string, HTMLMediaElement | null>>({
    LOCAL_VIDEO: null,
  });

  useEffect(() => {
    async function getMedia() {
      localMediaStream.current = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });
    }

    getMedia()
      .then(() => {
        socket.emit("JOIN_ROOM", roomId);

        addNewClient("LOCAL_VIDEO", () => {
          if (peerMediaElements.current["LOCAL_VIDEO"]) {
            peerMediaElements.current["LOCAL_VIDEO"]!.srcObject =
              localMediaStream.current;
          }
        });
      })
      .catch(console.error);
  }, []);

  const addPeerMediaElement = useCallback(
    (peerId: string, mediaElement: HTMLMediaElement) => {
      peerMediaElements.current[peerId] = mediaElement;

      if (
        peerId === "LOCAL_VIDEO" &&
        mediaElement &&
        localMediaStream.current
      ) {
        mediaElement.srcObject = localMediaStream.current;
      }
    },
    [],
  );

  return {
    clients,
    addPeerMediaElement,
  };
};

export default useWebRTC;
