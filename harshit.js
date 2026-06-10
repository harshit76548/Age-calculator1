window.addEventListener('DOMContentLoaded', function() {
  var today = new Date();
  document.getElementById('calcDate').value = formatDate(today);
});

function formatDate(date) {
  var y = date.getFullYear();
  var m = String(date.getMonth() + 1).padStart(2, '0');
  var d = String(date.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + d;
}

function calculateAge() {
  clearError();

  var dobInput = document.getElementById('dob').value;
  var calcInput = document.getElementById('calcDate').value;

  if (!dobInput) {
    showError('Please enter your date of birth.');
    return;
  }
  if (!calcInput) {
    showError('Please enter a calculation date.');
    return;
  }

  var dob = new Date(dobInput);
  var calcDate = new Date(calcInput);

  if (isNaN(dob.getTime())) {
    showError('Invalid date of birth.');
    return;
  }
  if (isNaN(calcDate.getTime())) {
    showError('Invalid calculation date.');
    return;
  }
  if (dob > calcDate) {
    showError('Date of birth cannot be after the calculation date.');
    return;
  }

  var years = calcDate.getFullYear() - dob.getFullYear();
  var months = calcDate.getMonth() - dob.getMonth();
  var days = calcDate.getDate() - dob.getDate();

  if (days < 0) {
    months--;
    var prevMonth = new Date(calcDate.getFullYear(), calcDate.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  var msPerDay = 1000 * 60 * 60 * 24;
  var totalDays = Math.floor((calcDate - dob) / msPerDay);
  var totalMonths = years * 12 + months;
  var totalHours = totalDays * 24;
  var totalMins = totalHours * 60;

  var nextBdayText = getNextBirthday(dob, calcDate);
  var zodiac = getZodiac(dob);

  var weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var birthDay = weekDays[dob.getDay()];

  document.getElementById('ageYears').textContent = years;
  document.getElementById('ageMonths').textContent = months;
  document.getElementById('ageDays').textContent = days;
  document.getElementById('totalMonths').textContent = totalMonths.toLocaleString();
  document.getElementById('totalDays').textContent = totalDays.toLocaleString();
  document.getElementById('totalHours').textContent = totalHours.toLocaleString();
  document.getElementById('totalMinutes').textContent = totalMins.toLocaleString();
  document.getElementById('nextBdayText').textContent = nextBdayText;
  document.getElementById('zodiacIcon').textContent = zodiac.symbol;
  document.getElementById('zodiacText').textContent = zodiac.sign;
  document.getElementById('dayText').textContent = 'Born on ' + birthDay;

  document.getElementById('results').classList.add('visible');
}

function getNextBirthday(dob, calcDate) {
  var thisYear = calcDate.getFullYear();
  var nextBday = new Date(thisYear, dob.getMonth(), dob.getDate());

  if (nextBday <= calcDate) {
    nextBday = new Date(thisYear + 1, dob.getMonth(), dob.getDate());
  }

  var msPerDay = 1000 * 60 * 60 * 24;
  var diff = Math.ceil((nextBday - calcDate) / msPerDay);

  if (diff === 0) return 'Birthday today!';
  if (diff === 1) return 'Birthday tomorrow!';
  return 'Birthday in ' + diff + ' days';
}

function getZodiac(dob) {
  var month = dob.getMonth() + 1;
  var day = dob.getDate();

  var signs = [
    { sign: 'Capricorn',   symbol: '♑', from: [12,22], to: [1,19]  },
    { sign: 'Aquarius',    symbol: '♒', from: [1,20],  to: [2,18]  },
    { sign: 'Pisces',      symbol: '♓', from: [2,19],  to: [3,20]  },
    { sign: 'Aries',       symbol: '♈', from: [3,21],  to: [4,19]  },
    { sign: 'Taurus',      symbol: '♉', from: [4,20],  to: [5,20]  },
    { sign: 'Gemini',      symbol: '♊', from: [5,21],  to: [6,20]  },
    { sign: 'Cancer',      symbol: '♋', from: [6,21],  to: [7,22]  },
    { sign: 'Leo',         symbol: '♌', from: [7,23],  to: [8,22]  },
    { sign: 'Virgo',       symbol: '♍', from: [8,23],  to: [9,22]  },
    { sign: 'Libra',       symbol: '♎', from: [9,23],  to: [10,22] },
    { sign: 'Scorpio',     symbol: '♏', from: [10,23], to: [11,21] },
    { sign: 'Sagittarius', symbol: '♐', from: [11,22], to: [12,21] }
  ];

  for (var i = 0; i < signs.length; i++) {
    var z = signs[i];
    var fm = z.from[0], fd = z.from[1];
    var tm = z.to[0],   td = z.to[1];

    if (fm > tm) {
      if ((month === fm && day >= fd) || (month === tm && day <= td) ||
          (month > fm) || (month < tm)) {
        return z;
      }
    } else {
      if ((month === fm && day >= fd) || (month === tm && day <= td) ||
          (month > fm && month < tm)) {
        return z;
      }
    }
  }

  return { sign: 'Unknown', symbol: '?' };
}

function showError(msg) {
  document.getElementById('errorMsg').textContent = msg;
  document.getElementById('results').classList.remove('visible');
}

function clearError() {
  document.getElementById('errorMsg').textContent = '';
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Enter') calculateAge();
});