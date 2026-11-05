/**
 * Decides when the sticky header slides away and which appearance it shows.
 *
 * Ollie Pro ships a hide-on-scroll-down script, but it hides at a fixed 100px
 * whatever the header's height, and it knows nothing of keyboard focus or open
 * panels: tabbing into a hidden header leaves the focus off-screen. So this
 * script makes the decision, and css/header.css makes Ollie Pro's classes
 * inert. Ollie Pro's *Hide in Scroll Down* toggle stays the on/off switch.
 *
 * It sets three things, and nothing about how any of them looks:
 *
 *   is-away
 *     The header has slid out of the window, or is on its way.
 *   is-scrolled
 *     The header is opaque with page content under it. On a transparent header
 *     that is its solid appearance. It marks the SCROLLED state, not the
 *     transparent one, for a reason: a class added by script cannot exist in
 *     the first paint, so if transparency depended on one, every page load
 *     would render the solid header and then animate it away. The top state is
 *     the absence of this class, which is right before this file has even run.
 *   --kntnt-header-visible-height
 *     How much of the window's top the header covers, read by the stylesheet as
 *     the page's scroll padding, so neither focus nor an anchor target ends up
 *     under it.
 */
(() => {

    'use strict';

    const OPAQUE_THRESHOLD = 24; // Scroll depth in px at which a header may turn opaque.
    const JITTER = 4; // Scroll distance in px too small to count as a direction.
    const SETTLE_MARGIN = 20; // Time in ms added to the slide to know it has finished.

    /**
     * Decides whether the header should be slid away.
     *
     * The anchor only moves when a decision is taken, so small movements add up
     * instead of being forgotten one by one, and jitter can never toggle the
     * header back and forth.
     *
     * @param {Object} state
     * @param {number} state.y Current scroll position.
     * @param {number} state.height The header's own height.
     * @param {boolean} state.isHeld Whether a panel or the keyboard holds it.
     * @param {boolean} state.isAway Whether the header is currently slid away.
     * @param {number} state.anchor Scroll position of the latest decision.
     * @returns {{isAway: boolean, anchor: number}} The new state.
     */
    const decideSlide = ({ y, height, isHeld, isAway, anchor }) => {

        if (isHeld || y <= 0) {
            return { isAway: false, anchor: y };
        }

        if (Math.abs(y - anchor) < JITTER) {
            return { isAway, anchor };
        }

        return { isAway: y > anchor && y > height, anchor: y };

    };

    /**
     * Decides whether a transparent header should stay transparent.
     *
     * Turning opaque just before sliding away reads as a flicker, so on the way
     * down the header keeps its appearance until it is out of sight, changes
     * while hidden, and comes back opaque. A header that cannot slide away,
     * being held by a panel or the keyboard, turns opaque at the threshold as
     * usual.
     *
     * @param {Object} state
     * @param {number} state.y Current scroll position.
     * @param {boolean} state.isHeld Whether a panel or the keyboard holds it.
     * @param {boolean} state.isHidden Whether it has finished sliding away.
     * @param {boolean} state.isTransparent Whether it is transparent now.
     * @returns {boolean} Whether the header should be transparent.
     */
    const decideTransparency = ({ y, isHeld, isHidden, isTransparent }) => (
        y < OPAQUE_THRESHOLD || (isTransparent && !isHeld && !isHidden)
    );

    // Hand the decisions to the test suite, which runs where there is no page.
    if (typeof document === 'undefined') {
        module.exports = { decideSlide, decideTransparency };
        return;
    }

    // Every page carries this script, but only a sticky group directly inside a
    // <header> has anything to move.
    const group = document.querySelector('header > .wp-block-group.is-position-sticky[data-sticky-on-scroll-up="true"]');

    if (!group) {
        return;
    }

    const header = group.parentElement;
    const isOverHero = header.classList.contains('has-transparent-header');

    // Hold the header while a panel is open, and while the keyboard is inside
    // it. `:focus-visible`, so a button clicked with the mouse holds nothing.
    const HOLD_SELECTOR = '[aria-expanded="true"], dialog[open], :focus-visible';

    let slide = { isAway: false, anchor: window.scrollY };
    let isHidden = false;
    let isTransparent = window.scrollY < OPAQUE_THRESHOLD;
    let hiddenTimer;
    let isTicking = false;

    /**
     * Applies a slide decision, and works out when the slide has finished.
     *
     * A timer rather than `transitionend`: with reduced motion there is no
     * transition to end, and a resize can cancel one that has begun.
     *
     * @param {boolean} isAway Whether the header should be slid away.
     * @returns {void}
     */
    const setAway = isAway => {

        if (isAway === group.classList.contains('is-away')) {
            return;
        }

        group.classList.toggle('is-away', isAway);
        clearTimeout(hiddenTimer);
        isHidden = false;

        if (isAway) {
            const duration = parseFloat(getComputedStyle(group).transitionDuration) * 1000;

            hiddenTimer = setTimeout(() => {
                isHidden = true;
                render();
            }, duration + SETTLE_MARGIN);
        }

    };

    /**
     * Publishes how much of the window's top the header covers.
     *
     * Measured from the untransformed <header>, whose position already includes
     * any admin bar, because the group's own rectangle moves during the slide.
     *
     * @returns {void}
     */
    const publishVisibleHeight = () => {

        const bottom = header.getBoundingClientRect().top + group.offsetHeight;
        const visibleHeight = slide.isAway && isHidden ? 0 : Math.max(0, bottom);

        document.documentElement.style.setProperty('--kntnt-header-visible-height', `${visibleHeight}px`);

    };

    /**
     * Brings the header in line with the scroll position and what holds it.
     *
     * @returns {void}
     */
    const render = () => {

        const y = window.scrollY;
        const isHeld = group.querySelector(HOLD_SELECTOR) !== null;

        // Slide first, since the appearance depends on whether it has finished.
        slide = decideSlide({ y, height: group.offsetHeight, isHeld, ...slide });
        setAway(slide.isAway);

        // Only a transparent header has two appearances. On a solid one the
        // class still says whether page content lies under the header.
        isTransparent = decideTransparency({ y, isHeld, isHidden, isTransparent });
        group.classList.toggle('is-scrolled', isOverHero ? !isTransparent : y > 0);

        publishVisibleHeight();

    };

    /**
     * Coalesces a burst of events into one update per frame.
     *
     * @returns {void}
     */
    const schedule = () => {

        if (isTicking) {
            return;
        }

        isTicking = true;
        requestAnimationFrame(() => {
            render();
            isTicking = false;
        });

    };

    // Passive: the listener never calls preventDefault, and declaring that keeps
    // it off the scrolling critical path.
    window.addEventListener('scroll', schedule, { passive: true });

    // Focus entering the header brings it back, and leaving it lets it go.
    group.addEventListener('focusin', schedule);
    group.addEventListener('focusout', schedule);

    // An opening panel or a changing height matters as much as a scroll does.
    new MutationObserver(schedule).observe(group, {
        attributes: true,
        attributeFilter: ['aria-expanded', 'open'],
        subtree: true,
    });
    new ResizeObserver(schedule).observe(group);

    // Paper shows the opaque appearance: white content over a hero that may not
    // print would otherwise vanish.
    window.addEventListener('beforeprint', () => {
        group.classList.add('is-scrolled');
    });
    window.addEventListener('afterprint', render);

    // Settle the initial state: a reload can restore a scrolled position, which
    // fires no event of its own.
    render();

})();
