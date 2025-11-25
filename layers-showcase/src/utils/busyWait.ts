export const busyWait = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};