// Round to a specified number of digits
function round(num, decimals) {
	return (Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals));
}

// Only allow numeric input
function validate(id) {
	var input = document.getElementById(id).value;
	var out = '';
	var decimal = false;
	for(let i = 0; i < input.length; i++) {
		var curr_char = input[i];
		if((curr_char >= '0' && curr_char <= '9')) {
			out += curr_char;
		// Only allow a decimal point if there are no preceding decimal points
		} else if(curr_char <= '.' && !decimal) {
			out += curr_char;
			decimal = true;
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
var dose_total_id = "dose_total";
var dose_total_row_id = "dose_total_row";
var dose_warning_id = "dose_warning";
var dose_warning_id_row = "dose_warning_row";
var conc_id = "conc";
var end1_id = "end1";
var end2_id = "end2";
var end3_id = "end3";
var end4_id = "end4";
var end5_id = "end5";
var end6_id = "end6";
var end7_id = "end7";
var row1_id = "row1";
var row2_id = "row2";
var row3_id = "row3";
var row4_id = "row4";
var row5_id = "row5";
var row6_id = "row6";
var row7_id = "row7";
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
var dose_total_el = document.getElementById(dose_total_id);
var dose_total_row_el = document.getElementById(dose_total_row_id);
var dose_warning_el = document.getElementById(dose_warning_id);
var dose_warning_row_el = document.getElementById(dose_warning_id_row);
var conc_el = document.getElementById(conc_id);
var end1_el = document.getElementById(end1_id);
var end2_el = document.getElementById(end2_id);
var end3_el = document.getElementById(end3_id);
var end4_el = document.getElementById(end4_id);
var end5_el = document.getElementById(end5_id);
var end6_el = document.getElementById(end6_id);
var end7_el = document.getElementById(end7_id);
var ends = [end1_el, end2_el, end3_el, end4_el, end5_el, end6_el, end7_el];
var row1_el = document.getElementById(row1_id);
var row2_el = document.getElementById(row2_id);
var row3_el = document.getElementById(row3_id);
var row4_el = document.getElementById(row4_id);
var row5_el = document.getElementById(row5_id);
var row6_el = document.getElementById(row6_id);
var row7_el = document.getElementById(row7_id);
var rows = [row1_el, row2_el, row3_el, row4_el, row5_el, row6_el, row7_el];
var premed_acetaminophen_el = document.getElementById(premed_acetaminophen_id);
var premed_diphenhydramine_el = document.getElementById(premed_diphenhydramine_id);
var premed_methylpred_el = document.getElementById(premed_methylpred_id);

var wt = NaN;
var dose_gkg = NaN;
var conc = 0.1;			// g/mL
var max_rate = 2;		// mg/kg/hr
var step_time = 30;		// minutes
var step_rate = 0.3;
var i_final = Math.floor(max_rate/step_rate);

function refresh(listener) {

	// Get updated values
	validate(wt_el.id);
	wt = parseFloat(wt_el.value);
	validate(dose_gkg_el.id);
	dose_gkg = parseFloat(dose_gkg_el.value);
	validate(conc_el.id);
	conc = parseFloat(conc_el.value);

	// Show all rows
	for(var i = 0; i < rows.length; i++) {
		rows[i].style.display = "";
	}

	// Reset total dose row
	dose_total_el.innerHTML = "";
	dose_total_row_el.style.display = "none";

	// If weight is valid, calculate the infusion rates
	if(!isNaN(wt) && wt != "" && wt > 0) {
		// Calculate the total infusion duration
		if((!isNaN(conc) && conc != "" && conc > 0) && (!isNaN(dose_gkg) && dose_gkg != "" && dose_gkg > 0)) {
			var temp = NaN;
			var dose_infused = 0;
			dose_total_el.innerHTML = round(dose_gkg * wt, 2) + " g";
			dose_total_row_el.style.display = "";

			var i = 0;
			while(i < rates.length-1 && round(dose_infused, 2) < round(dose_gkg * wt, 2)) {
				temp = round(step_rate * (i+1) * wt, 1);
				rates[i].innerHTML = temp;

				// If the current time frame does not achieve the desired total dose
				if(round(dose_infused + temp * conc / (60/step_time), 2) < round(dose_gkg * wt, 2)) {
					vols[i].innerHTML = round(temp / (60/step_time), 1);
					dose_infused = round(dose_infused + temp * conc / (60/step_time), 2);
					ends[i].innerHTML = Math.floor((i+1) * 0.5) + ":" + ((Math.round(((i+1) * 0.5) % 1 * 60) + "").length == 2 ? Math.round(((i+1) * 0.5) % 1 * 60) : "0" + Math.round(((i+1) * 0.5) % 1 * 60));

				// If the current time frame achieves the desired total dose
				} else {
					vols[i].innerHTML = round((dose_gkg * wt - dose_infused) / conc, 1);

					// Time left (unit: hours) at max rate of infusion
					var time_left = i * 0.5 + vols[i].innerHTML / temp;
					// Minutes left
					var min_left = Math.round((time_left - Math.floor(time_left)) * 60);
					ends[i].innerHTML = (Math.floor(time_left)) + ":" + ((min_left + "").length == 2 ? min_left : "0" + min_left);

					dose_infused = round(dose_gkg * wt, 2);
				}

				i++;
			}

			// If the total desired dose has not yet been infused
			if(round(dose_infused, 2) < round(dose_gkg * wt, 2)) {

				temp = round(max_rate * wt, 1);
				rates[i_final].innerHTML = temp;

				// Time left (unit: hours) at max rate of infusion
				var time_left = (dose_gkg * wt - dose_infused) / (conc * max_rate * wt);
				if(time_left > 0) {
					// Minutes left
					var min_left = Math.round((time_left - Math.floor(time_left)) * 60);
					ends[i_final].innerHTML = (Math.floor(time_left) + 3) + ":" + ((min_left + "").length == 2 ? min_left : "0" + min_left);
					vols[i_final].innerHTML = round(time_left * max_rate * wt, 1);
				} else {
					ends[i_final].innerHTML = "completion";
					vols[i_final].innerHTML = "0";
				}
			// Loop through and hide the rows that aren't required
			} else {
				while(i < rates.length) {
					rows[i].style.display = "none";
					i++;
				}
			}
		// If total infusion duration cannot be calculated (concentration and dose are not defined)
		} else {
			var temp = NaN;
			for(var i = 0; i < rates.length-1; i++) {
				temp = round(step_rate * (i+1) * wt, 1);
				rates[i].innerHTML = temp;
				vols[i].innerHTML = round(temp / (60/step_time), 1);
			}

			temp = round(max_rate * wt, 1);
			rates[i_final].innerHTML = temp;
			vols[i_final].innerHTML = "";
			ends[i_final].innerHTML = "completion";
		}

		// Calculate premedication doses
		premed_acetaminophen_el.innerHTML = " = " + Math.min(round(15 * wt, 1), 1000) + " mg";
		premed_diphenhydramine_el.innerHTML = " = " + Math.min(round(1.25 * wt, 1), 50) + " mg";
		premed_methylpred_el.innerHTML = " = " + Math.min(round(2 * wt, 1), 40) + " mg";

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
		dose_warning_row_el.style.display = "";
	} else {
		dose_warning_row_el.style.display = "none";
	}
}
