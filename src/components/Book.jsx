import { useCursor, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useAtom } from "jotai";
import { easing } from "maath";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bone,
  BoxGeometry,
  Color,
  Float32BufferAttribute,
  MeshStandardMaterial,
  Skeleton,
  SkinnedMesh,
  SRGBColorSpace,
  Uint16BufferAttribute,
  Vector3,
} from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import { glareAtom, pageAtom, pages } from "./UI";

const easingFactor = 0.5; // Controls the speed of the easing
const easingFactorFold = 0.3; // Controls the speed of the easing
const insideCurveStrength = 0.18; // Controls the strength of the curve
const outsideCurveStrength = 0.05; // Controls the strength of the curve
const turningCurveStrength = 0.09; // Controls the strength of the curve
const PAGE_TURN_DURATION = 400;
const CONTENT_REVEAL_DELAY = PAGE_TURN_DURATION + 80;
const CONTENT_REVEAL_DURATION = 520;

const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71; // 4:3 aspect ratio
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
  PAGE_WIDTH,
  PAGE_HEIGHT,
  PAGE_DEPTH,
  PAGE_SEGMENTS,
  2
);

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0);

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = [];
const skinWeights = [];

for (let i = 0; i < position.count; i++) {
  // ALL VERTICES
  vertex.fromBufferAttribute(position, i); // get the vertex
  const x = vertex.x; // get the x position of the vertex

  const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH)); // calculate the skin index
  let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH; // calculate the skin weight

  skinIndexes.push(skinIndex, skinIndex + 1, 0, 0); // set the skin indexes
  skinWeights.push(1 - skinWeight, skinWeight, 0, 0); // set the skin weights
}

pageGeometry.setAttribute(
  "skinIndex",
  new Uint16BufferAttribute(skinIndexes, 4)
);
pageGeometry.setAttribute(
  "skinWeight",
  new Float32BufferAttribute(skinWeights, 4)
);

const whiteColor = new Color("white");
const blankPageColor = new Color("#f0e3c8");
const pageEdgeColor = new Color("#c7bca4");

const createRevealMaterial = (options) => {
  const material = new MeshStandardMaterial({
    color: whiteColor,
    ...options,
  });

  material.userData.reveal = { value: 0 };
  material.userData.blankColor = { value: blankPageColor };
  material.onBeforeCompile = (shader) => {
    shader.uniforms.reveal = material.userData.reveal;
    shader.uniforms.blankColor = material.userData.blankColor;
    shader.fragmentShader = `
      uniform float reveal;
      uniform vec3 blankColor;
    ${shader.fragmentShader}`;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `
      #include <map_fragment>
      diffuseColor.rgb = mix(blankColor, diffuseColor.rgb, reveal);
      `
    );
  };

  return material;
};

const pageMaterials = [
  new MeshStandardMaterial({
    color: pageEdgeColor,
  }),
  new MeshStandardMaterial({
    color: "#111",
  }),
  new MeshStandardMaterial({
    color: pageEdgeColor,
  }),
  new MeshStandardMaterial({
    color: pageEdgeColor,
  }),
];

const getTexturePath = (image) => {
  if (image.startsWith("/")) {
    return image;
  }
  return `/textures/${image}.jpg`;
};

pages.forEach((page) => {
  useTexture.preload(getTexturePath(page.front));
  useTexture.preload(getTexturePath(page.back));
  useTexture.preload(`/textures/book-cover-roughness.jpg`);
});

const Page = ({ number, front, back, page, opened, bookClosed, ...props }) => {
  const [glare] = useAtom(glareAtom);
  const [picture, picture2, pictureRoughness] = useTexture([
    getTexturePath(front),
    getTexturePath(back),
    ...(number === 0 || number === pages.length - 1
      ? [`/textures/book-cover-roughness.jpg`]
      : []),
  ]);
  picture.colorSpace = picture2.colorSpace = SRGBColorSpace;
  const group = useRef();
  const turnedAt = useRef(0);
  const lastOpened = useRef(opened);
  const spreadChangedAt = useRef(+new Date());
  const lastPage = useRef(page);
  const lastGlare = useRef(glare);

  const skinnedMeshRef = useRef();

  const manualSkinnedMesh = useMemo(() => {
    const bones = [];
    for (let i = 0; i <= PAGE_SEGMENTS; i++) {
      let bone = new Bone();
      bones.push(bone);
      if (i === 0) {
        bone.position.x = 0;
      } else {
        bone.position.x = SEGMENT_WIDTH;
      }
      if (i > 0) {
        bones[i - 1].add(bone); // attach the new bone to the previous bone
      }
    }
    const skeleton = new Skeleton(bones);

    const materials = [
      ...pageMaterials,
      createRevealMaterial({
        map: picture,
        ...(number === 0
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.1,
            }),
      }),
      createRevealMaterial({
        map: picture2,
        ...(number === pages.length - 1
          ? {
              roughnessMap: pictureRoughness,
            }
          : {
              roughness: 0.1,
            }),
      }),
    ];
    materials[4].userData.originalRoughnessMap = materials[4].roughnessMap;
    materials[5].userData.originalRoughnessMap = materials[5].roughnessMap;
    const mesh = new SkinnedMesh(pageGeometry, materials);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.add(skeleton.bones[0]);
    mesh.bind(skeleton);
    return mesh;
  }, []);

  // useHelper(skinnedMeshRef, SkeletonHelper, "red");

  useFrame((_, delta) => {
    if (!skinnedMeshRef.current) {
      return;
    }

    const pageRoughness = glare ? 0.1 : 0.92;
    skinnedMeshRef.current.material[4].roughness = pageRoughness;
    skinnedMeshRef.current.material[5].roughness = pageRoughness;
    skinnedMeshRef.current.material[4].roughnessMap = glare
      ? skinnedMeshRef.current.material[4].userData.originalRoughnessMap
      : null;
    skinnedMeshRef.current.material[5].roughnessMap = glare
      ? skinnedMeshRef.current.material[5].userData.originalRoughnessMap
      : null;
    if (lastGlare.current !== glare) {
      skinnedMeshRef.current.material[4].needsUpdate = true;
      skinnedMeshRef.current.material[5].needsUpdate = true;
      lastGlare.current = glare;
    }

    if (lastPage.current !== page) {
      spreadChangedAt.current = +new Date();
      lastPage.current = page;
    }
    if (lastOpened.current !== opened) {
      turnedAt.current = +new Date();
      lastOpened.current = opened;
    }
    const now = +new Date();
    const elapsedTurnTime = now - turnedAt.current;
    const elapsedSpreadTime = now - spreadChangedAt.current;
    const revealAmount = Math.min(
      1,
      Math.max(
        0,
        (elapsedSpreadTime - CONTENT_REVEAL_DELAY) / CONTENT_REVEAL_DURATION
      )
    );
    const frontReveal = number === 0 ? 1 : number === page ? revealAmount : 0;
    const backReveal =
      number === 0 ? 1 : number === page - 1 ? revealAmount : 0;
    skinnedMeshRef.current.material[4].userData.reveal.value = frontReveal;
    skinnedMeshRef.current.material[5].userData.reveal.value = backReveal;

    let turningTime = Math.min(PAGE_TURN_DURATION, elapsedTurnTime) / PAGE_TURN_DURATION;
    turningTime = Math.sin(turningTime * Math.PI);

    let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2;
    if (!bookClosed) {
      targetRotation += degToRad(number * 0.8);
    }

    const bones = skinnedMeshRef.current.skeleton.bones;
    for (let i = 0; i < bones.length; i++) {
      const target = i === 0 ? group.current : bones[i];

      const insideCurveIntensity = i < 8 ? Math.sin(i * 0.2 + 0.25) : 0;
      const outsideCurveIntensity = i >= 8 ? Math.cos(i * 0.3 + 0.09) : 0;
      const turningIntensity =
        Math.sin(i * Math.PI * (1 / bones.length)) * turningTime;
      let rotationAngle =
        insideCurveStrength * insideCurveIntensity * targetRotation -
        outsideCurveStrength * outsideCurveIntensity * targetRotation +
        turningCurveStrength * turningIntensity * targetRotation;
      let foldRotationAngle = degToRad(Math.sign(targetRotation) * 2);
      if (bookClosed) {
        if (i === 0) {
          rotationAngle = targetRotation;
          foldRotationAngle = 0;
        } else {
          rotationAngle = 0;
          foldRotationAngle = 0;
        }
      }
      easing.dampAngle(
        target.rotation,
        "y",
        rotationAngle,
        easingFactor,
        delta
      );

      const foldIntensity =
        i > 8
          ? Math.sin(i * Math.PI * (1 / bones.length) - 0.5) * turningTime
          : 0;
      easing.dampAngle(
        target.rotation,
        "x",
        foldRotationAngle * foldIntensity,
        easingFactorFold,
        delta
      );
    }
  });

  const [_, setPage] = useAtom(pageAtom);
  const [highlighted, setHighlighted] = useState(false);
  useCursor(highlighted);

  return (
    <group
      {...props}
      ref={group}
      onPointerEnter={(e) => {
        e.stopPropagation();
        setHighlighted(true);
      }}
      onPointerLeave={(e) => {
        e.stopPropagation();
        setHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        setPage(opened ? number : number + 1);
        setHighlighted(false);
      }}
    >
      <primitive
        object={manualSkinnedMesh}
        ref={skinnedMeshRef}
        position-z={-number * PAGE_DEPTH + page * PAGE_DEPTH}
      />
    </group>
  );
};

export const Book = ({ ...props }) => {
  const [page] = useAtom(pageAtom);
  const [delayedPage, setDelayedPage] = useState(page);

  useEffect(() => {
    let timeout;
    const goToPage = () => {
      setDelayedPage((delayedPage) => {
        if (page === delayedPage) {
          return delayedPage;
        } else {
          timeout = setTimeout(
            () => {
              goToPage();
            },
            Math.abs(page - delayedPage) > 2 ? 50 : 150
          );
          if (page > delayedPage) {
            return delayedPage + 1;
          }
          if (page < delayedPage) {
            return delayedPage - 1;
          }
        }
      });
    };
    goToPage();
    return () => {
      clearTimeout(timeout);
    };
  }, [page]);

  return (
    <group {...props} rotation-y={-Math.PI / 2}>
      {[...pages].map((pageData, index) => (
        <Page
          key={index}
          page={delayedPage}
          number={index}
          opened={delayedPage > index}
          bookClosed={delayedPage === 0 || delayedPage === pages.length}
          {...pageData}
        />
      ))}
    </group>
  );
};
