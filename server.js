"use strict";
const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();

const PORT = process.env.PORT || 3000;
const DATA_PATH = path.join(__dirname, "public/data.json");
const PUBLIC_PATH = path.join(__dirname, "public");

app.use(express.static(PUBLIC_PATH));

let users = [];
try {
  const rawData = fs.readFileSync(DATA_PATH);
  users = JSON.parse(rawData);
} catch (err) {
  console.error("Error reading data.json: ", err);
  process.exit(1);
}

app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

app.get("/api/users", (req, res) => {
  res.json(users);
});

app.get("/users/:id", (req, res) => {
  const paramId = parseInt(req.params.id);

  const user = users.find((user) => user.id === paramId);

  // if guard
  if (!user) {
    return res.status(404).send("User not found");
  }

  const userProfile = `
    <h1>${user.name}</h1>
    <p>Email: ${user.email}</p>
    <p>Bio: ${user.bio}</p>
    <p>City: ${user.city}</p>
    <p>Favorite Color: ${user.favoriteColor}</p>
  `;
  res.send(userProfile);
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_PATH, "404.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
