document.addEventListener('DOMContentLoaded', () => {
    const quoteList = document.querySelector('#quote-list')

    function renderQuote(quote) {
        const li = document.createElement('li')
            li.className = 'quote-card'
            li.innerHTML = `
                <blockquote class="blockquote">
                    <p class="mb-0">${quote.quote}</p>
                    <footer class="blockquote-footer">${quote.author}</footer>
                    <br>
                    <button class='btn-success'>Likes: <span>0</span></button>
                    <button class='btn-danger'>Delete</button>
                <blockquote>
            `
            quoteList.appendChild(li)
    }

    fetch('http://localhost:3000/quotes?_embed=likes')
    .then(response => response.json())
    .then(allQuotes => {
        allQuotes.map(eachQuote => renderQuote(eachQuote))

        const deleteBtns = document.querySelectorAll('.btn-danger')
            deleteBtns.forEach(btn => {
                btn.addEventListener('click', e => {
                    const targetAuthor = e.target.parentNode.querySelector('.blockquote-footer').textContent
                    const targetId = allQuotes.find(title => title.author === targetAuthor).id
                    fetch(`http://localhost:3000/quotes/${targetId}`, {method: 'DELETE'})
                    e.target.parentNode.remove()

                })
             })
        likeBtns = document.querySelectorAll('.btn-success')
        likeBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                let currentCount = e.target.parentNode.querySelector('span')
                let likeCount = Number(currentCount.textContent)
                likeCount += 1
                currentCount.textContent = likeCount
                const targetAuthor = e.target.parentNode.querySelector('.blockquote-footer').textContent
                const targetId = allQuotes.find(title => title.author === targetAuthor).id

                fetch('http://localhost:3000/likes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    body: JSON.stringify({
                        quoteId: targetId,
                    })
                })
                
                
            })
        })
    })

    const newQuoteForm = document.querySelector('#new-quote-form')

    newQuoteForm.addEventListener('submit', e => {
        e.preventDefault()
        const newQuote = document.querySelector('#new-quote').value
        const quoteAuthor = document.querySelector('#author').value
        const addedQuote = {
            quote: newQuote,
            author: quoteAuthor,
            likes: []
        }

        fetch('http://localhost:3000/quotes?_embed=likes', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: JSON.stringify(addedQuote)
        })
        .then(response => response.json())
        .then(responseQuote => renderQuote(responseQuote))
        newQuoteForm.reset()
    })

    
    
    


})
