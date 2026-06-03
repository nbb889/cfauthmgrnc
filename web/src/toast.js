export default (text, duration = 3000) => {
    const toast = document.createElement('div')
    toast.className = 'toast-message'
    toast.innerText = text
    document.body.appendChild(toast)

    setTimeout(() => {
        toast.classList.add('show')
    }, 10)

    setTimeout(() => {
        toast.classList.remove('show')

        setTimeout(() => {
            toast.remove()
        }, 300)
    }, duration)
}
