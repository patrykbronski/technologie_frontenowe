import { useRef } from 'react'
import useRenderCount from '../hooks/useRenderCount'

function Header({ saving }) {
	useRenderCount('Header')

	const todayRef = useRef(new Date().toLocaleDateString())

	return (
		<header className='header'>
			<div className='headerLeft'>
				<h1 className='title'>📋 Menedżer Zadań</h1>
				<p className='muted'>{todayRef.current}</p>
			</div>
			<div className='headerRight'>{saving ? <span className='badge'>Zapisywanie...</span> : null}</div>
		</header>
	)
}

export default Header