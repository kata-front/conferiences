import type { FC } from "react";
import { useParams } from "react-router";
import useWebRTC from "../utils/hooks/useRTC";

const RoomComponent: FC = () => {
  const { roomId } = useParams();

  const { clients, addPeerMediaElement } = useWebRTC(roomId!);

  console.log(clients);

  return <div>
    {clients.map((clientId) => (
      <video ref={instance => addPeerMediaElement(clientId, instance!)} key={clientId} id={clientId} muted={clientId === 'LOCAL_VIDEO'} autoPlay playsInline />
    ))}
  </div>;
};

export default RoomComponent;
