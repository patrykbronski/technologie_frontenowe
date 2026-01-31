function CategoryFilter({ value, onChange }) {
	return (
		<div className='categoryFilter'>
			<select className='select' value={value} onChange={e => onChange(e.target.value)}>
				<option value='all'>Wszystkie kategorie</option>
				<option value='Praca'>Praca</option>
				<option value='Dom'>Dom</option>
				<option value='Zakupy'>Zakupy</option>
				<option value='Inne'>Inne</option>
			</select>
		</div>
	)
}

export default CategoryFilter
