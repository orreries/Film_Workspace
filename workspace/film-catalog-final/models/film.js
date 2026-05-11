const db = require('../database')

exports.all = async () => {
  const { rows } = await db.getPool().query("select * from films order by id");
  return db.camelize(rows);
};

exports.upsert = async (film) => {
  if (film.id) {
    await exports.update(film);
  } else {
    await exports.add(film);
  }
}

exports.add = async (film) => {
  await db.getPool().query("insert into films (title, release_year, director, description, is_analyzed) values ($1, $2, $3, $4, $5);",
    [film.title, film.releaseYear, film.director, film.description, film.isAnalyzed]);
};

exports.update = async (film) => {
  await db.getPool().query("update films set title = $1, release_year = $2, director = $3, description = $4, is_analyzed = $5 where id = $6;",
    [film.title, film.releaseYear, film.director, film.description, film.isAnalyzed, film.id]);
}
exports.get = async (id) => {
  const { rows } = await db.getPool().query("select * from films where id = $1", [id])
  return db.camelize(rows)[0]
}

// exports.allForBook = async (book) => {
//   const { rows } = await db.getPool().query(`
//     select authors.* from authors
//     JOIN authors_books on authors_books.author_id = authors.id
//     where authors_books.book_id = $1;`, [book.id]);
//   return db.camelize(rows);
// }