$(document).ready(function () {

	var $_GET = {};
	
	document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
	    function decode(s) {
	        return decodeURIComponent(s.split("+").join(" "));
	    }
	
	    $_GET[decode(arguments[1])] = decode(arguments[2]);
	});

	// confirmations
	$('.confirm').submit(function (e) {
		e.preventDefault();
		var self = this;
		var msg = 'Are you sure?';
		bootbox.confirm(msg, 'cancel', 'Yes! I am sure', function (action) {
			if (action) {
				$(self).unbind('submit');
				$(self).trigger('submit');
			}
		});
	});

	$('#tags').tagsInput({
		'defaultText' : 'Add tag',
		'height':'60px',
		'width':'280px'
	});
	
	$('.contactbox').collapse({
		toggle : false
	});
	
	/*$('[id*="popover"]').popover({
		trigger : 'click',
		html : true,
		animation : false
	});*/
	
	// CONTACTS POPUP
	$("[rel=popover]")
		.popover({ trigger: 'manual' })
		.click(function(e){ 
			if($(this).hasClass('pop')) {
	            $(this)
	                .popover('hide')
	                .removeClass('pop');
	        } else {
	            var dataInfo = JSON.parse($(this).attr('data-info'));
	            var response = "<a href = 'mailto:" + dataInfo.email + "'><i class = icon-envelope></i> " + dataInfo.email + "</a><br />";
	            if (dataInfo.phone)
	            	response += "<i class = icon-globe></i> " + dataInfo.phone + " #" + dataInfo.extension + "<br />";
	            $(this)
	                .attr('data-content', response)
	                .popover('show')
	                .addClass('pop');
	        }
		});
		
		
	// TABS section DOCUMENTS
	$('#projecttabs a').click(function (e) {
		e.preventDefault();
		
		// On évite de charger le même tab à maintes reprises
		if ($_GET["project"] !== $(this).attr('number')) 
			window.location = "/documents?project=" + $(this).attr('number');
	})
	
	$('[id^=task-task]').editable({
		success : function(response, newValue) {
			if (response.success === false) return response.msg;
		}
	});
	$('[id^=task-duedate]').editable({ 
		autoclose : true
	});
	$('[id^=task-priority]').editable({ 
		emptytext : '', 
		source :  ['Very high', 'High', 'Normal', 'Low'],
		display : function(value, sourceData) {
			switch (value) {
				case "Very high" :
					$(this)[0].className = $(this)[0].className.replace(/\bicon-.*?\b/g, 'icon-circle-arrow-up ');
					break;
				case "High" : 
					$(this)[0].className = $(this)[0].className.replace(/\bicon-.*?\b/g, 'icon-arrow-up ');
					break;
				case "Normal" : 
					$(this)[0].className = $(this)[0].className.replace(/\bicon-.*?\b/g, 'icon-arrow-down ');
					break;
				case "Low" : 
					$(this)[0].className = $(this)[0].className.replace(/\bicon-.*?\b/g, 'icon-circle-arrow-down ');
					break;
			} 
		}
	});
	$('[id^=task-assignedto]').editable({ 
		source : "users/getAll"
	});
	$('[id^=task-completion]').editable({
		success : function(response, newValue) {
			if (response.success === false) return response.msg;
		},
		display: function(value, sourceData) {
		    $(this).html(value + '%');
		}
	});
	
	$('#datepicker').datepicker({ autoclose : true });
});
