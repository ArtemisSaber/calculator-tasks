# Calculator Tasks

Three independent calculators on one page:

- Text inputs with an operation dropdown
- Text inputs with radio button operations
- Text inputs with increment and decrement buttons

Each calculator supports addition, subtraction, multiplication, and division.
Results update when you click **=** or press **Enter** in a number field.
The increment and decrement buttons change the selected input by exactly one.

## Input and results

Enter signed integers or decimals with a leading zero, such as `-12` or `0.5`.
Shorthand decimals such as `.5` and scientific notation such as `1e3` are rejected.
The calculator uses BigInt arithmetic to preserve precision, including for very
large integers. Noninteger results are displayed as reduced mixed fractions.
Zero results display `0`, and division by zero displays an error.

## Run locally

Open `calculator.html` in a modern browser. No installation or build is required.

The HTML contains the script used by the page. `calculation.ts` and
`calculation.js` are standalone arithmetic sources and are not loaded by the HTML.

## Publishing

Live site: <https://nexus.hoshire.link/calculator-tasks/>

The GitHub Pages workflow runs when `calculator.html` or the workflow changes on
`main`, and can also be started manually from the Actions tab. It copies
`calculator.html` to the published artifact as `index.html`, so there is only one
HTML source to maintain.

The project inherits the custom domain from the account's GitHub user site.

## Reference

The three interaction layouts are based on [Task Calculators](https://binglinggroup.github.io/TaskCalculators/).
