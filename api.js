const BASE_URL = "http://localhost:5000/api";

async function getFeaturedBusinesses() {
    const res = await fetch(`${BASE_URL}/search/featured`);
    return res.json();
}