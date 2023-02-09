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