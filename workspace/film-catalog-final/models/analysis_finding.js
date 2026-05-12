const db = require('../database')

exports.add = async (finding) => {
  await db.getPool().query(
    "insert into analysis_findings (analysis_id, term_id, frequency, context_example, notes) values ($1, $2, $3, $4, $5);",
    [finding.analysisId, finding.termId, finding.frequency, finding.contextExample, finding.notes]);
}

exports.get = async (analysisId, termId) => {
  const { rows } = await db.getPool().query(
    "select * from analysis_findings where analysis_id = $1 and term_id = $2",
    [analysisId, termId]);
  return db.camelize(rows)[0];
}

// joins the analysis to terms to pull the lexical items and definitions alongside the finding data
exports.allForAnalysis = async (analysis) => {
  const { rows } = await db.getPool().query(
    `select analysis_findings.id, terms.lexical_item, terms.definition, analysis_findings.frequency, analysis_findings.context_example, analysis_findings.notes
    from analysis_findings
    join terms on terms.id = analysis_findings.term_id
    where analysis_id = $1`,
    [analysis.id]);
  return db.camelize(rows);
}

exports.update = async (finding) => {
  await db.getPool().query(
    "update analysis_findings set frequency = $1, context_example = $2, notes = $3 where id = $4;",
    [finding.frequency, finding.contextExample, finding.notes, finding.id]);
}

exports.upsert = async (finding) => {
  if (finding.id) {
    await exports.update(finding);
  } else {
    await exports.add(finding);
  }
}