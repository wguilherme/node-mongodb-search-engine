function simplify(text) {
  //remove these separators
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

function generateTags(movie) {
  let tags = [];
  tags.push(...simplify(movie.title));
  tags.push(movie.year.toString());

  if (movie.cast)
    tags = tags.concat(...movie.cast.map((actor) => simplify(actor)));

  if (movie.countries)
    tags = tags.concat(...movie.countries.map((country) => simplify(country)));

  if (movie.directors)
    tags = tags.concat(
      ...movie.directors.map((director) => simplify(director))
    );

  if (movie.genres)
    tags = tags.concat(...movie.genres.map((genre) => simplify(genre)));
  return tags;
}

function updateMovies(movies) {
  movies.map((movie) => {
    console.log(movie.title);
    movie.tags = generateTags(movie);
    global.conn.collection("movies2").insertOne(movie);
  });
}

function findAllMovies() {
  return global.conn.collection("movies").find({}).toArray();
}

const mongoClient = require("mongodb").MongoClient;
mongoClient
  .connect("mongodb://localhost:27017/mongoflix")
  .then((conn) => {
    global.conn = conn.db("mongoflix");
    return findAllMovies();
  })
  .then((arr) => updateMovies(arr))
  .catch((err) => console.log(err));
