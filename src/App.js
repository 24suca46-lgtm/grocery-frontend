import React, { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8081/api/grocery-items";

function App() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: "", quantity: 1, purchased: false });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then(setItems);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;
    fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((res) => res.json())
      .then((item) => {
        if (editingId) {
          setItems((items) =>
            items.map((it) => (it.id === editingId ? item : it))
          );
        } else {
          setItems((items) => [...items, item]);
        }
        setForm({ name: "", quantity: 1, purchased: false });
        setEditingId(null);
      });
  };

  const handleEdit = (item) => {
    setForm(item);
    setEditingId(item.id);
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: "DELETE" })
      .then(() => setItems((items) => items.filter((it) => it.id !== id)));
  };

  return (
    <div className="App">
      <h1>Grocery Items</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Item name"
          required
        />
        <input
          name="quantity"
          type="number"
          value={form.quantity}
          onChange={handleChange}
          min="1"
          required
        />
        <label>
          Purchased
          <input
            name="purchased"
            type="checkbox"
            checked={form.purchased}
            onChange={handleChange}
          />
        </label>
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && <button onClick={() => { setForm({ name: "", quantity: 1, purchased: false }); setEditingId(null); }}>Cancel</button>}
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name} (x{item.quantity}) {item.purchased ? "[Purchased]" : ""}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
