import { useOAuthCallbackFlow } from "@/hooks/queries/useAuthQueries";

export default function OAuthCallback() {
  useOAuthCallbackFlow();

  return null;
}
