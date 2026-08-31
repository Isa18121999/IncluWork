const normalize = value => String(value || "").trim().toLowerCase();

const calculateMatch = (candidate, job) => {
  const candidateSkills = (candidate.skills || []).map(normalize).filter(Boolean);
  const requirements = (job.requirements || []).map(normalize).filter(Boolean);

  const matches = requirements.filter(requirement =>
    candidateSkills.includes(requirement)
  );

  const score = requirements.length
    ? Math.round((matches.length / requirements.length) * 100)
    : 0;

  return {
    candidate: candidate.name,
    score,
    matchedSkills: matches
  };
};

module.exports = calculateMatch;
