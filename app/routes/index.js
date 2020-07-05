var express = require("express");
var router = express.Router();

function simplify(text) {
  const separators = /[\s,\.;:\(\)\-'\+]/g;
  const diacritics = /[\u0300-\u036f]/g;
  //capitalização e normalização
  text = text.toUpperCase().normalize("NFD").replace(diacritics, "");
  //separando e removendo repetidos
  const arr = text
    .split(separators)
    .filter((item, pos, self) => self.indexOf(item) == pos);
  console.log(arr);
  //removendo nulls, undefineds e strings vazias
  return arr.filter((item) => item);
}

/* GET home page. */
router.get("/", function (req, res, next) {
  if (!req.query.q)
    return res.render("index", {
      title: "Motor de Busca",
      movies: [],
      query: "",
    });
  else {
    const query = simplify(req.query.q);
    const mongoClient = require("mongodb").MongoClient;
    mongoClient
      .connect("mongodb://localhost:27017")
      .then((conn) => conn.db("mongoflix"))
      .then((db) => db.collection("movies2").find({ tags: { $all: query } }))
      .then((cursor) => cursor.toArray())
      .then((movies) => {
        return res.render("index", {
          title: "Motor de Busca",
          movies,
          query: req.query.q,
        });
      });
  }
});

module.exports = router;
