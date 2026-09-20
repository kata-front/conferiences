import type { FC } from "react";
import { useParams } from "react-router";
import useWebRTC from "../utils/hooks/useRTC";

const RoomComponent: FC = () => {
  const { roomId } = useParams();

  const clients = useWebRTC(roomId!);

  console.log(clients);

  return <div>Room</div>;
};

export default RoomComponent;
