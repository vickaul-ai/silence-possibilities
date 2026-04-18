type EventProps = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: EventProps }) => void;
  }
}

export type AnalyticsEvent =
  | "card_click"
  | "demo_load"
  | "demo_tab_switch"
  | "demo_action"
  | "pilot_cta_click"
  | "external_prototype_open";

export function trackEvent(event: AnalyticsEvent, props: EventProps = {}) {
  if (typeof window === "undefined") return;
  window.plausible?.(event, { props });
}
