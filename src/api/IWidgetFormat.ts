export interface IWidgetFormat {
  start(): Promise<void>;
  stop(): Promise<void>;
}
