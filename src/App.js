import React, { useState } from 'react';
import './App.css';

import moment from 'moment';

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

function App() {
  const [markedDays, setMarkedDays] = useState(['2019-05-01'])

  return (
    <div className="App">
      <div className="container" style={{ maxWidth: "600px" }}>
        <Year yearDate="2019-01-01" markedDays={markedDays} setMarkedDays={setMarkedDays} />
      </div>

      <ul class="list-group">
  <li class="list-group-item">
    <span class="dot"></span>
    <span class="align-middle">Cras justo odio</span>
  </li>
  <li class="list-group-item">Dapibus ac facilisis in</li>
  <li class="list-group-item">Morbi leo risus</li>
  <li class="list-group-item">Porta ac consectetur ac</li>
  <li class="list-group-item">Vestibulum at eros</li>
</ul>
    </div>
  )
}

function Year({ yearDate, markedDays, setMarkedDays }) {
  const day = moment(yearDate);

  var months = [];
  for (var i = 0; i < 12; i++) {
    months.push(moment(day))
    day.add(1, 'months')
  }

  var year = (
    chunk(months, 3).map((row, index) => {
      return(
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
    year
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
              var className = 'day'
              if (!!day && markedDays.includes(day.format('YYYY-MM-DD'))) {
                className += ' day-highlight'
              }
              return (!!day ?
                <td className={ className } key={ index } onClick={ (e) => onClick(e, day) } style={{ cursor: 'pointer' }}>
                  { day.date() }
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
    <table className="month">
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
