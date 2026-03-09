const params = new URLSearchParams(window.location.search);
const category = params.get("category");
const location = params.get("location");

if (document.getElementById("resultsContainer")) {
    fetch(`http://localhost:5000/api/search?category=${category}&location=${location}`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById("resultsContainer");
            data.results.forEach(biz => {
                container.innerHTML += `
                    <div class="card">
                        <h3>${biz.businessName}</h3>
                        <p>${biz.category}</p>
                        <p>${biz.location}</p>
                        <a href="profile.html?id=${biz.id}">View Details</a>
                    </div>
                `;
            });
        });
}