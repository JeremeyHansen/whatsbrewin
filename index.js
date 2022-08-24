let breweries = [];

document.addEventListener("DOMContentLoaded", () => {
  buildBrews();
  const titleBox = document.getElementById("title-box");
  titleBox.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Enter Your City Below To Find Some Beers");
  });
})

function buildBrews() {
  const breweryForm = document.querySelector("form");
  breweryForm.addEventListener("submit", (e) => {
    let search = document.getElementById("search").value;
    let newSearch = search.replace(" ", "_");
    e.preventDefault();
    fetch(
      `https://api.openbrewerydb.org/breweries?by_city=${newSearch}&per_page=50`
    )
      .then((response) => response.json())
      .then((data) => {
        breweries = data;
        resetBreweries(data);
      });
    document.getElementById("search").value = "";
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
  newBrewery.setAttribute("id", `${brewery.id}`);
  if (brewery.phone === null) {
    brewery.phone = `No phone number available for ${brewery.name}.`;
  }
  let webUrl = `<a href="${brewery.website_url}">${brewery.website_url}</a>`;
  if (brewery.website_url === null) {
    webUrl = `No webpage available for ${brewery.name}.`;
  }
  let brewComment = brewery.comment
  if (brewery.comment === undefined) {
    brewComment = ""}
  newBrewery.innerHTML = `
    <h2 class="title-brews">${brewery.name}</h2>
    <img class="card-image" src="https://thumbs.gfycat.com/PlainVapidGalah-max-1mb.gif"></img>
    <p class="address-brews">Address: ${brewery.street} ${brewery.city},  ${brewery.state}, ${brewery.postal_code}</p>
    <p class="phone-brews">Phone: ${brewery.phone}</p>
    <p class="website-brews">${webUrl}</p>
    <p class="comment-spot">${brewComment}</p>
    <input class="comment-input" type="text" placeholder="Leave a Review"/>
    <button class="btn-success" onclick="this.style.background = 'red'">Like</button>
    <button class="btn-danger">Already Been Here</button>
    `;
  newBrewery.querySelector(".btn-danger").addEventListener("click", handleDelete);
  newBrewery.querySelector(".comment-input").addEventListener("keydown", function (e) {
      let commentSpot = newBrewery.querySelector(".comment-spot");
      let input = e.target.value;
      if (e.key === "Enter") {
        commentSpot.innerText = "Review: " + input;
        e.target.value = "";
        const id = brewery.id
          fetch(`http://localhost:3000/brewery/${id}`, {
            method: `PATCH`,
            body: JSON.stringify({
               comment: input 
              }),
            headers: { 'Content-type': `application/json; charset=UTF-8` },
          }).then((response) => response.json())
        }
      });
  breweryList.append(newBrewery);
}

function handleDelete(event) {
  event.target.parentNode.remove();
}

fetch("http://localhost:3000/brewery", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    },
  body: JSON.stringify(breweries),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Success:", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
