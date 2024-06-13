const server = require("./src/app");

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
