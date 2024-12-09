document.addEventListener("DOMContentLoaded", () => {
  const pelaajatM = document.getElementById("pmaara");
  const pelaajanimetM = document.getElementById("playerNames");
  const pelaajakentta = document.getElementById("playerForm");
  const setupM = document.getElementById("pelib");
  const peliM = document.getElementById("pelic");
  const pelivuoroM = document.getElementById("nowpelaaja");
  const noppaKuva1 = document.getElementById("dice1Image");
  const noppaKuva2 = document.getElementById("dice2Image");
  const vuoropisteM = document.getElementById("nowpisteet");
  const scoreboardM = document.getElementById("scoreboard");
  const noppaNappi = document.getElementById("rolln");
  const lopetaVuoroNappi = document.getElementById("vuorov");
  const voittajaIlmoitus = document.getElementById("winnerMessage");
  const aloitaPeliNappi = document.getElementById("aloitabtn");

  let players = [];
  let scores = [];
  let currentTurn = 0;
  let currentTurnScore = 0;

  pelaajatM.addEventListener("change", () => {
    const playerCount = parseInt(pelaajatM.value);

    if (playerCount) {
      pelaajanimetM.innerHTML = `<h3>Syötä pelaajien nimet:</h3>`;
      for (let i = 1; i <= playerCount; i++) {
        const input = document.createElement("input");
        input.type = "text";
        input.name = `player${i}`;
        input.placeholder = `Pelaaja ${i}`;
        input.required = true;
        pelaajanimetM.appendChild(input);
      }
      pelaajanimetM.classList.remove("hidden");
      aloitaPeliNappi.disabled = false;

      let pistemäärä;
      do {
        pistemäärä = prompt("Syötä pistemäärä väliltä 100-500:");
      } while (isNaN(pistemäärä) || pistemäärä < 100 || pistemäärä > 500);

      sessionStorage.setItem("pistemäärä", pistemäärä);
    } else {
      aloitaPeliNappi.disabled = true;
      pelaajanimetM.classList.add("hidden");
    }
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

  let tuplats = 0; 

  noppaNappi.addEventListener("click", () => {
    const roll1 = Math.floor(Math.random() * 6) + 1;
    const roll2 = Math.floor(Math.random() * 6) + 1;
  
    
    noppaKuva1.src = `nopat/Dice-${roll1}.png`;
    noppaKuva2.src = `nopat/Dice-${roll2}.png`;
  
    if (roll1 !== 1 && roll1 === roll2) {
      if (currentTurnScore === 0) {
        currentTurnScore = ((roll1 + roll2) * 2) - (roll1 + roll2);
      } else {
        currentTurnScore += (roll1 + roll2) * 2 - (roll1 + roll2); 
      }
      tuplats++; 
    }
  
    if (roll1 === 1 && roll2 === 1) {
      currentTurnScore += 23;
      tuplats++; 
    }
  
    if (tuplats >= 3) {
      alert("Heitit kolme tuplaa peräkkäin! Vuoro siirtyy.");
      currentTurnScore = 0; 
      tuplats = 0; 
      nextTurn(); 
      return;
    }
  
    if ((roll1 === 1 || roll2 === 1) && !(roll1 === 1 && roll2 === 1)) {
      currentTurnScore = 0; 
      alert(`${players[currentTurn]} heitti ykkösen! Vuoro siirtyy.`);
      nextTurn();
    } else {
      const turnScore = roll1 + roll2;
      currentTurnScore += turnScore;
      vuoropisteM.textContent = "Vuoron pisteet: " + currentTurnScore;
  
      const pistemäärä = sessionStorage.getItem("pistemäärä");
      if (scores[currentTurn] + currentTurnScore >= pistemäärä) {
        scores[currentTurn] += currentTurnScore;
        updateScoreboard();
        endGame(players[currentTurn]);
      }
    }
  });
  

  lopetaVuoroNappi.addEventListener("click", () => {
    scores[currentTurn] += currentTurnScore;
    const pistemäärä = sessionStorage.getItem("pistemäärä");
    if (scores[currentTurn] >= pistemäärä) {
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
    vuoropisteM.textContent = currentTurnScore;
    updateScoreboard();
    updateCurrentPlayer();
  }

  function endGame(winner) {
    voittajaIlmoitus.textContent = `${winner} voitti pelin!`;
    voittajaIlmoitus.classList.remove("hidden");
    noppaNappi.disabled = true;
    lopetaVuoroNappi.disabled = true;
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
    noppaKuva1.src = "nopat/Dice-1.png";
    noppaKuva2.src = "nopat/Dice-1.png";
    voittajaIlmoitus.classList.add("hidden");
    voittajaIlmoitus.textContent = "";
    noppaNappi.disabled = false;
    lopetaVuoroNappi.disabled = false;
  }
});


