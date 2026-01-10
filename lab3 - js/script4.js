// Część A

//nadajemy ID pierwszej sekcji z obrazkami.
const pierwszaSekcja = document.querySelector('section')
if (pierwszaSekcja && !pierwszaSekcja.id) {
	pierwszaSekcja.id = 'gallery'
}

// 12. getElementById
const galeria = document.getElementById('gallery')
if (!galeria) {
	console.log('Brak kontenera #gallery')
} else {
	// 13. querySelectorAll
	const obrazki = galeria.querySelectorAll('img')

	// 14. querySelector z selektorami CSS
	const tytul = document.querySelector('h1')

	// Część B

	// 18. zmiana tytułu galerii
	if (tytul) {
		tytul.textContent = 'Moja galeria multimedialna (JS + Lightbox)'
	}

	// 22. data-* atrybuty (indeks + opis)
	obrazki.forEach((img, index) => {
		img.dataset.index = index
		img.dataset.desc = img.alt || 'Brak opisu'
		img.style.cursor = 'pointer' // 20. inline style
	})

	// 19. klasy CSS na hover
	obrazki.forEach(img => {
		img.addEventListener('mouseenter', () => img.classList.add('hovered'))
		img.addEventListener('mouseleave', () => img.classList.remove('hovered'))
	})

	const style = document.createElement('style')
	style.innerHTML = `
    .hovered { outline: 3px solid #3b82f6; outline-offset: 2px; }
    .lbOverlay {
      position: fixed; left: 0; top: 0; width: 100%; height: 100%;
      background: rgba(0,0,0,0.8);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .lbBox {
      background: #111;
      padding: 10px;
      border-radius: 10px;
      max-width: 90%;
      max-height: 90%;
      color: white;
      font-family: Arial, sans-serif;
    }
    .lbBox img { max-width: 80vw; max-height: 70vh; display: block; margin: 0 auto; }
    .lbControls { display: flex; gap: 8px; justify-content: center; margin-top: 8px; }
    .lbControls button { padding: 6px 10px; cursor: pointer; }
    .lbDesc { margin-top: 8px; font-size: 14px; text-align: center; }
    .lbTop { display:flex; justify-content: flex-end; }
  `
	document.head.appendChild(style)

	// 21. modyfikacja atrybutów
	obrazki.forEach(img => {
		img.setAttribute('tabindex', '0')
	})

	//Część C - Lightbox

	// overlay
	const overlay = document.createElement('div')
	overlay.className = 'lbOverlay'

	const box = document.createElement('div')
	box.className = 'lbBox'

	const top = document.createElement('div')
	top.className = 'lbTop'

	// 11. przycisk X
	const btnClose = document.createElement('button')
	btnClose.textContent = 'X'

	const bigImg = document.createElement('img')
	const desc = document.createElement('div')
	desc.className = 'lbDesc'

	const controls = document.createElement('div')
	controls.className = 'lbControls'

	// 10. Poprzedni/Następny
	const btnPrev = document.createElement('button')
	btnPrev.textContent = 'Poprzedni'

	const btnNext = document.createElement('button')
	btnNext.textContent = 'Następny'

	top.appendChild(btnClose)
	controls.appendChild(btnPrev)
	controls.appendChild(btnNext)

	box.appendChild(top)
	box.appendChild(bigImg)
	box.appendChild(controls)
	box.appendChild(desc)

	overlay.appendChild(box)
	document.body.appendChild(overlay)

	let aktualnyIndex = 0

	function pokazLightbox(index) {
		aktualnyIndex = index

		const img = obrazki[aktualnyIndex]
		bigImg.src = img.getAttribute('src') // 21 getAttribute
		desc.textContent = img.dataset.desc // 13. tytuł/opis pod obrazem

		overlay.style.display = 'flex'
	}

	function zamknij() {
		overlay.style.display = 'none'
	}

	function nastepny() {
		aktualnyIndex++
		if (aktualnyIndex >= obrazki.length) aktualnyIndex = 0
		pokazLightbox(aktualnyIndex)
	}

	function poprzedni() {
		aktualnyIndex--
		if (aktualnyIndex < 0) aktualnyIndex = obrazki.length - 1
		pokazLightbox(aktualnyIndex)
	}

	// 9. Klik w obrazek otwiera overlay (event delegation)
	galeria.addEventListener('click', e => {
		const kliknietyImg = e.target.closest('img') // 15. closest
		if (!kliknietyImg) return

		const idx = Number(kliknietyImg.dataset.index)
		pokazLightbox(idx)
	})

	// przyciski
	btnClose.addEventListener('click', () => zamknij())
	btnNext.addEventListener('click', () => nastepny())
	btnPrev.addEventListener('click', () => poprzedni())

	// 11. klik poza obrazem (czyli na overlay) zamyka
	overlay.addEventListener('click', e => {
		if (e.target === overlay) {
			zamknij()
		}
	})

	// 12. klawiatura: strzałki + Escape
	document.addEventListener('keydown', e => {
		if (overlay.style.display !== 'flex') return

		if (e.key === 'Escape') zamknij()
		if (e.key === 'ArrowRight') nastepny()
		if (e.key === 'ArrowLeft') poprzedni()
	})
}
