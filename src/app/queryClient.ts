import { QueryClient } from "@tanstack/react-query";

// 렌더링마다 새로 만들지 않도록 module scope에서 한 번만 생성
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

