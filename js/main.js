/*Etsy Search App*/
/*Developed by Joshua Hatcher, May 2013*/

var stuffContents = document.querySelector('.stuff'),
	searchBtn = document.querySelector('.search'),
	url = "https://openapi.etsy.com/v2/listings/active.js",
	bigUrl, keywords;

url += "?api_key=4o8s3iuadgk660pn4ydrih8l";
url += "&callback=getData";
url += "&includes=MainImage";

addEvent('click', searchBtn, search);

function search() {
	var params = {},
		limit = document.querySelector('.limit').value;

	keywords = document.querySelector('.keywords').value;

	if (keywords) {
		params.keywords = keywords;
		params.limit = limit || 25;
		buildSearchString(params);
	} else {
		stuffContents.innerHTML = 'Sorry, you must input some keywords to get results';
	}
};

function buildSearchString(params) {
	searchString = '&limit='+params.limit;
	if (keywords) {
		searchString += '&keywords='+params.keywords;
	};
	bigUrl = url + searchString;
	getData();
};

function getData(data) {
	$.ajax({
		type: 'GET',
		url: bigUrl,
		success: function(data) {
			var items = [];
			stuffContents.innerHTML = '';
			if (!(stuffContents.style.display='none')) {
				stuffContents.slideUp();
			}

			for (var i=0, l=data.results.length; i < l; ++i) {
				var item = {};
				item.img = data.results[i].MainImage.url_75x75;
				item.title = data.results[i].title;
				item.description = data.results[i].description;
				item.price = data.results[i].price;
				item.url = data.results[i].url;
				items.push(item);
				stuffContents.innerHTML += '<div class="item" id="item-'+i+'"><img src="'+item.img+'"><div class="item-text"><p>'+item.title+'</p><p class="price">Price: $'+item.price+'</p><p class="more"><a class="opts" href="'+item.url+'" target="_blank">More Info</a> | <span class="opts" id="remove-'+i+
				'">Remove</span></p></div></div>';
			};
			$('.stuff').fadeIn();
			setUpRemoveButton();
		},
		error: function() {
			console.log('There was a problem sending the request...');
		},
		dataType: 'jsonp'
	});
};

function setUpRemoveButton() {
	for (var i = 0, l = document.querySelectorAll('.item').length; i < l; ++i) {
		document.querySelector('#remove-'+i).addEventListener('click', removeItem)
	}
}

function removeItem() {
	var itemContainer = this.parentNode.parentNode.parentNode;
	itemContainer.style.maxHeight = '0px';
	itemContainer.style.minHeight = '0px';
	itemContainer.style.padding = '0px';
	itemContainer.style.margin = '0px';
	itemContainer.style.border = '0px';
}

function addEvent(ev, els, func) {
	var x, len, el;

	els = isArray(els) ? els : [ els ];
	for (x = 0, len = els.length; x < len; x++) {
		el = els[x];
	
	 	if (el.addEventListener)
	   		el.addEventListener(ev, func, false);
	 	else if (el.attachEvent) {
	    	el.attachEvent('on'+ev, func);
	 	}
	 	else {
	  		el[ev] = func;
	 	}
	}
};

function isArray(input) {
	return Object.prototype.toString.call(input) === ('[object Array]');
};