"use strict";

let allCards = document.getElementById('cards');
let submitButton = document.getElementById('add-book');
let showButton = document.getElementById('show-form');
let form = document.getElementById('addBookForm');
let readButtons = document.querySelectorAll('button.read-button');
let removeButtons = document.querySelectorAll('.remove-button');
let myLibrary = [];
let inLoad = false;

//------------------------ BOOKMAKER FACTORY --------------------------------//

function BookMaker(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  if(read) {
    this.haveRead = "have already read it";
  } else {
    this.haveRead = "not read yet";
  }
  this.info = `${this.title} by ${this.author}, ${this.pages} pages, ${this.haveRead}`;
}

BookMaker.prototype.toggleRead = function() {
    if(this.haveRead == "have already read it") {
      this.haveRead = "not read yet";
    } else {
      this.haveRead = "have already read it"
    }
  }

function addBookToLibrary(title, author, pages, read) {
  let newBook = new BookMaker(title, author, pages, read);
  myLibrary.push(newBook);
  saveLibrary();
}

//------------------------ BOOKS BY DEFAULT --------------------------------//

// addBookToLibrary("Lord of the Ring", "Tolkien", "300", true);
// addBookToLibrary("La Nuit des Temps", "Barjavel", "250", true);
// addBookToLibrary("Shining", "Stephen King", "285", false);
// addBookToLibrary("Misery", "Stephen King", "198", true);
// addBookToLibrary("Troisième humanité", "B. Werber", "350", false);
// addBookToLibrary("1Q89", "H. Murakami", "750", true);

//--------------------- ADD A BOOK THROUGH THE FORM -----------------------------//

addBookForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const title = document.querySelectorAll('form #title')[0].value;
  const author = document.querySelectorAll('form #author')[0].value;
  const pages = document.querySelectorAll('form #pages')[0].value;
  const read = document.querySelectorAll('form #read')[0].checked;
  addBookToLibrary(title, author, pages, read);
  createTable();
  document.querySelectorAll('form #title')[0].value = "";
  document.querySelectorAll('form #author')[0].value = "";
  document.querySelectorAll('form #pages')[0].value = "";
  document.querySelectorAll('form #read')[0].checked = "";
  showButton.classList.remove('hidden');
  addBookForm.classList.add('hidden');
});
showButton.addEventListener("click", function() {
  showButton.classList.add('hidden');
  addBookForm.classList.remove('hidden');
});

//---------------------- REFRESH PAGE WITH LIBRARY --------------------------//

function createTable() {
  let cards = "";
  for(var i in myLibrary) {
    var readButtonText = "";
    cards += `<div class=\"card p-2\" id=\"card-container-${i}\"><div class=\"card-block\" id=\"card-${i}\">`
    cards += `<h4 class="card-title title">${myLibrary[i].title}</h4>`;
    cards += `<h6 class="card-subtitle mb-2 text-muted author">${myLibrary[i].author}</h6>`;
    cards += `<p class="card-text pages">${myLibrary[i].pages}</p>`;
    cards += `<p class="card-text haveread">${myLibrary[i].haveRead}</p>`;
    if (myLibrary[i].haveRead == "have already read it") {
      readButtonText = "Haven't read?";
    } else {
      readButtonText = "Have read?";
    }
    cards += `<div class="card-buttons">`
    cards += `<button type="button" class="btn btn-warning read-button" data-id="${i}">${readButtonText}</button>`
    cards += `<button type="button" class="btn btn-danger remove-button" data-id="${i}">Remove book</button>`
    cards += `</div></div></div>`;
  }
  allCards.innerHTML = cards;
  readButtons = document.querySelectorAll('button.read-button');
  removeButtons = document.querySelectorAll('button.remove-button');
  addListenerForRemoveButtons();
  addListenerForToggleReadButtons();
}

//------------------------ STORING BOOKS IN LOCAL STORAGE ------------------//

function saveLibrary() {
  if (inLoad == true) { return };
  for(var i in myLibrary) {
    let bookName = `book${i}`
    localStorage.setItem(`${bookName}-title`, myLibrary[i].title);
    localStorage.setItem(`${bookName}-author`, myLibrary[i].author);
    localStorage.setItem(`${bookName}-pages`, myLibrary[i].pages);
    localStorage.setItem(`${bookName}-haveRead`, myLibrary[i].haveRead);
    localStorage.setItem('maxBookNumber', i);
  }
}

function loadLibrary() {
  inLoad = true;
  myLibrary = [];
  for (var i = 0; i <= localStorage.getItem('maxBookNumber'); i++) {
    let bookName = `book${i}`;
    addBookToLibrary(
      localStorage.getItem(`${bookName}-title`),
      localStorage.getItem(`${bookName}-author`),
      localStorage.getItem(`${bookName}-pages`),
      localStorage.getItem(`${bookName}-haveRead`)
    );
  }
  inLoad = false;
}

//function load qui parcourt localStorage

//----------------- REMOVE A BOOK THROUGH THE REMOVE BUTTON ----------------//
// function 'splice', without a third argument, removes a cell from an array.

function removeBook() {
    let buttonId = this.getAttribute('data-id');
    myLibrary.splice(buttonId, 1);
    createTable();
}

// adds a listener to all remove buttons (iterates through a nodelist),
// that call the removeBook function above.

function addListenerForRemoveButtons() {
  for (var i=0; i< removeButtons.length; i++) {
    removeButtons[i].addEventListener('click', removeBook);
  }
}

//--- TOOGLE THE 'read' property OF A BOOK THROUGH THE 'READ' BUTTON --------//

function callToggleRead() {
  let buttonId = this.getAttribute('data-id');
  myLibrary[buttonId].toggleRead();
  createTable();
}

function addListenerForToggleReadButtons() {
  for (var i=0; i< readButtons.length; i++) {
    readButtons[i].addEventListener('click', callToggleRead);
  }
}

loadLibrary();
createTable();
