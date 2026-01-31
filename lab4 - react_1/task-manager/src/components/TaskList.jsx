import TaskItem from './TaskItem'

function TaskList({ tasks, toggleTask, deleteTask, changePriority, updateTask, updateCategory }) {
	if (!tasks || tasks.length === 0) {
		return <p className='muted'>Brak zadań</p>
	}

	return (
		<ul className='list'>
			{tasks.map(t => (
				<TaskItem
					key={t.id}
					id={t.id}
					title={t.title}
					completed={t.completed}
					priority={t.priority}
					category={t.category}
					toggleTask={toggleTask}
					deleteTask={deleteTask}
					changePriority={changePriority}
					updateTask={updateTask}
					updateCategory={updateCategory}
				/>
			))}
		</ul>
	)
}

export default TaskList
