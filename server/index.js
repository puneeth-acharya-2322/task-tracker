const express = require('express');
const cors = require('cors');
const { Low, JSONFile } = require('lowdb');
const { nanoid } = require('nanoid');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// lowdb setup
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter);

(async () => {
  await db.read();
  db.data ||= { tasks: [] };
  await db.write();
})();

async function getTasks() {
  await db.read();
  return db.data.tasks;
}

async function saveTasks(tasks) {
  db.data.tasks = tasks;
  await db.write();
}

// Routes
app.get('/tasks', async (req, res) => {
  const tasks = await getTasks();
  res.json(tasks);
});

app.get('/tasks/:id', async (req, res) => {
  const tasks = await getTasks();
  const task = tasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: 'Not found' });
  res.json(task);
});

app.post('/tasks', async (req, res) => {
  const { title, status = 'todo', priority } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });

  const tasks = await getTasks();
  const newTask = {
    id: nanoid(),
    title,
    status,
    priority: priority || null,
    createdAt: new Date().toISOString()
  };

  tasks.unshift(newTask);
  await saveTasks(tasks);
  res.status(201).json(newTask);
});

app.put('/tasks/:id', async (req, res) => {
  const { title, status, priority } = req.body;
  const tasks = await getTasks();

  const index = tasks.findIndex(t => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });

  const updated = {
    ...tasks[index],
    ...(title !== undefined ? { title } : {}),
    ...(status !== undefined ? { status } : {}),
    ...(priority !== undefined ? { priority } : {})
  };

  tasks[index] = updated;
  await saveTasks(tasks);
  res.json(updated);
});

app.delete('/tasks/:id', async (req, res) => {
  const tasks = await getTasks();
  const filtered = tasks.filter(t => t.id !== req.params.id);

  if (filtered.length === tasks.length)
    return res.status(404).json({ error: 'Not found' });

  await saveTasks(filtered);
  res.status(204).end();
});

app.get('/tasks-counts', async (req, res) => {
  const tasks = await getTasks();
  const counts = {
    total: tasks.length,
    todo: tasks.filter(t => t.status === 'todo').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    done: tasks.filter(t => t.status === 'done').length
  };
  res.json(counts);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
