function TaskStats({ tasks }) {
	const total = tasks.length
	const done = tasks.filter(t => t.completed).length
	const left = total - done
	const percent = total === 0 ? 0 : Math.round((done / total) * 100)

	return (
		<div className='stats'>
			<span>Łącznie: {total}</span>
			<span>Ukończone: {done}</span>
			<span>Pozostałe: {left}</span>
			<span>Procent: {percent}%</span>
		</div>
	)
}

export default TaskStats
