import isTomorrow from 'date-fns/isTomorrow';
import isToday from 'date-fns/isToday';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import startOfTomorrow from 'date-fns/startOfTomorrow';
import isBefore from 'date-fns/isBefore';
import {
  tasks, Task, orderTasks, list, editTask, deleteTask, toggleCompletedStatus, populateStorage,
} from './index';

export default class View {
  constructor() {
    this.getElement('header ul li:first-child').classList.add('selected');
    this.container = this.getElement('#container');
    this.newtask = this.createElement('li', null, 'newtask');
    this.plusimage = this.createElement('img');
    this.plusimage.src = 'plus.svg';
    this.div = this.createElement('div');
    this.div.textContent = 'New task...';
    this.newtask.append(this.plusimage, this.div);
    this.container.append(this.newtask);
    this.newtask.addEventListener('click', () => {
      this.createNewTaskForm();
    });
    this.getElement('header ul li:first-child').addEventListener('click', () => {
      this.clickNav('tasks');
    });
    this.getElement('header ul li:nth-child(2)').addEventListener('click', () => {
      this.clickNav('tags');
    });
  }

  createElement(tag, className, idName) {
    const element = document.createElement(tag);
    if (className) element.classList.add(className);
    if (idName) element.id = idName;
    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);
    return element;
  }

  getDeadline(i) {
    if (tasks[i].deadline) {
      const date = parseISO(tasks[i].deadline);
      if (isBefore(date, startOfToday())) return 'Overdue';
      if (isTomorrow(date)) return 'Tomorrow';
      if (isToday(date)) return 'Today';
      if (differenceInDays(addDays(startOfToday(), 6), date) >= 0) return format(date, 'EEEE');
      return format(date, 'd MMM');
    }
  }

  createNewTaskForm() {
    const form = this.createElement('li', null, 'newtaskform');
    const checkbox = this.createElement('input');
    checkbox.type = 'checkbox';
    const div = this.createElement('div');
    div.innerHTML = `<div contenteditable="true" id="new-task-title">Enter your new task here...</div>
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
      this.addTaskRequest();
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
    this.selectText('#new-task-title');
    this.getElement('li#newtaskform div p img.bin').addEventListener('click', () => {
      this.deleteTaskRequest('newtaskform');
    }, { once: true });
  }

  createNewTagForm() {
    const form = this.createElement('li', null, 'newtaskform');
    const img = this.createElement('img');
    img.src = 'tag.svg';
    const div = this.createElement('div');
    div.innerHTML = `<div><label for="newtagname"><strong>Name: </strong></label><input type="text" name"newtagname"></div>
    <p><strong>Colour: </strong>
        <input type="radio" name="tagcolour" class="hiddenradio" id="tagcolourgreen" value="green"><label for="tagcolourgreen" class="tag green" id="greenlabel">Green</label>
        <input type="radio" name="tagcolour" class="hiddenradio" id="tagcolourblue" value="blue"><label for="tagcolourblue" class="tag blue" id="bluelabel">Blue</label>
        <input type="radio" name="tagcolour" class="hiddenradio" id="tagcolouramber" value="amber"><label for="tagcolouramber" class="tag amber" id="amberlabel">Amber</label>
    </p>
    <p><strong>Preview: </strong> <span id="tagpreview"></span>
    </p>
    <p><button id="add">Add</button><img src="bin.svg" alt="Bin" class="bin"></p>`;
    form.append(img, div);
    const tagSpan = this.createElement('span', 'tag');
    const newtask = this.getElement('#newtask');
    newtask.after(form);
    const tagcolourgreen = this.getElement('input#tagcolourgreen');
    const tagcolourblue = this.getElement('input#tagcolourblue');
    const tagcolouramber = this.getElement('input#tagcolouramber');
    function newTagPreview() {
      document.querySelector('span#tagpreview').innerHTML = '';
      if (tagcolourgreen.checked) tagSpan.classList.add('green');
      if (tagcolourblue.checked) tagSpan.classList.add('blue');
      if (tagcolouramber.checked) tagSpan.classList.add('amber');
      tagSpan.textContent = document.querySelector('li#newtaskform div div input').value;
      document.querySelector('#tagpreview').append(tagSpan);
    }

    this.getElement('#add').addEventListener('click', () => {
      this.addTagRequest();
    });
    this.getElement('li#newtaskform div div input').select();
    this.getElement('li#newtaskform div p img.bin').addEventListener('click', () => {
      this.deleteTaskRequest('newtaskform');
    }, { once: true });
    this.getElement('li#newtaskform div div input').addEventListener('keyup', () => {
      newTagPreview();
    });
    tagcolourblue.addEventListener('change', () => {
      newTagPreview();
    });
    tagcolouramber.addEventListener('change', () => {
      newTagPreview();
    });
    tagcolourgreen.addEventListener('change', () => {
      newTagPreview();
    });
  }

  selectText(element) {
    const range = document.createRange();
    range.selectNodeContents(document.querySelector(element));
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
  }

  createEditTasksForm(data) {
    document.querySelector(`[data-task="${data}"]`).querySelector('div').innerHTML = '';
    const div = this.createElement('div');
    div.contentEditable = 'true';
    div.textContent = tasks[data].title;
    if (tasks[data].completed) div.classList.add('checked');
    if (tasks[data].important) div.classList.add('important');
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
    for (let i = 0; i < chosenTags.length; i += 1) {
      if (chosenTags[i] !== '') {
        const tagElement = this.getElement(`[data-id="${chosenTags[i]}"]`);
        if (tagElement) tagElement.checked = true;
      }
    }
    if (tasks[data].important) this.getElement('input#important').checked = true;
    this.getElement('#edit').addEventListener('click', () => {
      this.editTaskRequest(data);
    }, { once: true });
    this.getElement(`[data-task="${data}"] img.bin`).addEventListener('click', () => {
      this.deleteTaskRequest(data);
    }, { once: true });
    this.selectText(`[data-task="${data}"] div div`);
  }

  renderTags(instruction, data) {
    for (let i = 0; i < list.tags.length; i += 1) {
      const checkbox = this.createElement('input', 'hiddenradio');
      checkbox.type = 'checkbox';
      checkbox.name = 'tag';
      checkbox.setAttribute('data-id', list.tags[i].id);
      const tagColour = list.tags[i].colour.toLowerCase();
      const label = this.createElement('label', 'tag');
      label.classList.add(tagColour);
      label.textContent = list.tags[i].name;
      if (instruction === 'newtask' || instruction === 'edittask') {
        checkbox.id = `${tagColour}-tag`;
        label.htmlFor = `${tagColour}-tag`;
        if (instruction === 'newtask') this.getElement('#newtagcontainer').append(checkbox, label);
        if (instruction === 'edittask') this.getElement(`[data-tagcontainerid="${data}"]`).append(checkbox, label);
      } else { // this is the settings filter
        checkbox.id = `show-${tagColour}-tag`;
        label.htmlFor = `show-${tagColour}-tag`;
        if (list.tagHide.every((num) => num !== list.tags[i].id)) {
          checkbox.checked = true;
        }
        if (list.tagHide.every((num) => num !== 'untagged')) {
          this.getElement('input#show-untagged-tag').checked = true;
        }
        this.getElement('#tagcontainer').append(checkbox, label);
        checkbox.addEventListener('click', () => {
          if (checkbox.checked) {
            list.deleteTagHide(list.tags[i].id);
            this.renderTasks();
          } else if (!(checkbox.checked)) {
            list.addTagHide(list.tags[i].id);
            this.renderTasks();
          }
        });
      }
    }
    if (instruction !== 'newtask' && instruction !== 'edittask') {
      this.getElement('input#show-untagged-tag').addEventListener('click', () => {
        if (this.getElement('input#show-untagged-tag').checked) {
          list.deleteTagHide('untagged');
          this.renderTasks();
        } else if (!(this.getElement('input#show-untagged-tag').checked)) {
          list.addTagHide('untagged');
          this.renderTasks();
        }
      });
    }
  }

  renderTagsPage() {
    this.getElement('main ul').innerHTML = '';
    this.createNewSelector('tags');
    for (let i = 0; i < list.tags.length; i += 1) {
      const li = this.createElement('li');
      li.setAttribute('data-tagid', list.tags[i].id);
      const img = this.createElement('img', 'tagicon');
      img.src = 'tag.svg';
      const div = this.createElement('div');
      div.innerHTML = `<div><label for="input-${list.tags[i].id}"><strong>Name: </strong></label><input type="text" id="input-${list.tags[i].id}"></div>
        <p><strong>Colour: </strong>
            <input type="radio" name="${list.tags[i].id}tagcolour" class="hiddenradio" id="${list.tags[i].id}tagcolourgreen" value="green" data-tagid="${list.tags[i].id}green"><label for="${list.tags[i].id}tagcolourgreen" class="tag green" id="greenlabel">Green</label>
            <input type="radio" name="${list.tags[i].id}tagcolour" class="hiddenradio" id="${list.tags[i].id}tagcolourblue" value="blue" data-tagid="${list.tags[i].id}blue"><label for="${list.tags[i].id}tagcolourblue" class="tag blue" id="bluelabel">Blue</label>
            <input type="radio" name="${list.tags[i].id}tagcolour" class="hiddenradio" id="${list.tags[i].id}tagcolouramber" value="amber" data-tagid="${list.tags[i].id}amber"><label for="${list.tags[i].id}tagcolouramber" class="tag amber" id="amberlabel">Amber</label>
        </p>
        <p><button id="update${list.tags[i].id}">Update</button><img src="bin.svg" alt="Bin" class="bin"></p>`;
      li.append(img, div);
      this.getElement('main ul').append(li);
      this.getElement(`li[data-tagid="${list.tags[i].id}"] input[type="text"]`).value = list.tags[i].name;
      this.getElement(`input[data-tagid="${list.tags[i].id}${list.tags[i].colour.toLowerCase()}"]`).checked = true;
      this.getElement(`#update${list.tags[i].id}`).addEventListener('click', () => {
        list.editTag(list.tags[i].id, this.getElement(`li[data-tagid="${list.tags[i].id}"] input[type="text"]`).value, this.getElement(`input[name="${list.tags[i].id}tagcolour"]:checked`).value);
      });
      this.getElement(`li[data-tagid="${list.tags[i].id}"] img.bin`).addEventListener('click', () => {
        list.deleteTag(list.tags[i].id);
        this.renderTagsPage();
        this.getElement('div#tagcontainer').innerHTML = `<input type="checkbox" name="showtag" id="show-untagged-tag" class="hiddenradio">
        <label for="show-untagged-tag" class="tag grey">Untagged</label>`;
        this.renderTags();
      });
    }
  }

  renderTasks() {
    orderTasks();
    function containsObject(obj, l) {
      for (let i = 0; i < l.length; i += 1) {
        if (l[i] === obj) return true;
      }
      return false;
    }
    const dynamicListElements = document.querySelectorAll('main ul li');
    for (let z = 1; z < dynamicListElements.length; z += 1) { // Removes second li onwards
      dynamicListElements[z].parentElement.removeChild(dynamicListElements[z]);
    }
    const filteredTasks = tasks.filter((element) => {
      if (element.chosenTags.length === 0) {
        if (list.tagHide.includes('untagged')) return false;
        return true;
      } if (element.chosenTags.every((el) => list.tagHide.some((e) => e === Number(el)))) {
        return false;
      }
      return true;
    });
    for (let i = 0; i < tasks.length; i += 1) {
      const li = this.createElement('li');
      li.setAttribute('data-task', i);
      const checkbox = this.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('click', () => {
        toggleCompletedStatus(i);
        this.renderTasks();
      });
      const div = this.createElement('div');
      div.addEventListener('click', () => {
        this.createEditTasksForm(i);
      }, { once: true });
      div.textContent = tasks[i].title;

      if (tasks[i].completed) {
        checkbox.checked = true;
        div.classList.add('checked');
      }
      if (tasks[i].important) div.classList.add('important');
      for (let y = 0; y < tasks[i].chosenTags.length; y += 1) {
        if ((tasks[i].chosenTags[y] !== '') && !(tasks[i].completed)) {
          const tagSpan = this.createElement('span', 'tag');
          const tag = list.tags.find((e) => e.id === Number(tasks[i].chosenTags[y]));
          tagSpan.classList.add(tag.colour.toLowerCase());
          tagSpan.textContent = tag.name;
          div.append(tagSpan);
        }
      }
      if (tasks[i].deadline && !(tasks[i].completed)) {
        const span = this.createElement('span', 'date');
        span.textContent = this.getDeadline(i);
        div.append(span);
      }
      li.append(checkbox, div);
      this.getElement('#container').append(li);
      if (!containsObject(tasks[i], filteredTasks)) li.style.display = 'none';
    }
    if (tasks.length === 0) this.createNewTaskForm();
  }

  editTaskRequest(data) {
    // Do some form validation and error checking at a later stage
    const title = this.getElement(`li[data-task="${data}"] div div`).textContent;
    const deadline = this.getElement(`li[data-task="${data}"] div p label input.date`).value;
    const important = this.getElement(`li[data-task="${data}"] div p p input#important`).checked;
    const completed = this.getElement(`li[data-task="${data}"] input[type=checkbox]`).checked;
    editTask(data, title, deadline, important, this.getChosenTags(`span[data-tagcontainerid="${data}"] input[name=tag]`), completed);
  }

  deleteTaskRequest(data) {
    if (data === 'newtaskform') {
      this.getElement('#newtaskform').style.display = 'none';
    } else {
      deleteTask(data);
    }
  }

  getChosenTags(data) {
    const arrayOfChosenTags = [];
    const tagCheckboxes = document.querySelectorAll(data);
    for (let i = 0; i < tagCheckboxes.length; i += 1) {
      const tagCheckbox = tagCheckboxes[i];
      if (tagCheckbox.checked) arrayOfChosenTags.push(tagCheckbox.dataset.id);
    }
    return arrayOfChosenTags;
  }

  addTaskRequest() {
    // Do some form validation and error checking at a later stage
    const title = document.getElementById('new-task-title').innerHTML;
    const deadline = document.getElementById('datepickerinput').value;
    const important = document.getElementById('important').checked;
    new Task(title, deadline, important, this.getChosenTags('#newtagcontainer input[name=tag]'), false);
    const newTaskForm = document.getElementById('newtaskform');
    newTaskForm.style.display = 'none';
    this.renderTasks();
  }

  addTagRequest() {
    // Do some form validation and error checking
    const name = this.getElement('li#newtaskform div div input').value;
    const colour = this.getElement('input[name=tagcolour]:checked').value;
    list.addTag(name, colour);
  }

  createNewSelector(data) {
    this.container = this.getElement('#container');
    this.newtask = this.createElement('li', null, 'newtask');
    const plusimage = this.createElement('img');
    plusimage.src = 'plus.svg';
    this.div = this.createElement('div');
    this.newtask.append(plusimage, this.div);
    this.container.prepend(this.newtask);
    if (data === 'tasks') {
      this.div.textContent = 'New task...';
      this.newtask.addEventListener('click', () => {
        this.createNewTaskForm();
      });
    } else if (data === 'tags') {
      this.div.textContent = 'New tag...';
      this.newtask.addEventListener('click', () => {
        this.createNewTagForm();
      });
    }
  }

  clickNav(data) {
    this.getElement('#newtask').remove();
    if (data === 'tasks') {
      this.getElement('header ul li:first-child').classList.add('selected');
      this.getElement('header ul li:nth-child(2)').classList.remove('selected');
      this.createNewSelector('tasks');
      this.renderTasks();
    } else if (data === 'tags') {
      this.getElement('header ul li:first-child').classList.remove('selected');
      this.getElement('header ul li:nth-child(2)').classList.add('selected');
      this.getElement('main ul').innerHTML = '';
      this.createNewSelector('tags');
      this.renderTagsPage();
    }
  }
}

const footer = document.getElementById('footer');
document.getElementById('cog').addEventListener('click', () => {
  footer.style.display = 'grid';
});
document.getElementById('close').addEventListener('click', () => {
  footer.style.display = 'none';
});
document.querySelector('footer div img.bin').addEventListener('click', () => {
  localStorage.clear();
  window.location.reload();
}, { once: true });
