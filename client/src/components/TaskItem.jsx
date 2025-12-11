import React, { useState } from 'react'


export default function TaskItem({ task, onUpdate, onDelete }) {
const [editing, setEditing] = useState(false);
const [title, setTitle] = useState(task.title);
const [status, setStatus] = useState(task.status);
const [priority, setPriority] = useState(task.priority || 'medium');


async function save() {
await onUpdate(task.id, { title, status, priority });
setEditing(false);
}


return (
<div className={`task ${task.status === 'done' ? 'done' : ''}`}>
{editing ? (
<div style={{display:'flex', gap:8, alignItems:'center', width:'100%'}}>
<input value={title} onChange={e => setTitle(e.target.value)} style={{flex:1}} />
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
<button onClick={save}>Save</button>
<button onClick={() => setEditing(false)}>Cancel</button>
</div>
) : (
<>
<div className="meta">
<div className="title">{task.title}</div>
<div className="status">{task.status}</div>
<div className={`priority-pill ${task.priority || 'medium'}`} style={{marginLeft:6}}>{task.priority || 'medium'}</div>
</div>
<div className="actions">
<button onClick={() => { setEditing(true); }}>Edit</button>
<button onClick={() => onUpdate(task.id, { status: 'done' })}>Mark Done</button>
<button onClick={() => onDelete(task.id)}>Delete</button>
</div>
</>
)}
</div>
)
}