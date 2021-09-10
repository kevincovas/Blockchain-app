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
        //Comprobamos que haya servicios
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se han encontrado servicios
        }
        return { ok:true, found: true, data: result.rows}; //Se han encontrado servicios
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}

const getHairdressers = async() => {
    
    try {
        const result = await pool.query(getHairdressersSQL);
        //Comprobamos que haya peluqueros
        if(result.rowCount < 1) {
           return { ok: true, found: false }; //No se han encontrado peluqueros
        }
        return { ok:true, found: true, data: result.rows}; //Se han encontrado peluqueros
    }catch(e) {
           return { ok: false, data: e.toString() };
       }
}

module.exports = {
   getHairdressers , getServices
};