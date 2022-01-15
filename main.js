import { ini } from './defaultIni.js'

let lines = ini.trim().split('\n')
for (const i in lines) lines[i] = lines[i].split('=')
for (const i in lines) lines[i][1] = lines[i][1].split(',')
console.log('lines:', lines)

const input = document.querySelector('input.ini')
input.onchange = () => {
    const reader = new FileReader()
    reader.onload = () => {
        lines = reader.result.trim().split('\n')
        for (const i in lines) lines[i] = lines[i].split('=')
        for (const i in lines) lines[i][1] = lines[i][1].split(',')
    }
    reader.readAsText(input.files[0])
}

let folder = ''

const folderInput = document.querySelector('input.folder')
console.log('folderInput:', folderInput)
folderInput.onfocus = () => {
    console.log('focus')
}
folderInput.oninput = () => {
    folderInput.value = folderInput.value.replaceAll(`\\`, '/')
}
folderInput.onfocusout = () => {
    console.log('a')
    if (folderInput.value.charAt(folderInput.value.length - 1) !== '/') folderInput.value += '/'
    folder = folderInput.value
}

document.querySelector('button.play').onclick = pressed

const text = document.getElementById('inp')
function pressed() {
    const arr = text.value.split(',')
    if (arr.length === 0) return
    let index = 0
    function audio(letter) {
        let name = lines.find((line) => line[1][0] === letter)
        if (name == null) {
            if (index >= arr.length) return
            alert(letter + '  not found')
            index++
            audio(arr[index])
            return
        }
        const player = new Audio((folder.length === 0 ? 'au/' : folder) + name[0])
        player.currentTime = +name[1][1] / 1000
        player.play()
        let interval = setInterval(() => {
            if (player.currentTime >= (+name[1][5] + +name[1][1] + 70) / 1000) {
                clearInterval(interval)
                player.pause()
                if (index >= arr.length) return
                index++
                audio(arr[index])
            }
        })
        /* player.onended = () => {
            if (index >= arr.length) return
            index++
            audio(arr[index])
        } */
    }
    audio(arr[index])
}
