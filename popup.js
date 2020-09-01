$(function() { 
	//once you press the extension display the total,limit,availability and overlimit
	chrome.storage.sync.get(['total','limit','available','overlimit'], function(budget) { 																														
		$('#total').text(budget.total); 
		$('#popup-limit').text(budget.limit);
		$('#available').text(budget.available);
		$('#over-limit').text(budget.overlimit);
		checkColors(); //check to see what color everything should be once user clicks on the extension
	})

	$('#amount').keyup(function() { //check if textbox is empty
		checkTextBox();
	})

	$('#submit').click(function() { //once user clicks on submit
		chrome.storage.sync.get(['total','limit'], function(budget) { 

			var newTotal = 0;
			var newOverLimit = 0;
			var newAvailable = 0;

			if(budget.total) { //if budget.total exists (wont exist if user never added a total before)
				newTotal += budget.total; 
			}

			newTotal += parseFloat($('#amount').val());
			newTotal = parseFloat(newTotal.toFixed(2)); //toFixed returns a string, so parse it back to float so you can add later since you cant add string and int

			if(newTotal < 0) {
				alert("Total Spent has gone below $0.00 \nand we all know THATS impossible");
				return;
			}

			if(budget.limit) {
				newAvailable = budget.limit - newTotal;
				newAvailable = newAvailable.toFixed(2);
				newOverLimit = newTotal - budget.limit;
				newOverLimit = newOverLimit.toFixed(2);
				if(newAvailable < 0) {
					newAvailable = 0;
				}
				if(newOverLimit < 0) {
					newOverLimit = 0;
				}
			}

			chrome.storage.sync.set({'total':newTotal});
			chrome.storage.sync.set({'available':newAvailable});
			chrome.storage.sync.set({'overlimit':newOverLimit});

			$('#total').text(newTotal); //updates UI
			$('#available').text(newAvailable);
			$('#over-limit').text(newOverLimit);
			$('#amount').val(''); //clears the input box
			$('#submit').prop('disabled', true); //disables submit button
			checkColors(); //check to see what color everything should be once the user updates the extension without closing it
		});
	});


	//if text box is empty, disable the submit button, otherwise enable it
	var checkTextBox = function() { 
		var amount = $('#amount').val(); 
		if(amount == "") {
			$('#submit').prop('disabled', true); 
		} 
		else {
			$('#submit').prop('disabled', false); 
		}
	}

	var checkColors = function() {
		chrome.storage.sync.get(['total','limit','over-limit'], function(budget) {	
			if(!budget.limit) { 
				document.getElementById("total").style.color = "green";
				document.getElementById("total-sign").style.color = "green";
				//everything else is black
			}
			if(budget.total > budget.limit) {
				document.getElementById("total").style.color = "red";
				document.getElementById("total-sign").style.color = "red";
				document.getElementById("available").style.color = "red";
				document.getElementById("available-sign").style.color = "red";
				document.getElementById("over-limit").style.color = "red";
				document.getElementById("overlimit-sign").style.color = "red";
			}
			else if(budget.total < budget.limit) {
				document.getElementById("total").style.color = "green";
				document.getElementById("total-sign").style.color = "green";
				document.getElementById("available").style.color = "black";
				document.getElementById("available-sign").style.color = "black";
				document.getElementById("over-limit").style.color = "black";
				document.getElementById("overlimit-sign").style.color = "black";
			}
			else if(budget.total && (budget.total == budget.limit)) { //if total exists and it equals to limit
				document.getElementById("total").style.color = "red";
				document.getElementById("total-sign").style.color = "red";
				document.getElementById("available").style.color = "black";
				document.getElementById("available-sign").style.color = "black";
				document.getElementById("over-limit").style.color = "black";
				document.getElementById("overlimit-sign").style.color = "black";
			}
		})
	}
});











/* NOTES:

1:
Lines 3 and 9 will not return anything for total/limit the first time someone uses the extension 
since total and limit have not been set yet.

since nothing will be returned, lines 4/5 will not change their respective id's

Once a total/limit has been set, the chrome API will be able to return the total/limit, even if one of them hasn't been set yet
It will just return nothing for whichever isn't set





2:
total and limit in line 4 are not the same as total/limit in lines 3/4.
#total or #limit is the id name 
'total' or 'limit' is the variable name you gave to the chrome storage api to remember whatever is placed in the #total or #limit id
you can change the variable name, but make sure to change it in every .get() and .set() and text() and wherever else it is used






3:
storage API get() method returns the value of a key
square brackets are placed here because its an array since theres more than one item
get() requires a function(...) callback method

set() does not require a callback function
set() sets the a key and a value 





4:
text() returns the value of the caller
text(...) sets the vale of the caller to the paramter

val() returns the value of the caller
val(...) sets the vale of the caller to the paramter
.val returns a string

text(...) doesn't work on input values, only val(...) does
NOTE: input values are variables that the coder can change (ex: int/string etc.)


*/


