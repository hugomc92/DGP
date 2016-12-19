$(document).ready(function() {
	$('.modal-trigger').leanModal();

	$('.modal-trigger').click(function() {
		var content = $(this).parent().parent().children()[1].innerHTML;

		$("#delete_titulo").text('Se borrará el contenido "' + content + '"');

		$('#delete_content').find('#delete_id_content').val($(this).parent().parent().children()[0].innerHTML);
	});

	// If click on send but delete yes check is not checked close the modal
	$('#delete_content form').submit(function(event) {
		if(document.getElementById("delete_content_yes").checked)
			return;

		$("#delete_content").closeModal();

		event.preventDefault();
	});
});