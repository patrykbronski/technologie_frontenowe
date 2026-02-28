import useFetch from '../hooks/useFetch'
import useRenderCount from '../hooks/useRenderCount'

const QUOTE_API_URL = 'https://motivational-spark-api.vercel.app/api/quotes/random'

function QuoteOfTheDay() {
	useRenderCount('QuoteOfTheDay')

	const { data: quote, loading, error, refetch } = useFetch(QUOTE_API_URL, {
		transform: data => ({ content: data.quote, author: data.author }),
	})

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
				<button className='btn' onClick={refetch}>
					Spróbuj ponownie
				</button>
			</div>
		)
	}

	return (
		<div className='quote'>
			<p className='quoteText'>"{quote.content}"</p>
			<p className='muted'>— {quote.author}</p>
			<button className='btn' onClick={refetch}>
				Nowy cytat
			</button>
		</div>
	)
}

export default QuoteOfTheDay