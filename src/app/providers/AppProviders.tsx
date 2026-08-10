import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import GlobalStyles from "@/styles/GlobalStyles";
import theme from "@/styles/theme";

// 렌더링마다 새로 만들지 않도록 module scope에서 한 번만 생성
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

interface AppProvidersProps {
  children: ReactNode;
}

/**
 * 앱 전역 Provider를 한 곳에서 조립
 */
export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
