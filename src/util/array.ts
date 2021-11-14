export const replaceAt = <T>(array: T[], index: number, value: T): T[] => {
  const newArray = array.slice(0);
  newArray[index] = value;
  return newArray;
};
