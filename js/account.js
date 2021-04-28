// Get database data.
let [data, obj, objA, emailGrey, appGrey] = [JSON.parse(localStorage.getItem(`dbdata`)), {}, {}, true, true]

// If no data, redirect to login with callback page.
if (!data) location.href = `./login.html?redir=account`

// Post user UID.
document.getElementById(`uid`).innerHTML = `UID: ${data.userid}`

// Email list init.
for (let i = 0; i < data.family.length; i++) obj[i] = data.family[i]
emailList(obj, emailGrey)

// Applist init.
let custom = data.applist.filter(i => i.custom)
for (let i = 0; i < custom.length; i++) objA[i] = custom[i]
appList(objA, appGrey)

function emailList(list, grey) {
    document.getElementById(`email-list`).innerHTML = ``
    let keys = Object.keys(list)
    for (let key of keys) document.getElementById(`email-list`).innerHTML += `<div class="family-email"><input ${grey ? `readOnly="true"` : ``} type="email" id="input-email" onkeyup="updateE('${key}')" class="form-control form-control-alternative family-email-box" placeholder="example@home-base.gq" value="${list[key]}" style="width: 90%; display: inline"><a class="btn btn-info cross-grey ${grey ? `grey` : ``}" onclick="remList('${key}')" style="margin-left: 10px;"> X </a></div>`
}

function appList(list, grey) {
    document.getElementById(`app-list`).innerHTML = ``
    let keys = Object.keys(list)
    for (let key of keys) document.getElementById(`app-list`).innerHTML += `
            <div class="app-item">
                <input ${grey ? `readOnly="true"` : ``} type="text" id="input-app-name" onkeyup="updateA('${key}', 'name')" class="form-control form-control-alternative app-input-box-name" placeholder="Google" value="${list[key].name}" style="width: 90%; display: inline; width: 30%; margin-right: 10px;">
                <input ${grey ? `readOnly="true"` : ``} type="link" id="input-app-link" onkeyup="updateA('${key}', 'link')" class="form-control form-control-alternative app-input-box-link" placeholder="google.com" value="${list[key].link}" style="width: 90%; display: inline; width: 30%; margin-right: 10px;">
                <input ${grey ? `readOnly="true"` : ``} type="text" id="input-app-icon" onkeyup="updateA('${key}', 'icon')" class="form-control form-control-alternative app-input-box-icon" placeholder="https://google.com/icon.png" value="${list[key].icon}" style="width: 90%; display: inline; width: 30%; margin-right: 10px;">
                <a class="btn btn-info cross-grey-a ${grey ? `grey` : ``}" onclick="remListA('${key}')" style="margin-left: 10px;"> X </a>
            </div>`
}

function remList(id) {
    if (emailGrey) return
    delete obj[id]
    let [array, newObj] = [new Array(), {}]
    Object.keys(obj).forEach(key => array.push(obj[key]))
    for (let i = 0; i < array.length; i++) newObj[i] = array[i]
    obj = newObj
    emailList(obj, emailGrey)
}

function remListA(id) {
    if (appGrey) return
    data.applist = data.applist.filter(i => i.name !== objA[id].name)
    delete objA[id]
    let [array, newObj] = [new Array(), {}]
    Object.keys(objA).forEach(key => array.push(objA[key]))
    for (let i = 0; i < array.length; i++) newObj[i] = array[i]
    objA = newObj
    appList(objA, appGrey)
}

function updateE(id) { obj[id] = document.getElementsByClassName(`family-email-box`)[id].value }

function updateA(id, type) { objA[id][type] = document.getElementsByClassName(`app-input-box-${type}`)[id].value }

// Set element ids/values.
let [userData, elements] = [
    [
        data.username,
        data.email,
        data.nickname ? data.nickname.split(` `)[0] : ``,
        data.nickname ? data.nickname.split(` `)[1] : ``,
        data.weather.degree,
        data.weather.location.split(`, `)[1],
        data.weather.location.split(`, `)[0],
        data.weather.location.split(`, `)[2],
    ],
    [
        document.getElementById(`input-username`),
        document.getElementById(`input-email`),
        document.getElementById(`input-first-name`),
        document.getElementById(`input-last-name`),
        document.getElementById(`input-degree`),
        document.getElementById(`input-region`),
        document.getElementById(`input-city`)
    ]
]

// Set element values.
for (let i = 0; i < elements.length; i++) elements[i].value = userData[i]

// Set element to read only
for (let element of elements) element.readOnly = !element.readOnly

// Make elements readable.
function editable() {
    for (let element of elements) element.readOnly = false
    document.getElementsByClassName(`save`)[0].classList.remove(`hidden`)
    document.getElementById(`input-degree`).removeAttribute(`disabled`)
}

function editableE() {
    emailGrey = false
    let elements = document.getElementsByClassName(`family-email-box`)
    for (let i = 0; i < elements.length; i++) {
        elements[i].readOnly = false
    }
    elements = document.getElementsByClassName(`cross-grey`)
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = 1
        elements[i].style.pointerEvents = `auto`
    }
    document.getElementsByClassName(`family-add`)[0].style.opacity = 1
    document.getElementsByClassName(`family-add`)[0].style.pointerEvents = `auto`
    document.getElementsByClassName(`saveE`)[0].classList.remove(`hidden`)
}


function editableA() {
    appGrey = false
    for (let id of [`name`, `link`, `icon`]) {
        let elements = document.getElementsByClassName(`app-input-box-${id}`)
        for (let i = 0; i < elements.length; i++) {
            elements[i].readOnly = false
        }
    }
    let elements = document.getElementsByClassName(`cross-grey-a`)
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = 1
        elements[i].style.pointerEvents = `auto`
    }
    document.getElementsByClassName(`app-add`)[0].style.opacity = 1
    document.getElementsByClassName(`app-add`)[0].style.pointerEvents = `auto`
    document.getElementsByClassName(`saveA`)[0].classList.remove(`hidden`)
}

function combineE() {
    let fail = validate()
    if (fail) return
    let [elements, list] = [document.getElementsByClassName(`family-email-box`), new Array()]
    for (let i = 0; i < elements.length; i++) if (elements[i].value) list.push(elements[i].value)
    data.family = list
    emailGrey = true
    elements = document.getElementsByClassName(`family-email-box`)
    for (let i = 0; i < elements.length; i++) {
        elements[i].readOnly = true
    }
    elements = document.getElementsByClassName(`cross-grey`)
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = 0
        elements[i].style.pointerEvents = `none`
    }
    document.getElementsByClassName(`family-add`)[0].style.opacity = 0
    document.getElementsByClassName(`family-add`)[0].style.pointerEvents = `none`
    document.getElementsByClassName(`saveE`)[0].classList.add(`hidden`)
    let newObj = {}
    for (let i = 0; i < data.family.length; i++) newObj[i] = data.family[i]
    obj = newObj
    emailList(obj, emailGrey)

    update(data)

    function validate() {
        let elements = document.getElementsByClassName(`family-email-box`)
        for (let i = 0; i < elements.length; i++) {
            if (!elements[i].value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g) && elements[i].value !== ``) {
                elements[i].title = `Not a valid email format`
                elements[i].style.background = `#CC1400`
                elements[i].style.color = `var(--white)`
                return true
            } else {
                elements[i].title = ``
                elements[i].style.background = `#FFF`
                elements[i].style.color = `#2d2d31`
            }
        }
    }
}

function combineA() {
    let fail = validate()
    if (fail) return
    let elements = document.getElementsByClassName(`app-input-box-name`)
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].value) {
            let req = data.applist.find(a => a.name === elements[i].value)
            if (!req) data.applist.push({ name: elements[i].value, link: document.getElementsByClassName(`app-input-box-link`)[i].value, icon: document.getElementsByClassName(`app-input-box-icon`)[i].value, hits: 0, custom: true })
            else {
                data.applist = data.applist.filter(a => a.name !== elements[i].value)
                req.name = elements[i].value
                req.link = document.getElementsByClassName(`app-input-box-link`)[i].value
                req.icon = document.getElementsByClassName(`app-input-box-icon`)[i].value
                data.applist.push(req)
            }
        }
    }
    appGrey = true
    for (let id of [`name`, `link`, `icon`]) {
        let elements = document.getElementsByClassName(`app-input-box-${id}`)
        for (let i = 0; i < elements.length; i++) {
            elements[i].readOnly = true
        }
    }
    elements = document.getElementsByClassName(`cross-grey-a`)
    for (let i = 0; i < elements.length; i++) {
        elements[i].style.opacity = 0
        elements[i].style.pointerEvents = `none`
    }
    document.getElementsByClassName(`app-add`)[0].style.opacity = 0
    document.getElementsByClassName(`app-add`)[0].style.pointerEvents = `none`
    document.getElementsByClassName(`saveA`)[0].classList.add(`hidden`)
    let newObj = {}
    let custom = data.applist.filter(i => i.custom)
    for (let i = 0; i < custom.length; i++) newObj[i] = custom[i]
    objA = newObj
    appList(objA, appGrey)

    update(data)

    function validate() {
        for (let id of [`link`, `icon`]) {
            let elements = document.getElementsByClassName(`app-input-box-${id}`)
            for (let i = 0; i < elements.length; i++) {
                if (!elements[i].value.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/g) && elements[i].value !== ``) {
                    elements[i].title = `Not a valid URL`
                    elements[i].style.background = `#CC1400`
                    elements[i].style.color = `var(--white)`
                    return true
                } else {
                    elements[i].title = ``
                    elements[i].style.background = `#FFF`
                    elements[i].style.color = `#2d2d31`
                }
            }
        }
    }
}

// Combine new data and update database.
function combine() {
    document.getElementsByClassName(`save`)[0].classList.add(`hidden`)
    document.getElementById(`input-degree`).setAttribute(`disabled`, `disabled`)
    for (let element of elements) element.readOnly = true
    data.username = elements[0].value
    data.email = elements[1].value
    data.nickname = `${elements[2].value} ${elements[3].value}`
    data.weather.degree = elements[4].value
    data.weather.location = `${elements[6].value}, ${elements[5].value}, ${elements[7].value}`
    update(data)
}

// Update database.
async function update(newdata) {
    // If no changes, return.
    if (localStorage.getItem(`dbdata`) === JSON.stringify(newdata)) return

    // Post changes.
    await fetch(`http://51.81.190.239:5674/dbupdate`, {
        method: `POST`,
        body: JSON.stringify({ s: { e: data.email, u: data.username }, d: newdata }),
        headers: { "Content-Type": `application/json` },
    })

    // Set local data.
    localStorage.setItem(`dbdata`, JSON.stringify(newdata))
    localStorage.setItem(`username`, newdata.username)
}


document.getElementsByClassName(`family-add`)[0].addEventListener(`click`, async _ => {
    let len = Object.keys(obj).length
    obj[len] = ``
    emailList(obj, emailGrey)
})

document.getElementsByClassName(`app-add`)[0].addEventListener(`click`, async _ => {
    let len = Object.keys(objA).length
    objA[len] = { name: ``, link: ``, icon: ``, hits: 0, custom: true }
    appList(objA, appGrey)
})

// This is protected code, see https://kura.gq?to=share for more information.
