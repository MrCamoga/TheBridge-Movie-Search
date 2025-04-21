const form = document.getElementById("searchform");
const APITOKEN =
	"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YmE1ZTRlNDE2MGIyNjk1ODVlNGYyYjYyMDc4NGQzZiIsIm5iZiI6MTc0NTI2NTY1Mi45MTM5OTk4LCJzdWIiOiI2ODA2YTNmNDNmODg4NTRjNDllZTdlNmMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.jB6w4eByNXviyitBIgXS5VVu335iDROeKd0dE38v8Hg";
const config = {headers: {Authorization: `Bearer ${APITOKEN}`}};

form.addEventListener("submit", submitForm)

let genres;

async function submitForm(event) {
	event.preventDefault();
	const query = this.movie.value;
	const movieContainer = document.getElementById("movie-container");
	movieContainer.innerHTML = ""; // reset container

	genres = genres ?? (await getGenres());
	const movies = await queryMovies(query);

	movies.forEach((movie) => {
		const { title, overview, poster_path, genre_ids } = movie;
		movieContainer.innerHTML += movieCardTemplate(
			title,
			overview,
			poster_path,
			genre_ids.map((id) => genres[id])
		);
	});
}

async function queryMovies(query) {
	try {
		const movies = await axios.get(`https://api.themoviedb.org/3/search/movie?query=${query}`, config);
		return movies.data.results;
	} catch (error) {
		console.error(error);
	}
}

async function getGenres() {
    try {
        const response = await axios.get(`https://api.themoviedb.org/3/genre/movie/list?language=en`, config);
        return Object.fromEntries(response.data.genres.map(genre => [+genre.id, genre.name]))
    } catch(error) {
        console.error(error);
    }
}

function movieCardTemplate(title, descr, img, genres) {
    return `
    <div class="movie-card">
        <img src="https://image.tmdb.org/t/p/original${img}" alt="movie cover">
        <div>
            <div class="movie-info">
                <h2>${title}</h2>
                <p>${descr}</p>
            </div>
            <div class="movie-genre-container">
                ${genres.map((genre) => `<a href="#" class="movie-genre">${genre}</a>`).join("")}
            </div>
        </div>
    </div>`;
}