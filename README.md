# Wonders

A rainmeter-like widget platform powered by Electron.

## Goals

- [] Finish the main (settings) window, which should let you load/unload widgets;
- [] Add automatic widget discovery (both on development and production builds);
- [] Create typings for widgets;
- [] Load TypeScript widgets without the need to compile them to JS;
- [] Optimize everything possible and not let Electron devour RAM. Perhaps change it for a better alternative.
- [] Documentation;

## How widgets work (for now)

A widget is, basically, a NPM package, which returns a factory function for the main class.

```js
module.exports = (Wonders) => new WidgetClass(Wonders);
```

The main widget class has to implement the IWidget interface.
