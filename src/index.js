import './clean.css';
import './style.css';
import BinIcon from './icons/bin.svg';
import CloseIcon from './icons/close.svg';
import DateIcon from './icons/date.svg';
import PlusIcon from './icons/plus.svg';
import SettingsIcon from './icons/settings.svg';
import TagIcon from './icons/tag.svg';
import TaskIcon from './icons/task.svg';
import TaskTickIcon from './icons/tasktick.svg';
import { renderTasks, getDeadline, add } from './display';

export {
  tasks, Task, orderTasks, tags,
};

// Constructor/class to generate tasks, with these properties: title, deadline, important, tags

const tags = [];

class Tag {
  constructor(name, colour) {
    this.name = name;
    this.colour = colour;
    tags.push(this);
  }
}

new Tag('Personal', 'Amber');
new Tag('Work', 'Blue');
new Tag('Other', 'Green');

let tasks = [];

class Task {
  constructor(title, deadline, important, chosenTags, completed) {
    this.title = title;
    this.deadline = deadline;
    this.important = important;
    this.chosenTags = chosenTags;
    this.completed = completed;
    tasks.push(this);
  }
}

new Task('Important tagless task completed', '2023-03-20', true, [''], true);
new Task('Work task, unimportant, deadline later uncompleted', '2023-03-28', false, ['Work', 'Personal'], false);
new Task('Work task, unimportant, deadline earlier uncompleted', '2023-03-27', false, ['Work'], false);
new Task('Personal important task uncompleted', '2023-04-26', true, ['Personal'], false);

function orderTasks() {
  const completedTasks = tasks.filter((obj) => obj.completed === true);

  const uncompletedImportantTasks = tasks.filter(
    (obj) => ((obj.important === true) && (obj.completed === false)),
  );

  const uncompletedUnimportantTasks = tasks.filter(
    (obj) => ((obj.important === false) && (obj.completed === false)),
  );

  function sortDate(array) {
    return array.sort((a, b) => (new Date(a.deadline) - new Date(b.deadline)));
  }

  sortDate(completedTasks);
  sortDate(uncompletedImportantTasks);
  sortDate(uncompletedUnimportantTasks);

  tasks = [...uncompletedImportantTasks, ...uncompletedUnimportantTasks, ...completedTasks];
  return tasks;
}

console.table(orderTasks());

renderTasks();
