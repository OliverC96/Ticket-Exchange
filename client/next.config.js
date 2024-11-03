module.exports = {
    webpack: (config) => {
        config.watchOptions.poll = 300;
        config.infrastructureLogging = { debug: /PackFileCache/ }
        return config;
    },
};