var userTopicForm = $();
var userTopicSelect = $();

function userFormSubmit(event) {
  event.preventDefault();

  const topic = userTopicSelect.val();
  if (topic) {
    getNewsArticles(topic);
    topic.val("");
  } else {
    alert("Please enter a topic");
  }
}
