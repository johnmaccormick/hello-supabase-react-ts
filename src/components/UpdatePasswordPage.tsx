import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <div className="page-center">
        <div className="form-card">
          <h2 className="page-title">Update password</h2>
          <form onSubmit={handleSubmit} className="form-container">
            <div>
              <label htmlFor="newPassword" className="form-label">
                Enter new password (minimum 6 characters):
              </label>
              <input
                id="newPassword"
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !(newPassword.length >= 6)}
              className="btn-primary"
            >
              {loading ? "Loading..." : "Update Password"}
            </button>
          </form>
          {error && <ErrorBox message={error} />}

          {success && (
            <>
              <SuccessBox message={success} />
              <p className="centered-link">
                <Link to="/" className="primary-link">
                  Go to home page
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default UpdatePasswordPage;
