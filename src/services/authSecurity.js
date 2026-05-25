const LOGIN_SECURITY_KEY = "petworld_login_security";
const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME_MS = 60 * 1000;
const MAX_EMAIL_LENGTH = 254;
const MAX_NAME_LENGTH = 80;
const MAX_PHONE_LENGTH = 25;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

const getNow = () => Date.now();

const readSecurityState = () => {
  try {
    const raw = sessionStorage.getItem(LOGIN_SECURITY_KEY);
    if (!raw) {
      return { failedAttempts: 0, lockedUntil: 0 };
    }

    const parsed = JSON.parse(raw);
    return {
      failedAttempts: Number(parsed.failedAttempts) || 0,
      lockedUntil: Number(parsed.lockedUntil) || 0
    };
  } catch {
    return { failedAttempts: 0, lockedUntil: 0 };
  }
};

const writeSecurityState = (state) => {
  sessionStorage.setItem(LOGIN_SECURITY_KEY, JSON.stringify(state));
};

export const getLoginLockInfo = () => {
  const state = readSecurityState();
  const now = getNow();

  if (state.lockedUntil > now) {
    return {
      isLocked: true,
      remainingMs: state.lockedUntil - now,
      failedAttempts: state.failedAttempts
    };
  }

  if (state.lockedUntil && state.lockedUntil <= now) {
    writeSecurityState({ failedAttempts: 0, lockedUntil: 0 });
  }

  return { isLocked: false, remainingMs: 0, failedAttempts: 0 };
};

export const registerFailedLoginAttempt = () => {
  const state = readSecurityState();
  const nextAttempts = state.failedAttempts + 1;

  if (nextAttempts >= MAX_FAILED_ATTEMPTS) {
    writeSecurityState({
      failedAttempts: nextAttempts,
      lockedUntil: getNow() + LOCK_TIME_MS
    });
    return { isLocked: true, attempts: nextAttempts };
  }

  writeSecurityState({ failedAttempts: nextAttempts, lockedUntil: 0 });
  return { isLocked: false, attempts: nextAttempts };
};

export const clearFailedLoginAttempts = () => {
  writeSecurityState({ failedAttempts: 0, lockedUntil: 0 });
};

export const getRemainingAttempts = () => {
  const state = readSecurityState();
  const remaining = MAX_FAILED_ATTEMPTS - state.failedAttempts;
  return remaining > 0 ? remaining : 0;
};

export const getLockTimeSeconds = () => Math.floor(LOCK_TIME_MS / 1000);

export const sanitizeTextInput = (value, maxLength = 120) => {
  const cleaned = String(value || "")
    .split("")
    .filter((char) => {
      const code = char.charCodeAt(0)
      return code >= 32 && code !== 127
    })
    .join("")
    .replace(/\s+/g, " ")
    .trim();

  return cleaned.slice(0, maxLength);
};

export const normalizeEmail = (value) =>
  sanitizeTextInput(value, MAX_EMAIL_LENGTH).toLowerCase();

const hasInjectionLikePattern = (value) => {
  const text = String(value || "").toLowerCase();
  return /(<script|javascript:|onerror=|onload=|\bunion\b|\bselect\b|\bdrop\b|\binsert\b|\bdelete\b|--|\/\*)/.test(text);
};

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email) && email.length <= MAX_EMAIL_LENGTH;

export const validateLoginInput = (email, password) => {
  const cleanEmail = normalizeEmail(email);
  const cleanPassword = String(password || "");

  if (!cleanEmail || !cleanPassword) {
    return { valid: false, message: "Completa correo y contrasena." };
  }

  if (!isValidEmail(cleanEmail)) {
    return { valid: false, message: "El correo no tiene un formato valido." };
  }

  if (cleanPassword.length < MIN_PASSWORD_LENGTH || cleanPassword.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, message: `La contrasena debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres.` };
  }

  if (hasInjectionLikePattern(cleanEmail)) {
    return { valid: false, message: "Entrada no permitida." };
  }

  return { valid: true, email: cleanEmail, password: cleanPassword };
};

export const validateRegisterInput = ({ nombre, email, password, confirmPassword, telefono }) => {
  const cleanNombre = sanitizeTextInput(nombre, MAX_NAME_LENGTH);
  const cleanEmail = normalizeEmail(email);
  const cleanTelefono = sanitizeTextInput(telefono, MAX_PHONE_LENGTH);
  const cleanPassword = String(password || "");
  const cleanConfirmPassword = String(confirmPassword || "");

  if (!cleanNombre || cleanNombre.length < 3) {
    return { valid: false, message: "El nombre debe tener al menos 3 caracteres." };
  }

  if (!isValidEmail(cleanEmail)) {
    return { valid: false, message: "El correo no tiene un formato valido." };
  }

  if (hasInjectionLikePattern(cleanNombre) || hasInjectionLikePattern(cleanEmail)) {
    return { valid: false, message: "Entrada no permitida." };
  }

  if (cleanPassword !== cleanConfirmPassword) {
    return { valid: false, message: "Las contrasenas no coinciden." };
  }

  if (cleanPassword.length < MIN_PASSWORD_LENGTH || cleanPassword.length > MAX_PASSWORD_LENGTH) {
    return { valid: false, message: `La contrasena debe tener entre ${MIN_PASSWORD_LENGTH} y ${MAX_PASSWORD_LENGTH} caracteres.` };
  }

  return {
    valid: true,
    nombre: cleanNombre,
    email: cleanEmail,
    telefono: cleanTelefono,
    password: cleanPassword
  };
};
