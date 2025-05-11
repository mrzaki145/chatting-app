export interface Message {
  id: string;
  userId: string;
  content: string;
  createdAt: Date;
  chatId: string;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
}
