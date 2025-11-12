"use client";

import { useEffect, useState, useRef } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingDrawerProps {
  slug: string;
  title: string;
}

export default function RatingDrawer({ slug, title }: RatingDrawerProps) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [hasRated, setHasRated] = useState(false);
  const hasShownRef = useRef(false);

  useEffect(() => {
    // Check if user has already rated this post
    const ratedPosts = JSON.parse(
      localStorage.getItem("ratedPosts") || "{}"
    );
    
    if (ratedPosts[slug]) {
      setHasRated(true);
      return;
    }

    let showTimeoutId: NodeJS.Timeout | null = null;
    let checkInterval: NodeJS.Timeout | null = null;
    const MAX_CHECK_TIME = 30000; // Stop checking after 30 seconds

    const checkAndShow = () => {
      if (hasShownRef.current) return;

      const commentsSection = document.getElementById("comments-section");
      if (!commentsSection) return;

      const rect = commentsSection.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

      if (isVisible) {
        hasShownRef.current = true;
        
        if (checkInterval) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
        
        showTimeoutId = setTimeout(() => {
          setOpen(true);
        }, 500);
      }
    };

    // Check immediately and on scroll
    checkAndShow();
    const handleScroll = () => checkAndShow();
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Listen for comments section ready event
    const handleCommentsReady = () => {
      setTimeout(checkAndShow, 200);
    };
    window.addEventListener("comments-section-ready", handleCommentsReady);

    // Periodic check as fallback (stops after MAX_CHECK_TIME)
    checkInterval = setInterval(checkAndShow, 1000);
    const cleanupTimeout = setTimeout(() => {
      if (checkInterval) {
        clearInterval(checkInterval);
        checkInterval = null;
      }
    }, MAX_CHECK_TIME);

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (cleanupTimeout) clearTimeout(cleanupTimeout);
      if (showTimeoutId) clearTimeout(showTimeoutId);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("comments-section-ready", handleCommentsReady);
    };
  }, [slug]);

  const handleRating = (value: number) => {
    setRating(value);
  };

  const saveRatingToStorage = (ratingValue: number, skipped = false) => {
    const ratedPosts = JSON.parse(
      localStorage.getItem("ratedPosts") || "{}"
    );
    ratedPosts[slug] = skipped
      ? { rating: 0, skipped: true }
      : { rating: ratingValue, date: new Date().toISOString() };
    localStorage.setItem("ratedPosts", JSON.stringify(ratedPosts));
  };

  const handleSubmit = () => {
    if (rating === 0) return;
    saveRatingToStorage(rating);
    setHasRated(true);
    setOpen(false);
  };

  const handleSkip = () => {
    saveRatingToStorage(0, true);
    setOpen(false);
  };

  if (hasRated) {
    return null;
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="text-2xl font-bold">
            How was this article?
          </DrawerTitle>
          <DrawerDescription className="text-base">
            Your feedback helps us improve. Rate "{title}"
          </DrawerDescription>
        </DrawerHeader>
        <div className="mx-auto mb-8 flex flex-col items-center gap-4 px-4">
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                className="focus:outline-none"
                onClick={() => handleRating(value)}
                onMouseEnter={() => setHoveredRating(value)}
                onMouseLeave={() => setHoveredRating(0)}
                aria-label={`Rate ${value} out of 5`}
              >
                <Star
                  className={cn(
                    "h-12 w-12 transition-all duration-200",
                    value <= (hoveredRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600",
                    "hover:scale-110"
                  )}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {rating === 1 ? "Poor" : 
               rating === 2 ? "Fair" : 
               rating === 3 ? "Good" : 
               rating === 4 ? "Very Good" : "Excellent"}
            </p>
          )}
        </div>
        <DrawerFooter className="flex-row justify-center gap-4">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="min-w-[100px]"
          >
            Skip
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="min-w-[100px]"
          >
            Submit
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

