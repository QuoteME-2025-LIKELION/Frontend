export interface Feed {
  id: number;
  content: string;
  createDate: string;
  authorId: number;
  taggedUsers?: {
    id: number;
    nickname: string;
  }[];
}
