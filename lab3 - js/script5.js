// Formularze i walidacja
const form = document.querySelector('form')
const submitBtn = form.querySelector('button[type="submit"]')

// Pola do walidacji
const fullname = document.getElementById('fullname')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
const message = document.getElementById('message')
const terms = document.getElementById('terms')

// Style
const style = document.createElement('style')
style.innerHTML = `
  .errorText { color: red; font-size: 12px; margin-top: 4px; }
  .okField { outline: 2px solid green; }
  .badField { outline: 2px solid red; }
  .successBox { margin-top: 10px; padding: 10px; border: 1px solid green; color: green; display:none; }
`
document.head.appendChild(style)

const successBox = document.createElement('div')
successBox.className = 'successBox'
successBox.textContent = 'Sukces! Formularz wysłany.'
form.appendChild(successBox)

// helper: pokaż błąd pod polem
function setError(field, text) {
	clearError(field)

	field.classList.remove('okField')
	field.classList.add('badField')

	const div = document.createElement('div')
	div.className = 'errorText'
	div.textContent = text

	// wstawiane po polu
	field.insertAdjacentElement('afterend', div)
}

function setOk(field) {
	clearError(field)
	field.classList.remove('badField')
	field.classList.add('okField')
}

function clearError(field) {
	const next = field.nextElementSibling
	if (next && next.classList.contains('errorText')) {
		next.remove()
	}
}

// 23. Imię: min 2 znaki, tylko litery (z polskimi znakami)
function validateName() {
	const val = fullname.value.trim()
	const re = /^[A-Za-zĄĆĘŁŃÓŚŹŻąćęłńóśźż\s-]{2,}$/

	if (val.length < 2) {
		setError(fullname, 'Imię i nazwisko: minimum 2 znaki.')
		return false
	}
	if (!re.test(val)) {
		setError(fullname, 'Imię i nazwisko: tylko litery (także polskie), spacja lub myślnik.')
		return false
	}
	setOk(fullname)
	return true
}

// 24. Email regex
function validateEmail() {
	const val = email.value.trim()
	const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

	if (!re.test(val)) {
		setError(email, 'Email ma niepoprawny format.')
		return false
	}
	setOk(email)
	return true
}

// 25. Telefon: opcjonalny, ale jak jest to musi mieć 9 cyfr
function validatePhone() {
	const val = phone.value.trim()
	if (val === '') {
		// puste jest OK (opcjonalne). czyścimy oznaczenia
		phone.classList.remove('badField', 'okField')
		clearError(phone)
		return true
	}

	// wywalamy spacje, myślniki, +48 itd.
	const digits = val.replace(/\D/g, '')
	const last9 = digits.length > 9 ? digits.slice(-9) : digits

	if (!/^\d{9}$/.test(last9)) {
		setError(phone, 'Telefon: jeśli podany, musi mieć 9 cyfr.')
		return false
	}
	setOk(phone)
	return true
}

// 26. Wiadomość min 10 znaków
function validateMessage() {
	const val = message.value.trim()
	if (val.length < 10) {
		setError(message, 'Wiadomość: minimum 10 znaków.')
		return false
	}
	setOk(message)
	return true
}

// 27. Checkbox zgody
function validateTerms() {
	if (!terms.checked) {
		setError(terms, 'Musisz zaakceptować regulamin i politykę prywatności.')
		return false
	}
	// checkbox bez zielonej ramki, czyścimy błąd
	clearError(terms)
	terms.classList.remove('badField')
	return true
}

// 28. realtime
fullname.addEventListener('input', validateName)
fullname.addEventListener('blur', validateName)

email.addEventListener('input', validateEmail)
email.addEventListener('blur', validateEmail)

phone.addEventListener('input', validatePhone)
phone.addEventListener('blur', validatePhone)

message.addEventListener('input', validateMessage)
message.addEventListener('blur', validateMessage)

terms.addEventListener('change', validateTerms)

// 16-18: Pobieranie danych
function formDataToObject(fd) {
	const obj = {}
	for (const [k, v] of fd.entries()) {
		if (obj[k] === undefined) obj[k] = v
		else if (Array.isArray(obj[k])) obj[k].push(v)
		else obj[k] = [obj[k], v]
	}
	return obj
}

form.addEventListener('submit', e => {
	e.preventDefault()
	successBox.style.display = 'none'

	// Walidacja
	const ok = validateName() && validateEmail() && validatePhone() && validateMessage() && validateTerms()

	// 17. FormData API
	const fd = new FormData(form)

	// 18. pokaż w konsoli jako obiekt
	console.log('Dane formularza (wszystkie pola):', formDataToObject(fd))

	if (!ok) return

	// 17. UX: blokuj przycisk i pokaż "Wysyłanie..."
	const oldText = submitBtn.textContent
	submitBtn.disabled = true
	submitBtn.textContent = 'Wysyłanie...'

	// 18. Symulacja wysyłki 1500ms + sukces + reset
	setTimeout(() => {
		form.reset()

		// Czyścimy ramki po polach
		;[fullname, email, phone, message].forEach(f => {
			f.classList.remove('okField', 'badField')
			clearError(f)
		})
		clearError(terms)

		successBox.style.display = 'block'

		submitBtn.disabled = false
		submitBtn.textContent = oldText
	}, 1500)
})
