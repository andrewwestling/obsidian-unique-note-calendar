/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/**/*.tsx"],
	important: ".use-tailwind",
	theme: {
		extend: {
			height: {
				/**
				 * `screen-minus-header`
				 *
				 * This is for determining the height of the sidebar content container
				 *
				 * Notes:
				 * - The `.view-content` on the container adds padding of `--size-4-4` all the way around so this accounts for that
				 * - The app's header's height is also included in `100vh` so we are subtracting `--header-height` as well
				 * */
				"screen-minus-header":
					"calc(100vh - var(--header-height) - calc(var(--size-4-4) * 2))",

				/**
				 * `screen-mobile-custom`
				 *
				 * This is a hack for the screen height on the sidebar on my iPhone
				 *
				 * Notes:
				 * - It seems like the header height at the top can be dynamic, based on how many lines the current note's title is
				 * - Additionally, the sidebar can be opened in an "expanded" mode which disregards the header height (so this will be wrong)
				 * - I'm just setting it to something sensible for now, it's not perfect but it's good enough to prevent double scrollbars
				 * */
				"screen-mobile-custom": "75vh",
			},
		},
		colors: {
			/**
			 * `accent`
			 *
			 * For using Obsidian's default "accent" color
			 */
			accent: "var(--text-accent)",
			/**
			 * `hr-color`
			 *
			 * For using Obsidian's default color for horizontal rules
			 */
			"hr-color": "var(--hr-color)",
		},
	},
	plugins: [],
	corePlugins: {
		preflight: false,
	},
};
