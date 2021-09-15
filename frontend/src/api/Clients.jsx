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


