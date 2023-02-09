var userTopicForm = $(".searchBox");
var userTopicSelect = $("#user-input");
/* Runs the userFormSubmit function when the form on the screen is submitted */
userTopicForm.on("submit", userFormSubmit);

/* Checks to see if user placed an entry when submitting the form. If an entry was 
placed, then call the getNewsData function to fetch the data with gnews API */
function userFormSubmit(event) {
  event.preventDefault();

  const topic = userTopicSelect.val();
  if (topic) {
    const apikey = "3b64668f943a2a88bd9cf8517c24086f";
    const newsurl = `https://gnews.io/api/v4/search?q=${topic}&token=${apikey}&lang=en&country=us&max=5`;
    $(".current-topic").text(topic.toUpperCase());
    getNewsData(newsurl);
    userTopicSelect.val("");
  } else {
    alert("Please enter a topic");
  }
}

/* Fetches the article data using the gnews API. Checks the status code of the returned data.
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

/* Extracts the desired data (article titles, description, URL and image) and placed it into the DOM*/
function getNewsArticles(data) {
  console.log(data);
  var articles = data.articles;

  var carouselCardTitle = $(".card-header-title .title-text");
  for (var i = 0; i < articles.length; i++) {
    //sets the ID of the article
    var carouselCard = $(`.carousel-item.item-${i + 1}`);
    var articleId = articles[i]["title"].split(" ").join(""); //A unique identifier for the every article placed in a carousel is the article's full title
    carouselCard.attr("id", articleId);

    //Changes the text of the carousel card title to the article title
    var articleTitle = articles[i]["title"];
    $(carouselCardTitle[i]).text(articleTitle);

    //Changes the background image of the carousel item to the article image
    var articleImgUrl = articles[i]["image"];
    carouselCard.css("background-image", `url("${articleImgUrl}")`);

    //Places a footer to the carousel card containing the article desc. This section is initially set to display none
    //in the css and will be displayed only when the user clicks on a specific article
    var articleDesc = articles[i]["description"];
    var articleUrl = articles[i]["url"];
    carouselCard.find("footer").remove();
    var carouselCardDesc = `<footer class="card-footer has-text-centered has-background-white">
      <p class="footer-text description">${articleDesc}</p>
      <div class="buttons is-right are-small"><a href="${articleUrl}" target="_blank"><button class="button read-more" type="button"> Read More </button></a></div>
      </footer>`;
    carouselCard.append(carouselCardDesc);
  }
  //Updates the save button on the article card to reflect if it has already been saved or not
  updateCarouselSaveBtn();
}

/* When the carousel article is clicked on, it reveals the footer of the carousel item that contains the article's 
description and plays the audio of the description */
var selectedArticle = $(".carousel-item");
var carouselClickedAfterHeadline = false; //Checks if the use clicked on a carousel article after clicking a headline article
selectedArticle.on("click", playCarouselAudio);
function playCarouselAudio(event) {
  //stops the audio if the user clicks on the read more button or the carousel <> arrows to slide through
  if (
    $(event.target).is("a") ||
    $(event.target).is("button.button.read-more")
  ) {
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

  //Gets the description text of the selected article and plays the audio
  var selectedDescText = selectedArticleDesc.children("p.footer-text").text();

  headlineClickedAfterCarousel = true; //After carousel is clicked, sets to true so when user clicks on a headline, it would confirm that carousel was clicked before it
  //If the user clicked on a carousel article after a headline, then stop the headline article audio and play the carousel audio
  if (carouselClickedAfterHeadline == true) {
    if (audio !== null) {
      audio.pause();
      audio = null;
    }
    fetchTTS(selectedDescText);
    carouselClickedAfterHeadline = false;
    return;
  }

  fetchTTS(selectedDescText);
};

var audio = null;
/* Fetches VoiceRSS Text-to-Speech API with the selected article's description text as an argument.The function 
generates an audio format in the browser window which plays a voice reading the selected article's description*/
function fetchTTS(text) {
  const API_KEY = "e5bd0e9876784ba4b37cb873babe6e39";
  const language = "en-us";
  const voice = "Mike";
  const codec = "MP3";
  const format = "alaw_22khz_mono";
  const speed = 0;
  const requestUrl = `http://api.voicerss.org/?key=${API_KEY}&src=${text}&hl=${language}&v=${voice}&c=${codec}&f=${format}&r=${speed}`;

  // headlineClickedAfterCarousel = true;
  //Checks if there's a current existing audio so audios don't overlap
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

/* Displays articles in the carousel when the user clicks on an option from the suggested searches in the sidebar */
var menuLink = $(".menu-link");
menuLink.on("click", getSuggestedArticle);
function getSuggestedArticle(event) {
  const menuTopic = $(event.target).text().toLowerCase();
  const apikey = "1d43572a6aa2cb5240480cade17ec294";
  const topicUrl = `https://gnews.io/api/v4/top-headlines?topic=${menuTopic}&token=${apikey}&lang=en&country=us&max=5`;
  $(".current-topic").text(menuTopic.toUpperCase());
  getNewsData(topicUrl);
};

/* When the user clicks clicks on a suggested search, or makes their own search, this will allow them to click
the home button in the nav to return to the initial carousel articles shown when the page was loaded */
var homeLink = $("#home");
homeLink.on("click", getHomeArticles)
function getHomeArticles() {
  const apikey = "a87c194102cb5e1b9761c7b75ac51bc6";
  const randTopic = "lifestyle";
  const topicsUrl = `https://gnews.io/api/v4/top-headlines?q=${randTopic}&token=${apikey}&lang=en&country=us&max=5`;
  $(".current-topic").text(randTopic.toUpperCase());
  getNewsData(topicsUrl);
}

/* Displays trending articles in the headline section below the carousel in the webpage. Since these trends are 
also available in the suggested searches menu, this function displays articles that won't be displayed in the 
carousel. The function makes an api call to return the top 7 articles for a trend (first 5 will appear in carousel 
and remaining 2 will be displayed below the carousel)*/
function displayHeadlines(trend) {
  const trendTopic = trend.attr("id");
  const apikey = "c09cb33e13f449b45206fd88c72ce1c6";
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
            var trendUrl = articles[i + 5]["url"];

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
            $(trendCards[i])
              .find(".card-content")
              .find(".buttons")
              .find("a")
              .attr("href", trendUrl);
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
article, it pauses the audio of the prev article and plays the audio of the new article */
var prevHeadline = null;
var headlineArticle = $(".headline-card");
var checkUserRead = false; //Checks if the user clicked the 'read more' button to view the full article
var headlineClickedAfterCarousel = false; //Check if the use clicked on a headline article after clicking a carousel article
headlineArticle.on("click", playHeadlineAudio);

function playHeadlineAudio(event) {
  event.stopImmediatePropagation();
  const headlineDesc = $(event.currentTarget).find(".media-content").find(".content").text();
  var currentHeadline = $(this);
  carouselClickedAfterHeadline = true; //After headline is clicked, sets to true so when user clicks on a carousel, it would confirm that headline was clicked before it

  //Keeps audio playing if user clicks on the saveBtn while listening to the audio
  if ($(event.target).is("button.saveBtn") || $(event.target).is("button.saveBtn img")) {
    return;
  }

  //stops the audio if the user clicks on read more to go to a new tab and read the full article
  if ($(event.target).is("button.button.read-more")) {
    if (audio) {
      audio.pause();
      checkUserRead = true; 
    }
    return;
  }

//If the user clicked on a headline article after a carousel, then stop the carousel article audio and play the headline audio
  if (headlineClickedAfterCarousel == true) {
    if (audio !== null) {
      audio.pause();
      audio = null;
    }
    fetchTTS(headlineDesc);
    prevHeadline = $(currentHeadline)[0];
    headlineClickedAfterCarousel = false;
    return;
  }

  /*Checks if the user clicked the same headline article as the previous click. If its the same article but the audio
  was completed or the user clicked on 'read more' link, then it replays the audio. Otherwise, it pauses the audio
  when the user clicks the same headline article*/
  if (prevHeadline === $(currentHeadline)[0]) {
    if (audio.ended || checkUserRead) {
      checkUserRead = false;
      audio = null;
      fetchTTS(headlineDesc);
    } else {
      audio.pause();
      audio = null;
    }
    prevHeadline = null;
  } else {
    /* If the user clicked a different headline article, then it stops the audio of the last headline article and plays
  the audio of the new article */
    if (prevHeadline) {
      audio.pause();
      audio = null;
    }
    fetchTTS(headlineDesc);
    prevHeadline = $(currentHeadline)[0];
  }
};

/* Loads lifestyle articles in the carousel and loads headline articles below the carousel when the page is rendered.
Also changes the styles & attributes of the save buttons to indicate if its respective article has been saved or not */
$(document).ready(function () {
  const apikey = "03c21bd852d01877fbd2cc999f14c684";
  const randTopic = "lifestyle";
  const topicsUrl = `https://gnews.io/api/v4/top-headlines?q=${randTopic}&token=${apikey}&lang=en&country=us&max=5`;
  $(".current-topic").text(randTopic.toUpperCase());
  getNewsData(topicsUrl);

  const trendBreaking = $("#breaking-news");
  const trendWorld = $("#world");
  const trendEntertainment = $("#entertainment");

  displayHeadlines(trendBreaking);
  displayHeadlines(trendWorld);
  displayHeadlines(trendEntertainment);

  /* Reverts the attributes and styles of each save button for each article to what it last was before the user 
  reloaded the page. The data attribute lets us keep track of which articles were saved */
  $(".saveBtn").each(function () {
    var saveButton = $(this);
    var buttonId = $(this).attr("id");
    //The localStorage contains the button id's as the key and a "saved" status as its value
    var savedStatus = localStorage.getItem(buttonId);
    if (savedStatus === "saved") {
      //Applies attributes & styles to that of a saved button
      saveButton.removeClass("is-outlined");
      saveButton.attr("data-saved", "yes");
      saveButton.css("background-color", "red");
    } else {
      //Applies attributes & styles to that of an unsaved button
      saveButton.addClass("is-outlined");
      saveButton.attr("data-saved", "no");
      saveButton.css("background-color", "");
    }
  });
});

var articleCards = $(".card");
articleCards.on("click", ".buttons button.saveBtn", saveArticle);
/* When the user clicks on the save button to save an article, it will change the button's style & attributes and
add the article to localStorage. If the article was already saved, then it removes the button's style & attributes 
and removes the article from the localStorage  */
function saveArticle(event) {
  event.stopImmediatePropagation();

  //gets the card container of the article that was saved by the user
  var favArticle = $(event.target).closest(".card");
  //gets the HTML of the card container (to be able to append the HTML in the favourites tab)
  var favArticleHtml = $(event.target).closest(".card")[0].outerHTML;
  //savedArticles is an array where each item is a JS Object. The object key is the article's id and its value is the html of the article card container
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];

  var saveButton = $(event.currentTarget);
  var buttonId = saveButton.attr("id");
  var articleId = favArticle.attr("id");

  /*Checks to see if the article the user clicked on is already in the savedArticles array. If it is, then remove
  it from the array and change the saveBtn styles & attributes to show that it has been un-saved*/
  const isAlreadySaved = savedArticles.some((obj) => obj.hasOwnProperty(articleId));
  if (isAlreadySaved) {
    var indexSavedEntry = savedArticles.findIndex(obj => obj.hasOwnProperty(articleId))
    savedArticles.splice(indexSavedEntry, 1);
    // update the button styles & attributes to indicate it is not saved
    saveButton.addClass("is-outlined");
    saveButton.css("background-color", "transparent");
    saveButton.attr("data-saved", "no");
    localStorage.removeItem(buttonId);
  } else {
    //unshift places the newest added articles at the beginning of the array
    savedArticles.unshift({ [articleId]: favArticleHtml });
    // update the button styles & attributes to indicate it is saved
    saveButton.removeClass("is-outlined");
    saveButton.css("background-color", "red");
    saveButton.attr("data-saved", "yes");
    localStorage.setItem(buttonId, "saved");
  }
  // update the local storage to what is contained in savedArticles
  localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
}

/* When the getNewsArticles function is run (the articles displayed in the carousel are changed), it checks the
id of the carousel articles. If the article id is present in the local storage object keys (meaning the article has
been saved) then apply styles & attributes to the save button indicating its been saved */
function updateCarouselSaveBtn() {
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];

  // loop through each article in the carousel
  var articles = $(".carousel-item");
  articles.each((index, article) => {
    // get the article ID
    const articleId = $(article).attr("id");
    // get the button for the article
    const carouselSaveBtn = $(article).find(".saveBtn");
    var buttonId = carouselSaveBtn.attr("id");
    // check if the article is saved
    if (savedArticles.some((obj) => obj.hasOwnProperty(articleId))) {
      // update the button styles to indicate article is already saved
      carouselSaveBtn.removeClass("is-outlined");
      carouselSaveBtn.css("background-color", "red");
      carouselSaveBtn.attr("data-saved", "yes");
      localStorage.setItem(buttonId, "saved");
    } else {
      // update the button styles to indicate article was not saved
      carouselSaveBtn.addClass("is-outlined");
      carouselSaveBtn.css("background-color", "transparent");
      carouselSaveBtn.attr("data-saved", "no");
      localStorage.removeItem(buttonId);
    }
  });
}