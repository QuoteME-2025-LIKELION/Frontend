import { useInitializeApp } from "@/app/bootstrap/useInitializeApp";
import AppProviders from "@/app/providers/AppProviders";
import AppRoutes from "@/app/router/AppRoutes";
import Spinner from "@/components/Spinner/Spinner";
import RootLayout from "@/layouts/RootLayout";

/**
 * 최상위 composition root
 * 라우팅, 전역 Provider, 초기화 로직 각각 분리
 */
function App() {
  const { isLoading } = useInitializeApp();

  // 인증 상태를 복원하기 전에는 보호 라우트가 먼저 평가되지 않도록 전역 로딩 보여줌
  if (isLoading) {
    return <Spinner />;
  }

  return (
    <RootLayout>
      {/* 전역 Provider는 라우트보다 바깥에서 한 번만 적용 */}
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </RootLayout>
  );
}

export default App;
