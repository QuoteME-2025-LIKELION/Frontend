import Feed from "../../../components/Feed/Feed";
import * as S from "./FeedList/FeedListStyled";

export default function FeedList() {
  const feedData = [
    {
      id: 1,
      profileImgUrl: "https://picsum.photos/200",
      username: "라라진",
      intro: "Seize the day",
      timestamp: "2025-01-25T10:00:00",
      text: "방귀 뀐 놈이 성낸다",
      tag: ["듀듀", "무니니"],
      isMine: false,
      isLiked: false,
      year: 2000,
    },
  ];
  const handleLike = () => {
    console.log("좋아요 클릭");
  };
  const handleShare = () => {
    console.log("공유 클릭");
  };
  const handleRequest = () => {
    console.log("태그 요청하기");
  };
  const handlePoke = () => {
    console.log("콕 찌르기");
  };
  const handleAdd = () => {
    console.log("태그 추가하기");
  };

  // isSilenced를 Feed 데이터상으로 안 받고, 렌더링할 때 명시적으로 false나 true로 설정하는 게 좋을 것 같아요.
  // 글 조회를 했을 때, 해당 날짜에 글이 없는 유저만 map을 따로 돌려서 isSilenced를 true로 넘겨주는 식으로요.
  // 구현 어려우실 것 같으면 제가 하겠습니당
  return <div></div>;
}
