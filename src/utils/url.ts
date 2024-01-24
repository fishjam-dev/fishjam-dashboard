export const isValidJellyfishWebhookUrl = (url: string) => {
  try {
    const { pathname, origin, protocol } = new URL(url);
    if (!(protocol === "http:" || protocol === "https:")) return false;
    return url !== origin || pathname !== "/";
  } catch {
    return false;
  }
};
