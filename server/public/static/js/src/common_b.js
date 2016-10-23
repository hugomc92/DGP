$(document).ready(function() {
	// Initialize Hamburger menu for mobiles
	$(".button-collapse").sideNav();

	var pathname = window.location.pathname;

	var active_li;

	switch(pathname) {
		case "/backend/":
			active_li = setActiveLi("Inicio");
			break;
		case "/backend/users/":
			active_li = setActiveLi("Usuarios");
			break;
	}
});

function setActiveLi(section) {
	$('#slide-out li a').each(function() {
		if($(this).text() === section) {
			element = $(this).parent();
			element.attr("class", "active");
		}
	});
}