import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import axios from "axios";

const Card = ({ title, description }) => {
  return (
    <div>
      <hr />
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      <hr />
    </div>
  );
};

function App() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastItemElementRef = (node) => {
    if (loading || !hasMore) return;

    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await axios.get(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=50`
      );

      if (response.data.length === 0) {
        setHasMore(false);
      } else {
        setItems((prevItems) => [...prevItems, ...response.data]);
      }
      setLoading(false);
    };

    fetchData();
  }, [page]);

  return (
    <div className="grid-container">
      {items.map((item, index) => (
        <div key={item.id}>
          <Card
            title={item.title}
            description={item.description}
            imageUrl={item.imageUrl}
          />
          {items.length === index + 1 && <div ref={lastItemElementRef}></div>}
        </div>
      ))}
      {loading && <div>Loading more...</div>}
    </div>
  );
}

export default App;
