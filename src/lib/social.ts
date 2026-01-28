/**
 * Social and Interaction Utilities
 * Functions for social media sharing, engagement, and interaction features
 */

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Social media platform types
 */
export type SocialPlatform = 
  | "twitter" 
  | "x" 
  | "linkedin" 
  | "facebook" 
  | "reddit" 
  | "whatsapp" 
  | "telegram" 
  | "email"
  | "native";

/**
 * Share data interface
 */
export interface ShareData {
  title: string;
  url: string;
  description?: string;
  image?: string;
  hashtags?: string[];
  via?: string; // Twitter username
}

/**
 * Generate Twitter/X share URL
 */
export function generateTwitterShareUrl(data: ShareData): string {
  const params = new URLSearchParams();
  
  if (data.title) {
    params.append("text", data.title);
  }
  
  if (data.url) {
    params.append("url", data.url);
  }
  
  if (data.hashtags && data.hashtags.length > 0) {
    params.append("hashtags", data.hashtags.join(","));
  }
  
  if (data.via) {
    params.append("via", data.via);
  }
  
  return `https://twitter.com/intent/tweet?${params.toString()}`;
}

/**
 * Generate LinkedIn share URL
 */
export function generateLinkedInShareUrl(data: ShareData): string {
  const params = new URLSearchParams();
  params.append("url", data.url);
  
  if (data.title) {
    params.append("title", data.title);
  }
  
  if (data.description) {
    params.append("summary", data.description);
  }
  
  return `https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`;
}

/**
 * Generate Facebook share URL
 */
export function generateFacebookShareUrl(data: ShareData): string {
  const params = new URLSearchParams();
  params.append("u", data.url);
  
  if (data.title) {
    params.append("quote", data.title);
  }
  
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
}

/**
 * Generate Reddit share URL
 */
export function generateRedditShareUrl(data: ShareData): string {
  const params = new URLSearchParams();
  params.append("url", data.url);
  
  if (data.title) {
    params.append("title", data.title);
  }
  
  return `https://reddit.com/submit?${params.toString()}`;
}

/**
 * Generate WhatsApp share URL
 */
export function generateWhatsAppShareUrl(data: ShareData): string {
  const text = data.title 
    ? `${data.title} ${data.url}`
    : data.url;
  
  const params = new URLSearchParams();
  params.append("text", text);
  
  return `https://wa.me/?${params.toString()}`;
}

/**
 * Generate Telegram share URL
 */
export function generateTelegramShareUrl(data: ShareData): string {
  const text = data.title 
    ? `${data.title} ${data.url}`
    : data.url;
  
  const params = new URLSearchParams();
  params.append("url", data.url);
  params.append("text", text);
  
  return `https://t.me/share/url?${params.toString()}`;
}

/**
 * Generate email share URL
 */
export function generateEmailShareUrl(data: ShareData): string {
  const subject = encodeURIComponent(data.title || "Check this out");
  const body = encodeURIComponent(
    `${data.description || ""}\n\n${data.url}`.trim()
  );
  
  return `mailto:?subject=${subject}&body=${body}`;
}

/**
 * Generate share URL for a specific platform
 */
export function generateShareUrl(
  platform: SocialPlatform,
  data: ShareData
): string {
  switch (platform) {
    case "twitter":
    case "x":
      return generateTwitterShareUrl(data);
    case "linkedin":
      return generateLinkedInShareUrl(data);
    case "facebook":
      return generateFacebookShareUrl(data);
    case "reddit":
      return generateRedditShareUrl(data);
    case "whatsapp":
      return generateWhatsAppShareUrl(data);
    case "telegram":
      return generateTelegramShareUrl(data);
    case "email":
      return generateEmailShareUrl(data);
    default:
      return data.url;
  }
}

/**
 * Open share dialog for a platform
 */
export function shareToPlatform(
  platform: SocialPlatform,
  data: ShareData,
  windowFeatures?: string
): void {
  if (typeof window === "undefined") return;
  
  const url = generateShareUrl(platform, data);
  window.open(url, "_blank", windowFeatures || "noopener,noreferrer");
}

/**
 * Use native Web Share API if available
 */
export async function shareNative(data: ShareData): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.share) {
    return false;
  }
  
  try {
    await navigator.share({
      title: data.title,
      text: data.description,
      url: data.url,
    });
    return true;
  } catch (error) {
    // User cancelled or error occurred
    return false;
  }
}

/**
 * Check if native share is available
 */
export function isNativeShareAvailable(): boolean {
  if (typeof window === "undefined") return false;
  return "share" in navigator;
}

/**
 * Copy URL to clipboard
 */
export async function copyToClipboard(
  text: string,
  onSuccess?: () => void,
  onError?: (error: Error) => void
): Promise<boolean> {
  if (typeof window === "undefined" || !navigator.clipboard) {
    return false;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    onSuccess?.();
    return true;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Failed to copy");
    onError?.(err);
    return false;
  }
}

/**
 * Generate Open Graph meta tags
 */
export interface OpenGraphData {
  title: string;
  description: string;
  url: string;
  image?: string;
  type?: string;
  siteName?: string;
  locale?: string;
}

/**
 * Generate Open Graph meta tags object
 */
export function generateOpenGraphTags(data: OpenGraphData): Record<string, string> {
  const tags: Record<string, string> = {
    "og:title": data.title,
    "og:description": data.description,
    "og:url": data.url,
    "og:type": data.type || "article",
  };
  
  if (data.image) {
    tags["og:image"] = data.image;
  }
  
  if (data.siteName) {
    tags["og:site_name"] = data.siteName;
  }
  
  if (data.locale) {
    tags["og:locale"] = data.locale;
  }
  
  return tags;
}

/**
 * Generate Twitter Card meta tags
 */
export interface TwitterCardData {
  title: string;
  description: string;
  image?: string;
  card?: "summary" | "summary_large_image" | "app" | "player";
  site?: string;
  creator?: string;
}

/**
 * Generate Twitter Card meta tags object
 */
export function generateTwitterCardTags(data: TwitterCardData): Record<string, string> {
  const tags: Record<string, string> = {
    "twitter:title": data.title,
    "twitter:description": data.description,
    "twitter:card": data.card || "summary_large_image",
  };
  
  if (data.image) {
    tags["twitter:image"] = data.image;
  }
  
  if (data.site) {
    tags["twitter:site"] = data.site;
  }
  
  if (data.creator) {
    tags["twitter:creator"] = data.creator;
  }
  
  return tags;
}

/**
 * Engagement statistics interface
 */
export interface EngagementStats {
  views: number;
  likes?: number;
  comments: number;
  shares: number;
  readingTime?: number;
}

/**
 * Format engagement number (e.g., 1.2K, 5.3M)
 */
export function formatEngagementNumber(num: number): string {
  if (num < 1000) {
    return num.toString();
  }
  
  if (num < 1000000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  
  return `${(num / 1000000).toFixed(1)}M`;
}

/**
 * Calculate engagement rate
 */
export function calculateEngagementRate(
  engagements: number,
  views: number
): number {
  if (views === 0) return 0;
  return Number(((engagements / views) * 100).toFixed(2));
}

/**
 * Generate social proof text
 */
export function generateSocialProof(stats: EngagementStats): string {
  const parts: string[] = [];
  
  if (stats.likes && stats.likes > 0) {
    parts.push(`${formatEngagementNumber(stats.likes)} likes`);
  }
  
  if (stats.comments > 0) {
    parts.push(`${stats.comments} comment${stats.comments > 1 ? "s" : ""}`);
  }
  
  if (stats.shares > 0) {
    parts.push(`${stats.shares} share${stats.shares > 1 ? "s" : ""}`);
  }
  
  return parts.join(" • ");
}

/**
 * Generate shareable quote from content
 */
export function generateShareableQuote(
  content: string,
  maxLength: number = 280
): string {
  // Remove markdown syntax
  const cleanText = content
    .replace(/[#*`_~\[\]()]/g, "")
    .replace(/\n+/g, " ")
    .trim();
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  // Try to cut at sentence boundary
  const truncated = cleanText.substring(0, maxLength - 3);
  const lastPeriod = truncated.lastIndexOf(".");
  const lastExclamation = truncated.lastIndexOf("!");
  const lastQuestion = truncated.lastIndexOf("?");
  
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  if (lastSentenceEnd > maxLength * 0.5) {
    return truncated.substring(0, lastSentenceEnd + 1);
  }
  
  return truncated + "...";
}

/**
 * Track social share event
 */
export function trackShare(
  platform: SocialPlatform,
  url: string,
  callback?: () => void
): void {
  // Analytics tracking can be added here
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "share", {
      method: platform,
      content_type: "article",
      item_id: url,
    });
  }
  
  callback?.();
}

/**
 * Generate QR code URL for sharing
 */
export function generateQRCodeUrl(
  url: string,
  size: number = 200
): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}`;
}

/**
 * Validate social media URL
 */
export function isValidSocialUrl(url: string, platform: SocialPlatform): boolean {
  const patterns: Record<SocialPlatform, RegExp> = {
    twitter: /^https?:\/\/(www\.)?(twitter\.com|x\.com)/,
    x: /^https?:\/\/(www\.)?(twitter\.com|x\.com)/,
    linkedin: /^https?:\/\/(www\.)?linkedin\.com/,
    facebook: /^https?:\/\/(www\.)?facebook\.com/,
    reddit: /^https?:\/\/(www\.)?reddit\.com/,
    whatsapp: /^https?:\/\/wa\.me/,
    telegram: /^https?:\/\/(www\.)?t\.me/,
    email: /^mailto:/,
    native: /./, // Always valid for native
  };
  
  return patterns[platform].test(url);
}

/**
 * Extract platform from URL
 */
export function extractPlatformFromUrl(url: string): SocialPlatform | null {
  if (/twitter\.com|x\.com/.test(url)) return "twitter";
  if (/linkedin\.com/.test(url)) return "linkedin";
  if (/facebook\.com/.test(url)) return "facebook";
  if (/reddit\.com/.test(url)) return "reddit";
  if (/wa\.me/.test(url)) return "whatsapp";
  if (/t\.me/.test(url)) return "telegram";
  if (/^mailto:/.test(url)) return "email";
  
  return null;
}

/**
 * Get platform display name
 */
export function getPlatformDisplayName(platform: SocialPlatform): string {
  const names: Record<SocialPlatform, string> = {
    twitter: "Twitter",
    x: "X",
    linkedin: "LinkedIn",
    facebook: "Facebook",
    reddit: "Reddit",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    email: "Email",
    native: "Share",
  };
  
  return names[platform];
}

/**
 * Get platform icon name (for icon libraries)
 */
export function getPlatformIconName(platform: SocialPlatform): string {
  const icons: Record<SocialPlatform, string> = {
    twitter: "twitter",
    x: "x",
    linkedin: "linkedin",
    facebook: "facebook",
    reddit: "reddit",
    whatsapp: "message-circle",
    telegram: "send",
    email: "mail",
    native: "share-2",
  };
  
  return icons[platform];
}

