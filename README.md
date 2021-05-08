# Wonders

A rainmeter-like widget platform powered by Electron.

## Goals

- [ ] Finish the main (settings) window, which should let you load/unload widgets;
- [x] Add automatic widget discovery on development;
- [ ] Add automatic widget discovery on production;
- [ ] Widget hot-reloading;
- [ ] Create typings for widgets;
- [ ] Load TypeScript widgets without the need to compile them to JS;
- [ ] Optimize everything possible and not let Electron devour RAM. Perhaps change it to a better alternative.
- [ ] Documentation;

## How widgets work (for now)

A widget is, basically, a NPM package, which returns a factory function for the main class.

```js
module.exports = (Wonders) => new WidgetClass(Wonders);
```

If needed, it can also return an object with a `WONDERS` property: the factory function.

```js
module.exports = { WONDERS: (Wonders) => new WidgetClass(Wonders), ... }
```

The main widget class has to implement the IWidget interface, although it's not currently enforced via linting.

## Installation

```
git clone https://github.com/gspalato/wonders
cd wonders
yarn install
yarn start
```
