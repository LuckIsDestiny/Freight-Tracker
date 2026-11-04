export const buildUpdatePayload = <T extends Object, S extends Object>(
  updatePayload: T,
  data: S,
): T => {
  for (let [key, value] of Object.entries(data)) {
    if (value !== undefined) {
      updatePayload[key as keyof T] = value;
    }
  }
  return updatePayload;
};

