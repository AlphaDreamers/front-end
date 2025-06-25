const nextConfig = {
    /* config options here */
    images: {
        remotePatterns: [
            //TODO - delete this when we have a real image
            {
                protocol: "https",
                hostname: "**",
                port: "",
                pathname: "/**",
            },
        ],
    },
    typescript: {
        // !! WARN !!
        // Dangerously allow production builds to successfully complete even if
        // your project has type errors.
        // !! WARN !!
        ignoreBuildErrors: true,
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
    },
};
export default nextConfig;
