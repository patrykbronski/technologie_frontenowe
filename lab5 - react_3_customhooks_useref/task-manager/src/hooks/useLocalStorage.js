import { useEffect, useState } from 'react'

export default function useLocalStorage(key, initialValue) {
	const [value, setValue] = useState(() => {
		try {
			const raw = localStorage.getItem(key)
			if (!raw) return initialValue
			const parsed = JSON.parse(raw)
			return parsed
		} catch {
			return initialValue
		}
	})

	useEffect(() => {
		try {
			localStorage.setItem(key, JSON.stringify(value))
		} catch {
			// ignore
		}
	}, [key, value])

	return [value, setValue]
}