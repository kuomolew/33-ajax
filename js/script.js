$( () => {
    /**
     * Initial search starting by click on "search" button
     */
    $('#button').on('click', (e) => {
        
        if ($('#input').val() != "") {
            e.preventDefault();
            let title = $('#input').val();
            let page = 1;
            let type = $('#select').val();
            request(title, page, type);
        }
    });

    /**
     * Sending async request to server and working with json
     * @param {string} title - film title
     * @param {number} page - number of the page in film list, by default = 1
     * @param {movie, series or episode} type - type of the film
     */
    let request = function(title, page, type) {
        let  API = `http://www.omdbapi.com/?apikey=493a10d1&s=${title}&page=${page}&type=${type}`;
        fetch(API)
            .then(response => {
                return response.json();
            })
            .then(data => {
                show(data.Search, data.totalResults, data.Response, page);
            })
            .catch(err => {
                console.log("ERROR:", err.toString())
            });
    }

    /**
     * showing the list of 10 films in the current page
     * @param {Array} arr - data array about the film from API
     * @param {number} numberElements - total number of films according to current request
     * @param {True, False} isResponse - response according to API
     * @param {number} page - current page of the list (by default = 1)
     */
    let show = function(arr, numberElements, isResponse, page) {
        $('#film-list').empty();

        if (isResponse == 'True') {
            for (item in arr) {
                let li = document.createElement('li');
                let details = document.createElement('span');
                let toFavorite = document.createElement('span');

                details.innerHTML = 'Details';
                details.classList.add('details');
                details.setAttribute('list-number', item); // set attribute for further details showing

                toFavorite.innerHTML = 'Add'
                toFavorite.classList.add('favorite');
                toFavorite.setAttribute('imdbID', arr[item].imdbID); // set attribute for further details showing

                li.innerHTML = arr[item].Title;
                li.appendChild(details);
                li.appendChild(toFavorite);
                $('#film-list').append(li);
            }
        } else {
            let li = document.createElement('li');
            li.innerHTML = 'Movie not found!';
            $('#film-list').append(li);
        }

        pagination(page, numberElements, isResponse);
        showMore(arr);
        favorite();
    }

    /**
     * Send film to favorite list, save it in local storage
     */
    let favorite = function() {
        $('.favorite').on('click', (e) => {
            let favoriteFilms = [];
            let imdbID = $(e.target).attr('imdbID');
            if (window.localStorage.getItem('favoriteFilms')) {
                favoriteFilms = JSON.parse(window.localStorage.getItem('favoriteFilms'));
            }
            //console.log(`old - ${favoriteFilms}`);

            if (!favoriteFilms.includes(imdbID)) {
                favoriteFilms.push(imdbID);
            }
            //console.log(favoriteFilms);
            window.localStorage.setItem('favoriteFilms', JSON.stringify(favoriteFilms));
        })
    }

    /**
     * Showing additinal info about the film on "Details" button click
     * @param {array} arr -- data array about the film from API
     */
    let showMore = function(arr) {
        $('.details').on('click', (e) => {
            $('#more').empty();
            let listNumber = +$(e.target).attr('list-number');
            let moreHeader = document.createElement('h2');
            let moreInfo = document.createElement('p');

            moreHeader.innerHTML = arr[listNumber].Title;
            $('#more').append(moreHeader);
            if ( arr[listNumber].Poster != 'N/A') {
                let img = document.createElement('img');
                img.src = `${arr[listNumber].Poster}`;
                $('#more').append(img);
            }
            moreInfo.innerHTML = `Year: ${arr[listNumber].Year} <br> imdbID: ${arr[listNumber].imdbID}`;
            $('#more').append(moreInfo);

            // Smooth animation to more info
            let top = $('#more').offset().top;
            $('body,html').animate({scrollTop: top}, 1500);
        });
    }

    /**
     * Implementing of pagination of results
     * @param {number} page - current page
     * @param {number} numberElements - total number of films according to current request
     * @param {true, False} isResponse - response according to API
     */
    let pagination = function(page, numberElements, isResponse) {
        $('#pagination').empty();
        $('#more').empty();
        if (isResponse == "False") {
            return false;
        }
        let pages = Math.ceil(numberElements / 10); //total number of pages
        let n = 3; //amount of +- pages to show in pagination
        let paginationContainer = document.createElement('p');

        for (let i = 1; i<= pages; i++) {
            if (i == 1 && page == 1) {
                paginationContainer.innerHTML = `${i} `;
            } else if (i == 1 && page != 1) {
                paginationContainer.innerHTML = `<span>${i}</span> `;
            } else if (i + n >= page && i - n <= page && i != page) {
                paginationContainer.innerHTML += `<span>${i}</span> `;
            } else if (i + n >= page && i - n <= page && i == page) {
                paginationContainer.innerHTML += `${i} `;
            } else if (i == pages && i != page) {
                paginationContainer.innerHTML += `<span>${i}</span>`;
            } else if (i == pages && i == page) {
                paginationContainer.innerHTML += `${i}`;
            } else if (!paginationContainer.innerHTML.endsWith('... ')) {
                paginationContainer.innerHTML += `... `;
            }
        }
        $('#pagination').append(paginationContainer);

        // Send new request by click on available page number
        $('#pagination span').on('click', (e) => {
            let title = $('#input').val();
            let page = e.target.innerHTML;
            let type = $('#select').val();
            
            request(title, page, type);
        });
    }
});
