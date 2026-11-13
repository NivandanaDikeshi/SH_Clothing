"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  ShoppingBag,
  Menu,
  X,
  Truck,
  User,
  UserPlus,
  LogOut,
  ChevronDown,
} from "lucide-react";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

export const Header: React.FC = () => {
  const pathname = usePathname();

  // Hide header on login, register, and admin routes
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/login') || pathname.startsWith('/register'))) {
    return null;
  }

  const { totalItems, toggleCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const navLinkStyle = (active: boolean): React.CSSProperties => ({
    color: active ? "var(--sh-gold)" : "var(--sh-black)",
    transition: "color 0.2s ease",
    position: "relative",
    padding: "0.25rem 0",
    fontWeight: active ? 700 : 600,
    textDecoration: "none",
  });

  const mobileLinkStyle = (active: boolean): React.CSSProperties => ({
    color: active ? "var(--sh-gold)" : "var(--sh-black)",
    textDecoration: "none",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  });

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    closeMobileMenu();
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 999,
        background: "#ffffff",
        borderBottom: "1px solid var(--sh-border)",
      }}
    >
      {/* Top header */}
      <div
        className="sh-header-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.9rem 1.25rem",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        <div
          style={{
            maxWidth: 1440,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        />
      </div>

      {/* Main header */}
      <div
        className="sh-header-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
          padding: "0.9rem 1.25rem",
          maxWidth: 1440,
          margin: "0 auto",
        }}
      >
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
          className="mobile-only-btn"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--sh-black)",
            padding: "0.4rem",
            border: "none",
            background: "transparent",
            cursor: "pointer",
          }}
        >
          <Menu size={24} />
        </button>

        {/* Brand */}
        <Link
          href="/"
          aria-label="SH Clothing home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              position: "relative",
              background: "#000000",
              borderRadius: "50%",
              padding: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            <Image
              src="/logo.jpg"
              alt="SH Clothing Store logo"
              width={34}
              height={34}
              priority
              style={{ objectFit: "contain" }}
            />
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-serif)",
                fontSize: "1.25rem",
                fontWeight: 800,
                letterSpacing: "0.08em",
                color: "var(--sh-black)",
                lineHeight: 1.1,
              }}
            >
              SH CLOTHING
            </div>
            <div
              style={{
                fontSize: "0.65rem",
                fontWeight: 600,
                letterSpacing: "0.22em",
                color: "var(--sh-text-muted)",
                textTransform: "uppercase",
                marginTop: 3,
              }}
            >
              Sri Lanka • Export Edits
            </div>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="desktop-nav"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(1rem, 2vw, 2rem)",
            fontSize: "0.9rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          <Link href="/" style={navLinkStyle(pathname === "/")}>
            Home
            {pathname === "/" && <span className="sh-active-indicator" />}
          </Link>

          <Link href="/shop" style={navLinkStyle(pathname === "/shop")}>
            All Collection
            {pathname === "/shop" && <span className="sh-active-indicator" />}
          </Link>

          <Link href="/about" style={navLinkStyle(pathname === "/about")}>
            About
            {pathname === "/about" && <span className="sh-active-indicator" />}
          </Link>

          <Link
            href="/contact-faq"
            style={navLinkStyle(
              pathname === "/contact-faq" ||
                pathname === "/contact" ||
                pathname === "/faq"
            )}
          >
            Contact &amp; FAQ
          </Link>

          <Link
            href="/sales"
            style={{
              ...navLinkStyle(false),
              color: "var(--sh-ruby)",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontWeight: 700,
            }}
          >
            <span>Sales</span>
            <span
              style={{
                fontSize: "0.65rem",
                background: "var(--sh-ruby)",
                color: "#ffffff",
                padding: "0.1rem 0.45rem",
                borderRadius: "var(--radius-full)",
                fontWeight: 800,
                letterSpacing: "0.04em",
              }}
            >
              DEALS
            </span>
          </Link>
        </nav>

        {/* Header actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.85rem",
            flexShrink: 0,
          }}
        >
          {/* Desktop authentication */}
          <div className="desktop-auth-container">
            {!isAuthenticated ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Link
                  href="/login"
                  title="Sign in to your account"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    color: "var(--sh-black)",
                    padding: "0.45rem 0.85rem",
                    borderRadius: "var(--radius-full)",
                    background: "var(--sh-sand)",
                    border: "1px solid var(--sh-border)",
                    textDecoration: "none",
                  }}
                >
                  <User size={15} />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  title="Create a customer account"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.4rem",
                    fontSize: "0.825rem",
                    fontWeight: 700,
                    color: "#ffffff",
                    background: "var(--sh-black)",
                    padding: "0.45rem 0.95rem",
                    borderRadius: "var(--radius-full)",
                    textDecoration: "none",
                    boxShadow: "var(--shadow-sm)",
                  }}
                >
                  <UserPlus size={14} />
                  <span>Register</span>
                </Link>
              </div>
            ) : (
              <div style={{ position: "relative" }}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen((open) => !open)}
                  aria-expanded={userDropdownOpen}
                  aria-label="Toggle account menu"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "var(--radius-full)",
                    background: "var(--sh-sand)",
                    border: "1px solid var(--sh-border)",
                    fontSize: "0.825rem",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user?.name || "User"}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        objectFit: "cover",
                        border: "1.5px solid var(--sh-gold)",
                        display: "block"
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: "var(--sh-gold)",
                        color: "#ffffff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.75rem",
                        fontWeight: 800,
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase() || "U"}
                    </span>
                  )}
                  <span
                    style={{
                      maxWidth: 110,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {user?.name?.split(" ")[0] || "Account"}
                  </span>
                  <ChevronDown
                    size={14}
                    style={{ color: "var(--sh-text-muted)" }}
                  />
                </button>

                {userDropdownOpen && (
                  <>
                    <button
                      type="button"
                      aria-label="Close account menu"
                      onClick={() => setUserDropdownOpen(false)}
                      style={{
                        position: "fixed",
                        inset: 0,
                        width: "100%",
                        height: "100%",
                        border: "none",
                        background: "transparent",
                        zIndex: 998,
                        cursor: "default",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        right: 0,
                        top: "calc(100% + 8px)",
                        width: 230,
                        background: "#ffffff",
                        borderRadius: "var(--radius-lg)",
                        boxShadow: "var(--shadow-xl)",
                        border: "1px solid var(--sh-border)",
                        padding: "0.6rem",
                        zIndex: 999,
                      }}
                    >
                      <div
                        style={{
                          padding: "0.6rem 0.75rem",
                          borderBottom: "1px solid var(--sh-border)",
                          marginBottom: "0.4rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.65rem",
                        }}
                      >
                        {user?.avatar ? (
                          <img
                            src={user.avatar}
                            alt={user?.name || "Customer"}
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              objectFit: "cover",
                              border: "2px solid var(--sh-gold)",
                              flexShrink: 0,
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: 38,
                              height: 38,
                              borderRadius: "50%",
                              background: "var(--sh-gold)",
                              color: "#ffffff",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontWeight: 800,
                              fontSize: "0.95rem",
                              flexShrink: 0,
                            }}
                          >
                            {user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div
                            style={{
                              fontSize: "0.68rem",
                              color: "var(--sh-text-muted)",
                              textTransform: "uppercase",
                              letterSpacing: "0.05em",
                            }}
                          >
                            Signed in as
                          </div>
                          <div
                            style={{
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              color: "var(--sh-black)",
                              marginTop: 1,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {user?.name || "Customer"}
                          </div>
                          <div
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--sh-text-secondary)",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {user?.email || ""}
                          </div>
                        </div>
                      </div>

                      <Link
                        href="/account"
                        onClick={() => setUserDropdownOpen(false)}
                        className="sh-dropdown-link"
                      >
                        <User size={15} />
                        <span>My Profile &amp; Orders</span>
                      </Link>

                      <Link
                        href="/track-order"
                        onClick={() => setUserDropdownOpen(false)}
                        className="sh-dropdown-link"
                      >
                        <Truck size={15} />
                        <span>Track COD Order</span>
                      </Link>

                      <div
                        style={{
                          borderTop: "1px solid var(--sh-border)",
                          marginTop: "0.4rem",
                          paddingTop: "0.4rem",
                        }}
                      >
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="sh-dropdown-link sh-logout-button"
                        >
                          <LogOut size={15} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Shopping cart */}
          <button
            type="button"
            onClick={toggleCart}
            aria-label={`Shopping bag with ${totalItems} items`}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 42,
              height: 42,
              borderRadius: "50%",
              background: "var(--sh-black)",
              color: "#ffffff",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -3,
                  right: -3,
                  background: "var(--sh-gold)",
                  color: "#ffffff",
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  minWidth: 20,
                  height: 20,
                  padding: "0 4px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                }}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileMenuOpen && (
        <div
          className="sh-mobile-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          <button
            type="button"
            className="sh-mobile-backdrop"
            onClick={closeMobileMenu}
            aria-label="Close navigation menu"
          />

          <div className="sh-mobile-drawer">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <Link
                href="/"
                onClick={closeMobileMenu}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.6rem",
                  textDecoration: "none",
                  color: "var(--sh-black)",
                }}
              >
                <span
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "#000000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <Image
                    src="/logo.jpg"
                    alt="SH Clothing logo"
                    width={28}
                    height={28}
                    style={{ objectFit: "contain" }}
                  />
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                  }}
                >
                  SH CLOTHING
                </span>
              </Link>

              <button
                type="button"
                onClick={closeMobileMenu}
                aria-label="Close navigation menu"
                style={{
                  padding: "0.3rem",
                  color: "var(--sh-text-secondary)",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile authentication */}
            <div style={{ marginBottom: "1.5rem" }}>
              {!isAuthenticated ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "0.6rem",
                  }}
                >
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="sh-mobile-auth-link"
                  >
                    <User size={16} /> Login
                  </Link>
                  <Link
                    href="/register"
                    onClick={closeMobileMenu}
                    className="sh-mobile-register-link"
                  >
                    <UserPlus size={16} /> Register
                  </Link>
                </div>
              ) : (
                <div
                  style={{
                    background: "var(--sh-sand)",
                    padding: "0.85rem",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--sh-border)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.6rem",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user?.name || "Customer"}
                        style={{
                          width: 38,
                          height: 38,
                          borderRadius: "50%",
                          objectFit: "cover",
                          border: "2px solid var(--sh-gold)",
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: "50%",
                          background: "var(--sh-gold)",
                          color: "#ffffff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          flexShrink: 0,
                        }}
                      >
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: "0.875rem" }}>
                        {user?.name || "Customer"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.725rem",
                          color: "var(--sh-text-muted)",
                          overflowWrap: "anywhere",
                        }}
                      >
                        {user?.email || ""}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <Link
                      href="/account"
                      onClick={closeMobileMenu}
                      className="sh-mobile-account-link"
                    >
                      My Account
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="sh-mobile-account-link sh-mobile-logout"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile links */}
            <nav
              aria-label="Mobile navigation links"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                fontSize: "1rem",
                fontWeight: 600,
                flex: 1,
                overflowY: "auto",
              }}
            >
              <Link
                href="/"
                onClick={closeMobileMenu}
                style={mobileLinkStyle(pathname === "/")}
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={closeMobileMenu}
                style={mobileLinkStyle(pathname === "/shop")}
              >
                All Collection
              </Link>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                style={mobileLinkStyle(pathname === "/about")}
              >
                About
              </Link>
              <Link
                href="/contact-faq"
                onClick={closeMobileMenu}
                style={mobileLinkStyle(
                  pathname === "/contact-faq" ||
                    pathname === "/contact" ||
                    pathname === "/faq"
                )}
              >
                Contact &amp; FAQ
              </Link>
              <Link
                href="/sales"
                onClick={closeMobileMenu}
                style={{
                  ...mobileLinkStyle(pathname === "/sales"),
                  color: "var(--sh-ruby)",
                }}
              >
                Sales &amp; Special Deals
                <span
                  style={{
                    fontSize: "0.65rem",
                    background: "var(--sh-ruby)",
                    color: "#ffffff",
                    padding: "0.1rem 0.4rem",
                    borderRadius: 4,
                  }}
                >
                  HOT
                </span>
              </Link>

              <hr
                style={{
                  border: "none",
                  borderTop: "1px solid var(--sh-border)",
                  margin: "0.5rem 0",
                }}
              />

              <div
                style={{
                  fontSize: "0.75rem",
                  color: "var(--sh-text-muted)",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Customer Care &amp; Services
              </div>

              <Link
                href="/track-order"
                onClick={closeMobileMenu}
                style={{ ...mobileLinkStyle(pathname === "/track-order"), color: "var(--sh-gold)" }}
              >
                <Truck size={17} /> Track COD Order
              </Link>
              <Link
                href="/shipping-returns"
                onClick={closeMobileMenu}
                style={{
                  ...mobileLinkStyle(pathname === "/shipping-returns"),
                  fontSize: "0.9rem",
                  color: "var(--sh-text-secondary)",
                }}
              >
                Shipping Rates &amp; Exchanges
              </Link>
            </nav>

            {/* Drawer footer */}
            <div
              style={{
                paddingTop: "1rem",
                borderTop: "1px solid var(--sh-border)",
                fontSize: "0.75rem",
                color: "var(--sh-text-muted)",
              }}
            >
              <div>TikTok Drops: @sh.clothing.store</div>
              <div style={{ marginTop: 4 }}>
                Islandwide Cash on Delivery • Sri Lanka
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .sh-active-indicator {
          position: absolute;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
          width: 16px;
          height: 2px;
          background: var(--sh-gold);
          border-radius: 2px;
        }

        .sh-dropdown-link {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.6rem 0.75rem;
          font-size: 0.825rem;
          color: var(--sh-black);
          border-radius: var(--radius-sm);
          font-weight: 500;
          text-align: left;
          text-decoration: none;
          background: transparent;
          border: none;
          cursor: pointer;
        }

        .sh-dropdown-link:hover {
          background: var(--sh-sand);
        }

        .sh-dropdown-link svg {
          color: var(--sh-gold);
          flex-shrink: 0;
        }

        .sh-logout-button {
          color: var(--sh-ruby);
          font-weight: 600;
        }

        .sh-logout-button svg {
          color: var(--sh-ruby);
        }

        .sh-mobile-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
        }

        .sh-mobile-backdrop {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          border: none;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(3px);
          cursor: pointer;
        }

        .sh-mobile-drawer {
          position: relative;
          width: 84%;
          max-width: 320px;
          height: 100%;
          padding: 1.75rem 1.5rem;
          background: #ffffff;
          display: flex;
          flex-direction: column;
          box-shadow: var(--shadow-xl);
          overflow-y: auto;
          animation: sh-slide-left 0.25s ease;
        }

        .sh-mobile-auth-link,
        .sh-mobile-register-link {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          padding: 0.65rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          font-weight: 600;
          text-decoration: none;
        }

        .sh-mobile-auth-link {
          border: 1.5px solid var(--sh-border);
          background: var(--sh-sand);
          color: var(--sh-black);
        }

        .sh-mobile-register-link {
          background: var(--sh-black);
          color: #ffffff;
        }

        .sh-mobile-account-link {
          flex: 1;
          text-align: center;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--sh-black);
          background: #ffffff;
          padding: 0.45rem;
          border-radius: 4px;
          border: 1px solid var(--sh-border);
          text-decoration: none;
          cursor: pointer;
        }

        .sh-mobile-logout {
          color: var(--sh-ruby);
        }

        @keyframes sh-slide-left {
          from {
            opacity: 0;
            transform: translateX(-12px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (max-width: 900px) {
          .desktop-nav,
          .desktop-auth-container {
            display: none !important;
          }
        }

        @media (min-width: 901px) {
          .mobile-only-btn {
            display: none !important;
          }
        }

        @media (max-width: 420px) {
          .sh-header-container {
            padding-left: 0.75rem !important;
            padding-right: 0.75rem !important;
            gap: 0.5rem !important;
          }

          .sh-header-container > a > div:last-child > div:first-child {
            font-size: 1rem !important;
          }

          .sh-header-container > a > div:last-child > div:last-child {
            font-size: 0.52rem !important;
            letter-spacing: 0.12em !important;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .sh-mobile-drawer {
            animation: none;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
