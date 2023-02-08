function displaySavedArticles() {
    var favColumn = $("#favourites .column");

    const savedArticles = JSON.parse(localStorage.getItem("savedArticles")) || [];

    savedArticles.forEach(article => {
        favColumn.append($(Object.values(article)[0]));
    });
    console.log(favColumn[0].outerHTML)
}

displaySavedArticles();