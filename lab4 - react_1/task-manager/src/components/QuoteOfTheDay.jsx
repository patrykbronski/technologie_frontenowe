import { useEffect, useRef, useState } from 'react'

function QuoteOfTheDay() {
	const [quote, setQuote] = useState(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	const controllerRef = useRef(null)

	function loadQuote() {
		if (controllerRef.current) controllerRef.current.abort()
		const controller = new AbortController()
		controllerRef.current = controller

		setLoading(true)
		setError('')

		fetch('https://motivational-spark-api.vercel.app/api/quotes/random', {
			signal: controller.signal,
		})
			.then(res => {
				if (!res.ok) throw new Error('HTTP')
				return res.json()
			})
			.then(data => {
				setQuote({ content: data.quote, author: data.author })
				setLoading(false)
			})
			.catch(e => {
				if (e?.name === 'AbortError') return
				setError('Nie udało się pobrać cytatu.')
				setLoading(false)
			})
	}

	useEffect(() => {
		loadQuote()
		return () => {
			if (controllerRef.current) controllerRef.current.abort()
		}
	}, [])

	function newQuote() {
		loadQuote()
	}

	if (loading) {
		return (
			<div className='quote'>
				<p>Ładowanie...</p>
			</div>
		)
	}

	if (error || !quote) {
		return (
			<div className='quote'>
				<p>{error || 'Nie udało się pobrać cytatu.'}</p>
				<button className='btn' onClick={newQuote}>
					Spróbuj ponownie
				</button>
			</div>
		)
	}

	return (
		<div className='quote'>
			<p className='quoteText'>"{quote.content}"</p>
			<p className='muted'>— {quote.author}</p>
			<button className='btn' onClick={newQuote}>
				Nowy cytat
			</button>
		</div>
	)
}

export default QuoteOfTheDay
