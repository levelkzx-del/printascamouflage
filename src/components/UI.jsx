import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

const pictures = [
  "/images/page1.png",
  "/images/page2.png",
  "/images/page3.png",
  "/images/page4.png",
  "/images/page5.png",
  "DSC01040",
  "/images/page7.png",
  "DSC01071",
  "/images/page9.png",
  "DSC01145",
  "DSC01420",
  "DSC01461",
  "DSC01489",
  "DSC02031",
  "DSC02064",
  "DSC02069",
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
    body: [
      "(soon to be updated for the presentation, sorry it's late)",
    ],
  },
  bibliography: {
    title: "Bibliography",
    body: [
      "Cooper-Cunningham, Dean. “Seeing (in)Security, Gender and Silencing: Posters in and about the British Women’s Suffrage Movement.” International Feminist Journal of Politics, vol. 21, no. 3, Mar. 2019, pp. 383–408, https://doi.org/10.1080/14616742.2018.1561203.",
      "Florey, Kenneth. Women’s Suffrage Memorabilia: An Illustrated Historical Study. McFarland & Company, 2013.",
      "Manning, Haydon R. Comic Commentators: Contemporary Political Cartooning in Australia. Network Books, 2008.",
      "Morton, Tara. “Changing Spaces: Art, Politics, and Identity in the Home Studios of the Suffrage Atelier.” Women’s History Review, vol. 21, no. 4, Aug. 2012, pp. 623–37, https://doi.org/10.1080/09612025.2012.658177.",
      "O’Hagan, Lauren Alex. “Contesting Women’s Right to Vote: Anti-Suffrage Postcards in Edwardian Britain.” Visual Culture in Britain, vol. 21, no. 3, Dec. 2020, pp. 330–62, https://doi.org/10.1080/14714787.2020.1827971.",
      "Sarna, Alya J. “Illustrating History: Art and Law in the Women’s Suffrage Movement.” Library of Congress, Law Library of Congress, https://www.loc.gov/ghe/cascade/index.html?appid=3e0a781d27514e9b8e90136636f7140d.",
      "Stevenson, Ana, and Kristin Allukian. “The Suffrage Postcard Project: Feminist Digital Archiving and Transatlantic Suffrage History.” Journal of Contemporary Archival Studies, vol. 8, no. 8, Mar. 2021, pp. 1–25, https://www.researchgate.net/publication/357043352_The_Suffrage_Postcard_Project_Feminist_Digital_Archiving_and_Transatlantic_Suffrage_History.",
      "Tickner, Lisa. The Spectacle of Women: Imagery of the Suffrage Campaign 1907-14. University of Chicago Press, 1988.",
      "Walker, Lynne. “Women Working Together.” Woman’s Art Journal, vol. 11, no. 2, 1990, pp. 48–50. JSTOR, https://www.jstor.org/stable/3690703.",
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
                    {index === 0 ? "Cover" : `Page ${index}`}
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
          <section className="pointer-events-auto fixed left-6 top-24 z-20 flex w-[min(42rem,calc(100vw-3rem))] select-text rounded-lg border border-black/10 bg-[#f2ead8]/95 text-[#2f3b36] shadow-2xl backdrop-blur">
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
            <div className="max-h-[calc(100vh-8rem)] flex-1 select-text overflow-y-auto p-6">
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
              <div className="select-text space-y-4 text-base leading-7">
                {infoTabs[activeInfoTab].body.map((paragraph) => (
                  <p className="select-text" key={paragraph}>
                    {paragraph}
                  </p>
                ))}
              </div>
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
