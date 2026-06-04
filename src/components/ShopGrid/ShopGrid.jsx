"use client";

import Copy from "@/components/Copy/Copy";

import "./ShopGrid.css";

const ShopGrid = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <section className="shop-grid-section" id="shop">
      <div className="container">
        <div className="shop-grid-header">
          <Copy type="lines" animateOnScroll>
            <h3>Shop</h3>
          </Copy>
        </div>

        <div className="shop-grid">
          {products.map((item) => (
            <a
              className="shop-grid-card"
              key={item._id}
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
            >
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
              <span className="shop-grid-link">{item.buyLabel || "Kjøp"}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopGrid;
