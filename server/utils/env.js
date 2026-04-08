const cleanEnvValue = (value, fallback = '') => {
  if (value === undefined || value === null) return fallback;
  return String(value)
    .trim()
    .replace(/^['"]|['"]$/g, '')
    .replace(/^Value:\s*/i, '');
};

module.exports = { cleanEnvValue };
