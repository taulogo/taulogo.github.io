var IN_LOGO_COORD_X = 235;
var IN_LOGO_COORD_Y = 235;
var CIRCLE_DIAMETER = 380;
var INSERT_MIN_RATIO = 1.4;
var LOGO_WITH_TITLE = "logo/eng_blank.png";
var LOGO_NO_TITLE = "logo/blank_notext.png"

var RATIO_W, RATIO_H;
var logo_img = null;
var emojiArea = null;
var home_url = "";
var current_img = "";
var logo_selection = 0;
var current_logo = LOGO_NO_TITLE;

var img_canvas;
var ctx;

function init_logo() {
	var logo_src;
	logo_img = new Image();
	var logo_param = $.urlParam("logo");
	if (logo_param) {
		logo_selection = parseInt(logo_param);
	}
	else logo_selection = 0;
	switch(logo_selection) {
		case 0:
			logo_src = LOGO_WITH_TITLE;
			break;
		case 1:
			logo_src = LOGO_NO_TITLE;
			break;
		default:
			logo_src = LOGO_NO_TITLE;
	}
	logo_img.src = logo_src;
	logo_img.onload = function() {
		RATIO_W = img_canvas.offsetWidth / logo_img.width;
		img_canvas.style.height = RATIO_W * logo_img.height;
		img_canvas.width = img_canvas.offsetWidth;
		img_canvas.height = img_canvas.offsetHeight;
		img_canvas.style.width = img_canvas.width;
		redraw_logo();
		ref_imgsrc = $.urlParam("img");
		if (ref_imgsrc) insert_in_logo(ref_imgsrc, true);
		else first_emoji();
	}
}

function redraw_logo() {
	ctx.clearRect(0, 0, img_canvas.width, img_canvas.height);	//clear the canvas
	ctx.fillStyle = "#ffffff";	//fill with white
	ctx.fillRect(0,0,img_canvas.width,img_canvas.height);
	ctx.drawImage(logo_img, 0, 0, img_canvas.width, img_canvas.height);
}


function showLoadError() {
	$("#imgUrlFormGroup").addClass("has-error");
	$("#imgUrlFormGroup2").addClass("has-error");
	$("#inputImgUrlErrorLabel").show();
}

function hideLoadError() {
	$("#imgUrlFormGroup").removeClass("has-error");
	$("#imgUrlFormGroup2").removeClass("has-error");
	$("#inputImgUrlErrorLabel").hide();
}

function insert_in_logo(src, fromWeb) {

	var img = new Image();
	img.src = src;
	
	if (fromWeb) img.onerror = function() { showLoadError(); };

	img.onload = function() {
		current_img = img.src;
		updateShareURL();
		redraw_logo();
		hideLoadError();

		var larger_side = Math.max(img.width, img.height);
		var ratio = Math.min((CIRCLE_DIAMETER * RATIO_W) / larger_side, INSERT_MIN_RATIO);

		var w = img.width * ratio;
		var h = img.height * ratio;
		var x = (RATIO_W * IN_LOGO_COORD_X) - (w / 2);
		var y = (RATIO_W * IN_LOGO_COORD_Y) - (h / 2);
		ctx.drawImage(img, x, y, w, h);
	}
}
function setup_emojis() {
	emojiarea = new $.EmojiArea();
	emojiarea.setupButton();
}

function first_emoji() {
	var rand_emojis = [[0, ":hankey:"], [1, ":pig_nose:"]];
	var i = Math.floor(Math.random()*rand_emojis.length);
	var e = rand_emojis[i];

	var emoji_src = emojiarea.getImgSrc(e[0], e[1]);
	insert_in_logo(emoji_src, false);
}

function setup_url_button() {
	$("#urlForm").on('submit', function(e) {
		e.preventDefault();
		insert_in_logo($("#inputImgUrl").val(),true); 
	});
}

function downloadImg() {
	var link = document.getElementById("downloadImg");
	link.href = img_canvas.toDataURL();
	link.download = "taulogo.png";
}

function setup_download() {
	$("#downloadImg").click(function() {downloadImg();});
}


function updateShareURL() {
	share_url = home_url + "?img=" + current_img + "&logo=" + logo_selection;
	$("#shareUrl").val(share_url);
}

function init_all() {
	home_url = "http://" + window.location.host;
	img_canvas = document.getElementById("img_canvas");
	ctx = img_canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;
	setup_url_button();
	setup_emojis();
	setup_download();
	init_logo();
}

//returns null if param not set
$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}