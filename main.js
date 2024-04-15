const mainContent = document.getElementById("mainContent");
const pages = document.querySelectorAll(".page");
const list = document.getElementById("current-pages");
const savedCameras = JSON.parse(localStorage.getItem("cameras")) || [];

function saveCamerasToLocalStorage() {
  const cameras = Array.from(mainContent.querySelectorAll(".camera")).map(page => page.textContent);
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
  const btn = document.createElement("i");
  const foto = document.createElement("img");
  const item = document.createElement("li");

  page.className = "camera";
  icon.className = "fa-solid fa-video";
  btn.className = "fa-solid fa-trash";
  foto.src = "/images/screen.png";

  icon.style = "color: green;";
  btn.style = "color: red; margin-left:10px;";
  btn.style.cursor = "pointer";
  name.className = "name";
  foto.className = "foto"

  item.textContent = name.innerText = pageContent;

  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  item.appendChild(btn);
  page.appendChild(name);
  page.appendChild(foto);
  mainContent.appendChild(page);

  btn.addEventListener("click", () => {
    page.remove();
    list.removeChild(item);
    saveCamerasToLocalStorage();
  });
  saveCamerasToLocalStorage();
}

// Restore previous session cameras on page load
savedCameras.forEach(camera => {
  const page = document.createElement("div");
  const name = document.createElement("div");
  const icon = document.createElement("i");
  const btn = document.createElement("i");
  const item = document.createElement("li");
  const foto = document.createElement("img");

  page.className = "camera";
  icon.className = "fa-solid fa-video green";
  btn.className = "fa-solid fa-trash btn";
  foto.src = "/images/screen.png";
  foto.className = "foto"
  name.className = "name";
  item.textContent = name.innerText = camera;

  item.insertBefore(icon, item.firstChild);
  list.appendChild(item);
  item.appendChild(btn);
  page.appendChild(name);
  page.appendChild(foto);
  mainContent.appendChild(page);

  btn.addEventListener("click", () => {
    page.remove();
    list.removeChild(item);
    saveCamerasToLocalStorage(); // Update local storage after removing
  });
});

pages.forEach((page) => {
  page.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", page.textContent);
  });
});