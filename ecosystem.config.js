module.exports = {
    apps: [
        {
            name: "model_service_grpc_server",
            script: "./dist/main.js",
            args: "--start_grpc_server",
            instances: 2,
            instance_var: "NODE_ID",
        },
    ],
};
