window.onload = function () {
	$(".ber").click(function (e) {
		$(".ber-poppap").addClass("show")
	});
	$(".ol").click(function (e) {
		$(".ol-poppap").addClass("show")
	});
	$(".pux").click(function (e) {
		$(".ber-poppap").removeClass("show");
		$(".ol-poppap").removeClass("show");
	});
	var d=new Date();
var day=d.getDate();
var month=d.getMonth() + 1;
var year=d.getFullYear();
var lt = d.toLocaleTimeString();
console.log(lt);
var dats = (day + "." + month + "." + year  );
	document.getElementById("isbn").value = dats;
};

// Book Class: Represents a Book
class Book{
    constructor(tittle, author, isbn){
        this.tittle = tittle;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Handle UI Tasks
class UI{
    editMode = false;
    editTarget = null;
    static displayBooks(){

        const books = Store.getBooks();
        books.forEach((book)=>{
            UI.addBookTolist(book)
        })

    }

    static addBookTolist(book){
        const table = document.querySelector("#book-list");
        const row = document.createElement('div');

        row.innerHTML = `
        <p>Кому:<span>${book.tittle}</span></p>
        <p>Сколько:<span>${book.author}</span></p>
        <p>Дата:<span>${book.isbn}</span></p>

        `;

        table.appendChild(row);
    }

    static checkForIsbn(isbn){
        const books = Store.getBooks();
        let flag = false;

        books.forEach((bk, index) => {
            if(bk.isbn === isbn){
                flag = true;
            }
        });

        return flag;
    }

    static updateBookTolist(book){
        if(UI.editTarget && UI.editMode){
           let row = UI.editTarget.parentElement.parentElement;
           row.innerHTML = `
            <td>${book.tittle}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>

        `;
        }
    }

    static editBook(event, isbn){
        UI.editTarget = event.target;
        UI.editMode = true;
        let bookList = Store.getBooks();
        bookList.forEach((book,index) =>{
            if(book.isbn === isbn){
                document.querySelector("#tittle").value = book.tittle;
                document.querySelector("#author").value= book.author;
                document.querySelector("#isbn").value= book.isbn;
            }
        });

        document.getElementById("submitBtn").innerHTML = "Edit Book";
        document.querySelector("#isbn").disabled = true;
    }

    static removeBook(event, isbn){
         event.target.parentElement.parentElement.remove();
         Store.removeBook(isbn);
         UI.showAlertMessage("Book removed", "success");

     }

    static clearFields(){
        document.querySelector("#tittle").value = '';
        document.querySelector("#author").value= '';
        document.querySelector("#isbn").value= '';
        UI.editMode = false;
        UI.editTarget = null;
        document.querySelector("#isbn").disabled = false;
        document.getElementById("submitBtn").innerHTML = "Save Book";


    }

    static showAlertMessage(message, classname){
        const div = document.createElement('div');
        div.className = `alert alert-${classname}`;
        div.innerHTML = message;
        const container = document.querySelector('.container');
        container.insertBefore(div, document.querySelector("#book-form"));

        setTimeout(() => {
            document.querySelector('.alert').remove();
        }, 3000)

    }
}


// Store Class: Handles Storage
class Store{

    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBook(book){
        const books = Store.getBooks();
       if(UI.editMode){
            Store.updateBook(book);
       } else {
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
       }


    }

    static removeBook(isbn){
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn){
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }

    static updateBook(book){
        const books = Store.getBooks();
        books.forEach((bk, index) => {
            if(bk.isbn === book.isbn){
                  books[index] = book;
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks());

// Event: Add a Book
document.querySelector("#book-form").addEventListener("submit", (e) =>{

    e.preventDefault();
    const tittle = document.querySelector("#tittle").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    if( tittle === '' ||  author === '' ||  isbn === '' ){
        UI.showAlertMessage("Please fill in all fields", "danger");
    } else{
        const book = new Book(tittle, author, isbn);



        if(UI.editMode) {
            UI.updateBookTolist(book);
            message = "Book updated";
            Store.addBook(book);
            UI.showAlertMessage("Book updated", "success");
            UI.clearFields();

        } else {

            const isbnExist = UI.checkForIsbn(isbn);
            if(isbnExist){
                UI.showAlertMessage("Please enter Unique ISBN", "danger");
            } else{
                UI.addBookTolist(book);
                Store.addBook(book);
                UI.showAlertMessage("Book added", "success");
                UI.clearFields();
            }


        }


    }


})




  /*
      1. Add selectors,
        - Store all of the list elements, in the local storage, until the session is on (selecting all of the items element or an empty array [] if nothing is available)
        - Event Delegation is when the event is passed from parent to child
      2. Add item when submit is clicked
        - Prevent default refreshing
        - Get the text from the input, + creating an object, which can be pushed to the local storage object
        -


      3. It is like creating an li list of htmls for the .class html
        - arugments (array, html tag where the inerrclass can be modified)
        - Loop through all of objects in the array, and creating an html li, with variable references
        -  THen joing all fo the string, to make it as a whole.


  */
  // 1
  const addItems = document.querySelector('.add-items');
  const itemsList = document.querySelector('.plates');
  const items = JSON.parse(localStorage.getItem('items')) || [];

  // 2
  function addItem(e) {
    e.preventDefault();
    const text = (this.querySelector('[name=item]','[name=item1]','[name=item2]')).value;
    const item = {
      text,
      done: false
    };

    items.push(item);
    populateList(items, itemsList);
    // save the array of items to the local sotrage.
    localStorage.setItem('items', JSON.stringify(items));
    // clear the form,
    this.reset();
  }

  // 3

  function populateList(plates = [], platesList) {
    platesList.innerHTML = plates.map((plate, i) => {
      return `
        <div>
        <p>От кого:<span for="item${i}">${plate.text}</span></p>
        <p>Сколько:<span for="item1${i}">${plate.text}</span></p>
        <p>Дата<span for="item2${i}">${plate.text}</span></p>
        </li>
      `;
    }).join('');
  }
// 4

  function toggleDone(e) {
    if (!e.target.matches('input')) return; // skip this unless it's an input
    const el = e.target;
    const index = el.dataset.index;
    items[index].done = !items[index].done;
    localStorage.setItem('items', JSON.stringify(items));
    populateList(items, itemsList);
  }

  addItems.addEventListener('submit', addItem);
  itemsList.addEventListener('click', toggleDone);

  populateList(items, itemsList);