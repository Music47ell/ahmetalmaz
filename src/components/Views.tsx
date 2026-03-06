import { useEffect, useRef, useState } from "react";
import {API_BASE_URL} from 'astro:env/server'

type PostViewsProps = {
  slug: string;
};

const PostViews: React.FC<PostViewsProps> = ({ slug }) => {
  const [views, setViews] = useState(0);
  const targetRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fetchViews = async () => {
      const res = await fetch(`${API_BASE_URL}/insight/${slug}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setViews(data.views || 0);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            fetchViews();
            if (entry.target) observer.unobserve(entry.target);
          }
        });
      },
      { root: null, threshold: 0.5 }
    );

    if (targetRef.current) {
      observer.observe(targetRef.current);
    }

    return () => {
      if (targetRef.current) observer.unobserve(targetRef.current);
    };
  }, [slug]);

  return <span ref={targetRef} className="shrink-0">{views}</span>;
};

export default PostViews;
