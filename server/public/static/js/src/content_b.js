var currentLangs = [];
var form;
var multimediaImg;
var multimediaVideo;
var langs;
var contentId;
var dateInUpdate;
var action;
var imageModalSubmit;

$(document).ready(function() {

	if($('#content_action').text().indexOf('Añadir') > -1)
		action = 'add';
	else 
		action = 'edit';

	if($('#contents').attr('content-id') !== '')
		contentId = $('#contents').attr('content-id');

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

	imageModalSubmit = $('#modal_content_image').find('form').attr('action');
	videoModalSubmit = $('#modal_content_video').find('form').attr('action');

	var elems = $('.info_form').parent().parent();

	form = $(elems[0]).find('.info_form').parent().html();

	multimediaImg = $(elems[0]).find('.img_content').html();
	multimediaVideo = $(elems[0]).find('.video_content').html();

	for(var i=0; i<elems.length; i++) {
		var elem = $(elems[i]);

		initilizeForm(elem, elem.attr('content-lang'));
		initilizeMultimediaImage(elem);
		initilizeMultimediaVideo(elem);
	}

	if(action === 'edit')
		$('.multimedia').css('display', 'block');

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
						$('#lang_selection').append('<h4>ESTE CONTENIDO YA ESTÁ EN TODOS LOS IDIOMAS DISPONIBLES</h4>');

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
				$('#lang_selection').append('<h4>ESTE CONTENIDO YA ESTÁ EN TODOS LOS IDIOMAS DISPONIBLES</h4>');

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
			$('.tabs').append('<li class="tab col"><a href="#' + lang.NAME.toLowerCase() + '_content"><img src="' + lang.FLAG + '" alt="Bandera ' + lang.NAME + '" width="25px"/><span class="hide-on-small-only">' + lang.NAME + '</span></a></li>');

			// Update all tabs
			$('ul.tabs').tabs();

			// Add new content tab
			$('#contents').append('<div id="' + lang.NAME.toLowerCase() + '_content" class="col s12" content-lang="' + lang.ID + '" info-id="" style="display:none"><div class="row">' + form + '</div><div class="multimedia img_content row z-depth-1" style="display: block;">' + multimediaImg + '</div><div class="multimedia video_content row z-depth-1" style="display: block;">' + multimediaVideo + '</div></div>');

			// Clean all values
			$('#' + lang.NAME.toLowerCase() + '_content').find('.info_form').find('input:not([type=hidden]):not([type=date])').each(function() {
				$(this).val('');
			});
			$('#' + lang.NAME.toLowerCase() + '_content').find('.info_form').find('textarea').each(function() {
				$(this).text('');
				$(this).trigger('autoresize');
			});

			$('#' + lang.NAME.toLowerCase() + '_content').find('.image_alt_text').text('NO TIENE TEXTO ALTERNATIVO EN ESTE IDIOMA');

			$('#' + lang.NAME.toLowerCase() + '_content').find('.materialboxed').removeClass('initialized');

			$('#' + lang.NAME.toLowerCase() + '_content').find('.materialboxed').attr('data-caption', '');
			
			$('#' + lang.NAME.toLowerCase() + '_content').find('.materialboxed').materialbox();

			initilizeForm($('#' + lang.NAME.toLowerCase() + '_content'), langId);
			initilizeMultimediaImage($('#' + lang.NAME.toLowerCase() + '_content'));
			initilizeMultimediaVideo($('#' + lang.NAME.toLowerCase() + '_content'));
		}

		cleanAddLangModal();
	});
});

function initilizeForm(elem, langId) {

	var form = elem.find('.info_form');

	currentLangs.push(parseInt(langId));

	form.find('ul.tabs').tabs();

	form.find('input, textarea').characterCounter();

	$('select').material_select();

	form.find('select').change(function() {
		$(this).parent().find('input.select-dropdown').css('color', '#000');
	});

	// If edit and it's been selected, change color to black
	if(action === 'edit') {
		var selects = form.find('select');

		for(var i=0; i<selects.length; i++) {
			if($(selects[i]).val() !== null) {
				/*console.log($(selects[i]).parent().find('.select-dropdown'));
				$(selects[i]).parent().find('input.select-dropdown').css('color', 'black');*/
				//console.log($(selects[i]).parent().find('input.select-dropdown').css('color'));
				$(selects[i]).trigger('change');
				//console.log($(selects[i]).parent().find('input.select-dropdown').css('color'));
			}
		}
	}

	var dateInPicker = initializeDatePicker(form.find('#content_date_in'));
	var dateOutPicker = initializeDatePicker(form.find('#content_date_out'));

	Materialize.updateTextFields();

	var dateIn = form.find('#content_date_in');
	var dateOut = form.find('#content_date_out');

	var dateInHidden = form.find('#content_date_in_hidden');
	var dateOutHidden = form.find('#content_date_out_hidden');

	dateIn.on('change', function() {
		dateOut.val('');

		setTimeout(function() {
			var infoUpdate = dateInUpdate.split('/');
			var day = infoUpdate[0];
			var month = infoUpdate[1];
			var year = infoUpdate[2];

			var minDate = [parseInt(year), parseInt(month)-1, day];

			dateOutPicker.set('min', minDate);

			dateInHidden.val(day + '/' + month + '/' + year);
		}, 500);		
	});

	dateOut.on('change', function() {
		setTimeout(function() {
			var infoUpdate = dateInUpdate.split('/');
			var day = infoUpdate[0];
			var month = infoUpdate[1];
			var year = infoUpdate[2];

			dateOutHidden.val(day + '/' + month + '/' + year);
		}, 500);
	});

	form.on('submit', function(event) {
		event.preventDefault();

		send_data($(this));
	});
}

function initilizeMultimediaImage(elem) {

	if(action === 'add')
		$('.multimedia').css('display', 'none');

	elem.find('.new_image').click(function() {
		$('#modal_content_image #image_loader').css('display', 'none');
		$('#modal_content_image .modal-header h4').text('Añadir Imagen');

		var modalForm = $('#modal_content_image').find('form');

		var newAction = imageModalSubmit + 'add/' + contentId;

		modalForm.attr('action', newAction);

		for(var i=0; i<langs.length; i++) {
			var alreadyAdded = false;

			for(var j=0; j<currentLangs.length; j++)
				if(langs[i].ID === currentLangs[j])
					alreadyAdded = true;

			if(alreadyAdded)
				$('#modal_content_image').find('#alt_texts_container').append('<div class="alt_text input-field col s12"><i class="material-icons prefix"><img src="' + langs[i].FLAG + '" class="circle" width="30px" height="30px"/>\</i><input id="alt_text_' + langs[i].ID + '" name="alt_text_' + langs[i].ID + '" type="text" class="validate" required><label for="' + langs[i].ID + '">Texto Alternativo (' + langs[i].NAME + ')</label></div>');
		}

		$('#modal_content_image').openModal( {
			complete: function() {
				$('#modal_content_image').find('modal-header h4').text('');

				$('#modal_content_image').find('input, textarea').each(function() {
					$(this).val('');
					$(this).trigger('autoresize');
				});

				$('#modal_content_image').find('#alt_texts_container').text('');

				Materialize.updateTextFields();

				$("#contentImagePreview").attr('src', '/static/img/img_not_available.png');
				$('#modal_content_image #image_loader').css('display', 'block');
			}
		});
	});

	elem.find('.image_actions .edit_multimedia').click(function() {
		
		$.ajax({
			type: "GET",
			url: '/api/content/alt_images/id/' + $(this).parent().parent().find('.materialboxed').attr('pic') + '?email='+$("#email").text(),
			datatype: "json",
			success: function(jsondata) {
				if(jsondata.ok === 'failed') {
					Materialize.toast('Se ha producido un fallo interno', 4000);
				}
				else if(jsondata.ok === 'not_allowed') {
					Materialize.toast('No tiene los permisos suficientes para editar la imagen', 4000);
				}
				else {
					var altTexts = jsondata.altTexts;

					console.log(altTexts, altTexts.length);

					for(var i=0; i<langs.length; i++) {
						var alreadyAdded = false;
						var altText = null;

						for(var j=0; j<currentLangs.length; j++)
							if(langs[i].ID === currentLangs[j])
								alreadyAdded = true;

						for(var k=0; k<altTexts.length; k++)
							if(langs[i].ID === altTexts[k].LANG_ID)
								altText = altTexts[k];

						if(alreadyAdded) {
							var altTextHtml = '<div class="alt_text input-field col s12"><i class="material-icons prefix"><img src="' + langs[i].FLAG + '" class="circle" width="30px" height="30px"/>\</i><input id="alt_text_' + langs[i].ID + '" name="alt_text_' + langs[i].ID + '" type="text" class="validate" required';

							if(altText !== null)
								altTextHtml += ' value="' + altText.ALT_TEXT + '"';
							
							altTextHtml += '><label for="' + langs[i].ID + '">Texto Alternativo (' + langs[i].NAME + ')</label></div>';

							$('#modal_content_image').find('#alt_texts_container').append(altTextHtml);
						}
					}

					Materialize.updateTextFields();

					$('#modal_content_image #image_loader').css('opacity', '0');
					setTimeout(function() { $('#modal_content_image #image_loader').css('display', 'none'); }, 500);
				}
			},
			error : function(xhr, status) {
				console.log(xhr);
				console.log(status);
			}
		});

		$('#modal_content_image .modal-header h4').text('Editar Imagen');

		var modalForm = $('#modal_content_image').find('form');

		var newAction = imageModalSubmit + 'edit/' + $(this).parent().parent().find('.materialboxed').attr('pic') + '/' + contentId;

		modalForm.attr('action', newAction);

		$('#modal_content_image').find('#contentImagePreview').attr('src', $(this).parent().parent().find('.materialboxed').attr('src'));

		$('#modal_content_image').find('#content_image').removeAttr('required');

		$('#modal_content_image').openModal( {
			complete: function() {
				$('#modal_content_image').find('modal-header h4').text('');

				$('#modal_content_image').find('input, textarea').each(function() {
					$(this).val('');
					$(this).trigger('autoresize');
				});

				$('#modal_content_image').find('#alt_texts_container').text('');

				Materialize.updateTextFields();

				$("#contentImagePreview").attr('src', '/static/img/img_not_available.png');

				$('#modal_content_image').find('#content_image').attr('required', true);

				$('#modal_content_image #image_loader').css('opacity', '1');
				$('#modal_content_image #image_loader').css('display', 'block');
			}
		});
	});

	elem.find('.image_actions .remove_multimedia').click(function() {
		var elem = $(this).parent().parent();

		elem.find('.del_loader').css('display', 'block');

		var imageId = elem.find('.materialboxed').attr('pic');

		$.ajax({
			type: "POST",
			url: '/api/content/delete_image/' + imageId + '?email='+$("#email").text(),
			datatype: "json",
			success: function(jsondata) {
				if(jsondata.ok === 'failed') {
					Materialize.toast('Se ha producido un fallo interno', 4000);

					elem.find('.del_loader').css('opacity', '0');
					setTimeout(function() { elem.find('.del_loader').css('display', 'block'); }, 500);
				}
				else if(jsondata.ok === 'not_allowed') {
					Materialize.toast('No tiene los permisos suficientes para borrar la imagen', 4000);

					elem.find('.del_loader').css('opacity', '0');
					setTimeout(function() { elem.find('.del_loader').css('display', 'block'); }, 500);
				}
				else {
					setTimeout(function() { 
						elem.animate( { 'opacity': '0', left: "-=100", height: "toggle" }, 500, function(){
							elem.remove();
							Materialize.toast('Se ha eliminado la foto correctamente', 4000);
						});
						
						//elem.hide('slow', function(){elem.remove();}); 

						$('.img_content .content_multimedia li').each(function() {
							if($(this).find('.materialboxed').attr('pic') === imageId) {
								$(this).remove();
							}
						});
					}, 500);
				}
			},
			error : function(xhr, status) {
				console.log(xhr);
				console.log(status);
			}
		});
	});
}

function initilizeMultimediaVideo(elem) {

	if(action === 'add')
		$('.multimedia').css('display', 'none');

	elem.find('.new_video').click(function() {
		$('#modal_content_video #video_loader').css('display', 'none');
		$('#modal_content_video .modal-header h4').text('Añadir Video');

		var modalForm = $('#modal_content_video').find('form');

		var newAction = videoModalSubmit + 'add/' + contentId;

		modalForm.attr('action', newAction);

		var langFound = false;
		for(var i=0; i<langs.length && !langFound; i++) {
			if(langs[i].ID === parseInt(elem.attr('content-lang'))) {
				langFound = true;

				$('#modal_content_video').find('#alt_texts_container').append('<div class="alt_text input-field col s12"><i class="material-icons prefix"><img src="' + langs[i].FLAG + '" class="circle" width="30px" height="30px"/>\</i><input id="alt_text_' + langs[i].ID + '" name="alt_text_' + langs[i].ID + '" type="text" class="validate" required><label for="' + langs[i].ID + '">Texto Alternativo (' + langs[i].NAME + ')</label></div>');
			}
		}

		$('#modal_content_video').openModal( {
			complete: function() {
				$('#modal_content_video').find('modal-header h4').text('');

				$('#modal_content_video').find('input, textarea').each(function() {
					$(this).val('');
					$(this).trigger('autoresize');
				});

				$('#modal_content_video').find('#alt_texts_container').text('');

				Materialize.updateTextFields();

				$("#contentVideoPreview").children('source').attr('src', '');
				$("#contentVideoPreview").children('track').remove();
				$("#contentVideoPreview")[0].load();
				$('#modal_content_video #video_loader').css('display', 'block');
			}
		});
	});

	$('#modal_content_video #sign_lang').change(function() {
		if($(this).is(":checked")) {
			//$('#modal_content_video #content_video_substitles').removeAttr('required');
			$('#modal_content_video #content_video_substitles').attr('disabled', true);
			$('#modal_content_video #content_video_substitles').parent().attr('disabled', true);
			$('#modal_content_video #content_video_substitles').parent().parent().find('.file-path').attr('disabled', true);

			$('#modal_content_video .alt_text').find('input').attr('disabled', true);
			$('#modal_content_video .alt_text').find('img').addClass('disabled');
		}
		else {
			//$('#modal_content_video #content_video_substitles').attr('required', true);
			$('#modal_content_video #content_video_substitles').removeAttr('disabled');
			$('#modal_content_video #content_video_substitles').parent().removeAttr('disabled');
			$('#modal_content_video #content_video_substitles').parent().parent().find('.file-path').removeAttr('disabled');

			$('#modal_content_video .alt_text').find('input').removeAttr('disabled');
			$('#modal_content_video .alt_text').find('img').removeClass('disabled');
		}
	});

	elem.find('.video_actions .edit_multimedia').click(function() {
		var video = $(this).parent().parent().find('video');
		var langId = video.parent().parent().parent().parent().attr('content-lang');

		$('#modal_content_video .modal-header h4').text('Editar Video');

		var modalForm = $('#modal_content_video').find('form');

		modalForm.find('#content_video').change(function() {
			modalForm.find('#content_video_substitles').attr('required', true);
		});

		modalForm.find('#content_video_substitles').change(function() {
			modalForm.find('#content_video').attr('required', true);
		});

		var newAction = videoModalSubmit + 'edit/' + video.attr('vid') + '/' + contentId;

		modalForm.attr('action', newAction);

		modalForm.find('#content_video').removeAttr('required');
		modalForm.find('#content_video_substitles').removeAttr('required');

		modalForm.find('video').children('source').attr('src', video.children('source').attr('src'));
		modalForm.find('video').append(video.children('track'));
		modalForm.find('video')[0].load();

		$.ajax({
			type: "GET",
			url: '/api/content/video/' + video.attr('vid') + '?email='+$("#email").text(),
			datatype: "json",
			success: function(jsondata) {
				if(jsondata.ok === 'failed') {
					Materialize.toast('Se ha producido un fallo interno', 4000);
				}
				else if(jsondata.ok === 'not_allowed') {
					Materialize.toast('No tiene los permisos suficientes para editar el video', 4000);
				}
				else {
					var video = jsondata.video;

					var langFound = false;
					for(var i=0; i<langs.length && !langFound; i++) {
						if(langs[i].ID === parseInt(video.LANG_ID) || langs[i].ID === parseInt(langId)) {
							langFound = true;
							var altHtml = '<div class="alt_text input-field col s12"><i class="material-icons prefix"><img src="' + langs[i].FLAG + '" class="circle" width="30px" height="30px"/>\</i><input id="alt_text_' + langs[i].ID + '" name="alt_text_' + langs[i].ID + '" type="text" class="validate"';

							if(parseInt(langId) === parseInt(video.LANG_ID))
								altHtml += 'value="' + video.ALT_TEXT + '"';

							altHtml += 'required><label for="' + langs[i].ID + '">Texto Alternativo (' + langs[i].NAME + ')</label></div>';

							$('#modal_content_video').find('#alt_texts_container').append(altHtml);
						}
					}

					if(video.LANG_ID === null) {
						if(!$('#modal_content_video #sign_lang').is(":checked"))
							$('#modal_content_video #sign_lang').trigger('click');
						else {
							$('#modal_content_video #sign_lang').trigger('click');
							$('#modal_content_video #sign_lang').trigger('click');
						}
					}

					Materialize.updateTextFields();

					$('#modal_content_video #video_loader').css('opacity', '0');
					setTimeout(function() { $('#modal_content_video #video_loader').css('display', 'none'); }, 500);
				}
			},
			error : function(xhr, status) {
				console.log(xhr);
				console.log(status);
			}
		});

		$('#modal_content_video').openModal( {
			complete: function() {
				$('#modal_content_video').find('modal-header h4').text('');

				$('#modal_content_video').find('input, textarea').each(function() {
					$(this).val('');
					$(this).trigger('autoresize');
				});

				$('#modal_content_video').find('#alt_texts_container').text('');

				Materialize.updateTextFields();

				$("#contentVideoPreview").children('source').attr('src', '');
				$("#contentVideoPreview").children('track').remove();
				$("#contentVideoPreview")[0].load();
				$('#modal_content_video #video_loader').css('display', 'block');

				modalForm.find('#content_video').attr('required', true);
				modalForm.find('#content_video_substitles').attr('required', true);
				
				if($('#modal_content_video #sign_lang').is(":checked"))
					$('#modal_content_video #sign_lang').trigger('click');
			}
		});
	});

	elem.find('.video_actions .remove_multimedia').click(function() {
		var elem = $(this).parent().parent();

		elem.find('.del_loader').css('display', 'block');

		var videoId = elem.find('video').attr('vid');

		$.ajax({
			type: "POST",
			url: '/api/content/delete_video/' + videoId + '?email='+$("#email").text(),
			datatype: "json",
			success: function(jsondata) {
				if(jsondata.ok === 'failed') {
					Materialize.toast('Se ha producido un fallo interno', 4000);

					elem.find('.del_loader').css('opacity', '0');
					setTimeout(function() { elem.find('.del_loader').css('display', 'block'); }, 500);
				}
				else if(jsondata.ok === 'not_allowed') {
					Materialize.toast('No tiene los permisos suficientes para borrar el video', 4000);

					elem.find('.del_loader').css('opacity', '0');
					setTimeout(function() { elem.find('.del_loader').css('display', 'block'); }, 500);
				}
				else {
					setTimeout(function() { 
						elem.animate( { 'opacity': '0' }, 500, function(){ 
							elem.remove();
							Materialize.toast('Se ha eliminado el video correctamente', 4000);
						});

						//elem.hide('slow', function(){elem.remove();}); 

						$('.video_content .content_multimedia li').each(function() {
							if($(this).find('video').attr('vid') === videoId) {
								$(this).remove();
							}
						});
					}, 500);
				}
			},
			error : function(xhr, status) {
				console.log(xhr);
				console.log(status);
			}
		});
	});
}

function cleanAddLangModal() {

	$('#lang_selection').text('');

	$('#select_lang_loader').css('opacity', '1');
	$('#select_lang_loader').css('display', 'initial');
}

function initializeDatePicker(datePicker) {
    
    var $input = datePicker.pickadate( {
        selectMonths: true,
        selectYears: 2,

        firstDay: 1,

        min: new Date(),

        monthsFull : [ 'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre' ],
        monthsShort : [ 'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic' ],
        weekdaysFull : [ 'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo' ],
        weekdaysShort : [ 'Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom' ],

        today: '',
        clear: '',
        close: 'Cerrar',

        labelMonthNext: 'Mes siguiente',
        labelMonthPrev: 'Mes anterior',
        labelMonthSelect: 'Seleccionar un mes',
        labelYearSelect: 'Seleccionar un año',

        closeOnSelect: true,
        closeOnClear: true,

        container: 'main',

        onClose: function() {
            $('.datepicker').blur();

            $(document.activeElement).blur();
        },

        onSet: function(context) {
            if('select' in context) {
				var self = this;

				dateInUpdate = moment(context.select).format("DD/MM/YYYY");

				setTimeout(function() { self.close(); }, 200);
            }
        }
    });

    var picker = $input.pickadate('picker');

    return picker;
}

function send_data(form) {

	// Get language id from current form
	var langId = form.parent().parent().attr('content-lang');
	console.log('langId', langId);

	// Get all data from current form and add it to a json object
	var jsonObj = {};
	var content = {};
	var contentInfo = {};

	content.DATE_IN = form.find('#content_date_in_hidden').val();
	content.DATE_OUT = form.find('#content_date_out_hidden').val();
	content.LOCATION = form.find('#content_location').val();
	content.TYPE = form.find('#content_type').val();

	contentInfo.NAME = form.find('#content_name').val();
	contentInfo.DESCRIPTION = form.find('#content_description').val();
	contentInfo.BLIND_DESCRIPTION = form.find('#content_blind_description').val();
	contentInfo.LANG = langId;
	
	jsonObj.CONTENT = content;
	jsonObj.CONTENT_INFO = contentInfo;

	if(action === 'edit') {
		jsonObj.CONTENT_ID = contentId;
		jsonObj.CONTENT_INFO_ID = form.parent().parent().attr('info-id');

		console.log(jsonObj.CONTENT_ID);
		console.log(jsonObj.CONTENT_INFO_ID);
	}

	// AJAX Call to post all data
	$.ajax({
		type: "POST",
		url: '/api/content/' + action + '?email=' + $("#email").text(),
		data: JSON.stringify(jsonObj),
		contentType: 'application/json',
		datatype: 'json',
		success: function(jsondata){
			if(jsondata.ok === 'failed') {
				Materialize.toast('Se ha producido un fallo interno', 4000);
			}
			else if(jsondata.ok === 'not_allowed') {
				Materialize.toast('No tiene los permisos suficientes para añadir contenido', 4000);
			}
			else {
				// Notify user of success
				Materialize.toast('Se ha guardado el contenido con éxito', 4000);

				contentId = jsondata.contentId;
				form.parent().parent().attr('info-id', jsondata.contentInfoId);

				// Save ContentId && Modify all forms
				if(action === 'add') {
					action = 'edit';

					$('.multimedia').css('display', 'block');
				}
			}
		},
		error: function(xhr, status){
			Materialize.toast("Se ha producido un fallo añadiendo el contenido", 4000);
		}
	});

	// Avoid to send form on action
	return false;
}

imagePrevisualization($('#content_image'), $('#contentImagePreview'));
videoPrevisualization($('#content_video'), $('#content_video_substitles'), $('#contentVideoPreview'));