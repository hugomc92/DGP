$(document).ready(function() {
	$('.modal-trigger').leanModal( {
		complete: function() {
			$('#content_type_loader').css('opacity', '1');
			$('#content_type_loader').css('display', 'initial');
		}
	});

	// If click on send but delete yes check is not checked close the modal
	$('#delete_content_type form').submit(function(event) {
		if(document.getElementById("delete_content_type_yes").checked)
			return;

		$("#delete_content_type").closeModal();

		event.preventDefault();
	});

	$(".actions").on('click', 'a', function() {
		action = $(this).attr('href');
		id_content_type = $(this).parent().parent().children()[0].innerHTML;
		id_content_type = parseInt(id_content_type);

		if(action == '#delete_content_type') {
			nombre = $(this).parent().parent().children()[2].innerHTML;

			$("#delete_id_content_type").val(id_content_type);
			$("#delete_titulo").text('Se borrará el tipo de contenido "' + nombre + '"');

			$("#delete_content_type_yes").removeAttr('checked');
			$("#delete_content_type_no").attr('checked','');
		}
		else if(action == '#edit_content_type') {
			$.ajax({
				type: "GET",
				url: "/api/content_type/id/"+id_content_type+"?email="+$("#email").text(),
				datatype: "json",
				success: function(jsondata) {
					$("#edit_id_content_type").val(id_content_type);
					$("#edit_name_content_type").val(jsondata.NAME);
					$("#edit_description_content_type").val(jsondata.DESCRIPTION);
					$("#editIconImgViewer").attr('src', jsondata.ICON);
					$("#edit_previous_icon_content_type").val(jsondata.ICON);

					$('#content_type_loader').css('opacity', '0');
					setTimeout(function() { $('#content_type_loader').css('display', 'none'); }, 1000);
				},
				error : function(xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
		}
	});
});

imagePrevisualization($('#add_icon_content_type'), $('#addIconImgViewer'));
imagePrevisualization($('#edit_icon_content_type'), $('#editIconImgViewer'));
