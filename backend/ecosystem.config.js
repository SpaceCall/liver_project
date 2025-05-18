module.exports = {
    apps: [
        {
            name: 'hospital-backend',
            script: 'dist/main.js',
            instances: 'max',
            exec_mode: 'cluster',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,

                // База данных PostgreSQL
                DATABASE_HOST: process.env.DATABASE_HOST || 'localhost',
                DATABASE_PORT: process.env.DATABASE_PORT || '5432',
                DATABASE_USER: process.env.DATABASE_USER || 'hospital_user',
                DATABASE_PASSWORD: process.env.DATABASE_PASSWORD || 'yourpassword',
                DATABASE_NAME: process.env.DATABASE_NAME || 'hospital_db',

                // JWT
                JWT_SECRET: process.env.JWT_SECRET || 'top-secret-key',

                // URL до сервера модели
                MODEL_API_URL: process.env.MODEL_API_URL || 'http://model:3003',
            },
        },
    ],
};
