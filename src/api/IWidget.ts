export interface IWidget {
  id: string;
  name: string;

  start(): Promise<void>;
  stop(): Promise<void>;
}
