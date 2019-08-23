import React from 'react';
import './App.css';

import moment from 'moment';

const year = '2016';
console.log(moment(year).startOf('year').format('DD-MM-YYYY'))

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

function App() {
  var a = moment('2013-01-01');
  var b = moment(a).add(1, 'months');

  var days = [];
  for (var m = moment(a); m.isBefore(b); m.add(1, 'days')) {
    days.push(moment(m))
  }

  var nBefore = days[0].weekday();
  var nAfter = 6 - days[days.length - 1].weekday();

  days.unshift(...[...Array(nBefore).keys()].map(() => null));
  days.push(...[...Array(nAfter).keys()].map(() => null));

  function renderMonth(start) {
    var end = moment(start).add(1, 'months');

    var days = [];
    for (var m = moment(start); m.isBefore(end); m.add(1, 'days')) {
      days.push(moment(m))
    }

    var nBefore = days[0].weekday();
    var nAfter = 6 - days[days.length - 1].weekday();

    days.unshift(...[...Array(nBefore).keys()].map(() => null));
    days.push(...[...Array(nAfter).keys()].map(() => null));

    
  }

  var month = (
    chunk(days, 7).map((row, index) => {
      return (
        <tr key={ index }>
          {
            row.map((day, index) => {
              return (!!day ?
                <td class="day" key={ index }>
                  <div class="day-content">{ day.date() }</div>
                </td> :
                <td class="day old" key={ index } />
              )
            })
          }
        </tr>
      )
    })
  )
  

  return (
    <div className="App">
      <table class="month">
        <thead>
          <tr>
            <th class="month-title" colspan="7">
              January
            </th>
          </tr>
          <tr>
            <th class="day-header">Su</th>
            <th class="day-header">Mo</th>
            <th class="day-header">Tu</th>
            <th class="day-header">We</th>
            <th class="day-header">Th</th>
            <th class="day-header">Fr</th>
            <th class="day-header">Sa</th>
          </tr>
        </thead>
        <tbody>
          { month }
        </tbody>
      </table>
    </div>
  );
}

export default App;
