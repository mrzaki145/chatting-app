export interface Chat {
  id: string;
  name: string | null;
  users: { id: string; image: string | null }[];
  isGroup: boolean;
  messages: { id: string; content: string; createdAt: Date }[];
  createdAt: Date;
}
