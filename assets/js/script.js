var userTopicForm = $();
var userTopicSelect = $();

/* Checks to see if user placed an entry when submitting the form. If an entry was 
placed, then call the getNewsData function to fetch the data with gnews API */
function userFormSubmit(event) {
  event.preventDefault();

  const topic = userTopicSelect.val();
  if (topic) {
    getNewsData(topic);
    topic.val("");
  } else {
    alert("Please enter a topic");
  }
}

/* Fetches the article data using the gnews API. Checks to see if the fetch promise is returned.
If not it catches the error. Once the fetch promise is retrieved, check the status code of the returned data.
If the status is ok, calls getNewsArticles function to extract desired data*/
function getNewsData(topic) {
  const apikey = "0a81fd50979ee58ec90f9d378ec0e3ef";
  const newsurl = `https://gnews.io/api/v4/search?q=${topic}&token=${apikey}&lang=en&country=us&max=10`;

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

/* Extracts the desired data (article titles, description, and image) */
function getNewsArticles(data) {
    console.log(data);
    var articles = data.articles;
    for (i = 0; i < articles.length; i++) {
        var articleTitle = articles[i]["title"];
        var articleDesc = articles[i]["description"];
        var articleImgUrl = articles[i]["image"];
    }
}

//TODO: Add query selector to get parent element where the articles are going to be added in. This is because we 
//will use event delegation since the articles will only be added when the user submits the form
var main = $();
//TODO: Add class element of the article that is going to be clicked on
main.on("click", "", function (event) {
//Gets the body elements of the article that is selected
    var selectedArticle = $(event.currentTarget).children();
//Gets the description text of the selected article
    var selectedDescText = selectedArticle.children().text();
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