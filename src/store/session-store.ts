import { create } from 'zustand';
import { Session, Device } from '@/types';

interface SessionState {
  activeSessions: Map<number, Session>;
  timers: Map<number, { startTime: string; elapsedSeconds: number }>;
  addSession: (device: Device, session: Session) => void;
  removeSession: (deviceId: number) => void;
  updateElapsed: (deviceId: number, seconds: number) => void;
  getSession: (deviceId: number) => Session | undefined;
  getElapsed: (deviceId: number) => number;
}

export const useSessionStore = create<SessionState>((set, get) => ({
  activeSessions: new Map(),
  timers: new Map(),

  addSession: (device, session) => {
    set((state) => {
      const newSessions = new Map(state.activeSessions);
      newSessions.set(device.id, session);
      const newTimers = new Map(state.timers);
      const now = Math.floor(Date.now() / 1000);
      const start = Math.floor(new Date(session.startTime).getTime() / 1000);
      const elapsedSeconds = Math.max(0, now - start);
      newTimers.set(device.id, {
        startTime: session.startTime,
        elapsedSeconds,
      });
      return { activeSessions: newSessions, timers: newTimers };
    });
  },

  removeSession: (deviceId) => {
    set((state) => {
      const newSessions = new Map(state.activeSessions);
      newSessions.delete(deviceId);
      const newTimers = new Map(state.timers);
      newTimers.delete(deviceId);
      return { activeSessions: newSessions, timers: newTimers };
    });
  },

  updateElapsed: (deviceId, seconds) => {
    set((state) => {
      const newTimers = new Map(state.timers);
      const timer = newTimers.get(deviceId);
      if (timer && !isNaN(seconds) && seconds >= 0) {
        newTimers.set(deviceId, { ...timer, elapsedSeconds: seconds });
      }
      return { timers: newTimers };
    });
  },

  getSession: (deviceId) => {
    return get().activeSessions.get(deviceId);
  },

  getElapsed: (deviceId) => {
    const timer = get().timers.get(deviceId);
    return timer?.elapsedSeconds ?? 0;
  },
}));
