### This project is _alpha_, some functionality only works under the right conditions or may break during development.

<img align="centre" alt="overlapping arrows" height="92" src="assets/logo.png" />

## _Query_ is a Data Exploration tool and SQL IDE for [mabel](https://github.com/mabel-dev/mabel) datasets

---

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Status](https://img.shields.io/badge/status-alpha-orange)](https://github.com/mabel-dev/query)


- Data **Exploration** using the built-in SQL IDE
- Automatic **vizualization** of data

## Screenshots
<img src="assets/screen-shot.png" height="240px">

## Dependencies

_Query_ is built using:
- **[bootstrap](https://getbootstrap.com/)**
- **[chart.js](https://www.chartjs.org/)**
- **[mabel](https://github.com/mabel-dev/mabel)**
- **[CodeMirror](https://codemirror.net/)**

NOTE: _Query_ currently requires an alpha version of _mabel_, v0.5, which is available using:

~~~
pip install mabelbeta
~~~

## How Can I Contribute?

All contributions, bug reports, bug fixes, documentation improvements,
enhancements, and ideas are welcome.

If you have a suggestion for an improvement or a bug, 
[raise a ticket](https://github.com/mabel-dev/query/issues/new/choose) or start a
[discussion](https://github.com/mabel-dev/query/discussions).

Want to help build mabel? See the [contribution guidance](https://github.com/mabel-dev/query/blob/main/.github/CONTRIBUTING.md).

## Repository Map
~~~
query/
  ├── assets/                <-- Items for this page
  ├── src/
  │     ├── internals/
  │     │     ├── drivers/   <-- Transformers and adapters
  │     │     ├── helpers/   <-- Reused functions
  │     │     └── models/    <-- Pydantic models for API interfaces
  │     ├── routers/         <-- API end-point handlers
  │     ├── static/
  │     │     ├── dist/      <-- Application specific assets (e.g. css, js)
  │     │     └── plugins/   <-- Self-hosted 3rd party assets
  │     └── templates/       <-- HTML assets
  ├── tests/                 <-- Unit and Regression Tests
  └── main.py                <-- application entry-point
~~~

## Licence

[MIT](LICENSE)