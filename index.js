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
    if (brewery.website_url === null) {
      brewery.website_url = `No webpage available for ${brewery.name}.`
    }
    newBrewery.innerHTML = `
            <p>NAME: ${brewery.name}</p>
            <p>ADDRESS: ${brewery.street} ${brewery.city},  ${brewery.state}, ${brewery.postal_code}</p>
            <p>PHONE: ${brewery.phone}</p>
            <p>WEBSITE: ${brewery.website_url}</p>
            <button class='btn-success'>Like</button>
            <button class='btn-danger'>Delete</button>
            <button class='btn-comment'>Comment</button>
            `;

    breweryList.append(newBrewery);
  }
});
