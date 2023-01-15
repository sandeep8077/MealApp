if (localStorage.getItem('favroiteList') == null) {
    localStorage.setItem('favroiteList', JSON.stringify([]))
}

const searchBtn = document.getElementById('search-btn');
const mealList = document.querySelector('.meal');
const mealDetailsContent = document.querySelector('.recipe-detail-content');

const reciptCloseButton = document.querySelector('.recipe-close-btn');
const inputField = document.getElementById('search-input');








// add event listener
searchBtn.addEventListener('click', getmealList);
mealList.addEventListener('click', getmealRecipe);

reciptCloseButton.addEventListener('click', () => {
    reciptCloseButton.parentElement.classList.remove('show-recipe');
});







// get meal List when its match with the ingrident
function getmealList(e) {
    e.preventDefault();
    let searchInputText = document.querySelector('.search-content').value.trim();



    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${searchInputText}`)
        .then((Response) => {

            return Response.json()
        })
        .then((data) => {
            let html = "";
            if (data.meals) {
                data.meals.forEach(meal => {
                    html += `

                <div class="meal-item" data-id=${meal.idMeal}>
                  <div class="meal-image">
                      <img src="${meal.strMealThumb}" alt="food">
                  </div>
                  <div class="meal-name">
                      <h3>${meal.strMeal}</h3>
                      <div class="fav-btn">
                          <a href="#" class="recipe-btn">Get recipe</a>
                          <i onclick="add(${meal.idMeal})" class="fa-solid fa-heart"></i>

                      </div>

                  </div>
                </div>
                  
                  
                  `
                });

                mealList.classList.remove('notfound');
            } else {
                html += "<h1>Sorry we didnt find any meal!</h1>";
                mealList.classList.add('notfound');
            }
            mealList.innerHTML = html;

        })
        .catch(error => {
            console.log(error);
        })

}



//  for auto suggestion
inputField.addEventListener('input', function demo(event) {
    event.preventDefault();

    let val = event.target.value;

    console.log('val', val);
    if (val == null) {
        return;
    }
    if (val.length >= 1) {
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${val}`)
            .then((Response) => {

                return Response.json()
            })
            .then((data) => {
                let html = "";
                if (data.meals) {
                    data.meals.forEach(meal => {
                        html += `

                <div class="meal-item" data-id=${meal.idMeal}>
                  <div class="meal-image">
                      <img src="${meal.strMealThumb}" alt="food">
                  </div>
                  <div class="meal-name">
                      <h3>${meal.strMeal}</h3>
                      <div class="fav-btn">
                          <a href="#" class="recipe-btn">Get recipe</a>
                          <i onclick="add(${meal.idMeal})" class="fa-solid fa-heart"></i>

                      </div>

                  </div>
                </div>


                  `
                    });

                    mealList.classList.remove('notfound');
                } else {
                    html += "<h1>Sorry we didnt find any meal!</h1>";
                    mealList.classList.add('notfound');
                }
                mealList.innerHTML = html;

            })
            .catch(error => {
                console.log(error);
            })

    }

});




// get meal recipe  details
function getmealRecipe(e) {
    e.preventDefault();
    if (e.target.classList.contains('recipe-btn')) {
        let mealItem = e.target.parentElement.parentElement.parentElement;
        console.log(mealItem.dataset.id)
        fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealItem.dataset.id}`)
            .then(respons => respons.json())
            .then(data => mealRecipeModal(data.meals))
            .catch(err => { console.log(err) })
    }
}


// create modal
function mealRecipeModal(meal) {
    console.log(meal);
    meal = meal[0];
    let html = `   <h2 class="recipe-title">${meal.strMeal}</h2>
    <p class="recipe-categorie">${meal.strCategory}</p>
    <div class="recipe-construct">
        <h3>Instruction:</h3>
        <p>${meal.strInstructions
        }</p>
    </div>
    <div class="recipe-meal-image">
        <img src="${meal.strMealThumb
        }" alt="" style="width: 30%; height:20%;">
    </div>
    <div class="recipe-link">
        <a href="${meal.strYoutube
        }" target="blank">watch video</a>
    </div>`

    mealDetailsContent.innerHTML = html;
    console.log(mealDetailsContent.parentElement);
    mealDetailsContent.parentElement.classList.add('show-recipe')



}





// show fav list
function showfav() {
    let arr = JSON.parse(localStorage.getItem('favroiteList'))
    console.log(arr);

    let html = "";
    if (arr.length == 0) {
        html += `<h1>No item in Fovrite list`
        mealList.classList.add('notfound');
        mealList.innerHTML = html;
    } else {

        for (let index = 0; index < arr.length; index++) {

            fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${arr[index]}`)
                .then((respons) => {
                    return respons.json()
                }).then((data) => {
                    document.getElementById('search-item').innerHTML = `<h2 style="color: var(--mycolor)">Your Favroite Items list</h2>`
                    html += `
                    <div class="meal-item" data-id=${data.meals[0].idMeal}>
                    <div class="meal-image">
                        <img src="${data.meals[0].strMealThumb}" alt="food">
                    </div>
                    <div class="meal-name">
                        <h3>${data.meals[0].strMeal}</h3>
                        <div class="fav-btn">
                            <a href="#" class="recipe-btn">Get recipe</a>
                            <i onclick="add(${data.meals[0].idMeal})" class="fa-solid fa-heart" style="color:var(--mycolor)" ></i>
                 
                        </div>
                 
                    </div>
                  </div>
                    `
                    mealList.innerHTML = html;
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }
}









// add remove to fav list
function add(id) {

    let arr = JSON.parse(localStorage.getItem('favroiteList'))
        // console.log(arr);
    let contains = false;
    for (let index = 0; index < arr.length; index++) {
        if (id == arr[index]) {
            contains = true;
        }
    }
    if (contains) {
        let number = arr.indexOf(id);
        arr.splice(number, 1);
        alert('Meal removed into favroite list');
    } else {
        arr.push(id);
        alert('Meal added into Favroite List')
    }
    localStorage.setItem('favroiteList', JSON.stringify(arr));

}