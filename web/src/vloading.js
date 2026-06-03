const createMask = () => {
    const mask = document.createElement('div')
    mask.className = 'loading-mask'

    const spinner = document.createElement('div')
    spinner.className = 'loading-spinner'

    mask.appendChild(spinner)
    return mask
}

export default {
    mounted(el, binding) {
        el.instance = createMask()
        if (binding.value) {
            el.classList.add('loading-parent-relative')
            el.appendChild(el.instance)
        }
    },

    updated(el, binding) {
        if (binding.value !== binding.oldValue) {
            if (binding.value) {
                el.classList.add('loading-parent-relative')
                el.appendChild(el.instance)
            } else {
                el.classList.remove('loading-parent-relative')
                if (el.contains(el.instance)) {
                    el.removeChild(el.instance)
                }
            }
        }
    },

    unmounted(el) {
        if (el.contains(el.instance)) {
            el.removeChild(el.instance)
        }
        el.instance = null
    }
}
