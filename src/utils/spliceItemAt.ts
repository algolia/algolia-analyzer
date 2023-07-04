export const spliceItemAt = <T = any, U = undefined>(
  array: T[],
  index: number,
  defaultValue: U
): {
  array: T[];
  item: T | U;
} => {
  if (array.length < index + 1) return { array, item: defaultValue };

  const item = array.splice(index, 1)[0];
  return { array, item };
};
