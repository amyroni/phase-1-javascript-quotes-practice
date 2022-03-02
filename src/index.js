document.addEventListener("DOMContentLoaded", function() {
  loadQuotes();
  createQuote();
})

function loadQuotes() {
  fetch("http://localhost:3000/quotes?_embed=likes")
  .then(response => response.json())
  .then(quotes => quotes.forEach(quote => showQuote(quote)))
}

function showQuote(quote) {
  const card = document.createElement("li");
  card.className = "quote-card";
  card.id = `quote-${quote.id}`;
  const blockquote = document.createElement("blockquote");
  blockquote.className = "blockquote";
  const quoteText = document.createElement("p");
  quoteText.textContent = quote.quote;
  const signature = document.createElement("footer");
  signature.className = "blockquote-footer";
  signature.textContent = quote.author;
  const br = document.createElement("br");

  const likeBtn = document.createElement("button");
  const likes = document.createElement("span");
  if (quote.likes) {
    likes.textContent = quote.likes.length;
  } else { likes.textContent = 0 }
  likeBtn.textContent = "Likes: ";
  likeBtn.append(likes);
  likeBtn.addEventListener("click", () => updateLikes(quote));

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => editQuote(quote));


  const deleteBtn = document.createElement("button");
  deleteBtn.className = "btn-danger";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => deleteQuote(quote));

  blockquote.append(quoteText, signature, br, likeBtn, editBtn, deleteBtn);
  card.append(blockquote);
  document.querySelector("#quote-list").append(card);
}

function createQuote() {
  const form = document.querySelector("#new-quote-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        quote: document.querySelector("#new-quote").value,
        author: document.querySelector("#author").value
      })
    })
    .then(response => response.json())
    .then(quote => showQuote(quote))
    form.reset();
  })
}

function deleteQuote(quote) {
  document.querySelector(`#quote-${quote.id}`).remove();
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    }
  })
  .then(response => response.json())
  .then(data => console.log(data))
}

function updateLikes(quote) {
  const quoteCard = document.querySelector(`#quote-${quote.id}`);
  const likes = quoteCard.querySelector("span");
  likes.textContent = parseInt(likes.textContent) + 1; 
  fetch("http://localhost:3000/likes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      quoteId: quote.id,
      createdAt: Math.floor(Date.now() / 1000)
    })
  })
}

function editQuote(quote) {
  const form = document.createElement("form");
  const quoteInput = document.createElement("input");
  quoteInput.id = "edit-quote";
  quoteInput.value = quote.quote;
  const authorInput = document.createElement("input");
  authorInput.id = "edit-author";
  authorInput.value = quote.author;
  const submitEdit = document.createElement("button")
  submitEdit.textContent = "Submit";
  submitEdit.addEventListener("click", (event) => {
    event.preventDefault();
    saveEdit(quote, quoteInput.value, authorInput.value)
  })

  form.append(quoteInput, authorInput, submitEdit);
  document.querySelector(`#quote-${quote.id}`).append(form);
}

function saveEdit(quote, newQuote, newAuthor) {
  console.log(quote)
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify({
      quote: newQuote,
      author: newAuthor
    })
  })
  .then(response => response.json())
  .then(quote => {
    location.reload();
  })
}