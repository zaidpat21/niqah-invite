export function initialiseLanding(startNext){

    const envelope = document.getElementById("envelope");
    const video = document.getElementById("openingVideo");
    const seal = document.getElementById("sealButton");
    const paper = document.getElementById("paperStart");
    const glow = document.getElementById("goldGlow");
    const scrollLayer = document.getElementById("invitationScrollLayer");

    scrollLayer.style.pointerEvents = "none";
    video.preload = "auto";

    seal.addEventListener("click", () => {

        seal.style.pointerEvents = "none";

        video.currentTime = 0;

        video.play();

        requestAnimationFrame(() => {

            video.style.opacity = 1;

            envelope.style.opacity = 0;

        });

    });

    let transitionStarted = false;

    video.addEventListener("timeupdate", () => {

        if (transitionStarted) return;

        if (video.duration - video.currentTime < 0.30) {

            transitionStarted = true;

            revealPaper();

        }

    });

    function revealPaper() {

        gsap.set(paper, {
            opacity: 1,
            width: "86%",
            height: "74%",
            left: "8%",
            top: "10%",
            //width: "100%",
            //height: "100%",
            //left: "0%",
            //top: "0%",
            scale: 1,
            x: 0,
            y: 0,
            transformOrigin: "center center"
        });

        gsap.set(glow, {
            opacity: 0,
            x: "-120%"
        });

        const tl = gsap.timeline();

        tl

        // Premium golden shimmer
        .fromTo(
            glow,
            {
                x: "-120%",
                opacity: 0
            },
            {
                x: "240%",
                opacity: 0.85,
                duration: 3.0,
                ease: "power1.inOut"
            }
        )

        // Paper slowly comes forward
        // .to(
        //     paper,
        //     {
        //         width: "100%",
        //         height: "99%",
        //         left: "0%",
        //         top: "0%",
        //         scale: 1.0,
        //         filter: "brightness(1.2)",
        //         duration: 3.0,
        //         ease: "power3.out"
        //     },
        //     "<0.15"
        // )

        .to(
            paper,
            {
                width: "100%",
                height: "100%",
                left: "0%",
                top: "0%",
                scale: 1,
                filter: "brightness(1.05)",
                duration: 3.0,
                ease: "power3.out"
            },
            "<0.15"
        )

        // Video fades away gradually
        .to(
            video,
            {
                opacity: 0,
                duration: 1.6,
                ease: "power2.out"
            },
            "<0.35"
        )

        // Golden shimmer fades gently
        .to(
            glow,
            {
                opacity: 0,
                duration: 2.0,
                ease: "power2.out"
            },
            "-=0.8"
        )
        
        .call(() => {

            scrollLayer.scrollTop = 0;
            scrollLayer.style.pointerEvents = "auto";
            
            startNext();
        
        });
    }
}