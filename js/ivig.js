// Round to a specified number of digits
function round(num, decimals) {
	return (Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals));
}

// Only allow numeric input
function validate(id) {
	var input = document.getElementById(id).value;
	var out = '';
	for(let i = 0; i < input.length; i++) {
		var curr_char = input[i];
		if((curr_char >= '0' && curr_char <= '9') || curr_char <= '.') {
			out += curr_char;
		}
	}

	document.getElementById(id).value = out;
	return(out);
}

var wt_id = "wt";
var rate1_id = "rate1";
var rate2_id = "rate2";
var rate3_id = "rate3";
var rate4_id = "rate4";
var rate5_id = "rate5";
var rate6_id = "rate6";
var rate7_id = "rate7";
var vol1_id = "vol1";
var vol2_id = "vol2";
var vol3_id = "vol3";
var vol4_id = "vol4";
var vol5_id = "vol5";
var vol6_id = "vol6";
var vol7_id = "vol7";
var dose_gkg_id = "dose_gkg";
var dose_warning_id = "dose_warning";
var conc_id = "conc";
var end_time_id = "end_time";
var premed_acetaminophen_id = "premed_acetaminophen";
var premed_diphenhydramine_id = "premed_diphenhydramine";
var premed_methylpred_id = "premed_methylpred";

var wt_el = document.getElementById(wt_id);
var rate1_el = document.getElementById(rate1_id);
var rate2_el = document.getElementById(rate2_id);
var rate3_el = document.getElementById(rate3_id);
var rate4_el = document.getElementById(rate4_id);
var rate5_el = document.getElementById(rate5_id);
var rate6_el = document.getElementById(rate6_id);
var rate7_el = document.getElementById(rate7_id);
var rates = [rate1_el, rate2_el, rate3_el, rate4_el, rate5_el, rate6_el, rate7_el];
var vol1_el = document.getElementById(vol1_id);
var vol2_el = document.getElementById(vol2_id);
var vol3_el = document.getElementById(vol3_id);
var vol4_el = document.getElementById(vol4_id);
var vol5_el = document.getElementById(vol5_id);
var vol6_el = document.getElementById(vol6_id);
var vol7_el = document.getElementById(vol7_id);
var vols = [vol1_el, vol2_el, vol3_el, vol4_el, vol5_el, vol6_el, vol7_el];
var dose_gkg_el = document.getElementById(dose_gkg_id);
var dose_warning_el = document.getElementById(dose_warning_id);
var conc_el = document.getElementById(conc_id);
var end_time_el = document.getElementById(end_time_id);
var premed_acetaminophen_el = document.getElementById(premed_acetaminophen_id);
var premed_diphenhydramine_el = document.getElementById(premed_diphenhydramine_id);
var premed_methylpred_el = document.getElementById(premed_methylpred_id);

var wt = NaN;
var dose_gkg = NaN;
var conc = 0.1;

function refresh(listener) {

	// Get updated values
	validate(wt_el.id);
	wt = parseFloat(wt_el.value);
	validate(dose_gkg_el.id);
	dose_gkg = parseFloat(dose_gkg_el.value);
	validate(conc_el.id);
	conc = parseFloat(conc_el.value);

	// If weight is valid, calculate the infusion rates
	if(!isNaN(wt) && wt != "" && wt > 0) {
		var temp = NaN;
		var vol_infused = 0;
		for(var i = 0; i < rates.length-1; i++) {
			temp = round(0.3 * (i+1) * wt, 1);
			rates[i].innerHTML = temp;
			vols[i].innerHTML = round(temp / 2, 2);
			vol_infused += temp / 2;
		}
		// Max at 2 mL/kg/hr
		temp = round(2 * wt, 1);
		rates[6].innerHTML = temp;

		// Calculate premedication doses
		premed_acetaminophen_el.innerHTML = " = " + Math.min(round(15 * wt, 1), 1000) + " mg";
		premed_diphenhydramine_el.innerHTML = " = " + Math.min(round(1.25 * wt, 1), 50) + " mg";
		premed_methylpred_el.innerHTML = " = " + Math.min(round(2 * wt, 1), 40) + " mg";

		// TODO: End early if full dose has been given
		// Calculate the total infusion duration
		if((!isNaN(conc) && conc != "" && conc > 0) && (!isNaN(dose_gkg) && dose_gkg != "" && dose_gkg > 0)) {
			// Time left (unit: hours) at max rate of infusion (assuming max rate is 2 mL/kg/hr)
			var time_left = round((dose_gkg * wt - vol_infused * conc) / (conc * 2 * wt), 1);
			if(time_left > 0) {
				// Minutes left
				var min_left = Math.round((time_left - Math.floor(time_left)) * 60);
				end_time_el.innerHTML = (Math.floor(time_left) + 3) + ":" + min_left;
				vols[6].innerHTML = round(time_left * 2 * wt, 2);
			} else {
				end_time_el.innerHTML = "completion";
				vols[6].innerHTML = "0";
			}
		} else {
			end_time_el.innerHTML = "completion";
			vols[6].innerHTML = "";
		}

	// If weight is not valid, clear all the output fields
	} else {
		for(var i = 0; i < rates.length; i++) {
			rates[i].innerHTML = "";
			vols[i].innerHTML = "";
		}
		premed_acetaminophen_el.innerHTML = "";
		premed_diphenhydramine_el.innerHTML = "";
		premed_methylpred_el.innerHTML = "";
	}

	// Display a warning if the dose of IVIG is above the recommended maximum
	dose_warning_el.innerHTML = "";
	if(dose_gkg * wt > 100) {
		dose_warning_el.innerHTML = "WARNING: the dose of " + round(dose_gkg * wt, 1) + "g is " + round(dose_gkg * wt - 100, 1) + "g above the recommended maximum of 100g";
	}
}
