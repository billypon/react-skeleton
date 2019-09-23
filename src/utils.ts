export const logPattern = !localStorage.log ? /^$/ : new RegExp(
  localStorage.log
    .replace(/\*/g, '.*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
);
