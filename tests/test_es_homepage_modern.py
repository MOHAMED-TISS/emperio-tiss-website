from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
html = (ROOT / "public/index.html").read_text(encoding="utf-8")
css = (ROOT / "public/assets/css/home-modern.css").read_text(encoding="utf-8")
js = (ROOT / "public/assets/js/home-modern.js").read_text(encoding="utf-8")

for needle in [
    "/assets/css/home-modern.css?",
    "/assets/js/home-modern.js?",
    "home-product-cards",
    "home-markets-map",
    "home-hero-media",
]:
    assert needle in html

for needle in [
    ".home-page .hero",
    ".home-page .home-hero-media",
    ".home-page .home-product-cards",
    ".home-page .home-markets-map",
    "@media (orientation:landscape)",
    "@media (prefers-reduced-motion:reduce)",
]:
    assert needle in css

for needle in [
    "IntersectionObserver",
    "requestAnimationFrame",
    "prefers-reduced-motion",
    "scroll-progress",
]:
    assert needle in js
