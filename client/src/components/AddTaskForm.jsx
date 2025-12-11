import React, { useState } from 'react'


export default function AddTaskForm({ onAdd }) {
const [title, setTitle] = useState('');
const [status, setStatus] = useState('todo');
const [priority, setPriority] = useState('medium');


async function submit(e) {
e.preventDefault();
if (!title.trim()) return;
await onAdd(title.trim(), status, priority);
setTitle('');
setStatus('todo');
setPriority('medium');
}


return (
<form className="add-form" onSubmit={submit}>
<input value={title} onChange={e => setTitle(e.target.value)} placeholder="Add task — e.g., Build todo API" />
<select value={status} onChange={e => setStatus(e.target.value)}>
<option value="todo">Todo</option>
<option value="in-progress">In-Progress</option>
<option value="done">Done</option>
</select>


<select value={priority} onChange={e => setPriority(e.target.value)}>
<option value="low">Low</option>
<option value="medium">Medium</option>
<option value="high">High</option>
</select>


<button type="submit">Add</button>
</form>
)
}