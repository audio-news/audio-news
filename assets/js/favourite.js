function displaySavedArticles() {
    var favColumn = $("#favourites");
    var savedArticles = JSON.parse(localStorage.getItem("user_fav_articles"));
    if (savedArticles == null) {
      savedArticles = [];
    }

    for (var i = 0; i < savedArticles.length;i++){
        favColumn.append(savedArticles[i]);
    }
}

displaySavedArticles();