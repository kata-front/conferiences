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
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 text-slate-100 antialiased">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-12">
        <header className="mb-10 flex flex-col items-start gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wider text-indigo-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Online
          </span>
          <h1 className="bg-linear-to-r from-white to-indigo-300 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Conference Rooms
          </h1>
          <p className="text-sm text-slate-400">
            Create a new room or join an existing one to start your call.
          </p>
        </header>

        <div className="mb-10">
          <button
            type="button"
            onClick={() => onSubmit()}
            className="group inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-900/40 transition-all hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-xl hover:shadow-indigo-800/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 active:translate-y-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 transition-transform group-hover:rotate-90"
              aria-hidden="true"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Create Room
          </button>
        </div>

        <section className="flex-1">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">
              Available Rooms
            </h2>
            <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-400">
              {rooms.length}
            </span>
          </div>

          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-700/70 bg-slate-900/40 px-6 py-16 text-center">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-500">
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
              <p className="text-sm font-medium text-slate-300">No rooms yet</p>
              <p className="mt-1 text-xs text-slate-500">
                Be the first to create a conference room.
              </p>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {rooms.map((roomId) => (
                <li key={roomId}>
                  <button
                    type="button"
                    onClick={() => onSubmit(roomId)}
                    className="group flex w-full items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3.5 text-left transition-all hover:border-indigo-500/50 hover:bg-slate-800/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-indigo-500/20 to-purple-500/20 text-indigo-300">
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
                      <span className="truncate font-mono text-sm text-slate-300 group-hover:text-slate-100">
                        {roomId}
                      </span>
                    </div>
                    <span className="ml-4 inline-flex shrink-0 items-center gap-1 rounded-lg bg-indigo-600/10 px-3 py-1.5 text-xs font-semibold text-indigo-300 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      Join
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
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

        <footer className="mt-12 text-center text-xs text-slate-600">
          Connected to {SOCKET_URL}
        </footer>
      </div>
    </div>
  );
}

export default App;
