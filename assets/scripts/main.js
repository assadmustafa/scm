// Overlay For Shut Down Screen
const overlay = document.getElementById("overlay");
// Main View
const mainContent = document.getElementById("main-content");
// Drop Zone On The Page For Drag/Drop Cameras
const dropZone = document.getElementById("dropZone");
// Select All Monitors Query
const pages = document.querySelectorAll(".page");
// List Of Current Cameras Monitors
const list = document.getElementById("active-cameras");
// Saved Cameras Array From Local Storage
const savedCameras = JSON.parse(localStorage.getItem("cameras")) || [];
// Click Button Sound Effect
const clickSound = new Audio("/assets/sounds/click.mp3");
// Clear Button Sound Effect
const clearSound = new Audio("/assets/sounds/clear.mp3");
// Error Sound Effect
const errorSound = new Audio("/assets/sounds/error.mp3");
// Screen Element
var elem = document.body;


// Switch To Fullscreen Function
function toggleFullScreen() {
  clickSound.play();
  if (
    !document.fullscreenElement && // alternative standard method
    !document.mozFullScreenElement &&
    !document.webkitFullscreenElement &&
    !document.msFullscreenElement
  ) {
    // current working methods
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// Clear All Cameras Function
function clearCameras() {
  clearSound.play();
  const cameras = document.querySelectorAll(".screen-container");
  cameras.forEach((camera) => {
    camera.remove();
  });
  const listItems = document.querySelectorAll("#active-cameras li");
  listItems.forEach((item) => {
    item.remove();
  });
  // Clear the localStorage as well
  localStorage.removeItem("cameras");
}

// Exit The Application Function
function turnOff() {
  const warningWindow = document.createElement("div");
  const warningWindowTitle = document.createElement("div");
  const warningWindowCloseButton = document.createElement("img");
  const warningImage = document.createElement("img");
  const warningMessage = document.createElement("p");
  const warningConfirmButton = document.createElement("button");
  const warningCancelButton = document.createElement("button");

  warningWindow.className = "window";
  
  warningWindowTitle.className = "window-title";
  warningWindowTitle.textContent = "Turn Off";
  
  warningWindowCloseButton.src = "/assets/images/close.png";
  warningWindowCloseButton.className = "window-close-button";
  warningWindowCloseButton.addEventListener("click", () => {
    warningWindow.remove();
  });
  
  warningImage.src = "/assets/images/warning.png";
  warningImage.className = "warning-image window-image";
  
  warningMessage.textContent = "Are you sure you want to exit?";
  
  warningConfirmButton.textContent = "Yes";
  warningConfirmButton.className = "warning-confirm-button btn";
  warningConfirmButton.addEventListener("click", function () {
    // Display shuting down message
    overlay.style.display = "block";
    // Play shut down sound
    const shutdownSound = new Audio("/assets/sounds/shutdown.mp3");
    shutdownSound.play();
    // Close the window
    // Add an event listener to close the window after the sound finishes playing
    shutdownSound.onended = function () {
      window.close();
    };
  });
  
  warningCancelButton.textContent = "No";
  warningCancelButton.className = "warning-cancel-button btn";
  warningCancelButton.addEventListener("click", function () {
    warningWindow.remove();
  });

  warningWindow.appendChild(warningWindowTitle);
  warningWindow.appendChild(warningImage);
  warningWindow.appendChild(warningMessage);
  warningWindowTitle.appendChild(warningWindowCloseButton);
  warningWindow.appendChild(warningConfirmButton);
  warningWindow.appendChild(warningCancelButton);
  mainContent.appendChild(warningWindow);

  // Play error sound
  const warningSound = new Audio("/assets/sounds/notification.mp3");
  warningSound.play();

  // Adjust scroll position to show error box if necessary
  mainContent.scrollTop = mainContent.scrollHeight;
}

// Make Screens Droppable
function allowDropScreen(event) {
  event.preventDefault();
}

// Open Folder Function
function toggleFolder(folder) {
  folder.classList.toggle("open");
}

// Add Screen By Drag/Drop Function
function dropScreen(event) {
  event.preventDefault();
  const pageContent = event.dataTransfer.getData("text");

  if (mainContent.childElementCount > 9) {
    // Display Error Window
    showError("Error", "Maximum limit has been reached!");
    return;
  }

  const page = document.createElement("div");
  const heading = document.createElement("div");
  const icon = document.createElement("i");
  const windowCloseButton = document.createElement("i");
  const windowFullScreenButton = document.createElement("i");
  const screen = document.createElement("video");
  const item = document.createElement("li");
  const randomCameraNumber = Math.floor(Math.random() * 4) + 1;

  page.className = "screen-container";
  icon.className = "fa-solid fa-video active-camera-icon";
  windowCloseButton.className = "fa-solid fa-square-xmark screen-close-button";
  windowFullScreenButton.className = "fa-solid fa-window-restore screen-fullscreen-button";
  screen.src = `/assets/cameras/camera${randomCameraNumber}.mp4`;
  screen.autoplay = true;
  screen.loop = true; // Set loop
  screen.muted = true; // Add this line if necessary
  screen.controls = false; // Add this line if controls are not needed
  heading.className = "heading";
  screen.className = "screen";

  item.textContent = heading.innerText = pageContent;

  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  page.appendChild(heading);
  page.appendChild(screen);
  page.appendChild(windowCloseButton);
  page.appendChild(windowFullScreenButton);
  mainContent.appendChild(page);

  windowCloseButton.addEventListener("click", () => {
    page.remove();
    list.removeChild(item);
    saveCamerasToLocalStorage();
  });

  windowFullScreenButton.addEventListener("click", () => {
    if (page.classList.contains("fullScreen")) {
      page.classList.remove("fullScreen");
      page.style = "";
      screen.style = "";
      heading.style = "";
      dropZone.style = "";
    } else {
      page.classList.add("fullScreen");
      page.style =
        "width:1450px;height:850px; position:absolute;z-index:4;";
      screen.style = "width: 100%;height:900px;margin-top:0;border-bottom:0px;";
      heading.style = "width: 100%;";
      dropZone.style = "background-color:white; ";
    }
  });

  saveCamerasToLocalStorage();
}

// Add Event Listener For Drag/Drop
pages.forEach((page) => {
  page.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", page.textContent);
  });
});

// Add Screen By Click Function
function addScreen(pageContent) {
  if (mainContent.childElementCount > 9) {
    showError("Error", "Maximum limit has been reached!");
    return;
  }
  const page = document.createElement("div");
  const heading = document.createElement("div");
  const icon = document.createElement("i");
  const windowCloseButton = document.createElement("i");
  const windowFullScreenButton = document.createElement("i");
  const screen = document.createElement("video");
  const item = document.createElement("li");
  const randomCameraNumber = Math.floor(Math.random() * 4) + 1;
  page.className = "screen-container";
  icon.className = "fa-solid fa-video active-camera-icon";
  windowCloseButton.className = "fa-solid fa-square-xmark screen-close-button";
  windowFullScreenButton.className = "fa-solid fa-window-restore screen-fullscreen-button";
  screen.src = `/assets/cameras/camera${randomCameraNumber}.mp4`;
  screen.autoplay = true;
  screen.loop = true; // Set loop
  screen.muted = true; // Add this line if necessary
  screen.controls = false; // Add this line if controls are not needed
  heading.className = "heading";
  screen.className = "screen";
  item.textContent = heading.innerText = pageContent;
  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  page.appendChild(heading);
  page.appendChild(screen);
  page.appendChild(windowCloseButton);
  page.appendChild(windowFullScreenButton);
  mainContent.appendChild(page);
  // Add event listeners for windowCloseButton and windowFullScreenButton
  windowCloseButton.addEventListener("click", () => {
    page.remove();
    list.removeChild(item);
    saveCamerasToLocalStorage();
  });
  windowFullScreenButton.addEventListener("click", () => {
    if (page.classList.contains("fullScreen")) {
      page.classList.remove("fullScreen");
      page.style = "";
      screen.style = "";
      heading.style = "";
      dropZone.style = "";
    } else {
      page.classList.add("fullScreen");
      page.style =
        "width:1450px;height:850px; position:absolute;z-index:4;";
      screen.style = "width: 100%;height:900px;margin-top:0;border-bottom:0px;";
      heading.style = "width: 100%;";
      dropZone.style = "background-color:white; ";
    }
  });
  saveCamerasToLocalStorage();
}

// Add Event Listener For Click
pages.forEach((page) => {
  page.addEventListener("click", function (event) {
    const pageContent = page.textContent;
    addScreen(pageContent);
    event.stopPropagation(); // Stop the event from bubbling up
  });
});

// Show Error Window Function
function showError(title, message) {
  const errorWindow = document.createElement("div");
  const errorWindowTitle = document.createElement("div");
  const windowCloseButton = document.createElement("img");
  const errorImage = document.createElement("img");
  const errorMessage = document.createElement("p");
  const closeButton = document.createElement("button");

  errorWindow.className = "window";
  
  errorWindowTitle.className = "window-title";
  errorWindowTitle.textContent = title;

  windowCloseButton.src = "/assets/images/close.png";
  windowCloseButton.className = "window-close-button";
  windowCloseButton.addEventListener("click", () => {
    errorWindow.remove();
  });

  errorImage.src = "/assets/images/error.png";
  errorImage.className = "error-image window-image";

  errorMessage.textContent = message;

  closeButton.textContent = "OK";
  closeButton.className = "error-window-ok-button btn";
  closeButton.addEventListener("click", function () {
    errorWindow.remove();
  });

  errorWindow.appendChild(errorWindowTitle);
  errorWindow.appendChild(errorImage);
  errorWindow.appendChild(errorMessage);
  errorWindowTitle.appendChild(windowCloseButton);
  errorWindow.appendChild(closeButton);
  mainContent.appendChild(errorWindow);

  // Play error sound
  errorSound.play();

  // Adjust scroll position to show error box if necessary
  mainContent.scrollTop = mainContent.scrollHeight;

}

// Save Current Displayed Cameras To Local Storage Function
function saveCamerasToLocalStorage() {
  const cameras = Array.from(
    mainContent.querySelectorAll(".screen-container")
  ).map((page) => page.textContent);
  localStorage.setItem("cameras", JSON.stringify(cameras));
}

// Restore Previous Session Screens On Page Load
savedCameras.forEach((camera) => {
  const page = document.createElement("div");
  const heading = document.createElement("div");
  const icon = document.createElement("i");
  const windowCloseButton = document.createElement("i");
  const windowFullScreenButton = document.createElement("i");
  const item = document.createElement("li");
  const screen = document.createElement("video");
  const randomCameraNumber = Math.floor(Math.random() * 4) + 1;
  page.className = "screen-container";
  icon.className = "fa-solid fa-video active-camera-icon";
  windowCloseButton.className = "fa-solid fa-square-xmark screen-close-button";
  windowFullScreenButton.className = "fa-solid fa-window-restore screen-fullscreen-button";
  screen.src = `/assets/cameras/camera${randomCameraNumber}.mp4`;
  screen.className = "screen";
  screen.autoplay = true;
  screen.loop = true; // Set loop
  screen.muted = true; // Add this line if necessary
  screen.controls = false; // Add this line if controls are not needed
  heading.className = "heading";
  item.textContent = heading.innerText = camera;
  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  page.appendChild(heading);
  page.appendChild(screen);
  page.appendChild(windowFullScreenButton);
  page.appendChild(windowCloseButton);
  mainContent.appendChild(page);
  windowCloseButton.addEventListener("click", () => {
    page.remove();
    list.removeChild(item);
    saveCamerasToLocalStorage(); // Update local storage after removing
  });
  windowFullScreenButton.addEventListener("click", () => {
    if (page.classList.contains("fullScreen")) {
      page.classList.remove("fullScreen");
      page.style = "";
      screen.style = "";
      heading.style = "";
      dropZone.style = "";
    } else {
      page.classList.add("fullScreen");
      page.style =
        "width:1450px;height:850px; position:absolute;z-index:4;";
      screen.style = "width: 100%;height:900px;margin-top:0;border-bottom:0px;";
      heading.style = "width: 100%;";
      dropZone.style = "background-color:white;";
    }
  });
});