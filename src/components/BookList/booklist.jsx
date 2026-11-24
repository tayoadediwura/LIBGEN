import React, { useState } from "react";

import "./booklist.css";
import Fire from "../../assets/fire.png";
import BookCover from "./BookCover";

const BookList = ({ books, onBorrow, onReturn, heading = "Popular" }) => {
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchQuery, setSearchQuery] = useState("");

  const handleFilterClick = (rate) => {
    setMinRating((prev) => (prev === rate ? 0 : rate));
  };

  const filteredBooks = books.filter((book) => {
    const matchesRating = book.rating >= minRating;
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query);

    return matchesRating && matchesSearch;
  });

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (!sortBy) return 0;

    let comparison = 0;
    if (sortBy === "rating") {
      comparison = a.rating - b.rating;
    } else if (sortBy === "date") {
      comparison = new Date(a.date) - new Date(b.date);
    }

    return sortOrder === "asc" ? comparison : -comparison;
  });

  return (
    <section className="book_list">
      <header className="align_center book_list_header">
        <h2 className="align_center book_list_heading">
          {heading} <img src={Fire} alt="fire emoji" className="navbar_emoji" />
        </h2>

        <div className="align_center book_list_fs">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="book_search_input"
          />

          <ul className="align_center book_filter">
            {[4, 3, 2].map((rate) => (
              <li
                key={rate}
                className={
                  minRating === rate
                    ? "book_filter_item active"
                    : "book_filter_item"
                }
                onClick={() => handleFilterClick(rate)}
              >
                {rate}+ Star
              </li>
            ))}
          </ul>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="book_sorting"
          >
            <option value="">SortBy</option>
            <option value="date">Date</option>
            <option value="rating">Rating</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="book_sorting"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </header>

      <div className="book_covers">
        {sortedBooks.length === 0 ? (
          <p style={{ padding: "20px 15px", color: "#aaa" }}>
            No books match this filter.
          </p>
        ) : (
          sortedBooks.map((book) => (
            <BookCover
              key={book.id}
              book={book}
              onBorrow={onBorrow}
              onReturn={onReturn}
            />
          ))
        )}
      </div>
    </section>
  );
};

export default BookList;