import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { FullScreenQr } from "@/features/share/full-screen-qr";
import { ShareCardModal } from "@/features/share/share-card-modal";
import { ShareLauncher } from "@/features/share/share-launcher";

function noop(): void {}

describe("ShareCardModal", () => {
  it("renders nothing when closed", () => {
    expect(
      renderToStaticMarkup(
        <ShareCardModal open={false} onClose={noop} onOpenFullScreen={noop} />,
      ),
    ).toBe("");
  });

  it("is an accessible dialog with a title, instruction, and described-by wiring", () => {
    const html = renderToStaticMarkup(
      <ShareCardModal open onClose={noop} onOpenFullScreen={noop} />,
    );
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain("aria-labelledby");
    expect(html).toContain("aria-describedby");
    expect(html).toContain("Bring someone into the community");
    expect(html).toContain("Let them scan this code or send them the link.");
  });

  it("exposes every share/download action with an accessible name", () => {
    const html = renderToStaticMarkup(
      <ShareCardModal open onClose={noop} onOpenFullScreen={noop} />,
    );
    for (const label of [
      "Download to Phone",
      "Share with a Friend",
      "Copy Join Link",
      "Show Full-Screen QR",
      "Instagram Story",
      "Square card",
    ]) {
      expect(html).toContain(label);
    }
    expect(html).toContain('aria-label="Close share card"');
  });

  it("renders a labelled QR image and the wordmark outside it", () => {
    const html = renderToStaticMarkup(
      <ShareCardModal open onClose={noop} onOpenFullScreen={noop} />,
    );
    // The QR is a labelled SVG image.
    expect(html).toContain('role="img"');
    expect(html).toContain("QR code to join Miami Roots");
    // The wordmark logo + text appear (outside the code's quiet zone).
    expect(html).toContain('src="/brand/logos/miami-roots-logo.png"');
    expect(html).toContain("Miami Roots");
  });

  it("includes a polite live region for success/error feedback", () => {
    const html = renderToStaticMarkup(
      <ShareCardModal open onClose={noop} onOpenFullScreen={noop} />,
    );
    expect(html).toContain('role="status"');
    expect(html).toContain('aria-live="polite"');
  });
});

describe("FullScreenQr", () => {
  it("renders nothing when closed", () => {
    expect(
      renderToStaticMarkup(<FullScreenQr open={false} onClose={noop} />),
    ).toBe("");
  });

  it("is a labelled, scroll-safe dialog with a close control and visible URL", () => {
    const html = renderToStaticMarkup(<FullScreenQr open onClose={noop} />);
    expect(html).toContain('role="dialog"');
    expect(html).toContain('aria-modal="true"');
    expect(html).toContain(
      'aria-label="Full-screen QR code for joining Miami Roots"',
    );
    expect(html).toContain('aria-label="Close full-screen QR code"');
    // The join URL is printed beneath the code for manual entry.
    expect(html).toContain("miami-roots.vercel.app/join");
    // Horizontal-scroll guard on a full-viewport box.
    expect(html).toContain("overflow-hidden");
    // The QR itself is a labelled image.
    expect(html).toContain('role="img"');
  });
});

describe("ShareLauncher", () => {
  it("renders each requested trigger as a named button", () => {
    const html = renderToStaticMarkup(
      <ShareLauncher
        triggers={[
          { label: "Get Your Share Card", target: "card", variant: "primary" },
          {
            label: "Show My QR Code",
            target: "fullscreen",
            variant: "secondary",
          },
        ]}
      />,
    );
    expect(html).toContain("Get Your Share Card");
    expect(html).toContain("Show My QR Code");
    expect(html.match(/<button/g)?.length).toBe(2);
  });

  it("keeps both dialogs closed until a trigger is used", () => {
    const html = renderToStaticMarkup(
      <ShareLauncher
        triggers={[
          { label: "Share Miami Roots", target: "card", variant: "quiet" },
        ]}
      />,
    );
    expect(html).not.toContain('role="dialog"');
  });
});
