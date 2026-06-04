"use client";

import Copy from "@/components/Copy/Copy";

import "./Shows.css";

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const Shows = ({ shows = [], heading }) => {
  if (!shows.length) return null;

  return (
    <section className="shows" id="shows">
      <div className="container">
        <div className="shows-header">
          <Copy type="lines" animateOnScroll>
            <h3>{heading || "Kommende konserter"}</h3>
          </Copy>
        </div>

        <div className="shows-list">
          {shows.map((show) => (
            <a
              className="show-row"
              key={show._id}
              href={show.ticketUrl || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="show-venue">{show.venue}</span>
              <span className="show-city">{show.city}</span>
              <span className="show-date">{formatDate(show.date)}</span>
              <span className="show-link">{show.ticketLabel || "Billetter"}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Shows;
