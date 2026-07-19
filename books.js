/* =====================================================
   BOOKS PAGE — Dynamic filtering
   Data is loaded via AJAX ($.getJSON) from books.json.
   FALLBACK_BOOKS keeps the page working when opened
   directly from disk (file://), where AJAX is blocked.
   All filters (search, department, semester, category)
   combine with AND logic and update the grid instantly.
===================================================== */

$(function () {

    // ---- Offline fallback (mirror of books.json) --------------------
    const FALLBACK_BOOKS = [
        { title: "Automobile Engineering-1", department: "Automobile", semester: "3rd Semester", category: "New", price: 180, image: "images/automobile/auto1.jpg" },
        { title: "Automobile Chassis & Body", department: "Automobile", semester: "4th Semester", category: "Used", price: 120, image: "images/automobile/auto2.jpg" },
        { title: "Engine Systems", department: "Automobile", semester: "5th Semester", category: "New", price: 200, image: "images/automobile/auto3.jpg" },
        { title: "Vehicle Maintenance", department: "Automobile", semester: "6th Semester", category: "Free", price: 0, image: "images/automobile/auto4.jpg" },
        { title: "Architectural Design-1", department: "Architecture", semester: "2nd Semester", category: "New", price: 190, image: "images/architecture/arc1.jpg" },
        { title: "Building Materials", department: "Architecture", semester: "3rd Semester", category: "Used", price: 130, image: "images/architecture/arc2.jpg" },
        { title: "Basic Surveying", department: "Architecture", semester: "4th Semester", category: "Free", price: 0, image: "images/architecture/arc3.jpg" },
        { title: "Structural Design", department: "Architecture", semester: "6th Semester", category: "New", price: 210, image: "images/architecture/arc4.jpg" },
        { title: "Programming in C", department: "CST", semester: "2nd Semester", category: "New", price: 150, image: "images/cst/cst1.jpg" },
        { title: "Data Structures", department: "CST", semester: "3rd Semester", category: "Used", price: 140, image: "images/cst/cst2.jpg" },
        { title: "Database Management", department: "CST", semester: "4th Semester", category: "New", price: 170, image: "images/cst/cst3.jpg" },
        { title: "Python Programming", department: "CST", semester: "3rd Semester", category: "Free", price: 0, image: "images/cst/cst4.jpg" },
        { title: "Engineering Drawing", department: "Civil", semester: "1st Semester", category: "New", price: 160, image: "images/civil/civ1.jpg" },
        { title: "Surveying-1", department: "Civil", semester: "3rd Semester", category: "Used", price: 120, image: "images/civil/civ2.jpg" },
        { title: "Concrete Technology", department: "Civil", semester: "5th Semester", category: "Free", price: 0, image: "images/civil/civ3.jpg" },
        { title: "Estimating & Costing-2", department: "Civil", semester: "7th Semester", category: "New", price: 170, image: "images/civil/civ4.jpg" },
        { title: "Basic Electronics", department: "Electronics", semester: "2nd Semester", category: "New", price: 155, image: "images/electric/elec1.jpg" },
        { title: "Industrial Electronics", department: "Electronics", semester: "3rd Semester", category: "New", price: 170, image: "images/electric/elec2.jpeg" },
        { title: "Digital Electronics", department: "Electronics", semester: "4th Semester", category: "Used", price: 125, image: "images/electric/elec3.jpg" },
        { title: "Microcontrollers", department: "Electronics", semester: "6th Semester", category: "Free", price: 0, image: "images/electric/elec4.jpg" },
        { title: "Workshop Practice", department: "Mechanical", semester: "1st Semester", category: "Free", price: 0, image: "images/mechanic/mec1.jpg" },
        { title: "Thermodynamics", department: "Mechanical", semester: "3rd Semester", category: "New", price: 175, image: "images/mechanic/mec2.jpg" },
        { title: "Fluid Mechanics", department: "Mechanical", semester: "4th Semester", category: "Used", price: 130, image: "images/mechanic/mec3.jpg" },
        { title: "Machine Design", department: "Mechanical", semester: "6th Semester", category: "New", price: 200, image: "images/mechanic/mec4.jpg" },
        { title: "Electrical Circuits", department: "Power", semester: "2nd Semester", category: "Free", price: 0, image: "images/power/power1.jpg" },
        { title: "Electrical Machines-1", department: "Power", semester: "3rd Semester", category: "New", price: 180, image: "images/power/power2.jpg" },
        { title: "Power Generation", department: "Power", semester: "5th Semester", category: "Used", price: 140, image: "images/power/power3.jpg" },
        { title: "Switchgear & Protection", department: "Power", semester: "6th Semester", category: "New", price: 195, image: "images/power/power4.jpg" },
        { title: "Basic Refrigeration", department: "Refrigeration", semester: "2nd Semester", category: "New", price: 165, image: "images/rac/rac1.jpg" },
        { title: "HVAC Fundamentals", department: "Refrigeration", semester: "3rd Semester", category: "Free", price: 0, image: "images/rac/rac2.jpeg" },
        { title: "Air Conditioning", department: "Refrigeration", semester: "4th Semester", category: "Used", price: 125, image: "images/rac/rac3.jpg" },
        { title: "Cold Storage Systems", department: "Refrigeration", semester: "5th Semester", category: "New", price: 185, image: "images/rac/rac4.jpg" },
        { title: "Electrical Circuit-1", department: "TCT", semester: "2nd Semester", category: "Free", price: 0, image: "images/tele/tct1.jpg" },
        { title: "Communication Systems", department: "TCT", semester: "4th Semester", category: "New", price: 175, image: "images/tele/tct2.jpg" },
        { title: "Optical Fiber Communication", department: "TCT", semester: "6th Semester", category: "Used", price: 135, image: "images/tele/tct3.jpg" },
        { title: "Microwave Engineering", department: "TCT", semester: "7th Semester", category: "New", price: 200, image: "images/tele/tct4.jpeg" }
    ];

    // ---- Elements ---------------------------------------------------
    const $grid      = $("#bookGrid");
    const $noResults = $("#noResults");
    const $count     = $("#resultCount");
    const $search    = $("#searchInput");
    const $dept      = $("#deptFilter");
    const $sem       = $("#semFilter");

    let allBooks = [];

    // Active filter state
    const state = { search: "", dept: "all", sem: "all", category: "all" };

    // ---- Rendering --------------------------------------------------
    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function cardHTML(book) {
        const priceLabel = book.category === "Free" ? "Free" : "৳" + book.price;
        const title = escapeHtml(book.title);
        return (
            '<article class="book-card">' +
                '<span class="book-badge badge-' + book.category.toLowerCase() + '">' + book.category.toUpperCase() + '</span>' +
                '<div class="wishlist" role="button" tabindex="0" aria-label="Add to wishlist">' +
                    '<i class="fa-regular fa-heart"></i>' +
                '</div>' +
                '<img src="' + book.image + '" alt="' + title + '" loading="lazy">' +
                '<h3>' + title + '</h3>' +
                '<p>' + escapeHtml(book.department) + ' · ' + escapeHtml(book.semester) + '</p>' +
                '<h4>' + priceLabel + '</h4>' +
                '<button type="button" class="view-btn">View Details</button>' +
            '</article>'
        );
    }

    function render(list) {
        if (!list.length) {
            $grid.empty().hide();
            $noResults.prop("hidden", false);
        } else {
            $noResults.prop("hidden", true);
            $grid.html(list.map(cardHTML).join("")).show();
        }
        updateCount(list.length);
    }

    function updateCount(n) {
        const total = allBooks.length;
        const filtered = (state.search || state.dept !== "all" ||
                          state.sem !== "all" || state.category !== "all");
        $count.text(
            filtered
                ? "Showing " + n + " of " + total + " books"
                : "Showing all " + total + " books"
        );
        $("#clearFilters").toggle(filtered);
    }

    // ---- Filtering (all filters combined) ---------------------------
    function applyFilters() {
        const q = state.search;
        const result = allBooks.filter(function (b) {
            const matchSearch = !q ||
                (b.title + " " + b.department).toLowerCase().indexOf(q) > -1;
            const matchDept = state.dept === "all" || b.department === state.dept;
            const matchSem  = state.sem === "all" || b.semester === state.sem;
            const matchCat  = state.category === "all" || b.category === state.category;
            return matchSearch && matchDept && matchSem && matchCat;
        });
        render(result);
    }

    // ---- Events -----------------------------------------------------
    let searchTimer;
    $search.on("input", function () {
        const val = $(this).val().toLowerCase().trim();
        clearTimeout(searchTimer);
        searchTimer = setTimeout(function () {
            state.search = val;
            applyFilters();
        }, 180);
    });

    $dept.on("change", function () {
        state.dept = $(this).val();
        applyFilters();
    });

    $sem.on("change", function () {
        state.sem = $(this).val();
        applyFilters();
    });

    $(".category button").on("click", function () {
        $(".category button").removeClass("active-btn");
        $(this).addClass("active-btn");
        state.category = $(this).data("category");
        applyFilters();
    });

    // The Search button just re-applies (results are already live)
    $("#searchBtn").on("click", function (e) {
        e.preventDefault();
        state.search = $search.val().toLowerCase().trim();
        applyFilters();
    });

    // Clear all filters
    $("#clearFilters").on("click", function () {
        state.search = ""; state.dept = "all"; state.sem = "all"; state.category = "all";
        $search.val("");
        $dept.val("all");
        $sem.val("all");
        $(".category button").removeClass("active-btn");
        $('.category button[data-category="all"]').addClass("active-btn");
        applyFilters();
    });

    // Wishlist toggle (delegated — cards are added dynamically)
    $grid.on("click keydown", ".wishlist", function (e) {
        if (e.type === "keydown" && e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        const icon = $(this).find("i");
        icon.toggleClass("fa-regular fa-solid");
        icon.css("color", icon.hasClass("fa-solid") ? "#e11d48" : "");
    });

    $grid.on("click", ".view-btn", function () {
        const title = $(this).closest(".book-card").find("h3").text();
        alert("Details for \"" + title + "\" — coming soon!");
    });

    // ---- Load data via AJAX, fall back to inline data ---------------
    function init(data) {
        allBooks = data;
        applyFilters();
    }

    $count.text("Loading books…");
    $.getJSON("books.json")
        .done(function (data) { init(data); })
        .fail(function () {
            // file:// or missing file — use the bundled dataset
            init(FALLBACK_BOOKS);
        });
});
