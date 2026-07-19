/* =====================================================
   DONATE PAGE — Donation Books section
   Submitting the donation form instantly adds the book
   as a card in the "Donation Books" grid (no reload).
   User donations persist in localStorage; a few seed
   examples keep the section populated on first visit.
===================================================== */

$(function () {

    const STORAGE_KEY = "diplomabook_donations";
    const PLACEHOLDER = "images/book.png";

    // Seed examples so the section matches other populated book sections
    const SEED_BOOKS = [
        { title: "Programming in C", author: "E. Balagurusamy", dept: "Computer", semester: "2nd Semester", category: "Used Book", condition: "Good", price: "120", image: "images/cst/cst1.jpg", donor: "Rakib" },
        { title: "Engineering Drawing", author: "N. D. Bhatt", dept: "Civil", semester: "1st Semester", category: "Free Donation", condition: "Average", price: "", image: "images/civil/civ1.jpg", donor: "Sadia" },
        { title: "Basic Electronics", author: "B. L. Theraja", dept: "Electronics", semester: "2nd Semester", category: "New Book", condition: "Excellent", price: "160", image: "images/electric/elec1.jpg", donor: "Tanvir" }
    ];

    const $grid  = $("#donationGrid");
    const $empty = $("#donationEmpty");
    const $form  = $("#donateBookForm");

    // ---- Storage helpers -------------------------------------------
    function loadSaved() {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
        } catch (e) {
            return [];
        }
    }

    function saveAll(list) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
        } catch (e) {
            // Quota exceeded (large images) — keep working for this session
            console.warn("Could not persist donations:", e);
        }
    }

    let userBooks = loadSaved();

    // ---- Rendering --------------------------------------------------
    function escapeHtml(str) {
        return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function badgeClass(category) {
        const c = (category || "").toLowerCase();
        if (c.indexOf("free") > -1)     return "badge-free";
        if (c.indexOf("used") > -1)     return "badge-used";
        if (c.indexOf("exchange") > -1) return "badge-exchange";
        return "badge-new";
    }

    function badgeText(category) {
        const c = (category || "").toLowerCase();
        if (c.indexOf("free") > -1)     return "FREE";
        if (c.indexOf("used") > -1)     return "USED";
        if (c.indexOf("exchange") > -1) return "EXCHANGE";
        return "NEW";
    }

    function priceLabel(book) {
        if ((book.category || "").toLowerCase().indexOf("free") > -1) return "Free";
        if (book.price && String(book.price).trim() !== "") return "৳" + escapeHtml(book.price);
        return "Negotiable";
    }

    function cardHTML(book) {
        const title  = escapeHtml(book.title || "Untitled Book");
        const author = book.author ? '<span class="donation-author">by ' + escapeHtml(book.author) + '</span>' : "";
        const donor  = book.donor ? '<span class="donation-donor"><i class="fa-solid fa-user"></i> ' + escapeHtml(book.donor) + '</span>' : "";
        return (
            '<article class="donation-card">' +
                '<span class="book-badge ' + badgeClass(book.category) + '">' + badgeText(book.category) + '</span>' +
                '<div class="donation-thumb">' +
                    '<img src="' + escapeHtml(book.image || PLACEHOLDER) + '" alt="' + title + '" loading="lazy" onerror="this.src=\'' + PLACEHOLDER + '\'">' +
                '</div>' +
                '<div class="donation-info">' +
                    '<h3>' + title + '</h3>' +
                    author +
                    '<p>' + escapeHtml(book.dept) + ' · ' + escapeHtml(book.semester) + '</p>' +
                    '<span class="donation-condition">Condition: ' + escapeHtml(book.condition || "N/A") + '</span>' +
                    '<h4>' + priceLabel(book) + '</h4>' +
                    donor +
                '</div>' +
            '</article>'
        );
    }

    function renderAll() {
        // Newest user donations first, then seed examples
        const list = userBooks.concat(SEED_BOOKS);
        if (!list.length) {
            $grid.hide();
            $empty.prop("hidden", false);
            return;
        }
        $empty.prop("hidden", true);
        $grid.html(list.map(cardHTML).join("")).show();
    }

    // ---- Form submission -------------------------------------------
    function buildBook(image) {
        return {
            title:     $("#bookName").val().trim(),
            author:    $("#authorName").val().trim(),
            dept:      $("#bookDept").val(),
            semester:  $("#bookSem").val(),
            category:  $("#bookCategory").val(),
            condition: $("#bookCondition").val(),
            price:     $("#bookPrice").val().trim(),
            donor:     $("#donorName").val().trim(),
            image:     image || PLACEHOLDER
        };
    }

    function addBook(book) {
        userBooks.unshift(book);      // newest first
        saveAll(userBooks);
        renderAll();

        // Highlight and scroll to the newly added card
        const $newCard = $grid.children().first().addClass("just-added");
        $("html, body").animate({
            scrollTop: $("#donationBooks").offset().top - 40
        }, 500);
        setTimeout(function () { $newCard.removeClass("just-added"); }, 1600);

        $form[0].reset();
    }

    $form.on("submit", function (e) {
        e.preventDefault();

        if ($("#bookName").val().trim() === "") {
            alert("Please enter the book name before submitting.");
            $("#bookName").focus();
            return;
        }

        const file = $("#bookCover")[0].files[0];

        if (file && file.type.indexOf("image") === 0) {
            const reader = new FileReader();
            reader.onload = function (ev) { addBook(buildBook(ev.target.result)); };
            reader.onerror = function () { addBook(buildBook(null)); };
            reader.readAsDataURL(file);
        } else {
            addBook(buildBook(null));
        }
    });

    // ---- Initial render --------------------------------------------
    renderAll();
});
