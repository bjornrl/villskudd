import Copy from "../Copy/Copy";

import "./ImageBanner.css";

const ImageBanner = ({
  image = "/villskudd/650749186_929117529843713_7811746886751597834_n.jpg",
  heading = ["Ingenting", "Er", "Forgjeves"],
  // REVIEW: placeholder copy — rewrite to taste
  description = "Villskudd. Vi spiller norsk rock i den moderne virkelighet.",
}) => {
  return (
    <section className="image-banner">
      <div className="image-banner-bg">
        <img src={image} alt="" />
      </div>

      <div className="container">
        <Copy type="lines" animateOnScroll>
          {heading.map((word, index) => (
            <h4 key={index}>{word}</h4>
          ))}
        </Copy>

        <div className="image-banner-footer">
          <Copy
            type="lines"
            trigger=".image-banner"
            start="top 50%"
            delay={0.5}
          >
            <p>{description}</p>
          </Copy>
        </div>
      </div>
    </section>
  );
};

export default ImageBanner;
