import { useEffect, useState } from "react";

type ApiError = {
  error: string;
};

type ApiMessage = {
  id: number;
  message: string;
};

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

const BASE_URL = "http://localhost:3000/api/todos";

function App() {
  const [title, setTitle] = useState("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const rawRes = await fetch(BASE_URL);
      const res = await rawRes.json<Todo[] | ApiError>();
      if ("error" in res) {
        setError(res.error);
      } else {
        setTodos(res);
      }
    };
    fetchData();
  }, []);

  const handleAdd = async () => {
    const rawRes = await fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: title }),
    });
    const res = await rawRes.json<Todo | ApiError>();
    if ("error" in res) {
      setError(res.error);
      return;
    }

    setTodos((currentTodos) => [...currentTodos, res]);
    setTitle("");
  };

  const handleDelete = async (id: number) => {
    const rawRes = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
    });
    const res = await rawRes.json<ApiMessage | ApiError>();

    if ("error" in res) {
      setError(res.error);
      return;
    }

    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  const handleToggle = async (id: number, completed: boolean) => {
    const rawRes = await fetch(`${BASE_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ completed: !completed }),
    });
    const res = await rawRes.json<ApiMessage | ApiError>();
    if ("error" in res) {
      setError(res.error);
      return;
    }

    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  return (
    <>
      <div>
        <input
          placeholder="タイトル"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <button onClick={handleAdd}>追加</button>
      </div>
      {error ? <p>{error}</p> : null}
      <div>
        {todos.map((todo) => {
          return (
            <div key={todo.id}>
              <p>{todo.title}</p>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => handleToggle(todo.id, todo.completed)}
              />
              <button onClick={() => handleDelete(todo.id)}>削除</button>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
