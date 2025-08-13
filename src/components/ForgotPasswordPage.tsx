import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ForgotPasswordPageProps {
  resetPassword: (email: string) => Promise<{ error: string | null }>;
}

function ForgotPasswordPage({ resetPassword }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Reset error & success state when email changes
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const result = await resetPassword(email);
      if (result?.error) {
          setError(result.error);
          console.error("Error resetting password:", result.error);
        } else {
          setSuccess("Check your email for reset link.");
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
            Reset password
          </h2>
          <p>Enter email to request password reset.</p>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <label
                htmlFor="email"
                style={{ display: "block", marginBottom: "0.5rem" }}
              >
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              disabled={loading || !email}
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
              {loading ? "Loading..." : "Request reset"}
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

export default ForgotPasswordPage;
