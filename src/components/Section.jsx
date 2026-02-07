import React from "react";
import useReveal from "../hooks/useReveal";

export default function Section({ id, kicker, title, description, children }) {
  const { ref, isVisible } = useReveal();

  return (
    <section id={id} className={`section ${isVisible ? "is-visible" : ""}`} ref={ref}>
      <div className="section-content">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        {title ? <h2>{title}</h2> : null}
        {description ? <p className="section-desc">{description}</p> : null}
        {children}
      </div>
    </section>
  );
}
