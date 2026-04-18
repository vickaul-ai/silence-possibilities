import Script from "next/script";

export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const host = process.env.NEXT_PUBLIC_PLAUSIBLE_HOST || "https://plausible.io";
  if (!domain) return null;
  return (
    <>
      <Script
        defer
        data-domain={domain}
        src={`${host}/js/script.js`}
        strategy="afterInteractive"
      />
      <Script id="plausible-init" strategy="afterInteractive">
        {`window.plausible = window.plausible || function() { (window.plausible.q = window.plausible.q || []).push(arguments) };`}
      </Script>
    </>
  );
}
