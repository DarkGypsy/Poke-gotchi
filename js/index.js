const $newGame = document.getElementById('new-game');
const $continueGame = document.getElementById('continue-game');
const savedGame = localStorage.getItem('savedGame');
const $game = document.getElementById('game');
const $gameUpper = document.getElementById('upper-area');
const $gameStats = document.getElementById('stats-area');
const $hunger = document.getElementById('hunger');
const $happiness = document.getElementById('happiness');
const $energy = document.getElementById('energy');
const $experience = document.getElementById('lvl');
const $trainerName = document.getElementById('trainer-name');
const $energyBar = document.getElementById('energy-bar');
const $energyBarTxT = document.getElementById("energy-bar-txt");
const $hungerBar = document.getElementById('hunger-bar');
const $hungerBarTxT = document.getElementById("hunger-bar-txt");
const $happinessBar = document.getElementById('happiness-bar');
const $happinessBarTxt = document.getElementById('happiness-bar-txt');
const $experienceBar = document.getElementById('experience-bar');
const $experienceBarTxt = document.getElementById('experience-bar-txt');
const $lvlTxt = document.getElementById('lvl-num');
const $music = document.getElementById('music');
const $sound = document.getElementById('sound');
const $energyTxt = document.getElementById('energy-txt');
const $hungerTxt = document.getElementById('hunger-txt');
const $happinessTxt = document.getElementById('happiness-txt');
const $pokeimg = document.createElement('img');
const $filter = document.createElement('div');
const $background = document.getElementById('bg');
$background.classList.add('lab');
$filter.classList.add('filter');
$music.src ='./assets/audio/Pokémon-HQ-Laboratory.mp3';
let trainer = {
   name: '',
   gender: '',
   pokemon: {
      name:'',
      lvl:{
         current: 1,
         evolution_chain: '',
         minLvl: 0,
         species: '',
         evolves_to:'',
         evolution: 0
      },
      hp: {
         max: 0,
         min: 0,
         current: 0,
         percentage: 0
      },
      hunger: {
         max: 100,
         current: 55,
         min: 0
      },
      happiness: {
         max: 100,
         current: 55,
         min: 0
      },
      exp: {
         max: 100,
         current: 0,
         min: 0,
         percentage:0
      },
      sprite: '',
      fail: 0
   },
   time: {
      hours: 0,
      mins: 0,
      secs: 0,
   }
};
const pokeList = [1, 4, 7, 10, 13, 16, 19, 23, 41, 50, 52, 54, 56, 58, 77, 79, 81, 84, 86, 88, 98, 100, 104, 109, 116, 118, 129, 147];
//This event listener will start a new game when the new game button is clicked.
if (localStorage.getItem('trainer')) {
   $continueGame.addEventListener('click', ()=>{
      loadGame(trainer);
      console.log(trainer)
      continueGame();
   } )
} else{
   $continueGame.setAttribute('disabled', '');
}

$newGame.addEventListener('click', ()=>{
   trainer.name = $trainerName.value;
   newGame(trainer);
})



//This function will start a new game and get a random pokemon from the pokeList array.
async function newGame(trainer){
   $music.removeAttribute('src');
   $music.setAttribute('src', './assets/audio/Pokémon-HQ-Laboratory.mp3');
   
   await getPokemon(`${pokeList[randomNum(0 , pokeList.length)]}`);
   $gameUpper.innerHTML = ''
   gameStart(trainer);

   $pokeimg.setAttribute('src', trainer.pokemon.sprite);
   $gameUpper.appendChild($pokeimg);
   $pokeimg.classList.add('poke-init');
   $gameUpper.classList.remove('initial');
   $gameUpper.classList.add('game');
};
//This function will start the game and give the trainer the instructions.
function game(trainer){
   $pokeimg.classList.remove('poke-init');
   $music.removeAttribute('src');
   $music.setAttribute('src', './assets/audio/Pokémon-Center.mp3');
   expLvlUP(trainer.pokemon.exp, 0);
   updateBar(trainer.pokemon.happiness, 0, '-');
   updateBar(trainer.pokemon.hunger, 0, '-');
   updateBar(trainer.pokemon.hp, 0, '-');
   $pokeimg.classList.add('pokeimg');
   $pokeimg.setAttribute('src', trainer.pokemon.sprite);
   $gameUpper.appendChild($pokeimg);
   $pokeimg.classList.add('pokeimg');
   let $hungerBtn = document.createElement('button');
   $hungerBtn.innerText = 'Eat';
   $hungerBtn.classList.add('hunger');
   let $energyBtn = document.createElement('button');
   $energyBtn.innerText = 'Sleep'
   $energyBtn.classList.add('sleep');
   let $happinessBtn = document.createElement('button');
   $happinessBtn.innerText = 'Play'
   $happinessBtn.classList.add('play');
   let $trainBtn = document.createElement('button');
   $trainBtn.innerText = 'Train';
   $trainBtn.classList.add('train');
   $energyTxt.innerText = 'Energy';
   $hungerTxt.innerText = 'Hunger';
   $happinessTxt.innerText = 'Happiness';
   $gameUpper.appendChild($filter);
   
   trainer.pokemon.hp.percentage = convertToPercentage(trainer.pokemon.hp.current,trainer.pokemon.hp.max, trainer.pokemon.hp.min);
   
   
   
   $experienceBar.style.width = `${trainer.pokemon.exp.current}%`;
   $experienceBarTxt.innerHTML = `${trainer.pokemon.exp.current}/${trainer.pokemon.exp.max}`;
   
   $lvlTxt.innerText = `Lvl: ${trainer.pokemon.lvl.current}`;
   $energyBarTxT.innerHTML = `${trainer.pokemon.hp.current}/${trainer.pokemon.hp.max}`;
   $energyBar.style.width = `${trainer.pokemon.hp.percentage}%`;
   $hungerBar.style.width = `${trainer.pokemon.hunger.current}%`;
   $hungerBarTxT.innerHTML = `${trainer.pokemon.hunger.current}/${trainer.pokemon.hunger.max}`;
   $happinessBar.style.width = `${trainer.pokemon.hunger.current}%`;
   $happinessBarTxt.innerHTML = `${trainer.pokemon.happiness.current}/${trainer.pokemon.happiness.max}`;

   $hunger.appendChild($hungerBtn);
   $energy.appendChild($energyBtn);
   $happiness.appendChild($happinessBtn);
   $experience.appendChild($trainBtn);
   console.log(trainer);

      setInterval(() => {
      updateBar(trainer.pokemon.happiness, 2, '-');
      updateBar(trainer.pokemon.hunger, 4, '-');
      
   }, 8000);
  let interval = setInterval(() => {
      if (trainer.pokemon.hp.current == trainer.pokemon.hp.min){
         $happinessBtn.setAttribute('disabled', '');
         $hungerBtn.setAttribute('disabled', '');
         $trainBtn.setAttribute('disabled', '');
      } 
      if (trainer.pokemon.hunger.current == trainer.pokemon.hunger.min){
      $energyBtn.setAttribute('disabled', '');
      $happinessBtn.setAttribute('disabled', '');
      $trainBtn.setAttribute('disabled', '');
      } 
      if (trainer.pokemon.happiness.current == trainer.pokemon.happiness.min) {
         $energyBtn.setAttribute('disabled', '');
         $hungerBtn.setAttribute('disabled', '');
         $trainBtn.setAttribute('disabled', '');
      } 
      if (trainer.pokemon.fail >= 3) {
         gameOver(interval);
      }else{
         saveGame(trainer);
      }
   }, 1000);
   $hungerBtn.addEventListener('click',()=>{
      updateBar(trainer.pokemon.hunger, 50, '+');
      $hungerBtn.setAttribute('disabled', '');
      $energyBtn.setAttribute('disabled', '');
      $happinessBtn.setAttribute('disabled', '');
      $trainBtn.setAttribute('disabled', '');
      $background.classList.add('eat');
      $background.classList.remove('lab');
      $sound.src = './assets/audio/Item-Get.mp3';
      setTimeout(() => {
         $energyBtn.removeAttribute('disabled');
         $happinessBtn.removeAttribute('disabled');
         $hungerBtn.removeAttribute('disabled');
         $trainBtn.removeAttribute('disabled');
         $background.classList.add('lab');
         $background.classList.remove('eat');
      }, 5000);
   })
   $happinessBtn.addEventListener('click',()=>{
      updateBar(trainer.pokemon.happiness, 50, '+');
      $happinessBtn.setAttribute('disabled', '');
      $energyBtn.setAttribute('disabled', '');
      $hungerBtn.setAttribute('disabled', '');
      $trainBtn.setAttribute('disabled', '');
      $background.classList.add('out');
      $background.classList.remove('lab');
      $sound.src = './assets/audio/Item-Get.mp3';
      setTimeout(() => {
         $energyBtn.removeAttribute('disabled');
         $happinessBtn.removeAttribute('disabled');
         $hungerBtn.removeAttribute('disabled');
         $trainBtn.removeAttribute('disabled');
         $background.classList.add('lab');
         $background.classList.remove('out');
      }, 5000);
   })

   $energyBtn.addEventListener('click',()=>{
      updateBar(trainer.pokemon.hp, 100, '+');
      $energyBtn.setAttribute('disabled', '');
      $happinessBtn.setAttribute('disabled', '');
      $hungerBtn.setAttribute('disabled', '');
      $trainBtn.setAttribute('disabled', '');
      filter($filter, 'sleep', 8000);
      $background.classList.add('slp');
      $background.classList.remove('lab');
      $sound.src = './assets/audio/Recovery.mp3'
      $music.pause();
      setTimeout(() => {
         $energyBtn.removeAttribute('disabled');
         $happinessBtn.removeAttribute('disabled');
         $hungerBtn.removeAttribute('disabled');
         $trainBtn.removeAttribute('disabled');
         $background.classList.add('lab');
         $background.classList.remove('slp');
      $music.play()
      }, 10000);
   })

   $trainBtn.addEventListener('click',()=>{
      $background.classList.add('train');
      $background.classList.remove('lab');

      if (trainer.pokemon.hp.percentage <= 50) {
         let chances = randomNum(0 , 2);
         console.log(chances);
         if (chances == 1) {
            expLvlUP(trainer.pokemon.exp, 5);
            updateBar(trainer.pokemon.hp, 5, '-');
            updateBar(trainer.pokemon.hunger, 3, '-');
            updateBar(trainer.pokemon.happiness, 2, '-');
            $energyBtn.setAttribute('disabled', '');
            $happinessBtn.setAttribute('disabled', '');
            $hungerBtn.setAttribute('disabled', '');
            $trainBtn.setAttribute('disabled', '');
         } else {
            updateBar(trainer.pokemon.hp, 5, '-');
            updateBar(trainer.pokemon.hunger, 3, '-');
            updateBar(trainer.pokemon.happiness, 2, '-');
            $energyBtn.setAttribute('disabled', '');
            $happinessBtn.setAttribute('disabled', '');
            $hungerBtn.setAttribute('disabled', '');
            $trainBtn.setAttribute('disabled', '');
         }
      } else if (trainer.pokemon.hp.percentage <= 25) {
         let chances = randomNum(0 , 4);
         console.log(chances);
         if (chances == 1) {
            expLvlUP(trainer.pokemon.exp, 2);
            updateBar(trainer.pokemon.hp, 5, '-');
            updateBar(trainer.pokemon.hunger, 3, '-');
            updateBar(trainer.pokemon.happiness, 2, '-');
            $energyBtn.setAttribute('disabled', '');
            $happinessBtn.setAttribute('disabled', '');
            $hungerBtn.setAttribute('disabled', '');
            $trainBtn.setAttribute('disabled', '');
      } else{
            updateBar(trainer.pokemon.hp, 5, '-');
            updateBar(trainer.pokemon.hunger, 3, '-');
            updateBar(trainer.pokemon.happiness, 2, '-');
            $energyBtn.setAttribute('disabled', '');
            $happinessBtn.setAttribute('disabled', '');
            $hungerBtn.setAttribute('disabled', '');
            $trainBtn.setAttribute('disabled', '');
      }
      }else {
         expLvlUP(trainer.pokemon.exp, 10);
         updateBar(trainer.pokemon.hp, 5, '-');
         updateBar(trainer.pokemon.hunger, 3, '-');
         updateBar(trainer.pokemon.happiness, 2, '-');
         $energyBtn.setAttribute('disabled', '');
         $happinessBtn.setAttribute('disabled', '');
         $hungerBtn.setAttribute('disabled', '');
         $trainBtn.setAttribute('disabled', '');
      }
      setTimeout(() => {
         $energyBtn.removeAttribute('disabled');
         $happinessBtn.removeAttribute('disabled');
         $hungerBtn.removeAttribute('disabled');
         $trainBtn.removeAttribute('disabled');
         $background.classList.add('lab');
         $background.classList.remove('train');
      }, 5000);
})
}

function randomNum(min, max) {
   return Math.floor(Math.random() * (max - min)) + min;
};


//This function will get the pokemon data from the pokeapi, and assign it to the trainer object, it will also get the evolution chain of the pokemon.
async function getPokemon(id) {
   try {
      let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
      let data = await response.json();
      trainer.pokemon.name = data.name;
      trainer.pokemon.hp.max = data.stats[0].base_stat;
      trainer.pokemon.sprite = data.sprites.front_default;
      trainer.pokemon.lvl.species = data.species.url;
      trainer.pokemon.hp.current = trainer.pokemon.hp.max;
      let species = await fetch(trainer.pokemon.lvl.species);
      let speciesData = await species.json();

      if (speciesData.evolution_chain.url) {
         trainer.pokemon.lvl.evolution_chain = speciesData.evolution_chain.url;
         if (trainer.pokemon.lvl.evolution == 0) {
            let evolution =  await fetch(trainer.pokemon.lvl.evolution_chain);
            let evolutionData = await evolution.json();
            trainer.pokemon.lvl.minLvl = evolutionData.chain.evolves_to[0].evolution_details[0].min_level;
            trainer.pokemon.lvl.evolves_to = evolutionData.chain.evolves_to[0].species.url;
         } if (trainer.pokemon.lvl.evolution == 1) {
            let evolution =  await fetch(trainer.pokemon.lvl.evolution_chain);
            let evolutionData = await evolution.json();
            trainer.pokemon.lvl.minLvl = evolutionData.chain.evolves_to[0].evolves_to[0].evolution_details[0].min_level;
            trainer.pokemon.lvl.evolves_to = evolutionData.chain.evolves_to[0].evolves_to[0].species.url;
         }

         console.log(evolutionData)
      }else{
         trainer.pokemon.lvl.evolution_chain = '';
      }
      
      
      console.log(trainer.pokemon);
  
      
   } catch (error) {
      
   }
   
}
//This function will convert the stats of the pokemon to a percentage to be used in the progress bars.
function convertToPercentage(health, maxHealth, minHealth) {
   const percentage = ((health - minHealth) / (maxHealth - minHealth)) * 100;
   return Math.round(percentage);
 }

 //This function will update the stats of the pokemon and check if the pokemon has failed.
function updateBar(stat, value, operator) {
   if(operator === '+'){
      stat.current += value;
      if (stat.current >= stat.max) {
         stat.current = stat.max;
      }
   }
   if (operator === '-') {
      stat.current -= value;
      if (stat.current <= stat.min) {
         stat.current = stat.min;
         trainer.pokemon.fail ++;
      }
   }
   stat.percentage = convertToPercentage(stat.current, stat.max, stat.min);

   let $energyBar = document.getElementById('energy-bar');
   let $energyBarTxT = document.getElementById("energy-bar-txt");
   let $hungerBar = document.getElementById('hunger-bar');
   let $hungerBarTxT = document.getElementById("hunger-bar-txt");
   let $happinessBar = document.getElementById('happiness-bar');
   let $happinessBarTxt = document.getElementById('happiness-bar-txt');

   $energyBarTxT.innerHTML = `${trainer.pokemon.hp.current}/${trainer.pokemon.hp.max}`;
   $energyBar.style.width = `${trainer.pokemon.hp.percentage}%`;

   $hungerBar.style.width = `${trainer.pokemon.hunger.current}%`;
   $hungerBarTxT.innerHTML = `${trainer.pokemon.hunger.current}/${trainer.pokemon.hunger.max}`;
   
   $happinessBar.style.width = `${trainer.pokemon.happiness.current}%`;
   $happinessBarTxt.innerHTML = `${trainer.pokemon.happiness.current}/${trainer.pokemon.happiness.max}`;

   if (trainer.pokemon.happiness.percentage <= 50) {
      $happinessBar.style.backgroundColor = 'Yellow';
      $happinessTxt.classList.remove('danger');
   } if (trainer.pokemon.happiness.percentage <= 25) {
      $happinessBar.style.backgroundColor = 'Red';
      $happinessTxt.classList.add('danger');
   }if (trainer.pokemon.happiness.percentage >= 51) {
      $happinessBar.style.backgroundColor = 'green';
      $happinessTxt.classList.remove('danger');
   }

   if (trainer.pokemon.hunger.percentage <= 50) {
      $hungerBar.style.backgroundColor = 'Yellow';
      $hungerTxt.classList.remove('danger');
   }if (trainer.pokemon.hunger.percentage <= 25) {
      $hungerBar.style.backgroundColor = 'Red';
      $hungerTxt.classList.add('danger');
   }if (trainer.pokemon.hunger.percentage >= 51) {
      $hungerBar.style.backgroundColor = 'green';
      $hungerTxt.classList.remove('danger');
   }

   if (trainer.pokemon.hp.percentage <= 50) {
      $energyBar.style.backgroundColor = 'Yellow';
      $energyTxt.classList.remove('danger');
   }if (trainer.pokemon.hp.percentage <= 25) {
      $energyBar.style.backgroundColor = 'Red';
      $energyTxt.classList.add('danger');
   }if (trainer.pokemon.hp.percentage >= 51) {
      $energyBar.style.backgroundColor = 'green'
      $energyTxt.classList.remove('danger');
   }
}
//This function will level up the pokemon when the experience bar is full, it will also check if the pokemon can evolve.
function expLvlUP(stat, value) {
   $experienceBar.style.backgroundColor = 'blue'
   stat.current += value;
   if (stat.current >= stat.max) {
      $sound.removeAttribute('src');
      $sound.setAttribute('src', './assets/audio/Level-Up.mp3');
      stat.current = 0;
      trainer.pokemon.lvl.current++;
      stat.max += 10;
      if (trainer.pokemon.lvl.current == trainer.pokemon.lvl.minLvl) {
         Elvolve(trainer.pokemon);
      }
   }
   stat.percentage = convertToPercentage(stat.current, stat.max, stat.min);
   $experienceBar.style.width = `${trainer.pokemon.exp.percentage}%`;
   $experienceBarTxt.innerHTML = `${trainer.pokemon.exp.current}/${trainer.pokemon.exp.max}`;
   $lvlTxt.innerText = `Lvl: ${trainer.pokemon.lvl.current}`;
  
}
//This function will evolve the pokemon when it reaches the required level. Using the evolution chain of the pokemon from the pokeapi.
async function Elvolve(pokemon) {
 let evolution = await fetch(pokemon.lvl.evolves_to);
 let evolutionData = await evolution.json();
 pokemon.lvl.evolution++;
   getPokemon(evolutionData.id);
   updateBar(trainer.pokemon.hp, 100, '+');
   setTimeout(() => {
      $pokeimg.classList.add('evolving');
      $background.classList.add('evolution');
      $background.classList.remove('lab')
      $sound.src ='./assets/audio/Evolution-Intro.mp3';
      let $chatText = document.createElement('div');
      $chatText.id = 'chat-text';
      $chatText.innerHTML = `<p>${trainer.name}: My pokemon is evolving!!!</p>`;
      $gameStats.appendChild($chatText);
      $sound.play();
      filter($filter, 'evole', 10000 );
      $music.removeAttribute('src');
      $music.setAttribute('src', './assets/audio/Evolution.mp3');
      
      setTimeout(() => {
         $sound.removeAttribute('src');
         $gameUpper.removeChild($pokeimg);
         $pokeimg.src = trainer.pokemon.sprite;
         $gameUpper.appendChild($pokeimg);
         $sound.setAttribute('src', './assets/audio/Evolution-Complete.mp3');
         $chatText.innerHTML = `<p>${trainer.name}: Wow! I got a ${trainer.pokemon.name}</p>`;
         $sound.play();
         setTimeout(() => {
            $music.src = './assets/audio/Pokémon-Center.mp3';
            $background.classList.add('lab');
            $background.classList.remove('evolution');
            $pokeimg.classList.remove('evolving');
            $gameStats.removeChild($chatText);
         }, 2000);
      }, 10000);
   }, 5000);
   
   
}
//This function will save the game in the local storage.
function saveGame(trainer) {
   localStorage.setItem('trainer', JSON.stringify(trainer));
   
}
//This function will load the game from the local storage.
function loadGame() {
 trainer = JSON.parse(localStorage.getItem('trainer'));
}
//This function will end the game if the trainer fails to take care of the pokemon and erase the local storage.
function gameOver(interval) {
   clearInterval(interval);
   let $profOak = document.createElement('img');
   $profOak.setAttribute('src', 'assets/img/Professor_Oak.png');
   $profOak.style.width = '200px'
   $gameUpper.appendChild($profOak);
   let $chatText = document.createElement('div');
   $chatText.id = 'chat-text';
   $profOak.id = 'profOak';
   $chatText.innerHTML = `<p>What are you doing?!? ${trainer.name} you were supposed to take care of ${trainer.pokemon.name}. but you neglected him and didn't do your part of the job. i'm sorry to say it, but you're fired.</p>`;
   $gameStats.appendChild($chatText);
   localStorage.clear('trainer');
}
//This function will start the game and give the trainer the instructions.
function gameStart(trainer) {
   let $profOak = document.createElement('img');
   $profOak.setAttribute('src', 'assets/img/Professor_Oak.png');
   $profOak.style.width = '150px'
   $gameUpper.appendChild($profOak);
   let $chatText = document.createElement('div');
   $chatText.id = 'chat-text';
   $profOak.id = 'profOak';
   $chatText.innerHTML = `<p>Welcome, I am the professor oak you must be ${trainer.name} my new assistant right?

   Your job will be to take care of this ${trainer.pokemon.name}, you will need to feed him, play with him and even train him, if you fail in this simple task you will be fired, so don't let any of his stats reach 0.</p>`;
   $gameStats.appendChild($chatText);
   let $startGame = document.createElement('button');
   $startGame.innerText = "Start Game";
   $gameUpper.appendChild($startGame);
   $startGame.classList.add('start-game');
   
   $startGame.addEventListener('click', ()=>{
      $gameStats.removeChild($chatText)
      $gameUpper.innerHTML = '';
      game(trainer);

   })

}
//This function will continue the game from the last save.
function continueGame() {
   $gameUpper.innerHTML = ''
   $gameUpper.classList.remove('initial');
      $gameUpper.classList.add('continue');
   let $startGame = document.createElement('button');
   $startGame.innerText = "Start Game";
   $startGame.classList.add('start-game');
   $gameUpper.appendChild($startGame);
   let $profOak = document.createElement('img');
   $profOak.setAttribute('src', 'assets/img/Professor_Oak.png');
   $profOak.style.width = '200px';
   $gameUpper.appendChild($profOak);
   let $chatText = document.createElement('div');
   $chatText.id = 'chat-text';
   $profOak.id = 'profOak';
   $chatText.innerHTML = `<p>Welcome back ${trainer.name}!<br>${trainer.pokemon.name} is waiting for you</p>`;
   $gameStats.appendChild($chatText);
   $music.src = './assets/audio/Pokémon-HQ-Laboratory.mp3'
   $startGame.addEventListener('click', ()=>{
      $gameUpper.classList.remove('continue');
      $gameUpper.classList.add('game');
      $gameStats.removeChild($chatText)
      $gameUpper.innerHTML = '';
      game(trainer);

   })
}
//This function will add a filter to the background to give the game a more dynamic look.
function filter(filter, name, time, background) {
   filter.classList.add(`${name}`);   
   setTimeout(() => {
      filter.classList.remove(`${name}`);
   }, time);

}