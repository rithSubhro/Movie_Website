//API KEY
//https://api.themoviedb.org/3/movie/550?api_key=6a46c44a2b36f3b6c206e5f19cafa558

//Movies by genre
//https://api.themoviedb.org/3/discover/movie?api_key=<<api_key>>&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_watch_monetization_types=flatrate


const API_KEY = "6a46c44a2b36f3b6c206e5f19cafa558";
const BASE_URL = "https://api.themoviedb.org/3";
const API_URL = BASE_URL + "/movie/popular?api_key=6a46c44a2b36f3b6c206e5f19cafa558&language=en-US&page=1";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const searchURL = BASE_URL + "/search/movie?api_key="+ API_KEY;

const genres = [
    {
       "id":28,
       "name":"Action"
    },
    {
       "id":12,
       "name":"Adventure"
    },
    {
       "id":16,
       "name":"Animation"
    },
    {
       "id":35,
       "name":"Comedy"
    },
    {
       "id":80,
       "name":"Crime"
    },
    {
       "id":99,
       "name":"Documentary"
    },
    {
       "id":18,
       "name":"Drama"
    },
    {
       "id":10751,
       "name":"Family"
    },
    {
       "id":14,
       "name":"Fantasy"
    },
    {
       "id":36,
       "name":"History"
    },
    {
       "id":27,
       "name":"Horror"
    },
    {
       "id":10402,
       "name":"Music"
    },
    {
       "id":9648,
       "name":"Mystery"
    },
    {
       "id":10749,
       "name":"Romance"
    },
    {
       "id":878,
       "name":"Science Fiction"
    },
    {
       "id":10770,
       "name":"TV Movie"
    },
    {
       "id":53,
       "name":"Thriller"
    },
    {
       "id":10752,
       "name":"War"
    },
    {
       "id":37,
       "name":"Western"
    }
 ]


const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const tagsEl = document.getElementById("tags");

const prev = document.getElementById('prev');
const next = document.getElementById('next');
const current = document.getElementById('current');

var currentPage=1;
var nextPage=1;
var prevPage=1;
var lastUrl='';
var totalPages=1;


const selectedGenre = []


//This function is for selecting the genres in the website, also if the genre is clicked the 2nd time or even no of times, it should get removed from the array
function setGenre(){
    tagsEl.innerHTML = '';      //for deleting everything previously in the tags section
    genres.forEach(genre =>{
        const t= document.createElement('div');
        t.classList.add("tag");
        t.id = genre.id;
        console.log(t.id);
        t.innerText = genre.name;

        //the event listener below, listens to the clicked item and judges weather it is already present in the selectedGenre array, if its not, it is pushed in to the array, and if its present, then a for each loop is initiated to check for the position in which the id we are searching for is present, then it is removed from the array using splice function.
        t.addEventListener('click' , ()=>{
            if(selectedGenre == 0){
                selectedGenre.push(genre.id);
            }else{
                if(selectedGenre.includes(genre.id)){
                    selectedGenre.forEach((id, idx)=>{
                        if(id == genre.id){
                            selectedGenre.splice(idx,1);
                        }
                    })
                }else{
                    selectedGenre.push(genre.id);
                }
            }
            getMovies(BASE_URL+"/discover/movie?api_key="+ API_KEY+"&sort_by=popularity.desc&with_genres="+encodeURI(selectedGenre.join(',')));
            highlightSelection();
        });
       
        tagsEl.appendChild(t);
    })
}

function highlightSelection(){

    const tags= document.querySelectorAll('.tag');
    tags.forEach(tag =>{
        tag.classList.remove('highlight');
    })
    clearBtn();
    if(selectedGenre.length != 0){
        selectedGenre.forEach(id =>{
            const highlightedTag = document.getElementById(id);
            highlightedTag.classList.add("highlight");
        })
    }
}




setGenre();


function clearBtn(){
    let clearBtn= document.getElementById('clear');
    if(clearBtn){
        clearBtn.classList.add('highlight');
    }else{
        let  clear =document.createElement('div');
        clear.classList.add('tag','highlight');
        clear.id = 'clear';
        clear.innerText='Clear x';
        clear.addEventListener('click', ()=>{
            selectedGenre.length = 0;
            setGenre();
            getMovies(API_URL);
        });
        tagsEl.append(clear);
    }

    
}

getMovies(API_URL);
function getMovies(url){
    lastUrl = url;
    fetch(url).then(res => res.json())
    .then(data=>{
        if(data.results != 0){
            showMovies(data.results);
            currentPage=data.page;
            nextPage=currentPage+1;
            prevPage=currentPage-1;
            totalPages=data.total_pages;

            current.innerText = currentPage;
            if(currentPage <= 1){
                prev.classList.add('disabled');
                next.classList.remove('disabled');
            }else if(currentPage>= totalPages){
                next.classList.add('disabled');
            }else{
                prev.classList.remove('disabled');
                next.classList.remove('disabled');
            }
            tagsEl.scrollIntoView({behaviour : 'smooth'});

        }else{
            main.innerHTML='<h1 class="no_results">No Results Found !!</h1>'
        }
        

    }).catch(e => {

        console.log(e);

    })
}



function showMovies(data) {

    main.innerHTML = ``;
    data.forEach(movie => {
        const{title,poster_path, vote_average, overview, id} = movie;
        const movieEl= document.createElement('div');
        movieEl.classList.add("movie");

        //This below code takes the poster from the poster path and adds and adds that to image url and also if the poster path is not found, a404 not found image is posted in place of that
        //The getcolor function is called and according to the vote average the color is given to the rating.
        //Also the overview is added to the class list, extracted in the variable overview.
        movieEl.innerHTML = `
        <img src="${poster_path?IMG_URL + poster_path : "https://previews.123rf.com/images/kaymosk/kaymosk1804/kaymosk180400005/99776312-error-404-page-not-found-error-with-glitch-effect-on-screen-vector-illustration-for-your-design.jpg"}" alt="${title}">


        <div class="movie_info">
            <h1>${title}</h1>
            <span class="${getcolor(vote_average)}">${vote_average}</span>
        </div>

        <div class="overview">
            <h1>Overview</h1>
            ${overview}
            </br>
            <button class="know_more" id="${id}">Know More</button>
        </div>
        `

        main.appendChild(movieEl);

        document.getElementById(id).addEventListener('click',()=>{
            openNav(movie);
        })
    });
}


const overlayContent = document.getElementById('overlay_content');
/* Open when someone clicks on the span element */
function openNav(movie) {
    let id=movie.id;
    fetch(BASE_URL + '/movie/'+ id +'/videos?api_key=' + API_KEY +'&language=en-US').then(res =>res.json()).then(videoData => {
        console.log(videoData);
        if(videoData){
            document.getElementById("myNav").style.width = "100%";
            if(videoData.results.length>0){
                var embed = [];
                var dots = [];
                videoData.results.forEach(video =>{
                    let {name,key,site} = video;
                    if(site == 'YouTube'){
                        embed.push(
                            `<iframe width="560" height="315" src="https://www.youtube.com/embed/${key}" title="${name}" class=
                            "embed hide" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`)
                    }
                })

                overlayContent.innerHTML = embed.join('');
                activeSlide=0;
                showVideos();

            }else{
                overlayContent.innerHTML = '<h1 class="no_results">No Results Found !!</h1>'
            }
        }
    })

  }
  
  /* Close when someone clicks on the "x" symbol inside the overlay */
  function closeNav() {
    document.getElementById("myNav").style.width = "0%";
  }
  var activeSlide = 0;
  var totalVideos=0;
  function showVideos(){
      let embedClasses = document.querySelectorAll('.embed');
      totalVideos = embedClasses.length;
      embedClasses.forEach((embedTag, idx) => {
        if(activeSlide == idx){
            embedTag.classList.add('show');
            embedTag.classList.remove('hide');
        }
        else{
            embedTag.classList.add('hide');
            embedTag.classList.remove('show');
        }
      })
  }

  const leftArrow = document.getElementById('left_arrow');
  const rightArrow = document.getElementById('right_arrow');


  leftArrow.addEventListener('click' , ()=> {
      if(activeSlide>0){
          activeSlide--;
      }
      else{
        activeSlide = totalVideos-1;
      }

      showVideos();
  })

  rightArrow.addEventListener('click' , ()=> {
    if(activeSlide<(totalVideos-1)){
        activeSlide++;
    }
    else{
      activeSlide = 0;
    }

    showVideos();
})
//This function changes the color of the vote according to the given conditions
function getcolor(vote) {
    if(vote>=8){
        return "green";
    }
    else if(vote>=5){
        return "orange";
    }
    else{
        return "red";
    }
  }


  //Below eventlistener is for when the user presses search button in the search bar,
  form.addEventListener('submit' , (e) =>{
      e.preventDefault();

      const searchTerm = search.value;

     selectedGenre.length = 0;
     highlightSelection();
      if(searchTerm){
          getMovies(searchURL + '&query=' + searchTerm);
      }
      else{
        getMovies(API_URL);
      }
  })


  prev.addEventListener('click', ()=>{
    if(prevPage>=0){
        pageCall(prevPage);
    }
  })

  next.addEventListener('click', ()=>{
      if(nextPage<=totalPages){
          pageCall(nextPage);
      }
  })

  function pageCall(page) {
      let urlSplit = lastUrl.split('?');
      let queryParams = urlSplit[1].split('&');
      let key = queryParams[queryParams.length - 1].split('=');
      if(key[0]!='page'){
          let url= lastUrl+ '&page='+ page;
          getMovies(url);
      }else{
          key[1] = page.toString();
          let a= key.join(`=`);
          queryParams[queryParams.length-1]= a;
          let b= queryParams.join('&');
          let url = urlSplit[0]+'?'+b;
          getMovies(url);
      }
  }1
