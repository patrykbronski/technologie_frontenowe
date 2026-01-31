function Card({ title, className = '', children }) {
	return (
		<section className={`card ${className}`}>
			{title ? <h2 className='cardTitle'>{title}</h2> : null}
			{children}
		</section>
	)
}

export default Card
