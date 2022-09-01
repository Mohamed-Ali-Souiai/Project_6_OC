/* Requests AJAX*/
function loadResults(url, functionUrl) {

  fetch(url).then(function(response) {
      return response.json().then(
        function (data) {
          return functionUrl(data);
        })
  })
  .catch(function(error) {
    console.log(error.message);
  });
}

//Best film request
let bestFilmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score";
let bestFilmUrl;
function bestFilmUrlFunc(result) {
  bestFilmUrl = result.results[0].url;
  console.log('top')
  console.log(result) 
  document.getElementById("bestFilmImage").innerHTML = `<img src=${result["results"][0]["image_url"]} + alt='Best Film Image' height='400' width='300'/>`;
  document.getElementById("bestFilmTitle").innerHTML = result["results"][0]["title"];
  let description = document.getElementById("bestFilmDescription");
  fetch(result["results"][0]["url"])
    .then(response => response.json())
    .then(data => {
      description.innerHTML = data["description"];
    }) 
}
loadResults(bestFilmUrlList, bestFilmUrlFunc);
let btn = document.getElementById("bestFilmBtn");
btn.onclick = function() {
  loadResults(bestFilmUrl, FilmResultsModale);
  modal.style.display = "block";
}

//Modal Results
function FilmResultsModale(result){
    document.getElementById("headerModalImage").innerHTML = "<img src=" + result.image_url + "alt='Best Film Image' />";
    document.getElementById("headerModalTitle").innerHTML = result.original_title;
    document.getElementById("infoModalGenres").innerHTML = result.genres;
    document.getElementById("infoModalDate").innerHTML = result.date_published;
    document.getElementById("infoModalRated").innerHTML = result.rated;
    document.getElementById("infoModalImdbScore").innerHTML = result.imdb_score;
    document.getElementById("infoModalDirectors").innerHTML = result.directors;
    document.getElementById("infoModalActors").innerHTML = result.actors;
    document.getElementById("infoModalDuration").innerHTML = result.duration + ' min';
    document.getElementById("infoModalCountries").innerHTML = result.countries;
    document.getElementById("infoModalIncome").innerHTML = result.worldwide_gross_income + ' $';
    document.getElementById("infoModalDescription").innerHTML = result.long_description;
}

// Modal Window
let modal = document.getElementById("infoModal");
let span = document.getElementsByClassName("modalContentClose")[0];
span.onclick = function() {
  modal.style.display = "none";
}
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

// Categories
function makeCategory(category){
  let genre = '';
  let idSection;
  let FilmUrlList;
  if (category != "Film les mieux notés"){
    genre = category;
    idSection = genre;
    FilmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score&genre=" + genre;
    }else{
      FilmUrlList = "http://localhost:8000/api/v1/titles/?sort_by=-votes,-imdb_score";
      idSection = 'bestFilms'
    }
  let section = document.createElement("section");
  let nav = document.createElement("a");
  const resultsImagesUrl = [];
  const resultsLinksUrl = [];
  const picturesSlides = [];
  const urlList = []
  let nbSlide = 0;
  
  //Make Title and block category
  nav.setAttribute("href", '#'+ idSection);
  nav.textContent = category;   
  document.getElementById("header_nav").appendChild(nav);
  section.setAttribute("class", "category");
  section.setAttribute("id", idSection);
  document.getElementById("bodyPage").appendChild(section);
  let p = document.createElement("p");
  p.setAttribute("class", "CategoryTitle");
  p.setAttribute("id", idSection + 'Title');
  section.appendChild(p);
  let h2 = document.createElement("h2");
  h2.textContent = category; 
  document.getElementById(idSection + 'Title').appendChild(h2);

  //Create slide block and arrows elements 
  let divSlider = document.createElement("div");
  divSlider.setAttribute("id", idSection + "List");
  divSlider.setAttribute("class", "list");
  let spanControlPrev = document.createElement("span");
  let spanControlNext = document.createElement("span");
  spanControlPrev.setAttribute("id", "prev" + idSection);
  spanControlPrev.setAttribute("class", "previous");
  spanControlPrev.textContent = "<";
  spanControlNext.setAttribute("id", "next" + idSection);
  spanControlNext.setAttribute("class", "next");
  spanControlNext.textContent = ">";
  divSlider.appendChild(spanControlPrev);

  //Create and insert slides blocks and preview arrow into slide block  
  for (let i=1; i<6; i++){
    let spanSlide = document.createElement("span");
    spanSlide.setAttribute("id", "slide" + i + idSection);
    spanSlide.setAttribute("class", "category_slide category_slide" + i);
    divSlider.appendChild(spanSlide);
  }
  section.appendChild(divSlider);
  divSlider.appendChild(spanControlNext);

  // List of urls
  for (i=1; i<3; i++){
    urlList.push(FilmUrlList + "&page="+ i);
  }
  getAllUrls(urlList, resultsImagesUrl, resultsLinksUrl, picturesSlides, idSection);
 
  for (let i=1; i<5; i++){
    document.getElementById("slide"+ i + idSection).onclick = function() {
      if (nbSlide + (i-1) !== 7){
        loadResults(resultsLinksUrl[nbSlide + (i-1)], FilmResultsModale);
      modal.style.display = "block";
      } else {
        loadResults(resultsLinksUrl[0], FilmResultsModale);
      modal.style.display = "block";
      } 
    }
  }
  
  document.getElementById("prev" + idSection).onclick = function() {
    nbSlide = changeSlide(-1, nbSlide)
    displayPictureSlide(idSection, picturesSlides, nbSlide);
  }
  document.getElementById("next" + idSection).onclick = function() {
    nbSlide = changeSlide(+1, nbSlide)
    displayPictureSlide(idSection, picturesSlides, nbSlide);
  }
}

//Change slide Category
function changeSlide(direction, nbSlide) {
  nbSlide = nbSlide + direction;
  if (window.matchMedia("(max-width: 1280px)").matches) {
    if (nbSlide < 0) {
      nbSlide = 4;
      }
    if (nbSlide > 4) {
      nbSlide = 0;
      }
    } else {
      if (nbSlide < 0) {
        nbSlide = 3;
        }
      if (nbSlide > 3) {
        nbSlide = 0;
    }
  }
  return nbSlide;
}

// Request category films
async function getAllUrls(urlList, resultsImagesUrl, resultsLinksUrl, picturesSlides, idSection) { 
  try {
      let data = await Promise.all(
        urlList.map(
              url =>
                  fetch(url).then(
                      (response) => response.json()
                  ).then(
                    function (data) {
                      return data;})
                  )
      );
      for (element of data){
        for (let i = 0; i < 5; i++) {
          resultsImagesUrl.push(element.results[i].image_url);  
          resultsLinksUrl.push(element.results[i].url);  
        }
      }
  
      if (resultsImagesUrl.length > 7) {
        for (let i = 0; i < 7; i++) {
          picturesSlides.push("<img src=" + resultsImagesUrl[i] + "alt='Category Film Image/>");
        }
      }
  } catch (error) {
      console.log(error)
      throw (error)
  }
  displayPictureSlide(idSection, picturesSlides, 0);
  
}
// Display category films
function displayPictureSlide(idSection, picturesSlides, nbSlide){
  for (let i=1; i<5; i++){
    if (nbSlide + (i - 1) !== 7){
    document.getElementById("slide"+ i + idSection).innerHTML = picturesSlides[nbSlide + (i - 1)];
    } else {
      document.getElementById("slide"+ i + idSection).innerHTML = picturesSlides[0];
    }
  }
}

// Generate categories
const categories = [
  "Film les mieux notés",
  "Comedy",
  "Action",
  "Animation"
];

for (let category of categories) {
  makeCategory(category);
}
