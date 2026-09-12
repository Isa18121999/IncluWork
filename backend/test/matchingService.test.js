const test = require("node:test");
const assert = require("node:assert/strict");
const calculateMatch = require("../src/services/matchingService");

test("calcula compatibilidad de habilidades sin distinguir mayúsculas", () => {
  const result = calculateMatch(
    { name: "Ana", skills: ["JavaScript", "Accesibilidad"] },
    { requirements: ["javascript", "React"] }
  );
  assert.equal(result.score, 50);
  assert.equal(result.breakdown.skills, 50);
  assert.deepEqual(result.matchedSkills, ["javascript"]);
});

test("integra experiencia, educación y modalidad", () => {
  const result = calculateMatch(
    {
      name: "Ana",
      skills: ["JavaScript", "React"],
      experience: 3,
      education: "Licenciatura en Sistemas",
      modality: "remoto"
    },
    {
      requirements: ["javascript", "react"],
      experienceRequired: 2,
      educationRequired: "licenciatura",
      modality: "remote"
    }
  );
  assert.equal(result.score, 100);
  assert.deepEqual(result.breakdown, { skills: 100, experience: 100, education: 100, modality: 100 });
});

test("integra accesibilidad y calcula faltantes", () => {
  const result = calculateMatch(
    { name: "Luis", skills: ["React"], accessibility: ["lector de pantalla"] },
    { requirements: ["React", "Node.js"], accessibility: ["lector de pantalla", "rampa"] }
  );
  assert.equal(result.breakdown.skills, 50);
  assert.equal(result.breakdown.accessibility, 50);
  assert.equal(result.score, 50);
  assert.deepEqual(result.missingSkills, ["node.js"]);
  assert.deepEqual(result.missingAccessibility, ["rampa"]);
});

test("calcula un match parcial usando los cinco criterios ponderados", () => {
  const result = calculateMatch(
    {
      name: "Sofia",
      skills: ["React"],
      experience: 1,
      education: "Tecnico en Sistemas",
      modality: "presencial",
      accessibility: ["rampa"]
    },
    {
      requirements: ["React", "Node.js"],
      experienceRequired: 2,
      educationRequired: "universitario",
      modality: "remoto",
      accessibility: ["rampa", "lector de pantalla"]
    }
  );
  assert.deepEqual(result.breakdown, {
    skills: 50,
    experience: 50,
    education: 0,
    modality: 0,
    accessibility: 50
  });
  assert.equal(result.score, 40);
});

test("una oferta sin criterios no genera división por cero", () => {
  const result = calculateMatch({ name: "Ana", skills: ["React"] }, {});
  assert.equal(result.score, 0);
  assert.deepEqual(result.breakdown, {});
});
