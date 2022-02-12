const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()
const PORT = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

//routes go here
const articles = []
const newspapers = [
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: ''
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: ''
  },
  {
    name: 'Aljazeraa',
    address: 'https://www.aljazeera.com/climate-crisis',
    base: ''
  },
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
	base:''
  },
  {
    name: 'bbc',
    address: 'https://www.bbc.com/news/science-environment-56837908',
	base:''
  }
]

newspapers.forEach(newspaper => {
  axios
    .get(newspaper.address)
    .then(response => {
      let html = response.data
      const $ = cheerio.load(html)

      $('a:contains(climate)', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        articles.push({
          title,
          url,
          source: newspaper.name
        })
      })
    })
    .catch(err => {
      console.log(err)
    })
})
app.get('/', (req, res, next) => {
  res.json(articles)
})

app.get('/:newspaperid', (req, res, next) => {
  let id = req.params.newspaperid

  const newspaperFilter = newspapers.filter(
    newspaper => newspaper.name == id
  )[0].address

  const newspaperBase = newspapers.filter(newspaper => newspaper.name == id)[0]
    .base

  axios
    .get(newspaperFilter)
    .then(response => {
      const html = response.data

      const $ = cheerio.load(html)

      const specificarticles = []

      $('a:contains(climate)', html).each(function () {
        const title = $(this).text()
        const url = $(this).attr('href')
        specificarticles.push({
          title,
          url: url,
          source: id
        })
      })

      res.json(specificarticles)
    })
    .catch(err => {
      console.log(err)
    })
})

//check for db connection
// db.connect(err => {
//   if (err) throw err
// })

app.listen(PORT, console.log(`Server running on ${PORT}`))
