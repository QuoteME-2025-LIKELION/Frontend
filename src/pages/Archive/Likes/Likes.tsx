import Feed from "@/components/Feed/Feed";
import * as S from "./LikesStyle";

const MockData = [
  {
    username: "이민형",
    year: 1999,
    text: "자유로운 우리를 봐\n자유로워",
    tag: ["말랑이"],
  },
  {
    username: "김말랑",
    year: 2005,
    text: "말랑말랑",
    tag: ["말랑이", "몰랑이"],
  },
];

export default function Likes() {
  // onArchiveClick 함수 추가 예정
  return (
    <S.Container>
      {MockData.map((data, index) => (
        <Feed
          username={data.username}
          year={data.year}
          tag={data.tag}
          text={data.text}
          key={index}
          isInArchive={true}
          isLiked={true}
        />
      ))}
    </S.Container>
  );
}
