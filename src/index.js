import './clean.css';
import './style.css';
import View from './display.js';

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    const x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException
      && (e.code === 22
        || e.code === 1014
        || e.name === 'QuotaExceededError'
        || e.name === 'NS_ERROR_DOM_QUOTA_REACHED')
      && storage
      && storage.length !== 0
    );
  }
}

export function populateStorage() {
  if (storageAvailable('localStorage')) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('tags', JSON.stringify(list.tags));
  }
}

export class Tag {
  constructor() {
    if (storageAvailable('localStorage') && localStorage.getItem('tags')) {
      this.tags = JSON.parse(localStorage.getItem('tags'));
    } else {
      this.tags = [
        { id: 1, name: 'Personal', colour: 'Amber' },
        { id: 2, name: 'Work', colour: 'Blue' },
        { id: 3, name: 'Other', colour: 'Green' },
      ];
    }
    this.tagHide = [];
  }

  addTag(name, colour) {
    const tag = {
      id: this.tags.length > 0 ? this.tags[this.tags.length - 1].id + 1 : 1,
      name,
      colour,
    };
    this.tags.push(tag);
    populateStorage();
  }

  editTag(id, name, colour) {
    this.tags = this.tags.map((tag) => (tag.id === id ? { id: tag.id, name, colour } : tag));
    populateStorage();
  }

  deleteTag(id) {
    this.tags = this.tags.filter((tag) => tag.id !== id);
    for (let i = 0; i < tasks.length; i += 1) {
      const index = tasks[i].chosenTags.indexOf(id);
      tasks[i].chosenTags.splice(index, 1);
    }
    populateStorage();
  }

  addTagHide(id) {
    this.tagHide.push(id);
  }

  deleteTagHide(id) {
    this.tagHide = this.tagHide.filter((e) => e !== id);
  }
}

export const list = new Tag();

export let tasks = [];

if (storageAvailable('localStorage') && localStorage.getItem('tasks')) {
  tasks = JSON.parse(localStorage.getItem('tasks'));
}

export class Task {
  constructor(title, deadline, important, chosenTags, completed) {
    this.title = title;
    this.deadline = deadline;
    this.important = important;
    this.chosenTags = chosenTags;
    this.completed = completed;
    tasks.push(this);
    populateStorage();
  }
}

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
  tasks[data] = {
    title, deadline, important, chosenTags, completed,
  };
  view.renderTasks();
  populateStorage();
}

export function deleteTask(data) {
  tasks.splice(data, 1);
  view.renderTasks();
  populateStorage();
}

export function toggleCompletedStatus(id) {
  tasks[id].completed = !tasks[id].completed;
  populateStorage();
}
