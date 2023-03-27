import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import startOfTomorrow from 'date-fns/startOfTomorrow';
import {
  tasks, Task, orderTasks, tags,
} from './index';
import { newTaskForm, renderTasks } from './display';

document.getElementById('add').addEventListener('click', () => {
  add();
});

export function add() {
  // Do some form validation and error checking at a later stage, including making sure a date is selected

  function getSelectedDeadline() {
    return document.getElementById('datepickerinput').value;
    // Don't need the below code anymore
    /* if (document.getElementById('today').checked) {
      return format(startOfToday(), 'yyyy-LL-dd');
    } if (document.getElementById('tomorrow').checked) {
      return format(startOfTomorrow(), 'yyyy-LL-dd');
    } */
  }
  console.log(`Function getSelectedDeadline ${getSelectedDeadline}`);
  const tagCheckboxes = document.querySelectorAll('input[name=tag]');
  console.log(`tagCheckboxes ${tagCheckboxes}`);
  function getChosenTags() {
    const arrayOfChosenTags = [];
    console.table(arrayOfChosenTags);
    for (let i = 0; i < tagCheckboxes.length; i++) {
      console.log(`i = ${i}`);
      const tagCheckbox = tagCheckboxes[i];
      if (tagCheckbox.checked) arrayOfChosenTags.push(tagCheckbox.value);
    }
    return arrayOfChosenTags;
  }

  // Define some constants for title, deadline, chosenTags, important
  const title = document.getElementById('new-task-title').innerHTML;
  const deadline = getSelectedDeadline();
  const chosenTags = getChosenTags();
  const important = document.getElementById('important').checked;

  // Add it to the tasks array

  new Task(title, deadline, important, chosenTags, false);

  console.table(tasks);

  newTaskForm.style.display = 'none';

  // Render the task list again
  renderTasks();
}

// Deadline selector on the new task form

const todayTickbox = document.getElementById('today');
const tomorrowTickbox = document.getElementById('tomorrow');
const todayLabel = document.getElementById('todaylabel');
const tomorrowLabel = document.getElementById('tomorrowlabel');
const datepickerTickbox = document.getElementById('datepicker');
const datepickerInput = document.getElementById('datepickerinput');

todayTickbox.addEventListener('click', () => {
  if (todayTickbox.checked === true) {
    todayTickbox.checked = false;
  } else {
    todayTickbox.checked = true;
    tomorrowTickbox.checked = false;
    datepickerTickbox.checked = false;
    todayLabel.classList.add('setDarkDate');
    tomorrowLabel.classList.remove('setDarkDate');
    datepickerTickbox.classList.remove('setDarkDate');
    datepickerInput.classList.remove('setDarkDate');
    datepickerInput.value = format(startOfToday(), 'yyyy-LL-dd');
  }
});

tomorrowTickbox.addEventListener('click', () => {
  if (tomorrowTickbox.checked === true) {
    tomorrowTickbox.checked = false;
  } else {
    tomorrowTickbox.checked = true;
    todayTickbox.checked = false;
    datepickerTickbox.checked = false;
    tomorrowLabel.classList.add('setDarkDate');
    todayLabel.classList.remove('setDarkDate');
    datepickerTickbox.classList.remove('setDarkDate');
    datepickerInput.classList.remove('setDarkDate');
    datepickerInput.value = format(startOfTomorrow(), 'yyyy-LL-dd');
  }
});

datepickerInput.addEventListener('click', () => {
  todayLabel.classList.remove('setDarkDate');
  tomorrowLabel.classList.remove('setDarkDate');
  datepickerInput.classList.add('setDarkDate');
  datepickerInput.showPicker();
});

export function updateCompletedStatus(data) {
  // if box is now checked, update task to complete
  // if box is now unchecked, update task to incomplete
  console.log(`The updateCompletedStatus command was called with data ${data}`);
  if (document.querySelector(`[data-task="${data}"]`).querySelector('input[type=checkbox]').checked) {
    console.log(`The box ${data} is checked`);
    tasks[data].completed = true;
  } else {
    console.log(`The box ${data} is not checked`);
    tasks[data].completed = false;
  }

  renderTasks();
}

// If clicking list item, expand list item to show an inline display

export function clickTask(data) {
  // expand list item to show an inline display
  document.querySelector(`[data-task="${data}"]`).querySelector('div').innerHTML = ''; // clear everything in the div
  const div = document.createElement('div');
  div.contentEditable = 'true';
  const taskText = document.createTextNode(tasks[data].title);
  div.appendChild(taskText);
  // Do some formatting
  if (tasks[data].completed === true) {
    /* checkbox.checked = true; */
    div.classList.add('checked');
  }
  if (tasks[data].important === true) {
    div.classList.add('important');
  }
  document.querySelector(`[data-task="${data}"]`).querySelector('div').appendChild(div);
}

{ /*
<div>

    <div contenteditable="true" id="new-task-title">This is what you'll see when creating a new task</div>

    <p><strong>Deadline: </strong>

        <input type="radio" name="date" class="hiddenradio" id="today"><label for="today" class="date" id="todaylabel">Today</label>

        <input type="radio" name="date" class="hiddenradio" id="tomorrow"><label for="tomorrow" class="date" id="tomorrowlabel">Tomorrow</label>

        <input type="radio" name="date" class="hiddenradio" id="datepicker"><label for="datepicker">
            <input type="date" name="date" class="date" id="datepickerinput" onclick="selectDatePicker()">
         </label>

    </p>

    <p><strong>Tags:            </strong>

        <input type="checkbox" name="tag" id="amber-tag" class="hiddenradio" value="Personal">
        <label for="amber-tag" class="tag amber">Personal</label>

        <input type="checkbox" name="tag" id="blue-tag" class="hiddenradio" value="Work">
        <label for="blue-tag" class="tag blue">Work</label>

        <input type="checkbox" name="tag" id="green-tag" class="hiddenradio" value="Other">
        <label for="green-tag" class="tag green">Other</label>

    </p>
    <p><strong>Important: </strong><input type="checkbox" name="important" id="important"></p>
    <p><button id="add">Add</button><img src="bin.svg" alt="Bin" class="bin"></p>
*/ }
