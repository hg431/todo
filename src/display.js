import isTomorrow from 'date-fns/isTomorrow';
import isToday from 'date-fns/isToday';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import startOfTomorrow from 'date-fns/startOfTomorrow';
import isBefore from 'date-fns/isBefore';
import PlusIcon from './icons/plus.svg';
import {
  tasks, Task, tags, orderTasks, view, list, editTask,
} from './index';
import { updateCompletedStatus, add } from './newTask';

export default class View {
  constructor() {
    console.log('The constructor is firing'); // Yes but it's not displaying because I later delete it
    this.container = this.getElement('#container');
    this.newtask = this.createElement('li');
    this.newtask.id = 'newtask';
    this.plusimage = this.createElement('img');
    this.plusimage.src = 'plus.svg';
    this.div = this.createElement('div');
    this.div.textContent = 'New task...';
    this.newtask.append(this.plusimage, this.div);
    this.container.append(this.newtask);
    this.newtask.addEventListener('click', () => {
      this.createNewTaskForm();
    });
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  getDeadline(i) {
    const date = parseISO(tasks[i].deadline);
    if (isBefore(date, startOfToday())) {
      return 'Overdue';
    } if (isTomorrow(date)) {
      return 'Tomorrow';
    } if (isToday(date)) {
      return 'Today';
    } if (differenceInDays(addDays(startOfToday(), 6), date) >= 0) {
      return format(date, 'EEEE');
    }
    return format(date, 'd MMM');
  }

  createNewTaskForm() {
    const form = this.createElement('li');
    form.id = 'newtaskform';
    const checkbox = this.createElement('input');
    checkbox.type = 'checkbox';
    const div = this.createElement('div');
    div.innerHTML = `<div contenteditable="true" id="new-task-title">This is what you'll see when creating a new task</div>
    <p><strong>Deadline: </strong>
        <input type="radio" name="date" class="hiddenradio" id="today"><label for="today" class="date" id="todaylabel">Today</label>
        <input type="radio" name="date" class="hiddenradio" id="tomorrow"><label for="tomorrow" class="date" id="tomorrowlabel">Tomorrow</label>
        <input type="radio" name="date" class="hiddenradio" id="datepicker"><label for="datepicker">
            <input type="date" name="date" class="date" id="datepickerinput">
         </label>
    </p>
    <p><strong>Tags: </strong> <span id="newtagcontainer"></span>
    </p>
    <p><strong>Important: </strong><input type="checkbox" name="important" id="important"></p>
    <p><button id="add">Add</button><img src="bin.svg" alt="Bin" class="bin"></p>`;
    form.append(checkbox, div);
    const newtask = this.getElement('#newtask');
    newtask.after(form);
    this.getElement('#add').addEventListener('click', () => {
      add();
    });
    const todayTickbox = document.getElementById('today');
    const tomorrowTickbox = document.getElementById('tomorrow');
    const todayLabel = document.getElementById('todaylabel');
    const tomorrowLabel = document.getElementById('tomorrowlabel');
    const datepickerTickbox = document.getElementById('datepicker');
    const datepickerInput = document.getElementById('datepickerinput');
    todayTickbox.addEventListener('click', () => {
      if (!todayTickbox.checked) {
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
      if (!tomorrowTickbox.checked) {
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
    this.renderTags('newtask');
  }

  renderTags(instruction, data) {
    console.table(list.tags);
    for (let i = 0; i < list.tags.length; i++) {
      const checkbox = this.createElement('input', 'hiddenradio');
      checkbox.type = 'checkbox';
      checkbox.name = 'tag';
      checkbox.setAttribute('data-id', list.tags[i].id);
      const tagColour = list.tags[i].colour.toLowerCase();
      const label = this.createElement('label', 'tag');
      label.classList.add(tagColour);
      label.textContent = list.tags[i].name;
      if (instruction === 'newtask') {
        checkbox.id = `${tagColour}-tag`;
        label.htmlFor = `${tagColour}-tag`;
        this.getElement('#newtagcontainer').append(checkbox, label);
      } else if (instruction === 'edittask') {
        checkbox.id = `${tagColour}-tag`;
        label.htmlFor = `${tagColour}-tag`;
        this.getElement(`[data-tagcontainerid="${data}"]`).append(checkbox, label);
      } else {
        checkbox.id = `show-${tagColour}-tag`;
        label.htmlFor = `show-${tagColour}-tag`;
        this.getElement('#tagcontainer').append(checkbox, label);
      }
      // This will be a bug when there are multiple tags of the same colour
    }
  }

  renderTasks() {
    orderTasks();
    console.table(tasks);
    const dynamicListElements = document.querySelectorAll('main ul li');
    for (let z = 1; z < dynamicListElements.length; z++) { // Removes third li onwards
      dynamicListElements[z].parentElement.removeChild(dynamicListElements[z]);
    }

    for (let i = 0; i < tasks.length; i++) {
      const li = this.createElement('li');
      li.setAttribute('data-task', i);
      const checkbox = this.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('click', () => {
        updateCompletedStatus(i);
      });
      const div = this.createElement('div');
      div.addEventListener('click', () => {
        this.displayEditTasksForm(i);
      }, { once: true });
      const span = this.createElement('span', 'date');
      div.textContent = tasks[i].title;
      span.textContent = this.getDeadline(i);
      if (tasks[i].completed) {
        checkbox.checked = true;
        div.classList.add('checked');
      }
      if (tasks[i].important) {
        div.classList.add('important');
      }
      for (let y = 0; y < tasks[i].chosenTags.length; y++) {
        if (tasks[i].chosenTags[y] !== '') {
          const tagSpan = this.createElement('span', 'tag');
          const tag = list.tags.find((e) => e.id === Number(tasks[i].chosenTags[y]));
          tagSpan.classList.add(tag.colour.toLowerCase());
          tagSpan.textContent = tag.name;
          div.append(tagSpan);
        }
      }

      li.append(checkbox, div);
      div.append(span);
      container.append(li);
    }
  }

  displayEditTasksForm(data) {
    // expand list item to show an inline display
    document.querySelector(`[data-task="${data}"]`).querySelector('div').innerHTML = ''; // clear everything in the div
    const div = this.createElement('div');
    div.contentEditable = 'true';
    div.textContent = tasks[data].title;
    if (tasks[data].completed) {
      div.classList.add('checked');
    }
    if (tasks[data].important) {
      div.classList.add('important');
    }
    const p = this.createElement('p');
    p.innerHTML = `<strong>Deadline: </strong>
        <input type="radio" name="date" class="hiddenradio" id="datepicker"><label for="datepicker">
            <input type="date" name="date" class="date" id="datepickerinput">
         </label>
         <p><strong>Tags: </strong> <span data-tagcontainerid="${data}"></span></p>
         <p><strong>Important: </strong><input type="checkbox" name="important" id="important"></p>
    <p><button id="edit">Edit</button><img src="bin.svg" alt="Bin" class="bin"></p>`;
    document.querySelector(`[data-task="${data}"]`).querySelector('div').append(div, p);
    const datepicker = this.getElement('#datepickerinput');
    datepicker.value = tasks[data].deadline;
    this.renderTags('edittask', data);
    const { chosenTags } = tasks[data];
    for (let i = 0; i < chosenTags.length; i++) {
      if (chosenTags[i] !== '') {
        const tagElement = this.getElement(`[data-id="${chosenTags[i]}"]`);
        if (tagElement);
        tagElement.checked = true;
      }
      if (tasks[data].important) {
        this.getElement('#important').checked = true;
      }
    }
  }

  editTaskRequest(data) {
    // Do some form validation and error checking at a later stage, including making sure a date is selected
    const title = this.getElement(`li[data-task="${data}"] div div`).textContent;
    const deadline = this.getElement(`li[data-task="${data}"] div p label input.date`).value;
    const important = this.getElement(`li[data-task="${data}"] div p label input.checkbox`).checked;

    /*     const chosenTags = function () {
      const arrayOfChosenTags = [];
      const tagCheckboxes = document.querySelectorAll('#newtagcontainer input[name=tag]');
      for (let i = 0; i < tagCheckboxes.length; i++) {
        console.log(`new tag i = ${i}`);
        const tagCheckbox = tagCheckboxes[i];
        if (tagCheckbox.checked) arrayOfChosenTags.push(tagCheckbox.dataset.id);
      }
      console.table(arrayOfChosenTags);
      return arrayOfChosenTags;
    }; */
    const completed = true;
    editTask(data, title, deadline, important, chosenTags, completed);
  }
}
// Show and hide the settings
const footer = document.getElementById('footer');

document.getElementById('cog').addEventListener('click', () => {
  footer.style.display = 'grid';
});
document.getElementById('close').addEventListener('click', () => {
  footer.style.display = 'none';
});
