document.addEventListener("DOMContentLoaded", () => {
  buildBrews()
  const titleBox = document.getElementById('title-box')
  titleBox.addEventListener('click', messagePopUp);

  function messagePopUp(e){
    e.preventDefault();
    alert('Enter Your City Below To Find Some Beers')
  }
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
  breweries.map((brewery) => {
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
    <button class="btn-success" onclick="this.style.background = 'red'">Like</button>
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

fetch('http://localhost:3000/brewery', {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
              
});
// function incrementLike(){

// }

// function handleComment(){

// }

