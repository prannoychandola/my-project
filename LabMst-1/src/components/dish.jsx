function Dish({ id, name, cuisine }) {
  return (
    <div>
      <h1>{name}</h1>
      <h2>ID: {id}</h2>
      <h2>Cuisine: {cuisine}</h2>
    </div>
  );
}

export default Dish;