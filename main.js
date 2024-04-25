// Overlay For Shut Down Screen
const overlay = document.getElementById("overlay");
// Main View
const mainContent = document.getElementById("mainContent");
// Drop Zone On The Page For Drag/Drop Cameras
const dropZone = document.getElementById("dropZone");
// Select All Monitors Query
const pages = document.querySelectorAll(".page");
// List Of Current Cameras Monitors
const list = document.getElementById("active-cameras");
// Saved Cameras Array From Local Storage
const savedCameras = JSON.parse(localStorage.getItem("cameras")) || [];
// Click Button Sound Effect Audio
const clickSound = new Audio("/assets/sounds/click.mp3");
// Clear Button Sound Effect Audio
const clearSound = new Audio("/assets/sounds/clear.mp3");
// Screen Element
var elem = document.body;

// Show Turn Off Window Function
function showTurnOffWindow() {
  const turnOffBox = document.createElement("div");
  turnOffBox.className = "error";
  const turnOffBoxTitle = document.createElement("div");
  turnOffBoxTitle.className = "warning-title";
  turnOffBoxTitle.textContent = "Turn Off";
  const windowCloseButton = document.createElement("img");
  windowCloseButton.src = "/assets/images/close.png";
  windowCloseButton.className = "error-close-button";
  windowCloseButton.addEventListener("click", () => {
    turnOffBox.remove();
  });
  const warningImage = document.createElement("img");
  warningImage.src = "/assets/images/warning.png";
  warningImage.className = "warning-image";
  const warningMessage = document.createElement("p");
  warningMessage.textContent = "Are you sure you want to exit?";
  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Yes";
  confirmButton.className = "warning-button-confirm option";
  confirmButton.addEventListener("click", function () {
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
  const cancelButton = document.createElement("button");
  cancelButton.textContent = "No";
  cancelButton.className = "warning-button-cancel option";
  cancelButton.addEventListener("click", function () {
    turnOffBox.remove();
  });
  turnOffBox.appendChild(turnOffBoxTitle);
  turnOffBox.appendChild(warningImage);
  turnOffBox.appendChild(warningMessage);
  turnOffBoxTitle.appendChild(windowCloseButton);
  turnOffBox.appendChild(confirmButton);
  turnOffBox.appendChild(cancelButton);
  mainContent.appendChild(turnOffBox);
  // Play error sound
  const warningSound = new Audio("/assets/sounds/notification.mp3");
  warningSound.play();
  // Adjust scroll position to show error box if necessary
  mainContent.scrollTop = mainContent.scrollHeight;
}

// Display Error Function When Maximum Displayed Screens Limit Is Reached
function showError(title, message) {
  const errorBox = document.createElement("div");
  errorBox.className = "error";
  const errorTitle = document.createElement("div");
  errorTitle.className = "error-title";
  errorTitle.textContent = title;
  const windowCloseButton = document.createElement("img");
  windowCloseButton.src = "/assets/images/close.png";
  windowCloseButton.className = "error-close-button";
  windowCloseButton.addEventListener("click", () => {
    errorBox.remove();
  });
  const errorImage = document.createElement("img");
  errorImage.src = "/assets/images/error.png";
  errorImage.className = "error-image";
  const errorMessage = document.createElement("p");
  errorMessage.textContent = message;
  const closeButton = document.createElement("button");
  closeButton.textContent = "OK";
  closeButton.className = "error-button";
  closeButton.addEventListener("click", function () {
    errorBox.remove();
  });
  errorBox.appendChild(errorTitle);
  errorBox.appendChild(errorImage);
  errorBox.appendChild(errorMessage);
  errorTitle.appendChild(windowCloseButton);
  errorBox.appendChild(closeButton);
  mainContent.appendChild(errorBox);
  // Play error sound
  const errorSound = new Audio("/assets/sounds/error.mp3");
  errorSound.play();
  // Adjust scroll position to show error box if necessary
  mainContent.scrollTop = mainContent.scrollHeight;
}

// Request User Permission For Fullscreen Function
function requestFullScreen(element) {
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

// Switch To Fullscreen Function
function toggleFullScreenButton() {
  clickSound.play();
  requestFullScreen(elem);
}

// Clear All Cameras Function
function deleteAllCameras() {
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
  // Display a confirmation dialog
  //var confirmed = confirm("Are you sure you want to exit?");
  showTurnOffWindow();
}

// Save Current Displayed Cameras To Local Storage Function
function saveCamerasToLocalStorage() {
  const cameras = Array.from(
    mainContent.querySelectorAll(".screen-container")
  ).map((page) => page.textContent);
  localStorage.setItem("cameras", JSON.stringify(cameras));
}

// Make Screens Droppable
function allowDropScreen(event) {
  event.preventDefault();
}

// Open Folder Function
function toggleFolder(folder) {
  folder.classList.toggle("open");
}

// Drop Screen Function
function dropScreen(event) {
  event.preventDefault();
  const pageContent = event.dataTransfer.getData("text");

  if (mainContent.childElementCount > 12) {
    // Display Error Window
    showError("Error", "Maximum limit has been reached!");
    return;
  }

  const page = document.createElement("div");
  const heading = document.createElement("div");
  const icon = document.createElement("i");
  const windowCloseButton = document.createElement("i");
  const windowFullButton = document.createElement("i");
  const screen = document.createElement("img");
  const item = document.createElement("li");

  page.className = "screen-container";
  icon.className = "fa-solid fa-video";
  windowCloseButton.className = "fa-solid fa-square-xmark";
  windowFullButton.className = "fa-solid fa-window-restore";
  screen.src = "/assets/images/screen.png";

  icon.style = "color: green;";
  windowCloseButton.style =
    "color: red; position:absolute; margin-left:-20px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowCloseButton.style.cursor = "pointer";
  windowFullButton.style =
    "color: white; background-color:transparent; position:absolute; margin-left:-45px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowFullButton.style.cursor = "pointer";
  heading.className = "heading";
  screen.className = "screen";

  item.textContent = heading.innerText = pageContent;

  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  page.appendChild(heading);
  page.appendChild(screen);
  page.appendChild(windowCloseButton);
  page.appendChild(windowFullButton);
  mainContent.appendChild(page);

  windowCloseButton.addEventListener("click", () => {
    page.remove();
    list.removeChild(item);
    saveCamerasToLocalStorage();
  });

  windowFullButton.addEventListener("click", () => {
    if (page.classList.contains("fullScreen")) {
      page.classList.remove("fullScreen");
      page.style = ""; // Remove inline styles
      screen.style = ""; // Remove inline styles
      heading.style = ""; // Remove inline styles
      dropZone.style = ""; // Remove inline styles
    } else {
      page.classList.add("fullScreen");
      page.style =
        "width:1300px;height:873px;margin-left: 100px; position:absolute; z-index:20;";
      screen.style = "width: 100%;";
      heading.style = "width: 98.7%;";
      dropZone.style = "background-color:white; z-index:19;";
    }
  });

  saveCamerasToLocalStorage();
}

// Add Event Listener For Drag/Drop Any Screen
pages.forEach((page) => {
  page.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", page.textContent);
  });
});

// Add Event Listener For Every Page To Place Screens
pages.forEach((page) => {
  page.addEventListener("click", function (event) {
    const pageContent = page.textContent;
    addScreen(pageContent);
    event.stopPropagation(); // Stop the event from bubbling up
  });
});

// Restore Previous Session Screens On Page Load
savedCameras.forEach((camera) => {
  const page = document.createElement("div");
  const heading = document.createElement("div");
  const icon = document.createElement("i");
  const windowCloseButton = document.createElement("i");
  const windowFullButton = document.createElement("i");
  const item = document.createElement("li");
  const photo = document.createElement("img");
  page.className = "screen-container";
  icon.style = "color: green;";
  icon.className = "fa-solid fa-video";
  windowCloseButton.className = "fa-solid fa-square-xmark";
  windowCloseButton.style =
    "color: red; position:absolute; margin-left:-20px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowCloseButton.style.cursor = "pointer";
  windowFullButton.className = "fa-solid fa-window-restore";
  windowFullButton.style =
    "color: white; background-color:transparent; position:absolute; margin-left:-45px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowFullButton.style.cursor = "pointer";
  photo.src = "/assets/images/screen.png";
  photo.className = "photo";
  heading.className = "heading";
  item.textContent = heading.innerText = camera;
  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  page.appendChild(heading);
  page.appendChild(photo);
  page.appendChild(windowFullButton);
  page.appendChild(windowCloseButton);
  mainContent.appendChild(page);
  windowCloseButton.addEventListener("click", () => {
    page.remove();
    list.removeChild(item);
    saveCamerasToLocalStorage(); // Update local storage after removing
  });
  windowFullButton.addEventListener("click", () => {
    if (page.classList.contains("fullScreen")) {
      page.classList.remove("fullScreen");
      page.style = ""; // Remove inline styles
      photo.style = ""; // Remove inline styles
      heading.style = ""; // Remove inline styles
      dropZone.style = ""; // Remove inline styles
    } else {
      page.classList.add("fullScreen");
      page.style =
        "width:1300px;height:873px;margin-left: 100px; position:absolute; z-index:20;";
      photo.style = "width: 100%;";
      heading.style = "width: 98.7%;";
      dropZone.style = "background-color:white; z-index:19;";
    }
  });
});

// Add A Screen View When Click On A Screen Item From The Side Menu
function addScreen(pageContent) {
  if (mainContent.childElementCount > 12) {
    showError("Error", "Maximum limit has been reached!");
    return;
  }
  const page = document.createElement("div");
  const heading = document.createElement("div");
  const icon = document.createElement("i");
  const windowCloseButton = document.createElement("i");
  const windowFullButton = document.createElement("i");
  const screen = document.createElement("img");
  const item = document.createElement("li");
  page.className = "screen-container";
  icon.className = "fa-solid fa-video";
  windowCloseButton.className = "fa-solid fa-square-xmark";
  windowFullButton.className = "fa-solid fa-window-restore";
  screen.src = "/assets/images/screen.png";
  icon.style = "color: green;";
  windowCloseButton.style =
    "color: red; position:absolute; margin-left:-20px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowCloseButton.style.cursor = "pointer";
  windowFullButton.style =
    "color: white; background-color:transparent; position:absolute; margin-left:-45px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowFullButton.style.cursor = "pointer";
  heading.className = "heading";
  screen.className = "screen";
  item.textContent = heading.innerText = pageContent;
  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  page.appendChild(heading);
  page.appendChild(screen);
  page.appendChild(windowCloseButton);
  page.appendChild(windowFullButton);
  mainContent.appendChild(page);
  // Add event listeners for windowCloseButton and windowFullButton
  windowCloseButton.addEventListener("click", () => {
    page.remove();
    list.removeChild(item);
    saveCamerasToLocalStorage();
  });
  windowFullButton.addEventListener("click", () => {
    if (page.classList.contains("fullScreen")) {
      page.classList.remove("fullScreen");
      page.style = ""; // Remove inline styles
      screen.style = ""; // Remove inline styles
      heading.style = ""; // Remove inline styles
      dropZone.style = ""; // Remove inline styles
    } else {
      page.classList.add("fullScreen");
      page.style =
        "width:1300px;height:873px;margin-left: 100px; position:absolute; z-index:20;";
      screen.style = "width: 100%;";
      heading.style = "width: 98.7%;";
      dropZone.style = "background-color:white; z-index:19;";
    }
  });
  saveCamerasToLocalStorage();
}