import { useCallback, useEffect, useRef, useState } from 'react'

export default function useFetch(url, options = {}) {
	const { enabled = true, transform } = options

	const [data, setData] = useState(null)
	const [loading, setLoading] = useState(Boolean(enabled && url))
	const [error, setError] = useState('')

	const controllerRef = useRef(null)

	// transform trzymamy w ref, żeby nie powodował re-fetch przy każdym renderze
	const transformRef = useRef(transform)
	useEffect(() => {
		transformRef.current = transform
	}, [transform])

	// nonce do ręcznego refetch
	const [nonce, setNonce] = useState(0)
	const refetch = useCallback(() => setNonce(n => n + 1), [])

	useEffect(() => {
		if (!enabled || !url) return

		if (controllerRef.current) controllerRef.current.abort()
		const controller = new AbortController()
		controllerRef.current = controller

		setLoading(true)
		setError('')

		fetch(url, { signal: controller.signal })
			.then(res => {
				if (!res.ok) throw new Error('HTTP')
				return res.json()
			})
			.then(json => {
				const fn = transformRef.current
				const out = typeof fn === 'function' ? fn(json) : json
				setData(out)
				setLoading(false)
			})
			.catch(e => {
				if (e?.name === 'AbortError') return
				setError('Nie udało się pobrać danych.')
				setLoading(false)
			})

		return () => controller.abort()
	}, [url, enabled, nonce])

	return { data, loading, error, refetch }
}