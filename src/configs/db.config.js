const DB_CONFIGS = {
    HOST: process.env.DB_HOST || "localhost",
    PORT: process.env.DB_PORT || 3306,
    USER: process.env.DB_USER || "root",
    PASSWORD: process.env.DB_PASSWORD || "",
    DATABASE: process.env.DB_DATABASE || "toeic",
    CONNECTION_LIMIT: process.env.DB_CONNECTION_LIMIT || 10,
};

module.exports = DB_CONFIGS;
