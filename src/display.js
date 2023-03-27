import isTomorrow from 'date-fns/isTomorrow';
import isToday from 'date-fns/isToday';
import parseISO from 'date-fns/parseISO';
import differenceInDays from 'date-fns/differenceInDays';
import addDays from 'date-fns/addDays';
import format from 'date-fns/format';
import startOfToday from 'date-fns/startOfToday';
import isBefore from 'date-fns/isBefore';
import {
  tasks, Task, orderTasks, tags,
} from './index';
import { updateCompletedStatus, clickTask } from './newTask';

// Everything UI and DOM
// User interface/DOM: render the tasklist in order

// Show and hide the settings

const footer = document.getElementById('footer');
const newTaskForm = document.getElementById('newtaskform');
export { newTaskForm };

document.getElementById('cog').addEventListener('click', () => {
  footer.style.display = 'grid';
});
document.getElementById('close').addEventListener('click', () => {
  footer.style.display = 'none';
});
document.getElementById('newtask').addEventListener('click', () => {
  newTaskForm.style.display = 'grid';
});

// Get the deadline element to go inline with the task

export function getDeadline(i) {
  const date = parseISO(tasks[i].deadline);
  const today = startOfToday();
  if (isBefore(date, today)) {
    return 'Overdue';
  } if (isTomorrow(date)) {
    return 'Tomorrow';
  } if (isToday(date)) {
    return 'Today';
  } if (differenceInDays(addDays(today, 6), date) >= 0) {
    return format(date, 'EEEE');
  }
  return format(date, 'd MMM');
}

// Get the tags

function getTags(i) {

  /*     <span class="tag amber">Tagname</span>
    <span class="tag blue">Tagname</span>
    <span class="tag green">Tagname</span> */

}

// Render tags

export function renderTags() {
  /*   <input type="checkbox" name="showtag" id="show-amber-tag" class="hiddenradio">
  <label for="show-amber-tag" class="tag amber">Tagname</label>

  <input type="checkbox" name="showtag" id="show-blue-tag" class="hiddenradio">
  <label for="show-blue-tag" class="tag blue">Tagname</label>

  <input type="checkbox" name="showtag" id="show-green-tag" class="hiddenradio">
  <label for="show-green-tag" class="tag green">Tagname</label>

  <input type="checkbox" name="showtag" id="show-untagged-tag" class="hiddenradio">
  <label for="show-untagged-tag" class="tag grey">Untagged</label> */

  for (let i = 0; i < tags.length; i++) {
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.name = 'showtag';
    checkbox.classList.add('hiddenradio');
    const tagColour = tags[i].colour.toLowerCase();
    // Set ID e.g. show-amber-tag
    const label = document.createElement('label');
    label.for = // e.g. show-amber-tag;
  label.classList.add('tag');
    label.classList.add(tagColour);
    // add label name as a child of the label
    const tagText = document.createTextNode(tags[i].name);
    // append all of this to something
    label.appendChild(tagText);
    document.getElementById('tagcontainer').appendChild(checkbox);
    document.getElementById('tagcontainer').appendChild(label);
  }
}

// Render the tasklist by: calling the ordering function, for each loop, create li
const container = document.getElementById('container');

export function renderTasks() {
  orderTasks();

  // Something to clear out the li's in the main ul, starting with li 3 onwards

  const dynamicListElements = document.querySelectorAll('main ul li');

  for (let z = 2; z < dynamicListElements.length; z++) { // Removes third li onwards
    dynamicListElements[z].parentElement.removeChild(dynamicListElements[z]);
  }

  for (let i = 0; i < tasks.length; i++) {
    // Create some elements
    const li = document.createElement('li');
    li.setAttribute('data-task', i);
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('click', () => {
      updateCompletedStatus(i);
    });
    const div = document.createElement('div');
    div.addEventListener('click', () => {
      clickTask(i);
    });
    const span = document.createElement('span');

    // Create some content for those elements
    const taskText = document.createTextNode(tasks[i].title);
    const deadlineText = document.createTextNode(getDeadline(i));

    // Populate the elements with the content
    div.appendChild(taskText);
    span.appendChild(deadlineText);

    // Do some formatting
    if (tasks[i].completed === true) {
      checkbox.checked = true;
      div.classList.add('checked');
    }
    if (tasks[i].important === true) {
      div.classList.add('important');
    }
    span.classList.add('date');

    // Need to add some tags
    if (tasks[i].chosenTags == '') {
      console.log('Not even going to try as the tag is empty');
    } else {
      for (let y = 0; y < tasks[i].chosenTags.length; y++) {
        const tagSpan = document.createElement('span');
        tagSpan.classList.add('tag');
        const tagTitle = document.createTextNode(tasks[i].chosenTags[y]);
        tagSpan.appendChild(tagTitle);
        const index = tags.findIndex((object) => object.name === tasks[i].chosenTags[y]);
        console.log(`I is ${i}, y is ${y}, index is ${index}`);
        if (index !== -1) {
          // Find colour of relevant tag index
          if (tags[index].colour == 'Amber') {
            tagSpan.classList.add('amber');
          } if (tags[index].colour == 'Green') {
            tagSpan.classList.add('green');
          } if (tags[index].colour == 'Blue') {
            tagSpan.classList.add('blue');
          }
        }
        div.appendChild(tagSpan);
      }
    }

    // Append things in the right way
    li.appendChild(checkbox);
    div.appendChild(span);
    li.appendChild(div);
    container.appendChild(li);
  }
}
