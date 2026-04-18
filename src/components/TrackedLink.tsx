"use client";

import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

interface Props {
  href: string;
  event: AnalyticsEvent;
  props?: Record<string, string | number | boolean | undefined>;
  target?: string;
  rel?: string;
  className?: string;
  children: React.ReactNode;
}

export function TrackedLink({
  href,
  event,
  props,
  target,
  rel,
  className,
  children,
}: Props) {
  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={className}
      onClick={() => trackEvent(event, props)}
    >
      {children}
    </a>
  );
}
