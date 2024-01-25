import React from "react";

export default function AccordionPanel({
  asTab,
  children,
  handleToggle,
  heading,
  id,
  index,
  open
}) {
  // console.log(index, 'AccordionPanel open:', open);
  if (asTab) {
    return !open ? null : (
      <div
        aria-labelledby={`tab-${id}`}
        className="Accordion-group"
        id={`panel-${id}`}
        role="tabpanel"
      >
        <div className="Tab-panel">{children}</div>
      </div>
    );
  }
  return (
    <details className="Accordion-group" open={open}>
      <summary className="Accordion-head" onClick={handleToggle?.(index)}>
        {heading}
      </summary>
      <div className="Accordion-panel" id={id}>
        {children}
      </div>
    </details>
  );
}
