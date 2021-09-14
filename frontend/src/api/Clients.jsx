const HOST = `http://localhost:8080`

export const get_client = async () => {
    const response = await fetch(`${HOST}/clients`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    return setclientsList(json.results);
}

