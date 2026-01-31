import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import Card from './components/Card'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import FilterButtons from './components/FilterButtons'
import TaskStats from './components/TaskStats'
import QuoteOfTheDay from './components/QuoteOfTheDay'
import CategoryFilter from './components/CategoryFilter'
import { fetchTasks, saveTasks } from './api/tasksApi'

const STORAGE_KEY = 'task_manager_tasks_v1'

function App() {
	const [tasks, setTasks] = useState(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY)
			if (!raw) return []
			const parsed = JSON.parse(raw)
			return Array.isArray(parsed) ? parsed : []
		} catch {
			return []
		}
	})

	const [filter, setFilter] = useState('all')
	const [categoryFilter, setCategoryFilter] = useState('all')
	const [search, setSearch] = useState('')
	const [sortMode, setSortMode] = useState('default')

	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [loadError, setLoadError] = useState('')

	useEffect(() => {
		const controller = new AbortController()
		setLoading(true)
		setLoadError('')

		fetchTasks({ signal: controller.signal })
			.then(data => {
				if (Array.isArray(data)) {
					setTasks(data)
				}
				setLoading(false)
			})
			.catch(e => {
				if (e?.name === 'AbortError') return
				setLoadError('Nie udało się pobrać zadań.')
				setLoading(false)
			})

		return () => controller.abort()
	}, [])

	useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
		} catch {
			// ignore
		}
	}, [tasks])

	useEffect(() => {
		let cancelled = false
		setSaving(true)

		saveTasks(tasks)
			.then(() => {
				if (!cancelled) setSaving(false)
			})
			.catch(() => {
				if (!cancelled) setSaving(false)
			})

		return () => {
			cancelled = true
		}
	}, [tasks])

	function addTask(newTask) {
		setTasks(prev => [newTask, ...prev])
	}

	function toggleTask(id) {
		setTasks(prev => prev.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)))
	}

	function deleteTask(id) {
		setTasks(prev => prev.filter(t => t.id !== id))
	}

	function changePriority(id, newPriority) {
		setTasks(prev => prev.map(t => (t.id === id ? { ...t, priority: newPriority } : t)))
	}

	function updateTask(id, newTitle) {
		setTasks(prev => prev.map(t => (t.id === id ? { ...t, title: newTitle } : t)))
	}

	function updateCategory(id, newCategory) {
		setTasks(prev => prev.map(t => (t.id === id ? { ...t, category: newCategory } : t)))
	}

	function clearAll() {
		const ok = window.confirm('Na pewno usunąć wszystkie zadania?')
		if (!ok) return
		setTasks([])
	}

	function retryLoad() {
		const controller = new AbortController()
		setLoading(true)
		setLoadError('')

		fetchTasks({ signal: controller.signal })
			.then(data => {
				if (Array.isArray(data)) setTasks(data)
				setLoading(false)
			})
			.catch(e => {
				if (e?.name === 'AbortError') return
				setLoadError('Nie udało się pobrać zadań.')
				setLoading(false)
			})
	}

	const visibleTasks = useMemo(() => {
		const byStatus = tasks.filter(t => {
			if (filter === 'completed') return t.completed
			if (filter === 'active') return !t.completed
			return true
		})

		const byCategory = byStatus.filter(t => {
			if (categoryFilter === 'all') return true
			return (t.category || 'Inne') === categoryFilter
		})

		const bySearch = byCategory.filter(t => t.title.toLowerCase().includes(search.trim().toLowerCase()))

		const sorted = [...bySearch]

		if (sortMode === 'alpha') {
			sorted.sort((a, b) => a.title.localeCompare(b.title))
		} else if (sortMode === 'priority') {
			const w = { high: 3, medium: 2, low: 1 }
			sorted.sort((a, b) => (w[b.priority] || 0) - (w[a.priority] || 0))
		}

		return sorted
	}, [tasks, filter, categoryFilter, search, sortMode])

	const noResults = !loading && tasks.length > 0 && visibleTasks.length === 0

	return (
		<div className='app'>
			<Header saving={saving} />

			<div className='topRow'>
				<QuoteOfTheDay />
			</div>

			<Card title='Dodaj zadanie'>
				<TaskForm addTask={addTask} />
			</Card>

			<Card title='Sterowanie'>
				<div className='controls'>
					<FilterButtons filter={filter} setFilter={setFilter} />

					<CategoryFilter value={categoryFilter} onChange={setCategoryFilter} />

					<div className='searchBox'>
						<input className='input' value={search} onChange={e => setSearch(e.target.value)} placeholder='Szukaj...' />
					</div>

					<div className='sortBox'>
						<select className='select' value={sortMode} onChange={e => setSortMode(e.target.value)}>
							<option value='default'>Domyślnie</option>
							<option value='priority'>Priorytet</option>
							<option value='alpha'>Alfabetycznie</option>
						</select>
					</div>

					<button className='btn danger' onClick={clearAll}>
						Wyczyść wszystko
					</button>
				</div>

				<TaskStats tasks={tasks} />
			</Card>

			<Card title='Lista zadań'>
				{loading && (
					<div className='skeleton'>
						<div className='line' />
						<div className='line' />
						<div className='line' />
					</div>
				)}

				{!loading && loadError && (
					<div className='errorBox'>
						<p>{loadError}</p>
						<button className='btn' onClick={retryLoad}>
							Spróbuj ponownie
						</button>
					</div>
				)}

				{!loading && !loadError && (
					<>
						{noResults ? (
							<p className='muted'>Nie znaleziono zadań dla frazy «{search.trim()}»</p>
						) : (
							<TaskList
								tasks={visibleTasks}
								toggleTask={toggleTask}
								deleteTask={deleteTask}
								changePriority={changePriority}
								updateTask={updateTask}
								updateCategory={updateCategory}
							/>
						)}
					</>
				)}
			</Card>
		</div>
	)
}

export default App
