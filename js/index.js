

let appLoadFile = event => {
    var image = document.getElementById('app-output')
    image.src = URL.createObjectURL(event.target.files[0])
}

/**
 * This function merges multiple objects into one.
 * 
 * @name mergify
 * @param {object} main Master object (All other objects merge into this).
 * @param {array} subs Array of objects to merge into `main`.
 * @return {object} Master object (`main`) with `subs` merged.
 */
Object.mergify = (main, ...subs) => {
    for (let obj of subs) for (let attrname in obj) main[attrname] = obj[attrname]
    return main
}

let url = new URL(window.location.href).searchParams

// If local data exists.
if (localStorage.getItem(`dbdata`)) {
    if (url.get(`frame`) !== `banana`) {
        document.getElementById(`popup`).innerHTML = `<a>Are you ${localStorage.getItem(`username`)}?</a><br />${document.getElementById(`popup`).innerHTML}`
        Object.mergify(document.getElementById(`verify`).style, { opacity: 1, pointerEvents: `auto` })
    }
} else location.href = `./login.html`

function verified(id, redir) {
    Object.mergify(document.getElementById(id).style, { opacity: 0, pointerEvents: `none` })
    if (redir) location.href = `./index.html?frame=banana`
}

/**
 * This function returns a rank string from a number.
 * 
 * @name rank
 * @return {string} A stringified number that has the number ordinal and formatting commas.
 */
Number.prototype.rank = function () {
    if (this % 10 === 1 && this != 11) return `${this.toLocaleString()}st`
    else if (this % 10 == 2 && this != 12) return `${this.toLocaleString()}nd`
    else if (this % 10 == 3 && this != 13) return `${this.toLocaleString()}rd`
    else return `${this.toLocaleString()}th`
}

let slideInd = 1

// Logout event.
function logout() {

    // Clear cache.
    localStorage.removeItem(`dbdata`)
    localStorage.removeItem(`dbdata-uncacheable`)
    localStorage.removeItem(`cache-time`)
    localStorage.removeItem(`username`)
    localStorage.removeItem(`weather`)
    localStorage.removeItem(`weather-timer`)
    localStorage.removeItem(`news`)
    localStorage.removeItem(`news-timer`)
    localStorage.removeItem(`apps`)
    location.href = `login.html`
}

// Window onload event.
window.onload = async _ => {
    // Hide map.
    Object.mergify(document.getElementById(`map`).style, { opacity: 0, pointerEvents: `none` })
    Object.mergify(document.getElementById(`map-options`).style, { opacity: 0, pointerEvents: `none` })

    // Hide preloader.
    setTimeout(() => Object.mergify(document.getElementById(`waitload`).style, { opacity: 0, pointerEvents: `none`, transitionDuration: `1s` }), 1000)

    // Get applist.
    let req = await fetch(`https://hacking-with-ht.ml/homebase/apps.json`)
    let body = await req.json()
    localStorage.setItem(`apps`, JSON.stringify(body))

    // Init applist logic.
    functions.list()
}

// Funtions list for ease of usage.
let functions = {

    // Reminder current day + tomorrow day logic.
    reminders: _ => {
        let [month, today, tmw] = [date => [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`][date.getMonth()], new Date(), new Date()]
        tmw.setDate(new Date().getDate() + 1)

        // Update UI.
        document.getElementById(`rem-today`).innerHTML = `TODAY, ${month(today)} ${today.getDate().rank()}`
    },

    // Gmail current day logic.
    gmail: _ => {
        document.getElementsByClassName(`emailDate`)[0].innerHTML = `${[`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`][new Date().getMonth()]} ${new Date().getDate().rank()}`
    },

    // Weather API with local caching.
    weather: force => {
        // Force new call even if other params are not met.
        if (force) update()

        // Get last cache time + currently stored data.
        let [timer, data] = [localStorage.getItem(`weather-timer`), localStorage.getItem(`weather`)]
        if (!timer || !data) update()

        // Time todo.
        if (new Date().getTime() - timer <= 1000 * 60 * 30) update(data)
        else update()

        // New request logic.
        async function update(data, body) {
            // To fetch or not to fetch.
            if (data) body = JSON.parse(data)
            else {
                body = JSON.parse(localStorage.getItem(`dbdata`))
                let req = await fetch(`http://51.81.190.239:5674/weather?d=${body.weather.degree}&l=${encodeURI(body.weather.location)}`)
                body = await req.json()
                localStorage.setItem(`weather`, JSON.stringify(body))
                localStorage.setItem(`weather-timer`, new Date().getTime())
            }

            // Update UI.
            document.getElementsByClassName(`weatherPlace`)[0].innerHTML = body.weather[0].location.name
            document.getElementsByClassName(`weatherDate`)[0].innerHTML = body.weather[0].current.date
            document.getElementsByClassName(`weatherTemperature`)[0].innerHTML = `${body.weather[0].current.temperature}°F`
            document.getElementsByClassName(`weatherCondition`)[0].innerHTML = body.weather[0].current.skytext

            document.getElementsByClassName(`weatherIcon`)[0].innerHTML = `<i class=\"wi wi-yahoo-${body.weather[0].current.imageUrl.match(/\d*.gif/g)[0].replace(/.gif/g, ``)}\"></i>`

            // Month short formatter.
            let [month, date] = [
                index => {
                    return [
                        { month: `January`, short: `Jan` },
                        { month: `February`, short: `Feb` },
                        { month: `March`, short: `Mar` },
                        { month: `April`, short: `Apr` },
                        { month: `May`, short: `May` },
                        { month: `June`, short: `Jun` },
                        { month: `July`, short: `Jul` },
                        { month: `August`, short: `Aug` },
                        { month: `September`, short: `Sep` },
                        { month: `October`, short: `Oct` },
                        { month: `November`, short: `Nov` },
                        { month: `December`, short: `Dec` }
                    ][index - 1]
                },
                body.weather[0].current.date.split(`-`)
            ]

            // Update UI.
            document.getElementsByClassName(`weatherDate`)[0].innerHTML = `${parseInt(date[2]).rank()} ${month(parseInt(date[1])).short}`
        }
    },

    // Contacts widget logic.
    contacts: _ => {
        let [currentSlide, slides, dots] = [0, document.querySelectorAll(`.contacts-container`), document.querySelectorAll(`.dots`)],
            init = n => {
                slides.forEach((slide) => {
                    slide.style.display = `none`
                    dots.forEach(dot => dot.classList.remove(`active`))
                })
                slides[n].style.display = `block`
                dots[n].classList.add(`active`)
            }
        document.addEventListener(`DOMContentLoaded`, init(currentSlide))
        dots.forEach((dots, index) => dots.addEventListener(`click`, _ => { init(index) }))
    },

    // News API with local caching.
    news: (force, articles = []) => {
        // Force new call even if other params are not met.
        if (force) update()

        // Get last cache time + currently stored data.
        let [timer, data] = [localStorage.getItem(`news-timer`), localStorage.getItem(`news`)]
        if (!timer || !data) update()

        // Time todo.
        if (new Date().getTime() - timer <= 1000 * 60 * 30) update(data)
        else update()

        // New request logic.
        async function update(data, body) {
            // To fetch or not to fetch.
            if (data) body = JSON.parse(data)
            else {
                let req = await fetch(`http://51.81.190.239:5674/news?s=google`)
                body = await req.json()
                localStorage.setItem(`news`, JSON.stringify(body))
                localStorage.setItem(`news-timer`, new Date().getTime())
            }

            // Append data.
            for (let query of body) for (let article of query.data) !article.content.startsWith(`<ol>`) ? articles.push(`<div class="news-container">${article.content}</div>`) : null

            // Update UI elements.
            document.getElementById(`articles`).innerHTML = articles.join(``)
            plusSlide(0)
        }
    },

    // App list ranking logic.
    list: async _ => {

        // Get preset app list.
        let [apps, applist] = [JSON.parse(localStorage.getItem(`apps`)), new Array()]

        apps.unshift({ title: `Add App` })

        // Rank apps.
        apps = rankify(apps)

        // Append new app data.
        for (let app of apps) if (app.title === `Add App`) {
            applist.push(`<li id="${app.title}" class="app"><div class="container" onclick="openAppModal()" title="Add custom app"><img src="https://hacking-with-ht.ml/homebase/extras/plus.png" class="image" alt="app" /><div class="overlay"><div class="text"> Add App </div></div></div></li>`)
        } else {
            // console.log(app)
            applist.push(`<li id="${app.title}" class="app"><div class="container" onclick="record('${app.title}', '${app.link}')" title="You have visited this website ${app.hits} ${app.hits === 1 ? `time` : `times`}!"><img src="${app.icon ? app.icon : `https://hacking-with-ht.ml/homebase/icons/${!app.title.includes(` `) ? app.title.toLowerCase() : app.title.split(` `)[0].toLowerCase() + app.title.split(` `).slice(1).join(``)}.png`}" class="image" alt="app" /><div class="overlay"><div class="text"> ${app.title} </div></div></div></li>`)
        }
        document.getElementById(`list`).innerHTML = applist.join(`\n`)

        // document.getElementById(`Add App`).addEventListener(`click`, _ => {
        //     document.getElementsByClassName('continer-popup')[0].style.opacity = 1
        // })

        // Ranking logic.
        function rankify(list) {
            let data = JSON.parse(localStorage.getItem(`dbdata`))
            if (data.applist.length > 0) {
                // Reorder list.
                data.applist.sort((a, b) => b.hits - a.hits)

                // For all with no data, set to 0.
                for (let app of list) {
                    let dbObj = data.applist.find(obj => obj.name === app.title)
                    data.applist = data.applist.filter(obj => obj.name !== app.title)
                    app.hits = dbObj ? dbObj.hits : 0
                }

                for (let app of data.applist) {
                    app.title = app.name
                    list.push(app)
                }

                // Return list.
                list.sort((a, b) => b.hits - a.hits)
                list = list.filter(e => e.title !== `Add App`)
                let custom = list.filter(i => i.custom)
                list = list.filter(i => !i.custom)
                for (let index of custom.sort((a, b) => b.hits - a.hits).reverse()) list.unshift(index)
                list.unshift({ title: `Add App` })
                return list
            } else {
                // If no app clicks, set all to 0.
                list.map(app => app.hits = 0)
                list = list.filter(e => e.title !== `Add App`)
                let custom = list.filter(i => i.custom)
                list = list.filter(i => !i.custom)
                for (let index of custom.sort((a, b) => b.hits - a.hits).reverse()) list.unshift(index)
                list.unshift({ title: `Add App` })
                return list
            }
        }
    },

    // Store/update notes widget.
    notes: _ => {
        let data = JSON.parse(localStorage.getItem(`dbdata-uncacheable`))
        if (data.notes) document.getElementById(`note-information`).innerHTML = data.notes
        else document.getElementById(`note-information`).innerHTML = `<h2>Notes</h2><p>Start Typing Here</p>`
    },

    // Set user's username on index page.
    username: _ => document.getElementById(`profile`).innerHTML = `<em class="fas fa-user-circle"><span> ${localStorage.getItem(`username`)} </span></em>`
}

// Functions init.
functions.reminders()
functions.gmail()
functions.weather()
functions.contacts()
functions.news()
functions.notes()
functions.username()

// Weather icon extra properties.
let weatherIcon = document.getElementsByClassName(`wi`)

if (weatherIcon && weatherIcon[0]) {
    weatherIcon[0].addEventListener(`click`, _ => window.open(`https://www.msn.com/en-us/weather`, `_blank`))
    weatherIcon[0].title = `Click here to see more weather data`
}

// Contacts widget logic.
showSlide(slideInd)

function plusSlide(n) { showSlide(slideInd += n) }

function showSlide(n) {
    let [slide, i] = [document.getElementsByClassName(`news-container`)]
    if (n > slide.length) slideInd = 1
    if (n < 1) slideInd = slide.length
    for (i = 0; i < slide.length; i++) slide[i].style.display = `none`
    if (slide[slideInd - 1]) slide[slideInd - 1].style.display = `block`
}

//edit contacts
var loadFile = function (event) {
    var image = document.getElementById('imgoutput')
    image.src = URL.createObjectURL(event.target.files[0])
}
var loadFile1 = function (event) {
    var image = document.getElementById('imgoutput1')
    image.src = URL.createObjectURL(event.target.files[0])
}
var loadFile2 = function (event) {
    var image = document.getElementById('imgoutput2')
    image.src = URL.createObjectURL(event.target.files[0])
}
var loadFile3 = function (event) {
    var image = document.getElementById('imgoutput3')
    image.src = URL.createObjectURL(event.target.files[0])
}
var loadFile4 = function (event) {
    var image = document.getElementById('imgoutput4')
    image.src = URL.createObjectURL(event.target.files[0])
}

// Applist search logic
function search() {
    let [input, x] = [document.getElementById(`searchbar`).value.toLowerCase(), document.getElementsByClassName(`app`)]
    let filtered = []
    for (let i = 0; i < x.length; i++) {
        if (!x[i].id.toLowerCase().includes(input)) x[i].style.display = `none`
        else {
            x[i].style.display = `block`
            filtered.push(`<option value="${x[i].id}">`)
        }
    }
    document.getElementById(`dropdown`).innerHTML = filtered.join(`\n`)
}

// Record app clicks.
function record(title, link) {
    let data = JSON.parse(localStorage.getItem(`dbdata`))
    // Find app.
    let app = data.applist.find(obj => obj.name === title)
    // If no app data, add new entry.
    if (!app) data.applist.push({ name: title, hits: 1 })
    // Increment.
    else app.hits++

    // Set local cache.
    localStorage.setItem(`dbdata`, JSON.stringify(data))
    window.open(link.startsWith(`http`) ? link : `https://${link}`, `_blank`)

    // Update UI applist.
    functions.list()
}

// Note update event (store to cache).
function noteUpdate() {
    let note = document.getElementById(`note-information`)
    if (note) {
        let data = JSON.parse(localStorage.getItem(`dbdata`))
        data.notes = note.innerHTML.trim() // Trim spaces.
        localStorage.setItem(`dbdata`, JSON.stringify(data))
    }
}

// Update database every 2 minutes (check if new data exists before update to keep API requests low).
setInterval(async _ => {
    let data = JSON.parse(localStorage.getItem(`dbdata`))
    if (JSON.stringify(data) !== localStorage.getItem(`dbdata-uncacheable`)) {
        let copy = data
        delete copy._id
        await fetch(`http://51.81.190.239:5674/dbupdate`, {
            method: `POST`,
            body: JSON.stringify({ s: data.ips[0].query, d: copy }),
            headers: { "Content-Type": `application/json` },
        }).catch(_ => { })
        localStorage.setItem(`dbdata-uncacheable`, JSON.stringify(data))
    }
}, 2 * 60 * 1000)

let mapHide = document.getElementById(`goBack`)

// Hide map logic.
mapHide.onclick = _ => {
    Object.mergify(document.getElementById(`map`).style, { opacity: 0, pointerEvents: `none` })
    Object.mergify(document.getElementById(`map-options`).style, { opacity: 0, pointerEvents: `none` })
}

// Map picker logic.
function enableMap() {
    Object.mergify(document.getElementById(`map`).style, { opacity: 1, pointerEvents: `auto` })
    Object.mergify(document.getElementById(`map-options`).style, { opacity: 1, pointerEvents: `auto` })

    // Get element references
    let [confirmBtn, onClickPositionView, map] = [document.getElementById(`confirmPosition`), document.getElementById(`onClickPositionView`), document.getElementById(`map`)]

    let data = JSON.parse(localStorage.getItem(`dbdata`))

    // Initialize LocationPicker plugin
    var lp = new locationPicker(map, { lat: data.ips[0].lat, lng: data.ips[0].lon }, { zoom: 9 })

    // Listen to button onclick event
    confirmBtn.onclick = async _ => {
        // Get current location and show it in HTML
        var location = lp.getMarkerPosition()
        let req = await fetch(`https://geocode.xyz/${location.lat},${location.lng}?geoit=json`)

        let body = await req.json()

        data.weather.location = `${body.osmtags.name}, ${body.state}, ${body.prov}`
        localStorage.setItem(`dbdata`, JSON.stringify(data))
        Object.mergify(document.getElementById(`map`).style, { opacity: 0, pointerEvents: `none` })
        Object.mergify(document.getElementById(`map-options`).style, { opacity: 0, pointerEvents: `none` })
        functions.weather(true)
    }
}

async function clearCache(approved) {
    if (approved) {
        let data = JSON.parse(localStorage.getItem(`dbdata`))

        let [username, password] = [data.username, data.password]

        // Fetch user database information.
        let req = await fetch(`http://51.81.190.239:5674/dblogin`, {
            method: `POST`,
            body: JSON.stringify({

                // User username.
                username: username,

                // User password.
                password: password
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        let body = await req.json()

        // Delete old cache if any.
        localStorage.removeItem(`dbdata`)
        localStorage.removeItem(`dbdata-uncacheable`)
        localStorage.removeItem(`cache-time`)
        localStorage.removeItem(`username`)
        localStorage.removeItem(`weather`)
        localStorage.removeItem(`weather-timer`)
        localStorage.removeItem(`news`)
        localStorage.removeItem(`news-timer`)
        localStorage.removeItem(`apps`)
        localStorage.removeItem(`googleAuth`)
        localStorage.removeItem(`contacts`)

        // Set new cache.
        localStorage.setItem(`dbdata`, JSON.stringify(body))
        localStorage.setItem(`username`, body.username)
        localStorage.setItem(`dbdata-uncacheable`, JSON.stringify(body))
        localStorage.setItem(`cache-time`, new Date().getTime())
        window.location.reload()
    } else Object.mergify(document.getElementById(`cache-verify`).style, { opacity: 1, pointerEvents: `auto` })
}

if (localStorage.getItem(`googleAuth`)) Object.mergify(document.getElementById(`login`).style, { opacity: 0, pointerEvents: `none` })

document.getElementById(`overlay`).onclick = _ => {
    Object.mergify(document.getElementById(`login`).style, { opacity: 0, pointerEvents: `none` })
    localStorage.setItem(`googleAuth`, `true`)
}

function openAppModal() {
    Object.mergify(document.getElementsByClassName(`container-popup`)[0].style, { opacity: 1, pointerEvents: `auto` })
}

document.getElementById(`add-website`).onclick = _ => {
    let [title, link, icon] = [document.getElementById(`web-title`).value, document.getElementById(`web-link`).value, document.getElementById(`web-icon`).value]
    if (!link.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g) || !icon.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g)) {
        document.getElementsByClassName(`subtitle`)[0].innerHTML = `Invalid URL Found`
        document.getElementsByClassName(`subtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`subtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`subtitle`)[0].style.borderRadius = `5px`
        return
    }

    let data = JSON.parse(localStorage.getItem(`dbdata`))
    data.applist.push({ name: title, link: link, icon: icon, hits: 0, custom: true })
    localStorage.setItem(`dbdata`, JSON.stringify(data))
    Object.mergify(document.getElementsByClassName(`container-popup`)[0].style, { opacity: 0, pointerEvents: `none` })
    functions.list()
}

for (let classes of [`contactName`, `contactNumber`, `contactEmail`]) {
    for (let i = 0; i < document.getElementsByClassName(classes).length; i++) {
        document.getElementsByClassName(classes)[i].readOnly = true
    }
}
let contactsData = JSON.parse(localStorage.getItem(`contacts`))
if (contactsData) {
    for (let classes of [`contactName`, `contactNumber`, `contactEmail`]) {
        for (let i = 0; i < document.getElementsByClassName(classes).length; i++) {
            document.getElementsByClassName(classes)[i].value = contactsData[i][classes]
        }
    }
}
let contactEditable = false
document.getElementsByClassName(`contactEdit`)[0].onclick = _ => {
    contactEditable = !contactEditable
    if (contactEditable) {
        document.getElementsByClassName(`contactEdit`)[0].innerHTML = `Save`
        for (let classes of [`contactName`, `contactNumber`, `contactEmail`]) for (let i = 0; i < document.getElementsByClassName(classes).length; i++) document.getElementsByClassName(classes)[i].readOnly = false
    } else {
        let contactsObj = {}
        document.getElementsByClassName(`contactEdit`)[0].innerHTML = `Edit Contacts`
        for (let classes of [`contactName`, `contactNumber`, `contactEmail`]) {
            for (let i = 0; i < document.getElementsByClassName(classes).length; i++) {
                document.getElementsByClassName(classes)[i].readOnly = true
                let exist = contactsObj[i]
                if (!exist) contactsObj[i] = {}
                contactsObj[i][classes] = document.getElementsByClassName(classes)[i].value
            }
        }
        localStorage.setItem(`contacts`, JSON.stringify(contactsObj))
    }
}

document.getElementsByClassName(`fa-times`)[0].onclick = _ => Object.mergify(document.getElementsByClassName(`container-popup`)[0].style, { opacity: 0, pointerEvents: `none` })

// This is protected code, see https://kura.gq?to=share for more information.
