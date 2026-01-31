function Header({ saving }) {
	const today = new Date().toLocaleDateString()

	return (
		<header className='header'>
			<div className='headerLeft'>
				<h1 className='title'>📋 Menedżer Zadań</h1>
				<p className='muted'>{today}</p>
			</div>
			<div className='headerRight'>{saving ? <span className='badge'>Zapisywanie...</span> : null}</div>
		</header>
	)
}

export default Header
