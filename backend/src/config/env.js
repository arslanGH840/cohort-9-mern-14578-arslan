const parsePort = (value, fallback) => {
  if (!value || typeof value !== "string" || value.trim() === "") {
    return fallback;
  }
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0 || parsed > 65535) {
    return fallback;
  }
  return parsed;
};
