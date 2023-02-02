var userTopicForm = $();
var userTopicSelect = $();

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