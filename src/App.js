import React, { useState, Fragment } from 'react';
import './App.css';

import moment from 'moment';
import { type } from 'os';

function loadMarkedDays() {
  return JSON.parse(localStorage.getItem('days')) || []
}

function saveMarkedDays(days) {
  localStorage['days'] = JSON.stringify(days)
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

function App() {
  const [currentYear, setCurrentYear] = useState(parseInt(moment().format('YYYY')))
  const [markedDays, setMarkedDays] = useState(loadMarkedDays())

  return (
    <div className="App">
      <div className="container" style={{ maxWidth: "700px" }}>
        <Year currentYear={currentYear} setCurrentYear={setCurrentYear}
        markedDays={markedDays} setMarkedDays={setMarkedDays} />
      </div>
     
    </div>
  )
}

function Year({ currentYear, setCurrentYear, markedDays, setMarkedDays }) {
  const yearDate = `${currentYear}-01-01`
  const day = moment(yearDate);

  function prevYear(e) {
    e.preventDefault()
    setCurrentYear(currentYear - 1)
  }

  function nextYear(e) {
    e.preventDefault()
    setCurrentYear(currentYear + 1)
  }

  var months = [];
  for (var i = 0; i < 12; i++) {
    months.push(moment(day))
    day.add(1, 'months')
  }

  var year = (
    chunk(months, 3).map((row, index) => {
      return (
        <div className="row" key={ index }>
          {
            row.map((element, index) => {
              return (
                <div className="col-sm-4" key={ index }>
                  <Month monthDate={element} markedDays={markedDays} setMarkedDays={setMarkedDays} />
                </div>
              )
            })
          }
        </div>
      )
    })
  )

  return (
    <Fragment>
      <h1>
        <button type="button" className="btn btn-link" onClick={prevYear}>←</button>
        { moment(yearDate).format('YYYY') }
        <button type="button" className="btn btn-link" onClick={nextYear}>→</button>
      </h1> 
      
      { year }
    </Fragment>
  )
}

function Month({ monthDate, markedDays, setMarkedDays }) {
  function onClick(e, day) {
    e.preventDefault();

    day = day.format('YYYY-MM-DD')

    const newMarkedDays = [...markedDays]

    if (!markedDays.includes(day)) {
      newMarkedDays.push(day)     
    } else {
      newMarkedDays.splice(newMarkedDays.indexOf(day), 1)
    }
    setMarkedDays(newMarkedDays)

    saveMarkedDays(newMarkedDays);

  }

  var a = moment(monthDate);
  var b = moment(a).add(1, 'months');

  var days = [];
  for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
    days.push(moment(m))
  }

  var nBefore = days[0].weekday();
  var nAfter = 6 - days[days.length - 1].weekday();

  days.unshift(...[...Array(nBefore).keys()].map(() => null));
  days.push(...[...Array(nAfter).keys()].map(() => null));

  var month = (
    chunk(days, 7).map((row, index) => {
      return (
        <tr key={ index }>
          {
            row.map((day, index) => {
              var className = (
                !!day && markedDays.includes(day.format('YYYY-MM-DD'))
                ? 'day day-highlight' : 'day' 
              )
              return (!!day ?
                <td className="day-box" key={ index } onClick={ (e) => onClick(e, day) }>
                  <div className={ className } style={{ padding: "2px" }}>
                    { day.date() }
                  </div>
                </td> :
                <td className="day old" key={ index } />
              )
            })
          }
        </tr>
      )
    })
  )
  
  return (
    <table className="month mb-3">
      <thead>
        <tr>
          <th className="month-title" colSpan="7">
            { a.format('MMMM') }
          </th>
        </tr>
        <tr>
          <th className="day-header">Su</th>
          <th className="day-header">Mo</th>
          <th className="day-header">Tu</th>
          <th className="day-header">We</th>
          <th className="day-header">Th</th>
          <th className="day-header">Fr</th>
          <th className="day-header">Sa</th>
        </tr>
      </thead>
      <tbody>
        { month }
      </tbody>
    </table>
  );
}

export default App;
