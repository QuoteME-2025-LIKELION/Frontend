import { useOAuthCallbackFlow } from "@/hooks/useAuthQueries";

export default function OAuthCallback() {
  useOAuthCallbackFlow();

  return null;
}
