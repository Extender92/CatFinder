// Array of image URLs for each location in the game board
const imagesArray = [
  "image1.jpg",
  "image2.jpg",
  "image3.jpg",
  "image4.jpg",
  "image5.jpg",
  "image6.jpg",
  "image7.jpg",
  "image8.jpg",
  "image9.jpg",
  "image10.jpg",
  "image11.jpg",
  "image12.jpg",
  "image13.jpg",
  "image14.jpg",
  "image15.jpg",
  "image16.jpg",
  "image17.jpg",
  "image18.jpg",
  "image19.jpg",
  "image20.jpg",
  "image21.jpg",
  "image22.jpg",
  "image23.jpg",
  "image24.jpg",
  "image25.jpg",
];

let jokeText = document.getElementById('joke-text');

const jumpscareImg = document.createElement('img');
jumpscareImg.src = 'images/jumpscare.webp';
jumpscareImg.id = 'jumpscare';

let maxCats = 4;
let cats = generateRandomCatsArray(maxCats);

let maxZombies = 2;
let zombies = generateZombies(maxZombies);

let playerPosition = { x: 0, y: 0 };

let highScore = 999;

let savedCats = 0;

let turns = 0;

function generateRandomCatsArray(numCats) {
  const catsArray = [];
  for (let i = 0; i < numCats; i++) {
    let cat = {x: Math.floor(Math.random() * 5), y: Math.floor(Math.random() * 5)};
    while (catsArray.some(existingCat => existingCat.x === cat.x && existingCat.y === cat.y) || (cat.x === 0 && cat.y === 0)) {
      cat = {x: Math.floor(Math.random() * 5), y: Math.floor(Math.random() * 5)};
    }
    catsArray.push(cat);
  }
  return catsArray;
}

function generateZombies(numZombies) {
  const ZombieArray = [];
  for (let i = 0; i < numZombies; i++) {
    let zombie = {x: 4, y: 4};
    ZombieArray.push(zombie);
  }
  return ZombieArray;
}

function movePlayer(direction) {
  switch (direction) {
    case "north":
      if (playerPosition.y > 0) {
        playerPosition.y -= 1;
      }
      break;
    case "south":
      if (playerPosition.y < 4) {
        playerPosition.y += 1;
      }
      break;
    case "east":
      if (playerPosition.x < 4) {
        playerPosition.x += 1;
      }
      break;
    case "west":
      if (playerPosition.x > 0) {
        playerPosition.x -= 1;
      }
      break;
  }
}

function moveZombies() {
  zombies.forEach(zombie => {
    if (trueOrFalse()) {
      const distanceToPlayer = Math.abs(zombie.x - playerPosition.x) + Math.abs(zombie.y - playerPosition.y);
      if (distanceToPlayer <= 3) {
        if (zombie.x === playerPosition.x) {
          // move along y-axis
          if (zombie.y < playerPosition.y) {
            zombie.y += 1;
          } 
          else {
            zombie.y -= 1;
          }
        } 
        else if (zombie.y === playerPosition.y) {
          // move along x-axis
          if (zombie.x < playerPosition.x) {
            zombie.x += 1;
          } 
          else {
            zombie.x -= 1;
          }
        } 
        else {
          // move towards player along x or y axis
          const moveX = Math.random() < 0.5;
          const movePositive = Math.random() < 0.5;
          if (moveX) {
            const newX = movePositive ? zombie.x + 1 : zombie.x - 1;
            if (newX >= 0 && newX <= 4) {
              zombie.x = newX;
            }
          } 
          else {
            const newY = movePositive ? zombie.y + 1 : zombie.y - 1;
            if (newY >= 0 && newY <= 4) {
              zombie.y = newY;
            }
          }
        }
      } 
      else {
        // move in a random direction
        let validMove = false;
        while (!validMove) {
          if (trueOrFalse()) {
            const newX = trueOrFalse() ? zombie.x + 1 : zombie.x - 1;
            if (newX >= 0 && newX <= 4) {
              zombie.x = newX;
              validMove = true;
            }
          } 
          else {
            const newY = trueOrFalse() ? zombie.y + 1 : zombie.y - 1;
            if (newY >= 0 && newY <= 4) {
              zombie.y = newY;
              validMove = true;
            }
          }
        }
      }
    }
  });
}

function trueOrFalse() {
  return Math.random() < 0.5;
}

function saveCat() {
  var catCounter = document.getElementById("cat-counter");
  savedCats++;
  catCounter.innerHTML = "Cats saved: " + savedCats + " / " + maxCats;
}

function updateGameBoard() {
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 5; x++) {
      const button = document.getElementById(`button-${y + 1}-${x + 1}`);
      if (x === playerPosition.x && y === playerPosition.y) {
        button.style.backgroundColor = "yellow";
      }
      else {
        const distanceToPlayer = Math.abs(x - playerPosition.x) + Math.abs(y - playerPosition.y);
        if (distanceToPlayer === 1 && zombies.some(p => p.x === x && p.y === y)) {
          button.style.backgroundColor = "red";
        } 
        else {
          button.style.backgroundColor = "green";
        }
      }
    }
  }
}

function updateImage() {
  const imageIndex = playerPosition.y * 5 + playerPosition.x;
  const imageSrc = "images/" + imagesArray[imageIndex];
  const locationImage = document.getElementById("location-image");
  locationImage.src = imageSrc;

  const catImage = document.getElementById("cat-image");
  let catOnPosition = false;
  for (let cat of cats) {
    if (cat.x === playerPosition.x && cat.y === playerPosition.y) {
      catOnPosition = true;
      break;
    }
  }
  if (catOnPosition) {
    catImage.src = "images/cat.png";
  } else {
    catImage.src = '';
  }
}

function checkPlayerSaveCat() {
  for (let i = cats.length - 1; i >= 0; i--) {
    if (cats[i].x === playerPosition.x && cats[i].y === playerPosition.y) {
      cats.splice(i, 1)[0];
      saveCat();
    }
    if (cats.length == 0){
      setTimeout(function() {
        alert("There are no more cats to be saved!");
        resetGame();
      }, 100);
    }
  }
}

function checkPlayerEatenByZombie() {
  if (zombies.some(p => p.x === playerPosition.x && p.y === playerPosition.y)) {
    const catText = savedCats === 1 ? 'cat' : 'cats';
    const message = savedCats > 0 ? `You were eaten by a zombie... But you at least managed to save ${savedCats} ${catText}!` : 'You were eaten by a zombie...';
    jumpscare();
    setTimeout(function() {
      alert(message);
      resetGame();
    }, 2000);
  }
}

function resetGame() {
  jumpscareImg.style.display = "none";
  if (highScore > turns && savedCats === 4){
    var highScoreText = document.getElementById("high-score");
    highScore = turns;
    highScoreText.innerHTML = "Least Number Of Moves You Saved All Cats In: " + highScore
  }
  var turnCounter = document.getElementById("turn-counter");
  turns = 0;
  turnCounter.innerHTML = "Moves: " + turns;
  savedCats = 0;
  var catCounter = document.getElementById("cat-counter");
  catCounter.innerHTML = "Cats Saved: 0 / " + maxCats;
  playerPosition = { x: 0, y: 0 };
  var zombieCounter = document.getElementById("zombie-counter");
  zombieCounter.innerHTML = "Number of Zombies: " + maxZombies;
  zombies = generateZombies(maxZombies);
  cats = generateRandomCatsArray(maxCats);
  updateImage();
  updateGameBoard();
}

function interaction(direction) {
  var turnCounter = document.getElementById("turn-counter");
  turns++;
  turnCounter.innerHTML = "Moves: " + turns;
  moveZombies();
  movePlayer(direction);
  updateImage();
  updateGameBoard();
  checkPlayerEatenByZombie();
  checkPlayerSaveCat();
  fetchDadJoke();
}

function fetchDadJoke() {
  fetch('https://icanhazdadjoke.com/', {
    headers: {
      Accept: 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => {
      jokeText.textContent = data.joke;
    })
    .catch(error => {
      jokeText.textContent = 'Failed to fetch joke';
    });
}

function jumpscare() {
  jumpscareImg.style.position = 'fixed';
  jumpscareImg.style.top = '50%';
  jumpscareImg.style.left = '50%';
  jumpscareImg.style.transform = 'translate(-50%, -50%)';
  jumpscareImg.style.width = '0%';
  jumpscareImg.style.height = '0%';
  jumpscareImg.style.zIndex = '9999';
  jumpscareImg.style.display = 'block';
  document.body.appendChild(jumpscareImg);
  
  let percentSize = 0;
  const scaleInterval = setInterval(function() {
    percentSize += 10;
    jumpscareImg.style.width = percentSize + '%';
    jumpscareImg.style.height = percentSize + '%';
    
    if (percentSize >= 100) {
      clearInterval(scaleInterval);
      jumpscareImg.classList.add('active');
    }
  }, 10);
}

document.getElementById("move-north").addEventListener("click", function () {
  interaction("north");
});
document.getElementById("move-south").addEventListener("click", function () {
  interaction("south");
});
document.getElementById("move-east").addEventListener("click", function () {
  interaction("east");
});
document.getElementById("move-west").addEventListener("click", function () {
  interaction("west");
});

document.getElementById("add-cat").addEventListener("click", function () {
  maxCats = Math.min(24, maxCats + 1);
  resetGame();
});
document.getElementById("remove-cat").addEventListener("click", function () {
  maxCats = Math.max(1, maxCats - 1);
  resetGame();
});

document.getElementById("add-zombie").addEventListener("click", function () {
  maxZombies = Math.min(8, maxZombies + 1);
  resetGame();
});
document.getElementById("remove-zombie").addEventListener("click", function () {
  maxZombies = Math.max(1, maxZombies - 1);
  resetGame();
});

resetGame();