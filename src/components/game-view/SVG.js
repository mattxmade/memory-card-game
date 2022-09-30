import { useThree } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

import {
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  ShapeGeometry,
} from "three";

// based on three example
// https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_svg.html

const SVG = ({ url, scale, position, rotation, wireframe }) => {
  const three = useThree();

  const loader = new SVGLoader();
  loader.load(url, (data) => {
    const paths = data.paths;

    const group = new Group();
    group.scale.multiplyScalar(scale);
    group.position.x = position[0];
    group.position.y = position[1];
    group.position.z = position[2];

    const [x, y, z] = rotation;
    group.rotation.set(x, y, z);

    group.scale.y *= -1;

    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];

      const fillColor = path.userData.style.fill;

      if (fillColor !== undefined && fillColor !== "none") {
        const material = new MeshBasicMaterial({
          color: new Color().setStyle(fillColor).convertSRGBToLinear(),
          opacity: path.userData.style.fillOpacity,
          transparent: true,
          side: DoubleSide,
          depthWrite: false,
          wireframe: wireframe,
        });

        const shapes = SVGLoader.createShapes(path);

        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j];

          const geometry = new ShapeGeometry(shape);
          const mesh = new Mesh(geometry, material);

          group.add(mesh);
        }
      }

      const strokeColor = path.userData.style.stroke;

      if (strokeColor !== undefined && strokeColor !== "none") {
        const material = new MeshBasicMaterial({
          color: new Color().setStyle(strokeColor).convertSRGBToLinear(),
          opacity: path.userData.style.strokeOpacity,
          transparent: true,
          side: DoubleSide,
          depthWrite: false,
          wireframe: false,
        });

        for (let j = 0, jl = path.subPaths.length; j < jl; j++) {
          const subPath = path.subPaths[j];
          const geometry = SVGLoader.pointsToStroke(
            subPath.getPoints(),
            path.userData.style
          );

          if (geometry) {
            const mesh = new Mesh(geometry, material);

            group.add(mesh);
          }
        }
      }
    }

    three.scene.add(group);
  });
};

export default SVG;
