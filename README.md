# Wonders

A rainmeter-like widget platform powered by Electron.

## Goals

- [ ] Finish the main (settings) window, which should let you load/unload widgets;
- [x] Add automatic widget discovery on development;
- [ ] Add automatic widget discovery on production;
- [ ] Widget hot-reloading;
- [ ] Create typings for widgets;
- [ ] Load TypeScript widgets without the need to compile them to JS; (?)
- [ ] Optimize everything possible and not let Electron devour RAM. Perhaps change it to a better alternative.
- [ ] Documentation;

## How widgets work (for now)
### How to interact?
A widget should return a factory function for the main class.
The function must take the WondersAPI object as well as the UID generated for it each time it's loaded.
You'll need both to interact with Wonders and register windows.
```js
module.exports = (api, uid) => new WidgetClass(api, uid);
```
The exported object has to implement the IWidget interface, although it's not currently enforced via linting.
### Configuration
Your widget folder needs a `wonders.json` file, such as below:
```json
{
    "name": "Lady Dimitrescu",
    "description": "👀",
    "author": "spalato",
    "version": 1.0,
    "entry": "./index.js" // Here's the entry file for your widget.
}
```

## Installation

```
git clone https://github.com/gspalato/wonders
cd wonders
yarn install
yarn start
```
