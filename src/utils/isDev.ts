// Libraries conventionally gate dev-only warnings on process.env.NODE_ENV so
// the consumer's bundler can strip them from production builds. The typeof
// guard keeps the package from throwing "process is not defined" when it's
// loaded without a bundler that defines it (e.g. straight from an ESM CDN).
declare const process: { env: { NODE_ENV?: string } } | undefined;

export function isDev(): boolean {
  return typeof process !== 'undefined' && process.env.NODE_ENV !== 'production';
}
