// Skeleton API
const { pool } = require("./db");

// Get Hairdressers by Role
const getHairdressersSQL = `select people.id , people.name , surname_1 , COALESCE(surname_2 , '') as surname_2 from users 
inner join people on people.id = users.id 
inner join user_roles on user_roles.user_id = users.id
inner join roles on roles.id = user_roles.role_id
where roles.name = 'hairdresser'; `;

// Get Products of type Service
const getServicesSQL = ` select id , name , description , duration from products where is_service = true `;

// Get Booked Services for one specific day
const getReservationsByDaySQL = ` select * from reservations where to_char(date_ini , 'YYYY-MM-DD') = $1 `;

// Add Reservation into Database
const addReservationSQL = ` insert into reservations ( person_id , booked_employee_id , created_by_id , date_ini , date_end )
values ( $1 , $2 , $3 , $4 , $5 ) returning id `;

// Add Booked Services into Database
const addBookedServicesSQL = ` insert into tab1(col1,col2)
select
   1, u.val
from
   unnest(array[4,5]) as u(val); `

const getServices = async () => {
  try {
    const result = await pool.query(getServicesSQL);
    //Check if services
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //Services not found
    }
    return { ok: true, found: true, data: result.rows }; //Services found
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const getHairdressers = async () => {
  try {
    const result = await pool.query(getHairdressersSQL);
    //Check if employees
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //Employees not found
    }
    return { ok: true, found: true, data: result.rows }; //Employees found
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

const getReservationsByDay = async (DATE) => {
  try {
    const result = await pool.query(getReservationsByDaySQL, [DATE]);
    //Check Reservations in one day
    if (result.rowCount < 1) {
      return { ok: true, found: false }; //Not reservations this day
    }
    return { ok: true, found: true, data: result.rows }; //We have reservations this day
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

// Add Reservation and obtain ID
const addReservation = async (
  person_id,
  booked_employee_id,
  created_by_id,
  date_ini,
  date_end
) => {
  try {
    const result = await pool.query(addReservationSQL, [
      person_id,
      booked_employee_id,
      created_by_id,
      date_ini,
      date_end,
    ]);
    return { ok: true, data: result.rows[0].id };
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

// Add Services to Booked Reservation
const addBookedServices = async(booked_services) => {

}

module.exports = {
  getHairdressers,
  getServices,
  getReservationsByDay,
  addReservation,
  addBookedServices
};
