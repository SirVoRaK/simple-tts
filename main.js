import { ini } from './defaultIni.js'

let folder = ''
const selectFolderButton = document.querySelector('button.select-folder')
const selectFolderSpan = document.querySelector('span.select-folder')
let fs

function getAudioFromFile(path) {
    if (typeof require !== 'function') return null
    return 'data:audio/wav;base64,' + fs.readFileSync(path, { encoding: 'base64' })
}

if (typeof require === 'function') {
    fs = require('fs')
    const { ipcRenderer } = require('electron')
    const path = require('path')
    let counter = 0
    ipcRenderer.on('open-result', (e, arg) => {
        if (arg === '') return
        counter = 0
        fs.readdirSync(arg).forEach((file) => {
            if (path.extname(file) === '.wav') counter++
        })
        selectFolderSpan.textContent = arg.replaceAll('\\', '/')
        folder = selectFolderSpan.innerText
        document.querySelector('.info .wav').textContent = counter + ' .wav'
    })
    selectFolderButton.onclick = () => {
        ipcRenderer.send('open-folder-dialog')
    }
} else {
    selectFolderButton.onclick = () => {
        alert('You need to download the Desktop version')
    }
}

let lines = ini.trim().split('\n')
for (const i in lines) lines[i] = lines[i].split('=')
for (const i in lines) lines[i][1] = lines[i][1].split(',')

const input = document.querySelector('input.ini')
input.onchange = () => {
    if (typeof require !== 'function') return alert('You need to download the Desktop version')
    const reader = new FileReader()
    reader.onload = () => {
        lines = reader.result.trim().split('\n')
        for (const i in lines) lines[i] = lines[i].split('=')
        for (const i in lines) lines[i][1] = lines[i][1].split(',')
    }
    reader.readAsText(input.files[0])
    input.parentElement.querySelector('span.name').textContent = input.files[0].name
    document.querySelector('.info .ini').textContent = lines.length + ' .ini'
}

document.querySelector('button.play').onclick = pressed

let isPlaying = false

const text = document.getElementById('inp')
text.onkeydown = (e) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        pressed()
    }
}
function pressed() {
    if (isPlaying) return
    isPlaying = true
    const arr = text.value.split(',')
    if (arr.length === 0) {
        isPlaying = false
        return
    }
    let index = 0
    function audio(letter) {
        let name = lines.find((line) => line[1][0] === letter)
        if (name == null) {
            if (index >= arr.length) return (isPlaying = false)
            alert(letter + '  not found')
            index++
            audio(arr[index])
            return
        }
        const player = new Audio(
            folder.length === 0 ? 'au/' + name[0] : getAudioFromFile(folder + '/' + name[0])
        )
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

const imgInput = document.querySelector('input#img')
const img = imgInput.parentElement.querySelector('img')
imgInput.onchange = () => {
    img.src = URL.createObjectURL(imgInput.files[0])
}
