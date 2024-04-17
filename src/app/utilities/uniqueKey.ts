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
