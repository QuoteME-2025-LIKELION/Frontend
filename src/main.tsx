import App from "@/App";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

async function enableMocking() {
  if (!import.meta.env.DEV) {
    return;
  }

  const { worker } = await import("./mocks/browser");
  return worker.start({
    onUnhandledRequest: "bypass", // 정의 안 한 백엔드 요청은 그냥 통과
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  );
});
