$(document).ready(function() {
	$('.modal-trigger').leanModal( {
		complete: function() {
			$('#user_loader').css('opacity', '1');
			$('#user_loader').css('display', 'initial');
		}
	});

	// If click on send but delete yes check is not checked close the modal
	$('#delete_user form').submit(function(event) {
		if(document.getElementById("delete_user_yes").checked)
			return;

		$("#delete_user").closeModal();

		event.preventDefault();
	});

	$(".actions").on('click', 'a', function() {
		action = $(this).attr('href');
		id_user = $(this).parent().parent().children()[0].innerHTML;
		id_user = parseInt(id_user);

		if(action == '#delete_user') {
			email = $(this).parent().parent().children()[2].innerHTML;

			$("#delete_id_user").val(id_user);
			$("#delete_titulo").text('Se borrará "' + email + '"');

			$("#delete_user_yes").removeAttr('checked');
			$("#delete_user_no").attr('checked','');
		}
		else if(action == '#edit_user') {
			$.ajax({
				type: "GET",
				url: "/api/user/id/"+id_user+"?email="+$("#email").text(),
				datatype: "json",
				success: function(jsondata) {
					$("#edit_id_user").val(id_user);

					$("#edit_email_user").val(jsondata.EMAIL);
					$("#edit_password_user").val(jsondata.PASSWORD);
					$("#edit_name_user").val(jsondata.NAME);
					$("#edit_surname_user").val(jsondata.SURNAME);

					$("#editUserImgViewer").attr('src', jsondata.PHOTO);
					$("#edit_previous_photo_user").val(jsondata.PHOTO);

					// marcamos el input type radio a la opcion correcta
					var admin = parseInt(jsondata.ADMIN);
					$("#edit_admin_yes").removeAttr('checked');
					$("#edit_admin_no").removeAttr('checked');

					if(admin)
						$("#edit_admin_yes").prop('checked', true);
					else
						$("#edit_admin_no").prop('checked', true);

					$('#user_loader').css('opacity', '0');
					setTimeout(function() { $('#user_loader').css('display', 'none'); }, 1000);
				},
				error : function(xhr, status) {
					console.log(xhr);
					console.log(status);
				}
			});
		}
	});
});

imagePrevisualization($('#add_photo_user'), $('#addUserImgViewer'));
imagePrevisualization($('#edit_photo_user'), $('#editUserImgViewer'));