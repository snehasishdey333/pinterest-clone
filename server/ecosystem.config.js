module.exports = {
    apps: [
      {
        name: "pinterest-clone",
        script: "npm",
        args: "run dev",
        env: {
          NODE_ENV: "development",
        },
      },
    ],
  };