/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.tsx"],
	important: ".use-tailwind",
	theme: {
		extend: {
			height: {
				/**
				 * `h-screen-minus-header`
				 *
				 * This is for determining the height of the sidebar content container
				 *
				 * Notes:
				 * - The `.view-content` on the container adds padding of `--size-4-4` all the way around so this accounts for that
				 * - The app's header's height is also included in `100vh` so we are subtracting `--header-height` as well
				 * */
				"screen-minus-header":
					"calc(100vh - var(--header-height) - calc(var(--size-4-4) * 2))",
			},
		},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
};
