$(document).ready(function() {
	$('.modal-trigger').click(function() {
		$('#delete_visit').openModal();
		$('#delete_visit').find('#delete_id_guided_visit').val($(this).parent().parent().find('.id_visit').text());
	});

	// If click on send but delete yes check is not checked close the modal
	$('#delete_visit form').submit(function(event) {
		if(document.getElementById("delete_guided_visit_yes").checked)
			return;

		$("#delete_visit").closeModal();

		event.preventDefault();
	});
});