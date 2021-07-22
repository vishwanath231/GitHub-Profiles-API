
// API URL
const APIURL = 'https://api.github.com/users/';

// TWITTER URL
const TWITTER__URL = 'https://twitter.com/';


const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");



form.addEventListener("submit", (e) => {

    e.preventDefault();

    const user = search.value;

    if (user) {

        getUser(user)
    

        search.value = '';
    }

})


async function getUser(username){

    try {
        const { data } = await axios(APIURL+username)
    
        createUserCard(data);
        getRepos(username);
        twitter(data);


    } catch (err) {
        if (err.response.status == 404) {
            createErrorMsg("No profile with this username");
        }
    }
}


function createUserCard(user){

    const cartHTML = `
    <div class="box__container" >
        <div class="info__container">
            <div class="avatar">
                <img src="${user.avatar_url}" alt="${user.name}">
            </div>
            <div class="info">
                <div class="name">${user.name}</div>
                <div class="bio">${user.bio}</div>
                <div class="follow">
                    <ul>
                        <li>${user.followers} Followers</li>
                        <li>${user.following} Following</li>
                        <li>${user.public_repos} Repos</li>
                    </ul>
                </div>

                <div id="repos"></div>
                <div id="twitter"></div>


            </div>
        </div>
    </div>
    `;

    main.innerHTML = cartHTML;

}


async function getRepos(username){

    try {
        const { data } = await axios(APIURL + username + '/repos?sort=created')
        addReposToCard(data);

    } catch (err) {
        createErrorMsg("Problem fetching repos");
    }

}


function addReposToCard(repos) {

    const reposEl = document.getElementById("repos");

    repos
    .slice(0,5)
    .forEach(repo => {

        const repoEl = document.createElement('a');
        repoEl.classList.add('link')
        repoEl.href = repo.html_url
        repoEl.target = '_blank'
        repoEl.innerHTML = repo.name

        reposEl.appendChild(repoEl);

    })
}

function twitter(user) {

    const twitterEl = document.getElementById("twitter");

    const twit = `
        <a href="${TWITTER__URL + user.twitter_username}" target="_blank" class="twitter">
            <img src="icon/twitter.gif" alt="">
            <span>${user.twitter_username}</span>
        </a>
    `;

    twitterEl.innerHTML = twit;

}


function createErrorMsg(msg) {

    const cardHTML = `
        <div class="err">${msg}</div>
    `

    main.innerHTML = cardHTML
}



