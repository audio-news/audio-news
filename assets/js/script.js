var userTopicForm = $(".searchBox");
var userTopicSelect = $("#user-input");

/* Checks to see if user placed an entry when submitting the form. If an entry was 
placed, then call the getNewsData function to fetch the data with gnews API */
function userFormSubmit(event) {
  event.preventDefault();

  const topic = userTopicSelect.val();
  if (topic) {
    getNewsData(topic);
    userTopicSelect.val("");
  } else {
    alert("Please enter a topic");
  }
}

/* Fetches the article data using the gnews API. Checks to see if the fetch promise is returned.
If not it catches the error. Once the fetch promise is retrieved, check the status code of the returned data.
If the status is ok, calls getNewsArticles function to extract desired data*/
function getNewsData(topic) {
  const apikey = "0a81fd50979ee58ec90f9d378ec0e3ef";
  const newsurl = `https://gnews.io/api/v4/search?q=${topic}&token=${apikey}&lang=en&country=us&max=5`;

  fetch(newsurl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          getNewsArticles(data);
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Error:", error);
    });
}

/* Extracts the desired data (article titles, description, and image) and placed it into the DOM*/
function getNewsArticles(data) {
  console.log(data);
  var articles = data.articles;

  var carouselCardTitle = $(".card-header-title");
  for (var i = 0; i < articles.length; i++) {
    var articleTitle = articles[i]["title"];
    var articleDesc = articles[i]["description"];
    var articleImgUrl = articles[i]["image"];

    //Changes the background image of the carousel item to the article image
    var carouselCard = $(`.carousel-item.item-${i + 1}`);
    carouselCard.css("background-image", `url("${articleImgUrl}")`);

    //Changes the text of the carousel card title to the article title
    $(carouselCardTitle[i]).text(articleTitle);

    //Places a footer to the carousel card containing the article desc. This section is initially set to display none
    //in the css and will be displayed only when the user clicks on a specific article
    var carouselCardDesc = `<footer class="card-footer has-text-centered has-background-white">
      <p class="card-footer-item">${articleDesc}</p>
      </footer>`;
    carouselCard.append(carouselCardDesc);
  }
}

var selectedArticle = $(".carousel-item");
selectedArticle.on("click", function (event) {
  if ($(event.target).is("a")) {
    return;
  }
  //Gets the footer element of the article that is selected
  var selectedArticleDesc = $(event.currentTarget).children("footer.card-footer");
  //Displays the article desc
  selectedArticleDesc.css("display", "flex");
  selectedArticleDesc.css("justify-content", "flex-end");
  //Gets the description text of the selected article
  var selectedDescText = selectedArticleDesc.children("p.card-footer-item").text();
  fetchTTS(selectedDescText);
});

/* Fetches VoiceRSS Text-to-Speech API with the selected article's description text as a query parameter.
The function generates an audio format in the browser window which plays a voice reading the selected article's description*/
function fetchTTS(text) {
  const API_KEY = "e5bd0e9876784ba4b37cb873babe6e39";
  const voice = "en-gb";
  const format = "MP3";
  const speed = 0;
  const requestUrl = `http://api.voicerss.org/?key=${API_KEY}&src=${text}&hl=${voice}&c=${format}&f=44khz_16bit_stereo&r=${speed}`;

  const audio = new Audio(requestUrl);
  audio.play();
}

/* Runs the userFormSubmit function when the form on the screen is submitted */
userTopicForm.submit(userFormSubmit);
