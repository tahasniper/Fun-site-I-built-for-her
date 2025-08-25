const qs = (selector) => document.querySelector(selector);
const question = qs(".question");
const crushName = qs(".name")
const gif = qs("#main-gif");
const gifContainer = qs(".gif-container");
const [yesBtn, noBtn] = [".yes-btn", ".no-btn"].map(qs);
const floatingShapes = qs("#floating-shapes");

// Email tracking variables
let currentActivity = '';
let rerollCount = 0;
let activityStartTime = null;
let config = null;

// Load configuration
async function loadConfig() {
  try {
    const response = await fetch('config.json');
    config = await response.json();
    console.log('Configuration loaded successfully');
    
    // Update page title if crushName is provided
    if (config.crushName && config.crushName.trim() !== '') {
      document.title = `${config.crushName} Will you go out with me? 🥹`;
    }
  } catch (error) {
    console.log('Config loading error:', error);
    console.log('Email notifications will be disabled');
  }
}

// Email sending function
async function sendActivityEmail(activity, rerolls) {
  // Check if config is loaded and has the required access key
  if (!config || !config.web3forms || !config.web3forms.accessKey || config.web3forms.accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE') {
    console.log('Email not configured - skipping notification');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('access_key', config.web3forms.accessKey);
    formData.append('subject', config.web3forms.subject || '💕 She Selected a Date Activity!');
    formData.append('from_name', config.web3forms.fromName || 'Date App Notification');
    formData.append('message', `
Selected Activity: "${activity}"
Time: ${new Date().toLocaleString()}
Number of Rerolls: ${rerolls}
Time spent deciding: ${Math.round((Date.now() - activityStartTime) / 1000)} seconds
Browser: ${navigator.userAgent}
    `.trim());

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      console.log('Email sent successfully');
    } else {
      console.log('Email failed to send');
    }
  } catch (error) {
    console.log('Email error:', error);
  }
}

// Default date ideas fallback function
function getDefaultDateIdeas() {
  return [
    "Cook a romantic dinner together",
    "Go for a moonlit walk on the beach", 
    "Have a picnic in the park",
    "Take a dance class together",
    "Stargaze in the backyard",
    "Visit an art gallery",
    "Go on a scenic hike",
    "Have a movie night at home",
    "Visit a local farmers' market",
    "Take a pottery class together"
  ];
}

// Initialize configuration when page loads
loadConfig();

// Floating shapes animation
const shapes = ['🌸', '💕', '💗', '⭐', '✨', '🌟','🥀','🌹','🌺','🌷','🌻','🌼','🌹','🌺','🌷','🌻','🌼'];
const shapeTypes = ['heart', 'circle', 'triangle', 'square', 'star'];

function createFloatingShape() {
  const shape = document.createElement('div');
  shape.classList.add('shape');
  
  // Randomly choose between emoji hearts/stars or CSS shapes
  if (Math.random() > 0.5) {
    // Use emoji
    shape.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];
    shape.classList.add('heart');
  } else {
    // Use CSS shapes
    const shapeType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
    shape.classList.add(shapeType);
    if (shapeType === 'star') {
      shape.innerHTML = '★';
    }
  }
  
  // Random horizontal position
  shape.style.left = Math.random() * 100 + '%';
  
  // Random animation duration (6-10 seconds)
  shape.style.animationDuration = (6 + Math.random() * 4) + 's';
  
  // Random delay
  shape.style.animationDelay = Math.random() * 2 + 's';
  
  floatingShapes.appendChild(shape);
  
  // Remove shape after animation completes
  setTimeout(() => {
    if (shape.parentNode) {
      shape.remove();
    }
  }, 12000);
}

// Create shapes continuously
setInterval(createFloatingShape, 800);

// Create initial shapes
for (let i = 0; i < 5; i++) {
  setTimeout(createFloatingShape, i * 200);
}

const handleYesClick = () => {
  crushName.style.display = "none";
  question.innerHTML = "Yeppies! See you soon!!";
  
  // Hide the original gif
  gif.style.display = "none";
  
  // Create two overlapping gifs
  const gif2 = document.createElement("img");
  gif2.src = "2.gif";
  gif2.alt = "celebration gif 1";
  gif2.classList.add("gif-overlap", "gif-left");
  
  const gif3 = document.createElement("img");
  gif3.src = "3.gif";
  gif3.alt = "celebration gif 2";
  gif3.classList.add("gif-overlap", "gif-right");
  
  // Add both gifs to the container
  gifContainer.appendChild(gif2);
  gifContainer.appendChild(gif3);

  // Remove the 'mouseover' event listener from noBtn
  noBtn.removeEventListener("mouseover", handleNoMouseOver);

  // Remove the noBtn from the DOM
  noBtn.remove();


  // Create and style a new button for Let's Go!
  const letsGoBtn = document.createElement("button");
  letsGoBtn.textContent = "Let's Go!";
  letsGoBtn.classList.add("letsgo-btn"); // You can add a class for styling if needed
  letsGoBtn.style.position = "relative";
  letsGoBtn.style.left = "0";
  letsGoBtn.style.transform = "none";
  letsGoBtn.style.width = "200px";
  letsGoBtn.style.margin = "0 auto";
  letsGoBtn.style.display = "block";

  // Add a click event listener to prompt the user with random romantic date ideas
  letsGoBtn.addEventListener("click", () => {
    const dateIdeas = config && config.dateIdeas ? config.dateIdeas : getDefaultDateIdeas();
    const randomIndex = Math.floor(Math.random() * dateIdeas.length);
    const selectedDateIdea = dateIdeas[randomIndex];

    showCustomAlert(selectedDateIdea);
  });

  // Replace yesBtn with the new letsGoBtn
  yesBtn.replaceWith(letsGoBtn);
};

const handleNoMouseOver = () => {
  const { width, height } = noBtn.getBoundingClientRect();
  const maxX = window.innerWidth - width;
  const maxY = window.innerHeight - height;

  noBtn.style.left = `${Math.floor(Math.random() * maxX)}px`;
  noBtn.style.top = `${Math.floor(Math.random() * maxY)}px`;
};

yesBtn.addEventListener("click", handleYesClick);
noBtn.addEventListener("mouseover", handleNoMouseOver);

// Custom Alert Functions
function showCustomAlert(message) {
  const alertModal = document.getElementById('customAlert');
  const alertMessage = document.getElementById('alertMessage');
  
  // Track the current activity and start timing
  currentActivity = message;
  if (activityStartTime === null) {
    activityStartTime = Date.now();
  }
  
  alertMessage.textContent = message;
  alertModal.style.display = 'flex';
  
  // Add some celebration hearts when alert appears
  for (let i = 0; i < 5; i++) {
    setTimeout(createFloatingShape, i * 100);
  }
}

function closeCustomAlert() {
  const alertModal = document.getElementById('customAlert');
  
  // Send email when she accepts the activity by closing the modal
  if (currentActivity) {
    sendActivityEmail(currentActivity, rerollCount);
  }
  
  alertModal.style.display = 'none';
  
  // Reset tracking variables
  currentActivity = '';
  rerollCount = 0;
  activityStartTime = null;
}

function rerollDateIdea() {
  const dateIdeas = config && config.dateIdeas ? config.dateIdeas : getDefaultDateIdeas();
  
  const randomIndex = Math.floor(Math.random() * dateIdeas.length);
  const selectedDateIdea = dateIdeas[randomIndex];
  const alertMessage = document.getElementById('alertMessage');
  
  // Update tracking variables for reroll
  currentActivity = selectedDateIdea;
  rerollCount++;
  
  alertMessage.textContent = selectedDateIdea;
  
  // Add some celebration hearts for reroll
  for (let i = 0; i < 3; i++) {
    setTimeout(createFloatingShape, i * 100);
  }
}


