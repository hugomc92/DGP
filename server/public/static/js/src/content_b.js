var currentLangs = [];
var choosenAddLang;
var form;
var langs;
var contentId;
var dateInUpdate;
var contentTypeSelect;
var locationSelect;
var action;

$(document).ready(function() {

	if($('#content_action').text().indexOf('Añadir') >= -1)
		action = 'add';
	else 
		action = 'edit';

	form = $('#spanish_content').find('.info_form').parent().html();

	initilizeForm($('#spanish_content'), 1);

	$('#more_langs').click(function() {
		$('#add_lang_content').openModal( {
			complete: cleanAddLangModal
		});

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

					$('#add_lang_submit').text('AÑADIR');
				}
				else {
					$('#lang_selection').append('<h4>ESTE CONTENIDO YA ESTÁ EN TODOS LOS IDIOMAS DISPONIBLES</h4>');

					$('#add_lang_submit').text('CERRAR');
				}

				$('#add_lang_loader').css('opacity', '0');
				setTimeout(function() { $('#add_lang_loader').css('display', 'none'); }, 1000);
			},
			error : function(xhr, status) {
				console.log(xhr);
				console.log(status);

				Materialize.toast("Se ha producido un error recuperando los idiomas", 4000,'', function() { $('#add_lang_content').closeModal(); });
			}
		});
	});

	$('#add_lang_submit').click(function() {
		$('#add_lang_content').closeModal();

		if($('#lang_select').val() !== null) {
			var langId = parseInt($('#lang_select').val());

			currentLangs.push(langId);

			var found = false;

			for(var i=0; i<langs.length && !found; i++) {
				if(langs[i].ID === langId) {
					// Add new Tab
					$('.tabs').append('<li class="tab col"><a href="#' + langs[i].NAME.toLowerCase() + '_content" content-lang="' + langs[i].ID + '"><img src="' + langs[i].FLAG + '" alt="Bandera ' + langs[i].NAME + '" width="25px"/><span class="hide-on-small-only">' + langs[i].NAME + '</span></a></li>');

					// Update all tabs
					$('ul.tabs').tabs();

					// Add new content tab
					$('#contents').append('<div id="' + langs[i].NAME.toLowerCase() + '_content" class="col s12" style="display:none">' + form + '</div>');

					initilizeForm($('#' + langs[i].NAME.toLowerCase() + '_content'), langId);

					found = true;
				}
			}
		}

		cleanAddLangModal();
	});
});

function initilizeForm(elem, langId) {

	var form = elem.find('.info_form');

	Materialize.updateTextFields();

	currentLangs.push(1);

	form.find('ul.tabs').tabs();

	form.find('input, textarea').characterCounter();

	$('select').material_select();

	var dateInPicker = initializeDatePicker(form.find('#content_date_in'));
	var dateOutPicker = initializeDatePicker(form.find('#content_date_out'));

	var dateIn = form.find('#content_date_in');
	var dateOut = form.find('#content_date_out');

	dateIn.on('change', function() {
		dateOut.val('');

		setTimeout(function() {
			var infoUpdate = dateInUpdate.split('/');
			var day = infoUpdate[0];
			var month = infoUpdate[1];
			var year = infoUpdate[2];

			var minDate = [parseInt(year), parseInt(month)-1, day];

			dateOutPicker.set('min', minDate);
		}, 1000);		
	});

	form.on('submit', function(event) {
		event.preventDefault();

		send_data($(this));
	});
}

function cleanAddLangModal() {

	$('#lang_selection').text('');

	$('#add_lang_loader').css('opacity', '1');
	$('#add_lang_loader').css('display', 'initial');
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
	console.log(form.parent().parent());

	// Get language id from current form
	var langId = form.parent().parent().attr('content-lang');
	console.log('langId', langId);

	// Get all data from current form and add it to a json object
	var jsonObj = {};
	var content = {};
	var contentInfo = {};

	content.DATE_IN = form.find('#content_date_in').val();
	content.DATE_OUT = form.find('#content_date_out').val();
	content.LOCATION = form.find('#content_location').val();
	content.TYPE = form.find('#content_type').val();

	contentInfo.NAME = form.find('#content_name').val();
	contentInfo.DESCRIPTION = form.find('#content_description').val();
	contentInfo.BLIND_DESCRIPTION = form.find('#content_blind_description').val();
	contentInfo.LANG = langId;
	
	jsonObj.CONTENT = content;
	jsonObj.CONTENT_INFO = contentInfo;


	// AJAX Call to post all data
	$.ajax({
		type: "POST",
		url: '/api/content/' + action + '?email=' + $("#email").text(),
		data: JSON.stringify(jsonObj),
		contentType: 'application/json',
		datatype: 'json',
		success: function(jsondata){
			if(jsondata.indexOf('ok') > -1) {
				// Notify user of success
				Materialize.toast('Se ha guardado el contenido con éxito', 4000);

				// Modify all forms to get it
				if(action === 'add')
					action = 'edit';
			}
			else if(json.indexOf('not_allowed') >-1) {
				Materialize.toast('No tiene los permisos suficientes para añadir contenido', 4000);
			}
			else {
				Materialize.toast('Se ha producido un fallo interno', 4000);
			}
		},
		error: function(xhr, status){
			Materialize.toast("Se ha producido un fallo añadiendo el contenido", 4000);
		}
	});

	// Avoid to send form on action
	return false;
}