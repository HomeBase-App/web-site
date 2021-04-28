let userdata = localStorage.getItem(`dbdata`)

// If local data exists.
if (userdata) {

    // Redirect to index.
    location.href = `./index.html`

    // Check if username is up to date.
    if (!localStorage.getItem(`username`)) localStorage.setItem(`username`, JSON.parse(localStorage.getItem(`dbdata`)).username)
}

// This is protected code, see https://kura.gq?to=share for more information.