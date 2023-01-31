const Cheerio = require('cheerio');
const express = require('express');
const router = express.Router();
const fs = require('fs');


router.get('/', (req, res) => {
    res.render('index')
});

router.post('/create', (req, res) => {

    const { categoryValue, categoryText, content, slug, title, description, metaTitle, date, img } = req.body;



    // Get templates and pages
    const postPage = fs.readFileSync('./blog/templates/template-post.html', {encoding:'utf-8'});
    const categoryPage = fs.readFileSync(`./blog/categorias/${categoryValue}/index.php`, {encoding:'utf-8'});
    const categoryCard = fs.readFileSync('./blog/templates/card-category.html', {encoding:'utf-8'});
    const homePage = fs.readFileSync('./blog/index.php', {encoding:'utf-8'});
    const homeCard = fs.readFileSync('./blog/templates/post-card-home.html', {encoding:'utf-8'});

    // Create link post
    const linkPost = `/blog/categorias/${categoryValue}/${slug}`;

    // Create category link
    const categoryLink = `/blog/categorias/${categoryValue}`;

    // Create page post
    let $ = Cheerio.load(postPage);

    // Insert post content
    $('#post-content').html(content);

    // Insert meta tags
    $('title').text(metaTitle)
    $('meta[name=description]').attr("content", description);

    // Insert breadcrumb title
    $('#breadcrumb-title').text(title);



    fs.writeFile(`blog/categorias/${categoryValue}/${slug}.html`, $.html(), (err) => {
        if(err){
            console.log(err);
        } else {
            console.log('Page Post Created!')
        };
    });

    // Create Home Card
    $ = Cheerio.load(homeCard);
 
    $('a[id=link-home-card-img]').attr('href', linkPost);
    $('a[id=link-home-card-title]').attr('href', linkPost);
    $('a[id=link-home-card-title]').text(title);
    $('img').attr('src', img);
    $('small[id=date]').text(date);
    $('a[id=category-field-card-home]').text(categoryText);
    $('a[id=category-field-card-home]').attr('href',categoryLink);
    $('p').text(description);
    
    const newHomeCard = $.html();


    // Insert Home Card
    $ = Cheerio.load(homePage);

    $('div[id=home-cards-field]').prepend(newHomeCard);

    fs.writeFile(`./blog/index.php`, $.html(), (err) => {
        if(err){
            console.log(err);
        } else {
            console.log('Home Page Created!')
        };
    });


    // Create Category Card
    $ = Cheerio.load(categoryCard);

    $('a[class=link-post-card-category-img]').attr('href', linkPost);
    $('img').attr('src', img);
    $('a[class=card-category-title]').attr('href', linkPost);
    $('a[class=card-category-title]').text(title);
    $('p').text(description);
    $('small[id=date-publish]').text(date);
    $('a[class=link-tag-category]').attr('href', categoryLink);
    $('a[class=link-tag-category]').text(categoryText);

    const newCategoryCard = $.html();



    // Insert Category Card
    $ = Cheerio.load(categoryPage);

    $('.container-cards-category').prepend(newCategoryCard);

    fs.writeFile(`blog/categorias/${categoryValue}/index.php`, $.html(), (err) => {
        if(err) {
            console.log(err);
        } else {
            console.log('Page Category Created!');
        }
    });


    res.render('success');
});

module.exports = router;