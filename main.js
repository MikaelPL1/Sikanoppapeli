document.addEventListener("DOMContentLoaded", () => {
    const pelaajatM = document.getElementById("pmaara");
    const pelaajanimetM = document.getElementById("playerNames");
    const pelaajakentta = document.getElementById("playerForm");
    const virhe = document.getElementById("errorMessage");
    const setupM = document.getElementById("pelic");
    const peliM = document.getElementById("pelib");
    const pelivuoroM = document.getElementById("nowpelaaja");
    const diceImage = document.getElementById("diceImage");
    const vuoropisteM = document.getElementById("turnScore");
    const scoreboardM = document.getElementById("scoreboard");
    const rollDiceButton = document.getElementById("rolln");
    const endTurnButton = document.getElementById("vuorov");
    const winnerMessage = document.getElementById("winnerMessage");

    let players = [];
    let scores = [];
    let currentTurn = 0;
    let currentTurnScore = 0;

    pelaajatM.addEventListener("change", () => {
        const playermaara = parseInt(pelaajatM.value, 10);
        pelaajanimetM.innerHTML = `<h3>Syötä pelaajien nimet:</h3>`;
        for (let i = 1; i <= playermaara; i++) {
            const input = document.createElement("input");
            input.type = "text";
            input.name = `player${i}`;
            input.placeholder = `Pelaaja ${i}`;
            input.required = true;
            pelaajanimetM.appendChild(input);
        }
        pelaajanimetM.classList.remove("hidden");
    });

    pelaajakentta.addEventListener("submit", (event) => {
        event.preventDefault();
        const formData = new FormData(pelaajakentta);
        players = [];
        for (let [key, value] of formData.entries()) {
            if (key.startsWith("player")) {
                players.push(value.trim());
            }
        }

        setupM.classList.add("hidden");
        peliM.classList.remove("hidden");
        scores = Array(players.length).fill(0);
        updateScoreboard();
        updateCurrentPlayer();
    });

    function updateCurrentPlayer() {
        pelivuoroM.textContent = `Vuorossa: ${players[currentTurn]}`;
    }

    function updateScoreboard() {
        scoreboardM.innerHTML = "";
        players.forEach((player, index) => {
            const li = document.createElement("li");
            li.textContent = `${player}: ${scores[index]} pistettä`;
            scoreboardM.appendChild(li);
        });
    }

    rollDiceButton.addEventListener("click", () => {
        const roll = Math.floor(Math.random() * 6) + 1;
        diceImage.src = `nopat/Dice-${roll}.png`;

        if (roll === 1) {
            currentTurnScore = 0;
            alert(`${players[currentTurn]} heitti ykkösen! Vuoro siirtyy.`);
            nextTurn();
        } else {
            currentTurnScore += roll;
            vuoropisteM.textContent = "Vuoron pisteet: " + currentTurnScore;

            if (scores[currentTurn] + currentTurnScore >= 100) {
                scores[currentTurn] += currentTurnScore;
                updateScoreboard();
                endGame(players[currentTurn]);
            }
        }
    });

    endTurnButton.addEventListener("click", () => {
        scores[currentTurn] += currentTurnScore;
        if (scores[currentTurn] >= 100) {
            updateScoreboard();
            endGame(players[currentTurn]);
            return;
        }
        currentTurnScore = 0;
        nextTurn();
    });

    function nextTurn() {
        currentTurn = (currentTurn + 1) % players.length;
        currentTurnScore = 0;
        vuoropisteM.textContent = "Vuoron pisteet: " + currentTurnScore;
        updateScoreboard();
        updateCurrentPlayer();
    }

    function endGame(winner) {
        winnerMessage.textContent = `${winner} voitti pelin!`;
        winnerMessage.classList.remove("hidden");
        rollDiceButton.disabled = true;
        endTurnButton.disabled = true;
    }

    function resetGame() {
        setupM.classList.remove("hidden");
        peliM.classList.add("hidden");
        players = [];
        scores = [];
        currentTurn = 0;
        currentTurnScore = 0;
        pelaajanimetM.innerHTML = "";
        vuoropisteM.textContent = "0";
        diceImage.src = "nopat/Dice-1.png";
        winnerMessage.classList.add("hidden");
        winnerMessage.textContent = "";
        rollDiceButton.disabled = false;
        endTurnButton.disabled = false;
    }
});

  