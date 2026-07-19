$(document).ready(function () {

    // ===============================
    // Responsive Navigation (Hamburger)
    // ===============================

    const $navToggle = $(".nav-toggle");
    const $navLinks = $(".nav-links");

    function closeNav() {
        $navLinks.removeClass("open");
        $navToggle.removeClass("open").attr({
            "aria-expanded": "false",
            "aria-label": "Open menu"
        });
        $("body").removeClass("nav-open");
    }

    $navToggle.on("click", function () {
        const isOpen = $navLinks.toggleClass("open").hasClass("open");
        $navToggle.toggleClass("open").attr({
            "aria-expanded": isOpen ? "true" : "false",
            "aria-label": isOpen ? "Close menu" : "Open menu"
        });
        $("body").toggleClass("nav-open", isOpen);
    });

    // Close the drawer after tapping any link
    $navLinks.on("click", "a", function () {
        closeNav();
    });

    // Close on Escape
    $(document).on("keydown", function (e) {
        if (e.key === "Escape") {
            closeNav();
        }
    });

    // Reset when resizing back to desktop
    $(window).on("resize", function () {
        if ($(window).width() > 900) {
            closeNav();
        }
    });


    // ===============================
    // Scroll To Top Button
    // ===============================

    $(window).scroll(function () {

        if ($(this).scrollTop() > 300) {

            $("#topBtn").fadeIn();

        } else {

            $("#topBtn").fadeOut();

        }

    });

    $("#topBtn").click(function () {

        $("html, body").animate({

            scrollTop: 0

        }, 600);

    });


    // ===============================
    // Smooth Scroll Navigation
    // ===============================

    $(".menu a").click(function (e) {

        let target = $(this).attr("href");

        if (target.startsWith("#")) {

            e.preventDefault();

            $("html, body").animate({

                scrollTop: $(target).offset().top - 70

            }, 700);

        }

    });


    // ===============================
    // Wishlist Button
    // ===============================

    $(".wishlist").click(function () {

        let icon = $(this).find("i");

        icon.toggleClass("fa-regular fa-solid");

        if (icon.hasClass("fa-solid")) {

            icon.css("color", "red");

        } else {

            icon.css("color", "");

        }

    });


    // ===============================
    // Search Books
    // ===============================

    $(".search-section input").keyup(function () {

        let value = $(this).val().toLowerCase();

        $(".book-card").filter(function () {

            $(this).toggle(

                $(this).text().toLowerCase().indexOf(value) > -1

            );

        });

    });


    // ===============================
    // Category Filter
    // ===============================

    $(".card").click(function () {

        let category = $(this).find("h3").text().toLowerCase();

        $(".book-card").hide();

        if (category.includes("new")) {

            $(".book-badge:contains('NEW')").parent().fadeIn();

        }

        else if (category.includes("used")) {

            $(".book-badge:contains('USED')").parent().fadeIn();

        }

        else if (category.includes("free")) {

            $(".book-badge:contains('FREE')").parent().fadeIn();

        }

    });


    // ===============================
    // Double Click Logo
    // ===============================

    $(".logo").dblclick(function () {

        location.reload();

    });


    // ===============================
    // Button Hover Animation
    // ===============================

    $("button,.btn,.login-btn").not(".faq-question").hover(

        function () {

            $(this).css({

                transform: "scale(1.05)"

            });

        },

        function () {

            $(this).css({

                transform: "scale(1)"

            });

        }

    );


    // ===============================
    // FAQ Accordion
    // ===============================

    $(".faq-question").on("click", function () {

        const $item = $(this).closest(".faq-item");
        const isActive = $item.hasClass("active");

        // Close every item (single-open accordion)
        $(".faq-item").removeClass("active")
            .find(".faq-answer").slideUp(300);

        $(".faq-question").attr("aria-expanded", "false")
            .find("i").removeClass("fa-minus").addClass("fa-plus");

        // Open the clicked item only if it was previously closed
        if (!isActive) {

            $item.addClass("active");
            $item.find(".faq-answer").slideDown(300);

            $(this).attr("aria-expanded", "true")
                .find("i").removeClass("fa-plus").addClass("fa-minus");

        }

    });


    // ===============================
    // Book Card Animation
    // ===============================

    $(".book-card").hide();

    $(".book-card").each(function (index) {

        $(this).delay(index * 200).fadeIn(600);

    });


    // ===============================
    // Department Click
    // ===============================

    $(".dept").click(function () {

        let dept = $(this).text().toLowerCase();

        $(".book-card").hide();

        $(".book-card").filter(function () {

            $(this).text().toLowerCase().indexOf(dept) > -1;

        }).fadeIn();

    });


    // ===============================
    // Newsletter
    // ===============================

    $(".newsletter button").click(function (e) {

        e.preventDefault();

        let email = $(".newsletter input").val();

        if (email == "") {

            alert("Please enter your email.");

        }

        else {

            alert("Thank you for subscribing!");

            $(".newsletter input").val("");

        }

    });

});