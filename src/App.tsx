// import React from 'react'

// export default function App() {
//   return <h1>Hello, TypeScript + React + Vite!</h1>
// }

import { useState, useEffect } from "react";
import supabaseClient from "./utils/supabase";

function Page() {
  const [todos, setTodos] = useState<any[]>([]);
  const [instruments, setInstruments] = useState<any[]>([]);

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

  useEffect(() => {
    async function getInstruments() {
      const { data: instruments, error } = await supabaseClient
        .from("instruments")
        .select();

      if (instruments && instruments.length > 0) {
        setInstruments(instruments);
      }
    }

    getInstruments();
  }, []);

  return (
    <>
      <p>Todos:</p>
      <div>
        {todos.map((todo) => (
          <li key={todo.id}>{todo.task}</li>
        ))}
      </div>
      <p>Instruments:</p>
      <div>
        {instruments.map((instruments) => (
          <li key={instruments.id}>{instruments.name}</li>
        ))}
      </div>
    </>
  );
}
export default Page;
