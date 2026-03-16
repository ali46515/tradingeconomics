# React + Vite
# Country Comparison Dashboard

A small, responsive dashboard for comparing country economic indicators using the TradingEconomics data sources. Built with React, Vite, and Tailwind CSS, this project makes it simple to select countries and indicators, visualize trends, and export results for quick analysis.

## Features

- Compare multiple countries across economic indicators.
- Interactive charts and data tables for visual exploration.
- Searchable indicator selector and quick insights panel.
- Download raw data or chart images for reporting.
- Mobile-friendly responsive layout.

## Installation

1. Clone the repository:

	git clone https://github.com/ali46515/tradingeconomics.git

2. Change into the dashboard folder:

	cd country-comparison-dashboard

3. Install dependencies:

	npm install

4. Create or copy environment variables for API access (if needed):

	- See `fetchApi/.env` for expected variables.

## Usage

1. Start the development server:

	npm run dev

2. Open the app in your browser (Vite will show the local URL, usually `http://localhost:5173`).

3. Quick walkthrough:

	- Use the country selector to add one or more countries.
	- Search and pick indicators using the indicator search component.
	- View interactive charts in the ChartCanvas and compare values in the DataTable.
	- Click the download button to export data or charts.

## Contributing

Contributions are welcome. To contribute:

1. Fork the repository and create a feature branch.
2. Make your changes, following the existing code style (React + JSX, Tailwind CSS).
3. Open a pull request with a clear description of your changes.

Please open an issue first if you're planning a larger change so we can discuss the approach.

## License

This project is provided under the MIT License. See the LICENSE file for details.

## Authors & Acknowledgements

- Project maintained by the repository owner.
- Built with: React, Vite, Tailwind CSS.
- Thanks to Trading Economics for providing the underlying data and API.

## Contact

For issues or support, open an issue on the GitHub repository:

https://github.com/ali46515/tradingeconomics

Or contact the maintainers through the repository's issue tracker.

---

If you'd like this README adapted for the repository root or expanded with screenshots and examples, tell me what you'd like included and I will update it.
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
