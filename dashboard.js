const vendorData = JSON.parse(localStorage.getItem("vendor"))

if(vendorData){

document.getElementById("planName").textContent = vendorData.plan

document.getElementById("planType").textContent = vendorData.plan

document.getElementById("startDate").textContent = new Date(vendorData.subscriptionStart).toDateString()

document.getElementById("expiryDate").textContent = new Date(vendorData.subscriptionExpiry).toDateString()

}