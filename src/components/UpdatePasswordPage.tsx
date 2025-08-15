import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import supabaseClient from "../utils/supabase";
import ErrorBox from "./ErrorBox";
import SuccessBox from "./SuccessBox";

interface UpdatePasswordPageProps {
  updatePassword: (email: string) => Promise<{ error: string | null }>;
}

function UpdatePasswordPage({ updatePassword }: UpdatePasswordPageProps) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  //   const navigate = useNavigate();

  // Handle the auth callback when user arrives from email.
  // Not necessary, but good to have this console message for debugging.
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is now in password recovery mode
        console.log("Ready to update password");
      } else {
        console.log(
          "Auth state changed, but the event was not PASSWORD_RECOVERY"
        );
        console.log("Event:", event);
        console.log("Session:", session);
      }
    });
  }, []);

  // Handle the auth session from the email link
  useEffect(() => {
    const handleAuthSession = async () => {
      const hash = window.location.hash;
      const routeAndParams = hash.substring(1); // Remove the initial '#'
      const paramsStartIndex = routeAndParams.indexOf("#");

      if (paramsStartIndex !== -1) {
        // Isolate the string containing only the parameters, starting after the second '#'
        const hashQuery = hash.substring(paramsStartIndex + 2);
        const hashParams = new URLSearchParams(hashQuery);
        const accessToken = hashParams.get("access_token");

        const refreshToken = hashParams.get("refresh_token");
        const tokenType = hashParams.get("token_type");
        const type = hashParams.get("type");

        await prepareSession(accessToken, refreshToken, type, hashParams);
        
      } else {
        setError(
          "No reset token found in URL. Please request a new password reset."
        );
        console.log("No parameters found in URL hash.");
      }

      async function prepareSession(
        accessToken: string | null,
        refreshToken: string | null,
        type: string | null,
        hashParams: URLSearchParams
      ) {
        if (accessToken && refreshToken) {
          // Set the session from the URL parameters
          const { data, error } = await supabaseClient.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (error) {
            console.error("Error setting session:", error.message);
            setError("Invalid or expired reset link: " + error.message);
          } else {
            setSessionReady(true);
          }
        } else if (type === "recovery") {
          // Sometimes the flow works differently for password recovery
          console.log(
            "Recovery type detected, waiting for auth state change..."
          );
          setTimeout(() => {
            supabaseClient.auth
              .getSession()
              .then(({ data: session, error }) => {
                console.log("Session after recovery:", { session, error });
                if (session?.session) {
                  setSessionReady(true);
                } else {
                  setError("No session found after recovery");
                }
              });
          }, 1000);
        } else {
          setError(
            "No valid reset token found. Please request a new password reset."
          );
          console.log("No valid reset token found in URL.");
          console.log("hashParams:", hashParams);
          console.log("accessToken:", accessToken);
          console.log("refreshToken:", refreshToken);
        }
      }
    };

    // Also listen for auth state changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log("Auth state change:", { event, session });
      if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
        setSessionReady(true);
      }
    });

    handleAuthSession();

    return () => subscription.unsubscribe();
  }, []);

  // Reset error & success state when email changes
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;

    setLoading(true);
    try {
      const result = await updatePassword(newPassword);
      if (result?.error) {
        setError(result.error);
        console.error("Error updating password:", result.error);
      } else {
        setSuccess("Password updated.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "calc(100vh - 80px)", // Account for header
          padding: "2rem",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "400px",
            padding: "2rem",
            border: "1px solid #e0e0e0",
            borderRadius: "8px",
            backgroundColor: "white",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ textAlign: "center", marginBottom: "2rem" }}>
            Update password
          </h2>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                htmlFor="newPassword"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Enter new password:
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "1rem",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !(newPassword.length >= 6)}
              style={{
                padding: "0.75rem",
                backgroundColor: loading ? "#ccc" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                marginTop: "1rem",
              }}
            >
              {loading ? "Loading..." : "Update password"}
            </button>
          </form>
          {error && <ErrorBox message={error} />}

          {success && (
            <>
              <SuccessBox message={success} />
              <p style={{ textAlign: "center" }}>
                <a
                  href="/hello-supabase-react-ts/#/"
                  style={{ color: "#007bff", textDecoration: "none" }}
                >
                  Go to home page
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default UpdatePasswordPage;
