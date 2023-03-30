import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import startOfTomorrow from 'date-fns/startOfTomorrow';
import {
  tasks, Task, tags, view,
} from './index';
import {
  newTaskForm, View, orderTasks,
} from './display';

/* document.getElementById('add').addEventListener('click', () => {
  add();
}); */

export function add() {
  // Do some form validation and error checking at a later stage, including making sure a date is selected
  const title = document.getElementById('new-task-title').innerHTML;
  const deadline = document.getElementById('datepickerinput').value;
  const important = document.getElementById('important').checked;
  function chosenTags() {
    const arrayOfChosenTags = [];
    const tagCheckboxes = document.querySelectorAll('#newtagcontainer input[name=tag]');
    for (let i = 0; i < tagCheckboxes.length; i++) {
      console.log(`new tag i = ${i}`);
      const tagCheckbox = tagCheckboxes[i];
      if (tagCheckbox.checked) arrayOfChosenTags.push(tagCheckbox.dataset.id);
    }
    console.table(arrayOfChosenTags);
    return arrayOfChosenTags;
  }
  new Task(title, deadline, important, chosenTags(), false);
  console.table(tasks);
  const newTaskForm = document.getElementById('newtaskform');
  newTaskForm.style.display = 'none';
  view.renderTasks();
}

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

  view.renderTasks();
}

// If clicking list item, expand list item to show an inline display
