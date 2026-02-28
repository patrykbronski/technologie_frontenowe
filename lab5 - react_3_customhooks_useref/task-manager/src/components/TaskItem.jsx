import { useEffect, useRef, useState } from 'react'
import useRenderCount from '../hooks/useRenderCount'

function TaskItem({
	id,
	title,
	completed = false,
	priority = 'medium',
	category = 'Inne',
	toggleTask,
	deleteTask,
	changePriority,
	updateTask,
	updateCategory,
	itemRef,
	justAdded = false,
}) {
	useRenderCount(`TaskItem(${id})`)

	const [isEditing, setIsEditing] = useState(false)
	const [editValue, setEditValue] = useState(title)

	const editInputRef = useRef(null)

	useEffect(() => {
		setEditValue(title)
	}, [title])

	useEffect(() => {
		if (isEditing) {
			editInputRef.current?.focus()
			editInputRef.current?.select?.()
		}
	}, [isEditing])

	function startEdit() {
		setIsEditing(true)
		setEditValue(title)
	}

	function cancelEdit() {
		setIsEditing(false)
		setEditValue(title)
	}

	function saveEdit() {
		const v = editValue.trim()
		if (v.length < 3 || v.length > 100) return
		updateTask(id, v)
		setIsEditing(false)
	}

	function onKeyDown(e) {
		if (e.key === 'Enter') saveEdit()
		if (e.key === 'Escape') cancelEdit()
	}

	return (
		<li ref={itemRef} className={`item ${justAdded ? 'justAdded' : ''}`}>
			<input type='checkbox' checked={completed} onChange={() => toggleTask(id)} />

			<span className={`catBadge cat-${category}`}>{category}</span>

			<div className='itemMain'>
				{isEditing ? (
					<input
						ref={editInputRef}
						className='input'
						value={editValue}
						onChange={e => setEditValue(e.target.value)}
						onKeyDown={onKeyDown}
					/>
				) : (
					<span className={`text ${completed ? 'done' : ''}`}>{title}</span>
				)}

				<div className='itemMeta'>
					<select className='select' value={priority} onChange={e => changePriority(id, e.target.value)}>
						<option value='high'>high</option>
						<option value='medium'>medium</option>
						<option value='low'>low</option>
					</select>

					<select className='select' value={category} onChange={e => updateCategory(id, e.target.value)}>
						<option value='Praca'>Praca</option>
						<option value='Dom'>Dom</option>
						<option value='Zakupy'>Zakupy</option>
						<option value='Inne'>Inne</option>
					</select>
				</div>
			</div>

			<div className='itemActions'>
				{isEditing ? (
					<>
						<button className='btn' onClick={saveEdit}>
							Zapisz
						</button>
						<button className='btn' onClick={cancelEdit}>
							Anuluj
						</button>
					</>
				) : (
					<button className='btn' onClick={startEdit}>
						Edytuj
					</button>
				)}

				<button className='btn danger' onClick={() => deleteTask(id)}>
					Usuń
				</button>
			</div>
		</li>
	)
}

export default TaskItem