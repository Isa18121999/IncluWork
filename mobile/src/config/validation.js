export const NAME_REGEX = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[ '\-][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*$/;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_REGEX = /^\d{7,15}$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export const sanitizeName = (value) => value.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ '\-]/g, "");
export const sanitizePhone = (value) => value.replace(/\D/g, "").slice(0, 15);
export const validateName = (value) => NAME_REGEX.test(String(value || "").trim());
export const validateEmail = (value) => EMAIL_REGEX.test(String(value || "").trim().toLowerCase());
export const validatePhone = (value) => PHONE_REGEX.test(String(value || "").trim());
export const validatePassword = (value) => PASSWORD_REGEX.test(String(value || ""));
