export function ensureMinimumLoadingTime(ms?: number) {
  const startTime = Date.now();
  const minimumLoadingTime = ms || 2000;

  return new Promise<void>((resolve, reject) => {
    const elapsedTime = Date.now() - startTime;
    if (elapsedTime < minimumLoadingTime) {
      setTimeout(() => {
        resolve();
      }, minimumLoadingTime - elapsedTime);
    } else {
      resolve();
    }
  });
}
