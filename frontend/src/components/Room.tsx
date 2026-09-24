import type { FC } from "react";
import { useParams } from "react-router";
import useWebRTC from "../utils/hooks/useRTC";

const RoomComponent: FC = () => {
  const { roomId } = useParams();

  console.log(roomId);
  const { clients, addPeerMediaElement } = useWebRTC(roomId!);

  console.log(clients);

  return <div>
    {clients.map((clientId) => (
      <video ref={instance => addPeerMediaElement(clientId, instance!)} key={clientId} id={clientId} muted={clientId === 'LOCAL_VIDEO'} className="size-75" autoPlay playsInline />
    ))}
  </div>;
};

export default RoomComponent;
