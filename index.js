// Required to run: Node.JS v14
// Purpose: Write app path and folder list to files.
// Run with: node index.js

(async () => {
    let readData = async _ => {
        let master = { path: [], dir: [] }
        return new Promise(async resolve => {
            let read = async dir => {
                require(`fs`).readdir(dir, async (error1, files) => {
                    if (error1) console.log(error1)
                    if (!Array.isArray(files)) return null
                    master.dir.push(dir)
                    for await (let file of files.filter(c => ![`.git`, `path.json`, `dir.json`].includes(c))) {
                        if (file.includes(`.`)) {
                            master.path.push(`${dir}/${file}`)
                        }
                        else if (!file.includes(`.`)) read(`${dir}/${file}`)
                    }
                })
            }
            await read(`./`).catch(() => { })
            setTimeout(() => resolve(master), 1000)
        })
    }

    let data = await readData()

    for (let i = 0; i < data.path.length; i++) data.path[i] = data.path[i].slice(3)
    data.path = data.path.filter(f => f !== `index.js`)
    require(`fs`).writeFile(`./path.json`, JSON.stringify(data.path, null, 4), err => { if (err) console.log('Error writing file', err) })
    
    data.dir = data.dir.filter(f => f !== `./`)
    for (let i = 0; i < data.dir.length; i++) data.dir[i] = data.dir[i].slice(3)
    require(`fs`).writeFile(`./dir.json`, JSON.stringify(data.dir, null, 4), err => { if (err) console.log('Error writing file', err) })
})()

// This is protected code, see https://kura.gq?to=share for more information.