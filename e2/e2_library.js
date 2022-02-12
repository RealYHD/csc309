/* 
 * This code is provided solely for the personal and private use of students 
 * taking the CSC309H course at the University of Toronto. Copying for purposes 
 * other than this use is expressly prohibited. All forms of distribution of 
 * this code, including but not limited to public repositories on GitHub, 
 * GitLab, Bitbucket, or any other online platform, whether as given or with 
 * any changes, are expressly prohibited. 
*/

/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function () {

			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function (name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
	 Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	let newBook = new Book(document.getElementById("newBookName").value, document.getElementById("newBookAuthor").value, document.getElementById("newBookGenre").value);
	libraryBooks.push(newBook);


	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	let bookId = document.getElementById("loanBookId").value;
	let patronId = document.getElementById("loanCardNum").value;
	let book = libraryBooks[bookId];
	let patron = patrons[patronId];

	// Add patron to the book's patron property
	book.patron = patron;


	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(book);

	// Start the book loan timer.
	book.setLoanTime();

}

// Changes book patron information and calls removeBookFromPatronTable()
function returnBookToLibrary(e) {
	e.preventDefault();
	// check if return button was clicked, otherwise do nothing.
	if (!e.target.classList.contains("return")) return;

	// Call removeBookFromPatronTable()
	let selectedBook = libraryBooks[e.target.parentElement.parentElement.firstChild.innerText];
	removeBookFromPatronTable(selectedBook);

	// Change the book object to have a patron of 'null'
	selectedBook.patron = null;


}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	let name = document.getElementById("newPatronName").value;
	let newPatron = Patron(name);
	patrons.push(newPatron);

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(newPatron);
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	let id = document.getElementById("bookInfoId").value;
	let book = libraryBooks[id];

	// Call displayBookInfo()	
	displayBookInfo(book);

}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	let bookTable = document.getElementById("bookTable");
	let bookRow = bookTable.insertRow(-1);
	bookRow.insertCell(-1).appendChild(document.createTextNode(book.bookId));
	let bookTitleBolded = document.createElement("strong");
	bookTitleBolded.innerText = book.title;
	bookRow.insertCell(-1).appendChild(bookTitleBolded);
	bookRow.insertCell(-1).appendChild(document.createTextNode((book.patron ? book.patron.name : "")));
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	let bookinfoElem = document.getElementById("bookInfo");
	let bookIDElem = document.createElement("p");
	let bookTitleElem = document.createElement("p");
	let bookAuthorElem = document.createElement("p");
	let bookGenreElem = document.createElement("p");
	let bookLoanedElem = document.createElement("p");

	bookinfoElem.innerHTML = "";
	bookIDElem.innerHTML = "Book Id: <span>" + book.bookId + "</span>";
	bookinfoElem.appendChild(bookIDElem);
	bookTitleElem.innerHTML = "Title: <span>" + book.title + "</span>";
	bookinfoElem.appendChild(bookTitleElem);
	bookAuthorElem.innerHTML = "Author: <span>" + book.author + "</span>";
	bookinfoElem.appendChild(bookAuthorElem);
	bookGenreElem.innerHTML = "Author: <span>" + book.genre + "</span>";
	bookinfoElem.appendChild(bookGenreElem);
	bookLoanedElem.innerHTML = "Author: <span>" + (book.patron ? book.patron.name : "N/A") + "</span>";
	bookinfoElem.appendChild(bookLoanedElem);

}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	document.querySelectorAll("#patrons patron").forEach(patronElem => {
		if (patronElem.children[1].querySelector("span.bold").innerText == book.patron.cardNumber) {
			let loansTableElem = patronElem.querySelector("table.patronLoansTable");
			let bookRowElem = loansTableElem.insertRow(-1);
			bookRowElem.addCell(-1).innerText = book.bookId;
			bookRowElem.addCell(-1).innerText = book.title;
			let statusSpanElem = document.createElement("span");
			statusSpanElem.classList.add("green");
			statusSpanElem.innerText = "Within due date";
			bookRowElem.addCell(-1).appendChild(statusSpanElem);

			let returnBtnElem = document.createElement("button");
			returnBtnElem.classList.add("return");
			returnBtnElem.innerText = "return";
			bookRowElem.addCell(-1).appendChild(returnBtnElem); // TODO Finish return event.
			return;
		}
	});
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status, and Return).
function addNewPatronEntry(patron) {
	// Add code here
	let patronElem = document.createElement("div");
	patronElem.classList.add("patron");
	let nameElem = document.createElement("p").innerHTML = "Name: <span class='bold'>" + patron.name + "</span>";
	patronElem.appendChild(nameElem);
	let cardNumberElem = document.createElement("p").innerHTML = "Card Number: <span class='bold'>" + patron.cardNumber + "</span>";
	patronElem.appendChild(cardNumberElem);

	let loansTable = document.createElement("table");
	loansTable.classList.add("patronLoansTable");
	let loansTableHead = loansTable.createTHead();
	loansTableHead.insertRow(-1);
	loansTableHead.innerHTML = "\
	<th>BookID</th>\
	<th>Title</th>\
	<th>Status</th>\
	<th>Return</th>"
	patronElem.appendChild(loansTable);

	document.getElementById("patrons").appendChild(patronElem);
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	document.querySelectorAll("#patron patron").forEach(patronElem => {
		if (patronElem.children[1].querySelector("span.bold").innerText == book.patron.cardNumber) {
			patronElem.querySelector("table.patronLoansTable tr").forEach(row => {
				if (row.firstChild.innerText == book.bookId) {
					row.parentElement.removeChild(row);
					return;
				}
			});
		}
	})
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	document.querySelectorAll("#patrons .patron").forEach(patronElem => {
		if (patronElem.children[1].querySelector("span.bold").innerText == book.patron.cardNumber) {
			let dueElem = patronElem.querySelector("table.patronLoansTable td span.green");
			if (dueElem) {
				dueElem.innerText = "Overdue";
				dueElem.classList.remove("green");
				dueElem.classList.add("red");
			}
			return;
		}
	});
}

