import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8080/bulitipper/api",
    headers: {
        "Content-type": "application/json"
    }
});