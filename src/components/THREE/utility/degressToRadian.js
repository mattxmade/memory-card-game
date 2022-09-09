import { MathUtils } from "three";

const degreesToRadian = (data) => {
  if (Number.isInteger(Number(data))) return MathUtils.degToRad(data);

  if (Array.isArray(data) === false) return;
  return data.map((item) => MathUtils.degToRad(item));
};

export default degreesToRadian;
