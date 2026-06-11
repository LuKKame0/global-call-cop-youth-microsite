"use client";

import {
  useRef,
  useEffect,
  type ReactNode,
  type ReactElement,
  Children,
  cloneElement,
} from "react";

interface MobileCarouselProps {
  children: ReactNode;
  className?: string;
  desktopClassName?: string;
  itemClassName?: string;
}

export function MobileCarousel({
  children,
  className = "",
  desktopClassName = "",
  itemClassName = "",
}: MobileCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const items = Children.toArray(children) as ReactElement[];
  const count = items.length;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || count === 0) return;

    const mq = window.matchMedia("(min-width: 1024px)");
    if (mq.matches) return;

    const sets = 3;
    const singleSetWidth = el.scrollWidth / sets;
    el.scrollLeft = singleSetWidth;

    const onScroll = () => {
      const activeSetWidth = el.scrollWidth / sets;
      if (el.scrollLeft <= 0) {
        el.scrollLeft += activeSetWidth;
      } else if (el.scrollLeft >= activeSetWidth * 2) {
        el.scrollLeft -= activeSetWidth;
      }
    };

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [count]);

  const tripled = [...items, ...items, ...items];

  return (
    <>
      {/* Mobile carousel */}
      <div
        ref={scrollRef}
        className={`flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth scrollbar-none lg:hidden ${className}`}
        style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
      >
        {tripled.map((child, i) => (
          <div
            key={`c-${i}`}
            className={`w-[85vw] max-w-[340px] flex-none snap-center ${itemClassName}`}
          >
            {cloneElement(child, { key: `carousel-${i}` })}
          </div>
        ))}
      </div>

      {/* Desktop grid */}
      <div className={`hidden lg:grid ${desktopClassName}`}>
        {items}
      </div>
    </>
  );
}
