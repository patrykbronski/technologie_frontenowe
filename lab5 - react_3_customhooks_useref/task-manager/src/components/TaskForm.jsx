import { useEffect, useMemo, useRef, useState } from 'react'
import useRenderCount from '../hooks/useRenderCount'

function TaskForm({ addTask }) {
	useRenderCount('TaskForm')

	const [title, setTitle] = useState('')
	const [priority, setPriority] = useState('medium')
	const [category, setCategory] = useState('Inne')

	const titleInputRef = useRef(null)

	useEffect(() => {
		titleInputRef.current?.focus()
	}, [])

	const errors = useMemo(() => {
		const list = {}
		const v = title.trim()

		if (v.length === 0) list.title = 'Tytuł jest wymagany'
		else if (v.length < 3) list.title = 'Minimum 3 znaki'
		else if (v.length > 100) list.title = 'Maksimum 100 znaków'

		return list
	}, [title])

	const isValid = Object.keys(errors).length === 0

	function handleSubmit(e) {
		e.preventDefault()
		if (!isValid) return

		const newTask = {
			id: Date.now(),
			title: title.trim(),
			completed: false,
			priority,
			category,
		}

		addTask(newTask)
		setTitle('')
		setPriority('medium')
		setCategory('Inne')

		// focus po dodaniu
		titleInputRef.current?.focus()
	}

	return (
		<form className='form' onSubmit={handleSubmit}>
			<div className='formRow'>
				<label className='label'>Tytuł</label>
				<input
					ref={titleInputRef}
					className={`input ${errors.title ? 'invalid' : ''}`}
					value={title}
					onChange={e => setTitle(e.target.value)}
					placeholder='Np. Zrobić zadanie z Reacta'
				/>
				<div className='helpRow'>
					<span className='errorText'>{errors.title || ''}</span>
					<span className='muted'>{title.length}/100</span>
				</div>
			</div>

			<div className='formRow'>
				<label className='label'>Priorytet</label>
				<select className='select' value={priority} onChange={e => setPriority(e.target.value)}>
					<option value='high'>high</option>
					<option value='medium'>medium</option>
					<option value='low'>low</option>
				</select>
			</div>

			<div className='formRow'>
				<label className='label'>Kategoria</label>
				<select className='select' value={category} onChange={e => setCategory(e.target.value)}>
					<option value='Praca'>Praca</option>
					<option value='Dom'>Dom</option>
					<option value='Zakupy'>Zakupy</option>
					<option value='Inne'>Inne</option>
				</select>
			</div>

			<button className='btn' disabled={!isValid}>
				Dodaj zadanie
			</button>
		</form>
	)
}

export default TaskForm