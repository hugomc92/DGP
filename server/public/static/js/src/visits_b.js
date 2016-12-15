$(document).ready(function() {
	$('.modal-trigger').leanModal();

	// If click on send but delete yes check is not checked close the modal
	$('#delete_visit form').submit(function(event) {
		if(document.getElementById("delete_guided_visit_yes").checked)
			return;

		$("#delete_visit").closeModal();

		event.preventDefault();
	});
});