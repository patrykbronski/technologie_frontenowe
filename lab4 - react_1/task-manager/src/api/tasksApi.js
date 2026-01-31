const STORAGE_KEY = 'task_manager_tasks_v1'

function sleep(ms, signal) {
	return new Promise((resolve, reject) => {
		const id = setTimeout(resolve, ms)

		if (signal) {
			if (signal.aborted) {
				clearTimeout(id)
				reject(new DOMException('Aborted', 'AbortError'))
				return
			}
			signal.addEventListener(
				'abort',
				() => {
					clearTimeout(id)
					reject(new DOMException('Aborted', 'AbortError'))
				},
				{ once: true },
			)
		}
	})
}

export async function fetchTasks({ signal } = {}) {
	await sleep(800, signal)

	try {
		const raw = localStorage.getItem(STORAGE_KEY)
		if (!raw) return []
		const parsed = JSON.parse(raw)
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

export async function saveTasks(tasks) {
	await sleep(500)
	localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
	return true
}
