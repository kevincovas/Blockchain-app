const HOST = `http://localhost:8080`

export const getPeopleByRoleExtended = async (role, token) => {
    const res = await fetch(`${HOST}/sales/get-people-by-role-extended/`, {
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

  export const updateClient = async (id, token) => {
    const response = await fetch(`${HOST}/clients/:id`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({id, name, surname_1, surname_2, gender, birth_date, phone, observations}),
    });
    const json = await response.json();
    return json;
  }



