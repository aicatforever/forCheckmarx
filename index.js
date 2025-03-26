const express = require("express");
const bodyParser = require("body-parser");
const app = express();

let comments = []; // Stores comments (⚠️ Vulnerable to Stored XSS)

app.use(bodyParser.urlencoded({ extended: false }));

// Serve HTML page
app.get("/", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Vulnerable Web App</title>
    </head>
    <body>

        <h1>Search</h1>
        <form method="GET" action="/">
            <input type="text" name="query">
            <button type="submit">Search</button>
        </form>
        <p>Results: <script>document.write(decodeURIComponent(location.search.split('=')[1]));</script></p> <!-- 🚨 Reflected XSS -->

        <h2>Comments</h2>
        <form method="POST" action="/comment">
            <input type="text" name="comment" required>
            <button type="submit">Submit</button>
        </form>
        <ul>
            ${comments.map(comment => `<li>${comment}</li>`).join("")} <!-- 🚨 Stored XSS -->
        </ul>

        <script>
            let urlParams = new URLSearchParams(window.location.search);
            document.getElementById("result").innerHTML = urlParams.get("query"); // 🚨 DOM-Based XSS
        </script>

    </body>
    </html>
    `);
});

// Handle user comments (🚨 No sanitization = Stored XSS)
app.post("/comment", (req, res) => {
    comments.push(req.body.comment);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Vulnerable web app running on http://localhost:3000");
});
