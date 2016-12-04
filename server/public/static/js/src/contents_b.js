$(document).ready(function() {
	$('.modal-trigger').leanModal();

	// If click on send but delete yes check is not checked close the modal
	$('#delete_content form').submit(function(event) {
		if(document.getElementById("delete_content_yes").checked)
			return;

		$("#delete_user").closeModal();

		event.preventDefault();
	});
});