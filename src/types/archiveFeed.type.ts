export interface ArchiveFeed {
  id: number;
  content: string;
  originalContent?: string;
  createDate: string;
  authorName: string;
  taggedMemberNames?: string[];
}
