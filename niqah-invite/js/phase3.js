/* ============================================================
   PHASE 3
   ROYAL INVITATION INTRODUCTION

   Behaviour:
   ------------------------------------------------------------
   1. Invitation paper appears.
   2. Salam is centred.
   3. Arabic reveals RTL with gold dust.
   4. English reveals LTR with gold dust.
   5. Translation settles underneath.
   6. User scrolls INSIDE invitation.
   7. Salam transitions into Bismillah.
   8. Scrolling back reverses the entire transition.
   9. Custom scrollbar remains fixed inside paper.
   ============================================================ */


/* ============================================================
   START PHASE 3
   ============================================================ */

export function startPhase3() {

    /* --------------------------------------------------------
       DOM
    -------------------------------------------------------- */

    const app =
        document.getElementById("app");

    const paper =
        document.getElementById("paperStart");

    const intro =
        document.getElementById("introSection");

    const salam =
        document.getElementById("salamBlock");

    const bismillah =
        document.getElementById("bismillahBlock");

    const salamArabic =
        salam?.querySelector(".arabicReveal");

    const salamEnglish =
        salam?.querySelector(".englishReveal");

    const salamTranslation =
        salam?.querySelector(".translationReveal");

    const bismillahArabic =
        bismillah?.querySelector(".bismillahArabic");

    const bismillahTranslation =
        bismillah?.querySelector(".bismillahTranslation");

    const scrollbar =
        document.getElementById("invitationScrollbar");

    const scrollThumb =
        document.getElementById("scrollThumb");


    /* --------------------------------------------------------
       SAFETY
    -------------------------------------------------------- */

    if (
        !app ||
        !intro ||
        !salam ||
        !bismillah
    ) {

        console.warn(
            "Phase 3: required elements not found."
        );

        return;
    }


    /* ========================================================
       CONFIGURATION
       ======================================================== */

    const CONFIG = {

        /* How much of the custom scroll track is used */
        scrollTravel: 1,

        /* Smoothness of scroll response */
        scrollEase: 0.085,

        /* How far user must scroll to complete transition */
        transitionDistance: 420,

        /* Initial text reveal */
        salamRevealDuration: 1.15,

        /* Gold dust amount */
        dustCount: 42,

        /* Gold dust brightness */
        dustOpacity: 0.78,

        /* Scroll transition */
        transitionDustDuration: 0.55

    };


    /* ========================================================
       INTERNAL STATE
       ======================================================== */

    let targetProgress = 0;

    let currentProgress = 0;

    let lastProgress = 0;

    let rafId = null;

    let isRunning = true;

    let touchStartY = null;

    let wheelAccumulator = 0;

    let dustContainer = null;

    let salamDust = [];

    let bismillahDust = [];

    let scrollDust = [];

    let revealPlayed = false;


    /* ========================================================
       BASIC APP STATE
       ======================================================== */

    gsap.killTweensOf(
        [
            introSection,
            salam,
            bismillah,
            salamArabic,
            salamEnglish,
            salamTranslation,
            bismillahArabic,
            bismillahTranslation
        ]
    );


    /* ========================================================
       INTRO CONTAINER
       ======================================================== */

    gsap.set(
        intro,
        {
            opacity: 1,
            visibility: "visible"
        }
    );

    /* =====================================================
       FORCE CLEAN CENTERING
    ===================================================== */

    gsap.set(introSection, {
        clearProps: "transform"
    });

    gsap.set(salam, {
        clearProps: "transform,top,left,right,bottom,margin,width,maxWidth"
    });

    gsap.set(bismillah, {
        clearProps: "transform,top,left,right,bottom,margin,width,maxWidth"
    });

    /*
       These properties are deliberately applied directly.
       They prevent the blocks from inheriting any old
       positioning left by previous animation versions.
    */

    Object.assign(salam.style, {
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        margin: "0 auto",
        width: "min(84%, 360px)",
        maxWidth: "360px",
        transform: "none"
    });

    Object.assign(bismillah.style, {
        position: "relative",
        top: "auto",
        left: "auto",
        right: "auto",
        bottom: "auto",
        margin: "0 auto",
        width: "min(84%, 360px)",
        maxWidth: "360px",
        transform: "none"
    });


    /* ========================================================
       IMPORTANT:
       THE BLOCKS ARE FULL INVITATION VIEWPORTS.

       We DO NOT position them using:
           left: 50%
           margin-left
           xPercent
           yPercent

       Flexbox in CSS handles centering.
       GSAP only animates their children.
       ======================================================== */

    gsap.set(
        salam,
        {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        }
    );

    gsap.set(
        bismillah,
        {
            opacity: 0,
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0
        }
    );


    /* ========================================================
       TEXT INITIAL STATE
       ======================================================== */

    if (salamArabic) {

        gsap.set(
            salamArabic,
            {
                opacity: 0,
                x: 0,
                y: 0,
                scale: 1,
                clipPath:
                    "inset(0 100% 0 0)",
                filter:
                    "brightness(.72) saturate(.9)"
            }
        );
    }


    if (salamEnglish) {

        gsap.set(
            salamEnglish,
            {
                opacity: 0,
                x: 0,
                y: 0,
                scale: 1,
                clipPath:
                    "inset(0 0 0 100%)",
                filter:
                    "brightness(.72) saturate(.9)"
            }
        );
    }


    if (salamTranslation) {

        gsap.set(
            salamTranslation,
            {
                opacity: 0,
                x: 0,
                y: 12,
                scale: .985,
                filter:
                    "brightness(.72) saturate(.9)"
            }
        );
    }


    if (bismillahArabic) {

        gsap.set(
            bismillahArabic,
            {
                opacity: 0,
                x: 0,
                y: 0,
                scale: 1,
                clipPath:
                    "inset(0 100% 0 0)",
                filter:
                    "brightness(.72) saturate(.9)"
            }
        );
    }


    if (bismillahTranslation) {

        gsap.set(
            bismillahTranslation,
            {
                opacity: 0,
                x: 0,
                y: 14,
                scale: .985,
                filter:
                    "brightness(.72) saturate(.9)"
            }
        );
    }


    /* ========================================================
       CREATE GOLD DUST CONTAINER
       ======================================================== */

    createDustContainer();


    /* ========================================================
       INITIAL SALAM REVEAL
       ======================================================== */

    playInitialSalamReveal();


    /* ========================================================
       CUSTOM SCROLLBAR
       ======================================================== */

    setupScrollbar();


    /* ========================================================
       SCROLL INPUT
       ======================================================== */

    setupScrollInput();


    /* ========================================================
       START RENDER LOOP
       ======================================================== */

    render();


    /* ========================================================
       GOLD DUST CONTAINER
       ======================================================== */

    function createDustContainer() {

        /*
         * IMPORTANT:
         * This variable is declared BEFORE updateGoldDust()
         * or render() can ever use it.
         *
         * This fixes:
         *
         * Cannot access 'dustContainer'
         * before initialization
         */

        dustContainer =
            document.createElement("div");

        dustContainer.className =
            "scrollGoldDust";

        dustContainer.setAttribute(
            "aria-hidden",
            "true"
        );

        Object.assign(
            dustContainer.style,
            {
                position: "absolute",
                inset: "0",
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: "4",
                overflow: "hidden",
                opacity: "0"
            }
        );

        intro.appendChild(
            dustContainer
        );

        createDustParticles(
            CONFIG.dustCount
        );
    }


    /* ========================================================
       CREATE DUST PARTICLES
       ======================================================== */

    function createDustParticles(count) {

        salamDust = [];
        bismillahDust = [];
        scrollDust = [];

        for (
            let i = 0;
            i < count;
            i++
        ) {

            const particle =
                document.createElement("span");

            particle.className =
                "goldDustParticle";

            const size =
                1 +
                Math.random() * 2.3;

            const left =
                8 +
                Math.random() * 84;

            const top =
                20 +
                Math.random() * 60;

            const offset =
                Math.random();

            particle.dataset.offset =
                offset;

            Object.assign(
                particle.style,
                {
                    position: "absolute",

                    left:
                        `${left}%`,

                    top:
                        `${top}%`,

                    width:
                        `${size}px`,

                    height:
                        `${size}px`,

                    borderRadius:
                        "50%",

                    background:
                        "radial-gradient(circle, rgba(255,248,210,1) 0%, rgba(224,178,69,.95) 45%, rgba(184,138,42,0) 100%)",

                    boxShadow:
                        "0 0 5px rgba(255,220,130,.7)",

                    opacity: 0,

                    transform:
                        "translate3d(0,0,0) scale(.5)",

                    willChange:
                        "transform, opacity"
                }
            );

            dustContainer.appendChild(
                particle
            );

            salamDust.push(
                particle
            );
        }


        /*
         * Separate particles for Bismillah.
         * Reuse the same visual style.
         */

        for (
            let i = 0;
            i < Math.round(count * .8);
            i++
        ) {

            const particle =
                document.createElement("span");

            particle.className =
                "goldDustParticle bismillahDust";

            const size =
                1 +
                Math.random() * 2.4;

            const left =
                10 +
                Math.random() * 80;

            const top =
                22 +
                Math.random() * 56;

            Object.assign(
                particle.style,
                {
                    position: "absolute",

                    left:
                        `${left}%`,

                    top:
                        `${top}%`,

                    width:
                        `${size}px`,

                    height:
                        `${size}px`,

                    borderRadius:
                        "50%",

                    background:
                        "radial-gradient(circle, rgba(255,249,215,1) 0%, rgba(210,165,58,.95) 48%, rgba(170,115,20,0) 100%)",

                    boxShadow:
                        "0 0 5px rgba(255,220,130,.65)",

                    opacity: 0,

                    transform:
                        "translate3d(0,0,0) scale(.5)",

                    willChange:
                        "transform, opacity"
                }
            );

            dustContainer.appendChild(
                particle
            );

            bismillahDust.push(
                particle
            );
        }


        scrollDust =
            [
                ...salamDust,
                ...bismillahDust
            ];
    }


    /* ========================================================
       INITIAL SALAM REVEAL
       ======================================================== */

    function playInitialSalamReveal() {

        if (revealPlayed)
            return;

        revealPlayed = true;

        const tl =
            gsap.timeline();


        /*
         * Arabic:
         * RIGHT → LEFT
         */

        if (salamArabic) {

            tl.to(
                salamArabic,
                {
                    opacity: 1,

                    clipPath:
                        "inset(0 0% 0 0)",

                    filter:
                        "brightness(1.05) saturate(1.08)",

                    duration:
                        CONFIG.salamRevealDuration,

                    ease:
                        "power2.inOut",

                    onUpdate: () => {

                        animateRevealDust(
                            salamDust,
                            1
                        );
                    }
                }
            );
        }


        /*
         * English:
         * LEFT → RIGHT
         */

        if (salamEnglish) {

            tl.to(
                salamEnglish,
                {
                    opacity: 1,

                    clipPath:
                        "inset(0 0 0 0%)",

                    filter:
                        "brightness(1.08) saturate(1.1)",

                    duration:
                        CONFIG.salamRevealDuration,

                    ease:
                        "power2.inOut",

                    onUpdate: () => {

                        animateRevealDust(
                            salamDust,
                            .8
                        );
                    }
                },
                "-=0.78"
            );
        }


        /*
         * Translation settles in.
         */

        if (salamTranslation) {

            tl.to(
                salamTranslation,
                {
                    opacity: 1,

                    y: 0,

                    scale: 1,

                    filter:
                        "brightness(1) saturate(1)",

                    duration: .8,

                    ease:
                        "power2.out"
                },
                "-=.45"
            );
        }


        tl.call(
            () => {

                fadeDust();

            }
        );
    }


    /* ========================================================
       REVEAL DUST
       ======================================================== */

    function animateRevealDust(
        particles,
        strength = 1
    ) {

        if (!particles?.length)
            return;

        const time =
            performance.now() * .001;


        particles.forEach(
            (particle, index) => {

                const offset =
                    parseFloat(
                        particle.dataset.offset || 0
                    );

                const wave =
                    (
                        Math.sin(
                            time * 2.5 +
                            index * .77
                        ) + 1
                    ) / 2;

                const local =
                    Math.max(
                        0,
                        Math.min(
                            1,
                            strength +
                            wave * .15 -
                            offset * .72
                        )
                    );

                const opacity =
                    local > .45
                        ? Math.min(
                            .8,
                            (local - .45) * 2
                        )
                        : 0;

                const drift =
                    Math.sin(
                        time * 2 +
                        index
                    ) * 4;

                particle.style.opacity =
                    opacity;

                particle.style.transform =
                    `translate3d(${drift}px, ${-local * 8}px, 0) scale(${.5 + local * .7})`;
            }
        );
    }


    /* ========================================================
       FADE DUST
       ======================================================== */

    function fadeDust() {

        if (!dustContainer)
            return;

        gsap.to(
            dustContainer,
            {
                opacity: 0,

                duration: .65,

                ease:
                    "power2.out"
            }
        );

        gsap.to(
            scrollDust,
            {
                opacity: 0,

                duration: .5,

                ease:
                    "power2.out",

                stagger: {
                    each: .008,
                    from: "random"
                }
            }
        );
    }


    /* ========================================================
       SCROLL INPUT
       ======================================================== */

    function setupScrollInput() {

        /*
         * Wheel / trackpad
         */

        app.addEventListener(
            "wheel",
            handleWheel,
            {
                passive: false
            }
        );


        /*
         * Touch
         */

        app.addEventListener(
            "touchstart",
            (event) => {

                if (
                    !event.touches ||
                    !event.touches.length
                )
                    return;

                touchStartY =
                    event.touches[0].clientY;
            },
            {
                passive: true
            }
        );


        app.addEventListener(
            "touchmove",
            handleTouchMove,
            {
                passive: false
            }
        );


        /*
         * Keyboard.
         * Useful on desktop and accessibility.
         */

        window.addEventListener(
            "keydown",
            handleKeyboard
        );
    }


    /* ========================================================
       WHEEL
       ======================================================== */

    function handleWheel(event) {

        event.preventDefault();

        /*
         * Normalize trackpad / mouse wheel.
         */

        let delta =
            event.deltaY;

        if (
            event.deltaMode === 1
        ) {

            delta *= 16;
        }

        if (
            event.deltaMode === 2
        ) {

            delta *= window.innerHeight;
        }


        /*
         * Don't let a giant trackpad
         * movement skip everything.
         */

        delta =
            Math.max(
                -70,
                Math.min(
                    70,
                    delta
                )
            );


        wheelAccumulator +=
            delta;


        targetProgress =
            clamp(
                targetProgress +
                (
                    delta /
                    CONFIG.transitionDistance
                ),
                0,
                1
            );


        /*
         * Small momentum reset.
         */

        clearTimeout(
            handleWheel._timer
        );

        handleWheel._timer =
            setTimeout(
                () => {

                    wheelAccumulator = 0;

                },
                120
            );
    }


    /* ========================================================
       TOUCH
       ======================================================== */

    function handleTouchMove(event) {

        if (
            touchStartY === null ||
            !event.touches?.length
        )
            return;

        event.preventDefault();

        const currentY =
            event.touches[0].clientY;

        const delta =
            touchStartY -
            currentY;


        targetProgress =
            clamp(
                targetProgress +
                (
                    delta /
                    CONFIG.transitionDistance
                ),
                0,
                1
            );


        touchStartY =
            currentY;
    }


    /* ========================================================
       KEYBOARD
       ======================================================== */

    function handleKeyboard(event) {

        let delta = 0;

        if (
            event.key === "ArrowDown" ||
            event.key === "PageDown"
        ) {

            delta = .08;
        }

        if (
            event.key === "ArrowUp" ||
            event.key === "PageUp"
        ) {

            delta = -.08;
        }

        if (
            event.key === "Home"
        ) {

            delta = -1;
        }

        if (
            event.key === "End"
        ) {

            delta = 1;
        }

        if (delta !== 0) {

            event.preventDefault();

            targetProgress =
                clamp(
                    targetProgress +
                    delta,
                    0,
                    1
                );
        }
    }


    /* ========================================================
       CUSTOM SCROLLBAR
       ======================================================== */

    function setupScrollbar() {

        if (!scrollbar)
            return;


        gsap.set(
            scrollbar,
            {
                opacity: 1
            }
        );


        /*
         * Make scrollbar stay inside the invitation.
         */

        Object.assign(
            scrollbar.style,
            {
                position: "absolute",

                top: "10%",

                right: "5.5%",

                height: "80%",

                zIndex: "90",

                pointerEvents: "none"
            }
        );


        if (scrollThumb) {

            gsap.set(
                scrollThumb,
                {
                    x: 0,
                    y: 0
                }
            );
        }
    }


    /* ========================================================
       UPDATE SCROLLBAR
       ======================================================== */

    function updateScrollbar(
        progress
    ) {

        if (!scrollThumb)
            return;


        const track =
            scrollbar?.querySelector(
                ".scrollTrack"
            );

        if (!track)
            return;


        const trackHeight =
            track.clientHeight;

        const thumbHeight =
            scrollThumb.offsetHeight;

        const travel =
            Math.max(
                0,
                trackHeight -
                thumbHeight
            );


        gsap.set(
            scrollThumb,
            {
                y:
                    travel *
                    progress
            }
        );
    }


    /* ========================================================
       MAIN RENDER LOOP
       ======================================================== */

    function render() {

        if (!isRunning)
            return;


        currentProgress +=
            (
                targetProgress -
                currentProgress
            ) *
            CONFIG.scrollEase;


        /*
         * Kill tiny floating-point movement.
         */

        if (
            Math.abs(
                targetProgress -
                currentProgress
            ) < .0005
        ) {

            currentProgress =
                targetProgress;
        }


        animateInvitation(
            currentProgress
        );


        updateScrollbar(
            currentProgress
        );


        lastProgress =
            currentProgress;


        rafId =
            requestAnimationFrame(
                render
            );
    }


    /* ========================================================
       MAIN INVITATION ANIMATION
       ======================================================== */

    function animateInvitation(
        progress
    ) {

        /*
         * 0 = Salam
         * 1 = Bismillah
         */

        renderSalam(
            progress
        );

        renderBismillah(
            progress
        );

        updateGoldDust(
            progress
        );
    }


    /* ========================================================
       SALAM
       ======================================================== */

    function renderSalam(
        progress
    ) {

        /*
         * Salam remains fully visible
         * until the user actually scrolls.
         *
         * Then it gracefully leaves.
         */

        const fadeStart =
            .12;

        const fadeEnd =
            .82;

        const exit =
            smoothstep(
                fadeStart,
                fadeEnd,
                progress
            );


        const opacity =
            1 -
            exit;


        gsap.set(
            salam,
            {
                opacity:
                    opacity
            }
        );


        /*
         * IMPORTANT:
         * We don't move the whole Salam block.
         *
         * Only its individual text moves subtly.
         */

        if (salamArabic) {

            gsap.set(
                salamArabic,
                {
                    opacity:
                        opacity,

                    y:
                        -
                        (
                            exit *
                            8
                        ),

                    scale:
                        1 -
                        (
                            exit *
                            .015
                        ),

                    filter:
                        `brightness(${1 - exit * .2}) saturate(${1.08 - exit * .08})`
                }
            );
        }


        if (salamEnglish) {

            gsap.set(
                salamEnglish,
                {
                    opacity:
                        opacity,

                    y:
                        -
                        (
                            exit *
                            5
                        ),

                    scale:
                        1 -
                        (
                            exit *
                            .01
                        ),

                    filter:
                        `brightness(${1.08 - exit * .2}) saturate(${1.1 - exit * .1})`
                }
            );
        }


        if (salamTranslation) {

            gsap.set(
                salamTranslation,
                {
                    opacity:
                        opacity,

                    y:
                        -
                        (
                            exit *
                            4
                        ),

                    scale:
                        1 -
                        (
                            exit *
                            .01
                        ),

                    filter:
                        `brightness(${1 - exit * .15})`
                }
            );
        }
    }


    /* ========================================================
       BISMILLAH
       ======================================================== */

    function renderBismillah(
        progress
    ) {

        const enterStart =
            .25;

        const enterEnd =
            .92;


        const enter =
            smoothstep(
                enterStart,
                enterEnd,
                progress
            );


        gsap.set(
            bismillah,
            {
                opacity:
                    enter
            }
        );


        /*
         * Arabic enters gently from below,
         * while the reveal itself is controlled
         * by clip-path.
         */

        if (bismillahArabic) {

            const clip =
                100 -
                (
                    enter *
                    100
                );


            gsap.set(
                bismillahArabic,
                {
                    opacity:
                        enter,

                    y:
                        18 -
                        (
                            enter *
                            18
                        ),

                    scale:
                        .97 +
                        (
                            enter *
                            .03
                        ),

                    clipPath:
                        `inset(0 ${clip}% 0 0)`,

                    filter:
                        `brightness(${.78 + enter * .27}) saturate(${.9 + enter * .2})`
                }
            );
        }


        if (bismillahTranslation) {

            gsap.set(
                bismillahTranslation,
                {
                    opacity:
                        smoothstep(
                            .42,
                            .96,
                            progress
                        ),

                    y:
                        20 -
                        (
                            enter *
                            20
                        ),

                    scale:
                        .985 +
                        (
                            enter *
                            .015
                        ),

                    filter:
                        `brightness(${.8 + enter * .2})`
                }
            );
        }
    }


    /* ========================================================
       GOLD DUST DURING SCROLL TRANSITION
       ======================================================== */

    function updateGoldDust(
        progress
    ) {

        /*
         * Nothing here draws a solid beam or line.
         *
         * Only individual particles are animated.
         */

        if (
            !dustContainer ||
            !scrollDust?.length
        )
            return;


        const movement =
            Math.abs(
                progress -
                lastProgress
            );


        /*
         * Dust only becomes noticeable
         * while the user is transitioning.
         */

        const active =
            clamp(
                movement * 90,
                0,
                1
            );


        /*
         * Also create a soft peak around
         * the middle of the transition.
         */

        const transitionGlow =
            Math.sin(
                progress *
                Math.PI
            );


        const visibility =
            Math.max(
                active,
                transitionGlow * .12
            );


        dustContainer.style.opacity =
            String(
                visibility
            );


        scrollDust.forEach(
            (
                particle,
                index
            ) => {

                const offset =
                    parseFloat(
                        particle.dataset.offset ||
                        "0"
                    );


                /*
                 * Slightly different motion
                 * for every particle.
                 */

                const angle =
                    (
                        index *
                        2.399
                    );

                const driftX =
                    Math.sin(
                        angle +
                        progress * 9
                    ) * 8;

                const driftY =
                    Math.cos(
                        angle +
                        progress * 7
                    ) * 5;


                /*
                 * Tiny vertical golden
                 * falling movement.
                 */

                const fall =
                    (
                        progress *
                        28
                    ) +
                    (
                        offset *
                        8
                    );


                const particleOpacity =
                    visibility *
                    (
                        .25 +
                        (
                            (
                                Math.sin(
                                    angle +
                                    progress * 14
                                ) +
                                1
                            ) /
                            2
                        ) *
                        .65
                    );


                const scale =
                    .45 +
                    (
                        particleOpacity *
                        .8
                    );


                particle.style.opacity =
                    particleOpacity;


                particle.style.transform =
                    `translate3d(${driftX}px, ${fall + driftY}px, 0) scale(${scale})`;
            }
        );
    }


    /* ========================================================
       UTILITY: SMOOTHSTEP
       ======================================================== */

    function smoothstep(
        start,
        end,
        value
    ) {

        if (
            value <= start
        )
            return 0;

        if (
            value >= end
        )
            return 1;


        const x =
            (
                value -
                start
            ) /
            (
                end -
                start
            );


        return (
            x *
            x *
            (
                3 -
                2 * x
            )
        );
    }


    /* ========================================================
       UTILITY: CLAMP
       ======================================================== */

    function clamp(
        value,
        min,
        max
    ) {

        return Math.max(
            min,
            Math.min(
                max,
                value
            )
        );
    }


    /* ========================================================
       CLEANUP
       ======================================================== */

    /*
     * Optional public cleanup method.
     *
     * This doesn't normally need to be called, but it prevents
     * duplicate listeners if Phase 3 is ever restarted.
     */

    return {

        destroy() {

            isRunning =
                false;

            if (rafId) {

                cancelAnimationFrame(
                    rafId
                );

                rafId = null;
            }

            app.removeEventListener(
                "wheel",
                handleWheel
            );

            app.removeEventListener(
                "touchmove",
                handleTouchMove
            );

            window.removeEventListener(
                "keydown",
                handleKeyboard
            );

            if (dustContainer) {

                dustContainer.remove();

                dustContainer = null;
            }
        },

        getProgress() {

            return currentProgress;
        },

        setProgress(
            value
        ) {

            targetProgress =
                clamp(
                    value,
                    0,
                    1
                );
        }
    };
}