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

// Math.min excluding NaNs
function min_valid(x, y) {
	if(isNaN(x)) {
		if(!isNaN(y)) {
			return (y);
		}
		return (NaN);
	} else if(isNaN(y)) {
		if(!isNaN(x)) {
			return (x);
		}
		return (NaN);
	}
	return (Math.min(x,y));
}

// Set inner HTML of all elements of a specific class
function setElements(text, className) {
	for(const el of document.getElementsByClassName(className)) {
		el.innerHTML = text;
	}
}

// Set href of all elements of a specific class
function setElementsHref(url, className) {
	for(const el of document.getElementsByClassName(className)) {
		el.href = url;
	}
}

var wt_id = "wt";
var dose_perkg_id = "dose_perkg";
var dose_perkg_u_id = "dose_perkg_u";
var dose_total_id = "dose_total";
var dose_total_u_id = "dose_total_u";
var dose_warning_id = "dose_warning";
var dose_warning_id_row = "dose_warning_row";
var conc_id = "conc";
var conc_u_id = "conc_u";
var output_id = "output";
var premed_acetaminophen_id = "premed_acetaminophen";
var premed_diphenhydramine_id = "premed_diphenhydramine";
var premed_methylpred_id = "premed_methylpred";
var header_home_id = "header_home";
var header_ivig_id = "header_ivig";
var header_ritux_first_id = "header_ritux_first";
var header_ritux_subsequent_id = "header_ritux_subsequent";

var wt_el = document.getElementById(wt_id);
var dose_perkg_el = document.getElementById(dose_perkg_id);
var dose_perkg_u_el = document.getElementById(dose_perkg_u_id);
var dose_total_el = document.getElementById(dose_total_id);
var dose_total_u_el = document.getElementById(dose_total_u_id);
var dose_warning_el = document.getElementById(dose_warning_id);
var dose_warning_row_el = document.getElementById(dose_warning_id_row);
var conc_el = document.getElementById(conc_id);
var conc_u_el = document.getElementById(conc_u_id);
var output_el = document.getElementById(output_id);
var premed_acetaminophen_el = document.getElementById(premed_acetaminophen_id);
var premed_diphenhydramine_el = document.getElementById(premed_diphenhydramine_id);
var premed_methylpred_el = document.getElementById(premed_methylpred_id);
var header_home_el = document.getElementById(header_home_id);
var header_ivig_el = document.getElementById(header_ivig_id);
var header_ritux_first_el = document.getElementById(header_ritux_first_id);
var header_ritux_subsequent_el = document.getElementById(header_ritux_subsequent_id);
var headers = [header_ivig_el, header_ritux_first_el, header_ritux_subsequent_el];

var wt = NaN;
var dose_perkg = NaN;
var dose_total = NaN;
var dose_u = "";
var conc = NaN;		// Concentration of the infusion medication (units: g/mL)
var max_rate = NaN;		// Maximum rate of the infusion (units: mg/hr)
var max_rate_perkg = NaN;		// Maximum rate of the infusion (units: mg/kg/hr)
var warning_max = NaN;
var step_time = NaN;		// Time per step of the infusion uptitration (units: minutes)
var step_rate = NaN;		// Increase in the rate of the infusion for step of the uptitration (units: mL/kg/hr)
var step_rate_max = NaN;
var i_final = NaN;		// Number of steps of the uptitration prior to hitting the maximum infusion rate
var last_dose_listener = "";
var last_drug = "";

function ivig() {
	// Set drug name
	var name = "IVIG";
	setElements(name[0].toUpperCase() + name.substring(1) + " ", "drug_name_upper");
	setElements(name + " ", "drug_name_lower");

	// Set policy link
	var href = "https://hospitalpolicies.ellucid.com/documents/view/20630";
	setElementsHref(href, "policy_link");

	// Display summary of protocol
	var protocol_summ = ": Initial rate 0.3 mL/kg/hour for the first 30 minutes. May increase by 0.3 mL/kg/hour every 30 minutes to a maximum of 2 mL/kg/hour";
	document.getElementById("protcol_summary").innerHTML = protocol_summ;

	// Set infusion parameters
	dose_u = "g";
	dose_perkg_u_el.innerHTML = dose_u + "/kg";
	dose_total_u_el.innerHTML = dose_u;
	warning_max = 100;
	conc = 0.1;
	conc_el.value = conc;
	conc_u_el.innerHTML = "g/mL";
	max_rate = NaN;
	max_rate_perkg = 2;
	step_time = 30;
	step_rate = 0.3;
	step_rate_max = NaN;
	i_final = Math.floor(max_rate_perkg/step_rate);

	// Reset dose
	if(last_drug != name) {
		dose_perkg_el.value = "";
		dose_total_el.value = "";
	}
	last_drug = name;

	// Set active header
	for(var i = 0; i < headers.length; i++) {
		headers[i].className = "";
	}
	header_ivig_el.className = "active";

	refresh("none");
}

function rituximab_first() {
	// Set drug name
	var name = "rituximab";
	setElements(name[0].toUpperCase() + name.substring(1) + " ", "drug_name_upper");
	setElements(name + " ", "drug_name_lower");

	// Set policy link
	var href = "https://hospitalpolicies.ellucid.com/documents/view/1771";
	setElementsHref(href, "policy_link");

	// Display summary of protocol
	var protocol_summ = ": Initial rate 0.5 mg/kg/hour for the first 30 minutes. May increase by 0.5 mg/kg/hour (max 50 mg/hour) every 30 minutes to a maximum of 400 mg/hour";
	document.getElementById("protcol_summary").innerHTML = protocol_summ;

	// Set infusion parameters
	dose_u = "mg";
	dose_perkg_u_el.innerHTML = dose_u + "/kg";
	dose_total_u_el.innerHTML = dose_u;
	warning_max = NaN;
	conc = 1;
	conc_el.value = conc;
	conc_u_el.innerHTML = "mg/mL";
	max_rate = 400;
	max_rate_perkg = NaN;
	step_time = 30;
	step_rate = 0.5;
	step_rate_max = 50;
	i_final = NaN;		// Cannot calculate if weight is unknown

	// Reset dose
	if(last_drug != name) {
		dose_perkg_el.value = "";
		dose_total_el.value = "";
	}
	last_drug = name;

	// Set active header
	for(var i = 0; i < headers.length; i++) {
		headers[i].className = "";
	}
	header_ritux_first_el.className = "active";

	refresh("none");
}

function rituximab_subsequent() {
	// Set drug name
	var name = "rituximab";
	setElements(name[0].toUpperCase() + name.substring(1) + " ", "drug_name_upper");
	setElements(name + " ", "drug_name_lower");

	// Set policy link
	var href = "https://hospitalpolicies.ellucid.com/documents/view/1771";
	setElementsHref(href, "policy_link");

	// Display summary of protocol
	var protocol_summ = ": Initial rate 1 mg/kg/hour for the first 30 minutes. May increase by 1 mg/kg/hour every 30 minutes to a maximum of 400 mg/hour";
	document.getElementById("protcol_summary").innerHTML = protocol_summ;

	// Set infusion parameters
	dose_u = "mg";
	dose_perkg_u_el.innerHTML = dose_u + "/kg";
	dose_total_u_el.innerHTML = dose_u;
	warning_max = NaN;
	conc = 1;
	conc_el.value = conc;
	conc_u_el.innerHTML = "mg/mL";
	max_rate = 400;
	max_rate_perkg = NaN;
	step_time = 30;
	step_rate = 1;
	step_rate_max = NaN;
	i_final = NaN;		// Cannot calculate if weight is unknown

	// Reset dose
	if(last_drug != name) {
		dose_perkg_el.value = "";
		dose_total_el.value = "";
	}
	last_drug = name;

	// Set active header
	for(var i = 0; i < headers.length; i++) {
		headers[i].className = "";
	}
	header_ritux_subsequent_el.className = "active";

	refresh("none");
}

function refresh(listener) {
	if(listener == "dose_perkg") {
		last_dose_listener = "dose_perkg";
	} else if(listener == "dose_total") {
		last_dose_listener = "dose_total";
	}

	// Get updated values
	validate(wt_el.id);
	wt = parseFloat(wt_el.value);
	validate(dose_perkg_el.id);
	dose_perkg = parseFloat(dose_perkg_el.value);
	validate(dose_total_el.id);
	dose_total = parseFloat(dose_total_el.value);
	validate(conc_el.id);
	conc = parseFloat(conc_el.value);

	// Reset output table and add header row
	output_el.innerHTML = '<tr><th>Time range (h:mm)</th><th class="out_stime">Start time</th><th class="out_etime">End time</th><th>Infusion rate (mL/hr)</th><th>Volume to be infused (mL)</th></tr>';

	// If weight is valid, calculate the infusion rates
	if(!isNaN(wt) && wt != "" && wt > 0) {
		// Calculate maximum rate of the infusion, if set in units per kg
		if(!isNaN(max_rate_perkg)) {
			max_rate = max_rate_perkg * wt;
		// Calculate number of steps in uptitration if dependent on weight
		} else {
			i_final = Math.floor(max_rate/min_valid(step_rate * wt, step_rate_max));
		}

		// Calculate the total infusion dose
		if(last_dose_listener == "dose_perkg" && !isNaN(dose_perkg)) {
			dose_total = round(dose_perkg * wt,1);
			dose_total_el.value = dose_total;
		}

		// Calculate the infusion dose per kg
		if(last_dose_listener == "dose_total" && !isNaN(dose_total)) {
			dose_perkg = round(dose_total / wt,2);
			dose_perkg_el.value = dose_perkg;
		}

		// Calculate the total infusion duration
		if((!isNaN(conc) && conc != "" && conc > 0) && (!isNaN(dose_perkg) && dose_perkg != "" && dose_perkg > 0)) {
			var dose_infused = 0;
			dose_total_el.innerHTML = round(dose_perkg * wt, 2) + " " + dose_u;

			var i = 0;
			var rate = NaN;
			var vol = NaN;
			var start = '';
			var end = '0:00';
			while(i < i_final && round(dose_infused, 2) < round(dose_perkg * wt, 2)) {
				rate = round(min_valid(step_rate * wt, step_rate_max) * (i+1), 1);
				vol = NaN;
				start = end;
				end = '';

				// If the current time frame does not achieve the desired total dose
				if(round(dose_infused + rate * conc / (60/step_time), 2) < round(dose_perkg * wt, 2)) {
					vol = round(rate / (60/step_time), 1);
					dose_infused = round(dose_infused + rate * conc / (60/step_time), 2);
					end = start.split(":");
					end = (parseInt(end[0]) + Math.floor((parseInt(end[1]) + step_time) / 60)) + ":" + ((((parseInt(end[1]) + step_time) % 60) + "").length == 2 ? ((parseInt(end[1]) + step_time) % 60) : "0" + ((parseInt(end[1]) + step_time) % 60));

				// If the current time frame achieves the desired total dose
				} else {
					vol = round((dose_perkg * wt - dose_infused) / conc, 1);

					// Time left (unit: hours) at max rate of infusion
					var time_left = i * (step_time/60) + vol / rate;
					// Minutes left
					var min_left = Math.round((time_left - Math.floor(time_left)) * 60);
					end = (Math.floor(time_left)) + ":" + ((min_left + "").length == 2 ? min_left : "0" + min_left);

					dose_infused = round(dose_perkg * wt, 2);
				}

				// Append row to output table
				output_el.innerHTML += '<tr><td>' + start + '&ndash;' + end + '</td><td class="out_stime">:</td><td class="out_etime">:</td><td>' + rate + '</td><td>' + vol + '</td></tr>';

				i++;
			}

			// If the total desired dose has not yet been infused
			if(round(dose_infused, 2) < round(dose_perkg * wt, 2)) {
				var rate = round(max_rate, 1);

				// Time left (unit: hours) at max rate of infusion
				var time_left = (dose_perkg * wt - dose_infused) / (conc * max_rate);
				if(time_left > 0) {
					// Minutes left
					var min_left = Math.round((time_left - Math.floor(time_left)) * 60);
					start = end;
					end = (Math.floor(time_left) + Math.floor((step_time * i_final)/60)) + ":" + ((min_left + "").length == 2 ? min_left : "0" + min_left);
					vol = round(time_left * max_rate, 1);
				} else {
					start = end;
					end = "completion";
					vol = "0";
				}

				// Append row to output table
				output_el.innerHTML += '<tr><td>' + start + '&ndash;' + end + '</td><td class="out_stime">:</td><td class="out_etime">:</td><td>' + rate + '</td><td>' + vol + '</td></tr>';
			}
		// If total infusion duration cannot be calculated (concentration and dose are not defined)
		} else {
			var rate = NaN;
			var vol = NaN;
			var start = '';
			var end = '0:00';
			for(var i = 0; i < i_final; i++) {
				rate = round(min_valid(step_rate * wt, step_rate_max) * (i+1), 1);
				vol = round(rate / (60/step_time), 1);
				start = end;
				end = start.split(":");
				end = (parseInt(end[0]) + Math.floor((parseInt(end[1]) + step_time) / 60)) + ":" + ((((parseInt(end[1]) + step_time) % 60) + "").length == 2 ? ((parseInt(end[1]) + step_time) % 60) : "0" + ((parseInt(end[1]) + step_time) % 60));

				// Append row to output table
				output_el.innerHTML += '<tr><td>' + start + '&ndash;' + end + '</td><td class="out_stime">:</td><td class="out_etime">:</td><td>' + rate + '</td><td>' + vol + '</td></tr>';
			}

			rate = round(max_rate, 1);
			vol = "";
			start = end;
			end = "completion";

			// Append row to output table
			output_el.innerHTML += '<tr><td>' + start + '&ndash;' + end + '</td><td class="out_stime">:</td><td class="out_etime">:</td><td>' + rate + '</td><td>' + vol + '</td></tr>';
		}

		// Calculate premedication doses
		premed_acetaminophen_el.innerHTML = " = " + Math.min(round(15 * wt, 1), 1000) + " mg";
		premed_diphenhydramine_el.innerHTML = " = " + Math.min(round(1.25 * wt, 1), 50) + " mg";
		premed_methylpred_el.innerHTML = " = " + Math.min(round(2 * wt, 1), 40) + " mg";

	// If weight is not valid, reset premedication doses
	} else {
		premed_acetaminophen_el.innerHTML = "";
		premed_diphenhydramine_el.innerHTML = "";
		premed_methylpred_el.innerHTML = "";
	}

	// Display a warning if the total dose is above the recommended maximum (as long as a max dose is defined)
	dose_warning_el.innerHTML = "";
	if(!isNaN(warning_max)) {
		if(dose_perkg * wt > warning_max) {
			dose_warning_el.innerHTML = "WARNING: the dose of " + round(dose_perkg * wt, 1) + dose_u + " is " + round(dose_perkg * wt - warning_max, 1) + dose_u + " above the recommended maximum of " + warning_max + dose_u;
			dose_warning_row_el.style.display = "";
		} else {
			dose_warning_row_el.style.display = "none";
		}	
	}

	// If there aren't any rows (except the header), print an empty table
	if(output_el.rows.length < 2) {
		// Reset the table to just the header
		output_el.innerHTML = '<tr><th>Time range (h:mm)</th><th class="out_stime">Start time</th><th class="out_etime">End time</th><th>Infusion rate (mL/hr)</th><th>Volume to be infused (mL)</th></tr>';

		// If i_final is not able to be calculated, create 8 rows
		var nrows = 8;
		if(!isNaN(i_final)) {
			nrows = i_final;
		}

		var start = '';
		var end = '0:00';
		for(var i = 0; i < nrows; i++) {
			if(!isNaN(step_time)) {
				start = end;
				end = start.split(":");
				end = (parseInt(end[0]) + Math.floor((parseInt(end[1]) + step_time) / 60)) + ":" + ((((parseInt(end[1]) + step_time) % 60) + "").length == 2 ? ((parseInt(end[1]) + step_time) % 60) : "0" + ((parseInt(end[1]) + step_time) % 60));
			} else {
				start = '';
				end = start;
			}
			output_el.innerHTML += '<tr><td>' + start + '&ndash;' + end + '</td><td class="out_stime">:</td><td class="out_etime">:</td><td></td><td></td></tr>';
		}
	}
}
