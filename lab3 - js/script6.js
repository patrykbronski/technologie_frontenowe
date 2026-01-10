// 19. własna Promise z setTimeout (symulacja ładowania)
function fakeLoad(label, ms, fail) {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (fail) reject('Błąd: ' + label)
			else resolve('OK: ' + label)
		}, ms)
	})
}

// 20. then/catch/finally
fakeLoad('A', 400, false)
	.then(res => console.log('20) then:', res))
	.catch(err => console.log('20) catch:', err))
	.finally(() => console.log('20) finally: koniec'))

// 21. Promise.all
Promise.all([fakeLoad('all-1', 300, false), fakeLoad('all-2', 500, false), fakeLoad('all-3', 200, false)]).then(
	wyniki => {
		console.log('21) Promise.all:', wyniki)
	}
)

// 22. Promise.race jako timeout
function withTimeout(promise, ms) {
	const timeoutPromise = new Promise((_, reject) => {
		setTimeout(() => reject('Timeout po ' + ms + 'ms'), ms)
	})
	return Promise.race([promise, timeoutPromise])
}

withTimeout(fakeLoad('wolne', 1200, false), 600)
	.then(res => console.log('22) race OK:', res))
	.catch(err => console.log('22) race ERR:', err))

// 29-32: przepisanie na async/await + try/catch + sekwencyjnie + równolegle
async function demoAsync() {
	try {
		// 31. sekwencyjnie
		const a = await fakeLoad('seq-1', 200, false)
		const b = await fakeLoad('seq-2', 200, false)
		console.log('31) sekwencyjnie:', a, b)

		// 32. równolegle z Promise.all
		const wyniki = await Promise.all([fakeLoad('par-1', 300, false), fakeLoad('par-2', 350, false)])
		console.log('32) równolegle:', wyniki)
	} catch (e) {
		// 30. try/catch błędów
		console.log('30) błąd:', e)
	}
}
demoAsync()

const API = 'https://jsonplaceholder.typicode.com'

const app = document.createElement('div')
app.style.margin = '20px'
app.style.fontFamily = 'Arial, sans-serif'

app.innerHTML = `
  <h2>Zadanie 6 - Users (JSONPlaceholder)</h2>
  <button id="refreshBtn">Refresh</button>
  <span id="loader" style="margin-left:10px; display:none;">Ładowanie...</span>
  <div id="error" style="color:red; margin-top:10px;"></div>

  <div id="tableWrap" style="margin-top:10px;"></div>

  <h3 style="margin-top:20px;">Posty użytkownika</h3>
  <div id="postsInfo"></div>
  <ul id="postsList"></ul>
`
document.body.appendChild(app)

const refreshBtn = document.getElementById('refreshBtn')
const loader = document.getElementById('loader')
const errorBox = document.getElementById('error')
const tableWrap = document.getElementById('tableWrap')
const postsInfo = document.getElementById('postsInfo')
const postsList = document.getElementById('postsList')

function showLoader(flag) {
	loader.style.display = flag ? 'inline' : 'none'
}

function setError(msg) {
	errorBox.textContent = msg || ''
}

// 19. pobierz listę users /users
async function loadUsers() {
	setError('')
	postsInfo.textContent = ''
	postsList.innerHTML = ''
	showLoader(true)

	try {
		const res = await fetch(API + '/users')

		// wskazówka: fetch nie rzuca błędu przy 404/500 -> response.ok
		if (!res.ok) throw new Error('HTTP ' + res.status)

		const users = await res.json() // response.json() też jest Promise

		// 20. tabela HTML tworzona dynamicznie
		renderTable(users)
	} catch (e) {
		// 22. obsługa błędów + komunikat
		setError('Błąd pobierania użytkowników: ' + e.message)
	} finally {
		showLoader(false)
	}
}

function renderTable(users) {
	tableWrap.innerHTML = ''

	const table = document.createElement('table')
	table.border = '1'
	table.cellPadding = '8'
	table.style.borderCollapse = 'collapse'
	table.style.width = '100%'

	const thead = document.createElement('thead')
	thead.innerHTML = `
    <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Username</th>
      <th>Email</th>
    </tr>
  `
	table.appendChild(thead)

	const tbody = document.createElement('tbody')

	users.forEach(u => {
		const tr = document.createElement('tr')
		tr.style.cursor = 'pointer'

		tr.innerHTML = `
      <td>${u.id}</td>
      <td>${u.name}</td>
      <td>${u.username}</td>
      <td>${u.email}</td>
    `

		// 24. klik user -> /users/{id}/posts
		tr.addEventListener('click', () => loadPosts(u.id, u.name))

		tbody.appendChild(tr)
	})

	table.appendChild(tbody)
	tableWrap.appendChild(table)
}

// 24. pobierz posty użytkownika
async function loadPosts(userId, userName) {
	setError('')
	postsInfo.textContent = ''
	postsList.innerHTML = ''
	showLoader(true)

	try {
		const res = await fetch(API + '/users/' + userId + '/posts')
		if (!res.ok) throw new Error('HTTP ' + res.status)

		const posts = await res.json()

		postsInfo.textContent = 'Użytkownik: ' + userName + ' (ID ' + userId + '), postów: ' + posts.length

		posts.forEach(p => {
			const li = document.createElement('li')
			li.textContent = p.title
			postsList.appendChild(li)
		})
	} catch (e) {
		setError('Błąd pobierania postów: ' + e.message)
	} finally {
		showLoader(false)
	}
}

// 23. przycisk Refresh
refreshBtn.addEventListener('click', loadUsers)

// start
loadUsers()
