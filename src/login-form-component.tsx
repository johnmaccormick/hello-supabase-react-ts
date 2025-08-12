import { useState } from "react";

interface LoginFormProps {
  signIn: (email: string, password: string) => Promise<void>;
  signUp?: (email: string, password: string) => Promise<void>;
}

function LoginForm({ signIn, signUp }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignIn = () => {
    if (email && password) {
      signIn(email, password);
    }
  };

  const handleCheatSignIn = () => {
    signIn("jpm2244@yahoo.com", "123456");
  };

  const handleSignUp = () => {
    if (email && password && signUp) {
      signUp(email, password);
    }
  };

  return (
    <div>
      <h2>Please sign in</h2>
      <div>
        <label>Email:</label>
        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div>
        {signUp && <button onClick={handleSignUp}>Sign Up</button>}
        <button onClick={handleSignIn}>Log In</button>
        <button onClick={handleCheatSignIn}>cheat sign in</button>
      </div>
    </div>
  );
}

export default LoginForm;
