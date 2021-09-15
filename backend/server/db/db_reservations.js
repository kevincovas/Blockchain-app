// Skeleton API
const { pool } = require("./db");
// Mail API
const mailjet = require("../utils/mail");

// Get Hairdressers by Role
const getHairdressersSQL = `select people.id , people.name , surname_1 , COALESCE(surname_2 , '') as surname_2 from users 
inner join people on people.id = users.id 
inner join user_roles on user_roles.user_id = users.id
inner join roles on roles.id = user_roles.role_id
where roles.name = 'hairdresser'; `;

// Get Products of type Service
const getServicesSQL = ` select id , name , description , duration , price from products where is_service = true `;

// Get Booked Services for one specific day
const getReservationsByDaySQL = ` select * from reservations where to_char(date_ini , 'YYYY-MM-DD') = $1 `;

// Add Reservation into Database
const addReservationSQL = ` insert into reservations ( person_id , booked_employee_id , created_by_id , date_ini , date_end )
values ( $1 , $2 , $3 , $4 , $5 ) returning id `;

// Add Booked Services into Database
const addBookedServicesSQL = `

insert into booked_services(reservation_id , product_id)
select
   $1, u.val
from
unnest($2::integer[]) as u(val);

`;

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
  date_end,
  booked_services
) => {
  try {
    // Add Reservation
    const result = await pool.query(addReservationSQL, [
      person_id,
      booked_employee_id,
      created_by_id,
      date_ini,
      date_end,
    ]);

    // Add Booked Services
    const result2 = await pool.query(addBookedServicesSQL, [
      result.rows[0].id,
      booked_services,
    ]);

    // Create QR Code



    // Send Mail
    let from_mail = "aitor.java@gmail.com";
    let from_name = "Aitor";
    let to_mail = "aitor.java@gmail.com";
    let to_name = "Aitor";
    let subject = "Test Email";
    let text_part = "Test Email Texto";
    let html_part =
      "<img src='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example' /> <h3>Dear passenger 1, welcome to <a href='Mailjet - Email Delivery Service for Marketing & Developer Teams'>Mailjet</a>!</h3><br />May the delivery force be with you!";
    let custom_id = "AppGettingStartedTest";
    await mailjet.sendEmail(
      from_mail,
      from_name,
      to_mail,
      to_name,
      subject,
      text_part,
      html_part,
      custom_id
    );

    return { ok: true, data: result.rows[0].id };
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

// Add Services to Booked Reservation
const addBookedServices = async (reservation_id, booked_services) => {
  try {
    const result = await pool.query(addBookedServicesSQL, [booked_services]);
    return { ok: true, data: result };
  } catch (e) {
    return { ok: false, data: e.toString() };
  }
};

module.exports = {
  getHairdressers,
  getServices,
  getReservationsByDay,
  addReservation,
  addBookedServices,
};
