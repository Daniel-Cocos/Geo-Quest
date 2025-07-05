import "./Input.css"
import axios from "axios";
import { useState } from "react";


function MovieGrid() {
    const [query, setQuery] = useState("");
    const [name, setName] = useState("");

    const handleKeyDown = async (e) => {
        if (e.key === "Enter" && query.trim() !== "") {
            const response = await axios.get(`http://127.0.0.1:8000/api/hello?name=${encodeURIComponent(query)}`);
            setName(response.data.data);
        }
    }

    return (
        <div>
            <input
                className="hello"
                type="text"
                placeholder="Enter your name..."
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
            />

            <p>{name}</p>
        </div>
    )
}

export default MovieGrid;

