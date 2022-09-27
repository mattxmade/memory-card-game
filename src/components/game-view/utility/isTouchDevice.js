const isTouchDevice = () => {
  try {
    const prefixes = " -webkit- -moz- -o- -ms- -".split(" ");

    const mq = (query) => {
      return window.matchMedia(query).matches;
    };

    if (
      "ontouchstart" in window ||
      (typeof window.DocumentTouch !== "undefined" &&
        document instanceof window.DocumentTouch)
    ) {
      return true;
    }

    return mq(["(", prefixes.join("touch-enabled),("), "detect", ")"].join(""));
  } catch (e) {
    console.log("(Touch detect failed)", e);
    return false;
  }
};

export default isTouchDevice;

// https://gist.github.com/roydejong/fb021a973160fa3d04d7aaca675a46cf
