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
		bootbox.confirm(msg, 'Cancel', 'Yes', function (action) {
			if (action) {
				$(self).unbind('submit');
				$(self).trigger('submit');
			}
		});
	});

	$('a[rel=tooltip]').tooltip();

	$('#tags').tagsInput({
		'defaultText' : 'Add tag',
		'height':'60px',
		'width':'280px'
	});
	
	$('.contactbox').collapse({
		toggle : false
	});
	
	/* Documents */
	$('a[action=delete]').click(function (e) {
		e.preventDefault();
		var self = this;
		var msg = 'Are you sure?';
		bootbox.confirm(msg, 'Cancel', 'Yes', function (action) {
			if (action) {
				alert("Delete me");
			}
		});
	});

	
	// CONTACTS POPUP
	$("[rel=popover]")
		.popover({ 
			trigger: 'manual',
			// ce qui est important ici c'est l'ajout de popover-contact comme classe, ça nous permet d'avoir la largeur automatique pour le popover avec width : auto;
			template: '<div class="popover popover-contact"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
		})
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
	$('#projecttabs a.tab').click(function (e) {
		e.preventDefault();
		
		// On évite de charger le même tab à maintes reprises
		if ($_GET["project"] !== $(this).attr('number')) 
			window.location = "/documents?project=" + $(this).attr('number');
	})
	
	// Tasks
	
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









// Tasks Datatable


/* Set the defaults for DataTables initialisation */
$.extend( true, $.fn.dataTable.defaults, {
	"sDom": "<'row-fluid'<'span6'l><'span6'f>r>t<'row-fluid'<'span6'i><'span6'p>>",
	"sPaginationType": "bootstrap",
	"oLanguage": {
		"sLengthMenu": "_MENU_ records per page"
	}
} );


/* Default class modification */
$.extend( $.fn.dataTableExt.oStdClasses, {
	"sWrapper": "dataTables_wrapper form-inline"
} );


/* API method to get paging information */
$.fn.dataTableExt.oApi.fnPagingInfo = function ( oSettings )
{
	return {
		"iStart":         oSettings._iDisplayStart,
		"iEnd":           oSettings.fnDisplayEnd(),
		"iLength":        oSettings._iDisplayLength,
		"iTotal":         oSettings.fnRecordsTotal(),
		"iFilteredTotal": oSettings.fnRecordsDisplay(),
		"iPage":          Math.ceil( oSettings._iDisplayStart / oSettings._iDisplayLength ),
		"iTotalPages":    Math.ceil( oSettings.fnRecordsDisplay() / oSettings._iDisplayLength )
	};
};


/* Bootstrap style pagination control */
$.extend( $.fn.dataTableExt.oPagination, {
	"bootstrap": {
		"fnInit": function( oSettings, nPaging, fnDraw ) {
			var oLang = oSettings.oLanguage.oPaginate;
			var fnClickHandler = function ( e ) {
				e.preventDefault();
				if ( oSettings.oApi._fnPageChange(oSettings, e.data.action) ) {
					fnDraw( oSettings );
				}
			};

			$(nPaging).addClass('pagination').append(
				'<ul>'+
					'<li class="prev disabled"><a href="#">&larr; '+oLang.sPrevious+'</a></li>'+
					'<li class="next disabled"><a href="#">'+oLang.sNext+' &rarr; </a></li>'+
				'</ul>'
			);
			var els = $('a', nPaging);
			$(els[0]).bind( 'click.DT', { action: "previous" }, fnClickHandler );
			$(els[1]).bind( 'click.DT', { action: "next" }, fnClickHandler );
		},

		"fnUpdate": function ( oSettings, fnDraw ) {
			var iListLength = 5;
			var oPaging = oSettings.oInstance.fnPagingInfo();
			var an = oSettings.aanFeatures.p;
			var i, j, sClass, iStart, iEnd, iHalf=Math.floor(iListLength/2);

			if ( oPaging.iTotalPages < iListLength) {
				iStart = 1;
				iEnd = oPaging.iTotalPages;
			}
			else if ( oPaging.iPage <= iHalf ) {
				iStart = 1;
				iEnd = iListLength;
			} else if ( oPaging.iPage >= (oPaging.iTotalPages-iHalf) ) {
				iStart = oPaging.iTotalPages - iListLength + 1;
				iEnd = oPaging.iTotalPages;
			} else {
				iStart = oPaging.iPage - iHalf + 1;
				iEnd = iStart + iListLength - 1;
			}

			for ( i=0, iLen=an.length ; i<iLen ; i++ ) {
				// Remove the middle elements
				$('li:gt(0)', an[i]).filter(':not(:last)').remove();

				// Add the new list items and their event handlers
				for ( j=iStart ; j<=iEnd ; j++ ) {
					sClass = (j==oPaging.iPage+1) ? 'class="active"' : '';
					$('<li '+sClass+'><a href="#">'+j+'</a></li>')
						.insertBefore( $('li:last', an[i])[0] )
						.bind('click', function (e) {
							e.preventDefault();
							oSettings._iDisplayStart = (parseInt($('a', this).text(),10)-1) * oPaging.iLength;
							fnDraw( oSettings );
						} );
				}

				// Add / remove disabled classes from the static elements
				if ( oPaging.iPage === 0 ) {
					$('li:first', an[i]).addClass('disabled');
				} else {
					$('li:first', an[i]).removeClass('disabled');
				}

				if ( oPaging.iPage === oPaging.iTotalPages-1 || oPaging.iTotalPages === 0 ) {
					$('li:last', an[i]).addClass('disabled');
				} else {
					$('li:last', an[i]).removeClass('disabled');
				}
			}
		}
	}
} );


/* Table initialisation */
$(document).ready(function() {
	$('#tasks').dataTable( {
		"aoColumns" : [
			{"sTitle" : "#"},
			{"sTitle" : "Project"},
			{"sTitle" : "Task"},
			{"sTitle" : "%", "sClass" : "center"},
			{"sTitle" : "Assigned to"},
			{"sTitle" : "Priority"},
			{"sTitle" : "Due date"},
			{"sTitle" : "Quick actions", "bSortable" : false}
		],
		"sDom": "<'row'<'span6'l><'span6'f>r>t<'row'<'span6'i><'span6'p>>",
		"sPaginationType": "bootstrap",
		"oLanguage": {
			"sLengthMenu": "_MENU_ records per page"
		}
	} );
} );
