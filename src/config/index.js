let databaseURL;

if (process.env.NODE_ENV === 'production') {
    databaseURL = "https://api-eventos-ispb.onrender.com";
} else {
    databaseURL = "http://localhost:3000";
}

export { databaseURL };
