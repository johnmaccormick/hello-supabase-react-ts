import { useState, useEffect } from "react";
import supabaseClient from "./utils/supabase";
import LoginForm from "./login-form-component";
import type { User } from "@supabase/supabase-js";

function Page() {
  const [todos, setTodos] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for existing session and listen for auth changes
  useEffect(() => {
    // Get initial session
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      console.log("Initial session:", session);
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      console.log("Auth state changed:", session);
      console.log(" ...session.user.email:", session?.user?.email ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

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
  }, []);

  // Sign in with email/password
  const signIn = async (email: string, password: string) => {
    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      console.error("Error signing in:", error.message);
    } else {
      console.log("Sign in successful");
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
    } else {
      console.log("Sign up successful");
    }
  };

  // Sign out
  const signOut = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      console.log("Sign out successful");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  function SignInOrOut() {
    if (!user) {
      return (
        <LoginForm signIn={signIn} signUp={signUp} />
      );
    } else {
      return (
        <div>
          Logged in as {user.email}.
          <button onClick={signOut}>Sign Out</button>
        </div>
      );
    }
  }

  function TodosList() {
    return (
      <>
        <p>Todos:</p>
        <div>
          {todos.map((todo) => (
            <li key={todo.id}>{todo.task}</li>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <SignInOrOut />
      <TodosList />
    </>
  );
}
export default Page;
