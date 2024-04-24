const mainContent = document.getElementById("mainContent");
const dropZone = document.getElementById("dropZone");
const pages = document.querySelectorAll(".page");
const list = document.getElementById("current-pages");
const savedCameras = JSON.parse(localStorage.getItem("cameras")) || [];
var elem = document.body;


// Request Function For Fullscreen Function
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

// Fullscreen Function
function toggleFullScreenButton() {
  requestFullScreen(elem);
}

// Clear Function
function deleteAllCameras() {
  const cameras = document.querySelectorAll(".camera");
  cameras.forEach((camera) => {
    camera.remove();
  });

  const listItems = document.querySelectorAll("#current-pages li");
  listItems.forEach((item) => {
    item.remove();
  });

  // Clear the localStorage as well
  localStorage.removeItem("cameras");
}

// Exit Function
function turnOff() {
  // Display a confirmation dialog
  var confirmed = confirm("Are you sure you want to exit?");

  // Check if the user confirmed
  if (confirmed) {
      // Close the window
      window.close();
  }
}

// Save data to local storage function
function saveCamerasToLocalStorage() {
  const cameras = Array.from(mainContent.querySelectorAll(".camera")).map(
    (page) => page.textContent
  );
  localStorage.setItem("cameras", JSON.stringify(cameras));
}


function allowDrop(event) {
  event.preventDefault();
}

function toggleFolder(folder) {
  folder.classList.toggle("open");
}

function drop(event) {
  event.preventDefault();
  const pageContent = event.dataTransfer.getData("text");

  if (mainContent.childElementCount > 12) {
    return;
  }

  const page = document.createElement("div");
  const name = document.createElement("div");
  const icon = document.createElement("i");
  const windowCloseButton = document.createElement("i");
  const windowFullButton = document.createElement("i");
  const foto = document.createElement("img");
  const item = document.createElement("li");

  page.className = "camera";
  icon.className = "fa-solid fa-video";
  windowCloseButton.className = "fa-solid fa-square-xmark";
  windowFullButton.className = "fa-solid fa-window-restore";
  foto.src = "/images/screen.png";

  icon.style = "color: green;";
  windowCloseButton.style = "color: red; position:absolute; margin-left:-20px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowCloseButton.style.cursor = "pointer";
  windowFullButton.style = "color: white; background-color:transparent; position:absolute; margin-left:-45px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowFullButton.style.cursor = "pointer";
  name.className = "name";
  foto.className = "foto";

  item.textContent = name.innerText = pageContent;

  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  page.appendChild(name);
  page.appendChild(foto);
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
      foto.style = ""; // Remove inline styles
      name.style = ""; // Remove inline styles
      dropZone.style = ""; // Remove inline styles
    } else {
      page.classList.add("fullScreen");
      page.style = "width:1300px;height:873px;margin-left: 100px; position:absolute; z-index:20;";
      foto.style = "width: 100%;";
      name.style = "width: 98.7%;";
      dropZone.style = "background-color:white; z-index:19;"
    }
  });


  saveCamerasToLocalStorage();
}

// Add event listener for each dragged camera
pages.forEach((page) => {
  page.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", page.textContent);
  });
});

// Restore previous session cameras on page load
savedCameras.forEach((camera) => {
  const page = document.createElement("div");
  const name = document.createElement("div");
  const icon = document.createElement("i");
  const windowCloseButton = document.createElement("i");
  const windowFullButton = document.createElement("i");
  const item = document.createElement("li");
  const foto = document.createElement("img");

  page.className = "camera";
  icon.className = "fa-solid fa-video green";
  windowCloseButton.className = "fa-solid fa-square-xmark";
  windowCloseButton.style = "color: red; position:absolute; margin-left:-20px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowCloseButton.style.cursor = "pointer";
  windowFullButton.className = "fa-solid fa-window-restore";
  windowFullButton.style = "color: white; background-color:transparent; position:absolute; margin-left:-45px; margin-top:8px; padding-right:1px; padding-left:1px; border-radius:3px;";
  windowFullButton.style.cursor = "pointer";
  foto.src = "/images/screen.png";
  foto.className = "foto";
  name.className = "name";
  item.textContent = name.innerText = camera;
  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  page.appendChild(name);
  page.appendChild(foto);
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
      foto.style = ""; // Remove inline styles
      name.style = ""; // Remove inline styles
      dropZone.style = ""; // Remove inline styles
    } else {
      page.classList.add("fullScreen");
      page.style = "width:1300px;height:873px;margin-left: 100px; position:absolute; z-index:20;";
      foto.style = "width: 100%;";
      name.style = "width: 98.7%;";
      dropZone.style = "background-color:white; z-index:19;"
    }
  });
  
});