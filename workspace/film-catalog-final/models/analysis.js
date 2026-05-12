const db = require('../database')

// the analysis model is like the books model from the in-class demo
// it interacts with a junction table (analysis_findings) the same way the book model does (book_authors)
// so, it needs to have the same add/delete loop structure as the book model

const addFindingsToAnalysis = async (analysis, findingIds) => {
  findingIds.forEach(async findingId => {
    await db.getPool().query(
      "insert into analysis_findings (analysis_id, term_id, frequency, context_example, notes) values ($1, $2, $3, $4, $5);",
      [analysis.id, findingId.termId, findingId.frequency, findingId.contextExample, findingId.notes]);
  });
}

const deleteFindingsForAnalysis = async (analysis) => {
  await db.getPool().query(
    "delete from analysis_findings where analysis_id = $1",
    [analysis.id]);
}

exports.get = async (id) => {
  const { rows } = await db.getPool().query("select * from analyses where id = $1", [id]);
  return db.camelize(rows)[0];
}

exports.add = async (analysis) => {
  const { rows } = await db.getPool().query(
    "insert into analyses (film_id, user_id, analysis_date, notes) values ($1, $2, $3, $4) RETURNING *;",
    [analysis.filmId, analysis.userId, analysis.analysisDate, analysis.notes]);
  let newAnalysis = db.camelize(rows)[0];
  addFindingsToAnalysis(newAnalysis, analysis.findingIds);
  return newAnalysis;
}

exports.update = async (analysis) => {
  const { rows } = await db.getPool().query(
    "update analyses set film_id = $1, user_id = $2, analysis_date = $3, notes = $4 where id = $5 RETURNING *;",
    [analysis.filmId, analysis.userId, analysis.analysisDate, analysis.notes, analysis.id]);
  let newAnalysis = db.camelize(rows)[0];
  deleteFindingsForAnalysis(newAnalysis);
  addFindingsToAnalysis(newAnalysis, analysis.findingIds);
  return newAnalysis;
}

exports.upsert = async (analysis) => {
  if (analysis.findingIds && !Array.isArray(analysis.findingIds)) {
    analysis.findingIds = [analysis.findingIds];
  }
  if (analysis.id) {
    await exports.update(analysis);
  } else {
    await exports.add(analysis);
  }
}

exports.all = async () => {
  const { rows } = await db.getPool().query("select * from analyses order by id");
  return db.camelize(rows);
}