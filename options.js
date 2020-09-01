$(function() { //once options is opened

	chrome.storage.sync.get(['limit','total'],function(budget) { 
		if(budget.limit && budget.limit != 0) {
			$('#options-limit').val(budget.limit); //writes the limit in the limit box (check question #2)
			$('#remove-limit').prop('disabled', false); 
		}
		if(budget.total) {
			$('#reset-total').prop('disabled', false); 
		}
	})	

	$('#options-limit').keyup(function() { //check if limit box is empty
		checkTextBox();
	})

	$('#save-limit').click(function() { 
		var limit = parseFloat($('#options-limit').val());
		var limit = parseFloat(limit.toFixed(2));
		if(limit < 0) {
			alert("Can't remember the last time a negative limit was possible");
			return;
		}
		chrome.storage.sync.set({'limit':limit});
		chrome.storage.sync.get(['total','limit'], function(budget) {
			if(budget.total) {
				var newOverLimit = budget.total - budget.limit;
				var newAvailable = budget.limit - budget.total;
				if(newOverLimit < 0) {
					newOverLimit = 0;
				}
				if(newAvailable < 0) { 
					newAvailable = 0;
				}
				chrome.storage.sync.set({'overlimit':newOverLimit,'available':newAvailable});
			}
		})
		$('#remove-limit').prop('disabled', false); 
		alert("Successful"); 
	});

	$('#remove-limit').click(function(){ 
		chrome.storage.sync.remove(['limit','overlimit','available']); 
		$('#options-limit').val(''); //clears the input box
		$('#save-limit').prop('disabled', true); 
		$('#remove-limit').prop('disabled', true); 
		alert("Successful"); //closes the tab 
	});


	$('#reset-total').click(function(){
		chrome.storage.sync.remove(['total','overlimit']);
		chrome.storage.sync.get('limit',function(budget) {
			if(budget.limit) { 
				var newAvailable = budget.limit;
				chrome.storage.sync.set({'available':newAvailable});
				$('#available').text(budget.available);
			}
		}) 
		$('#reset-total').prop('disabled', true); 
		alert("Successful");
	});


	//if limit box is empty, disable the submit button, otherwise enable it
	var checkTextBox = function() { 
		var check = $('#options-limit').val(); 
		if(check == "") {
			$('#save-limit').prop('disabled', true); 
		} 
		else {
			$('#save-limit').prop('disabled', false); 
		}
	}	
});




