import { useCallback, useEffect, useRef } from "react";
import useStateWithCallback from "./useStateWithCallback";
import useSocket from "./socket/useSocket";

const useWebRTC = (roomId: string) => {
  const socket = useSocket();
  const [clients, updateClients] = useStateWithCallback<string[]>([]);

  const addNewClient = useCallback(
    (newClient: string, cb?: () => void) => {
      updateClients(
        (prevClients) =>
          prevClients.includes(newClient)
            ? prevClients
            : [...prevClients, newClient],
        cb,
      );
    },
    [updateClients],
  );

  const localMediaStream = useRef<MediaStream | null>(null);
  const peerConnections = useRef<Record<string, RTCPeerConnection>>({});
  const peerMediaElements = useRef<Record<string, HTMLMediaElement | null>>({
    LOCAL_VIDEO: null,
  });

  useEffect(() => {
    const handleNewPeer = async ({ peerId, initiator }: { peerId: string; initiator: boolean }) => {
      if (peerId in peerConnections.current) {
        console.warn(`Already connected to peer ${peerId}`);
        return;
      }

      peerConnections.current[peerId] = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peerConnections.current[peerId].onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("RELAY_ICE_CANDIDATE", {
            target: peerId,
            candidate: event.candidate,
          });
        }
      }

      peerConnections.current[peerId].ontrack = ({ streams: [stream] }) => {
        addNewClient(peerId, () => {
          if (peerMediaElements.current[peerId]) {
            peerMediaElements.current[peerId].srcObject = stream;
          }
        })
      }

      localMediaStream.current?.getTracks().forEach((track) => {
        peerConnections.current[peerId].addTrack(track, localMediaStream.current!);
      });

      if (initiator) {
        const offer = await peerConnections.current[peerId].createOffer();
        await peerConnections.current[peerId].setLocalDescription(offer);

        socket.emit('RELAY_SDP', {
          peerId,
          remoteDescription: offer
        })
      }
    }

    socket.on("ADD_PEER", handleNewPeer);

    return () => {
      socket.off("ADD_PEER", handleNewPeer);
    };
  }, [addNewClient, socket])

  useEffect(() => {
    const handleIceCandidate = async ({ peerId, candidate }: { peerId: string; candidate: RTCIceCandidate }) => {
      await peerConnections.current[peerId].addIceCandidate(candidate);
    }

    socket.on("ICE_CANDIDATE", handleIceCandidate);

    return () => {
      socket.off("ICE_CANDIDATE", handleIceCandidate);
    };
  }, [socket])

  useEffect(() => {
    const setRemoteDescription = async ({ peerId, remoteDescription }: { peerId: string; remoteDescription: RTCSessionDescription }) => {
      await peerConnections.current[peerId].setRemoteDescription(remoteDescription);

      const answer = await peerConnections.current[peerId].createAnswer();
      await peerConnections.current[peerId].setLocalDescription(answer);

      socket.emit('RELAY_SDP', {
        peerId,
        remoteDescription: answer
      })
    }

    socket.on("SESSION_DESCRIPTION", setRemoteDescription);

    return () => {
      socket.off("SESSION_DESCRIPTION", setRemoteDescription);
    };
  }, [socket])

  useEffect(() => {
    const handleRemovePeer = ({ peerId }: { peerId: string }) => {
      const peerConnection = peerConnections.current[peerId];

      if (peerConnection) {
        peerConnection.close();
        delete peerConnections.current[peerId];
      }

      delete peerMediaElements.current[peerId];

      updateClients((prevClients) =>
        prevClients.filter((clientId) => clientId !== peerId),
      );
    };

    socket.on("REMOVE_PEER", handleRemovePeer);

    return () => {
      socket.off("REMOVE_PEER", handleRemovePeer);
    };
  }, [socket, updateClients])

  useEffect(() => {
    async function getMedia() {
      localMediaStream.current = await navigator.mediaDevices.getDisplayMedia({
        audio: true,
        video: true,
      });
    }

    getMedia()
      .then(() => {
        console.log(roomId);
        socket.emit("JOIN_ROOM", roomId);

        addNewClient("LOCAL_VIDEO", () => {
          if (peerMediaElements.current["LOCAL_VIDEO"]) {
            peerMediaElements.current["LOCAL_VIDEO"]!.srcObject =
              localMediaStream.current;
          }
        });
      })
      .catch(console.error);

      return () => {
        localMediaStream.current?.getTracks().forEach((track) => track.stop());
        socket.emit("LEAVE_ROOM", roomId);
      }
  }, [addNewClient, roomId, socket]);

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
