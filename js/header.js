function header(level = 0) {
	if(level == 0) {
		dir = '';
	} else if(level == -1) {
		dir = '../';
	}

	document.write('<header>');
	document.write('<ul class="menu">');
	document.write('	<li class="noclick" id="header_home">Infusion Calculator</li>');
	document.write('	<li id="header_ivig" onclick="ivig();">IVIG</li>');
	document.write('	<li id="header_ritux_first" onclick="rituximab_first();">Rituximab (first infusion)</li>');
	document.write('	<li id="header_ritux_subsequent" onclick="rituximab_subsequent();">Rituximab (subsequent infusion)</li>');
	document.write('	<li style="float:right;" onclick="window.print();">Print</li>');
	document.write('</ul>');
	document.write('</header>');
}