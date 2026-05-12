const db = require('../database')

exports.add = async (term) => {
  await db.getPool().query("insert into terms (lexical_item, definition) values ($1, $2);",
      [term.lexicalItem, term.definition]);
}

exports.get = async (id) => {
  const { rows } = await db.getPool().query("select * from terms where id = $1", [id])
    return db.camelize(rows)[0]
}

exports.update = async (term) => {
  await db.getPool().query("update terms set lexical_item = $1, definition = $2 where id = $3;",
      [term.lexicalItem, term.definition, term.id]);
}

exports.upsert = async (term) => {
  if (term.id) {
    await exports.update(term);
  } else {
    await exports.add(term);
  }
}

exports.all = async () => {
  const { rows } = await db.getPool().query("select * from terms order by id");
  return db.camelize(rows);
};