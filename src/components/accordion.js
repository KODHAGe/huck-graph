// riff off of https://codesandbox.io/p/sandbox/react-responsive-accordion-tabs-ki55l

import React, { useState } from "react";
import AccordionPanel from "./accordionPanel";
import "./accordion.scss";

export default function Accordion({
  asTabs,
  onlyOneOpenAccordion = true,
  panels
}) {
  const canClose = !asTabs;
  const onlyOneOpen = asTabs || onlyOneOpenAccordion;

  const [openPanel, setOpenPanel] = useState(
    Math.min(
      panels.findIndex(({ open }) => open),
      canClose ? -1 : 0
    )
  );

  const handleToggle = (index) => (e) => {
    e.preventDefault();
    const wasOpen = index === openPanel;
    setOpenPanel(canClose && wasOpen ? -1 : index);
  };

  const isIndexOpen = (index) =>
    openPanel !== -1 && openPanel === index;

  return (
    <>
      {asTabs && (
        <div id="mainNav" className="TabButtons">
          <ul role="tablist" className="TabButtons-list">
            {panels.map(({ content, heading, id, open }, i) => (
              <li key={i} className="TabButtons-listItem">
                <a
                  aria-controls={`panel-${id}`}
                  aria-selected={isIndexOpen(i)}
                  className="TabButtons-button"
                  href={`#${id}`}
                  id={`tab-${id}`}
                  onClick={handleToggle(i)}
                  role="tab"
                >
                  {heading}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      {panels.map(({ content, heading, id, open }, i) => (
        <AccordionPanel
          asTab={asTabs}
          handleToggle={onlyOneOpen ? handleToggle : undefined}
          heading={heading}
          id={id}
          index={i}
          key={i}
          open={onlyOneOpen ? isIndexOpen(i) : open}
        >
          {content}
        </AccordionPanel>
      ))}
    </>
  );
}
