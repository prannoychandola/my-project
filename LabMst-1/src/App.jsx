import React, { useState } from "react";
import Dish from "./components/dish";

function App() {
  const indian = [
    { id: 1, name: "Chicken Biryani", cuisine: "Indian" },
    { id: 2, name: "Paneer Butter Masala", cuisine: "Indian" },
    { id: 3, name: "Dal Tadka", cuisine: "Indian" }
  ];

  const chinese = [
    { id: 4, name: "Hakka Noodles", cuisine: "Chinese" },
    { id: 5, name: "Manchurian", cuisine: "Chinese" },
    { id: 6, name: "Spring Rolls", cuisine: "Chinese" }
  ];

  const italian = [
    { id: 7, name: "Margherita Pizza", cuisine: "Italian" },
    { id: 8, name: "Pasta Alfredo", cuisine: "Italian" },
    { id: 9, name: "Lasagna", cuisine: "Italian" }
  ];

  const allDishes = [...indian, ...chinese, ...italian];

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  let dishesToShow = allDishes;

  if (category !== "all") {
    dishesToShow = allDishes.filter(dish => dish.cuisine === category);
  }

  if (search !== "") {
    dishesToShow = dishesToShow.filter(dish =>
      dish.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  return (
    <div>
      <h1>Restaurant List</h1>

      <input
        type="text"
        placeholder="Search by name..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option value="all">All</option>
        <option value="Indian">Indian</option>
        <option value="Chinese">Chinese</option>
        <option value="Italian">Italian</option>
      </select>

      {dishesToShow.map(dish => (
        <Dish key={dish.id} {...dish} />
      ))}
    </div>
  );
}

export default App;