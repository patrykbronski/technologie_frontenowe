import TaskItem from './TaskItem'
import useRenderCount from '../hooks/useRenderCount'

function TaskList({
	tasks,
	toggleTask,
	deleteTask,
	changePriority,
	updateTask,
	updateCategory,
	lastTaskElRef,
	justAddedId,
}) {
	useRenderCount('TaskList')

	if (!tasks || tasks.length === 0) {
		return <p className='muted'>Brak zadań</p>
	}

	return (
		<ul className='list'>
			{tasks.map(t => {
				const isJustAdded = justAddedId && t.id === justAddedId

				return (
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
						itemRef={isJustAdded ? lastTaskElRef : null}
						justAdded={isJustAdded}
					/>
				)
			})}
		</ul>
	)
}

export default TaskList