$(document).ready(function() {
	// Initialize Hamburger menu for mobiles
	$(".button-collapse").sideNav();

	var pathname = window.location.pathname;

	var active_li;

	switch(pathname) {
		case "/backend/":
			active_li = setActiveLi("Inicio");
			break;
		case "/backend/contents/": case "/backend/contents/add":
			active_li = setActiveLi("Contenido");
			break;
		case "/backend/localizations/":
			active_li = setActiveLi("Localizaciones");
			break;
		case "/backend/contentTypes/":
			active_li = setActiveLi("Tipos");
			break;
		case "/backend/activityLogs/":
			active_li = setActiveLi("Histórico");
			break;
		case "/backend/guided_visit/":
			active_li = setActiveLi("Visita Guiadas");
			break;
		case "/backend/users/":
			active_li = setActiveLi("Usuarios");
			break;
		case "/backend/langs/":
			active_li = setActiveLi("Idiomas");
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
