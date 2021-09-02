import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React , { useEffect, useState } from 'react';

// Month Translation in Spanish
const MONTHS = [
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

// Week Translation in Spanish
const WEEKDAYS_LONG = [
  'Domingo',
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
];

// Week Days in Spanish
const WEEKDAYS_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

function Calendar()
{
	// Set None day Selected
	const [state, setState] = useState({selectedDay: null});
	const [disabledDays, setDisabledDays] = useState();
	
	  // On click a day, change state
  function handleDayClick(day, { selected }) {
   setState({
      selectedDay: selected ? undefined : day,
    });	
  }
	
	function handleSubmit()
	{
		// TODO Crear Cita por WS
		event.preventDefault();
	}
	
	function handleChange()
	{
		
	}
	
	// Effects to Restart Calendar
	useEffect(() => { /* Buscaré las citas disponibles ése día */ }, [state.selectedDay]);	

	
	return ( 

<div>

 <form onSubmit={handleSubmit}>

 <label>
          Peluquero:
          
<select onChange={handleChange}>
  <option value="Pepe">Pepe</option>
  <option value="Antonio">Antonio</option>
  <option value="Jaime">Jaime</option>
  <option value="Luis">Luis</option>
</select>
		  
</label>
<br />
 <label>
          Servicios:
         
		 <select>
  <option value="Corte">Corte</option>
  <option value="Tinte">Tinte</option>
  <option value="Pestanas">Pestañas</option>
  <option value="Unas">Uñas</option>
</select>
		 
</label>

<div>
        <DayPicker
         
onDayClick={ handleDayClick }	  
locale="es"
      months={MONTHS}
      weekdaysLong={WEEKDAYS_LONG}
      weekdaysShort={WEEKDAYS_SHORT}
      firstDayOfWeek={1}
 showOutsideDays 	  
		  selectedDays={state.selectedDay}
		todayButton="Hoy"
		disabledDays={disabledDays}
		  
		  
        />

		<p>{state.selectedDay
            ? state.selectedDay.toLocaleDateString()
            : 'Selecciona el día'}</p>


      </div>

<input type="submit" value="Submit" />


</form>

</div>

	);
}

export default Calendar ;