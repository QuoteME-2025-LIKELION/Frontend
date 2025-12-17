export interface Group {
  id: number;
  // leaderNickname: string;
  motto?: string;
  name?: string;
  memberCount?: number;
  members?:
    | [
        {
          id: number;
          nickname: string;
          profileImage: string;
          introduction: string;
        },
      ]
    | [];
  totalQuoteCount?: number;
  createdAt?: string;
  leaderNickname?: string;
}
