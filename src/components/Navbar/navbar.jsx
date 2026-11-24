import React from "react";

import "./navbar.css";
import Fire from "../../assets/fire.png";
import Star from "../../assets/glowing-star.png";
import Party from "../../assets/partying-face.png";

const Navbar = ({ activeTab, setActiveTab, borrowedCount }) => {
  return (
    <nav className="navbar">
      <h1 onClick={() => setActiveTab("browse")} style={{ cursor: "pointer" }}>
        LIBGEN
      </h1>

      <div className="navbar_links">
        <a
          href="#popular"
          className={activeTab === "browse" ? "active_nav" : ""}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("browse");
          }}
        >
          Popular <img src={Fire} alt="fire emoji" className="navbar_emoji" />
        </a>

        <a
          href="#borrowed"
          className={activeTab === "borrowed" ? "active_nav" : ""}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("borrowed");
          }}
        >
          Borrowed ({borrowedCount}){" "}
          <img src={Star} alt="star emoji" className="navbar_emoji" />
        </a>

        <a
          href="#add-book"
          className={activeTab === "add" ? "active_nav" : ""}
          onClick={(e) => {
            e.preventDefault();
            setActiveTab("add");
          }}
        >
          Add Book <img src={Party} alt="party emoji" className="navbar_emoji" />
        </a>
      </div>
    </nav>
  );
};

export default Navbar;