const fs = require("fs");
const path = require("path");

const FILE_PATH = path.join(__dirname, "tasks.json");

if (!fs.existsSync(FILE_PATH)) {
  fs.writeFileSync(FILE_PATH, JSON.stringify([], null, 2));
}

function readTasks() {
  try {
    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading tasks:", error.message);
    return [];
  }
}

function writeTasks(tasks) {
  try {
    fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error writing tasks:", error.message);
  }
}

function generateId(tasks) {
  if (tasks.length === 0) {
    return 1;
  }

  return tasks[tasks.length - 1].id + 1;
}

function addTask(description) {
  if (!description) {
    console.log("Please provide a task description.");
    return;
  }

  const tasks = readTasks();

  const newTask = {
    id: generateId(tasks),
    description,
    status: "todo",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  tasks.push(newTask);

  writeTasks(tasks);

  console.log(`Task added successfully (ID: ${newTask.id})`);
}

function updateTask(id, description) {
  if (!id || !description) {
    console.log("Usage: update <id> <new description>");
    return;
  }

  const tasks = readTasks();

  const task = tasks.find((task) => task.id === Number(id));

  if (!task) {
    console.log("Task not found.");
    return;
  }

  task.description = description;
  task.updatedAt = new Date().toISOString();

  writeTasks(tasks);

  console.log("Task updated successfully.");
}

function deleteTask(id) {
  if (!id) {
    console.log("Usage: delete <id>");
    return;
  }

  const tasks = readTasks();

  const filteredTasks = tasks.filter(
    (task) => task.id !== Number(id)
  );

  if (tasks.length === filteredTasks.length) {
    console.log("Task not found.");
    return;
  }

  writeTasks(filteredTasks);

  console.log("Task deleted successfully.");
}

function markTask(id, status) {
  if (!id) {
    console.log("Please provide task ID.");
    return;
  }

  const tasks = readTasks();

  const task = tasks.find((task) => task.id === Number(id));

  if (!task) {
    console.log("Task not found.");
    return;
  }

  task.status = status;
  task.updatedAt = new Date().toISOString();

  writeTasks(tasks);

  console.log(`Task marked as ${status}.`);
}

function listTasks(status) {
  const tasks = readTasks();

  let filteredTasks = tasks;

  if (status) {
    filteredTasks = tasks.filter(
      (task) => task.status === status
    );
  }

  if (filteredTasks.length === 0) {
    console.log("No tasks found.");
    return;
  }

  console.table(filteredTasks);
}

const command = process.argv[2];
const arg1 = process.argv[3];
const arg2 = process.argv[4];

switch (command) {
  case "add":
    addTask(arg1);
    break;

  case "update":
    updateTask(arg1, arg2);
    break;

  case "delete":
    deleteTask(arg1);
    break;

  case "mark-in-progress":
    markTask(arg1, "in-progress");
    break;

  case "mark-done":
    markTask(arg1, "done");
    break;

  case "list":
    listTasks(arg1);
    break;

  default:
    console.log(`
Task Tracker CLI

Commands:

Add Task:
  node task-cli.js add "Task description"

Update Task:
  node task-cli.js update <id> "New description"

Delete Task:
  node task-cli.js delete <id>

Mark Task In Progress:
  node task-cli.js mark-in-progress <id>

Mark Task Done:
  node task-cli.js mark-done <id>

List All Tasks:
  node task-cli.js list

List Tasks By Status:
  node task-cli.js list todo
  node task-cli.js list in-progress
  node task-cli.js list done
`);
}