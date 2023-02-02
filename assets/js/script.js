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
        //TODO: Add query selectors to place article data into the DOM to be displayed on the screen
        var articleTitle = articles[i]["title"];
        var articleDesc = articles[i]["description"];
        var articleImgUrl = articles[i]["image"];
    }
}