# Kntnt Transparent Header for Ollie

[![Requires WordPress: 6.5+](https://img.shields.io/badge/WordPress-6.5+-blue.svg)](https://wordpress.org)
[![Requires PHP: 8.3+](https://img.shields.io/badge/PHP-8.3+-blue.svg)](https://php.net)
[![License: GPL v2+](https://img.shields.io/badge/License-GPLv2+-blue.svg)](https://www.gnu.org/licenses/old-licenses/gpl-2.0.html)
[![Latest release](https://img.shields.io/github/v/release/Kntnt/kntnt-transparent-header-ollie)](https://github.com/Kntnt/kntnt-transparent-header-ollie/releases/latest)

Lets Ollie's sticky header lie transparently over your hero image, then fade to its normal colour as the visitor scrolls.

## Description

You have built a site with the **Ollie** theme and **Ollie Pro**, you have a hero image at the top of the page, and you want the header to float over it – no bar of colour cutting across the picture – and then turn solid once the visitor scrolls down. This plugin does exactly that, and nothing else.

It is for anyone running Ollie and Ollie Pro who wants that effect without writing the CSS themselves. Install it, tick one box in the Site Editor, and you are done.

### Key features

- **Transparent over the hero.** At the top of the page the header has no background and no shadow. Your hero image starts at the very top of the screen.
- **No flicker on the way down.** The header keeps its look until it has slid out of sight, changes while hidden, and comes back in the background colour *you* chose in the Site Editor. Back above 24 pixels it turns transparent again. The plugin ships no colours of its own and never overrides your design.
- **Menus leave it alone.** Opening a mega menu or the mobile menu changes nothing about the header: its appearance follows the scroll position alone.
- **Slides away at the right moment.** Past the header's own height rather than a fixed distance, and back on the first scroll up of 4 pixels or more. It stays while a menu is open or the keyboard is inside it, and focus entering it brings it back.
- **Nothing hides behind it.** While the header shows, the page's scroll padding equals its height, so neither keyboard focus nor an anchor target ends up under it.
- **Mega menus hang flush.** An [Ollie Menu Designer](https://olliewp.com/menu-designer/) mega menu hangs from the header's bottom edge at every width, under transparent and solid sticky headers alike.
- **Reduced motion and print.** With reduced motion the slide and the fade happen at once. On paper the header is the page's first part, in its opaque look, without its menus and buttons.
- **No flash on page load.** The header is transparent from the very first frame, not solid-then-corrected.
- **Fixes two Ollie Pro bugs** along the way (see [Why you can't simplify this](#why-you-cant-simplify-this)).
- **No settings page.** One class in the Site Editor is the whole configuration.
- **Updates itself** from GitHub, like any plugin from wordpress.org.

### The problem

Ollie and Ollie Pro give you a sticky header that hides when you scroll down and comes back when you scroll up. What they have no concept of is a *transparent* header – the word appears nowhere in either of them. So the header always carries its background colour, and a hero image can never reach the top of the screen; there is always a band of colour above it.

Doing it by hand is harder than it looks. The header has to leave the document flow or it pushes the hero down; the rule that does that has to beat the theme's own rule at identical specificity; the fade has to be added without touching a property Ollie Pro is already animating, or the header stops sliding and starts snapping. Get any of it slightly wrong and it fails silently.

### How this plugin helps

It does that work once, correctly, as a mechanism with no design opinions. You keep choosing the colours; the plugin only decides *when* the header is transparent and when it is not.

## Requirements

* **WordPress:** 6.5 or later
* **PHP:** 8.3 or later
* **Theme:** Ollie, or any child theme of it
* **Plugin:** Ollie Pro

Both requirements are enforced, and neither nags you:

- **Ollie Pro** is declared in the `Requires Plugins` header, so WordPress will not let you activate this plugin without it, and deactivates this one if you deactivate Ollie Pro. That header is also what sets the WordPress floor: it landed in 6.5, and on anything older it is ignored, so the plugin would activate with no Ollie Pro present. Nothing else here needs a WordPress newer than that.
- **The Ollie theme** is checked when the plugin loads. Under any other theme it loads no styles or scripts and touches nothing on your pages, and says nothing about it either.

## Installation

1. Download [kntnt-transparent-header-ollie.zip](https://github.com/Kntnt/kntnt-transparent-header-ollie/releases/latest/download/kntnt-transparent-header-ollie.zip).
2. In WordPress, go to **Plugins → Add New → Upload Plugin**.
3. Choose the file you downloaded and click **Install Now**.
4. Click **Activate**.

That is the normal WordPress upload route – nothing special. The plugin is not on wordpress.org, but it updates itself from its GitHub releases: new versions appear under **Dashboard → Updates** and install with one click, exactly like any other plugin.

## Usage

Two steps in the Site Editor. No CSS required.

### 1. Build the header template part

1. **Appearance → Editor** → *Patterns* → *Template parts* → **Add new**. Name it `Header`, area **Header**.

2. Add a **Group** block as the outermost block. It must be a Group – Ollie Pro's sticky controls appear on no other block.

3. Select the group → **Position → Sticky**.

4. Ollie Pro's controls now appear under Position:

   1. *Hide in Scroll Down:* Check — this one is required. Without it, Ollie Pro writes an inline `position: sticky` onto the header, which the plugin's stylesheet can't override, so the header stays solid and never goes transparent. It is also the on/off switch for sliding away, though this plugin decides when that happens.

   2. *Top Offset:* 0

   3. *Unstick on Mobile*: Has no effect with *Hide in Scroll Down* on.

   4. *Sticky Z-Index*: empty

5. Put the logo, navigation and so on **inside** the group.

6. Give the group a **background colour**. This is the solid state – what you see once scrolled.

> [!NOTE]
> The plugin puts `position: fixed` on the `header` itself, which already lifts it over the hero; Ollie Pro's z-index lands on the group *inside* that header, where it changes nothing.

> [!IMPORTANT]
>
> **Don't set a hover colour on the header group.**
>
> Ollie Pro writes the `transition` shorthand for both `hoverTextColor` and `stickyOnScrollUp` at equal specificity; the hover rule wins on source order and kills the slide. Put hover colours on the links inside the header instead.

### 2. Turn on transparent mode

Do this on **the templates where you want a transparent header**. Those are the only templates that change; all your others keep their normal solid header.

1. Go to **Appearance → Editor** → *Templates* and click the template you want – for example *Front Page*.

2. Click the pencil (**Edit**) to open it.

3. Click **once** on the header at the very top of the template. The little toolbar that pops up must say **Template Part**. If it names another block, you have clicked something *inside* the header – press **Esc** until *Template Part* appears.

4. In the sidebar on the right, scroll down and open **Advanced**.

5. Click into **Additional CSS class(es)** and type `has-transparent-header`. If something is already in the field – Ollie's templates put `site-header` there – leave it and add yours after a space.

6. Click **Save**.

Repeat for each template where you want it.

That's the whole configuration. The hero should be the first block in `main`, with no top margin – the header lays over it.

If your logo or links are hard to read against the hero, that is expected – they keep their normal colour. See [Colouring the header's contents](#colouring-the-headers-contents-against-the-hero) below.

> [!IMPORTANT]
> **The header must come out as a `<header>` element.**
>
> That is what transparent mode hangs on: every rule implementing it starts with `header.has-transparent-header`, and Ollie's own sticky rule keys on the tag as well. Land the header in a `<div>` instead and nothing happens at all – no error, no effect, just a header that stays solid.
>
> **Using Ollie's ready-made header? Then it is already taken care of, and there is nothing for you to do.** Ollie's templates ship the header part with the tag set explicitly, and the part you built in step 1 carries the **Header** area, which produces `<header>` on its own.

> [!IMPORTANT]
> **Never put the Template Part inside a Group block.**
>
> The Group belongs **inside** the header part, as in step 1 – never around it. Wrap the part in a Group and the sticky header dies silently: no error, no warning, the header just scrolls away with the page like any ordinary block.
>
> The reason is that Ollie makes the header sticky in pure CSS – `body:not(.wp-admin) header:has(>.is-position-sticky) { position: sticky }` – so the `<header>` element itself is the thing that sticks. A sticky element can never leave its parent's box, and a wrapping Group shrinks to exactly the header's height, which leaves it no room at all to travel. Stock Ollie ships no wrapper for precisely this reason.
>
> The usual way people fall into it is adding a Group *‘just to have somewhere to put the class’*. Don't. The class goes on the **Template Part** block itself – Advanced → Additional CSS class(es), as in step 2.

> [!WARNING]
> **Ollie's Academy teaches a different structure. Use step 1's instead.**
>
> The lesson [Sticky headers using sticky positioning](https://olliewp.com/lesson/using-sticky-positioning-for-sticky-a/) wraps the header part in a Group and makes *that* sticky. It works – but this plugin reads the opposite structure: the sticky Group **inside** the `<header>`, as step 1 builds it. With the Group outside, nothing matches and the header stays solid, silently.
>
> No trade-off: Ollie's header pattern already has that Group inside, and the theme ships the CSS to make the header sticky from it – `header:has(>.is-position-sticky)`. Step 1 only switches it on. Same sticky, hide-on-scroll header, plugin or not, and the only one that can go transparent.

## Questions, bugs and feature requests

Have a usage question or something to discuss? Please use [Discussions](https://github.com/Kntnt/kntnt-transparent-header-ollie/discussions).

Found a bug or want to request a feature? Please [open an issue](https://github.com/Kntnt/kntnt-transparent-header-ollie/issues). Search the existing issues first to avoid duplicates.

## Extending

Everything below is for developers who want to push the effect further. The plugin has no filters and no API – it is CSS classes and a stylesheet, so you extend it by writing CSS against those classes, in **Styles → Additional CSS** in the Site Editor or in a child theme's `theme.json` under `styles.css`.

The public contract is two classes and a custom property:

| Name | Who sets it |
|---|---|
| `has-transparent-header` | You, on the Template Part block |
| `is-scrolled` | The plugin, on the header group, while the header is opaque with page content under it. On a transparent header that is its solid appearance. On a solid sticky header it means the page has left the top |
| `--kntnt-header-visible-height` | The plugin, on the root element: how much of the window's top the header covers, `0px` while it is slid away. The stylesheet uses it as the page's scroll padding. An anchor target that should land flush with the window's top despite it can take `scroll-margin-top: calc(-1 * var(--kntnt-header-visible-height))` |

### Colouring the header's contents against the hero

Logo and links keep their normal colour, which may be unreadable over a hero image. The transparent state is the **absence** of `is-scrolled`, so target that:

```css
header.has-transparent-header > .wp-block-group:not(.is-scrolled) :where(a, svg) {
  color: var(--wp--preset--color--base);
  fill: currentColor;
}
```

`:where()` contributes no specificity, so the selector stays low enough to be easy to override but still beats the theme's generated link-colour rule.

### Partial opacity

The plugin's default is all-or-nothing: fully transparent at the top, your colour when scrolled. That covers almost every design. If you need something in between, write it yourself – the two states are plain CSS selectors.

**20% at the top, 90% when scrolled:**

```css
/* Top state. `!important` is unavoidable: core emits the block's own preset
   background as `.has-<slug>-background-color { background-color: … !important }`. */
header.has-transparent-header > .wp-block-group:not(.is-scrolled) {
  background-color: color-mix(in srgb, var(--wp--preset--color--primary) 20%, transparent) !important;
}

/* Scrolled state. */
header.has-transparent-header > .wp-block-group.is-scrolled {
  background-color: color-mix(in srgb, var(--wp--preset--color--primary) 90%, transparent) !important;
}
```

Both ends interpolate – colour *and* alpha – over the same 300ms as the slide, because the plugin already transitions `background-color`.

You can equally use literal colours, including 8-digit hex: `#fff20033` at the top, `#fff200e6` when scrolled.

**Never write the `transition` shorthand on the header group.** Ollie Pro sets `transition: transform …` on it at specificity (0,2,0). Any shorthand that also lands there resets the transform transition and the header will **snap instead of slide**. Add properties with `transition-property` only – the plugin already does this, so normally you need not touch it at all.

### Why the transparent state has no class of its own

You may expect an `is-transparent` class. There isn't one, deliberately.

A class added by JavaScript cannot exist in the first paint. If transparency depended on one, every page load would render the solid header first, then add the class, then animate it away – a visible flash of colour. Measured on a real site: ~90ms of solid background followed by a 300ms fade.

Making the top state the **default** – the state that needs no class and no script – means it is already correct in the first paint. That is why the selector is `:not(.is-scrolled)` and not `.is-transparent`.

The reverse case (loading a page that is already scrolled) renders transparent for a moment and then fades to solid. That is far less jarring, and scroll restoration happens after paint anyway.

### Known limits

- **The opaque threshold is 24px and the jitter 4px**, both hardcoded in this plugin (`OPAQUE_THRESHOLD` and `JITTER` in `js/header.js`). There is no filter for them; change them in a fork if you must.
- **The header is in the flow when solid** (`position: sticky`) but **out of the flow when transparent** (`position: fixed`). That is deliberate – it cannot lie over the hero otherwise – and it is why no spacer is needed.

### Troubleshooting

Paste in the browser console on a hero page:

```js
const g = document.querySelector('header > .wp-block-group.is-position-sticky');
if (!g) {
  console.log('Not found: no sticky Group directly inside a <header>. Either the header did not come out as a <header> element, or the sticky Group is not its direct child.');
} else {
  console.log({
    wrapper: g.closest('header').parentElement.className,
    headerPos: getComputedStyle(g.closest('header')).position,
    transition: getComputedStyle(g).transition,
  });
}
```

- **Not found** means the structure itself is wrong, and it is the most common cause of ‘nothing happens at all’: check the header is a `<header>` element and that the Group sits directly inside it, as in step 1.
- `wrapper` **must** be `wp-site-blocks`. If it says `wp-block-group` you have a wrapper – see step 2.
- `headerPos` should be `fixed` on a transparent header, `sticky` otherwise. If it is `sticky` on a template that should be transparent, check that *Hide in Scroll Down* is enabled (step 1) – without it Ollie Pro forces `sticky` inline and the plugin can't take over.
- `transition` must contain `transform 0.3s …` **plus** `background-color`. If you see only `color 0.2s`, something set a hover colour on the group.

## How you can contribute

Contributions are welcome, small or large. [`CONTRIBUTING.md`](CONTRIBUTING.md) is the whole story: what to install, how to fork and clone, the quality gates your change has to pass, how to open the pull request and which kinds of change are likely to be merged.

## Development

This section is for developers reading the code – whether to satisfy your curiosity, to judge whether the plugin is sound before you trust it on a site or to orient yourself before you change something. It explains why the code is what it is, and nothing about the mechanics of working on it. For those – setup, gates, pull requests, builds – see [`CONTRIBUTING.md`](CONTRIBUTING.md).

### Why you can't simplify this

The whole plugin is a short stylesheet and three scripts. Every rule looks naive or removable, and every one is load-bearing. The obvious cleanup is listed against each, because that cleanup is how each bug gets reintroduced.

| Rule | The tempting ‘fix’ | What it costs |
|---|---|---|
| `--sticky-full-offset: var(--wp-admin--admin-bar--height, 0px)` | Fold it into the `.is-away` rule, its only reader in this codebase. | The slide away is `translateY(calc(-100% - var(--sticky-full-offset)))`, as in Ollie Pro, which only sets that variable when a Top Offset is configured, while Ollie pins the header down by the admin bar's height regardless. A Top Offset must still win, so the variable stays a variable. The header then stops exactly that far short of the top. The admin bar masks the leftover band while it is fixed, but at 600px and below core makes it `absolute` and it scrolls away – leaving a logged-in visitor a 46px strip of header stuck to the top of the screen. Measured, not theorised. |
| `transform: none` on `:not(.is-away)`, and the `.is-away` rule | Delete both and let Ollie Pro's `.is-sticky-hidden` move the header – it already does. | Ollie Pro hides at a fixed 100px whatever the header's height, and knows nothing of focus or open panels: tabbing into a hidden header leaves the focus off-screen. Its script cannot be switched off without losing the toggle this plugin hangs on, so its classes keep being set and are made inert here. `none` rather than `translateY(0)`, because any transform makes the group the containing block of every fixed element inside it. |
| `z-index: 100 !important` on the header | Delete it – the theme's sticky rule already says 100. | Ollie Pro's script writes `z-index: -1` inline once *its* hide has finished. A header brought back by focus would then sit behind the page while Ollie Pro still thinks it hidden. Only `!important` beats an inline style. |
| a timer for ‘the slide has finished’ | Use `transitionend`. | With reduced motion there is no transition to end, and a resize can cancel one that has begun. Either would leave a hidden header transparent, so it would come back transparent over the page's content. |
| `transition-property: transform, background-color, box-shadow, color` | Collapse it into the `transition` shorthand. | The shorthand resets Ollie Pro's own `transition: transform …` at equal specificity, and the header snaps instead of sliding. The longhand overrides only the property list, so duration and timing stay inherited from Ollie Pro's rule and the fade cannot drift out of step with the slide. |
| `position: fixed` on `.has-transparent-header` | Add `!important` to make it win. | It already wins, and not by specificity: Ollie's sticky rule ties it exactly at (0,2,2). It wins on source order alone – which is why the stylesheet is enqueued at priority 20 with a dependency on the `ollie` handle. Change either and the header goes back to `sticky`, in the flow, pushing the hero down. `!important` would paper over that and hide the real dependency. |
| `top: var(--kntnt-admin-bar-offset, …)` on `.has-transparent-header`, fed by `admin-bar-offset.js` | Replace it with a static `calc(var(--wp-admin--admin-bar--height))` – the solid header's reset uses a static value, so why not this one. | The solid header is `sticky`, so a static `top` works: in the flow it tucks under the bar by itself. This one is `fixed`, so a static value is wrong at one end – `46px` strands it below an empty band once the admin bar has scrolled out at ≤600px (core makes it `absolute` there but never zeroes `--wp-admin--admin-bar--height`); `0px` overlaps the bar at the very top. The correct offset is the bar's visible bottom edge, which depends on scroll position – the one thing CSS cannot read. So the script measures it (`getBoundingClientRect().bottom`, clamped at 0) into the variable, and CSS consumes it. The fallback keeps the static height before the script runs, with no JS, and for every logged-out visitor. |
| loading `admin-bar-offset.js` only when `is_admin_bar_showing()`, and only working below 600px | Merge it into `header.js` and drop the guards – one script is simpler than two. | The offset only exists while an admin bar does, which is a logged-in concern; `header.js`'s `is-scrolled` job is needed for *every* visitor. Merge them and every public visitor downloads code that can never run for them – and it lands in the very bundle a cache plugin minifies and combines, whereas a logged-in-only script is left alone. Above 600px the admin bar is fixed and the offset is the constant the fallback already resolves, so the script attaches its scroll listener only below 600px (`matchMedia`) and clears the variable above it. The server can't see the viewport width at request time, so this is as far as loading can be narrowed. |
| `@media (max-width: 600px) { header:not(.has-transparent-header):has(> [data-sticky-on-scroll-up]) { top: 0 } }` | Delete it – the Ollie *theme* already ships a `top: 0` reset for narrow screens, so this looks redundant. | The theme's reset is dead code. Its selector `header:has(> .is-position-sticky)` (0,1,1) is outweighed by the theme's own unscoped base rule `body:not(.wp-admin) header:has(> .is-position-sticky)` (0,2,2), and media queries add no specificity – so `top` stays at the admin bar's height. At 600px and below core makes the admin bar `absolute` and it scrolls off with the page, leaving the header resting 46px below the top with an empty band above it. This rule reinstates the intended reset with a selector heavy enough to win (0,4,2). Pure CSS suffices because the header is `sticky`: `top: 0` tucks it under the bar in the flow at the very top and sits it flush once stuck. It excludes `.has-transparent-header`, which is `fixed` and sets its own `top` in the rule above. |
| `background-color: transparent !important` on `:not(.is-scrolled)` | Drop the `!important`, or turn the header solid while a menu is open. | The `!important` is not defensiveness: core emits the group's own preset background as `.has-<slug>-background-color { background-color: … !important }`, which nothing without `!important` can beat. A header that turns solid when a menu opens is a switch the reader did not ask for, and the most disturbing one for a small panel. The appearance follows the scroll position alone. |
| `is-scrolled` waiting for the slide to finish | Add it at the threshold, as the name suggests. | The header would turn opaque just before sliding away, which reads as a flicker. |
| the `is-scrolled` toggle in `js/header.js` | Have it add `is-transparent` instead – it reads more naturally. | A script-set class cannot exist at first paint, so every page load would render solid, then fade to transparent: a visible flash. Transparency has to be the *default*, i.e. the absence of a class. See [Why the transparent state has no class of its own](#why-the-transparent-state-has-no-class-of-its-own). |
| `top: var(--kntnt-mega-menu-top, 100%) !important` on the panel, fed by `js/mega-menu-offset.js` | Drop it – let Ollie place the panel where its *Top spacing* setting says. | Ollie measures the panel's top from the nav item it belongs to, which sits inside the header's vertical padding, so the panel overlaps the header by a narrow band, and on a phone, where the setting is cleared, covers it. Hanging the panel from the header's rendered bottom edge removes the overlap. That edge is per-site and per-design and CSS cannot read it, so the script measures it into the variable; `!important` beats the inline `top` Ollie's own block script writes, and the custom-property indirection keeps that script from clobbering the position on resize. |

### Why some of those rules aren't scoped to the class

Transparent mode is opt-in per template, so every rule that implements it is scoped to `header.has-transparent-header`. On a template that never opted in, the plugin changes nothing.

The rest of the table breaks that pattern on purpose, because what it does has nothing to do with transparency. `--sticky-full-offset` and the transition property list key off `.wp-block-group[data-sticky-on-scroll-up="true"]`. Sliding away, the `z-index`, the scroll padding, the shadow at the top, the panel's `top`, reduced motion and print key off that group directly inside a `<header>`. All of them reach *every* sticky header, transparent or not. The `top: 0` reset reaches every *solid* sticky header, explicitly excluding `.has-transparent-header`, which is `fixed` and positions itself. Scope any of them to the transparent class and a solid header on the same site loses the fix. It is also why the stylesheet and the header script are enqueued on every page rather than only the transparent ones.

Unscoped is not the same as intrusive, and none of them can touch a design it wasn't asked to: no colour, spacing or type comes from any of them. They need Ollie Pro's *Hide in Scroll Down* on the group, so a header without that toggle is untouched.

### Project layout

```
kntnt-transparent-header-ollie.php   Plugin header, PHP guard, bootstrap
autoloader.php                           PSR-4 → classes/
classes/Plugin.php                       Singleton; theme check and asset wiring
classes/Updater.php                      Self-update from GitHub releases
css/header.css                           The rules. Ships no styling
js/header.js                             Decides the slide and the appearance
js/admin-bar-offset.js                   Pins the transparent header below the
                                         admin bar (logged-in only, below 600px)
js/mega-menu-offset.js                   Hangs the mega menu panel flush with
                                         the header's bottom edge
languages/                               Translation template
test/                                    Tests for the decisions in header.js
agents.d/coding-standard/                The coding standard, by language
AGENTS.md                                Entry point for AI assistants; also
                                         the fastest orientation for humans
```

[`AGENTS.md`](AGENTS.md) holds the non-obvious facts about this project – the decisions that look like mistakes until you know why. Read it before changing anything; it is written for AI coding assistants but is the best short briefing for a human contributor too.

## Licence

Licensed under [GPL-2.0-or-later](LICENSE). The full licence text is in [`LICENSE`](LICENSE).

## Changelog

Release notes for each version live in [`CHANGELOG.md`](CHANGELOG.md).

The project follows [Keep a Changelog](https://keepachangelog.com/) and [Semantic Versioning](https://semver.org/).
