//let breweries = [];
const breweryForm = document.querySelector("form");

searchBrews();

//*function to change the center pic if city entered was incorrect

let centerPic = document.querySelector(".center-pic");
centerPic.setAttribute("src", "https://acegif.com/wp-content/uploads/gif/beer-36.gif");
function changeCenterPic(){
    centerPic.setAttribute("src", "https://media0.giphy.com/media/8VEcV7zZZzbjU0P5XT/200w.gif?cid=82a1493b3ye2jmaufawdydlg92fuxnqluvrt9afa62z1h48m&rid=200w.gif&ct=s");
};

//*function to change the center pic back after


function returnCenterPic(){
  centerPic.setAttribute("src", "https://acegif.com/wp-content/uploads/gif/beer-36.gif");
};


//*function to fetch and grab the brewery info

function searchBrews() {
  breweryForm.addEventListener("submit", (e) => {
    let search = document.getElementById("search").value;
    let newSearch = search.replace(" ", "_");
    e.preventDefault();
    fetch(
      `https://api.openbrewerydb.org/breweries?by_city=${newSearch}&per_page=50`
    )
      .then((response) => response.json())
      .then((data) => {
        let breweryDataArray = data;
        
        if  (data.length === 0){
          // alert("No breweries found, please check spelling and try again!");
          changeCenterPic();
        }
        else{
          returnCenterPic()
        }

        let breweriesWithComments = [];
        
        fetch("http://localhost:3000/brewery")
        .then((response) => response.json())
        .then((comments) => {
         const breweryIds = breweryDataArray.map(a => a.id)
         console.log(breweryIds);
           for (let breweryId of breweryIds) {
            const commentsForID = comments.find(({ id }) => id === breweryId); //get comments of the specified id
            let brewery =  breweryDataArray.find(({ id }) => id === breweryId);//get brewery for specified id
            //console.log("brewery comment",commentsForID);
            
            if(commentsForID){
              brewery["comment"] = commentsForID["comment"]
              // console.log("has comments",brewery)
            }
            breweriesWithComments.push(brewery)
          }
          console.log("breweriesWithComments",breweriesWithComments);

          resetBreweries(breweriesWithComments);
        });
      })
    document.getElementById("search").value = "";
  });
}

//*function calling the rendering of the cards

function resetBreweries(breweriesWithComments) {
  breweriesWithComments.map((brewery) => {
    renderBreweries(brewery);
  });
}

//*function to create the cards for the breweries

function renderBreweries(brewery) {
  const newBrewery = document.createElement("li");
  const breweryList = document.getElementById("brewery-container");
  newBrewery.setAttribute("class", "brewery-card");
  newBrewery.setAttribute("id", `${brewery.id}`);
  if (brewery.phone === null) {
    brewery.phone = `No phone number available for ${brewery.name}.`;
  }
  let webUrl = `<a href="${brewery.website_url}">Check Out ${brewery.name}'s Website!</a>`;
  if (brewery.website_url === null) {
    webUrl = `No webpage available for ${brewery.name}.`;
  }
  let brewComment = brewery.comment;
  if (brewery.comment === undefined) {
    brewComment = "";
  }
  newBrewery.innerHTML = `
    <h2 class="title-brews">${brewery.name}</h2>
    <img class="card-image" src="https://thumbs.gfycat.com/PlainVapidGalah-max-1mb.gif"></img>
    <p class="address-brews">Address: ${brewery.street} ${brewery.city},  ${brewery.state}, ${brewery.postal_code}</p>
    <p class="phone-brews">Phone: ${brewery.phone}</p>
    <p class="website-brews">${webUrl}</p>
    <p class="comment-spot">Review: ${brewComment}</p>
    <input class="comment-input" type="text" placeholder="Leave a Review"/>
    <button class="btn-success" onclick="this.style.background = 'red'">Like</button>
    <button class="btn-danger">Already Been Here</button>
    `;
  newBrewery
    .querySelector(".btn-danger")
    .addEventListener("click", handleDelete);
  newBrewery
    .querySelector(".comment-input")
    .addEventListener("keydown", function (e) {
      let commentSpot = newBrewery.querySelector(".comment-spot");
      let input = e.target.value;
      if (e.key === "Enter") {
        commentSpot.innerText = "Review: " + input;
        e.target.value = "";
        const id = brewery.id;
        fetch(`http://localhost:3000/brewery/`, {
          method: `POST`,
          body: JSON.stringify({
            id: id,
            comment: input,
          }),
          headers: { "Content-type": `application/json` },
        }).then((response) => response.json());
      }
    });
  breweryList.append(newBrewery);
}

function handleDelete(event) {
  event.target.parentNode.remove();
}

//*change text of title box when clicked and then revert after

const titleBox = document.getElementById("title-box");
titleBox.addEventListener("mouseover", (e) => {
  e.preventDefault();
  document.getElementById('title-box').innerText = "BEERS DUH"
});
titleBox.addEventListener("mouseout", (e) => {
  e.preventDefault();
  document.getElementById('title-box').innerText = "What's Brewin'?"
});

//*alert on center image to input below

document.getElementById("center-pic").addEventListener("click", (e) => {
  e.preventDefault();
  alert("Enter Your City In The Search Bar To Find Some Beers");
  })
