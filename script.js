// script.js
const gameContainer = document.getElementById('game-container');
const spaceship = document.getElementById('spaceship');
const propellant = document.getElementById('propellant');
const starfield = document.getElementById('starfield');
const livesDisplay = document.getElementById('lives');
const scoreDisplay = document.getElementById('score');
const gameOverScreen = document.getElementById('game-over');
const finalScoreDisplay = document.getElementById('final-score');
const laserBar = document.getElementById('laser-bar');

let lives = 3;
let score = 0;
let spaceshipX = 380;
let spaceshipY = 285;
let asteroids = [];
let fragments = [];
let lasers = [];
let laserCharge = 1;
const maxLaserCharge = 1;
const laserRechargeRate = 0.02;
const laserCooldownDuration = 500;
const spaceshipSpeed = 5;

// Starfield
for (let i = 0; i < 100; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.width = Math.random() * 2 + 'px';
    star.style.height = star.style.width;
    star.style.left = Math.random() * 800 + 'px';
    star.style.top = Math.random() * 600 + 'px';
    starfield.appendChild(star);
}

// Game loop
setInterval(gameLoop, 20);
setInterval(createAsteroid, 1000);
setInterval(rechargeLaser, 250);

function moveSpaceship() {
    // Constrain spaceship movement within the game area
    spaceship.style.left = Math.max(0, Math.min(spaceshipX, gameContainer.offsetWidth - spaceship.offsetWidth)) + 'px';
    spaceship.style.top = Math.max(0, Math.min(spaceshipY, gameContainer.offsetHeight - spaceship.offsetHeight)) + 'px';
}

function gameLoop() {
    moveSpaceship();
    moveAsteroids();
    moveFragments();
    moveLasers();
    checkCollisions();
}

function createAsteroid() {
    const asteroid = document.createElement('div');
    asteroid.className = 'asteroid';
    asteroid.style.width = Math.random() * 30 + 20 + 'px';
    asteroid.style.height = asteroid.style.width;
    asteroid.style.left = 800 + 'px';
    asteroid.style.top = Math.random() * 550 + 'px';
    asteroid.speedX = -Math.random() * 3 - 1;
    asteroid.speedY = (Math.random() - 0.5) * 2;
    gameContainer.appendChild(asteroid);
    asteroids.push(asteroid);
}

function moveAsteroids() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        asteroid.style.left = asteroid.offsetLeft + asteroid.speedX + 'px';
        asteroid.style.top = asteroid.offsetTop + asteroid.speedY + 'px';

        if (asteroid.offsetLeft < -50) {
            gameContainer.removeChild(asteroid);
            asteroids.splice(i, 1);
            i--;
        }
    }
}

function moveFragments() {
    for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        fragment.style.left = fragment.offsetLeft + fragment.speedX + 'px';
        fragment.style.top = fragment.offsetTop + fragment.speedY + 'px';

        if (fragment.offsetLeft < -20 || fragment.offsetTop < -20 || fragment.offsetTop > 620) {
            gameContainer.removeChild(fragment);
            fragments.splice(i, 1);
            i--;
        }
    }
}

function moveLasers() {
    for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
        laser.style.left = laser.offsetLeft + 10 + 'px';

        if (laser.offsetLeft > 800) {
            gameContainer.removeChild(laser);
            lasers.splice(i, 1);
            i--;
        }
    }
}

function checkCollisions() {
    for (let i = 0; i < asteroids.length; i++) {
        const asteroid = asteroids[i];
        if (checkCollision(spaceship, asteroid)) {
            loseLife();
            destroyAsteroid(asteroid);
            return;
        }
        for (let j = 0; j < lasers.length; j++) {
            const laser = lasers[j];
            if (checkCollision(laser, asteroid)) {
                destroyAsteroid(asteroid);
                gameContainer.removeChild(laser);
                lasers.splice(j, 1);
                j--;
                return;
            }
        }
    }
    for (let i = 0; i < fragments.length; i++) {
        const fragment = fragments[i];
        if (checkCollision(spaceship, fragment)) {
            loseLife();
            gameContainer.removeChild(fragment);
            fragments.splice(i, 1);
            i--;
            return;
        }
    }
}

function checkCollision(element1, element2) {
    const rect1 = element1.getBoundingClientRect();
    const rect2 = element2.getBoundingClientRect();
    return !(rect1.right < rect2.left || rect1.left > rect2.right || rect1.bottom < rect2.top || rect1.top > rect2.bottom);
}

function destroyAsteroid(asteroid) {
    const size = parseInt(asteroid.style.width);
    score += size;
    scoreDisplay.textContent = 'Score: ' + score;
    gameContainer.removeChild(asteroid);
    asteroids.splice(asteroids.indexOf(asteroid), 1);

    // Create fragments
    for (let i = 0; i < 3; i++) {
        const fragment = document.createElement('div');
        fragment.className = 'fragment';
        fragment.style.width = size / 3 + 'px';
        fragment.style.height = fragment.style.width;
        fragment.style.left = asteroid.offsetLeft + 'px';
        fragment.style.top = asteroid.offsetTop + 'px';
        fragment.speedX = (Math.random() - 0.5) * 4;
        fragment.speedY = (Math.random() - 0.5) * 4;
        gameContainer.appendChild(fragment);
        fragments.push(fragment);
    }
}

function loseLife() {
    lives--;
    livesDisplay.textContent = 'Lives: ' + lives;
    if (lives <= 0) {
        gameOver();
    }
}

function gameOver() {
    gameOverScreen.style.display = 'block';
    finalScoreDisplay.textContent = 'Final Score: ' + score;
    gameContainer.style.display = 'none';
}

function restartGame() {
    lives = 3;
    score = 0;
    spaceshipX = 380;
    spaceshipY = 285;
    asteroids = [];
    fragments = [];
    lasers = [];
    laserCharge = 1;
    laserCooldown = false;
    livesDisplay.textContent = 'Lives: ' + lives;
    scoreDisplay.textContent = 'Score: ' + score;
    gameOverScreen.style.display = 'none';
    gameContainer.style.display = 'block';
    spaceship.style.left = spaceshipX + 'px';
    spaceship.style.top = spaceshipY + 'px';

    const existingAsteroids = document.querySelectorAll('.asteroid');
    existingAsteroids.forEach(asteroid => gameContainer.removeChild(asteroid));
    const existingFragments = document.querySelectorAll('.fragment');
    existingFragments.forEach(fragment => gameContainer.removeChild(fragment));
    const existingLasers = document.querySelectorAll('.laser');
    existingLasers.forEach(laser => gameContainer.removeChild(laser));
}



document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            spaceshipY -= spaceshipSpeed;
            propellant.style.display = 'block';
            propellant.style.height = '30px';
            break;
        case 'ArrowDown':
            spaceshipY += spaceshipSpeed;
            propellant.style.display = 'block';
            propellant.style.height = '30px';
            break;
        case 'ArrowLeft':
            spaceshipX -= spaceshipSpeed;
            propellant.style.display = 'block';
            propellant.style.width = '20px';
            propellant.style.height = '10px';
            propellant.style.bottom = '-5px';
            propellant.style.left = '-10px';
            break;
        case 'ArrowRight':
            spaceshipX += spaceshipSpeed;
            propellant.style.display = 'block';
            propellant.style.width = '20px';
            propellant.style.height = '10px';
            propellant.style.bottom = '-5px';
            propellant.style.left = '10px';
            break;
        case ' ': // Space key for firing laser
            if (!laserCooldown) {
                fireLaser();
                laserCooldown = true;
            }
            break;
    }

    // Constrain spaceship movement within the game area
    spaceship.style.left = Math.max(0, Math.min(spaceshipX, gameContainer.offsetWidth - spaceship.offsetWidth)) + 'px';
    spaceship.style.top = Math.max(0, Math.min(spaceshipY, gameContainer.offsetHeight - spaceship.offsetHeight)) + 'px';

    // Hide propellant when not moving
    if (e.key !== 'ArrowUp' && e.key !== 'ArrowDown' && e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') {
        propellant.style.display = 'none';
    }
});

function fireLaser()  {
    if (laserCharge >= 1) {
        const laser = document.createElement('div');
        laser.className = 'laser';
        laser.style.left = spaceship.offsetLeft + spaceship.offsetWidth / 2 - 2.5 + 'px';
        laser.style.top = spaceship.offsetTop - 10 + 'px';
        gameContainer.appendChild(laser);
        lasers.push(laser);

        laserCharge -= maxLaserCharge;
        laserBar.style.transform = `scaleX(${laserCharge})`;
        laserBar.style.backgroundColor = `rgb(${Math.floor(255 * (1 - laserCharge))}, 255, 0)`;
    }
}

function rechargeLaser() {
    if (laserCharge < maxLaserCharge) {
        laserCharge += laserRechargeRate;
        if (laserCharge >= maxLaserCharge) {
            laserCharge = maxLaserCharge;
            laserBar.style.transform = `scaleX(${laserCharge})`;
            laserBar.style.backgroundColor = 'green';
        } else {
            laserBar.style.transform = `scaleX(${laserCharge})`;
            laserBar.style.backgroundColor = `rgb(${Math.floor(255 * (1 - laserCharge))}, 255, 0)`;
        }
    }
}


document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowUp':
            spaceshipY -= spaceshipSpeed;
            propellant.style.display = 'block';
            propellant.style.height = '30px';
            propellant.style.width = '10px';
            propellant.style.bottom = '-10px';
            propellant.style.left = '15px';
            // ... (movement and propellant logic)
            break;
        case 'ArrowDown':
            spaceshipY += spaceshipSpeed;
            propellant.style.display = 'block';
            propellant.style.height = '30px';
            propellant.style.width = '10px';
            propellant.style.bottom = '-10px';
            propellant.style.left = '15px';
            // ... (movement and propellant logic)
            break;
        case 'ArrowLeft':
            spaceshipX -= spaceshipSpeed;
            propellant.style.display = 'block';
            propellant.style.width = '10px';
            propellant.style.height = '20px';
            propellant.style.bottom = '-10px';
            propellant.style.left = '-20px'; 
            // ... (movement and propellant logic)
            break;
        case 'ArrowRight':
            spaceshipX += spaceshipSpeed;
            propellant.style.display = 'block';
            propellant.style.width = '10px';
            propellant.style.height = '20px';
            propellant.style.bottom = '-10px';
            propellant.style.left = '30px'; 
            // ... (movement and propellant logic)
            break;
        case 'Space':
            if (laserCharge >= 1) { // Check charge level *before* setting cooldown
                fireLaser();
            }
            break;
    }

    // Constrain spaceship movement
    spaceship.style.left = Math.max(0, Math.min(spaceshipX, gameContainer.offsetWidth - spaceship.offsetWidth)) + 'px';
    spaceship.style.top = Math.max(0, Math.min(spaceshipY, gameContainer.offsetHeight - spaceship.offsetHeight)) + 'px';

    if (e.code !== 'ArrowUp' && e.code !== 'ArrowDown' && e.code !== 'ArrowLeft' && e.code !== 'ArrowRight') {
        propellant.style.display = 'none';
    }
});

//Game loop and other intervals - AFTER the event listener
setInterval(gameLoop, 20);
setInterval(createAsteroid, 1000);
setInterval(rechargeLaser, 250);