import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
  typescript: {
    // ignoreBuildErrors: true,
  },
  webpack: (config, { dev, isServer }) => {
    // Restrict file system access to project directory only
    const projectRoot = process.cwd();
    
    // Configure webpack to only scan project files
    config.resolve = {
      ...config.resolve,
      symlinks: false,
      // Restrict module resolution to project and node_modules
      modules: [
        path.resolve(projectRoot, 'node_modules'),
        'node_modules'
      ]
    };
    
    // Enhanced watch options to prevent system directory scanning
    config.watchOptions = {
      ...config.watchOptions,
      ignored: /node_modules|\.git|C:\\Users\\.*\\Application Data|C:\\Users\\.*\\Cookies|C:\\Users\\.*\\AppData|C:\\Windows|C:\\Program Files/,
      // Limit polling and aggregation
      aggregateTimeout: 300,
      poll: false
    };
    
    // Restrict snapshot resolution to project files only
    if (config.snapshot) {
      config.snapshot.managedPaths = [
        path.resolve(projectRoot, 'node_modules')
      ];
      config.snapshot.immutablePaths = [];
    }
    
    // Configure file system plugin if present
    if (config.plugins) {
      config.plugins.forEach((plugin: any) => {
        if (plugin.constructor.name === 'WatchIgnorePlugin') {
          plugin.paths = [
            /node_modules/,
            /\.git/,
            /C:\\Users\\[^\\]+\\Application Data/,
            /C:\\Users\\[^\\]+\\Cookies/,
            /C:\\Users\\[^\\]+\\AppData/,
            /C:\\Windows/,
            /C:\\Program Files/
          ];
        }
      });
    }
    
    return config;
  },
};

export default nextConfig;
