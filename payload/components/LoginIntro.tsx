"use client";

// Heading + context above the login form, rendered via admin.components.beforeLogin.
// Mirrors the DS sidebar/admin header ("Compass Portugal" + a one-line subtitle) so the
// sign-in screen reads as ours rather than a bare Payload form. Quicksand is
// already applied to the admin subtree (see app/(payload)/layout.tsx).
export function LoginIntro() {
  return (
    <div style={{ textAlign: "center", marginBottom: 24 }}>
      <h1
        style={{
          margin: 0,
          fontSize: 22,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "#0a2422", // brand-900 / brand-dark
        }}
      >
        Compass Portugal
      </h1>
      <p
        style={{
          margin: "6px 0 0",
          fontSize: 13,
          fontWeight: 500,
          color: "#999999", // neutral-500 / muted
        }}
      >
        Sign in to manage Compass Portugal content
      </p>
    </div>
  );
}
