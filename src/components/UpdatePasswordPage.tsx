import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabaseClient from "../utils/supabase";

interface UpdatePasswordPageProps {
  updatePassword: (email: string) => Promise<{ error: string | null }>;
}

function UpdatePasswordPage({ updatePassword }: UpdatePasswordPageProps) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
//   const navigate = useNavigate();

  // Handle the auth callback when user arrives from email.
  // Not necessary, but good to have this console message for debugging.
  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        // User is now in password recovery mode
        console.log("Ready to update password");
      }
    });
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
          <p>Enter new password.</p>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                htmlFor="newPassword"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                New password:
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
          {error && (
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#f8d7da",
                color: "#721c24",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                padding: "0.75rem",
                backgroundColor: "#f8d7da",
                color: "#139d2eff",
                border: "1px solid #f5c6cb",
                borderRadius: "4px",
                marginBottom: "1rem",
              }}
            >
              {success}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UpdatePasswordPage;
