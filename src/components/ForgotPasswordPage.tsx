import { useEffect, useState } from "react";
import ErrorBox from "./ErrorBox";
import SuccessBox from "./SuccessBox";

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
    setError(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages
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
      <div className="page-center">
        <div className="form-card">
          <h2 className="page-title">Reset password</h2>
          <p>Enter email to request password reset.</p>
          <form onSubmit={handleSubmit} className="form-container">
            <div>
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                id="email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email}
              className="btn-primary"
            >
              {loading ? "Loading..." : "Request reset"}
            </button>
          </form>
          {error && <ErrorBox message={error} />}

          {success && <SuccessBox message={success} />}
        </div>
      </div>
    </>
  );
}

export default ForgotPasswordPage;
