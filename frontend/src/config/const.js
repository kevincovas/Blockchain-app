// Server
export const HOST = `http://localhost:8080` ;

// Calendar Constant
// Month Translation in Spanish
export const MONTHS = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septimebre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

// Calendar Constant
// Week Translation in Spanish
export  const WEEKDAYS_LONG = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// Calendar Constant
// Week Days in Spanish
export const WEEKDAYS_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

// Calendar Constant
// TimeTable Available ( INT.DECIMAL where DECIMAL is % OF 1 HOUR / 60 SECONDS )
export const TIMETABLE = [
      9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16,
      16.5, 17, 17.5, 18, 18.5,
];

// Calendar Constants
export const CLOSING_TIME = 19;

// Sales Constant
// Payment Method
export const METHODS_OF_PAYMENT = [
  {
      id: 0,
      name: "Efectivo"
  }, 
  {
      id: 1, 
      name: "Tarjeta"
  }
];