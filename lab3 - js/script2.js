// Część A

// 4. Funkcja parzysta/nieparzysta
function parzystaCzyNie(liczba) {
	if (liczba % 2 === 0) {
		return 'parzysta'
	} else {
		return 'nieparzysta'
	}
}
console.log('4) 7:', parzystaCzyNie(7))
console.log('4) 12:', parzystaCzyNie(12))

// 5. Kalkulator ocen (0-100 -> ocena słowna)
function ocenaSlowna(punkty) {
	if (punkty < 0 || punkty > 100) return 'BŁĄD: zakres 0-100'

	if (punkty >= 90) return 'bardzo dobry'
	else if (punkty >= 75) return 'dobry'
	else if (punkty >= 60) return 'dostateczny'
	else if (punkty >= 50) return 'dopuszczający'
	else return 'niedostateczny'
}
console.log('5) 82:', ocenaSlowna(82))
console.log('5) 45:', ocenaSlowna(45))

// 6. switch - dzień tygodnia po numerze (1-7)
function dzienTygodnia(nr) {
	switch (nr) {
		case 1:
			return 'Poniedziałek'
		case 2:
			return 'Wtorek'
		case 3:
			return 'Środa'
		case 4:
			return 'Czwartek'
		case 5:
			return 'Piątek'
		case 6:
			return 'Sobota'
		case 7:
			return 'Niedziela'
		default:
			return 'BŁĄD: podaj 1-7'
	}
}
console.log('6) 6:', dzienTygodnia(6))

// 7. ternary - pełnoletność
function pelnoletni(wiek) {
	return wiek >= 18 ? 'pełnoletni' : 'niepełnoletni'
}
console.log('7) 17:', pelnoletni(17))
console.log('7) 22:', pelnoletni(22))

// Część B

// 8. for 1..10
console.log('8) for 1..10')
for (let i = 1; i <= 10; i++) {
	console.log(i)
}

// 9. while 10..0
console.log('9) while 10..0')
let x = 10
while (x >= 0) {
	console.log(x)
	x--
}

// 10. for...of po tablicy
console.log('10) for...of po tablicy')
const tab = ['JS', 'HTML', 'CSS']
for (const el of tab) {
	console.log(el)
}

// 11. for...in po obiekcie
console.log('11) for...in po obiekcie')
const osoba = { imie: 'Patryk', miasto: 'Krosno', rok: 3 }
for (const klucz in osoba) {
	console.log(klucz + ':', osoba[klucz])
}

// 12. break i continue
console.log('12) break/continue')
for (let i = 1; i <= 12; i++) {
	if (i === 3) continue // pomijamy 3
	if (i === 9) break // kończymy przy 9
	console.log(i)
}

// Część C
console.log('C) TABLICZKA MNOŻENIA')
for (let i = 1; i <= 10; i++) {
	let linia = ''
	for (let j = 1; j <= 10; j++) {
		linia += i * j + '\t'
	}
	console.log(linia)
}
