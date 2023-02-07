var userTopicForm = $(".searchBox");
var userTopicSelect = $("#user-input");

/* Checks to see if user placed an entry when submitting the form. If an entry was 
placed, then call the getNewsData function to fetch the data with gnews API */
function userFormSubmit(event) {
  event.preventDefault();

  const topic = userTopicSelect.val();
  if (topic) {
    const apikey = "0a81fd50979ee58ec90f9d378ec0e3ef";
    const newsurl = `https://gnews.io/api/v4/search?q=${topic}&token=${apikey}&lang=en&country=us&max=5`;
    getNewsData(newsurl);
    userTopicSelect.val("");
  } else {
    alert("Please enter a topic");
  }
}

/* Fetches the article data using the gnews API. Checks to see if the fetch promise is returned.
If not it catches the error. Once the fetch promise is retrieved, check the status code of the returned data.
If the status is ok, calls getNewsArticles function to extract desired data*/
function getNewsData(apiUrl) {
  fetch(apiUrl)
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
    if (audio) {
      audio.pause();
    }
    audio = null;
    return;
  }
  //Gets the footer element of the article that is selected
  var selectedArticleDesc = $(event.currentTarget).children(
    "footer.card-footer"
  );
  //Displays the article desc
  selectedArticleDesc.css("display", "flex");
  selectedArticleDesc.css("justify-content", "flex-end");
  //Gets the description text of the selected article
  var selectedDescText = selectedArticleDesc
    .children("p.card-footer-item")
    .text();
  fetchTTS(selectedDescText);
});

var audio = null;
/* Fetches VoiceRSS Text-to-Speech API with the selected article's description text as a query parameter.
The function generates an audio format in the browser window which plays a voice reading the selected article's description*/
function fetchTTS(text) {
  const API_KEY = "e5bd0e9876784ba4b37cb873babe6e39";
  const language = "en-us";
  const voice = "Mike";
  const codec = "MP3";
  const format = "alaw_22khz_mono";
  const speed = 0;
  const requestUrl = `http://api.voicerss.org/?key=${API_KEY}&src=${text}&hl=${language}&v=${voice}&c=${codec}&f=${format}&r=${speed}`;

  //Checks if there's a current existing audio so audio's don't overlap
  if (audio === null) {
    audio = new Audio(requestUrl);
    audio.play();
  } else {
    //If the audio is currently playing, then pause it and set audio to null (so the next time the user clicks the element, it will restart the audio)
    if (!audio.paused) {
      audio.pause();
      audio = null;
    }
    //If the audio finished and the user clicks the element again, it replays the audio
    else if (audio.ended) {
      audio.play();
    }
  }
}

var menuLink = $(".menu-link");
menuLink.on("click", function (event) {
  const menuTopic = $(event.target).text().toLowerCase();
  const apikey = "0a81fd50979ee58ec90f9d378ec0e3ef";
  const topicUrl = `https://gnews.io/api/v4/top-headlines?topic=${menuTopic}&token=${apikey}&lang=en&country=us&max=5`;
  getNewsData(topicUrl);
});

/* Displays trending articles below the carousel in the webpage. Since these trends are also available in the 
suggested searches menu, this function displays articles that won't be displayed in the carousel. The function
makes an api call to return the top 7 articles for a trend (first 5 will appear in carousel and remaining 2 will be
displayed below the carousel)*/
function displayHeadlines(trend) {
  const trendTopic = trend.attr("id");
  const apikey = "07334c52fbc3d7575a0c2e5ad46987ab";
  const trendUrl = `https://gnews.io/api/v4/top-headlines?topic=${trendTopic}&token=${apikey}&lang=en&country=us&max=7`;

  fetch(trendUrl)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          var articles = data.articles;
          var trendCards = trend.children();

          for (var i = 0; i < trendCards.length; i++) {
            var trendTitle = articles[i + 5]["title"];
            var trendDesc = articles[i + 5]["description"];
            var trendImgUrl = articles[i + 5]["image"];

            $(trendCards[i])
              .find(".card-image")
              .find("img")
              .attr("src", trendImgUrl);
            $(trendCards[i])
              .find(".card-content")
              .find(".title")
              .text(trendTitle);
            $(trendCards[i])
              .find(".card-content")
              .find(".content")
              .text(trendDesc);
          }
        });
      } else {
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      alert("Error:", error);
    });
}

/* Checks the headline article that was clicked by the user. When the user clicks on the article, the audio of its 
description is played. If the user clicks on the article again it pauses the audio. If the user clicks on a different
article, it pauses the audio and plays the audio of the new article */
var checkHeadlineAudio = null;
var headlineArticle = $(".headline-article");
headlineArticle.on("click", function (event) {
    const headlineDesc = $(event.currentTarget).find(".media-content").find(".content").text();
    var currentHeadline = $(this);
    var checkUserRead = false;
    //stops the audio if the user clicks on read more to go to a new tab and read the full article
    if ($(event.target).is("button.button.read-more")) {
        if (audio) {
            audio.pause();
            checkUserRead = true;
        }
        return;
    }

    if (checkHeadlineAudio === $(currentHeadline)[0]) {
        if (audio.ended || checkUserRead) {
            checkUserRead = false;
            audio = null;
            fetchTTS(headlineDesc);
        }
        else {
            audio.pause();
            audio = null;
        }
        checkHeadlineAudio = null;
    }
    else {
        if (checkHeadlineAudio) {
            audio.pause();
            audio = null;
        }
        fetchTTS(headlineDesc);
        checkHeadlineAudio = $(currentHeadline)[0];
    }
});

$(document).ready(function () {
  const trendBreaking = $("#breaking-news");
  const trendWorld = $("#world");
  const trendEntertainment = $("#entertainment");

  displayHeadlines(trendBreaking);
  displayHeadlines(trendWorld);
  displayHeadlines(trendEntertainment);
});

/* Runs the userFormSubmit function when the form on the screen is submitted */
userTopicForm.submit(userFormSubmit);
