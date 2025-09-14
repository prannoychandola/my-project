import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const visible = books.filter((b) => {
    const q = query.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
  });

  function addBook(e) {
    e.preventDefault();
    const t = title.trim();
    const a = author.trim();
    if (!t || !a) return;
    setBooks([...books, { id: Date.now(), title: t, author: a }]);
    setTitle("");
    setAuthor("");
    setQuery("");
  }

  function removeBook(id) {
    setBooks(books.filter((b) => b.id !== id));
  }

  return (
    <div className="app">
      <div className="container">
        <h1 className="title">Library Management</h1>

        <div className="card">
          <input
            className="search"
            placeholder="Search by title or author"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <form className="add-form" onSubmit={addBook}>
            <input
              className="input"
              placeholder="New book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              className="input"
              placeholder="New book author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <button className="btn" type="submit">Add Book</button>
          </form>

          <div className="books">
            {visible.map((b) => (
              <div key={b.id} className="book-row">
                <div>
                  <div className="book-title">{b.title}</div>
                  <div className="book-author">by {b.author}</div>
                </div>
                <button className="remove" onClick={() => removeBook(b.id)}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}