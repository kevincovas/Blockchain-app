// Get Hairdressers
export const getHairdressers = async (HOST) => {
  const token = localStorage.getItem('token');
  const response = await fetch( HOST + `/reservations/hairdressers`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });
  const hairdressersList = await response.json();
  return hairdressersList.results;
}

// Get Services
export const getServices = async (HOST) => {
  const token = localStorage.getItem('token');
  const response = await fetch( HOST + `/reservations/services`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`
    },
  });
  const servicesList = await response.json();
  return servicesList.results;
}