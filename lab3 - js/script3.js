// 1) funkcja declaration
function poleProstokata(a, b) {
	return a * b
}
console.log('poleProstokata:', poleProstokata(3, 4))

// 2) function expression
const poleProstokata2 = function (a, b) {
	return a * b
}
console.log('poleProstokata2:', poleProstokata2(5, 2))

// 3) arrow function
const poleProstokata3 = (a, b) => a * b
console.log('poleProstokata3:', poleProstokata3(10, 2))

// 4) parametry domyślne
function przywitanie(imie = 'Nieznajomy') {
	console.log('Cześć ' + imie)
}
przywitanie()
przywitanie('Patryk')

// 5) var vs let w pętli + setTimeout
for (var i = 1; i <= 3; i++) {
	setTimeout(function () {
		console.log('var i:', i)
	}, 0)
}

for (let j = 1; j <= 3; j++) {
	setTimeout(function () {
		console.log('let j:', j)
	}, 0)
}

// 6) closure: licznik
function zrobLicznik() {
	let licznik = 0

	return function () {
		licznik++
		return licznik
	}
}

const liczA = zrobLicznik()
console.log('liczA:', liczA()) // 1
console.log('liczA:', liczA()) // 2
console.log('liczA:', liczA()) // 3

const liczB = zrobLicznik()
console.log('liczB:', liczB()) // 1 (osobny licznik)
