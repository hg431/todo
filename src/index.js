import './clean.css';
import './style.css';
import View from './display.js';

export class Tag {
  constructor() {
    this.tags = [
      { id: 1, name: 'Personal', colour: 'Amber' },
      { id: 2, name: 'Work', colour: 'Blue' },
      { id: 3, name: 'Other', colour: 'Green' },
    ];
    this.tagHide = [];
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

export const list = new Tag();

export let tasks = [];

export class Task {
  constructor(title, deadline, important, chosenTags, completed) {
    this.title = title;
    this.deadline = deadline;
    this.important = important;
    this.chosenTags = chosenTags;
    this.completed = completed;
    tasks.push(this);
  }
}

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
  tasks[data] = {
    title, deadline, important, chosenTags, completed,
  };
  view.renderTasks();
}

export function deleteTask(data) {
  tasks.splice(data, 1);
  view.renderTasks();
}

export function toggleCompletedStatus(id) {
  tasks[id].completed = !tasks[id].completed;
}
