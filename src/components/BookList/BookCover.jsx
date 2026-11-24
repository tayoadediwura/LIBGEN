import React from "react";
import "./BookCover.css";
import Star from "../../assets/glowing-star.png";

const BookCover = ({ book, onBorrow, onReturn }) => {
  return (
    <div className="book_cover">
      <img src={book.cover} alt={book.title} className="book_cover_img" />

      <div className="book_info">
        <h3 className="book_info_heading">{book.title}</h3>
        <div className="align_center book_author_rate">
          <p>{book.author}</p>
          <p className="align_center">
            {book.rating}{" "}
            <img src={Star} alt="rating icon" className="book_rating_icon" />
          </p>
        </div>
        <p className="book_description">{book.description}</p>

        {book.isBorrowed ? (
          <div className="borrow_controls">
            <span className="borrowed_badge">Borrowed by {book.borrower}</span>
            <button
              className="book_action_btn return_btn"
              onClick={() => onReturn(book.id)}
            >
              Return Book
            </button>
          </div>
        ) : (
          <button
            className="book_action_btn borrow_btn"
            onClick={() => onBorrow(book.id)}
          >
            Borrow Book
          </button>
        )}
      </div>
    </div>
  );
};

export default BookCover;