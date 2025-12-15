export interface Group {
  id: number;
  // leaderNickname: string;
  motto?: string;
  name: string;
  memberCount?: number;
  members?:
    | [
        {
          id: number;
          nickname: string;
          profileImageUrl: string;
          bio: string;
        },
      ]
    | [];
  totalQuoteCount?: number;
  createdAt?: string;
}
