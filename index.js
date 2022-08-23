document.addEventListener("DOMContentLoaded", () => {
  const breweryList = document.getElementById("brewery-container");
  const breweryForm = document.querySelector("form");
  breweryForm.addEventListener("submit", (e) => {
    let search = document.getElementById('search').value;
    let newSearch = search.replace(" ", "_");
    e.preventDefault();
    fetch(`https://api.openbrewerydb.org/breweries?by_city=${newSearch}&per_page=50`)
      .then((response) => response.json())
      .then((data) => {
        breweries = data;
        resetBreweries(data);
      });

  });
  function resetBreweries() {
    breweries.forEach((brewery) => {
      renderBreweries(brewery);
    });
  }
  function renderBreweries(brewery) {
    const newBrewery = document.createElement("li");
    newBrewery.setAttribute("class", "brewery-card");
    newBrewery.setAttribute("data-set-id", `${brewery.id}`);
    if (brewery.phone === null) {
      brewery.phone = `No phone number available for ${brewery.name}.`
    }

    let webUrl = `<a href="${brewery.website_url}">${brewery.website_url}</a>`
    if (brewery.website_url === null) {
      webUrl = `No webpage available for ${brewery.name}.`
    }
    newBrewery.innerHTML = `
      <h3 class="title-brews">${brewery.name}</h3>
      <p class="address-brews">Address: ${brewery.street} ${brewery.city},  ${brewery.state}, ${brewery.postal_code}</p>
      <p class="phone-brews">Phone: ${brewery.phone}</p>
      <p class="website-brews">${webUrl}</p>
      <button class="btn-success">Like</button>
      <button class="btn-danger">Delete</button>
      <button class="btn-comment">Comment</button>
      `;

    breweryList.append(newBrewery);
  }
});
