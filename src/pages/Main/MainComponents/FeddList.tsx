import Feed from "@/components/Feed/Feed";
import * as S from "@/pages/Main/MainComponents/FeedListStyled";

export default function FeedList() {
    const feedData = [
    { id: 1,
    profileImgUrl: "https://picsum.photos/200",
    username: "라라진",
    intro: "Seize the day",
    timestamp: "2025-01-25T10:00:00",
    text: "방귀 뀐 놈이 성낸다",
    tag: ["듀듀", "무니니"],
    isMine: false,
    isLiked: false,
    year: 2000,},
    ]
    const handleLike = () => {console.log("좋아요 클릭");};
    const handleShare = () => {console.log("공유 클릭");};
    const handleRequest = () => {console.log("태그 요청하기");};
    const handlePoke = () => {console.log("콕 찌르기");};
    const handleAdd = () => {console.log("태그 추가하기");};

    return (
            <S.FeedList>
                {feedData.map((feed) => (
                    <Feed
                    key={feed.id}
                    profileImgUrl={feed.profileImgUrl}
                    username={feed.username}
                    intro={feed.intro}
                    timestamp={feed.timestamp}
                    text={feed.text}
                    tag={feed.tag}
                    isMine={feed.isMine}
                    isLiked={feed.isLiked}
                    isMyName={(name) => name === feed.username}
                    onLike={handleLike}
                    onShare={handleShare}
                    onRequest={handleRequest}
                    onPoke={handlePoke}
                    onAdd={handleAdd}
                    isInArchive={false}
                    year={feed.year}
                    />
                ))}
            </S.FeedList>
    )
    ;
}
