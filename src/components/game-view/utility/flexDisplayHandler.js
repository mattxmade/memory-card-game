const flexDisplayHandler = (width, height, heightOffset, numberOfRows) => {
  /* React-Three-Flex
  :: Breakpoints | Responsiveness

  Aspect Ratio
  Static    Dynamic
  w 100px   h   <  95px                     :: 1 row
  h 96px    w   >  100px                    :: 1 row

  w 100px   h   >= 96px   &&    <= 118px    :: 2 rows
  w 100px   h   >= 119px  &&    <= 159px    :: 3 rows
  w 100px   h   >= 238px  &&                :: 5 rows

  h 95px    w   <= 99px   &&    >= 60px     :: 2 rows
  h 95px    w   <= 59px   &&    >= 40px     :: 3 rows
  h 95px    w   <= 39px                     :: 5 rows
  */

  const percentage = width / 100;

  // 83 * rowNum * wrapNum
  let wrapNum = 0;

  // single row
  let pageBreakpoint = 1;
  let distBreakpoint = 0;
  let contentAlign = "flex-end";

  // 5 cards, 1 flex row
  if (height <= percentage * 81) {
    //console.log("1 row");

    pageBreakpoint = 1;
    distBreakpoint = 0;
    contentAlign = "flex-end";

    if (numberOfRows > 2) contentAlign = "flex-start";

    if (numberOfRows > 3) {
      pageBreakpoint = numberOfRows * heightOffset;
      distBreakpoint = numberOfRows * 0.1;
    }

    wrapNum = 1;
  }

  // 5 cards, wrapped over 2 flex rows
  if (height > percentage * 81 && height <= percentage * 136) {
    //console.log("2 rows");

    pageBreakpoint = 1;
    distBreakpoint = 0;
    contentAlign = "flex-end";

    if (numberOfRows > 1) {
      pageBreakpoint = numberOfRows * heightOffset * 2;
      distBreakpoint = numberOfRows * 0.1;
      contentAlign = "flex-start";
    }

    wrapNum = 2;
  }

  // 5 cards, wrapped over 3 flex rows
  if (height >= percentage * 137 && height <= percentage * 204) {
    //console.log("3 rows");

    pageBreakpoint = 1;
    distBreakpoint = 0;

    if (numberOfRows > 1) {
      pageBreakpoint = numberOfRows * heightOffset * 3;
      distBreakpoint = numberOfRows * 0.1;
    }

    contentAlign = "flex-start";
    wrapNum = 3;
  }

  // 5 cards, wrapped over 5 flex rows
  if (height >= percentage * 205) {
    //console.log("5 rows");

    pageBreakpoint = numberOfRows * heightOffset * 5;
    distBreakpoint = numberOfRows * 0.1;
    contentAlign = "flex-start";

    wrapNum = 5;
  }

  return { pageBreakpoint, distBreakpoint, contentAlign, wrapNum };
};

export default flexDisplayHandler;
