var currentLangs = [];
var choosenAddLang;


$(document).ready(function() {
	currentLangs.push(1);

	$('ul.tabs').tabs();

	$('#more_langs').click(function() {
		$('#add_lang_content').openModal( {
			complete: cleanAddLangModal
		});

		$.ajax({
			type: "GET",
			url: "/api/lang?email="+$("#email").text(),
			datatype: "json",
			success: function(jsondata) {

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
				}
				else {
					$('#lang_selection').append('<h4>ESTE CONTENIDO YA ESTÁ EN TODOS LOS IDIOMAS DISPONIBLES</h4>');
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

		alert($('#lang_select').val());

		cleanAddLangModal();
	});
});

function cleanAddLangModal() {

	$('#lang_selection').text('');

	$('#add_lang_loader').css('opacity', '1');
	$('#add_lang_loader').css('display', 'initial');

}