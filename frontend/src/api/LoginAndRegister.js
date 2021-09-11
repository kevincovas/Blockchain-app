const HOST = `http://localhost:8080`

export const register = async ({ email, password }) => {
  const response = await fetch(`${HOST}/users/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json();
  return json;
}

export const register_client = async ({name, surname_1, surname_2, gender, birth_date, phone}) => {
  const response = await fetch(`${HOST}/clients/registerClient`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name, surname_1, surname_2, gender, birth_date, phone}),
  });
  const json = await response.json();
  return json;
}

export const login = async ({ email, password }) => {
  const response = await fetch(`${HOST}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json();
  console.log(`json de la funcion login de api ${JSON.stringify(json)}`);
  return json;
}

