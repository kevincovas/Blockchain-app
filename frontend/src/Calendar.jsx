import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import React , { useEffect, useState } from 'react';

// TODO Separar Constantes en otro fichero
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

// TODO Separar Constantes en otro fichero
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

// TODO Separar Constantes en otro fichero
// Week Days in Spanish
const WEEKDAYS_SHORT = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];

function Calendar()
{
	// Setters
	const [state, setState] = useState({selectedDay: null});
	const [disabledDays, setDisabledDays] = useState();
	const [todoList, setTodoList] = useState( ['Antonio' , 'Manolete' , 'Torete' , 'Juan Peinón'] );
	
	// TODO Read From Database
	// Variable Option Lists
	let list= null;
  if (todoList === null) {
    list = <div>Loading options...</div>
  } else {
    list = <select onChange={handleChange}>
      {todoList.map(todo =>  <option key={todo} value={todo}>{todo}</option> )}
    </select>
  }
  	
	// TODO Style ?
	  // On click a day, change state
  function handleDayClick(day, { selected }) {
   setState({
      selectedDay: selected ? undefined : day,
    });	
  }
	
	function handleSubmit()
	{
		// TODO Crear Cita por WS + check todos los campos correctos
		event.preventDefault();
	}
	
	// TODO Acciones al cambiar inputs
	function handleChange()
	{
	
	}
	
	// TODO Add more UseEffects
	// Effects to Restart Calendar
	useEffect(() => { /* Buscaré las citas disponibles ése día */ }, [state.selectedDay]);	
	
	return ( 

<div>

 <form onSubmit={handleSubmit}>

 <label>
          Peluquero:
 {list}          
		  		  
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
		todayButton="Éste mes"
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