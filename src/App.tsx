import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import toast from "react-hot-toast";
import supabaseClient from "./utils/supabase";
import type { User } from "@supabase/supabase-js";
import Header from "./components/Header";
import LoginPage from "./components/LoginPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";

// Your main todos page component
function TodosPage({ user }: { user: User | null }) {
  const [todos, setTodos] = useState<any[]>([]);

  useEffect(() => {
    async function getTodos() {
      const { data: todos, error } = await supabaseClient
        .from("todos")
        .select();

      if (error) {
        console.error("Error fetching todos:", error);
        return;
      }

      if (todos && todos.length > 0) {
        setTodos(todos);
      }
    }

    getTodos();
  }, [user]);

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Your Todos</h2>
      {todos.length === 0 ? (
        <p>No todos found. Add some todos to your database!</p>
      ) : (
        <ul>
          {todos.map((todo) => (
            <li key={todo.id} style={{ marginBottom: "0.5rem" }}>
              {todo.task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session and listen for auth changes
  useEffect(() => {
    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in:", error.message);
      return { error: error.message };
    } else {
      console.log(
        "Sign in successful."
      );
      return { error: null };
    }
  };

  // Sign up with email/password
  const signUp = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signUp({
      email,
      password,
    });
    if (error) {
      console.error("Error signing up:", error.message);
      return { error: error.message };
      // toast.error(error.message);
    } else {
      console.log(
        "Sign up successful! Please check your email for verification."
      );
      // toast.success("Check your email for verification.");
      return { error: null };
    }
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    }
  };

  if (loading) {
    return <div style={{ padding: "2rem" }}>Loading...</div>;
  }

  // Reset password
  const resetPassword = async (email: string) => {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    if (error) {
      console.error("Error sending reset email:", error.message);
    } else {
      console.log("Password reset email sent!");
      // You might want to show a success message to the user
    }
  };

  return (
    <Router>
      <div>
        <Header user={user} signOut={signOut} />
        <main>
          <Routes>
            <Route path="/" element={<TodosPage user={user} />} />
            <Route
              path="/hello-supabase-react-ts"
              element={<TodosPage user={user} />}
            />
            <Route
              path="/login"
              element={
                <LoginPage signIn={signIn} signUp={signUp} user={user} />
              }
            />
            <Route
              path="/forgot-password"
              element={<ForgotPasswordPage resetPassword={resetPassword} />}
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
