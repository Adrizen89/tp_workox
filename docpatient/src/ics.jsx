import React from 'react';

function generateICS({ startDate, endDate, summary, description }) {
  const start = new Date(startDate).toISOString().replace(/-|:|\.\d+/g, '');
  const end = new Date(endDate).toISOString().replace(/-|:|\.\d+/g, '');
  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
DTSTART:${start}
DTEND:${end}
SUMMARY:${summary}
DESCRIPTION:${description}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${summary}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export default generateICS;
