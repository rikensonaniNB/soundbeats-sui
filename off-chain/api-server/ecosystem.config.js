module.exports = {
  apps: [
    {
      name: 'sui-game-server',
      script: 'dist/main.js', // Path to the compiled entry file
      instances: 'max', // Number of instances to run (or 'max' to use available CPU cores)
      exec_mode: 'cluster', // Execution mode: 'cluster' for clustering, 'fork' for forking
      autorestart: true, // Automatically restart the app if it crashes
      watch: false, // Enable/disable file watching and restart on file changes
      max_memory_restart: '1G', // Maximum memory threshold for app restart
      env: {
        NODE_ENV: 'production', // Environment variables for your app
        PORT: 3000,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
