import { useEffect, useState } from "react";

const useControllTrack = (stream: MediaStream) => {
  const [enabledVideoTrack, setEnabledVideoTrack] = useState(true);
  const [enabledAudioTrack, setEnabledAudioTrack] = useState(true);

  useEffect(() => {
    if (stream) {
      stream
        .getVideoTracks()
        .forEach((track) => (track.enabled = enabledVideoTrack));
      stream
        .getAudioTracks()
        .forEach((track) => (track.enabled = enabledAudioTrack));
    }
  }, [enabledVideoTrack, enabledAudioTrack]);

  return {
    enabledVideoTrack,
    setEnabledVideoTrack,
    enabledAudioTrack,
    setEnabledAudioTrack,
  };
};

export default useControllTrack;