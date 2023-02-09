/* Gets saved items from the local storage and displays it on the screen in the favoutites column */
function displaySavedArticles() {
  var favColumn = $("#favourites .column");

  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];

  savedArticles.forEach((article) => {
    favColumn.append($(Object.values(article)[0]));
  });
}

/* Checks the saved carousel article and updates the article's save button to inidcate its status  */
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

/* Checks the saved headline article and updates the article's save button to inidcate its status */
function updateHeadlineSaveBtn() {
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
}

/* Displays the articles and their buttons with the correct styles & attributes when the DOM is rendered */
$(document).ready(function () {
  displaySavedArticles();
  updateCarouselSaveBtn();
  updateHeadlineSaveBtn();
});

/* Allows the user to save and unsave items from the favourites section */
var articleCards = $(".column");
articleCards.on("click", ".card .buttons button.saveBtn", removeSavedArticle);
function removeSavedArticle(event) {
  event.stopImmediatePropagation();

  var favArticle = $(event.target).closest(".card");
  var favArticleHtml = $(event.target).closest(".card")[0].outerHTML;
  const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];

  var saveButton = $(event.currentTarget);
  var buttonId = saveButton.attr("id");
  var articleId = favArticle.attr("id");

  const isAlreadySaved = savedArticles.some((obj) =>
    obj.hasOwnProperty(articleId)
  );
  if (isAlreadySaved) {
    var indexSavedEntry = savedArticles.findIndex((obj) =>
      obj.hasOwnProperty(articleId)
    );
    savedArticles.splice(indexSavedEntry, 1);
    saveButton.addClass("is-outlined");
    saveButton.css("background-color", "transparent");
    saveButton.attr("data-saved", "no");
    localStorage.removeItem(buttonId);
  } else {
    savedArticles.unshift({ [articleId]: favArticleHtml });
    saveButton.removeClass("is-outlined");
    saveButton.css("background-color", "red");
    saveButton.attr("data-saved", "yes");
    localStorage.setItem(buttonId, "saved");
  }
  localStorage.setItem("savedArticles", JSON.stringify(savedArticles));
}

var prevArticle = null;
var articleColumn = $(".column");
var checkUserRead = false; //Checks if the user clicked the 'read more' button to view the full article

articleColumn.on("click", ".card", playCardAudio);
function playCardAudio(event) {
  event.stopImmediatePropagation();
  const articleDesc = $(event.currentTarget).find(".description").text();
  var currentArticle = $(this);

  //Keeps audio playing if user clicks on the saveBtn while listening to the audio
  if (
    $(event.target).is("button.saveBtn") ||
    $(event.target).is("button.saveBtn img")
  ) {
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

  /*Checks if the user clicked the same article as the previous click. If its the same article but the audio
    was completed or the user clicked on 'read more' link, then it replays the audio. Otherwise, it pauses the audio
    when the user clicks the same article*/
  if (prevArticle === $(currentArticle)[0]) {
    if (audio.ended || checkUserRead) {
      checkUserRead = false;
      audio = null;
      fetchTTS(articleDesc);
    } else {
      audio.pause();
      audio = null;
    }
    prevArticle = null;
  } else {
    /* If the user clicked a different article, then it stops the audio of the last article and plays
      the audio of the new article */
    if (prevArticle) {
      audio.pause();
      audio = null;
    }
    fetchTTS(articleDesc);
    prevArticle = $(currentArticle)[0];
  }
}

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
