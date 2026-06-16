import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

const pictures = [
  "/images/page1.png",
  "/images/page2.png",
  "/images/page3.png",
  "/images/page4.png",
  "/images/page5.png",
  "/images/page6.png",
  "/images/page7.png",
  "/images/page8.png",
  "/images/page9.png",
  "/images/page10.png",
  "/images/page11.png",
  "/images/page12.png",
  "/images/page13.png",
  "/images/page14.png",
];

export const pageAtom = atom(0);
export const glareAtom = atom(false);
export const brightnessAtom = atom(0.35);
export const pages = [
  {
    front: "book-cover",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "book-back",
});

const pageLabels = [
  "Cover",
  "Intro",
  "Origin",
  "Material",
  "Tech",
  "Cases",
  "Modern",
  "Fashion",
];

const processSections = [
  {
    title: "Software",
    body: [
      "Visual Studio Code // Photoshop",
    ],
    bullets: [
      "HTML, CSS, Javascript, React, Vite (website)",
      "Three.js (book model, animation)",
      "Photoshop (slides)",
    ],
  },
  {
    title: "Making the Slide",
    body: [
      "Assemble in Photoshop.",
    ],
    images: [
      {
        src: "/images/process1.png",
        alt: "A camouflage book page being assembled in Photoshop",
      },
    ],
  },
  {
    title: "Page Integration",
    body: [
      "Place images into an array.",
    ],

  
    code: `const pictures = [
  "/images/page1.png",
  "/images/page2.png",
  "/images/page3.png",
  "/images/page4.png",
  "/images/page5.png",
  "/images/page6.png",
  "/images/page7.png",
  "/images/page8.png",
  "/images/page9.png",
  "/images/page10.png",
  "/images/page11.png",
  "/images/page12.png",
  "/images/page13.png",
  "/images/page14.png",
];`,
  },
  {
    title: "Building the 3D Book",
    body: [
      "Once the page images were finished, I imported them into a React project and used Three.js with React Three Fiber to make the book interactive. The page images are used as textures, so the viewer can flip through the project like a real book instead of clicking through a normal slideshow.",
    ],
    bullets: [
      "React and Vite run the project.",
      "React Three Fiber creates the 3D scene.",
      "Each page image is mapped onto the front or back of a page.",
      "The book animation makes the pages turn smoothly.",
    ],
  },
  {
    title: "How the Code Works",
    body: [
      "The project is split into a few main files. App.jsx creates the overall app and places the 3D scene inside a Canvas. Experience.jsx controls the scene setup, including the camera controls, lighting, environment brightness, and the book itself.",
      "Book.jsx is where the 3D book is built. Each page is a thin 3D rectangle with a front and back image texture. The page geometry is divided into many small segments, and those segments are attached to bones so the page can bend during the flip animation.",
      "UI.jsx controls the on-screen interface. It stores the page list, the current page number, the Info window, the Process tab, the Bibliography tab, the page buttons, the sound controls, and the brightness/glare settings.",
    ],
    bullets: [
      "App.jsx starts the main React app and renders the 3D Canvas.",
      "Experience.jsx adds the camera, lights, background environment, and keyboard movement.",
      "Book.jsx creates the book pages, loads the page images, and animates the page flips.",
      "UI.jsx creates the buttons, Info window, page navigation, audio settings, and written process section.",
    ],
  },
  {
    title: "Languages and Tools Used",
    body: [
      "The project uses several web development languages and libraries. Each one has a different role in making the interactive book work.",
    ],
    bullets: [
      "JavaScript was used for the main project logic, including page state, controls, animation timing, and user interaction.",
      "JSX was used inside the React files to write the interface and 3D scene structure in a component-based format.",
      "React was used to organize the project into reusable components like UI, Experience, and Book.",
      "Three.js was used for the 3D graphics, including geometry, materials, textures, lighting, shadows, and the 3D book scene.",
      "React Three Fiber was used to connect React with Three.js, making it easier to build the 3D scene using React components.",
      "HTML was used through the main Vite app entry point to load the project into the browser.",
      "CSS and Tailwind CSS were used for styling the interface, buttons, Info panel, layout, colors, and spacing.",
      "JSON was used in package.json to store project information, scripts, and dependencies.",
    ],
  },
  {
    title: "Interface and Controls",
    body: [
      "I added extra controls so the project would be easier to present. The viewer can jump to pages, reset the camera, adjust brightness, turn glare on or off, and open the Info window for controls, process notes, and the bibliography.",
    ],
  },
  {
    title: "Revision and Polish",
    body: [
      "The final step was checking the pages for readability, spacing, typos, and image placement. I also revised captions and adjusted text so the finished book looked cleaner and was easier to understand during the presentation.",
    ],
  },
];

const infoTabs = {
  controls: {
    title: "Controls",
    body: [
      "Drag with the mouse to look around.",
      "Use WASD for planar camera movement.",
      "Scroll wheel to zoom in and out.",
    ],
  },
  process: {
    title: "Process",
    sections: processSections,
  },
  bibliography: {
    title: "Bibliography",
    body: [
      "Works cited",
      "Behrens, Roy R. Art & Camouflage: Concealment and Deception in Nature, Art, and War. North American Review, 1981.",
      "Scaturro, Sarah. From Combat to Couture: Camouflage in Fashion. 2011. Fashion Institute of Technology, State University of New York, M.A. thesis.",
      "Beaver, Michael D., and J. F. Borsarello. Camouflage Uniforms of the Waffen-SS. Schiffer Publishing, 1995. Scribd, https://www.scribd.com/document/860675541/Schiffer-Camouflage-Uniforms-of-the-Waffen-SS.",
      "Dimeo, David E. \"Unreconciled Visions of War: Japan and America in World War II: A Literature Review.\" Midwest Quarterly, vol. 66, no. 3, Apr. 2025, pp. 79-90. EBSCOhost, research.ebsco.com/plink/43c9a19e-455c-3632-8b11-5c5dc819348b.",
      "Miller, Alisa. \"Second World War British Military Camouflage: Designing Deception, Forsyth Isla.\" Journal of the Society for Army Historical Research, vol. 97, no. 389, July 2019, pp. 195-96. EBSCOhost, research.ebsco.com/plink/764ba421-6708-32e3-bcb9-f6c8db0486c2.",
      "Saint-Gaudens, Homer. \"Camouflage-World War II.\" The Military Engineer, vol. 38, no. 249, July 1946, pp. 287-90. EBSCOhost, research.ebsco.com/plink/ef92e30a-8cc2-318d-8bf9-7544f611d2c0.",
      "Talas, Laszlo, Roland J. Baddeley, and Innes C. Cuthill. \"Cultural Evolution of Military Camouflage.\" Philosophical Transactions of the Royal Society B: Biological Sciences, vol. 372, no. 1724, 2017, article 20160351. DOI: 10.1098/rstb.2016.0351.",
      "Feng, Ranran, and Balakrishnan Prabhakaran. \"Facilitating Fashion Camouflage Art.\" Proceedings of the 21st ACM International Conference on Multimedia, Oct. 2013, pp. 793-802. EBSCOhost, https://doi.org/10.1145/2502081.2502121.",
      "Prasetyo, Yogi Tri. \"Utilization of Color Similarity Index for Evaluating Existing Military Camouflage Designs.\" Proceedings of the International Conference on Industrial Engineering & Operations Management, 10 Mar. 2020, pp. 1830-37.",
      "\"A Bathing Ape 1ST CAMO: History of Color Camo.\" BAPE, 3 Feb. 2024, en.jp.bape.com/blogs/news/history-of-colorcamo.",
      "Reuscher, Christopher. \"Early Printed Camouflage Uniforms of the Pacific War (1942-43).\" WWII Impressions: U.S. WWII Uniforms, www.usww2uniforms.com/PE2EarlyPacificCamo.html.",
      "Tomlin, Chase. \"The Ghost Army: Canvas and Camouflage.\" The National WWII Museum, 9 May 2024, www.nationalww2museum.org/war/articles/ghost-army-canvas-and-camouflage.",
    ],
  },
};

export const UI = () => {
  const [page, setPage] = useAtom(pageAtom);
  const [volume, setVolume] = useState(0.35);
  const [muted, setMuted] = useState(false);
  const [isAdjustingVolume, setIsAdjustingVolume] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [activeInfoTab, setActiveInfoTab] = useState("controls");
  const [glare, setGlare] = useAtom(glareAtom);
  const [brightness, setBrightness] = useAtom(brightnessAtom);
  const [pagesExpanded, setPagesExpanded] = useState(false);
  const [controlsOpen, setControlsOpen] = useState(false);
  const hasFlippedPage = useRef(false);
  const audioSettings = useRef({
    volume: 0.35,
    muted: false,
    isAdjustingVolume: false,
  });

  useEffect(() => {
    audioSettings.current = {
      volume,
      muted,
      isAdjustingVolume,
    };
  }, [volume, muted, isAdjustingVolume]);

  useEffect(() => {
    if (!hasFlippedPage.current) {
      hasFlippedPage.current = true;
      return;
    }
    const {
      volume: currentVolume,
      muted: currentlyMuted,
      isAdjustingVolume: currentlyAdjustingVolume,
    } = audioSettings.current;
    if (currentlyMuted || currentlyAdjustingVolume || currentVolume === 0) {
      return;
    }
    const audio = new Audio("/audios/page-flip-01a.mp3");
    audio.volume = currentVolume;
    audio.play();
  }, [page]);

  const toggleControls = () => {
    setControlsOpen((currentControlsOpen) => {
      const nextControlsOpen = !currentControlsOpen;
      if (!nextControlsOpen) {
        setInfoOpen(false);
        setPagesExpanded(false);
      }
      return nextControlsOpen;
    });
  };

  const renderInfoContent = () => {
    const activeTab = infoTabs[activeInfoTab];

    if (activeTab.sections) {
      return (
        <div className="select-text space-y-8 text-base leading-7">
          {activeTab.sections.map((section) => (
            <section className="select-text" key={section.title}>
              <h3 className="mb-3 select-text text-xl font-normal">
                {section.title}
              </h3>
              <div className="select-text space-y-4">
                {section.body.map((paragraph) => (
                  <p className="select-text" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {section.bullets.map((item) => (
                    <li className="select-text" key={item}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.images && (
                <div
                  className={`mt-5 grid gap-4 ${
                    section.images.length > 1 ? "sm:grid-cols-2" : ""
                  }`}
                >
                  {section.images.map((image) => (
                    <figure
                      className="overflow-hidden rounded-md border border-black/10 bg-white/35"
                      key={image.src}
                    >
                      <img
                        className="w-full object-contain"
                        src={image.src}
                        alt={image.alt}
                        onError={(event) => {
                          event.currentTarget.closest("figure").remove();
                        }}
                      />
                      {image.caption && (
                        <figcaption className="select-text px-3 py-2 text-sm leading-5">
                          {image.caption}
                        </figcaption>
                      )}
                    </figure>
                  ))}
                </div>
              )}
              {section.code && (
                <pre className="mt-5 overflow-x-auto rounded-md border border-black/10 bg-[#1f2428] p-4 text-sm leading-6 text-[#f2ead8]">
                  <code>{section.code}</code>
                </pre>
              )}
            </section>
          ))}
        </div>
      );
    }

    return (
      <div className="select-text space-y-4 text-base leading-7">
        {activeTab.body.map((paragraph) => (
          <p className="select-text" key={paragraph}>
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  return (
    <>
      <main
        className=" pointer-events-none select-none z-10 fixed  inset-0"
        style={{ fontFamily: '"Times New Roman", Times, serif' }}
      >
        {controlsOpen && (
          <>
            <div className="pointer-events-auto flex items-start justify-between gap-4 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  className={`h-11 rounded-full border px-5 text-base uppercase transition ${
                    infoOpen
                      ? "border-white bg-white/90 text-black"
                      : "border-white/20 bg-black/35 text-white hover:border-white"
                  }`}
                  onClick={() =>
                    setInfoOpen((currentInfoOpen) => !currentInfoOpen)
                  }
                >
                  Info
                </button>
              </div>
              <div className="flex h-11 items-center gap-3 rounded-full border border-white/20 bg-black/35 px-4 backdrop-blur">
                <button
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white"
                  onClick={() => setMuted((muted) => !muted)}
                  aria-label={
                    muted ? "Unmute page flip sound" : "Mute page flip sound"
                  }
                >
                  {muted ? (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                      <path d="m23 9-6 6" />
                      <path d="m17 9 6 6" />
                    </svg>
                  ) : (
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M11 5 6 9H2v6h4l5 4V5Z" />
                      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
                      <path d="M19 5a10 10 0 0 1 0 14" />
                    </svg>
                  )}
                </button>
                <input
                  className="h-2 w-28 cursor-pointer accent-white"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={muted ? 0 : volume}
                  onPointerDown={() => setIsAdjustingVolume(true)}
                  onPointerUp={() => setIsAdjustingVolume(false)}
                  onPointerCancel={() => setIsAdjustingVolume(false)}
                  onBlur={() => setIsAdjustingVolume(false)}
                  onChange={(e) => {
                    setVolume(Number(e.target.value));
                    setMuted(false);
                  }}
                  aria-label="Page flip volume"
                />
              </div>
            </div>

            <div className="pointer-events-none fixed left-0 right-0 top-6 z-10 flex justify-center px-72">
          {pagesExpanded ? (
            <div className="pointer-events-auto flex flex-col items-center gap-2">
              <div className="flex flex-wrap items-center justify-center gap-4">
                {[...pages].map((_, index) => (
                  <button
                    key={index}
                    className={`h-11 border-transparent hover:border-white transition-all duration-300  px-4 rounded-full  text-base uppercase shrink-0 border ${
                      index === page
                        ? "bg-white/90 text-black"
                        : "bg-black/30 text-white"
                    }`}
                    onClick={() => setPage(index)}
                  >
                    {pageLabels[index] ?? `Page ${index}`}
                  </button>
                ))}
                <button
                  className={`h-11 border-transparent hover:border-white transition-all duration-300  px-4 rounded-full  text-base uppercase shrink-0 border ${
                    page === pages.length
                      ? "bg-white/90 text-black"
                      : "bg-black/30 text-white"
                  }`}
                  onClick={() => setPage(pages.length)}
                >
                  Back Cover
                </button>
              </div>
              <button
                className="h-6 rounded-full border border-white/20 bg-black/30 px-6 text-sm uppercase text-white transition hover:border-white"
                onClick={() => setPagesExpanded(false)}
              >
                Collapse
              </button>
            </div>
          ) : (
            <button
              className="pointer-events-auto h-11 rounded-full border border-transparent bg-black/30 px-6 text-base uppercase text-white transition-all duration-300 hover:border-white"
              onClick={() => setPagesExpanded(true)}
            >
              Pages
            </button>
          )}
            </div>

            {infoOpen && (
          <section className="pointer-events-auto fixed left-6 top-24 z-20 flex max-h-[calc(100vh-8rem)] w-[min(42rem,calc(100vw-3rem))] select-text overflow-hidden rounded-lg border border-black/10 bg-[#f2ead8]/95 text-[#2f3b36] shadow-2xl backdrop-blur">
            <div className="flex w-52 shrink-0 flex-col gap-2 border-r border-black/10 p-4">
              {Object.entries(infoTabs).map(([tabId, tab]) => (
                <button
                  key={tabId}
                  className={`h-10 w-full rounded-full px-4 text-left text-base uppercase transition ${
                    activeInfoTab === tabId
                      ? "bg-[#2f3b36] text-white"
                      : "hover:bg-black/10"
                  }`}
                  onClick={() => setActiveInfoTab(tabId)}
                >
                  {tab.title}
                </button>
              ))}
            </div>
            <div className="flex-1 select-text overflow-y-auto p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <h2 className="text-base font-normal uppercase">
                  {infoTabs[activeInfoTab].title}
                </h2>
                <button
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/15 text-base leading-none transition hover:bg-black/10"
                  onClick={() => setInfoOpen(false)}
                  aria-label="Close info"
                >
                  x
                </button>
              </div>
              {renderInfoContent()}
            </div>
          </section>
            )}

            <button
          className="pointer-events-auto fixed bottom-6 left-6 h-11 rounded-full border border-white/20 bg-black/35 px-5 text-base uppercase text-white transition hover:border-white"
          onClick={() => window.dispatchEvent(new Event("reset-book-camera"))}
        >
          Reset Camera
            </button>

            <div className="pointer-events-auto fixed bottom-6 right-6 flex flex-col items-end gap-3">
          <button
            className="flex h-11 items-center gap-3 rounded-full border border-white/20 bg-black/35 px-5 text-base uppercase text-white transition hover:border-white"
            onClick={() => setGlare((currentGlare) => !currentGlare)}
          >
            <span>Glare</span>
            <span
              className={`relative h-6 w-11 rounded-full transition ${
                glare ? "bg-white/80" : "bg-black/30"
              }`}
            >
              <span
                className={`absolute top-1 h-4 w-4 rounded-full transition ${
                  glare ? "left-6 bg-[#2f3b36]" : "left-1 bg-white"
                }`}
              />
            </span>
          </button>
          <div className="flex h-11 items-center gap-3 rounded-full border border-white/20 bg-black/35 px-5 text-base uppercase text-white">
            <span>Brightness</span>
            <input
              className="h-2 w-28 cursor-pointer accent-white"
              type="range"
              min="0.35"
              max="1.25"
              step="0.05"
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              aria-label="Environment brightness"
            />
          </div>
            </div>
          </>
        )}

        <div className="pointer-events-auto fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
          {controlsOpen && (
            <div className="text-xl leading-none text-white/90">^</div>
          )}
          <button
            className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-black/35 text-white outline-none transition hover:bg-black/45 focus:outline-none focus:ring-0"
            onClick={toggleControls}
            aria-label={controlsOpen ? "Hide controls" : "Show controls"}
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.8"
            >
              <path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z" />
              <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05a2 2 0 1 1-2.83 2.83l-.05-.05A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6l-.03.03a2 2 0 0 1-3.94 0L10 20a1.7 1.7 0 0 0-1-.6 1.7 1.7 0 0 0-1.88.34l-.05.05a2 2 0 1 1-2.83-2.83l.05-.05A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1l-.03-.03a2 2 0 0 1 0-3.94L4 10a1.7 1.7 0 0 0 .6-1 1.7 1.7 0 0 0-.34-1.88l-.05-.05a2 2 0 1 1 2.83-2.83l.05.05A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6l.03-.03a2 2 0 0 1 3.94 0L14 4a1.7 1.7 0 0 0 1 .6 1.7 1.7 0 0 0 1.88-.34l.05-.05a2 2 0 1 1 2.83 2.83l-.05.05A1.7 1.7 0 0 0 19.4 9c.03.37.24.72.6 1l.03.03a2 2 0 0 1 0 3.94L20 14a1.7 1.7 0 0 0-.6 1Z" />
            </svg>
          </button>
        </div>

      </main>

    </>
  );
};
