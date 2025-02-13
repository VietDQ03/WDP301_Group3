module.exports = {
	apps: [
		{
			name: 'rabota-fe',
			script: 'serve',
			exec_mode: 'fork',
			instances: 1,
			autorestart: true,
			watch: false,
			max_memory_restart: '1G',
			env: {
				PM2_SERVE_PATH: 'dist',
				PM2_SERVE_PORT: 3000,
				PM2_SERVE_SPA: 'true',
				PM2_SERVE_HOMEPAGE: '/index.html',
			},
		},
	],
}