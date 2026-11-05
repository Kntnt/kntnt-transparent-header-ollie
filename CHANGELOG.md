# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/), and this project adheres to [Semantic Versioning](https://semver.org/). While the major version is `0`, the project makes no backwards-compatibility commitments: breaking changes can land in any release.

## [Unreleased]

## [0.4.0] – 2026-11-05

### Changed

- The plugin now decides when the header slides away, for every sticky header, instead of leaving it to Ollie Pro. The header slides away past its own height rather than at a fixed 100px, and comes back on the first scroll up of 4px or more. Ollie Pro's *Hide in Scroll Down* toggle stays the on/off switch.
- On the way down a transparent header keeps its appearance until it has slid out of sight, changes while hidden, and comes back opaque. It no longer turns solid at a fixed depth just before sliding away, which read as a flicker. A header that cannot slide away turns opaque at the threshold as before.
- The threshold is now 24px, up from 20px.
- **Opening a menu no longer turns the header solid.** The appearance follows the scroll position alone, so a panel opening over a dark hero hangs under a dark bar. A site that relied on the header as the panel's backdrop needs its own rule against `[aria-expanded="true"]`.
- `is-scrolled` is now also set on solid sticky headers, once the page has left the top. A rule that targets `.is-scrolled` without `.has-transparent-header` now matches those too.
- The text colour now fades along with the background and the shadow.
- The mega menu panel now hangs from the header's bottom edge at every width and under solid sticky headers too, not only over a transparent header on desktop.

### Added

- While a menu is open or the keyboard is inside the header it stays in view, and focus entering it brings it back. Tabbing into a hidden header used to leave the focus off-screen, behind the page.
- While the header shows, the page's scroll padding equals its height, published as `--kntnt-header-visible-height`, so neither focus nor an anchor target ends up under it. An anchor target that should land flush with the window's top can undo it with a negative `scroll-margin-top`.
- A sticky header casts no shadow while no page content lies under it.
- With reduced motion the slide and the fade happen at once.
- On paper the header is the page's first part, in its opaque appearance, without its menus and buttons.
- A test suite for the slide and appearance decisions, run with `composer test`.

### Removed

- The mega menu panel's fade on the header's timing. The header no longer fades when a panel opens, so there is nothing to keep it in step with, and the panel keeps Ollie Menu Designer's own fade.

## [0.3.0] – 2026-07-17

### Changed

- Renamed the plugin from *Kntnt Transparent Header for Ollie Pro* to *Kntnt Transparent Header for Ollie*. The old name pointed at the dependency rather than the plugin: it extends the sticky header that the Ollie theme and Ollie Pro ship together, but what it is *about* is that header, not Ollie Pro. Everything that carried the old name moved with it – the slug, text domain and plugin folder are now `kntnt-transparent-header-ollie`, the PHP namespace is `Kntnt\Transparent_Header_Ollie`, and the GitHub repository is now `Kntnt/kntnt-transparent-header-ollie`. Ollie Pro is still required and still named as the dependency; only this plugin's own name changed. Because the slug changed, an existing install does not update across the rename on its own: deactivate and delete the old plugin, then install the renamed one and activate it.

## [0.2.0] – 2026-07-17

### Added

- Mega menu panels now fade in on the header's own timing over a transparent header. Ollie Menu Designer fades a panel in over about 100ms while this plugin fades the header's background over 300ms, so over a transparent header the panel snapped in a fraction of a second before the header colour caught up behind it. The panel's opacity transition is matched to the header's – the same duration and easing, copied from Ollie Pro's slide because CSS cannot read another element's timing – so the two arrive as one surface. Applies only while the header is actually fading (transparent and turning solid) and only to the desktop dropdown, not the mobile overlay.
- Removed the bright band that flashed across the header's lower edge while a mega menu opened over the transparent header. Ollie Menu Designer positions the panel from the nav item's Top spacing, which sits inside the header's padding, so the panel overlapped the header by a narrow band; two semi-transparent copies of the same colour composite brighter than either, so mid-fade that overlap showed as a bright strip. A small script now measures the header's live bottom edge and hangs the panel flush against it, edge to edge, so there is no overlap to composite. It measures the panel's top before it paints, so a companion plugin that caps a tall menu's height reads the corrected edge without a shared signal.

## [0.1.0] – 2026-07-17

### Added

- Transparent-over-hero mode for Ollie's sticky header: transparent at the top of the page, fading to the header group's own background colour once scrolled past 20px and solid whenever a menu inside the header is open. The plugin ships no styling of its own – the solid state is whatever background you set on the group block in the Site Editor.
- A workaround for Ollie Pro leaving `--sticky-full-offset` unset unless a Top Offset is configured, which left a logged-in visitor a strip of header stuck to the top of the screen on viewports of 600px and below – where the admin bar stops being fixed and no longer hides it.
- A workaround for a specificity bug in the Ollie *theme*: its own reset that should drop the sticky header's top offset to zero on narrow screens (`@media (max-width: 600px) { … top: 0 }`) is outweighed by its unscoped base rule, so it never applies. On viewports of 600px and below – where core makes the admin bar `absolute` and it scrolls away with the page – a logged-in visitor was left a 46px strip of empty space above the header once the bar had scrolled out. Reinstated in pure CSS with a selector heavy enough to win, for solid sticky headers; the transparent header, being `fixed`, is handled separately (below).
- The same flush-to-top behaviour for the transparent header on viewports of 600px and below. Being `fixed` (to overlay the hero) it can't tuck under the admin bar in the flow like the solid header, so a small script – loaded only for logged-in visitors, and working only below 600px – tracks the admin bar's live bottom edge and feeds it to the header's top offset. The header tucks under the bar while it is visible and sits flush against the top of the viewport the moment the bar scrolls away.
- A workaround for Ollie Pro transitioning only `transform`, which made the background flip in a single frame instead of fading in step with the slide.
- `Requires Plugins: ollie-pro` header, so WordPress refuses to activate the plugin without Ollie Pro and deactivates it if Ollie Pro goes away.
- A silent guard that skips the header feature when the active theme is not Ollie (or one of its child themes). It stays quiet on purpose: Ollie Pro already reports a wrong theme, and a second notice would only repeat it.
- A PHP version guard in the main plugin file, as a second line of defence for installs that load the plugin outside the normal activation path.
- Self-updating from the project's GitHub releases: the plugin appears under *Dashboard → Updates* like any other, checking the repository named by its own `Plugin URI` header at most once every six hours. A release is only offered when it carries a ZIP asset served from GitHub's own download hosts, so a tampered header cannot redirect the update installer at an attacker's package. Update checks run under every theme, unlike the header feature – a site parked on another theme must not rot on an old version.
- `build-release-zip.sh`, which builds a release zip containing only runtime files, and can create or update the GitHub release and upload the asset. The asset name carries no version segment, keeping the `latest/download` URL stable.

[Unreleased]: https://github.com/Kntnt/kntnt-transparent-header-ollie/compare/v0.4.0...HEAD
[0.4.0]: https://github.com/Kntnt/kntnt-transparent-header-ollie/releases/tag/v0.4.0
[0.3.0]: https://github.com/Kntnt/kntnt-transparent-header-ollie/releases/tag/v0.3.0
[0.2.0]: https://github.com/Kntnt/kntnt-transparent-header-ollie/releases/tag/v0.2.0
[0.1.0]: https://github.com/Kntnt/kntnt-transparent-header-ollie/releases/tag/v0.1.0
