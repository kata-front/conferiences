import { useCallback, useEffect, useState } from 'react';
import { v4 } from 'uuid';

import useSocket from './utils/hooks/socket/useSocket';
import { useNavigate } from 'react-router';

const SOCKET_URL = 'http://localhost:3000';

function App() {
  const socket = useSocket(SOCKET_URL);
  const [rooms, setRooms] = useState<string[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    const handleRoomsList = (rooms: string[]) => {
      console.log(rooms);
      setRooms(rooms);
    };

    socket.on('ROOMS_LIST', handleRoomsList);

    return () => {
      socket.off('ROOMS_LIST', handleRoomsList);
    };
  }, [socket]);

  const onSubmit = useCallback((id?: string) => {
    if (!id) {
      const id = v4();

      navigate(`/room/${id}`);
    } else {
      navigate(`/room/${id}`);
    }
  }, [navigate])

  return (
    <div className="app-shell">
      <div className="home-layout">
        <header className="home-header">
          <span className="availability">
            <span className="availability-dot" />
            Online
          </span>
          <h1 className="home-title">
            Conference Rooms
          </h1>
          <p className="home-description">
            Create a new room or join an existing one to start your call.
          </p>
        </header>

        <div className="create-room-row">
          <button
            type="button"
            onClick={() => onSubmit()}
            className="create-room-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Room
          </button>
        </div>

        <section className="rooms-section">
          <div className="section-heading">
            <h2>
              Available Rooms
            </h2>
            <span className="room-count">
              {rooms.length}
            </span>
          </div>

          {rooms.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6"
                  aria-hidden="true"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <p className="empty-title">No rooms yet</p>
              <p className="empty-copy">
                Be the first to create a conference room.
              </p>
            </div>
          ) : (
            <ul className="room-list">
              {rooms.map((roomId) => (
                <li key={roomId}>
                  <button
                    type="button"
                    onClick={() => onSubmit(roomId)}
                    className="room-row"
                  >
                    <div className="room-row-main">
                      <span className="room-icon">
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
                      <span className="room-id">
                        {roomId}
                      </span>
                    </div>
                    <span className="join-label">
                      Join
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <footer className="connection-note">
          Connected to {SOCKET_URL}
        </footer>
      </div>
    </div>
  );
}

export default App;
