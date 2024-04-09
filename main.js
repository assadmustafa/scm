

function allowDrop(event) {
  event.preventDefault();
}

function toggleFolder(folder) {
  folder.classList.toggle("open");

}


function drop(event) {
  event.preventDefault();
  const pageContent = event.dataTransfer.getData("text");
  const list = document.getElementById("current-pages");
  // Check if the mainContent div already contains 9 pages
  const mainContent = document.getElementById("mainContent");
  if (mainContent.childElementCount > 9) {
    return;
  }

  const droppedPage = document.createElement("div");
  droppedPage.className = "dropped-page";
  droppedPage.innerHTML = pageContent;
  // Make the droppedPage div draggable
  droppedPage.draggable = true;
  
  // Create an <i> element for Font Awesome icon
  const iconElement = document.createElement("i");
  iconElement.className = "fa-solid fa-video";
  iconElement.style = "color: green;";
  // Create a new <li> element
  const listItem = document.createElement("li");
  listItem.textContent = pageContent;
  
  // Append the icon before the <li> element
  listItem.insertBefore(iconElement, listItem.firstChild);
  
  // Append the <li> element to the list
  list.appendChild(listItem);
  
  // Append the droppedPage to the mainContent
  document.getElementById("mainContent").appendChild(droppedPage);
}


const pages = document.querySelectorAll(".page");
pages.forEach((page) => {
  page.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", page.textContent);
  });
});


