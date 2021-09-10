const {pool} = require('./db');

const getHairdressersSQL = `
    select use_id , peo_id , peo_name , peo_surname_1 , COALESCE(peo_surname_2 , '') as peo_surname_2 from users 
inner join people on people.peo_user_id = users.use_id 
inner join user_roles on user_roles.uro_user_id = users.use_id
inner join roles on roles.rol_id = user_roles.uro_role_id
where roles.rol_name = 'hairdresser';
`;

const getServicesSQL = `
select pro_id , pro_name , pro_description from products where pro_is_service = true
`;

const getReservationsByDaySQL= `
select * from reservations where to_char(res_date_ini , 'YYYYMMDD') = $1
`

const getServices = async() => {
    
    try {
        const result = await pool.query(getServicesSQL);
        //Check if services
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //Services not found
        }
        return { ok:true, found: true, data: result.rows}; //Services found
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}

const getHairdressers = async() => {
    
    try {
        const result = await pool.query(getHairdressersSQL);
        //Check if employees
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //Employees not found
        }
        return { ok:true, found: true, data: result.rows}; //Employees found
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}


const getReservationsByDay = async(DATE) => {
	
	try {
        const result = await pool.query(getReservationsByDaySQL, [DATE]);
        //Check Reservations in one day
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //Not reservations this day
        }
        return { ok:true, found: true, data: result.rows}; //We have reservations this day
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
	
}
	
module.exports = {
   getHairdressers , getServices , getReservationsByDay
};