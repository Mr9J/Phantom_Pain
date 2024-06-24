import { useEffect } from "react";

function TabDetails({ detailContents }: { detailContents: string }) {
  useEffect(() => {
    const lazyLoadImages = () => {
      const images = document.querySelectorAll("img[data-src]");
      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute("data-src");
            img.removeAttribute("data-src");
            observer.unobserve(img);
          }
        });
      });

      images.forEach((img) => {
        observer.observe(img);
      });
    };

    lazyLoadImages();
  }, [detailContents]);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: detailContents }} />
    </>
  );
}

export default TabDetails;
