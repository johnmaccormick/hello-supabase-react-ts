import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { User } from "@supabase/supabase-js";
import { Link } from "react-router-dom";
import ErrorBox from "./ErrorBox";
import SuccessBox from "./SuccessBox";

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
    <div className="page-center">
      <div className="form-card">
        <h2 className="page-title">
          {isSignUp ? "Create Account" : "Sign In"}
        </h2>
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

          <div>
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input
              id="password"
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <p className="centered-link">
            <Link to="/forgot-password" className="primary-link">
              Forgot your password?
            </Link>
          </p>

          <button
            type="submit"
            disabled={loading || !email || !password}
            className="btn-primary"
          >
            {loading ? "Loading..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        {error && <ErrorBox message={error} />}

        {success && <SuccessBox message={success} />}

        <div className="form-footer">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="btn-primary"
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
