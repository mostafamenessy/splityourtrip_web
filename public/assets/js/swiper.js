
if ($('div').hasClass("slider-box-dream")) {
    var swiper = new Swiper(".slider-box-dream", {
        spaceBetween: 0,
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ".box-dream-next",
            prevEl: ".box-dream-prev",
            clickable: true,
        },
        pagination: {
            el: ".box-dream-pagination",
            clickable: true,
        },
    });
}

if ($('div').hasClass("slider-house-full")) {
    var swiper = new Swiper(".slider-house-full", {
        spaceBetween: 0,
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ".house-full-next",
            prevEl: ".house-full-prev",
            clickable: true,
        },
    });
}

if ($('div').hasClass("slider-home7")) {
    var swiper = new Swiper(".slider-home7", {
        spaceBetween: 0,
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
        navigation: {
            nextEl: ".home7-next",
            prevEl: ".home7-prev",
            clickable: true,
        },
    });
}

if ($('div').hasClass("slider-property-single-6")) {
    var swiper = new Swiper(".slider-property-single-6", {
        spaceBetween: 0,
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        effect: "fade",
        fadeEffect: {
            crossFade: true,
        },
        navigation: {
            nextEl: ".property-single-6-next",
            prevEl: ".property-single-6-prev",
            clickable: true,
        },
    });
}

if ($('div').hasClass("slider-testimonials")) {
    var swiper = new Swiper(".slider-testimonials", {
        spaceBetween: 0,
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ".testimonials-next",
            prevEl: ".testimonials-prev",
            clickable: true,
        },
        pagination: {
            el: ".testimonials-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + (index + 1) + "</span>";
            },
        },
    });
}

if ($('div').hasClass("slider-testimonials-1")) {
    var swiper = new Swiper(".slider-testimonials-1", {
        spaceBetween: 28,
        slidesPerView: 3,
        observer: true,
        observeParents: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            600: {
                slidesPerView: 2,
            },
            1400: {
                slidesPerView: 3,
            },
        },
    });
}

if ($('div').hasClass("slider-brand")) {
    var swiper = new Swiper(".slider-brand", {
        spaceBetween: 30,
        slidesPerView: 2,
        observer: true,
        observeParents: true,
        loop: true,
        autoplay: {
            delay: 0,
            disableOnInteraction: false,
        },
        spaceBetween: 30,
        speed: 10000,
        breakpoints: {
            450: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
            768: {
                slidesPerView: 4,
                spaceBetween: 30,
            },
            868: {
                slidesPerView: 5,
                spaceBetween: 30,
            },
            1400: {
                slidesPerView: 6,
                spaceBetween: 171,
            },
        },
    });
}


if ($('div').hasClass("slider-featured")) {
    var swiper = new Swiper(".slider-featured", {
        spaceBetween: 28,
        slidesPerView: 'auto',
        observer: true,
        observeParents: true,
        pagination: {
            el: ".featured-pagination",
            type: "progressbar",
        },
        navigation: {
            nextEl: ".featured-next",
            prevEl: ".featured-prev",
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            600: {
                slidesPerView: 'auto',
            }
        },
    });
}

if ($('div').hasClass("thumbs-slider")) {
    var swiper = new Swiper(".slider-thumbs-gallery-1", {
        spaceBetween: 10,
        slidesPerView: 2,
        freeMode: true,
        watchSlidesProgress: true,
        breakpoints: {
            450: {
                slidesPerView: 3,
            },
            768: {
                slidesPerView: 4,
            },
            868: {
                slidesPerView: 5,
            },
            1400: {
                slidesPerView: 6,
            },
        },
    });
    var swiper2 = new Swiper(".slider-thumbs-gallery-2", {
        spaceBetween: 0,
        navigation: {
            nextEl: ".thumbs-next",
            prevEl: ".thumbs-prev",
        },
        thumbs: {
            swiper: swiper,
        },
    });
}

if ($('div').hasClass("thumbs-slider-column")) {
    var swiper = new Swiper(".slider-thumbs-gallery-1", {
        spaceBetween: 10,
        slidesPerView: 2,
        freeMode: true,
        direction: "vertical",
        watchSlidesProgress: true,
        breakpoints: {
            0: {
                slidesPerView: 2,
                direction: "horizontal",
            },
            450: {
                slidesPerView: 3,
                direction: "horizontal",
            },
            768: {
                slidesPerView: 5,
            }
        },
    });
    var swiper2 = new Swiper(".slider-thumbs-gallery-2", {
        spaceBetween: 0,
        navigation: {
            nextEl: ".thumbs-next",
            prevEl: ".thumbs-prev",
        },
        thumbs: {
            swiper: swiper,
        },
    });
}

if ($('div').hasClass("thumbs-slider-second")) {
    var swiper = new Swiper(".slider-thumbs-gallery-second-1", {
        spaceBetween: 0,
        slidesPerView: 1,
        freeMode: true,
        watchSlidesProgress: true,
    });
    var swiper2 = new Swiper(".slider-thumbs-gallery-second-2", {
        spaceBetween: 0,
        slidesPerView: 1,
        pagination: {
            el: ".thumbs-gallery-pagination",
            clickable: true,
            renderBullet: function (index, className) {
                return '<span class="' + className + '">' + (index + 1) + "</span>";
            },
        },
        navigation: {
            nextEl: ".thumbs-gallery-next",
            prevEl: ".thumbs-gallery-prev",
        },
        thumbs: {
            swiper: swiper,
        },
    });
}

if ($('div').hasClass("slider-3-center")) {
    var swiper = new Swiper(".slider-3-center", {
        spaceBetween: 10,
        slidesPerView: 2.07,
        loop: true,
        observer: true,
        observeParents: true,
        centeredSlides: true,
        breakpoints: {
            0: {
                slidesPerView: 1.07,
            },
            767: {
                slidesPerView: 2.07,
            }
        },
    });
}

if ($('div').hasClass("slider-4-center")) {
    var swiper = new Swiper(".slider-4-center", {
        spaceBetween: 28,
        loop: true,
        observer: true,
        observeParents: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            767: {
                slidesPerView: 2,
            }
        },
    });
}

if ($('div').hasClass("slider-homes")) {
    var swiper = new Swiper(".slider-homes", {
        spaceBetween: 28,
        slidesPerView: 3,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ".homes-next",
            prevEl: ".homes-prev",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.15,
            },
            600: {
                slidesPerView: 2,
            },
            1400: {
                slidesPerView: 3,
            },
        },
    });
}

if ($('div').hasClass("slider-news")) {
    var swiper = new Swiper(".slider-news", {
        spaceBetween: 28,
        slidesPerView: 4,
        observer: true,
        observeParents: true,
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            600: {
                slidesPerView: 2,
            },
            1400: {
                slidesPerView: 4,
            },
        },
    });
}

if ($('div').hasClass("slider-cities")) {
    var swiper = new Swiper(".slider-cities", {
        spaceBetween: 25,
        slidesPerView: 5,
        observer: true,
        observeParents: true,
        pagination: {
            el: ".cities-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            600: {
                slidesPerView: 2,
            },
            991: {
                slidesPerView: 3,
            },
            1440: {
                slidesPerView: 4,
            },
            1700: {
                slidesPerView: 5,
            },
        },
    });
}

if ($('div').hasClass("slider-discover")) {
    var swiper = new Swiper(".slider-discover", {
        spaceBetween: 28,
        slidesPerView: 3,
        observer: true,
        observeParents: true,
        pagination: {
            el: ".discover-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.15,
            },
            600: {
                slidesPerView: 2,
            },
            1400: {
                slidesPerView: 3,
            },
        },
    });
}

if ($('div').hasClass("slider-cities-1")) {
    var swiper = new Swiper(".slider-cities-1", {
        spaceBetween: 19,
        slidesPerView: 5,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ".homes-next",
            prevEl: ".homes-prev",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1.15,
            },
            600: {
                slidesPerView: 2,
            },
            991: {
                slidesPerView: 4,
            },
            1440: {
                slidesPerView: 5,
            },
        },
    });
}

if ($('div').hasClass("slider-cities-2")) {
    var swiper = new Swiper(".slider-cities-2", {
        spaceBetween: 25,
        slidesPerView: 5,
        observer: true,
        observeParents: true,
        breakpoints: {
            0: {
                slidesPerView: 1.15,
            },
            600: {
                slidesPerView: 2,
            },
            991: {
                slidesPerView: 4,
            },
            1440: {
                slidesPerView: 5,
            },
        },
    });
}

if ($('div').hasClass("slider-recent-properties")) {
    var swiper = new Swiper(".slider-recent-properties", {
        spaceBetween: 28,
        slidesPerView: 4,
        observer: true,
        observeParents: true,
        pagination: {
            el: ".recent-properties-pagination",
            clickable: true,
        },
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            600: {
                slidesPerView: 2,
            },
            1400: {
                slidesPerView: 4,
            },
        },
    });
}

if ($('div').hasClass("slider-exclusive")) {
    var swiper = new Swiper(".slider-exclusive", {
        spaceBetween: 0,
        slidesPerView: 1,
        observer: true,
        observeParents: true,
        navigation: {
            nextEl: ".exclusive-next",
            prevEl: ".exclusive-prev",
            clickable: true,
        },
    });
}



