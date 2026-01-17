/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{astro,html,js,jsx,ts,tsx}'],
    theme: {
        extend: {
            colors: {
                jet: {
                    500: '#FF0033',
                    600: '#CC002A',
                    700: '#990021',
                },
                nex: {
                    400: '#FFD500',
                    500: '#FFCC00',
                    600: '#CC9900',
                },
            },
        },
    },
    plugins: [],
};
