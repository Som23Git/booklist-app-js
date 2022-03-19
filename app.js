//  Book Class: Represents a Book -- Everytime, we call this class it gonna initiate a Book Object.
class Book{
    constructor(title,author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI Class: Hanldes UI Tasks -- In the UX, the alerts will be in UI Class.
class UI{
    static displayBooks(){
      const books = Store.getBooks();

      books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book){
        const list = document.querySelector('#book-list');

        const row = document.createElement('tr');  //Standard JS method to create a DOM Element//

        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class= "btn btn-danger btn-sm delete"> X </a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el){
        //In the td element, we are checking whether it contains class delete so that we can delete it
        if (el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    //<div class = 'alert alert-success'>Insert the message</div> -- We are building a div using the JavaScript below to pop up within the UI instead of built-in Alert
    static showAlert(message, className){
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        // Vanish the alert in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    //This will clear the fields after posting the details to the table
    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#ISBN').value = '';
    }
}

// Store Class: Handles Storge -- Uses Local Storage

class Store {
    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static addBooks(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event: Add a Book
document.querySelector('#book-form').addEventListener('submit',(e) => {
    //Prevent Actual Submit
    e.preventDefault();

    //Get form Values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#ISBN').value;

    //Validate
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please Fill In All The Fields', 'danger');
    } else{

    //Instantiate Book
    const book = new Book(title, author, isbn);
    console.log(book);

    //Add Book to UI
    UI.addBookToList(book);

    //Add Book to Store
    Store.addBooks(book);

    //Show Success Message
    UI.showAlert('Book Added Successfully', 'success');

    //Method to clear fields
    UI.clearFields();

}

});

//Event: Remove a Book using Event Propagation so that we can remove the parent element completely instead of just removing the delete element alone
document.querySelector('#book-list').addEventListener('click', (e) =>{
    console.log(e.target);   //This is to get the element that was clicked so you can check
   
    //Remove Book from UI
    UI.deleteBook(e.target);

    //Remove Book from Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show Deleted Message
    UI.showAlert('Book Removed Successfully', 'success');

});
