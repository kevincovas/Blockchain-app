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
  console.log(`En la API: ${JSON.stringify(json)}`)
  return json;
}

export const register_client = async ({name, surname_1, surname_2, gender, birth_date, phone, user_id}) => {
  const response = await fetch(`${HOST}/clients/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({name, surname_1, surname_2, gender, birth_date, phone,user_id}),
  });
  const json = await response.json();
  return json;
}

export const login = async ({ email, password }) => {
  const response = await fetch(`${HOST}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const json = await response.json();
  
  return json;
}

export const changePassword = async ({email,password,newPassword,confirmNewPassword}) => {
  const response = await fetch(`${HOST}/users/changePassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email,password,newPassword, confirmNewPassword}),
  });
  const json = await response.json();
  
  return json;
}

export const user_exist = async ({ email}) => {
  const response = await fetch(`${HOST}/users/exist`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const json = await response.json();  
  console.log(`En la API: ${JSON.stringify(json)}`)
  return json.results;
}

export const rememberPassword = async ({ email}) => {
  const response = await fetch(`${HOST}/users/rememberPassword`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const json = await response.json();  
  console.log(`En la API: ${JSON.stringify(json)}`)
  return json.results;
}
