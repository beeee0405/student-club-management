export const debug = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    // use console.debug for debug-level messages
    // eslint-disable-next-line no-console
    console.debug(...args);
  }
};

export const info = (...args: any[]) => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log(...args);
  }
};

export const warn = (...args: any[]) => {
  // eslint-disable-next-line no-console
  console.warn(...args);
};

export const error = (...args: any[]) => {
  // Always log errors
  // eslint-disable-next-line no-console
  console.error(...args);
};

export default { debug, info, warn, error };
