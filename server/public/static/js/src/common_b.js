$(document).ready(function() {
	// Initialize Hamburger menu for mobiles
	$(".button-collapse").sideNav();

	var pathname = window.location.pathname;

	var active_li;

	if(pathname.indexOf('contents') > 0)
		active_li = setActiveLi("Contenido");
	else if (pathname.indexOf('contents') > 0)
		active_li = setActiveLi("Contenido");
	else if (pathname.indexOf('localizations') > 0)
		active_li = setActiveLi("Localizaciones");
	else if (pathname.indexOf('contentTypes') > 0)
		active_li = setActiveLi("Tipos");
	else if (pathname.indexOf('activityLogs') > 0)
		active_li = setActiveLi("Histórico");
	else if (pathname.indexOf('guided_visits') > 0)
		active_li = setActiveLi("Visitas Guiadas");
	else if (pathname.indexOf('users') > 0)
		active_li = setActiveLi("Usuarios");
	else if (pathname.indexOf('langs') > 0)
		active_li = setActiveLi("Idiomas");
	else
		active_li = setActiveLi("Inicio");
});

function setActiveLi(section) {
	$('#slide-out li a').each(function() {
		if($(this).text() === section) {
			element = $(this).parent();
			element.attr("class", "active");
		}
	});
}
