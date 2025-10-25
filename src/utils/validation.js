export function validateEmail(email) {
  return /[^@\s]+@[^@\s]+\.[^@\s]+/.test(String(email).toLowerCase());
}

export function validatePassword(pw) {
  // At least 8 chars, one letter, one number
  return /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+\-={}\[\]:;"'<>?,./]{8,}$/.test(pw);
}

export function validateRequired(value) {
  return value !== undefined && value !== null && String(value).trim().length > 0;
}

export function hasSufficientContrast(bgHex, textHex) {
  // simple contrast estimation using luminance
  function luminance(hex) {
    const c = hex.replace('#', '');
    const r = parseInt(c.substr(0, 2), 16) / 255;
    const g = parseInt(c.substr(2, 2), 16) / 255;
    const b = parseInt(c.substr(4, 2), 16) / 255;
    const a = [r, g, b].map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }
  const L1 = luminance(bgHex) + 0.05;
  const L2 = luminance(textHex) + 0.05;
  const ratio = L1 > L2 ? L1 / L2 : L2 / L1;
  return ratio >= 4.5;
}
