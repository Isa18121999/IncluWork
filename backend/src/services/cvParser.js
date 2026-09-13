const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

const SKILLS = [
  "javascript", "typescript", "react", "react native", "node.js", "nodejs", "python", "java", "kotlin",
  "sql", "mongodb", "git", "github", "docker", "aws", "azure", "html", "css", "excel",
  "power bi", "figma", "photoshop", "illustrator", "communication", "leadership", "project management"
];

const ACCESSIBILITY = [
  "rampa", "ascensor", "lector de pantalla", "braille", "lengua de señas", "lenguaje de señas",
  "subtítulos", "subtitulos", "baño accesible", "horario flexible", "teletrabajo", "trabajo remoto"
];

const normalize = (value) => value
  .toLowerCase()
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/\s+/g, " ")
  .trim();

const unique = (items) => [...new Set(items.filter(Boolean))];

function extractPdfText(buffer) {
  const raw = buffer.toString("latin1");
  const texts = [];
  const textRegex = /BT([\s\S]*?)ET/g;
  let block;

  while ((block = textRegex.exec(raw))) {
    const content = block[1];
    const literalRegex = /\((?:\\.|[^\\)])*\)/g;
    let match;
    while ((match = literalRegex.exec(content))) {
      let value = match[0].slice(1, -1)
        .replace(/\\([\\()])/g, "$1")
        .replace(/\\n/g, "\n")
        .replace(/\\r/g, "\r")
        .replace(/\\t/g, "\t");
      texts.push(value);
    }
  }

  return texts.join(" ");
}

function extractDocxText(buffer) {
  const localHeader = Buffer.from([0x50, 0x4b, 0x03, 0x04]);
  const documentName = "word/document.xml";
  let offset = 0;

  while (offset < buffer.length - 30) {
    const header = buffer.indexOf(localHeader, offset);
    if (header < 0 || header + 30 > buffer.length) break;

    const compression = buffer.readUInt16LE(header + 8);
    const compressedSize = buffer.readUInt32LE(header + 18);
    const nameLength = buffer.readUInt16LE(header + 26);
    const extraLength = buffer.readUInt16LE(header + 28);
    const nameStart = header + 30;
    const name = buffer.slice(nameStart, nameStart + nameLength).toString("utf8");
    const dataStart = nameStart + nameLength + extraLength;
    const dataEnd = dataStart + compressedSize;

    if (name === documentName && dataEnd <= buffer.length) {
      const compressed = buffer.slice(dataStart, dataEnd);
      const xml = compression === 0 ? compressed.toString("utf8") : zlib.inflateRawSync(compressed).toString("utf8");
      return xml
        .replace(/<w:tab[^>]*\/>/g, " ")
        .replace(/<w:br[^>]*\/>/g, "\n")
        .replace(/<\/w:p>/g, "\n")
        .replace(/<[^>]+>/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, " ")
        .trim();
    }

    offset = dataEnd;
  }

  throw new Error("No se pudo leer el documento DOCX");
}

function extractText(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (extension === ".pdf") return extractPdfText(buffer);
  if (extension === ".docx") return extractDocxText(buffer);
  return "";
}

function findSkills(text) {
  const normalized = normalize(text);
  return unique(SKILLS.filter((skill) => normalized.includes(normalize(skill))));
}

function findAccessibility(text) {
  const normalized = normalize(text);
  return unique(ACCESSIBILITY.filter((item) => normalized.includes(normalize(item))));
}

function findExperience(text) {
  const normalized = normalize(text);
  const matches = [...normalized.matchAll(/(?:experiencia|experience)[^\n]{0,80}?(\d+)\s*(?:anos|año|years?)/g)];
  if (!matches.length) {
    const generic = [...normalized.matchAll(/(\d+)\s*(?:anos|año|years?)[^\n]{0,30}(?:experiencia|experience)/g)];
    if (!generic.length) return null;
    return Math.max(...generic.map((match) => Number(match[1])));
  }
  return Math.max(...matches.map((match) => Number(match[1])));
}

function findEducation(text) {
  const normalized = normalize(text);
  if (/doctorado|phd|doctor of/.test(normalized)) return "doctorado";
  if (/maestria|master|magister|posgrado/.test(normalized)) return "maestria";
  if (/universitario|licenciatura|bachiller|ingenieria|ingeniero|universidad/.test(normalized)) return "universitario";
  if (/tecnico|tecnica|instituto/.test(normalized)) return "tecnico";
  if (/secundaria|colegio/.test(normalized)) return "secundaria";
  return null;
}

function findModality(text) {
  const normalized = normalize(text);
  if (/presencial|on.?site|in person/.test(normalized)) return "presencial";
  if (/hibrido|hybrid/.test(normalized)) return "hibrido";
  if (/remoto|teletrabajo|remote|home office/.test(normalized)) return "remoto";
  return null;
}

function parseCv(filePath) {
  const text = extractText(filePath);
  if (!text) return { extracted: false, textLength: 0, profile: {} };

  const experience = findExperience(text);
  const education = findEducation(text);
  const modality = findModality(text);
  const skills = findSkills(text);
  const accessibility = findAccessibility(text);

  return {
    extracted: true,
    textLength: text.length,
    profile: {
      ...(experience !== null ? { experience } : {}),
      ...(education ? { education } : {}),
      ...(modality ? { modality } : {}),
      ...(skills.length ? { skills } : {}),
      ...(accessibility.length ? { accessibility } : {})
    }
  };
}

module.exports = { parseCv, extractText };
