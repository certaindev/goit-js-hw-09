import '../css/timer.css';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import Notiflix from 'notiflix';

const refs = {
  dateInputEl: document.querySelector('#datetime-picker'),
  timerEl: document.querySelector('.timer'),
  btnStartEl: document.querySelector('button[data-start]'),
  daysEl: document.querySelector('span[data-days]'),
  hoursEl: document.querySelector('span[data-hours]'),
  minutesEl: document.querySelector('span[data-minutes]'),
  secondsEl: document.querySelector('span[data-seconds]'),
};

refs.btnStartEl.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0].getTime());
    if (selectedDates[0].getTime() < Date.now()) {
      Notiflix.Notify.failure('Please choose a date in the future');
      refs.btnStartEl.disabled = true;
    } else {
      refs.btnStartEl.disabled = false;
    }
  },
};

flatpickr(refs.dateInputEl, options);

refs.btnStartEl.addEventListener('click', startCountDown);

function startCountDown() {
  let timer = setInterval(() => {
    let timeInterval = new Date(refs.dateInputEl.value) - Date.now();
    refs.btnStartEl.disabled = true;

    if (timeInterval >= 0) {
      const { days, hours, minutes, seconds } = convertMs(timeInterval);
      refs.daysEl.textContent = addLeadingZero(days);
      refs.hoursEl.textContent = addLeadingZero(hours);
      refs.minutesEl.textContent = addLeadingZero(minutes);
      refs.secondsEl.textContent = addLeadingZero(seconds);
    } else {
      clearInterval(timer);
      Notiflix.Notify.success('Countdown finished');
    }
  }, 1000);
}

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
