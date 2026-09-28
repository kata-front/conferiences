import type { FC } from "react";
import { useParams } from "react-router";
import useWebRTC from "../utils/hooks/useRTC";

const MicIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
);

const MicOffIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <line x1="2" y1="2" x2="22" y2="22" />
    <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V5a3 3 0 0 0-5.94-.6" />
    <path d="M19 10v2a7 7 0 0 1-.11 1.23M5 10v2a7 7 0 0 0 10.5 6.06" />
    <line x1="12" y1="19" x2="12" y2="22" />
    <line x1="8" y1="22" x2="16" y2="22" />
  </svg>
);

const CameraIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
  </svg>
);

const CameraOffIcon: FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="h-4 w-4"
    aria-hidden="true"
  >
    <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
    <line x1="2" y1="2" x2="22" y2="22" />
  </svg>
);

const RoomComponent: FC = () => {
  const { roomId } = useParams();

  const {
    clients,
    addPeerMediaElement,
    enabledVideoTrack,
    setEnabledVideoTrack,
    enabledAudioTrack,
    setEnabledAudioTrack,
  } = useWebRTC(roomId!);

  return (
    <div className="room-shell">
      <header className="room-header">
        <div className="room-identity">
          <span className="room-brand-mark">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <path d="M15 10l4.553-2.276A1 1 0 0 1 21 8.618v6.764a1 1 0 0 1-1.447.894L15 14M5 18h8a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2Z" />
            </svg>
          </span>
          <div className="room-heading">
            <p className="room-label">
              Room
            </p>
            <p className="room-code">
              {roomId}
            </p>
          </div>
        </div>

        <span className="participant-count">
          <span className="availability-dot" />
          {clients.length}{" "}
          {clients.length === 1 ? "participant" : "participants"}
        </span>
      </header>

      <main className="room-main">
        <div className="participant-grid">
          {clients.map((clientId) => {
            const isLocal = clientId === "LOCAL_VIDEO";

            return (
              <div
                key={clientId}
                className="video-tile"
              >
                <video
                  ref={(instance) => addPeerMediaElement(clientId, instance!)}
                  id={clientId}
                  muted={isLocal}
                  className="participant-video"
                  autoPlay
                  playsInline
                />
                <span className="participant-label">
                  <span
                    className={`participant-dot ${isLocal ? "is-local" : ""}`}
                  />
                  {isLocal ? "You" : `Peer ${clientId.slice(0, 6)}`}
                </span>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="call-controls">
        <div className="call-controls-inner">
          <button
            type="button"
            onClick={() => setEnabledAudioTrack(!enabledAudioTrack)}
            aria-pressed={enabledAudioTrack}
            className={`control-button ${
              enabledAudioTrack ? "is-enabled" : "is-disabled"
            }`}
          >
            {enabledAudioTrack ? <MicIcon /> : <MicOffIcon />}
            {enabledAudioTrack ? "Disable Audio" : "Enable Audio"}
          </button>
          <button
            type="button"
            onClick={() => setEnabledVideoTrack(!enabledVideoTrack)}
            aria-pressed={enabledVideoTrack}
            className={`control-button ${
              enabledVideoTrack ? "is-enabled" : "is-disabled"
            }`}
          >
            {enabledVideoTrack ? <CameraIcon /> : <CameraOffIcon />}
            {enabledVideoTrack ? "Disable Video" : "Enable Video"}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default RoomComponent;
