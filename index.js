const express = require("express");
const server = express();
const db = require("./data/db.js");
const port = 8000;

server.use(express.json());

server.post("/api/users", (req, res) => {
  if (!req.body.name || !req.body.bio) {
    res
      .status(400)
      .json({ errorMessage: "Please provide name and bio for the user." });
  } else {
    db.insert(req.body)
      .then(e => {
        res.status(201).json(e);
      })
      .catch(err => {
        res.status(500).json({ errorMessage: err });
      });
  }
});

server.get("/api/users", (req, res) => {
  db.find()
    .then(re => {
      res.status(200).json(re);
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "The users information could not be retrieved."
      });
    });
});

server.get("/api/users/:id", (req, res) => {
  const id = req.params.id;
  db.findById(id)
    .then(re => {
      if (re === undefined) {
        res.status(404).json({
          errorMessage: "The user with the specified id does not exist."
        });
      } else {
        res.status(200).json(re);
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({ errorMessage: "The user information could not be retrieved." });
    });
});

server.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  db.findById(id)
    .then(e => {
      if (!e) {
        res
          .status(404)
          .json({ message: "The user with the specified ID does not exist." });
      } else if (!req.body.name || !req.body.bio) {
        res
          .status(400)
          .json({ errorMessage: "Please provide name and bio for the user." });
      } else {
        db.update(id, req.body)
          .then(e => {
            res.status(200).json(e);
          })
          .catch(err => {
            res.status(500).json({ errMessage: err });
          });
      }
    })
    .catch(err => {
      res.status(500).json({ errorMessage: err });
    });
});

server.delete("/api/users/:id", (req, res) => {
  db.findById(req.params.id)
    .then(e => {
      if (e === undefined) {
        res
          .status(404)
          .json({
            errorMessage: "The user with the specified ID does not exist."
          });
      } else {
        db.remove(req.params.id)
          .then(e => {
            res.status(200).json(e);
          })
          .catch(err => {
            res
              .status(500)
              .json({ errorMessage: "The user could not be removed." });
          });
      }
    })
    .catch(err => {
      res.send().json({ errorMessage: err });
    });
});

server.listen(port, () => {
  console.log(`***project running on port ${port}`);
});
