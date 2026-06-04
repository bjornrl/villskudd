"use client";

import Copy from "@/components/Copy/Copy";

import "./ShopGrid.css";

const ShopGrid = ({ products = [], heading, mailLabel }) => {
  if (!products.length) return null;

  return (
    <section className="shop-grid-section" id="shop">
      <div className="container">
        <div className="shop-grid-header">
          <Copy type="lines" animateOnScroll>
            <h3>{heading || "Shop"}</h3>
          </Copy>
        </div>

        <div className="shop-grid">
          {products.map((item) => (
            <div className="shop-grid-card" key={item._id}>
              {item.image && (
                <div className="shop-grid-image">
                  <img src={item.image} alt={item.name} />
                </div>
              )}
              <div className="shop-grid-body">
                {item.type && <p className="shop-grid-type mono">{item.type}</p>}
                <h5 className="shop-grid-name">{item.name}</h5>
                {item.price && <p className="shop-grid-price">{item.price}</p>}
              </div>

              <div className="shop-grid-buy">
                <span className="shop-grid-mail-label sm">
                  {mailLabel || "Send en mail til"}
                </span>
                <a
                  className="shop-grid-link"
                  href={item.email ? `mailto:${item.email}` : "#"}
                >
                  {item.buyLabel || item.email || "Send mail"}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopGrid;
