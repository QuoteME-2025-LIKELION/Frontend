import MyQuoteFeed from "@/pages/Archive/MyQuotes/MyQuoteFeed/MyQuoteFeed";
import * as S from "./MyQuotesStyle";

const mockData = [
  {
    date: "10/31",
    day: "화요일",
    title: "방귀 뀐 놈이 성 낸다",
    desc: "오늘 말랑이랑 몰랑이랑 같이 카공을 했는데 갑자기 냄새가 났다. 갑자기 말랑이가 나를 의심하기 시작했고, 당황한 나는 어쩌구저쩌구 여기부턴 말줄임표",
    tag: ["말랑이", "몰랑이"],
  },
  {
    date: "10/30",
    day: "월요일",
    title: "여긴일부러30자거의딱맞춰서줄바꿈보려고길게써볼게요길다길어",
    desc: "",
    tag: [], // 일부러 태그 없이
  },
  {
    date: "10/29",
    day: "일요일",
    title: "어쩌구저쩌구",
    desc: "오늘은 완전 정말 대박 진짜 쩔게 어쩌구저쩌구였다 울라불라숑",
    tag: [
      "말랑이",
      "몰랑이",
      "말랑이",
      "몰랑이",
      "말랑이",
      "몰랑이",
      "말랑이",
      "몰랑이",
      "말랑이",
      "몰랑이",
    ],
  },
];

export default function MyQuotes() {
  return (
    <S.Container>
      {mockData.map((data, index) => (
        <MyQuoteFeed
          key={index}
          date={data.date}
          day={data.day}
          title={data.title}
          desc={data.desc}
          tag={data.tag}
          onClick={() => {}}
        />
      ))}
    </S.Container>
  );
}
