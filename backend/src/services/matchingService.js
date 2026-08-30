const calculateMatch = (candidate, job) => {
  const candidateSkills = candidate.skills || [];
  const requirements = job.requirements || [];

  const matches = candidateSkills.filter(skill =>
    requirements.includes(skill)
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
