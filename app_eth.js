const fetch = require("node-fetch");
const needle = require("needle");
const cheerio = require("cheerio");
const colors = require("colors");
const Telegraf = require('telegraf');
const { reply } = Telegraf;
const bot = new Telegraf("337484462:AAFgUT67dPbiVmFQGf_Mgdp6OE8hOchrqMM");
const myChat = 186630749;
let $;
let currentEth_usd = 0;
const myUSDT_ETH = 237;
const numMax = 3;


function getEth() {

	fetch("https://api.coinmarketcap.com/v1/ticker/ethereum/")
		.then((res) => {
			return res.json();
		})
		.then(json => {


			needle.get("https://coinmarketcap.com/currencies/ethereum/#markets", (error, response) => {
				if (!error && response.statusCode == 200)
					$ = cheerio.load(response.body);


				let globalEth = +json[0]["price_usd"];
				let poloniexEth = +$(".price")[3].attribs["data-usd"];
				if (currentEth_usd - numMax > poloniexEth) {
					console.log("\x07", new Date(), "ETH_USD - : ".red, currentEth_usd, poloniexEth);
					bot.telegram.sendMessage(myChat, `$ETH_USDT - : ${currentEth_usd}  ${poloniexEth}`);
					currentEth_usd = poloniexEth;
				} else if (currentEth_usd + numMax < poloniexEth) {
					console.log("\x07", new Date(), "ETH_USD + : ".green, currentEth_usd, poloniexEth);
					bot.telegram.sendMessage(myChat, `ETH_USDT + : ${currentEth_usd} ${poloniexEth}`);
					currentEth_usd = poloniexEth;
				}
				if (poloniexEth > myUSDT_ETH) {
					console.log("\x07", new Date(), "Пора обменять!".bold.green);
					bot.telegram.sendMessage(myChat, `Пора обменять! ETH_USDT: ${poloniexEth}`);
				}
				console.log(new Date(), "Price_ETH_USDT: ", globalEth);
				console.log(new Date(), "Price Poloniex ETH_USDT: ", poloniexEth);

				bot.command('/etherium', reply("ETH_USDT: " + poloniexEth));
				bot.command('/rateglobal', reply("ETH_USDT_GLOBAL: " + globalEth));
				bot.startPolling();


			});


		})
		.catch(e => {
			console.log("Error: ", e)
		});

}

setInterval(() => {
	getEth();
}, 30000);