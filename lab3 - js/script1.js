console.log('Skrypt załadowany!');
const imie = 'Patryk';
const wiek = 26;
const tak_nie = true;
const jezyki = ['js', 'java', 'dart'];
const obiekt = {
    imie: 'Patryk',
    wiek: 26,
    miasto: 'Krosno'
};
const zmienna_null = null;
let zmienna_undefined;


console.log("Zmienna imie jest typu " + typeof imie);
console.log("Zmienna wiek jest typu " + typeof wiek);
console.log("Zmienna tak_nie jest typu " + typeof tak_nie);
console.log("Zmienna jezyki jest typu " + typeof jezyki);
console.log("Zmienna obiekt jest typu " + typeof obiekt);
console.log("Zmienna zmienna_null jest typu " + typeof zmienna_null);
console.log("Zmienna zmienna_undefined jest typu " + typeof zmienna_undefined);




console.log("---------------------------------")

let liczba_tekst = '5';
let liczba1 = 10;
let liczba2 = 5;

console.log("Liczba 1 = 10");
console.log("Liczba 2 = 5");
console.log("Wynik dodawania: " + parseInt(liczba1 + liczba2));
console.log("Wynik odejmowania: " + parseInt(liczba1 - liczba2));
console.log("Wynik mnożenia: " + parseInt(liczba1 * liczba2));
console.log("Wynik dzielenia: " + parseInt(liczba1 / liczba2));
console.log("Reszta z dzielenia: " + parseInt(liczba1 % liczba2));
console.log("Wynik potęgowania: " + parseInt(liczba1 ** liczba2));



console.log("---------------------------------")

console.log("Czy liczba_tekst == liczba2? Odpowiedź: " + (liczba_tekst == liczba2));
console.log("Czy liczba_tekst === liczba2? Odpowiedź: " + (liczba_tekst === liczba2));