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
        await axios.get(url).then((response) => {
            const html_data = response.data;
            console.log(html_data)
            const $ = cheerio.load(html_data);
            
            //getting the streaming icons 
            console.log("******STREAMING******")
            $(".price-comparison__grid__row.price-comparison__grid__row--stream.price-comparison__grid__row--block").children().last().children().each(function() {
                console.log($(this).find('img').attr('src'))
                stream.push($(this).find('img').attr('src'))
                })
            
            //getting the renting icons 
            console.log("******RENTING******")
            $(".price-comparison__grid__row.price-comparison__grid__row--rent.price-comparison__grid__row--block").children().last().children().each(function() {
                console.log($(this).find('img').attr('data-src'))
                rent.push($(this).find('img').attr('data-src'))
                })

            //getting the buying icons 
            console.log("********BUYING*******")
            $(".price-comparison__grid__row.price-comparison__grid__row--buy.price-comparison__grid__row--block").children().last().children().each(function() {
                console.log($(this).find('img').attr('data-src'))
                buy.push($(this).find('img').attr('data-src'))
                })

    });
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