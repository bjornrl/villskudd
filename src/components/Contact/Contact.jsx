"use client";

import Copy from "@/components/Copy/Copy";

import "./Contact.css";

const Contact = ({ settings }) => {
  const intro =
    settings?.contactIntro ||
    "Booking, presse eller bare en hilsen — ta kontakt.";
  const items = settings?.contactItems || [];
  const socials = settings?.socials || [];

  return (
    <section className="contact" id="contact">
      <div className="container">
        <div className="contact-header">
          <Copy type="lines" animateOnScroll>
            <h3>{settings?.contactHeading || "Kontakt"}</h3>
          </Copy>
          <Copy type="lines" animateOnScroll>
            <p className="contact-intro">{intro}</p>
          </Copy>
        </div>

        <div className="contact-body">
          {items.length > 0 && (
            <div className="contact-details">
              {items.map((item, index) => (
                <a
                  className="contact-item"
                  href={item.href || "#"}
                  key={item.label || index}
                >
                  <span className="contact-item-label sm">{item.label}</span>
                  <span className="contact-item-value">{item.value}</span>
                </a>
              ))}
            </div>
          )}

          {socials.length > 0 && (
            <div className="contact-socials">
              {socials.map((social, index) => (
                <a
                  className="contact-social"
                  href={social.href}
                  key={social.label || index}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.label}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Contact;
