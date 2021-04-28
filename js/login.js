function showHide(id) { document.getElementById(id).type = document.getElementById(id).type === `password` ? `text` : `password` }

// Username enter key event.
document.getElementById(`username`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-init`).click() : null)

// Password enter key event.
document.getElementById(`password`).addEventListener(`keypress`, e => e.key === `Enter` ? document.getElementById(`account-init`).click() : null)

// Account login click event.
document.getElementById(`account-init`).addEventListener(`click`, async _ => {

    // Check if any values are missing.
    if (!document.getElementById(`username`).value || !document.getElementById(`password`).value) {
        document.getElementsByClassName(`subtitle`)[0].innerHTML = `You must fill out all the fields to continue!`
        document.getElementsByClassName(`subtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`subtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`subtitle`)[0].style.borderRadius = `5px`
        return
    }

    // Set local username.
    localStorage.setItem(`username`, document.getElementById(`username`).value)

    // Fetch user database information.
    let req = await fetch(`http://51.81.190.239:5674/dblogin`, {
        method: `POST`,
        body: JSON.stringify({

            // User username.
            username: document.getElementById(`username`).value,

            // User password.
            password: document.getElementById(`password`).value
        }),
        headers: { 'Content-Type': 'application/json' },
    })
    let body = await req.json()

    // Check if user request and retured data match.
    if (body.username === localStorage.getItem(`username`)) {

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
        localStorage.setItem(`dbdata`, JSON.stringify(body))
        localStorage.setItem(`username`, body.username)
        localStorage.setItem(`dbdata-uncacheable`, JSON.stringify(body))
        localStorage.setItem(`cache-time`, new Date().getTime())

        let url = new URL(window.location.href).searchParams

        // Redirect.
        location.href = `./${url.get(`redir`) || `index`}.html?frame=banana`
    } else {

        // Invalid login details case.
        document.getElementsByClassName(`subtitle`)[0].innerHTML = `Invalid Login Details! Remember the password is CaSe sEnSiTiVe`
        document.getElementsByClassName(`subtitle`)[0].style.backgroundColor = `red`
        document.getElementsByClassName(`subtitle`)[0].style.padding = `5px`
        document.getElementsByClassName(`subtitle`)[0].style.borderRadius = `5px`
    }
})

// This is protected code, see https://kura.gq?to=share for more information.
