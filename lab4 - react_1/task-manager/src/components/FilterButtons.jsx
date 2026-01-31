function FilterButtons({ filter, setFilter }) {
	return (
		<div className='filters'>
			<button className={`btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
				Wszystkie
			</button>
			<button className={`btn ${filter === 'active' ? 'active' : ''}`} onClick={() => setFilter('active')}>
				Aktywne
			</button>
			<button className={`btn ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>
				Zrobione
			</button>
		</div>
	)
}

export default FilterButtons
