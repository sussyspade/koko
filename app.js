// Zainicjalizuj kontenery dla licytacji i dodatkowych przycisków
const biddingLevelsContainer = document.getElementById('biddingLevels');
const extraButtonsContainer = document.getElementById('extraButtons');
const explanationTextArea = document.getElementById('explanation');
const biddingDisplay = document.getElementById('biddingDisplay');

// Przycisk Cofnij i Reset
const undoButton = document.getElementById('undoButton');
const resetButton = document.getElementById('resetButton');

// Przycisk X, XX i Pass
const xButton = document.getElementById('xButton');
const xxButton = document.getElementById('xxButton');
const passButton = document.getElementById('passButton');

// Zmienna do śledzenia sekwencji licytacyjnej
let currentBiddingSequence = [];
let lastBid = null;

// Wyjaśnienia licytacyjne na podstawie sekwencji
const explanations = {
    "1C": "12-14 PC, skład dowolny",
    "1C 2H": "Blok na kierach",
    "1C 2S": "Blok na pikach",
    "1C 1D": "Negat, słaba karta",
    "1C Pass": "Niechęć do gry",
    // Dodaj więcej sekwencji w miarę potrzeby
};

// Poziomy licytacji
const biddingLevels = [1, 2, 3, 4, 5, 6, 7];

// Kolory (C, D, H, S, NT)
const suits = ["C", "D", "H", "S", "NT"];

// Funkcja do aktualizowania wyjaśnień
function updateExplanation() {
    const sequence = currentBiddingSequence.join(' ');
    const explanation = explanations[sequence] || "Brak wyjaśnień dla tej sekwencji.";
    explanationTextArea.value = explanation;
}

// Funkcja do sprawdzania, czy nowa licytacja jest wyższa od poprzedniej
function isBidValid(newBid) {
    if (!lastBid) return true; // Jeśli nie było poprzedniego bidu, wszystko jest dozwolone

    const bidOrder = ["C", "D", "H", "S", "NT"];
    const lastBidLevel = parseInt(lastBid[0], 10);
    const lastBidSuit = lastBid.slice(1);
    const newBidLevel = parseInt(newBid[0], 10);
    const newBidSuit = newBid.slice(1);

    // Pozwalaj na "Pass", "X", "XX"
    if (newBid === "Pass" || newBid === "X" || newBid === "XX") return true;

    // Sprawdzenie, czy nowy poziom jest wyższy lub (jeśli poziom taki sam) kolor wyższy
    if (newBidLevel > lastBidLevel) return true;
    if (newBidLevel === lastBidLevel && bidOrder.indexOf(newBidSuit) > bidOrder.indexOf(lastBidSuit)) {
        return true;
    }
    return false;
}

// Funkcja do obsługi kliknięcia poziomu licytacji
function handleBiddingLevelClick(level) {
    extraButtonsContainer.innerHTML = ''; // Wyczyszczenie poprzednich przycisków kolorów

    suits.forEach(suit => {
        const button = document.createElement('button');
        button.textContent = `${level}${suit}`;
        button.onclick = () => handleSuitClick(`${level}${suit}`);
        extraButtonsContainer.appendChild(button);
    });
}

// Funkcja do obsługi kliknięcia koloru
function handleSuitClick(bid) {
    if (isBidValid(bid)) {
        currentBiddingSequence.push(bid);
        lastBid = bid;
        updateBiddingDisplay();
        updateExplanation();
    }
}

// Funkcja do obsługi kliknięcia "Pass"
function handlePassClick() {
    if (isBidValid("Pass")) {
        currentBiddingSequence.push("Pass");
        lastBid = "Pass";
        updateBiddingDisplay();
        updateExplanation();
    }
}

// Funkcja do aktualizacji wyświetlania licytacji — z lewej do prawej, w rzędach
function updateBiddingDisplay() {
    biddingDisplay.innerHTML = ''; // Wyczyszczenie wyświetlacza

    let row = document.createElement('div');
    row.className = 'bid-row';

    // Iteracja po sekwencji i tworzenie elementów z licytacjami w rzędzie
    currentBiddingSequence.forEach((bid, index) => {
        const bidElement = document.createElement('div');
        bidElement.className = 'bid';
        bidElement.textContent = bid;

        // Dodajemy element licytacji do aktualnego rzędu
        row.appendChild(bidElement);

        // Co 4 elementy (po 4 licytacjach), tworzymy nowy rząd
        if ((index + 1) % 4 === 0) {
            biddingDisplay.appendChild(row); // Dodajemy pełny rząd
            row = document.createElement('div'); // Nowy rząd
            row.className = 'bid-row';
        }
    });

    // Dodaj ostatni rząd (jeżeli są licytacje w nim)
    if (row.childNodes.length > 0) {
        biddingDisplay.appendChild(row);
    }
}

// Inicjalizacja przycisków poziomów licytacji
biddingLevels.forEach(level => {
    const button = document.createElement('button');
    button.textContent = level;
    button.onclick = () => handleBiddingLevelClick(level);
    biddingLevelsContainer.appendChild(button);
});

// Przycisk Cofnij
undoButton.onclick = () => {
    if (currentBiddingSequence.length > 0) {
        currentBiddingSequence.pop();
        lastBid = currentBiddingSequence[currentBiddingSequence.length - 1] || null;
        updateBiddingDisplay();
        updateExplanation();
    }
};

// Przycisk Reset
resetButton.onclick = () => {
    currentBiddingSequence = [];
    lastBid = null;
    updateBiddingDisplay();
    updateExplanation();
};

// Przycisk X (kontra)
xButton.onclick = () => handleSuitClick("X");

// Przycisk XX (rekontra)
xxButton.onclick = () => handleSuitClick("XX");

// Przycisk Pass
passButton.onclick = () => handlePassClick();
