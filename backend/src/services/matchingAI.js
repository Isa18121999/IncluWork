function calculateMatch(candidate, job) {
  const skills = candidate.skills || [];
  const requirements = job.requirements || [];

  const matches = skills.filter((skill) =>
    requirements.map(r => r.toLowerCase()).includes(skill.toLowerCase())
  ).length;

  const score = requirements.length
    ? Math.round((matches / requirements.length) * 100)
    : 0;

  return {
    score,
    reasons: matches > 0
      ? ["Coincidencia de habilidades profesionales"]
      : ["Necesita mayor compatibilidad de requisitos"]
  };
}

module.exports = { calculateMatch };
