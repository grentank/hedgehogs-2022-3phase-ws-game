export const getUserName = (email) => {
  if (email) return email.substr(0, email.indexOf('@'));
  return '';
};
