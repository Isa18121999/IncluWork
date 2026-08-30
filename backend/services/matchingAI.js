function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function calculateMatch(candidate, job) {
  const candidateSkills = (candidate.skills || []).map(normalize);
  const requiredSkills = (job.skillsRequired || []).map(normalize).filter(Boolean);

  const matchedSkills = requiredSkills.filter((skill) => candidateSkills.includes(skill));
  const skillsScore = requiredSkills.length
    ? (matchedSkills.length / requiredSkills.length) * 40
    : 0;

  let score = skillsScore;
  const reasons = [];

  if (matchedSkills.length) {
    reasons.push(`Coincide en ${matchedSkills.length} habilidad(es) requerida(s)`);
  }

  if (Number(candidate.experience || 0) >= Number(job.experienceRequired || 0)) {
    score += 25;
    reasons.push("Cumple con la experiencia requerida");
  }

  if (normalize(candidate.workPreference?.modality) === normalize(job.modality)) {
    score += 15;
    reasons.push("La modalidad laboral es compatible");
  }

  const needs = (candidate.accessibilityNeeds || []).map(normalize);
  const provided = (job.accessibilityProvided || []).map(normalize);
  if (needs.length && needs.some((need) => provided.includes(need))) {
    score += 10;
    reasons.push("Existe compatibilidad de accesibilidad");
  }

  if (candidate.education && String(candidate.education).trim()) {
    score += 10;
    reasons.push("Cuenta con formación registrada");
  }

  return {
    score: Math.min(100, Math.round(score)),
    reasons,
    matchedSkills,
  };
}

module.exports = { calculateMatch };
