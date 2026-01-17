export const onRequest = async (context, next) => {
    const response = await next();

    // Allow Iframes (Widget)
    response.headers.delete('X-Frame-Options'); // Remove blocking header
    response.headers.set('Content-Security-Policy', "frame-ancestors *"); // Allow all

    // CORS (for font loading or api calls)
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
};
