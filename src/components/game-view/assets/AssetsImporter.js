// https://stackoverflow.com/a/67326513

const cache = {};

const handleImport = (r) => {
  r.keys().forEach((key) => (cache[key] = r(key)));
};

const allAssetsFromDirectory = (directory) => {
  handleImport(require.context("./images", false, /\.(webp)$/));

  // directory === "models"
  //   ? handleImport(require.context("./cards", false, /\.(glb|gltf)$/))
  //   : handleImport(require.context("./images", false, /\.(webp)$/));

  const cacheArray = [];

  Object.entries(cache).map((module) => {
    const uri = module[1];
    const name = module[0].replace("./", "");
    cacheArray.push({ uri, name });
  });

  return cacheArray;
};

export default allAssetsFromDirectory;
