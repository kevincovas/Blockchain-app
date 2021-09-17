const HOST = `http://localhost:8080`

export const getPeopleByRoleExtended = async (role, token) => {
    const res = await fetch(`${HOST}/clients/get-people-by-role-extended/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({role}),
    });
    const response = await res.json();
    return response;
  };

  export const updateClient = async (client, token) => {
    const response = await fetch(`${HOST}/clients/${client.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(client),
    });
    const json = await response.json();
    return json;
  }



