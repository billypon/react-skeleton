const React = require('react');

declare module '*.pug' {
  const template: (params?: { [key: string]: any }) => React.ReactElement;
  export = template;
}
