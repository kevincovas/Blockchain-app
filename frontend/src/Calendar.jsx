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
	const [test, setDisabledDays] = useState([new Date(2021, 8, 12)]);
	
	  // On click a day, change state
  function handleDayClick(day, { selected }) {
   setState({
      selectedDay: selected ? undefined : day,
    });
  }
	
	// Init Values
	useEffect(() => { /* Buscaré las citas disponibles ése día */ }, [state.selectedDay]);	

	
	return ( 


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
		disabledDays={test}
		  
		  
        />

		<p>{state.selectedDay
            ? state.selectedDay.toLocaleDateString()
            : 'Selecciona el día'}</p>

      </div>


	);
}

export default Calendar ;

/*

// Calendar Class
export default class Calendar extends React.Component {

  // Get Props
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.state = {
      selectedDay: null,
    };
  }

  // On click a day, change state
  handleDayClick(day, { selected }) {
    this.setState({
      selectedDay: selected ? undefined : day,
    });
  }

  // Render Element
  render() {
    return (
      <div>
        <DayPicker
          selectedDays={this.state.selectedDay}
          onDayClick={this.handleDayClick}
		  
locale="es"
      months={MONTHS}
      weekdaysLong={WEEKDAYS_LONG}
      weekdaysShort={WEEKDAYS_SHORT}
      firstDayOfWeek={1}
 showOutsideDays 	  
		  
        />
        <p>
          {this.state.selectedDay
            ? this.state.selectedDay.toLocaleDateString()
            : 'Selecciona el día'}
        </p>
      </div>
    );
  }
  
  
  
}

*/