import { useEffect, useRef } from 'react'

export default function useRenderCount(name = 'Component') {
	const renders = useRef(0)
	renders.current += 1

	useEffect(() => {
		if (import.meta?.env?.DEV) {
			// eslint-disable-next-line no-console
			console.log(`[render] ${name}:`, renders.current)
		}
	})

	return renders.current
}