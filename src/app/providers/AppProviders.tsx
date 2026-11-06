import { ThemeProvider } from "@emotion/react";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { queryClient } from "@/app/queryClient";
import GlobalStyles from "@/styles/GlobalStyles";
import theme from "@/styles/theme";

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
