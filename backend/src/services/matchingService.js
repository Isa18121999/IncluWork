const normalize = value => String(value || "").trim().toLowerCase();

const calculateMatch = (candidate, job) => {
  const candidateSkills = [...new Set((candidate.skills || []).map(normalize).filter(Boolean))];
  const requirements = [...new Set((job.requirements || []).map(normalize).filter(Boolean))];
  const matchedSkills = requirements.filter(requirement => candidateSkills.includes(requirement));
  const missingSkills = requirements.filter(requirement => !candidateSkills.includes(requirement));
  const score = requirements.length ? Math.round((matchedSkills.length / requirements.length) * 100) : 0;

  return {
    candidate: candidate.name,
    score,
    matchedSkills,
    missingSkills,
    reasons: requirements.length
      ? [`${matchedSkills.length} de ${requirements.length} habilidades requeridas coinciden`]
      : ["La oferta no tiene requisitos de habilidades registrados"]
  };
};

module.exports = calculateMatch;
