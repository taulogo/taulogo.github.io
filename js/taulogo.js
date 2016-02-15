var IN_LOGO_COORD_X = 235;
var IN_LOGO_COORD_Y = 235;
var CIRCLE_DIAMETER = 380;
var INSERT_MIN_RATIO = 1.6;
var RATIO_W, RATIO_H;
var logo_img = null;
var emojiArea = null;

var img_canvas;
var ctx;

//draw logo
function init_logo() {
	if (!logo_img) {
		logo_img = new Image();
		logo_img.src = "logo/eng_blank.png";
		logo_img.onload = function() {
			RATIO_W = img_canvas.offsetWidth / logo_img.width;
			img_canvas.style.height = RATIO_W * logo_img.height;
			img_canvas.width = img_canvas.offsetWidth;
			img_canvas.height = img_canvas.offsetHeight;
			img_canvas.style.width = img_canvas.width;
			redraw_logo();
			first_emoji();
		}
	}
}

function redraw_logo() {
	ctx.clearRect(0, 0, img_canvas.width, img_canvas.height);	//clear the canvas
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
		redraw_logo();
		hideLoadError();

		var larger_side = Math.max(img.width, img.height);
		var ratio = Math.min((CIRCLE_DIAMETER * RATIO_W) / larger_side, INSERT_MIN_RATIO);

		// var ratio = Math.max(Math.min(((CIRCLE_DIAMETER * RATIO_W) / larger_side), 1.0), INSERT_MIN_RATIO);
		console.log(ratio);
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
	$("#url_button").closest('form').on('submit', function(e) {
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

function init_all() {
	img_canvas = document.getElementById("img_canvas");
	ctx = img_canvas.getContext('2d');
	ctx.imageSmoothingEnabled = false;

	setup_url_button();
	setup_emojis();
	init_logo();
	setup_download();
}