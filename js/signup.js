
function showHide(id) { document.getElementById(id).type = document.getElementById(id).type === `password` ? `text` : `password` }

// Username enter key event.
document.getElementById(`username`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-verify`).click() : null)

// Email enter key event.
document.getElementById(`email`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-verify`).click() : null)

// Password enter key event.
document.getElementById(`password`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-verify`).click() : null)

document.getElementById(`account-verify`).addEventListener(`click`, async _ => {
    if (!document.getElementById(`password`).value || !document.getElementById(`username`).value || !document.getElementById(`email`).value) {
        document.getElementsByClassName(`subtitle`)[0].innerHTML = `Make sure all fields are filled out!`
        document.getElementsByClassName(`subtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`subtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`subtitle`)[0].style.borderRadius = `5px`
        // Password requirements.
    } else if (document.getElementById(`password`).value.length < 7) {
        document.getElementsByClassName(`subtitle`)[0].innerHTML = `Password must be at least 7 characters long!`
        document.getElementsByClassName(`subtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`subtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`subtitle`)[0].style.borderRadius = `5px`
        // Email requirements.
    } else if (!document.getElementById(`email`).value.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g)) {
        document.getElementsByClassName(`subtitle`)[0].innerHTML = `Hmm.. That doesn't look like a valid email!`
        document.getElementsByClassName(`subtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`subtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`subtitle`)[0].style.borderRadius = `5px`
    } else {
        document.getElementsByClassName(`container`)[0].style.marginTop = "-50%"
        document.getElementsByClassName(`container`)[0].style.opacity = 0
        document.getElementsByClassName(`container`)[0].style.pointerEvents = `none`
        document.getElementById(`verify`).style.marginTop = "0%"
        document.getElementById(`verify`).style.opacity = 1
        document.getElementById(`verify`).style.pointerEvents = `auto`

        document.getElementById(`verusername`).value = document.getElementById(`username`).value
        document.getElementById(`veremail`).value = document.getElementById(`email`).value
        document.getElementById(`verpassword`).value = document.getElementById(`password`).value
        for (let element of [document.getElementById(`verusername`), document.getElementById(`veremail`), document.getElementById(`verpassword`)]) {
            element.readOnly = true
            element.title = `Go back to edit this field`
        }
    }
})

document.getElementsByClassName(`fa-arrow-circle-left`)[0].addEventListener(`click`, _ => {
    document.getElementsByClassName(`container`)[0].style.marginTop = "0"
    document.getElementsByClassName(`container`)[0].style.opacity = 1
    document.getElementsByClassName(`container`)[0].style.pointerEvents = `auto`
    document.getElementById(`verify`).style.marginTop = "100%"
    document.getElementById(`verify`).style.opacity = 0
    document.getElementById(`verify`).style.pointerEvents = `none`
})

document.getElementById(`location`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-create`).click() : null)
document.getElementById(`firstname`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-create`).click() : null)
document.getElementById(`lastname`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-create`).click() : null)
document.getElementById(`emails`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-create`).click() : null)


// Account create logic.
// Click event.
document.getElementById(`account-create`).addEventListener(`click`, async _ => {
    if (!document.getElementById(`location`).value || !document.getElementById(`firstname`).value || !document.getElementById(`lastname`).value || !document.getElementById(`emails`).value) {
        document.getElementsByClassName(`versubtitle`)[0].innerHTML = `Make sure all fields are filled out!`
        document.getElementsByClassName(`versubtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`versubtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`versubtitle`)[0].style.borderRadius = `5px`
        document.getElementsByClassName(`versubtitle`)[0].style.marginRight = `100px`
        document.getElementsByClassName(`versubtitle`)[0].style.marginLeft = `100px`
        return
    } else if (!document.getElementById('tos').checked) {
        document.getElementsByClassName(`versubtitle`)[0].innerHTML = `Agree to the Terms of Use before continuing!`
        document.getElementsByClassName(`versubtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`versubtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`versubtitle`)[0].style.borderRadius = `5px`
        document.getElementsByClassName(`versubtitle`)[0].style.marginRight = `100px`
        document.getElementsByClassName(`versubtitle`)[0].style.marginLeft = `100px`
        return
    }

    let emails = document.getElementById(`emails`).value.includes(`,`) ? document.getElementById(`emails`).value.split(`,`).map(e => e.trim()) : [document.getElementById(`emails`).value]

    for (let email of emails) {
        if (!email.match(/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/g)) {
            document.getElementsByClassName(`versubtitle`)[0].innerHTML = `${email} is not a valid email!`
            document.getElementsByClassName(`versubtitle`)[0].style.backgroundColor = `red`
            document.getElementsByClassName(`versubtitle`)[0].style.padding = `5px`
            document.getElementsByClassName(`versubtitle`)[0].style.borderRadius = `5px`
            document.getElementsByClassName(`versubtitle`)[0].style.marginRight = `100px`
            document.getElementsByClassName(`versubtitle`)[0].style.marginLeft = `100px`
            return
        } else if (email === document.getElementById(`veremail`).value) {
            document.getElementsByClassName(`versubtitle`)[0].innerHTML = `${email} is the same as the user email, use a different email!`
            document.getElementsByClassName(`versubtitle`)[0].style.backgroundColor = `red`
            document.getElementsByClassName(`versubtitle`)[0].style.padding = `5px`
            document.getElementsByClassName(`versubtitle`)[0].style.borderRadius = `5px`
            document.getElementsByClassName(`versubtitle`)[0].style.marginRight = `100px`
            document.getElementsByClassName(`versubtitle`)[0].style.marginLeft = `100px`
            return
        }
    }

    document.getElementById(`final-verify`).style.opacity = 1
    document.getElementById(`final-verify`).style.pointerEvents = `auto`
    document.getElementById(`holdverpassword`).value = document.getElementById(`verpassword`).value
    document.getElementById(`holdverpassword`).readOnly = true

})

document.getElementById(`finish-create`).addEventListener(`click`, async _ => {
    // Get/set database information.
    localStorage.setItem(`username`, document.getElementById(`verusername`).value)

    if (document.getElementById(`holdverpassword`).value !== document.getElementById(`finverpassword`).value) {
        document.getElementsByClassName(`finversubtitle`)[0].innerHTML = `Both passwords do not match!`
        document.getElementsByClassName(`finversubtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`finversubtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`finversubtitle`)[0].style.borderRadius = `5px`
        return
    }

    let req = await fetch(`http://51.81.190.239:5674/dbsignup`, {
        method: `POST`,
        body: JSON.stringify({

            // User username.
            username: document.getElementById(`verusername`).value,

            // User email.
            email: document.getElementById(`veremail`).value,

            // User password.
            password: document.getElementById(`verpassword`).value,

            data: {
                location: document.getElementById(`location`).value,
                nickname: `${document.getElementById(`firstname`).value} ${document.getElementById(`lastname`).value}`,
                family: document.getElementById(`emails`).value.includes(`,`) ? document.getElementById(`emails`).value.split(`,`).map(e => e.trim()) : [document.getElementById(`emails`).value]
            }
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    let body = await req.json()

    // If creation successful.
    if (body.msg === `success`) {

        // Fetch database data.
        let fet = await fetch(`http://51.81.190.239:5674/dblogin`, {
            method: `POST`,
            body: JSON.stringify({

                // User username.
                username: document.getElementById(`verusername`).value,

                // User password.
                password: document.getElementById(`verpassword`).value
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        let body1 = await fet.json()

        // Check if user request and retured data match.
        if (body1.username === localStorage.getItem(`username`)) {

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

            // Set new cache.
            localStorage.setItem(`dbdata`, JSON.stringify(body1))
            localStorage.setItem(`username`, body1.username)
            localStorage.setItem(`dbdata-uncacheable`, JSON.stringify(body1))
            localStorage.setItem(`cache-time`, new Date().getTime())

            // Redirect.
            location.href = `./index.html?frame=banana`
        } else {

            // Database request failure.
            document.getElementsByClassName(`versubtitle`)[0].innerHTML = `An error occured, try again later`
            document.getElementsByClassName(`versubtitle`)[0].style.backgroundColor = `red`
            document.getElementsByClassName(`versubtitle`)[0].style.padding = `5px`
            document.getElementsByClassName(`versubtitle`)[0].style.borderRadius = `5px`
        }
    } else {
        // Account already exists case.
        document.getElementsByClassName(`versubtitle`)[0].innerHTML = body.msg ? body.msg : `An account with this email already exists!`
        document.getElementsByClassName(`versubtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`versubtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`versubtitle`)[0].style.borderRadius = `5px`
    }
})

// This is protected code, see https://kura.gq?to=share for more information.
