document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("featuredContainer");

    try {
        const data = await getFeaturedBusinesses();
        data.featured.forEach(biz => {
            container.innerHTML += `
                <div class="card">
                    <h3>${biz.businessName}</h3>
                    <p>${biz.category}</p>
                    <p>${biz.location}</p>
                </div>
            `;
        });
    } catch (error) {
        console.log("Error loading featured businesses");
    }
});

document.getElementById("searchBtn").addEventListener("click", () => {
    const keyword = document.getElementById("keyword").value;
    const location = document.getElementById("location").value;

    window.location.href = 
        `search.html?keyword=${keyword}&location=${location}`;
});