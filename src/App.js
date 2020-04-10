import React, { useState, useRef, Fragment, useEffect } from 'react';
import './App.css';

import {
  format, addDays, addMonths, isBefore, getDay, getDate
} from 'date-fns';

function getParam(name) {
  const urlParams = new URLSearchParams(window.location.search);
  const param = urlParams.get(name);
  return param;
}

function getCalendarName() {
  return getParam('calendar') || getParam('c') || 'default';
}

const chunk = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size)
  );

const CURRENT_DAY = format(new Date(), 'yyyy-MM-dd');
const CALENDAR = getCalendarName();

function loadMarkedDays() {
  return JSON.parse(localStorage.getItem(CALENDAR)) || [];
}

function saveMarkedDays(days) {
  localStorage[CALENDAR] = JSON.stringify(days);
}

function App() {
  const year = parseInt(format(new Date(), 'yyyy'));

  const [currentYear, setCurrentYear] = useState(year);
  const [markedDays, setMarkedDays] = useState(loadMarkedDays());

  return (
    <div className="App">
      <div className="container">
        <Year
          currentYear={currentYear} setCurrentYear={setCurrentYear}
          markedDays={markedDays} setMarkedDays={setMarkedDays}
        />
      </div>
    </div>
  );
}

function Year({ currentYear, setCurrentYear, markedDays, setMarkedDays }) {
  function prevYear(e) {
    e.preventDefault();
    setCurrentYear(currentYear - 1);
  }

  function nextYear(e) {
    e.preventDefault();
    setCurrentYear(currentYear + 1);
  }

  const months = Array.from(Array(12).keys()).map(
    i => addMonths(new Date(currentYear, 0, 1), i));

  var year = (
    chunk(months, 3).map((row, index) => {
      return (
        <div className="row" key={ index }>
          {
            row.map((element, index) => {
              return (
                <div className="col-sm-4" key={ index }>
                  <Month start={element} markedDays={markedDays}
                    setMarkedDays={setMarkedDays} />
                </div>
              );
            })
          }
        </div>
      );
    })
  );

  return (
    <Fragment>
      <h1>
        <button type="button" className="btn btn-link" onClick={prevYear}>
          ←
        </button>
        { currentYear }
        <button type="button" className="btn btn-link" onClick={nextYear}>
          →
        </button>
      </h1>
      { year }
    </Fragment>
  );
}

function Month({ start, markedDays, setMarkedDays }) {
  const days = [];
  for (var m = start; isBefore(m, addMonths(start, 1)); m = addDays(m, 1)) {
    days.push(m);
  }

  // Fill in weekdays from other months
  var nBefore = getDay(days[0]);
  var nAfter = getDay(6 - days[days.length - 1]);
  days.unshift(...[...Array(nBefore).keys()].map(() => null));
  days.push(...[...Array(nAfter).keys()].map(() => null));

  var month = (
    chunk(days, 7).map((row, index) => {
      return (
        <tr key={ index }>
          {
            row.map((day, index) => {
              return (
                (
                  !day ? <td className="day day-old" key={ index } /> :
                  <td className="day-box" key={ index }>
                    <Day
                      day={day}
                      markedDays={markedDays}
                      setMarkedDays={setMarkedDays}
                    />
                  </td>
                )
              );
            })
          }
        </tr>
      );
    })
  );

  return (
    <table className="month mb-3">
      <thead>
        <tr>
          <th className="month-title" colSpan="7">
            { format(start, 'MMMM') }
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

function Day({ day, markedDays, setMarkedDays }) {
  const ref = useRef();

  const [className, setClassName] = useState('day');

  useEffect(() => {
    if (format(day, 'yyyy-MM-dd') === CURRENT_DAY) {
      ref.current.scrollIntoView();
    }
  }, []);

  useEffect(() => {
    var className = 'day';

    if (markedDays.includes(format(day, 'yyyy-MM-dd'))) {
      className += ' day-highlight';
    }

    if (format(day, 'yyyy-MM-dd') === CURRENT_DAY) {
      className += ' day-current';
    }

    setClassName(className);
  }, [day]);

  function onClick(e, day) {
    e.preventDefault();

    day = format(day, 'yyyy-MM-dd');

    const newMarkedDays = markedDays.slice();

    if (!markedDays.includes(day)) {
      newMarkedDays.push(day);
    } else {
      newMarkedDays.splice(newMarkedDays.indexOf(day), 1);
    }

    setMarkedDays(newMarkedDays);
    saveMarkedDays(newMarkedDays);
  }

  return (
    <div className={ className } ref={ref}
    onClick={ (e) => onClick(e, day) }>
      { getDate(day) }
    </div>
  );
}

export default App;
