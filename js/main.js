/**
 * Check if color is too dark for black text.
 * @param {String} color Hex string of a background color.
 * @returns {Boolean} True if background is too dark.
 */
function isItTooDark(color) {
	// I took this from a StackOverflow post
	//
	// https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black

	color = color.substring(1);				// strip #
	const rgb = parseInt(color, 16);	// convert rrggbb to decimal
	const r = (rgb >> 16) & 0xff;			// extract red
	const g = (rgb >>  8) & 0xff;			// extract green
	const b = (rgb >>  0) & 0xff;			// extract blue

	const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709

	if (luma < 128) {
		return true;
	}
}

/**
 * Create a string containing HTML for pinned repo div.
 * @param {Object} repo Repo object from GitHub.
 * @returns {String} HTML for pinned repo div.
 */
function makePinnedRepoDiv(repo) {
	const language = repo.languages.nodes[0];
	return `<div class="column">
	<a class="link dark-link" href="${repo.url}"><h4 class="pinned-repo-title">${repo.name}</h4></a>
	<div class="language-pill" style="background: ${language ? language.color : 'lightgray'};${language && isItTooDark(language.color) ? ' color: white' : ''}"><small>${language ? language.name : '¯\\_(ツ)_/¯'}</small></div>
	<p>${repo.description ? repo.description : '¯\\_(ツ)_/¯'}</p>
</div>`;
}

(async () => {
	try {
		// Fetch pinned repos data from GitHub API via my microservice
		const response = await fetch('https://get-pinned-repos.herokuapp.com/dusansimic');
		// Parse into json
		const { data } = await response.json();
		// Get repos list out of the object
		const repos = data.user.pinnedRepositories.nodes;

		let reposHTML = '';
		// Iterate through repos list
		for (const i in repos) {
			const repo = repos[i];
			// On every third element (including first, index = 0)
			if (i % 3 === 0) {
				// If it's not the first element add closing div tag to close open row div tag
				if (i !== 0) {
					reposHTML += '</div>'
				}
				// If it's not the last element add next openning row div tag
				if (i !== repos.length - 1) {
					reposHTML += '<div class="row">'
				}
			}
			// Append pinned repo div HTML
			reposHTML += makePinnedRepoDiv(repo)
		}
		// Put the whole string into repos div
		document.getElementById('repos').innerHTML = reposHTML;
	} catch (error) {
		console.error(error);
	}
})();