document.addEventListener("DOMContentLoaded", function() {
    const inputBookForm = document.getElementById("inputBook");
    const searchBookForm = document.getElementById("searchBook");
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    inputBookForm.addEventListener("submit", function(event) {
        event.preventDefault();
        addBook();
    });

    searchBookForm.addEventListener("submit", function(event) {
        event.preventDefault();
        searchBook();
    });

    function addBook() {
        const title = document.getElementById("inputBookTitle").value;
        const author = document.getElementById("inputBookAuthor").value;
        const year = document.getElementById("inputBookYear").value;
        const isComplete = document.getElementById("inputBookIsComplete").checked;

        const book = makeBook(title, author, year, isComplete);
        const bookshelfList = isComplete ? completeBookshelfList : incompleteBookshelfList;

        bookshelfList.appendChild(book);
        updateBookStorage();
    }

    function makeBook(title, author, year, isComplete) {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");

        const titleElement = document.createElement("h3");
        titleElement.innerText = title;

        const authorElement = document.createElement("p");
        authorElement.innerText = "Penulis: " + author;

        const yearElement = document.createElement("p");
        yearElement.innerText = "Tahun: " + year;

        const actionContainer = document.createElement("div");
        actionContainer.classList.add("action");

        const actionButton = document.createElement("button");
        actionButton.innerText = isComplete ? "Belum selesai di Baca" : "Selesai dibaca";
        actionButton.classList.add(isComplete ? "green" : "red");

        actionButton.addEventListener("click", function() {
            moveBook(bookItem, isComplete);
        });

        const removeButton = document.createElement("button");
        removeButton.innerText = "Hapus buku";
        removeButton.classList.add("red");

        removeButton.addEventListener("click", function() {
            removeBook(bookItem);
        });

        actionContainer.appendChild(actionButton);
        actionContainer.appendChild(removeButton);

        bookItem.appendChild(titleElement);
        bookItem.appendChild(authorElement);
        bookItem.appendChild(yearElement);
        bookItem.appendChild(actionContainer);

        return bookItem;
    }

    function moveBook(bookItem, isComplete) {
        const destinationList = isComplete ? incompleteBookshelfList : completeBookshelfList;
        const actionButton = bookItem.querySelector(".action button");

        actionButton.innerText = isComplete ? "Selesai dibaca" : "Belum selesai di Baca";
        actionButton.classList.toggle("green");
        actionButton.classList.toggle("red");

        destinationList.appendChild(bookItem);
        updateBookStorage();
    }

    function removeBook(bookItem) {
        bookItem.remove();
        updateBookStorage();
    }

    function searchBook() {
        const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
        const allBooks = document.querySelectorAll(".book_item h3");

        allBooks.forEach(function(book) {
            const title = book.innerText.toLowerCase();
            const bookItem = book.parentElement;

            if (title.indexOf(searchTitle) !== -1) {
                bookItem.style.display = "block";
            } else {
                bookItem.style.display = "none";
            }
        });
    }

    function updateBookStorage() {
        const incompleteBooks = [];
        const completeBooks = [];

        incompleteBookshelfList.querySelectorAll(".book_item").forEach(function(book) {
            const title = book.querySelector("h3").innerText;
            const author = book.querySelector("p:nth-of-type(1)").innerText.substring(9);
            const year = book.querySelector("p:nth-of-type(2)").innerText.substring(7);
            incompleteBooks.push({ title, author, year, isComplete: false });
        });

        completeBookshelfList.querySelectorAll(".book_item").forEach(function(book) {
            const title = book.querySelector("h3").innerText;
            const author = book.querySelector("p:nth-of-type(1)").innerText.substring(9);
            const year = book.querySelector("p:nth-of-type(2)").innerText.substring(7);
            completeBooks.push({ title, author, year, isComplete: true });
        });

        localStorage.setItem("incompleteBooks", JSON.stringify(incompleteBooks));
        localStorage.setItem("completeBooks", JSON.stringify(completeBooks));
    }

    function loadBooks() {
        const incompleteBooks = JSON.parse(localStorage.getItem("incompleteBooks")) || [];
        const completeBooks = JSON.parse(localStorage.getItem("completeBooks")) || [];

        incompleteBooks.forEach(function(book) {
            const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
            incompleteBookshelfList.appendChild(newBook);
        });

        completeBooks.forEach(function(book) {
            const newBook = makeBook(book.title, book.author, book.year, book.isComplete);
            completeBookshelfList.appendChild(newBook);
        });
    }

    loadBooks();
});
