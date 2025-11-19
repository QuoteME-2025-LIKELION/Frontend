# <div align="center"> QuoteMe 프론트엔드 레포지토리 </div>

> 개발 기간 : 2025.11.17. ~ 2025.12.19.

<br/>

## 개발 시작하기
 
```
git clone https://github.com/QuoteME-2025-LIKELION/Frontend.git
cd Frontend
npm install
npm run dev
```

<br/>

## 프론트엔드 팀원

<table>
  <thead>
    <tr>
      <th>
        <a href="https://github.com/zer0p01nt">
          <img src="https://avatars.githubusercontent.com/u/189887138?v=4" width="100" />
        </a>
      </th>
      <th>
        <a href="https://github.com/minaaa101">
          <img src="https://avatars.githubusercontent.com/u/183453942?v=4" width="100" />
        </a>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td align="center">백민영</td>
      <td align="center">이민아</td>
    </tr>
    <tr>
      <td align="center">
        <div>개발환경 설정, 날짜별 아카이브 조회, 알림 기능</div>
        <div>그룹 생성 및 관리, 친구 추가</div>
      </td>
      <td align="center">
        <div>로그인, 프로필 관리, 설정</div>
        <div>긴 글/짧은 글 쓰기, 태그 요청(콕 찌르기, 수정)</div>
      </td>
    </tr>
  </tbody>
</table>

<br/>

## 개발 관련 참고사항

- PR 전 꼭 `git pull origin develop` 으로 병합 확인 후 PR 해주세요~
- `theme.ts`에 색상은 물론 고정적으로 쓰이는 css 관련 값들 편하게 추가하셔도 괜찮습니다!
- 개발 관련 참고사항, 수정사항, 질문 등은 언제든 카톡하기~

> ### 커밋 메세지 컨벤션
- 커밋의 시작은 아래의 목록을 참고하여 gitmoji & 커밋이름 삽입
- 커밋의 끝맺음은 "~ 기능 추가", "~ 작업", "~ 개발" 과 같이 명사로 통일
```
🎉 Init: 프로젝트 세팅
✨ Feat: 새로운 기능 추가
🐛 Fix: 버그 수정
💄 Design: UI 스타일/디자인 수정
♻️ Refactor: 코드 리팩토링
✏️ Typo: 오타 수정,타입 수정
🚚 Rename: 폴더 구조 이동, 파일명 변경
🍱 Assets: 이미지, 폰트 등 리소스 추가/삭제
🔥 Del: 파일 삭제
📝 Docs: 문서 수정, 목데이터 작업 등
🔧 Chore: 설정파일 보완, 환경 설정
➕ Deps: 새로운 라이브러리 설치
➖ Deps: 불필요한 라이브러리 삭제
🔙 : 커밋 내용 복구
```
예시
```
✨ Feat: 메인페이지 개발
♻️ Refactor: 등록 플로우 - 글 작성 페이지 로직 정리
```


> ### 브랜치 전략
|태그이름|설명|
|--------|-------|
|main|실제 배포용 브랜치|
|develop|개발용 브랜치(기능 통합용)|
|feat/이슈번호/기능이름|새로운 기능 개발 시|
|refactor/이슈번호/기능이름|코드 리팩토링|
|fix/이슈번호/버그이름|버그 수정|
|design/이슈번호/요소|디자인 및 스타일 변경|
|chore/이슈번호/내용|설정, 의존성 등 기타 작업|

예시
```
feat/#12/login-page  // 로그인 기능 개발
refactor/#34/reduce-duplicated-code  // 코드 리팩토링
chore/#56/update-eslint  // eslint 설정 수정
```

<br/>
