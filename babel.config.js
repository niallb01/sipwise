module.exports = function (api) {
  api.cache(true);
  return {
    // presets: ["babel-preset-expo"],
    presets: [
      [
        "babel-preset-expo",
        {
          unstable_transformImportMeta: true,
        },
      ],
    ],
    plugins: ["@babel/plugin-syntax-import-meta"], // ← ADD THIS
  };
};
