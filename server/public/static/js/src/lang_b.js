$(document).ready(function() {
	$('.modal-trigger').leanModal( {
		complete: function() {
			$('#lang_loader').css('opacity', '1');
			$('#lang_loader').css('display', 'initial');
		}
	});

	// If click on send but delete yes check is not checked close the modal
	$('#delete_lang form').submit(function(event) {
		if(document.getElementById("delete_lang_yes").checked)
			return;

		$("#delete_lang").closeModal();

		event.preventDefault();
	});

	$(".actions").on('click', 'a', function() {
		action = $(this).attr('href');
		id_lang = $(this).parent().parent().children()[0].innerHTML;
		id_lang = parseInt(id_lang);

		if(action == '#delete_lang') {
			lang = $(this).parent().parent().children()[1].innerHTML;

			$("#delete_id_lang").val(id_lang);
			$("#delete_titulo").text('Se borrará el idioma "' + lang + '"');

			$("#delete_lang_yes").removeAttr('checked');
			$("#delete_lang_no").attr('checked','');
		}
		else if(action == '#edit_lang') {
			$.ajax({
				type: "GET",
				url: "/api/lang/id/"+id_lang+"?email="+$("#email").text(),
				datatype: "json",
				success: function(jsondata) {
					console.log('jsondata', jsondata);

					$('#edit_id_lang').val(jsondata.ID);
					$('#edit_name_lang').val(jsondata.NAME);
					$('#edit_code_lang').val(jsondata.CODE);
					$('#editFlagImgViewer').attr('src', jsondata.FLAG);
					
					Materialize.updateTextFields();

					$('#lang_loader').css('opacity', '0');
					setTimeout(function() { $('#lang_loader').css('display', 'none'); }, 1000);
				},
				error : function(xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
		}
	});
});

imagePrevisualization($('#add_flag_lang'), $('#addFlagImgViewer'));
imagePrevisualization($('#edit_flag_lang'), $('#editFlagImgViewer'));
