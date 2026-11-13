"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  UserCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedRedirect = searchParams.get("redirect");
  const redirectUrl =
    requestedRedirect?.startsWith("/") && !requestedRedirect.startsWith("//")
      ? requestedRedirect
      : "/shop";

  const { user, isAuthenticated, login, logout } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      await login(normalizedEmail, password);
      router.replace(redirectUrl);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to sign in. Please check your credentials and try again.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "var(--sh-cream, #fffafc)",
      }}
    >
      <main
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2.5rem 1rem 3rem",
        }}
      >
        <div
          className="auth-split-grid"
          style={{
            width: "100%",
            maxWidth: 960,
            background: "#ffffff",
            borderRadius: "var(--radius-xl, 18px)",
            overflow: "hidden",
            border: "1px solid var(--sh-border, #e5e7eb)",
            boxShadow: "0 20px 45px -10px rgba(0, 0, 0, 0.08)",
            display: "grid",
            gridTemplateColumns: "1fr 1.15fr",
          }}
        >
          {/* Left editorial panel */}
          <section
            className="auth-visual-panel"
            style={{
              position: "relative",
              minHeight: 620,
              background: "linear-gradient(135deg, #181a1f 0%, #0d0f12 100%)",
              color: "#ffffff",
              padding: "3rem 2.5rem",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                opacity: 0.38,
              }}
            >
              <Image
                src="https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80"
                alt=""
                fill
                priority
                sizes="(max-width: 820px) 0px, 45vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(180deg, rgba(13,15,18,0.7) 0%, rgba(13,15,18,0.95) 100%)",
              }}
            />

            <div style={{ position: "relative", zIndex: 1 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  background: "rgba(205, 161, 67, 0.2)",
                  border: "1px solid var(--sh-gold, #cda143)",
                  color: "var(--sh-gold, #cda143)",
                  fontSize: "0.725rem",
                  fontWeight: 800,
                  padding: "0.3rem 0.75rem",
                  borderRadius: "999px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: "1.5rem",
                }}
              >
                <Sparkles size={13} />
                Private Member Access
              </div>

              <h2
                style={{
                  fontFamily: "var(--font-serif, Georgia, serif)",
                  fontSize: "2.2rem",
                  lineHeight: 1.2,
                  margin: "0 0 1rem",
                  color: "#ffffff",
                }}
              >
                Curated Luxury Export Edits.
              </h2>

              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#d1d5db",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                Sign in to track your Cash on Delivery orders, view order
                updates, and discover new collections before social releases.
              </p>
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 1,
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "var(--radius-lg, 12px)",
                padding: "1.25rem",
                marginTop: "2rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.65rem",
                  marginBottom: "0.4rem",
                }}
              >
                <Truck
                  size={18}
                  style={{ color: "var(--sh-gold, #cda143)" }}
                />
                <span
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    color: "#ffffff",
                  }}
                >
                  Cash on Delivery
                </span>
              </div>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "#d1d5db",
                  margin: 0,
                  lineHeight: 1.5,
                }}
              >
                Islandwide delivery across Sri Lanka. Delivery availability and
                times may vary by location.
              </p>
            </div>
          </section>

          {/* Login form */}
          <section
            style={{
              padding: "clamp(1.5rem, 5vw, 3rem) clamp(1.25rem, 4vw, 2.75rem)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minWidth: 0,
            }}
          >
            {isAuthenticated && user ? (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  borderRadius: 14,
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || "Customer"}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '3px solid var(--sh-gold)',
                      margin: '0 auto 1rem',
                      display: 'block'
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'var(--sh-gold)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.5rem',
                      fontWeight: 800,
                      margin: '0 auto 1rem',
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                )}

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Logged In &amp; Active
                </div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', margin: '0.35rem 0 0.25rem', color: '#0f172a' }}>
                  {user.name}
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.5rem' }}>
                  {user.email} • Your customer session is active.
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <Link
                    href={redirectUrl}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: 'var(--sh-black)',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      padding: '0.85rem 1.25rem',
                      borderRadius: 10,
                      textDecoration: 'none'
                    }}
                  >
                    <span>Enter System ({redirectUrl === '/account' ? 'My Account' : 'Shop Collections'})</span>
                    <ArrowRight size={16} />
                  </Link>

                  <button
                    type="button"
                    onClick={() => logout()}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      color: '#475569',
                      fontWeight: 600,
                      fontSize: '0.825rem',
                      padding: '0.65rem',
                      borderRadius: 10,
                      cursor: 'pointer'
                    }}
                  >
                    Switch Account / Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "1.75rem" }}>
                  <span
                    style={{
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      color: "var(--sh-gold, #cda143)",
                    }}
                  >
                    Welcome Back
                  </span>
                  <h1
                    style={{
                      fontFamily: "var(--font-serif, Georgia, serif)",
                      fontSize: "2rem",
                      lineHeight: 1.2,
                      margin: "0.35rem 0 0.5rem",
                      color: "var(--sh-black, #18181b)",
                    }}
                  >
                    Sign In to Your Account
                  </h1>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "var(--sh-text-secondary, #6b7280)",
                      margin: 0,
                      lineHeight: 1.5,
                    }}
                  >
                    Only registered customers can access the system.
                  </p>
                </div>

                {error && (
                  error.toLowerCase().includes('not registered') ? (
                    <div
                      role="alert"
                      aria-live="polite"
                      style={{
                        background: '#fffbeb',
                        color: '#92400e',
                        padding: '1.15rem',
                        borderRadius: 12,
                        fontSize: '0.85rem',
                        lineHeight: 1.5,
                        marginBottom: '1.25rem',
                        border: '1.5px solid #fde68a',
                      }}
                    >
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Sparkles size={17} color="#d97706" />
                        <span>Registration Required to Access the System</span>
                      </div>
                      <div style={{ marginBottom: '0.85rem', color: '#78350f' }}>
                        {error}
                      </div>
                      <Link
                        href={`/register?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectUrl)}`}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          background: '#d97706',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.825rem',
                          padding: '0.55rem 1.15rem',
                          borderRadius: 8,
                          textDecoration: 'none',
                          boxShadow: '0 2px 4px rgba(217,119,6,0.3)'
                        }}
                      >
                        <span>Register Free &amp; Access System</span>
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  ) : (
                    <div
                      role="alert"
                      aria-live="polite"
                      style={{
                        background: "var(--sh-ruby-bg, #fff1f2)",
                        color: "var(--sh-ruby, #be123c)",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-md, 10px)",
                        fontSize: "0.825rem",
                        lineHeight: 1.5,
                        marginBottom: "1.25rem",
                        border: "1px solid #fecdd3",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {error}
                    </div>
                  )
                )}

            <form
              onSubmit={handleSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.15rem",
              }}
            >
              <div>
                <label
                  htmlFor="login-email"
                  style={{
                    display: "block",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--sh-black, #18181b)",
                    marginBottom: "0.4rem",
                  }}
                >
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@email.com"
                    required
                    disabled={loading}
                    style={{
                      boxSizing: "border-box",
                      width: "100%",
                      padding: "0.75rem 1rem 0.75rem 2.4rem",
                      fontSize: "0.9rem",
                      borderRadius: "var(--radius-md, 10px)",
                      border: "1.5px solid var(--sh-border, #e5e7eb)",
                      outlineOffset: 2,
                      background: "#ffffff",
                      color: "var(--sh-black, #18181b)",
                    }}
                  />
                  <Mail
                    size={16}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "0.85rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--sh-text-muted, #9ca3af)",
                    }}
                  />
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "0.5rem",
                    marginBottom: "0.4rem",
                  }}
                >
                  <label
                    htmlFor="login-password"
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      color: "var(--sh-black, #18181b)",
                    }}
                  >
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    style={{
                      fontSize: "0.75rem",
                      color: "var(--sh-gold, #a77924)",
                      fontWeight: 600,
                      textDecoration: "none",
                    }}
                  >
                    Forgot password?
                  </Link>
                </div>

                <div style={{ position: "relative" }}>
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    style={{
                      boxSizing: "border-box",
                      width: "100%",
                      padding: "0.75rem 2.5rem 0.75rem 2.4rem",
                      fontSize: "0.9rem",
                      borderRadius: "var(--radius-md, 10px)",
                      border: "1.5px solid var(--sh-border, #e5e7eb)",
                      outlineOffset: 2,
                      background: "#ffffff",
                      color: "var(--sh-black, #18181b)",
                    }}
                  />
                  <Lock
                    size={16}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: "0.85rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--sh-text-muted, #9ca3af)",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    aria-pressed={showPassword}
                    disabled={loading}
                    style={{
                      position: "absolute",
                      right: "0.65rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "var(--sh-text-muted, #9ca3af)",
                      padding: "0.25rem",
                      border: "none",
                      background: "transparent",
                      cursor: "pointer",
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.45rem",
                  fontSize: "0.8rem",
                  color: "var(--sh-text-secondary, #6b7280)",
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  style={{
                    accentColor: "var(--sh-black, #18181b)",
                    width: 15,
                    height: 15,
                  }}
                />
                Remember me on this device
              </label>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.9rem",
                  background: "var(--sh-black, #18181b)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "var(--radius-md, 10px)",
                  fontSize: "0.925rem",
                  fontWeight: 700,
                  letterSpacing: "0.04em",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  marginTop: "0.35rem",
                }}
              >
                <span>{loading ? "Signing In..." : "Sign In to Account"}</span>
                {!loading && <ArrowRight size={17} />}
              </button>
            </form>

                <div
                  style={{
                    textAlign: "center",
                    marginTop: "1.75rem",
                    paddingTop: "1.25rem",
                    borderTop: "1px solid var(--sh-border, #e5e7eb)",
                    fontSize: "0.85rem",
                    color: "var(--sh-text-secondary, #6b7280)",
                    lineHeight: 1.6,
                  }}
                >
                  Don&apos;t have an account yet?{" "}
                  <Link
                    href={`/register?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectUrl)}`}
                    style={{
                      color: "var(--sh-ruby, #be123c)",
                      fontWeight: 700,
                      textDecoration: "underline",
                    }}
                  >
                    Register Free Here
                  </Link>
                </div>
              </>
            )}
          </section>
        </div>
      </main>

      <footer
        style={{
          textAlign: "center",
          padding: "1.5rem",
          fontSize: "0.75rem",
          color: "var(--sh-text-muted, #9ca3af)",
        }}
      >
        © {new Date().getFullYear()} SH Clothing Store • Cash on Delivery
        across Sri Lanka
      </footer>

      <style jsx global>{`
        @media (max-width: 820px) {
          .auth-split-grid {
            grid-template-columns: 1fr !important;
            max-width: 520px !important;
          }

          .auth-visual-panel {
            display: none !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            scroll-behavior: auto !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "var(--sh-cream, #fffafc)",
            color: "var(--sh-text-secondary, #6b7280)",
            fontSize: "0.9rem",
            fontWeight: 600,
          }}
        >
          Loading sign-in page...
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
