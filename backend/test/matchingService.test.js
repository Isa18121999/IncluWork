const test = require("node:test");
const assert = require("node:assert/strict");
const calculateMatch = require("../src/services/matchingService");

test("calcula compatibilidad sin distinguir mayúsculas", () => {
  const result = calculateMatch({ name: "Ana", skills: ["JavaScript", "Accesibilidad"] }, { requirements: ["javascript", "React"] });
  assert.equal(result.score, 50);
  assert.deepEqual(result.matchedSkills, ["javascript"]);
});

test("una oferta sin requisitos no genera división por cero", () => {
  assert.equal(calculateMatch({ name: "Ana", skills: ["React"] }, { requirements: [] }).score, 0);
});
