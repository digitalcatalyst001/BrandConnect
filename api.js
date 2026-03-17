const API_BASE = "https://localhost:5000/api"

async function getFeaturedBusinesses(){

const res = await fetch(`${API_BASE}/search/featured`)

const data = await res.json()

return data.featured

}

async function loginUser(email,password){

const res = await fetch(`${API_BASE}/auth/login`,{
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({email,password})
})

return await res.json()

}