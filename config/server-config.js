const env = process.env.NODE_ENV || 'local';

const local = {
    app: {
        port: 3000,
        cors_client_url: 'http://localhost:8080',
    },
    db: {
        url: process.env.DB_URL || 'mongodb://localhost:27017/judge',
    },
    jwt: {
        secret: 'MY_SECRET',
    }
}

const production = {
    app: {
        port: process.env.PORT || 3000,
        request_delay: 0,
    },
    db: {
        url: process.env.DB_URL,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    }
}

const config = {
    local,
    production,
}

module.exports = config[env];