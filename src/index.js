import './clean.css';
import './style.css';
import format from 'date-fns/format';

import { add, dateDom } from './newTask.js';
import BinIcon from './icons/bin.svg';
import CloseIcon from './icons/close.svg';
import DateIcon from './icons/date.svg';
import PlusIcon from './icons/plus.svg';
import SettingsIcon from './icons/settings.svg';
import TagIcon from './icons/tag.svg';
import TaskIcon from './icons/task.svg';
import TaskTickIcon from './icons/tasktick.svg';

/* renderTags(); */

import View from './display.js';

export {
  tasks, Task, list,
};

class Tag {
  constructor() {
    this.tags = [
      { id: 1, name: 'Personal', colour: 'Amber' },
      { id: 2, name: 'Work', colour: 'Blue' },
      { id: 3, name: 'Other', colour: 'Green' },
    ];
    this.tagHide = [];
    console.table(this.tagHide);
  }

  addTag(name, colour) {
    const tag = {
      id: this.tags.length > 0 ? this.tags[this.tags.length - 1].id + 1 : 1,
      name,
      colour,
    };
    this.tags.push(tag);
  }

  editTag(id, name, colour) {
    this.tags = this.tags.map((tag) => (tag.id === id ? { id: tag.id, name, colour } : tag));
  }

  deleteTag(id) {
    this.tags = this.tags.filter((tag) => tag.id !== id);
  }

  addTagHide(id) {
    this.tagHide.push(id);
  }

  deleteTagHide(id) {
    this.tagHide = this.tagHide.filter((e) => e !== id);
  }
}

// Change rendering of task so that it filters out any tasks which have a tag in tagHide

const list = new Tag();

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
// Bug - task must have a deadline otherwise errors

new Task('Important tagless task completed', '2023-03-29', true, [], true);
new Task('Work task, unimportant, deadline later uncompleted', '2023-03-28', false, ['2', '1'], false);
new Task('Work task, unimportant, deadline earlier uncompleted', '2023-03-27', false, ['2'], false);
new Task('Personal important task uncompleted', '2023-04-26', true, ['1'], false);

export const view = new View();
view.renderTasks();
view.renderTags();

export function orderTasks() {
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

export function editTask(data, title, deadline, important, chosenTags, completed) {
  const index = data;
  tasks[index] = {
    title, deadline, important, chosenTags, completed,
  };
  view.renderTasks();
}

export function deleteTask(data) {
  const index = data;
  tasks.splice(index, 1);
  view.renderTasks();
}
