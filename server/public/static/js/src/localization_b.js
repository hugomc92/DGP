$(document).ready(function() {
	$('.modal-trigger').leanModal( {
		complete: function() {
			$('#localization_loader').css('opacity', '1');
			$('#localization_loader').css('display', 'initial');
		}
	});

	// If click on send but delete yes check is not checked close the modal
	$('#delete_localization form').submit(function(event) {
		if(document.getElementById("delete_localization_yes").checked)
			return;

		$("#delete_localization").closeModal();

		event.preventDefault();
	});

	$(".actions").on('click', 'a', function() {
		action = $(this).attr('href');
		id_localization = $(this).parent().parent().children()[0].innerHTML;
		id_localization = parseInt(id_localization);

		if(action == '#delete_localization') {
			nombre = $(this).parent().parent().children()[1].innerHTML;

			$("#delete_id_localization").val(id_localization);
			$("#delete_titulo").text('Se borrará la localización "' + nombre + '"');

			$("#delete_localization_yes").removeAttr('checked');
			$("#delete_localization_no").attr('checked','');
		}
		else if(action == '#edit_localization') {
			$.ajax({
				type: "GET",
				url: "/api/localization/id/"+id_localization+"?name="+$("#name").text(),
				datatype: "json",
				success: function(jsondata) {
					$("#edit_id_localization").val(id_localization);
					$("#edit_description_localization").val(jsondata.DESCRIPTION);
					$("#edit_nfc_localization").val(jsondata.NFC);
					$("#edit_qr_localization").val(jsondata.QR);
					$("#edit_coordinates_localization").val(jsondata.COORDINATES);

					$('#localization_loader').css('opacity', '0');
					setTimeout(function() { $('#localization_loader').css('display', 'none'); }, 1000);
				},
				error : function(xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
		}
	});
});
