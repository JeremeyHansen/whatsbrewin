document.addEventListener("DOMContentLoaded", () => {
  buildBrews()
});


function buildBrews(){
  const breweryForm = document.querySelector("form");
  breweryForm.addEventListener("submit", (e) => {
  let search = document.getElementById("search").value;
  let newSearch = search.replace(" ", "_");
  e.preventDefault();
  fetch(`https://api.openbrewerydb.org/breweries?by_city=${newSearch}&per_page=50`)
    .then((response) => response.json())
    .then((data) => {
      breweries = data;
      resetBreweries(data);
    });
});
}


function resetBreweries() {
  breweries.forEach((brewery) => {
    renderBreweries(brewery);
  });
}
 

function renderBreweries(brewery) {
  const newBrewery = document.createElement("li");
  const breweryList = document.getElementById("brewery-container");
  newBrewery.setAttribute("class", "brewery-card");
  newBrewery.setAttribute("data-set-id", `${brewery.id}`);
  if (brewery.phone === null) {
    brewery.phone = `No phone number available for ${brewery.name}.`;
  }
  let webUrl = `<a href="${brewery.website_url}">${brewery.website_url}</a>`;
  if (brewery.website_url === null) {
    webUrl = `No webpage available for ${brewery.name}.`;
  }
  newBrewery.innerHTML = `
    <h2 class="title-brews">${brewery.name}</h2>
    <p class="address-brews">Address: ${brewery.street} ${brewery.city},  ${brewery.state}, ${brewery.postal_code}</p>
    <p class="phone-brews">Phone: ${brewery.phone}</p>
    <p class="website-brews">${webUrl}</p>
    <button class="btn-success">Like</button>
    <button class="btn-danger">Already Been Here</button>
    <button class="btn-comment">Comment</button>
    `;
  newBrewery.querySelector(".btn-danger").addEventListener("click", handleDelete);
  // newBrewery.querySelector(".btn-comment").addEventListener("click", handleComment);
  // newBrewery.querySelector(".btn-success").addEventListener("click", incrementLike);
  breweryList.append(newBrewery);
}



function handleDelete(event){
//   fetch("https://api.openbrewerydb.org/breweries?by_city=${newSearch}&per_page=50", {
//     method: "DELETE"
// })
//     .then(res => res.json())
//     .then(data => {
//       event.target.parentNode.remove(data);
//     })
  event.target.parentNode.remove();
}

// function incrementLike(){

// }

// function handleComment(){

// }