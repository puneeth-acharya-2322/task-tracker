import React, { useEffect, useState } from 'react'
import { getTasks, createTask, updateTask, deleteTask, getCounts } from './api'
import AddTaskForm from './components/AddTaskForm'
import TaskItem from './components/TaskItem'


const FILTERS = { ALL: 'all', COMPLETED: 'completed', PENDING: 'pending' };


export default function App() {
const [tasks, setTasks] = useState([]);
const [filter, setFilter] = useState(FILTERS.ALL);
const [priorityFilter, setPriorityFilter] = useState('all');
const [counts, setCounts] = useState({});


async function load() {
const t = await getTasks();
setTasks(t);
const c = await getCounts();
setCounts(c);
}


useEffect(() => { load(); }, []);


async function onAdd(title, status, priority) {
const newT = await createTask({ title, status, priority });
setTasks(prev => [newT, ...prev]);
setCounts(await getCounts());
}


async function onUpdate(id, patch) {
const updated = await updateTask(id, patch);
setTasks(prev => prev.map(t => t.id === id ? updated : t));
setCounts(await getCounts());
}


async function onDelete(id) {
if (!confirm('Delete this task?')) return;
await deleteTask(id);
setTasks(prev => prev.filter(t => t.id !== id));
setCounts(await getCounts());
}


const visible = tasks.filter(t => {
// status filter
if (filter === FILTERS.COMPLETED && t.status !== 'done') return false;
if (filter === FILTERS.PENDING && t.status === 'done') return false;
// priority filter
if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
return true;
});


return (
<div className="container">
<h1>Task Tracker</h1>


<div className="top">
<AddTaskForm onAdd={onAdd} />
<div className="counts">
<div className="label">Total: <strong style={{color:'black'}}>{counts.total ?? 0}</strong></div>
<div className="label">Todo: {counts.todo ?? 0}</div>
<div className="label">In-Progress: {counts.inProgress ?? 0}</div>
<div className="label">Done: {counts.done ?? 0}</div>
</div>
</div>


<div className="filters">
<button onClick={() => setFilter(FILTERS.ALL)} className={filter===FILTERS.ALL? 'active':''}>All</button>
<button onClick={() => setFilter(FILTERS.COMPLETED)} className={filter===FILTERS.COMPLETED? 'active':''}>Completed</button>
<button onClick={() => setFilter(FILTERS.PENDING)} className={filter===FILTERS.PENDING? 'active':''}>Pending</button>


<div className="priority-filter">
<div style={{color:'var(--muted)', fontSize:13}}>Priority:</div>
<button onClick={() => setPriorityFilter('all')} className={priorityFilter==='all'? 'active':''}><span className="priority-pill">All</span></button>
<button onClick={() => setPriorityFilter('low')} className={priorityFilter==='low'? 'active':''}><span className="priority-pill low">Low</span></button>
<button onClick={() => setPriorityFilter('medium')} className={priorityFilter==='medium'? 'active':''}><span className="priority-pill medium">Medium</span></button>
<button onClick={() => setPriorityFilter('high')} className={priorityFilter==='high'? 'active':''}><span className="priority-pill high">High</span></button>
</div>
</div>


<div className="task-list">
{visible.map(t => (
<TaskItem key={t.id} task={t} onUpdate={onUpdate} onDelete={onDelete} />
))}
{visible.length === 0 && <p style={{color:'var(--muted)'}}>No tasks</p>}
</div>
</div>
)
}