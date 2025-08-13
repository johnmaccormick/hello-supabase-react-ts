import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";

interface LoginPageProps {
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  signUp?: (
    email: string,
    password: string
  ) => Promise<{ error: string | null }>;
  user: User | null;
}

function LoginPage({ signIn, signUp, user }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to home if already logged in
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  // Reset error & success state when email or password changes
  // or when switching between sign in and sign up
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [email, password, isSignUp]);

  function isValidEmailDomain(emailStr: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(dickinson\.edu|arawatabill\.org)$/;

    return emailRegex.test(emailStr);
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null); // Clear previous errors
    try {
      if (isSignUp && !isValidEmailDomain(email)) {
        setError("Invalid email domain. Please use a dickinson.edu email.");
        return;
      }
      if (isSignUp && signUp) {
        const result = await signUp(email, password);
        if (result?.error) {
          setError(result.error);
          console.error("Error signing up:", result.error);
        } else {
          setSuccess("Check your email for verification link.");
        }
      } else {
        const result = await signIn(email, password);
        if (result?.error) {
          setError(result.error);
          console.error("Error signing in:", result.error);
        } else {
          setSuccess("Sign in successful. Redirecting...");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
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
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>



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

          <div>
            <label
              htmlFor="password"
              style={{ display: "block", marginBottom: "0.5rem" }}
            >
              Password:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

          <div style={{ textAlign: "center", marginTop: "1rem" }}>
            <Link
              to="/forgot-password"
              style={{
                color: "#007bff",
                textDecoration: "none",
                fontSize: "0.9rem",
              }}
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading || !email || !password}
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
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
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

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            {isSignUp
              ? "Already have an account? Sign in"
              : "Need an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
