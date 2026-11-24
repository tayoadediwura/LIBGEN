import React, { useState, useEffect } from "react";

import "./App.css";
import Navbar from "./components/Navbar/navbar";
import BookList from "./components/BookList/booklist";
import AddBook from "./components/AddBook/AddBook";

const App = () => {
  const [books, setBooks] = useState([]);
  const [activeTab, setActiveTab] = useState("browse");

  const handleAddBook = (newBook) => {
    setBooks((prevBooks) => [...prevBooks, newBook]);
    setActiveTab("browse");
  };

  useEffect(() => {
    fetch("https://openlibrary.org/search.json?q=fiction&limit=30")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const loadedBooks = [];

        for (let i = 0; i < data.docs.length; i++) {
          const item = data.docs[i];

          let bookAuthor = "Unknown";
          if (item.author_name) {
            bookAuthor = item.author_name[0];
          }

          let bookCover = "/covers/it-has-always-been-you.jpg";
          if (item.cover_i) {
            bookCover =
              "https://covers.openlibrary.org/b/id/" + item.cover_i + "-M.jpg";
          }

          let bookDate = "2024-01-01";
          if (item.first_publish_year) {
            bookDate = item.first_publish_year + "-01-01";
          }

          loadedBooks.push({
            id: i + 1,
            title: item.title,
            author: bookAuthor,
            rating: 4.2,
            date: bookDate,
            description: "Published by " + bookAuthor,
            cover: bookCover,
            isBorrowed: false,
            borrower: "",
          });
        }

        setBooks(loadedBooks);
      });
  }, []);

  const handleBorrowBook = (id) => {
    const borrowerName = window.prompt("Enter borrower's name:");
    if (!borrowerName || !borrowerName.trim()) return;

    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id
          ? { ...book, isBorrowed: true, borrower: borrowerName.trim() }
          : book
      )
    );
  };

  const handleReturnBook = (id) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === id ? { ...book, isBorrowed: false, borrower: "" } : book
      )
    );
  };

  const borrowedBooks = books.filter((book) => book.isBorrowed);

  return (
    <div className="app">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        borrowedCount={borrowedBooks.length}
      />

      {activeTab === "browse" && (
        <BookList
          books={books}
          onBorrow={handleBorrowBook}
          onReturn={handleReturnBook}
          heading="Popular"
        />
      )}

      {activeTab === "borrowed" && (
        <BookList
          books={borrowedBooks}
          onBorrow={handleBorrowBook}
          onReturn={handleReturnBook}
          heading="Borrowed Books"
        />
      )}

      {activeTab === "add" && <AddBook onAddBook={handleAddBook} />}
    </div>
  );
};

export default App;