export const isValidHttpUrl = (url: string) => {
  try {
    const urlObject = new URL(url);
    return urlObject.protocol === "http:" || urlObject.protocol === "https:";
  } catch (err) {
    return false;
  }
};

export const isValidJellyfishWebhookUrl = (url: string) => {
  const isValidUrl = isValidHttpUrl(url);
  if (!isValidUrl) return false;

  try {
    const { pathname, origin } = new URL(url);
    return url !== origin || pathname !== "/";
  } catch {
    return false;
  }
};
