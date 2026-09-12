const normalize = value => String(value || "").trim().toLowerCase();

const uniqueNormalized = values => [...new Set((values || []).map(normalize).filter(Boolean))];

const modalityScore = (candidateValue, jobValue) => {
  const candidate = normalize(candidateValue);
  const job = normalize(jobValue);
  if (!job) return null;
  if (!candidate) return 0;

  const aliases = {
    remoto: "remoto",
    remote: "remoto",
    híbrido: "hibrido",
    hibrido: "hibrido",
    hybrid: "hibrido",
    presencial: "presencial",
    onsite: "presencial"
  };

  return aliases[candidate] && aliases[candidate] === aliases[job] ? 100 : 0;
};

const educationScore = (candidateValue, jobValue) => {
  const candidate = normalize(candidateValue);
  const job = normalize(jobValue);
  if (!job) return null;
  if (!candidate) return 0;
  if (candidate === job || candidate.includes(job) || job.includes(candidate)) return 100;

  const levels = [
    ["doctorado", 5],
    ["maestria", 4],
    ["magister", 4],
    ["posgrado", 4],
    ["universitario", 3],
    ["licenciatura", 3],
    ["tecnico", 2],
    ["tecnica", 2],
    ["secundaria", 1]
  ];
  const candidateLevel = levels.find(([term]) => candidate.includes(term))?.[1] || 0;
  const jobLevel = levels.find(([term]) => job.includes(term))?.[1] || 0;
  return candidateLevel >= jobLevel && jobLevel > 0 ? 100 : 0;
};

const experienceScore = (candidateValue, jobValue) => {
  const required = Number(jobValue);
  if (!Number.isFinite(required) || required <= 0) return null;
  const candidate = Math.max(0, Number(candidateValue) || 0);
  return Math.min(100, Math.round((candidate / required) * 100));
};

const overlapScore = (candidateValues, requiredValues) => {
  const required = uniqueNormalized(requiredValues);
  if (!required.length) return null;
  const candidate = uniqueNormalized(candidateValues);
  const matched = required.filter(item => candidate.includes(item));
  return { score: Math.round((matched.length / required.length) * 100), matched };
};

const calculateMatch = (candidate, job) => {
  const skillResult = overlapScore(candidate.skills, job.requirements);
  const accessibilityResult = overlapScore(candidate.accessibility, job.accessibility);
  const experience = experienceScore(candidate.experience, job.experienceRequired);
  const education = educationScore(candidate.education, job.educationRequired);
  const modality = modalityScore(candidate.modality, job.modality);

  const criteria = [
    { key: "skills", weight: 50, score: skillResult?.score },
    { key: "experience", weight: 20, score: experience },
    { key: "education", weight: 10, score: education },
    { key: "modality", weight: 10, score: modality },
    { key: "accessibility", weight: 10, score: accessibilityResult?.score }
  ].filter(item => item.score !== null && item.score !== undefined);

  const totalWeight = criteria.reduce((sum, item) => sum + item.weight, 0);
  const score = totalWeight
    ? Math.round(criteria.reduce((sum, item) => sum + item.score * item.weight, 0) / totalWeight)
    : 0;

  const breakdown = Object.fromEntries(criteria.map(item => [item.key, item.score]));
  const matchedSkills = skillResult?.matched || [];
  const missingSkills = skillResult
    ? uniqueNormalized(job.requirements).filter(requirement => !matchedSkills.includes(requirement))
    : [];
  const matchedAccessibility = accessibilityResult?.matched || [];
  const missingAccessibility = accessibilityResult
    ? uniqueNormalized(job.accessibility).filter(item => !matchedAccessibility.includes(item))
    : [];

  return {
    candidate: candidate.name,
    score,
    breakdown,
    matchedSkills,
    missingSkills,
    matchedAccessibility,
    missingAccessibility,
    reasons: [
      `${matchedSkills.length} de ${uniqueNormalized(job.requirements).length} habilidades requeridas coinciden`,
      experience !== null ? `Experiencia: ${experience}%` : "Experiencia no especificada por la oferta",
      education !== null ? `Educación: ${education}%` : "Educación no especificada por la oferta",
      modality !== null ? `Modalidad: ${modality}%` : "Modalidad no especificada por la oferta",
      accessibilityResult !== null ? `Accesibilidad: ${accessibilityResult?.score || 0}%` : "Accesibilidad no especificada por la oferta"
    ]
  };
};

module.exports = calculateMatch;
