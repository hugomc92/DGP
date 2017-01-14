var currentLangs = [];
var form;
var langs;
var visitId;
var locations;
var selectLocation;
var action;
var photoAdd;

$(document).ready(function() {

	if($('#content_action').text().indexOf('Añadir') > -1)
		action = 'add';
	else 
		action = 'edit';

	console.log('action', action);

	if(action === 'edit') {
		$('.image_visit').removeAttr('required');
	}

	if($('#visits').attr('visit-id') !== '')
		visitId = $('#visits').attr('visit-id');

	console.log('visitId', visitId);

	$.ajax({
		type: "GET",
		url: "/api/lang?email="+$("#email").text(),
		datatype: "json",
		success: function(jsondata) {
			langs = jsondata;
		},
		error : function(xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});

	$.ajax({
		type: "GET",
		url: "/api/localization/all?email="+$("#email").text(),
		datatype: "json",
		success: function(jsondata) {
			locations = jsondata;

			selectLocation = '<option value="" disabled selected>Añadir Localización</option>';
			
			for(var i=0; i<locations.length; i++) {
				selectLocation += '<option value="' + locations[i].ID + '">' + locations[i].DESCRIPTION + '</option>';
			}
			
			selectLocation += '</select></div>';
		},
		error : function(xhr, status) {
			console.log(xhr);
			console.log(status);
		}
	});

	var elems = $('.info_form').parent().parent();

	form = $(elems[0]).find('.info_form').parent().html();

	for(var i=0; i<elems.length; i++) {
		var elem = $(elems[i]);

		initilizeForm(elem, elem.attr('visit-lang'));
	}

	$('#more_langs').click(function() {
		$('#select_lang').openModal( {
			complete: cleanAddLangModal
		});

		if(typeof(langs) === 'undefined') {
			$.ajax({
				type: "GET",
				url: "/api/lang?email="+$("#email").text(),
				datatype: "json",
				success: function(jsondata) {
					langs = jsondata;

					var selectionHTML = '<select id="lang_select"><option value="" disabled selected>Elige un idioma</option>';

					for(var i=0; i<jsondata.length; i++) {
						var alreadyAdded = false;

						for(var j=0; j<currentLangs.length; j++)
							if(jsondata[i].ID === currentLangs[j])
								alreadyAdded = true;

						if(!alreadyAdded)
							selectionHTML += '<option value="' + jsondata[i].ID + '" data-icon="' + jsondata[i].FLAG + '" class="left circle">' + jsondata[i].NAME + '</option>';
					}

					selectionHTML += '</select>';

					if(selectionHTML !== '<select id="lang_select"><option value="" disabled selected>Elige un idioma</option></select>') {
						$('#lang_selection').append(selectionHTML);

						$('select').material_select();

						$('#select_lang_submit').text('AÑADIR');
					}
					else {
						$('#lang_selection').append('<h4>ESTA VISITA YA ESTÁ EN TODOS LOS IDIOMAS DISPONIBLES</h4>');

						$('#select_lang_submit').text('CERRAR');
					}

					$('#select_lang_loader').css('opacity', '0');
					setTimeout(function() { $('#select_lang_loader').css('display', 'none'); }, 1000);
				},
				error : function(xhr, status) {
					console.log(xhr);
					console.log(status);

					Materialize.toast("Se ha producido un error recuperando los idiomas", 4000,'', function() { $('#select_lang').closeModal(); });
				}
			});
		}
		else {
			var selectionHTML = '<select id="lang_select"><option value="" disabled selected>Elige un idioma</option>';

			for(var i=0; i<langs.length; i++) {
				var alreadyAdded = false;

				for(var j=0; j<currentLangs.length; j++)
					if(langs[i].ID === currentLangs[j])
						alreadyAdded = true;

				if(!alreadyAdded)
					selectionHTML += '<option value="' + langs[i].ID + '" data-icon="' + langs[i].FLAG + '" class="left circle">' + langs[i].NAME + '</option>';
			}

			selectionHTML += '</select>';

			if(selectionHTML !== '<select id="lang_select"><option value="" disabled selected>Elige un idioma</option></select>') {
				$('#lang_selection').append(selectionHTML);

				$('select').material_select();

				$('#select_lang_submit').text('AÑADIR');
			}
			else {
				$('#lang_selection').append('<h4>ESTA VISITA YA ESTÁ EN TODOS LOS IDIOMAS DISPONIBLES</h4>');

				$('#select_lang_submit').text('CERRAR');
			}

			$('#select_lang_loader').css('opacity', '0');
			setTimeout(function() { $('#select_lang_loader').css('display', 'none'); }, 1000);
		}
	});

	$('#select_lang_submit').click(function() {
		$('#select_lang').closeModal();

		if($('#lang_select').val() !== null) {
			var langId = parseInt($('#lang_select').val());

			currentLangs.push(langId);

			var found = false;
			var lang;

			for(var i=0; i<langs.length && !found; i++) {
				if(langs[i].ID === langId) {
					lang = langs[i];
					
					found = true;
				}
			}

			// Add new Tab
			$('.tabs').append('<li class="tab col"><a href="#' + lang.NAME.toLowerCase() + '_visit"><img src="' + lang.FLAG + '" alt="Bandera ' + lang.NAME + '" width="25px"/><span class="hide-on-small-only">' + lang.NAME + '</span></a></li>');

			// Update all tabs
			$('ul.tabs').tabs();

			// Add new visit tab
			$('#visits').append('<div id="' + lang.NAME.toLowerCase() + '_visit" class="col s12" visit-lang="' + lang.ID + '" info-id="" style="display:none"><div class="row">' + form + '</div>');

			// Clean all values
			$('#' + lang.NAME.toLowerCase() + '_visit').find('.info_form').find('input:not([type=hidden]):not([type=date])').each(function() {
				$(this).val('');
			});
			$('#' + lang.NAME.toLowerCase() + '_visit').find('.info_form').find('textarea').each(function() {
				$(this).text('');
				$(this).trigger('autoresize');
			});

			$('#' + lang.NAME.toLowerCase() + '_visit').find('.image_alt_text').text('NO TIENE TEXTO ALTERNATIVO EN ESTE IDIOMA');

			$('#' + lang.NAME.toLowerCase() + '_visit').find('.materialboxed').removeClass('initialized');

			$('#' + lang.NAME.toLowerCase() + '_visit').find('.materialboxed').attr('data-caption', '');
			
			$('#' + lang.NAME.toLowerCase() + '_visit').find('.materialboxed').materialbox();

			if(action === 'edit') {
				$('.image_visit').removeAttr('required');
			}

			initilizeForm($('#' + lang.NAME.toLowerCase() + '_visit'), langId);
		}

		cleanAddLangModal();
	});
});

function initilizeForm(elem, langId) {

	var form = elem.find('.info_form');

	currentLangs.push(parseInt(langId));

	form.find('ul.tabs').tabs();

	form.find('input, textarea').characterCounter();

	initializeLocationSelects(form.find(('select')));

	imagePrevisualization(form.find('#visit_image'), form.find('#visitImagePreview'));

	if(action === 'edit') {
		form.find('#visitImagePreview').attr('src', photoAdd);
	}

	form.submit( function( e ) {
		var langId = form.parent().parent().attr('visit-lang');

		form.find('#visit_lang').val(langId);

		photoAdd = form.find('#visitImagePreview').attr('src');

		if(action === 'edit') {
			var visitInfoId = form.parent().parent().attr('info-id');

			form.find('#info_id').val(visitInfoId);
			form.find('#visit_id').val(visitId);
		}

		$.ajax( {
			url: '/api/guided_visit/' + action  + '?email="+$("#email").text()',
			type: 'POST',
			data: new FormData( this ),
			processData: false,
			contentType: false,
			success: function(jsondata) {
				if(jsondata.ok === 'failed') {
					Materialize.toast('Se ha producido un fallo interno', 4000);
				}
				else if(jsondata.ok === 'not_allowed') {
					Materialize.toast('No tiene los permisos suficientes para añadir una visita', 4000);
				}
				else {
					Materialize.toast('Se ha guardado la visita con éxito', 4000);

					visitId = jsondata.visitId;

					form.find('#visit_id').val(visitId);
					form.parent().parent().attr('info-id', jsondata.visitInfoId);

					if(action === 'add') {
						action = 'edit';

						form.find('#visit_image').val('');
						
						$('.image_visit').removeAttr('required');
					}

					$('.imagePreview').attr('src', photoAdd);
				}
			},
			error : function(xhr, status) {
				Materialize.toast("Se ha producido un fallo añadiendo la visita", 4000);
			}
		} );

		e.preventDefault();
	} );
}

function initializeLocationSelects(elems) {

	for(var i=0; i<elems.length; i++)
		initializeLocationSelect(elems[i]);
}

function initializeLocationSelect(elem) {
	$(elem).material_select();

	$(elem).change(function() {
		var ulParent = $(this).parent().parent().parent().parent();

		// Check if it's needed to add a new location select
		if(ulParent.children('li').last().find('select').attr('id') === $(this).attr('id')) {
			var liParent = ulParent.children('li').last();

			var order = liParent.find('.order').text();

			order = parseInt(order.substring(0, order.indexOf('º'))) + 1;

			ulParent.append('<li><div class="order col s2"><p>' + order + 'º</p></div><div class="input-field col s10"><select id="visit_location_' + order + '" name="visit_location_' + order + '">' + selectLocation + '</li>');

			initializeLocationSelect(ulParent.children('li').last().find('select'));
		}
	});
}

function cleanAddLangModal() {

	$('#lang_selection').text('');

	$('#select_lang_loader').css('opacity', '1');
	$('#select_lang_loader').css('display', 'initial');
}