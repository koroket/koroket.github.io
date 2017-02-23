function setGoogleSheetsAPIKey(key) {
	api_key = key;
}

function googleSheetsError(msg){
	console.log(msg);
}

function validateConfiguration(conf) {
	if (typeof conf !== "object") {
		googleSheetsError("Conf must be an object");
	} else {
		if (typeof conf["gid"] !== "string") {
			googleSheetsError("Conf must have key 'gid' with a string value");
		}
		if (typeof conf["api_key"] !== "string") {
			if (typeof api_key === "string") {
				conf["api_key"] = api_key;
			} else {
				googleSheetsError("An API key must be set or conf must have key 'api_key' with a string value");
			}
		}
	}
}

function parseGoogleSheets(conf, callback) {
	validateConfiguration(conf);

	//For now this should suffice for selecting everything
	var range = "A2:Z";

	var url = "https://sheets.googleapis.com/v4/spreadsheets/" +
		conf["gid"] +
		"/values/Sheet1!" + 
		range +
		"?key=" + 
		conf["api_key"];

	$.get( url, function( data ) {
	  if (typeof(data) === "object" && typeof(data["values"]) === "object") {
	    console.log("Retrieved from Sheets API");
	    if (typeof(conf["options"] === "object")) {
	    	if (typeof(conf["options"]["keys"]) === "object") {
	    		res = [];
	    		data["values"].forEach(function(contents) {
	    			newObj = {};
	    			conf["options"]["keys"].forEach(function(e,index){
	    				newObj[e["id"]] = contents[index];
		    		});
		    		res.push(newObj);
	    		});
	    		callback(res);
	    	} else {
	    		console.log("Unsupported");
	    	}
	    } else {
	    	console.log("Unsupported");
	    }
	  } else {
	    console.log("Response Error");
	  }
	});
}

function appOnClick(partial) {
	var partialLink = "apps/" + partial + ".html"
	return function (e){
		if (!appLocked) {
			appLocked = true;
			var cover = $(this).find('.app-cover');
			cover.removeClass('grow');
			var position = $(this).find('.app-image').offset();
			cover.css('top', position.top);
			cover.css('left', position.left);
			cover.css('bottom', $(window).height() - 60.0 - position.top);
			cover.css('right', $(window).width() - 60.0 -  position.left);
			cover.addClass('grow')
			$('#home-content').addClass('app-clicked');
			setTimeout(function() {
				appLocked = false;
				$('#home-content').removeClass('app-clicked');
				$('#current-content').show()
				$("#container").load(partialLink);
			}, 1000);
		}
	}
}

function loadApps() {
	parseGoogleSheets(confApps,function(res){
		res.forEach(function(app){
			var template = $("<div></div>");
			var isApp = (typeof(app["href"]) !== "string") || app["href"].length === 0;
			var templateType = isApp ? "inapp" : "external";
			template.load("templates/" + templateType + ".html",function(){
				template.find('.app-name').text(app["name"]);
				var srcURL = "http://drive.google.com/uc?export=view&id=" + app["img_url"];
				template.find('.app-image').attr('src',srcURL);
				if (isApp) {
					template.on('click',appOnClick(app["partial"]));
				} else {
					template.find('a').attr('href',app["href"]);
				}
				$("#home-content").append(template);
			});
		})
	});
}

function youtubeVideoOnClick(){
	var iframe = $("<iframe></iframe>");
  var embed = "https://www.youtube.com/embed/ID?autoplay=1&showinfo=0";
  iframe.attr("src", embed.replace("ID", $(this).attr('data-id')));
  iframe.attr("frameborder", "0");
  iframe.attr("allowfullscreen", "1");
  var parent = $(this).parent();
  $(this).remove();
  parent.append(iframe);
}

function loadProjects() {
	parseGoogleSheets(confProjects,function(res){
		res.forEach(function(app){
			//grab template and render
			var template = $("<section></section>");
			template.load("templates/project.html",function(){
				template.find('.projectname').text(app["title"]);
				template.find('.subtitlename').text(app["subtitle"]);
				template.find('.date').text(app["date"]);

				if (typeof app["icon"] === "string" && app["icon"].length > 0) {
					template.find(".cd-timeline-img").find("img").attr("src","img/" + app["icon"] + ".svg");
				}

				if (typeof app["bg"] === "string" && app["bg"].length > 0) {
					template.find(".cd-timeline-img").addClass(app["bg"]);
				}

				var target = template.find('.tt');
				if (typeof app["tt"] === "string" && app["tt"].length > 0) {
					target.find('.player-model').attr('data-id',app["tt"]);
					target.find('img').attr("src","https://i.ytimg.com/vi/" + app["tt"] + "/hqdefault.jpg");
					target.find('.player-model').on("click",youtubeVideoOnClick);
				} else {
					target.remove();
				}

				target = template.find('.ap');
				if (typeof app["ap"] === "string" && app["ap"].length > 0) {
					target.find('.player-model').attr('data-id',app["ap"]);
					target.find('img').attr("src","https://i.ytimg.com/vi/" + app["ap"] + "/hqdefault.jpg");
					target.find('.player-model').on("click",youtubeVideoOnClick);
				} else {
					target.remove();
				}

				target = template.find('.overview');
				if (typeof app["ov"] === "string" && app["ov"].length > 0) {
					var contents = app["ov"].split("/");
					contents.forEach(function(elem){
						target.append("<h4>" + elem + "</h4>");
					});
				} else {
					target.remove();
				}

				target = template.find('.appfeatures');
				if (typeof app["af"] === "string" && app["af"].length > 0) {
					var contents = app["af"].split("/");
					contents.forEach(function(elem){
						target.append("<h4>" + elem + "</h4>");
					});
				} else {
					target.remove();
				}

				target = template.find('.techfeatures');
				if (typeof app["tf"] === "string" && app["tf"].length > 0) {
					var contents = app["tf"].split("/");
					contents.forEach(function(elem){
						target.append("<h4>" + elem + "</h4>");
					});
				} else {
					target.remove();
				}

				target = template.find('.links');
				if (typeof app["urls"] === "string" && app["urls"].length > 0) {
					var contents = app["urls"].split("**");
					contents.forEach(function(elem){
						var parts = elem.split("*");
						target.append("<h3><a href='" + parts[1] + 
							"' class='btn btn-dark'>" + parts[0] + "</a></h3>");
					});
				} else {
					target.remove();
				}

				target = template.find('.images');
				if (typeof app["images"] === "string" && app["images"].length > 0) {
					var contents = app["images"].split("/");
					contents.forEach(function(elem){
						target.append('<div class="image-cont"><img src="img/' + elem
							+ '.jpg" align="middle"></div>');
					});
				} else {
					target.remove();
				}

				$("#cd-timeline").append(template);
				var block = template.find('.cd-timeline-block');
				if(block.offset().top > $(window).scrollTop()+$(window).height()*0.75) {
					block.find('.cd-timeline-img, .cd-timeline-content').addClass('is-hidden');
				}
			});
		})
	});
}

var appLocked = false;

$('.close-btn').on('click', function(){
	$(this).closest('#current-content').hide();
});

setGoogleSheetsAPIKey("AIzaSyC7DUWYxwwsz14ha9LybsvTWQ5z593REzg");

loadApps();