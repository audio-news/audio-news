//TODO: Add query selector for form in HTML DOM. This is so we can add an event listener for when the form is submitted
var userTopicForm = $();
//TODO: Add query selector for text input in form. This is so we can extract the text inputted by the user
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
