import cssVars from 'css-vars-ponyfill';

window.cssVars = cssVars;
cssVars({
  silent: !IN_SANDBOX,
  watch: true,
  preserveStatic: false,
});