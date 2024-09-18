/**
 * Initializes the connection to the server using Socket.io.
 * @type {SocketIOClient.Socket}
 */
var socket = io();

/**
 * Reference to the HTML element that displays chat messages.
 * @type {HTMLElement}
 */
var messages = document.getElementById("messages");

/**
 * Reference to the HTML input element for typing messages.
 * @type {HTMLInputElement}
 */
var messageInput = document.getElementById("message");

/**
 * Reference to the HTML element that displays typing notifications.
 * @type {HTMLElement}
 */
var typing = document.getElementById("typing");

/**
 * Handles the form submission to send a chat message.
 * Prevents the default form submission behavior, creates a new list item
 * and span for the message, appends them to the messages list, and emits
 * the message to the server.
 * @param {Event} e - The form submission event.
 */
document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault(); // prevents page reloading

  console.log(messageInput.value, "Here");

  if (!messageInput.value.trim()) {
    return;
  }


  console.log("Stop", messageInput.value.length)

  let li = document.createElement("li");
  li.textContent = messageInput.value;

  let span = document.createElement("span");
  span.textContent = "by Anonymous: just now";

  messages.appendChild(li);
  messages.appendChild(span);

  socket.emit("chat message", messageInput.value);
  messageInput.value = "";
});

/**
 * Handles the reception of a new chat message from the server.
 * Creates a new list item and span for the received message, appends them
 * to the messages list.
 * @param {Object} data - The data object containing the message.
 * @param {string} data.message - The content of the received message.
 */
socket.on("received", data => {
  let li = document.createElement("li");
  li.textContent = data.message;

  let span = document.createElement("span");
  span.textContent = "by anonymous: just now";

  messages.appendChild(li);
  messages.appendChild(span);
});

/**
 * Fetches initial chat messages from the server and displays them in
 * the messages list.
 * @returns {Promise<void>}
 */
fetch("/chats")
  .then(response => response.json())
  .then(json => {
    json.forEach(data => {
      let li = document.createElement("li");
      li.textContent = data.message;

      let span = document.createElement("span");
      span.textContent = "by " + data.sender + ": " + formatTimeAgo(data.createdAt);

      messages.appendChild(li);
      messages.appendChild(span);
    });
  });

/**
 * Emits a typing notification to the server when the user is typing.
 */
messageInput.addEventListener("keypress", () => {
  socket.emit("typing", { user: "Someone", message: "is typing..." });
});

/**
 * Updates the typing notification element with the typing status
 * received from the server.
 * @param {Object} data - The data object containing the typing notification.
 * @param {string} data.user - The user who is typing.
 * @param {string} data.message - The typing status message.
 */
socket.on("notifyTyping", data => {
  typing.textContent = data.user + " " + data.message;
  console.log(data.user + data.message);
});

/**
 * Emits a stop typing notification to the server when the user stops typing.
 */
messageInput.addEventListener("keyup", () => {
  socket.emit("stopTyping", "");
});

/**
 * Clears the typing notification element when the server sends a stop typing event.
 */
socket.on("notifyStopTyping", () => {
  typing.textContent = "";
});
