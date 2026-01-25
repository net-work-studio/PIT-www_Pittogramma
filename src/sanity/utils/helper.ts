const UPPERCASE_REGEX = /([A-Z])/g;

export const getTitleCase = (name: string) => {
  const titleTemp = name.replace(UPPERCASE_REGEX, " $1");
  return titleTemp.charAt(0).toUpperCase() + titleTemp.slice(1);
};
