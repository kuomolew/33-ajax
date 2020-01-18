$( () => {
    $('#film-list').empty();
    let favoriteFilms = [];
    if (window.localStorage.getItem('favoriteFilms')) {
        favoriteFilms = JSON.parse(window.localStorage.getItem('favoriteFilms'));
    } else {
        let li = document.createElement('li');
        li.innerHTML = 'Movie not found!';
        $('#film-list').append(li);
    }
    for (film of favoriteFilms) {
        request(film);
    }
    

});

let request = function(imdbID) {
    let  API = `https://www.omdbapi.com/?apikey=493a10d1&i=${imdbID}&plot=full`;
    fetch(API)
        .then(response => {
            return response.json();
        })
        .then(data => {
            show(data.Title, data.Response);
        })
        .catch(err => {
            console.log("ERROR:", err.toString())
        });
}

let show = function(film, isResponse) {

    if (isResponse == 'True') {
        let li = document.createElement('li');

        li.innerHTML = film;
        $('#film-list').append(li);
    } else {
        let li = document.createElement('li');
        li.innerHTML = 'Movie not found!';
        $('#film-list').append(li);
    }
}