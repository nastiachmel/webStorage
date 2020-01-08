getData = (url)=> {
  return  fetch(url).then(function(result){
    return result.json();
  });

}


search=()=>{
  let valSelect=document.getElementsByName('movie')[0].value;
  let valName=document.getElementsByClassName('form__name-film')[0].value;  
    getData('https://www.omdbapi.com/?s="'+valName+'"&type="'+valSelect+'"&page=1&apikey=c557ed72').then(function(result){
      console.log(result.totalResults);
      console.log(result);
      if(result.Response=='True'){
        let list= ``;             
        for (let el of result.Search){
          list+=`<div class="film" >`;           
          list += `<div class="film__poster" style="background-image:url(${el.Poster})"></div>`;
          list += `<div class="film__title " >${el.Title}</div>`;
          list += `<button class="btn " onclick='details(this)' value='${el.imdbID}'>DETAILS</button>`;
          list += `</div>`;            
        }
      
        list += `<div class="film film--empty"></div>`;
        list += `<div class="film film--empty"></div>`;  
        if(result.totalResults>10){
          document.querySelector('.film-page').innerHTML='';
          let newResult= result.totalResults/10+1;
          for(let i = 1; i < newResult; i++){
            let btnPage= ``;
            btnPage+=`<button class="btn btn--page" onclick='pg(this)' value='${i}' >${i}</button>`;
            document.querySelector('.film-page').innerHTML += btnPage;
          }
        }  
        document.getElementsByClassName('film-list')[0].innerHTML = list;        
      }else if(result.Response=='False'){
        alert('Movie not found!.');
      }
    })
}

pg=(elem)=>{
  let valSelect=document.getElementsByName('movie')[0].value;
  let valName=document.getElementsByClassName('form__name-film')[0].value;   

  console.log(elem.value);
  getData('https://www.omdbapi.com/?s="'+valName+'"&type="'+valSelect+'"&page='+elem.value+'&apikey=c557ed72').then(function(result){
    
    if(result.Response=='True'){
      let list= ``;                
      for (let el of result.Search){
        list+=`<div class="film" >`;         
        if(el.Poster=='N/A'){
          // console.log('gfsdgfs');
          el.Poster='./no_img.png';
        }
        list += `<div class="film__poster" style="background-image:url(${el.Poster})"></div>`;
        list += `<div class="film__title " >${el.Title}</div>`;            
        list += `<button id="detail" class="btn detail" onclick='details(this)' value='${el.imdbID}'>DETAILS</button>`;
        list += `</div>`;           
      }
      list += `<div class="film film--empty"></div>`;
      list += `<div class="film film--empty"></div>`; 
      document.getElementsByClassName('film-list')[0].innerHTML = list;
      document.getElementsByClassName('film-list')[0].scrollIntoView({block: "start", behavior: "smooth"});         
    }      
  })
}


let info=[];
details=(elem)=>{  
  console.log(elem.value);
  let val=elem.value;
  localStorage.setItem('details',JSON.stringify(elem.value));
  let   i = JSON.parse(localStorage.getItem('details'));
  info.push(i);
  localStorage.setItem('details',JSON.stringify( info));
// console.log(info);

  //---//
  
  document.querySelector('.modal ').style.display='block';
  getData('https://www.omdbapi.com/?i='+val+'&apikey=c557ed72').then(function(result){
    let list= ``;
    console.log(result);
    list+= `<div class="info"> `;
    list += `<div class="info__title">${result.Title}</div>`;
    list += `<div class="info__released">Released: ${result.Released}</div>`;
    list += `<div class="info__runtime">Runtime: ${result.Runtime}</div>`;
    list += `<div class="info__genre">Genre: ${result.Genre}</div>`;
    list += `<div class="info__director">Director: ${result.Director}</div>`;
    list += `<div class="info__actors">Actors: ${result.Actors}</div>`;
    list += `<div class="info__plot">Plot: ${result.Plot}</div>`;
    list+=`</div>`;
 
    document.getElementsByClassName('modal__content')[0].innerHTML += list;
  })

}

favoriteFilm=()=>{ 
  document.querySelector('.modal--favorite ').style.display='block';
  let newInfo=JSON.parse(localStorage.getItem('details'));
  //  console.log(newInfo);
  let newList =``;
 
  newList+=` <button class=" btn btn--close btn--fix" onclick="closeFavorite()">&times;</button>`;
  document.getElementsByClassName('favorite-film')[0].innerHTML = newList;
  let unique = [...new Set(newInfo)];
// console.log(unique); 
  for(let j=0;j<unique.length;j++){
    getData('https://www.omdbapi.com/?i='+unique[j]+'&apikey=c557ed72').then(function(result){
  
      let list= ``;
      console.log(result);     
      list+= `<div class="info info--fix"> `;  
      list += `<div class="info__title">${result.Title}</div>`;
      list += `<div class="info__released">Released: ${result.Released}</div>`;
      list += `<div class="info__runtime">Runtime: ${result.Runtime}</div>`;
      list += `<div class="info__genre">Genre: ${result.Genre}</div>`;
      list += `<div class="info__director">Director: ${result.Director}</div>`;
      list += `<div class="info__actors">Actors: ${result.Actors}</div>`;
      list+=`</div>`;
       
     
     // document.getElementById('film-info').innerHTML = list;
      document.getElementsByClassName('favorite-film')[0].innerHTML += list;

    })}
}


closeFavorite=()=>{
  document.querySelector('.modal--favorite ').style.display='none';
  document.querySelector('.favorite-film ').innerHTML='';
}

document.getElementsByClassName('btn--close')[0].onclick=function(event){
  document.getElementsByClassName('modal')[0].style.display = "none";
  document.querySelector('.modal__content ').innerHTML='';
}

window.onclick = function(event) {
  if (event.target == document.getElementsByClassName('modal')[0]) {
    document.getElementsByClassName('modal')[0].style.display = "none";
    document.querySelector('.modal__content ').innerHTML='';
  }
}