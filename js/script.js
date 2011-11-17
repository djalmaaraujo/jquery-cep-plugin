/* Author: Djalma Araújo */
jQuery(function() {
	
	// Select onchange
	$('select').jCep({
		'callback': function(data) {
			alert('Look your DEBUG Console');
			console.log(data);
		}
	});
	
	// Input keyup
	$('input[type="text"]').jCep();
});