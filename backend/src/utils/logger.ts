export const logger = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    const entry = meta ? `${message} ${JSON.stringify(meta)}` : message;
    console.log(`[INFO] ${new Date().toISOString()} - ${entry}`);
  },
  error: (message: string, error?: unknown): void => {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error ?? '');
  },
};
