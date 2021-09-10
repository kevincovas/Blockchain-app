const HOST = `http://localhost:8080`

export const register = async ({ email, password }) => {
  const response = await fetch(`${HOST}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json();
  return json;
}

export const login = async ({ email, password }) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${HOST}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json();
  console.log(`json de la funcion login de api ${JSON.stringify(json)}`);
  return {json, token};
}

export const getAllTodos = async () => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${HOST}/todos`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });
  const todoList = await response.json();
  return todoList;
}

export const addTodo = async (text) => {
  const token = localStorage.getItem('token');
  const response = await fetch(`${HOST}/todos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ text }),
  });
  const newTodo = await response.json();
  return newTodo;
}
