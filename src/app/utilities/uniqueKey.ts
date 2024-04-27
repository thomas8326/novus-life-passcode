export const encodeTimestamp = (timestamp: number): string => {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  const length = chars.length;
  let encoded = '';
  while (timestamp > 0) {
    const remainder = timestamp % length;
    timestamp = Math.floor(timestamp / length);
    encoded = chars[remainder].toString() + encoded;
  }
  return encoded;
};

export const generateSKU = (
  crystalId: string,
  ids: string[],
): Promise<string> => {
  const encoder = new TextEncoder();
  const optionIds = ids.join(':');
  const rawSKU = `${crystalId}:${optionIds}`;
  const data = encoder.encode(rawSKU);
  return crypto.subtle.digest('SHA-256', data).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  });
};
