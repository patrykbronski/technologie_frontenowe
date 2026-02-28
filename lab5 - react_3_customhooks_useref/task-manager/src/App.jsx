import { useEffect, useMemo, useRef, useState } from 'react'
import Header from './components/Header'
import Card from './components/Card'
import TaskForm from './components/TaskForm'
import TaskList from './components/TaskList'
import FilterButtons from './components/FilterButtons'
import TaskStats from './components/TaskStats'
import QuoteOfTheDay from './components/QuoteOfTheDay'
import CategoryFilter from './components/CategoryFilter'
import { fetchTasks, saveTasks } from './api/tasksApi'

import useLocalStorage from './hooks/useLocalStorage'
import useDebounce from './hooks/useDebounce'
import usePrevious from './hooks/usePrevious'
import useRenderCount from './hooks/useRenderCount'

const STORAGE_KEY = 'task_manager_tasks_v1'

function labelForFilter(v) {
	if (v === 'active') return 'Aktywne'
	if (v === 'completed') return 'Ukończone'
	return 'Wszystkie'
}

function App() {
	useRenderCount('App')

	const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, [])

	const [filter, setFilter] = useLocalStorage('task_manager_filter_v1', 'all')
	const [categoryFilter, setCategoryFilter] = useState('all')

	const [searchInput, setSearchInput] = useState('')
	const debouncedSearch = useDebounce(searchInput, 300)

	const [sortMode, setSortMode] = useLocalStorage('task_manager_sort_v1', 'default')

	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState(false)
	const [loadError, setLoadError] = useState('')

	// --- useRef: scroll + highlight nowego zadania
	const lastTaskElRef = useRef(null)
	const [justAddedId, setJustAddedId] = useState(null)
	const clearJustAddedTimerRef = useRef(null)

	// --- useRef: toast po zmianie filtra
	const prevFilter = usePrevious(filter)
	const [filterToast, setFilterToast] = useState('')
	const toastTimerRef = useRef(null)

	useEffect(() => {
		// tylko gdy faktycznie zmieniono filtr po pierwszym renderze
		if (!prevFilter || prevFilter === filter) return

		const msg = `Zmieniono filtr z «${labelForFilter(prevFilter)}» na «${labelForFilter(filter)}»`
		setFilterToast(msg)

		if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
		toastTimerRef.current = setTimeout(() => setFilterToast(''), 2000)

		return () => {
			if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
		}
	}, [filter, prevFilter])

	useEffect(() => {
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

		return () => controller.abort()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

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
		setJustAddedId(newTask.id)
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
		setJustAddedId(null)
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

	// scroll + highlight (po renderze listy)
	useEffect(() => {
		if (!justAddedId) return

		if (lastTaskElRef.current) {
			lastTaskElRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
		}

		if (clearJustAddedTimerRef.current) clearTimeout(clearJustAddedTimerRef.current)
		clearJustAddedTimerRef.current = setTimeout(() => setJustAddedId(null), 1200)

		return () => {
			if (clearJustAddedTimerRef.current) clearTimeout(clearJustAddedTimerRef.current)
		}
	}, [justAddedId])

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

		const q = debouncedSearch.trim().toLowerCase()
		const bySearch = byCategory.filter(t => t.title.toLowerCase().includes(q))

		const sorted = [...bySearch]

		if (sortMode === 'alpha') {
			sorted.sort((a, b) => a.title.localeCompare(b.title))
		} else if (sortMode === 'priority') {
			const w = { high: 3, medium: 2, low: 1 }
			sorted.sort((a, b) => (w[b.priority] || 0) - (w[a.priority] || 0))
		}

		return sorted
	}, [tasks, filter, categoryFilter, debouncedSearch, sortMode])

	const noResults = !loading && tasks.length > 0 && visibleTasks.length === 0

	return (
		<div className='app'>
			{/* minimalne style do animacji + toast (bez ruszania index.css) */}
			<style>{`
        .justAdded {
          animation: justAddedFlash 1.2s ease-out;
        }
        @keyframes justAddedFlash {
          0% { box-shadow: 0 0 0 0 rgba(0,0,0,.20); transform: translateY(0); }
          30% { box-shadow: 0 0 0 6px rgba(0,0,0,.10); transform: translateY(-1px); }
          100% { box-shadow: 0 0 0 0 rgba(0,0,0,0); transform: translateY(0); }
        }
        .toast {
          margin: 10px 0 0;
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(0,0,0,.06);
          font-size: 14px;
        }
      `}</style>

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
						<input
							className='input'
							value={searchInput}
							onChange={e => setSearchInput(e.target.value)}
							placeholder='Szukaj...'
						/>
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

				{!!filterToast && <div className='toast'>{filterToast}</div>}

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
							<p className='muted'>Nie znaleziono zadań dla frazy «{debouncedSearch.trim()}»</p>
						) : (
							<TaskList
								tasks={visibleTasks}
								toggleTask={toggleTask}
								deleteTask={deleteTask}
								changePriority={changePriority}
								updateTask={updateTask}
								updateCategory={updateCategory}
								lastTaskElRef={lastTaskElRef}
								justAddedId={justAddedId}
							/>
						)}
					</>
				)}
			</Card>
		</div>
	)
}

export default App