export const APP_NAME = "PlayStation Management System";
export const APP_VERSION = "1.0.0";

export const ADMIN_CREDENTIALS = {
  email: "admin@playstation.com",
  password: "Admin@123",
};

export const WORKER_CREDENTIALS = {
  email: "worker@playstation.com",
  password: "Worker@123",
};

export const ROLES = {
  ADMIN: "Admin",
  WORKER: "Worker",
} as const;

export const DEVICE_STATUS = {
  AVAILABLE: "Available",
  OCCUPIED: "Occupied",
  MAINTENANCE: "Maintenance",
} as const;

export const SESSION_STATUS = {
  ACTIVE: "Active",
  PAUSED: "Paused",
  ENDED: "Ended",
} as const;

export const STORAGE_KEYS = {
  TOKEN: "ps_auth_token",
  USER: "ps_user",
} as const;

export const QUERY_KEYS = {
  PRODUCTS: "products",
  DEVICES: "devices",
  SESSIONS: "sessions",
  INVOICES: "invoices",
  DASHBOARD: "dashboard",
} as const;

export const PAGE_SIZES = [10, 25, 50, 100] as const;

export const DEVICE_ICONS: Record<string, string> = {
  PS1: "🎮",
  PS2: "🎮",
  PS3: "🎮",
  PS4: "🎮",
  PS5: "🎮",
  Xbox: "🎮",
  PC: "🖥️",
  Switch: "🎮",
};

export const CHART_COLORS = {
  primary: "#3B82F6",
  secondary: "#0EA5E9",
  success: "#22C55E",
  warning: "#F59E0B",
  danger: "#EF4444",
  purple: "#8B5CF6",
  pink: "#EC4899",
  indigo: "#6366F1",
} as const;
