module.exports = {
    'secret': 'rutledge_team',
    'localhost': '127.0.0.1',
    'api_port': 9009,
    "db_conn": {
        "development": {
            connectionLimit: 100,
            host: '172.16.0.68',
            user: 'dev',
            password: 'dev123',
            database: 'people_device_iot',
            debug: false
        }
    }
};
