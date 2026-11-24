import React, { useState } from "react";
import "./AddBook.css";

const FALLBACK_COVER = "https://placehold.co/200x300/1c1c1c/ffe400?text=No+Cover";

const AddBook = ({ onAddBook }) => {
  const [apiQuery, setApiQuery] = useState("");
  const [apiResults, setApiResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const handleApiSearch = async (e) => {
    e.preventDefault();
    if (!apiQuery.trim()) return;

    setIsLoading(true);
    setApiError("");
    setApiResults([]);

    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?q=${encodeURIComponent(
          apiQuery.trim()
        )}&limit=6`
      );
      if (!response.ok) throw new Error("Network error while searching books.");

      const data = await response.json();
      if (!data.docs || data.docs.length === 0) {
        setApiError("No books found. Try another title or author.");
      } else {
        setApiResults(data.docs);
      }
    } catch (err) {
      setApiError("Could not reach Open Library. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectApiBook = async (doc) => {
    const coverUrl = doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : FALLBACK_COVER;

    let fullDescription = `Published in ${doc.first_publish_year || "N/A"} by ${
      doc.author_name ? doc.author_name[0] : "Unknown"
    }.`;

    if (doc.key) {
      try {
        const workRes = await fetch(`https://openlibrary.org${doc.key}.json`);
        const workData = await workRes.json();

        if (workData.description) {
          fullDescription =
            typeof workData.description === "string"
              ? workData.description
              : workData.description.value || fullDescription;
        }
      } catch (err) {
      }
    }

    const newBook = {
      id: Date.now(),
      title: doc.title || "Untitled Book",
      author: doc.author_name ? doc.author_name[0] : "Unknown",
      rating: doc.ratings_average
        ? Number(doc.ratings_average.toFixed(1))
        : 4.2,
      date: doc.first_publish_year
        ? `${doc.first_publish_year}-01-01`
        : new Date().toISOString().split("T")[0],
      description:
        fullDescription.length > 140
          ? fullDescription.slice(0, 140) + "..."
          : fullDescription,
      cover: coverUrl,
      isBorrowed: false,
      borrower: "",
    };

    onAddBook(newBook);
  };

  return (
    <section className="add_book_wrapper">
      <div className="add_book_section">
        <h2>Search Online Catalog (Open Library API)</h2>
        <form className="api_search_bar" onSubmit={handleApiSearch}>
          <input
            type="text"
            placeholder="Search by book title or author..."
            value={apiQuery}
            onChange={(e) => setApiQuery(e.target.value)}
          />
          <button type="submit" className="submit_book_btn" disabled={isLoading}>
            {isLoading ? "Searching..." : "Search"}
          </button>
        </form>

        {apiError && <p className="api_error_msg">{apiError}</p>}

        {apiResults.length > 0 && (
          <div className="api_results_grid">
            {apiResults.map((doc) => {
              const thumb = doc.cover_i
                ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
                : FALLBACK_COVER;

              return (
                <div key={doc.key} className="api_result_card">
                  <img src={thumb} alt={doc.title} />
                  <div className="api_result_info">
                    <h4>{doc.title}</h4>
                    <p>{doc.author_name ? doc.author_name[0] : "Unknown"}</p>
                    <span>{doc.first_publish_year || ""}</span>
                    <button
                      type="button"
                      className="submit_book_btn"
                      onClick={() => handleSelectApiBook(doc)}
                    >
                      + Add to Library
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default AddBook;