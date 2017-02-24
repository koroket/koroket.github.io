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

function preloadAppTemplates() {
	appTemplates.forEach(function(templateType){
		//For availability report while loading
		cachedTemplates[templateType] = false;
		var template = $("<div></div>");
		template.load("templates/" + templateType + ".html",function(){
			cachedTemplates[templateType] = template;
		});
	});
}

function isAppTemplatesLoaded() {
	appTemplates.forEach(function(templateType){
		if (typeof cachedTemplates[templateType] !== "object") {
			return false;
		}
	});
	return true;
}

/*
*  Keep spinning if templates have not loaded
*/
function loadAppsHelper(res) {
	if (isAppTemplatesLoaded()) {
		res.forEach(function(app){
			var isApp = (typeof(app["href"]) !== "string") || app["href"].length === 0;
			var templateType = isApp ? "inapp" : "external";
			var template = cachedTemplates[templateType].clone();
			template.find('.app-name').text(app["name"]);
			var srcURL = "https://drive.google.com/uc?export=view&id=" + app["img_url"];
			template.find('.app-image').attr('src',srcURL);
			if (isApp) {
				if (typeof app["partial"] === "string" && app["partial"].length > 0) {
					template.find('.app-cover').attr('style',"background-image: url('" + srcURL + "');");
					template.on('click',appOnClick(app["partial"]));
				} else if (typeof app["callable"] === "string" && app["callable"].length > 0) {
					var call_id = app["callable"];
					if (typeof registerables[call_id] === "undefined") {
						console.log("Unrecognized registerable");
					} else {
						template.on('click',registerables[call_id]);
					}
				}
			} else {
				template.find('a').attr('href',app["href"]);
			}
			$("#home-content").append(template);
		})
	} else {
		setTimeout(function() { loadAppsHelper(res) }, 500);
	}
}

function loadApps() {
	parseGoogleSheets(confApps,function(res){
		loadAppsHelper(res);
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
		var sharedTemplate = $("<section></section>");
		sharedTemplate.load("templates/project.html",function(){
			res.forEach(function(app){
				var template = sharedTemplate.clone();
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

var registerables = {
	"camera": turnOnCamera
};

var cachedTemplates = {};
var appTemplates = ["inapp","external"];

$('.close-btn').on('click', function(){
	$(this).closest('#current-content').hide();
});

setGoogleSheetsAPIKey("AIzaSyC7DUWYxwwsz14ha9LybsvTWQ5z593REzg");

preloadAppTemplates();

loadApps();

$("#home-button").on("click",function(){
	turnOffCamera();
});

$("#device-inner-camera").on("click",function(){
	turnOnCamera();
});

$("#photo-button-inner").on("click",function(){
	var video = $("#camera-screen").find("video")[0];
	var canvas = document.createElement("canvas");
	canvas.width = video.videoWidth;
	canvas.height = video.videoHeight;
	canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
	var fileName = "selfie.png";
	notify({
		"title" : "Save Photo?",
		"message" : "Will download as '" + fileName + "'",
		"actions" : [{
			"text" : "Yes",
			"onLoad" : function(obj) {
				obj.attr("href",canvas.toDataURL());
				obj.attr("download",fileName);
			},
			"onClick" : function(e){ dismissNotification(e.target); }
		},{
			"text" : "Cancel",
			"onClick" : function(e){ dismissNotification(e.target); }
		}]
	});
})

var localStream;

function turnOnCamera(){
	$("#camera-screen").show();
	navigator.getUserMedia({video: true, audio: false}, function(localMediaStream) {
		localStream = localMediaStream;
	  var video = $("#camera-screen").find("video");
	  video.attr("src",window.URL.createObjectURL(localMediaStream));
	},function(){
		notify({
			"title": "Unaccessable Camera",
			"message": "No accessable camera device found",
			"actions": [{
				"text" : "OK",
				"onClick" : function(e){
					dismissNotification(e.target);
					$("#camera-screen").hide();
				}
			}]
		})
	});
}

function turnOffCamera(){
	if (typeof localStream !== "undefined") {
		var video = $("#camera-screen").find("video");
		video.attr("src","");
		localStream.getTracks()[0].stop();
		localStream = undefined;
	}
	$("#camera-screen").hide();
}

function showOverlay() {
	$("#device-overlay").show();
}

function hideOverlay() {
	$("#device-overlay").hide();
}

function dismissNotification(obj) {
	hideOverlay();
	$(obj).parents('.notification-container').remove();
}

function notify(info){
	showOverlay();
	var template = $("<div></div>");
	template.addClass("notification-container");
	template.load("templates/notification.html",function(){
		var target = template.find(".notification-title");
		if (typeof info["title"] !== 'undefined') {
			target.text(info["title"]);
		} else {
			target.remove();
		}

		target = template.find(".notification-message");
		if (typeof info["message"] !== 'undefined') {
			target.text(info["message"]);
		} else {
			target.remove();
		}

		var container = template.find(".notification-actions");
		if (typeof info["actions"] === 'object') {
			info["actions"].forEach(function(action){
				var newAction = $("<a></a>");
				newAction.text(action["text"]);
				newAction.on("click",action["onClick"]);
				if (typeof action["onLoad"] === 'function') {
					action["onLoad"](newAction);
				}
				container.append(newAction);
			});
		} else {
			//Use default OK dismisser
			var newAction = $("<div></div>");
			newAction.text("OK");
			newAction.on("click",function(e){ dismissNotification(e.target); });
			container.append(newAction);
		}
		$("#device-overlay").append(template);
	});
}

var _clock = $(".middle-status-item");
updateTime();

function getFullDigits(i) {
	return (i < 10) ? "0" + i : i;
}

function updateTime() {
	var d = new Date();
	var millisecondsInMinute = 60000;
	var currentMilliseconds = (d.getSeconds() * 1000) * d.getMilliseconds();
	var remainingMilliseconds = millisecondsInMinute - (currentMilliseconds % millisecondsInMinute);
	setTimeout(updateTime, remainingMilliseconds);
  var h = d.getHours();
  var m = getFullDigits(d.getMinutes());
  _clock.text(h + ":" + m);
  _clock.addClass("flash");
  setTimeout(function(){
  	_clock.removeClass("flash");
  }, 2000);
}