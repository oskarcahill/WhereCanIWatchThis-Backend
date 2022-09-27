const express = require("express")
const cheerio = require("cheerio")
const axios = require("axios")
const PORT = process.env.PORT || 4000;

const app = express();
app.listen(PORT, () => console.log(`server is active and running on port ${PORT}`));

async function platformFinder(country,media,name){
    const platforms = []
    const stream = []
    const rent = []
    const buy = []
    const url = `https://www.justwatch.com/${country}/${media}/${name}`;

    if(media == "tv-series"){
        console.log("TV")
        await axios.get(url).then((response) => {
            const html_data = response.data;
            const $ = cheerio.load(html_data);
                
            //getting the streaming icons 
            $(".price-comparison__grid__row.price-comparison__grid__row--stream.price-comparison__grid__row--block").children().last().children().each(function() {
                    stream.push($(this).find('img').attr('data-src'))
            })
                
            //getting the renting icons 
            $(".price-comparison__grid__row.price-comparison__grid__row--rent.price-comparison__grid__row--block").children().last().children().each(function() {
                rent.push($(this).find('img').attr('data-src'))
            })

            //getting the buying icons 
            $(".price-comparison__grid__row.price-comparison__grid__row--buy.price-comparison__grid__row--block").children().last().children().each(function() {
                buy.push($(this).find('img').attr('data-src'))
            })

    });

    }
    else if(media == "movie"){
        console.log("MOVIE")
        await axios.get(url).then((response) => {
            const html_data = response.data;
            const $ = cheerio.load(html_data);
                
            //getting the streaming icons 
            $(".price-comparison__grid__row.price-comparison__grid__row--stream.price-comparison__grid__row--block").children().last().children().each(function() {
                    stream.push($(this).find('img').attr('src'))
            })
                
            //getting the renting icons 
            $(".price-comparison__grid__row.price-comparison__grid__row--rent.price-comparison__grid__row--block").children().last().children().each(function() {
                rent.push($(this).find('img').attr('data-src'))
            })

            //getting the buying icons 
            $(".price-comparison__grid__row.price-comparison__grid__row--buy.price-comparison__grid__row--block").children().last().children().each(function() {
                buy.push($(this).find('img').attr('data-src'))
            })

    });

}
    platforms.push(stream);
    platforms.push(rent)
    platforms.push(buy)
    return platforms;
}

app.get("/api/platforms/:countryCode/:mediaType/:mediaName", async (req, res) => {
    try{
        const platform = await platformFinder(req.params.countryCode,req.params.mediaType,req.params.mediaName);
        return res.status(200).json({
            result: platform
        })
    }
    catch(err){
        return res.status(500).json({
            err: err.toString()
        });
    }
});