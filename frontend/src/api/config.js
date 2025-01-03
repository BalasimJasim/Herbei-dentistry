const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
console.log("Environment:", import.meta.env.MODE);
console.log("API_URL:", API_URL);
console.log("All env vars:", import.meta.env);

export default API_URL;
