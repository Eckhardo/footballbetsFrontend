import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8080/bulitipper/api/v1",
    headers: {
        "Content-type": "application/json"
    }
});