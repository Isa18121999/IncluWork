const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '\-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\d{7,15}$/;
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const validateName = (value) => NAME_REGEX.test(String(value || "").trim());
const validateEmail = (value) => EMAIL_REGEX.test(String(value || "").trim().toLowerCase());
const validatePhone = (value) => PHONE_REGEX.test(String(value || "").trim());
const validatePassword = (value) => PASSWORD_REGEX.test(String(value || ""));

module.exports = {
  NAME_REGEX,
  EMAIL_REGEX,
  PHONE_REGEX,
  PASSWORD_REGEX,
  validateName,
  validateEmail,
  validatePhone,
  validatePassword
};
