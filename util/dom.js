export const getParents = (el, parentSelector) => {
  return el.closest(parentSelector);
};
