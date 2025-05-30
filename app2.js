// Global variable
window.myGlobalVar = 'initial';
window.myGlobalBool = false;
let timeLeft = 10 * 60; // 10 minutes in seconds

const timer = setInterval(() => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  string = "Time Left: " + (`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
  document.getElementById("timer").innerHTML = string;

  timeLeft--;

  if (timeLeft < 0) {
    clearInterval(timer);
      document.getElementById("timer").innerHTML = ("Time's up!");
  }
}, 1000);

// Function to modify it
function updateGlobalVar(obj, newVal) {
  window.myGlobalVar = newVal;
  obj.innerHTML = newVal;
}

function checkGlobalVar(obj) {
  newVal = window.myGlobalVar
  obj.innerHTML = newVal;
}

function updateGlobalBool(obj, newVal) {
  window.myGlobalBool = newVal;
  obj.innerHTML = newVal;
}

function checkGlobalBool(obj) {
  newVal = window.myGlobalBool
  obj.innerHTML = newVal;
}


