const isEmpty = (value: string) => {
  return value.length === 0 || !value.trim();
};

export default {
  isEmpty,
};
