onload = () => {
    if('serviceWorker' in navigator)
        navigator.serviceWorker.register('sw.js')
}
const header = document.querySelector('header')
header.style.background = scrollY === 0 ? '#234990' : '#234990ab'
addEventListener('scroll' , () => header.style.background = scrollY === 0 ? '#234990' : '#234990ab')

const cta = document.querySelector('#cta')
const lightOut = document.querySelector('#cta .light')
const lightIn = document.querySelector('#cta button .light')
cta.addEventListener('mousemove' , e => {
    const {offsetX , offsetY} = e
    lightIn.style.cssText = `opacity:1;top:${offsetY}px;left:${offsetX}px;`
    lightOut.style.cssText = `opacity:1;top:${offsetY}px;left:${offsetX}px;`
})
cta.addEventListener('mouseleave' , e => {
    const {offsetX , offsetY} = e
    lightIn.style.cssText = `opacity:0;top:${offsetY}px;left:${offsetX}px;`
    lightOut.style.cssText = `opacity:0;top:${offsetY}px;left:${offsetX}px;`
})

const video = document.querySelector('video')
const observer = new IntersectionObserver(([entry]) => {
    if(entry.isIntersecting) video.play()
    else video.pause()
} , {threshold:[0.5]})
observer.observe(video)

const pronounceBtn = document.querySelector('#Info button')
const pronounceText = document.querySelector('#Info p').textContent
pronounceBtn.addEventListener('click' , () => {
    const text = new SpeechSynthesisUtterance(pronounceText)
    text.lang = 'fr-FR'
    speechSynthesis.cancel()
    speechSynthesis.speak(text)
})

const tablist = document.querySelector('#tablist')
const tabs = document.querySelectorAll('#tablist li')
const panals = document.querySelectorAll('#Tabs .panal')
let tabIndex = 0
const renderTab = () => {
    tabs.forEach(tab => tab.setAttribute('aria-selected' , false))
    panals.forEach(panal => panal.setAttribute('aria-hidden' , true))
    tabs[tabIndex].setAttribute('aria-selected' , true)
    panals[tabIndex].setAttribute('aria-hidden' , false)
}
tablist.addEventListener('keydown' , e => {
    switch(e.key){
        case 'ArrowLeft':
            tabIndex = Math.max(0 , tabIndex - 1)
            renderTab()
            break;
        case 'ArrowRight':
            tabIndex = Math.min(tabs.length - 1 , tabIndex + 1)
            renderTab()
            break;
        default : break;
    }
})
tabs.forEach((tab , index) => tab.addEventListener('click' , () => {
    tabIndex = index
    renderTab()
}))

const dialog = document.querySelector('dialog')
const dialogBtn = document.querySelector('dialog button')
const dialogText = document.querySelector('dialog p')
dialogBtn.addEventListener('click' , () => {
    dialog.close()
    bag.classList?.remove('open')
})

 const calendar = document.querySelector('#Calendar table')
 const monthYear = document.querySelector('#my')
 let current = new Date()
 let events = []
 fetch('./events.json')
    .then(res => res.json())
    .then(data => {
        events = data
        renderCalendar()
    })
const renderCalendar = () => {
    const year = current.getFullYear()
    const month = current.getMonth()
    const start = new Date(year , month , 1)
    const end = new Date(year , month - 1 , 0)
    const now  = new Date().toLocaleString().split(',')[0]
    monthYear.textContent = start.toLocaleString('default' , {year:'numeric' , month:'long'})
    calendar.innerHTML = `
        <tr>${['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => `<th>${day}</th>`).join('')}</tr>
        <tr>
            ${Array.from({length:start.getDay()}).map(() => `<td></td>`).join('')}
            ${Array.from({length:end.getDate()}).map((_,i) => {
                const date = new Date(year , month , i + 1)
                const iso = date.toISOString().split('T')[0]
                const classList = [
                    now == date.toLocaleString().split(',')[0] && 'today',
                    date.getDay() == 0 && 'sunday',
                    date.getDay() == 6 && 'saturday',
                ].filter(Boolean).join(' ')
                const event = events.map((e , i) => (iso >= e.date[0] && iso <= (e.date[1] || e.date[0])) ? `<span class="event ${e.category}" onclick="openModal(${i})">${e.title}</span>` : '').join('')
                return `
                    <td class="${classList}">
                        <b>${i+1}</b>
                        ${event}
                    </td>
                    ${date.getDay() === 6 ? '</tr><tr>' : ''}
                `
            }).join('')}
        </tr>
    `
}
const handleCalendar = offset => {
    current.setMonth(current.getMonth() + offset)
    renderCalendar()
}
const openModal = index => {
    const event = events[index]
    dialogBtn.textContent = 'Close'
    dialogText.innerHTML = `
        <strong>${event.title}</strong>
        <p>Date : ${event.date}</p>
        <p>Place : ${event.place}</p>
        <p>Category : ${event.category}</p>
        <br>
        <p>${event.content}</p>
    `
    setTimeout(() => dialog.showModal() , 500)
}

const reviewSlide = document.querySelector('#Reviews .slide')
let reviewIndex = 0
fetch('./review.json')
    .then(res => res.json())
    .then(data => {
        data.reviews.map(review => reviewSlide.insertAdjacentHTML('beforeend' , `
            <div class="card">
                <h3>${review.author}</h3>
                <p>${'⭐'.repeat(review.rating)}</p>
                <p>${review.content}</p>
            </div>
        `))
        reviewSlide.querySelector('.card').classList.add('center')
    })

const handleReview = offset => {
    const cards = reviewSlide.querySelectorAll('.card')
    reviewIndex = Math.max(0 , Math.min(cards.length - 1 , reviewIndex + offset))
    cards.forEach(card => card.classList?.remove('center'))
    cards[reviewIndex].classList.add('center')
    cards[reviewIndex].scrollIntoView({
        behavior:'smooth',
        inline:'center',
        block:'center'
    })
}
const bag = document.querySelector('.bag')
const prize = ["No prize",'10% discount coupon','100% discount coupon.']
bag.addEventListener('click' , () => {
    dialogBtn.textContent = 'Restart'
    dialogText.innerHTML = `<center>${prize[Math.floor(Math.random() * prize.length)]}</center>`
    bag.classList.add('open')
    setTimeout(() => dialog.showModal() , 1000)
})