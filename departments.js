/* =====================================================
   DEPARTMENTS PAGE — Real-time search
   Department data is loaded via AJAX ($.getJSON) from
   departments.json and rendered into cards. Typing in
   the search box filters the cards live (as-you-type).
   FALLBACK_DEPTS keeps it working over file://.
===================================================== */

$(function () {

    const FALLBACK_DEPTS = [
        { name: "Architecture", icon: "fa-compass-drafting", books: 130, desc: "Design, drawing & building planning" },
        { name: "Automobile", icon: "fa-car", books: 160, desc: "Engines, chassis & vehicle systems" },
        { name: "Computer Technology", icon: "fa-computer", books: 320, desc: "Programming, databases & networking" },
        { name: "Civil", icon: "fa-building", books: 250, desc: "Surveying, structures & construction" },
        { name: "Electrical", icon: "fa-bolt", books: 280, desc: "Circuits, machines & power systems" },
        { name: "Mechanical", icon: "fa-gears", books: 210, desc: "Thermodynamics, design & machines" },
        { name: "Power", icon: "fa-battery-three-quarters", books: 95, desc: "Generation, distribution & protection" },
        { name: "RAC", icon: "fa-snowflake", books: 120, desc: "Refrigeration & air conditioning" },
        { name: "Telecommunication", icon: "fa-tower-cell", books: 280, desc: "Communication & signal systems" }
    ];

    const $grid      = $("#deptGrid");
    const $noResults = $("#deptNoResults");
    const $count     = $("#deptCount");
    const $search    = $("#deptSearch");

    let allDepts = [];

    function escapeHtml(str) {
        return String(str).replace(/[&<>"']/g, function (c) {
            return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
        });
    }

    function cardHTML(d) {
        const name = escapeHtml(d.name);
        return (
            '<div class="department-card">' +
                '<i class="fa-solid ' + escapeHtml(d.icon) + '"></i>' +
                '<h2>' + name + '</h2>' +
                '<p class="dept-desc">' + escapeHtml(d.desc) + '</p>' +
                '<span class="dept-count">' + d.books + ' Books</span>' +
                '<a href="books.html">View Books</a>' +
            '</div>'
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
        const total = allDepts.length;
        $count.text(
            n === total
                ? "Showing all " + total + " departments"
                : "Showing " + n + " of " + total + " departments"
        );
    }

    function filter(query) {
        const q = query.toLowerCase().trim();
        const result = !q ? allDepts : allDepts.filter(function (d) {
            return (d.name + " " + d.desc).toLowerCase().indexOf(q) > -1;
        });
        render(result);
    }

    // As-you-type search (debounced)
    let timer;
    $search.on("input", function () {
        const val = $(this).val();
        clearTimeout(timer);
        timer = setTimeout(function () { filter(val); }, 150);
    });

    // Search button + Enter key
    $("#deptSearchBtn").on("click", function (e) {
        e.preventDefault();
        filter($search.val());
    });
    $search.on("keydown", function (e) {
        if (e.key === "Enter") { e.preventDefault(); filter($(this).val()); }
    });

    function init(data) {
        allDepts = data;
        render(data);
    }

    $count.text("Loading departments…");
    $.getJSON("departments.json")
        .done(function (data) { init(data); })
        .fail(function () { init(FALLBACK_DEPTS); });
});
