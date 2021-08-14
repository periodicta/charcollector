/* --- Setting up 'express' server to keep the bot online --- */
// setting up express dependency and objects
const express = require('express');
const app = express();
const port = 3000;

// setting up express app
app.get('/', (req, res) => res.send('Hello World!'));
app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));

/* --- Setting up configuration --- */
// installing dependencies
const Discord = require('discord.js') // discord.js lang
const Chance = require("chance") // randomization
const Database = require("@replit/database") // data storage
const disbut = require("discord-buttons");
const pretty = require("pretty-ms") // time display

// initializing objects
const client = new Discord.Client() // Discord bot
disbut(client);
const chance = new Chance() // random number generator
const db = new Database() // database

// initialializing variables
const prefix = "!" // bot prefix

// setting colors based on rarity
basic=0xffcba4 // non-unlock color - peach
common=0xc759e3 // pink
uncommon=0x4287f5 // blue
rare=0x27d950 // green
epic=0xe8c020 // yellow
legend=0xed8c1c // orange
myth=0xe63c22 // red

let button = new disbut.MessageButton()
  .setStyle('red')
  .setLabel('Mr. Button!') 
  .setID('click_to_function');

// probability and character ID references
probs=[1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21]
 // rarity probabilities
nums=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99] // unweighted IDs of individual characters
probs2=[1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15, 15] // rarity probabilities
nums2=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69] // unweighted IDs of individual characters
probs3=[1, 1, 1, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10] // rarity probabilities
nums3=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44] // unweighted IDs of individual characters
    
/* --- Logging in --- */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`) // reporting success
    // registering status
    client.user.setPresence({ activity: { name: '!help | aloe vera, bot made by Sidhant C.' }, status: 'idle' })
      .then(console.log)
      .catch(console.error);
});

/* --- Initializing embeds and characters --- */
// response embeds
const getcredits=new Discord.MessageEmbed() // successful collection
    .setTitle("Congrats!")
    .setColor(basic)
    .setDescription("You get **5** credits.")
const poor=new Discord.MessageEmbed() // failed collection (credits)
    .setTitle("Not Enough Credits")
    .setColor(basic)
    .setDescription("Sorry, you do not have the required amount of credits to make this action.")
const help=new Discord.MessageEmbed() // help response
    .setTitle("Commands")
    .setColor(basic)
    .setDescription("`help`\n`info`\n`bounty`/`bou`\n`force`\n`kyber`/`kyb`\n`holocron`/`holo`\n`bank`\n`memory`/`mem`\n\nUse `!info {command}` to learn more about a command.")
const moreinfo=new Discord.MessageEmbed() // info specificity error
    .setTitle("Please Try Again")
    .setColor(basic)
    .setDescription("Please specify which command you wish to learn about.")
const inval=new Discord.MessageEmbed() // invalid input
    .setTitle("Invalid Input")
    .setColor(basic)
    .setDescription("You did not provide a valid command.")
const documentation=new Discord.MessageEmbed() // invalid input
    .setTitle("Full Rules")
    .setColor(basic)
    .setDescription("**The Game**\nThe goal of the game is to collect as many characters as possible, especially rarer ones!\n\n**Bounties**\n`!bounty`/`!bou` - collect a bounty and get 5 credits (can be used once per 12 hours)\n\n**Banking Clan**\n`!bank` - visit the Banking Clan on Scipio to see your balance of credits\n\n**Memory Core**\n`!memory`/`!mem` - visit the memory core to see your own or another player's inventory\n\n**Unlocking Characters**\n`!force` - use the Force, Luke, to unlock a random character for 3 credits\n`!kyber`/`!kyb` - harness a Kyber Crystal to unlock an Uncommon or higher character for 6 credits\n`!holocron`/`!holo` - open a Jedi Holocron to unlock a Rare or higher character for 12 credits\n\n**Help**\nIf you need a list of commands, see `!help`\nIf you want to know what a specific `{command}` does, use `!info {command}`")
    .setThumbnail("https://www.denofgeek.com/wp-content/uploads/2017/03/darth-vader-1_0.jpg?fit=1947%2C1274")

// info embeds
const helpinfo=new Discord.MessageEmbed() // info about help
    .setTitle("help")
    .setColor(basic)
    .setDescription("This command gives you a list of available commands.\nUsage: `!help`")
const infoinfo=new Discord.MessageEmbed() // info about info
    .setTitle("info")
    .setColor(basic)
    .setDescription("This command gives you info about a specific command.\nUsage: `!info {command}`\n\nParameters\n`{command}` - the command you wish to learn about")
const collectinfo=new Discord.MessageEmbed() // info about collect
    .setTitle("bounty")
    .setColor(basic)
    .setDescription("This command gives you 5 free credits. It can be used every 12 hours.\nAliases: `!bou`\nUsage: `!bounty`")
const balanceinfo=new Discord.MessageEmbed() //info about balance
    .setTitle("bank")
    .setColor(basic)
    .setDescription("This command gives you a certain user's balance of credits.\nUsage: `!bank {user}`\n\nParameters\n`{user}` - (optional) the user who's balance you want; if ommitted, defaults to yourself")
const unlockinfo=new Discord.MessageEmbed() // info about unlock
    .setTitle("unlock")
    .setColor(basic)
    .setDescription("This command unlocks a random character for 3 credits.\nUsage: `!unlock {franchise}`\n\nParameters\n`{franchise}` - (optional) the specific franchise you wish to unlock a character from (defaults to random) **Note:** choosing a franchise will increase the credit cost from 3 to 4.")
const inventoryinfo=new Discord.MessageEmbed() // info about inventory
    .setTitle("memory")
    .setColor(basic)
    .setDescription("This command will show you your inventory of characters.\nAliases: `!mem`\nUsage: `!memory {user}`\n\nParameters\n`{user}` - (optional) the user whose inventory you wish to see; if ommitted, defaults to yourself")

const vader=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Darth Vader")
    .setColor(myth)
    .setDescription("\"Anakin Skywalker was weak. I **destroyed** him.\"\n\nFranchise: Star Wars\nRarity: **Mythical**\n\n**Anakin Skywalker** was a Jedi Knight and a General for the Republic during the Clone Wars, prophecised to be the Chosen One. After the war he was seduced to the Dark Side and becomes **Darth Vader**, Sith Apprentice to Darth Sidious and chief enforcer for the Galactic Empire.")
    .setImage("https://cdn.statically.io/img/i.pinimg.com/originals/21/09/5e/21095e668a7cfdb6d70e678de48c31b5.jpg")
const kenobi=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Obi-Wan Kenobi")
    .setColor(myth)
    .setDescription("\"You can kill me, but you will never destroy me. It takes strength to resist the dark side. Only the ***weak*** embrace it.\"\n\nFranchise: Star Wars\nRarity: **Mythical**\n\n**Obi-Wan Kenobi** was a Jedi Master and a General for the Republic during the Clone Wars. After Order 66, he went into exile on Tatooine.")
    .setImage("https://coffeewithkenobi.com/wp-content/uploads/2017/03/REB_IA_21086.jpg")
const yoda=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Master Yoda")
    .setColor(myth)
    .setDescription("\"If no mistake you have made, losing you are. A different game you should play.\"\n\nFranchise: Star Wars\nRarity: **Mythical**\n\n**Yoda** was the wise Jedi Grand Master before and during the Clone Wars, as well as the head of the Jedi Council. After Order 66, he went into exile on Dagobah.")
    .setImage("https://nerdist.com/wp-content/uploads/2020/09/Yoda-The-High-Republic-Featured.jpg")
const solo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Han Solo")
    .setColor(legend)
    .setDescription("\"Look your Worshipfulness, let's get one thing straight. I take orders from just one person: **Me**.\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Han Solo** was a snarky Correllian smuggler during the Imperial Era who joined the Rebellion. After the Fall of the Empire he helped establish the New Republic before returning to smuggling.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/han-solo-main_a4c8ff79.jpeg?region=0%2C0%2C1920%2C960")
const luke=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Luke Skywalker")
    .setColor(legend)
    .setDescription("\"You've failed, your highness. I am a Jedi, **like my father before me.**\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Luke Skywalker** was Darth Vader's secret son who was trained in the Jedi ways by Obi-Wan Kenobi and then joined the Rebellion, redeeming his father and defeating the Emperor. He tried to revive the Jedi Order as its Grand Master, although after he failed he exiled himself to Ahch-To.")
    .setImage("https://cdn.mos.cms.futurecdn.net/QfoC48pum7gJTqNhGrrGic.png")
const ahsoka=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Ahsoka Tano")
    .setColor(legend)
    .setDescription("\"I am no Jedi.\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Ahsoka Tano** was a Jedi Padawan and a Commander for the Republic during the Clone Wars. She was expelled by the Jedi Council after being framed, and later refused to return. After Order 66, she became a Rebel leader under the codename Fulcrum.")
    .setImage("https://starwarsblog.starwars.com/wp-content/uploads/2019/04/swcc-the-clone-wars-panel-tall-A.jpg")
const mando=new Discord.MessageEmbed()
    .setTitle("You have unlocked... The Mandalorian")
    .setColor(legend)
    .setDescription("\"I can bring you in warm... or I can bring you in cold.\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Din Djarin**, better known as **The Mandalorian**, was a Mandalorian bounty hunter who grew attached to one of his targets, an infant named Grogu, and became a father figure for it as he searched for a Jedi to give Grogu to.")
    .setImage("https://d.newsweek.com/en/full/1544309/mandalorian-star-wars-timeline.jpg?w=1600&h=1200&l=51&t=19&q=88&f=cfce9ae8c2568ddc658568313abf8351")
const artoo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... R2-D2")
    .setColor(legend)
    .setDescription("\"Wuup woob, weepwooopwub... waaaaaargh!\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**R2-D2** was Anakin Skywalker's astromech droid. During the Rebellion R2-D2 helped his son Luke and was revered as a war hero.")
    .setImage("https://fastly.syfy.com/sites/syfy/files/wire/legacy/why-luke-skywalker-left-r2d2-behind-in-star-wars-7-the-force-awakens-797755.jpg")
const palpatine=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Emperor Palpatine")
    .setColor(legend)
    .setDescription("\"The Dark Side is a path to many abilities some consider to be... ***unnatural***.\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Sheev Palpatine** was the Sith Lord known as **Darth Sidious**. He infiltrated the Republic and incited the Clone Wars to weaken it, purging the Jedi through Order 66 and reorganizing the Republic into the Empire, declaring himself Emperor.")
    .setImage("https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/04/Darth-Sidious-The-Emperor-Palpatine-Star-Wars-The-Clone-Wars-Cropped.jpg")
const maul=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Darth Maul")
    .setColor(legend)
    .setDescription("\"There is no *justice*, no *law*, no *order*, ***except for the one that will REPLACE it!*** The time of the Jedi... is past.\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Darth Maul** was Sith Apprentice to Darth Sidious until he was chopped in half by Obi-Wan Kenobi. He returned with metal legs, taking over Mandalore and building the largest criminal empire in galactic history, searching for revenge against Kenobi.")
    .setImage("https://i.ytimg.com/vi/b5wZAFaApIo/maxresdefault.jpg")
const boba=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Boba Fett")
    .setColor(legend)
    .setDescription("\"You can run, but you'll only die tired.\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Boba Fett** was a clone of Jango Fett adopted as his son. He later went on to become the premiere bounty hunter in the galaxy. He was pushed into the Sarlacc Pit but he managed to escape and take over Jabba the Hutt's throne.")
    .setImage("https://i.ytimg.com/vi/uq84RuBo2kg/maxresdefault.jpg")
const chewie=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Chewbacca")
    .setColor(legend)
    .setDescription("\"Uuuuuuuuur wrrrrraaaaarrrrgh!\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Chewbacca** was a Wookie who fought for the Republic in the Clone Wars. He later became Han Solo's smuggling partner and aided the Rebellion. He also later aided the Resistance against the First Order.")
    .setImage("https://cdn11.bigcommerce.com/s-nq6l4syi/images/stencil/1280x1280/products/72107/110620/131351-1024__26803.1552644049.jpg?c=2?imbypass=on")
const leia=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Leia Organa")
    .setColor(legend)
    .setDescription("\"I don't know who you are or where you came from, but from now on, you'll do as I tell you, okay?\"\n\nFranchise: Star Wars\nRarity: **Legendary**\n\n**Leia Organa** was a Princess from Alderaan who secretly helped lead the Rebellion. After the Fall of the Empire she was pivotal in establishing the New Republic and was a General of the Resistance.")
    .setImage("https://www2.pictures.zimbio.com/mp/oHGHV7BhCfvl.jpg")
const threepio=new Discord.MessageEmbed()
    .setTitle("You have unlocked... C-3PO")
    .setColor(epic)
    .setDescription("\"Sir, if I may venture an opinion-\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**C-3PO** was a protocol droid for Padme Amidala, and later became good friends with R2-D2 and helped Luke Skywalker along with him. He also continued to aid the Resistance later on.")
    .setImage("https://starwarsblog.starwars.com/wp-content/uploads/2015/07/C-3PO-See-Threepio_68fe125c-1536x864-451079149590.jpeg")
const kylo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Kylo Ren")
    .setColor(epic)
    .setDescription("\"Let the past die. **Kill it, if you have to.**\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Ben Solo** was a Padawan in Luke Skywalker's newly established Jedi Order, but he was turned to the Dark Side by Supreme Leader Snoke and became Kylo Ren. He later killed Snoke and led the First Order until his redemption.")
    .setImage("https://i.ytimg.com/vi/j2lBmxKEBuA/maxresdefault.jpg")
const dooku=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Count Dooku")
    .setColor(epic)
    .setDescription("\"Twice the pride, double the fall.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Count Dooku** was Sith Apprentice to Darth Sidious, and he led the Separatist forces in the Clone Wars for his master, although he was disposed of when Sidious wanted a new apprentice.")
    .setImage("https://static2.srcdn.com/wordpress/wp-content/uploads/2020/04/Star-Wars-Count-Dooku-Darth-Tyrannus.jpg")
const quigon=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Qui-Gon Jinn")
    .setColor(epic)
    .setDescription("\"The ability to speak does not make you intelligent.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Qui-Gon Jinn** was an unorthodox Jedi Master who participated in the Invasion of Naboo and was killed by Darth Maul.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/Qui-Gon-Jinn_d89416e8.jpeg?region=0%2C13%2C1536%2C769")
const grievous=new Discord.MessageEmbed()
    .setTitle("You have unlocked... General Grievous")
    .setColor(epic)
    .setDescription("\"This will make a fine addition to my collection.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**General Grievous** was a droid General for the Separatist Alliance during the Clone Wars, notable for having killed many Jedi.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/General-Grievous_c9df9cb5.jpeg?region=0%2C0%2C1200%2C675&width=960")
const lando=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Lando Calrissian")
    .setColor(epic)
    .setDescription("\"Everything you've heard about me... *is true*.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Lando Calrissian** was a playboy who eventually settled down as administrator of Cloud City on Bespin, reluctantly betraying Han Solo to Darth Vader, although he later joined the Rebellion to compensate.")
    .setImage("https://fastly.syfy.com/sites/syfy/files/styles/1200x680/public/glover-lando.jpg?offset-x=0&offset-y=0")
const grogu=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Grogu")
    .setColor(epic)
    .setDescription("\"Sluuuuuurpppp!\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Grogu** was a Force-sensitive infant of the same species as Yoda wanted by the Empire for his powers, although he was sheltered and nurtured by Din Djarin. Djarin eventually gave Grogu to Luke Skywalker to train for his new Jedi Order.")
    .setImage("https://imgix.bustle.com/uploads/image/2020/12/2/b589250f-4a53-4a9b-aa1a-e55185a7810c-baby-yoda-main.jpg?w=1200&h=630&fit=crop&crop=faces&fm=jpg")
const thrawn=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Grand Admiral Thrawn")
    .setColor(epic)
    .setDescription("\"To defeat an enemy, you must know them. Not simply their battle tactics, but their history. Philosophy. **Art.**\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Grand Admiral Thrawn** was a notoriously effective Imperial strategist who was surprisingly gentle to both his subordinates and his enemies and believed in truly understanding and respecting an enemy and their culture in order to effectively counter them.")
    .setImage("https://starwarsblog.starwars.com/wp-content/uploads/2017/06/thrawn-tall.jpg")
const ezra=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Ezra Bridger")
    .setColor(epic)
    .setDescription("\"How we choose to fight is just as important as what we fight for.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Ezra Bridger** was a selfish Lothal pickpocket who joined the crew of the *Ghost*, fighting in the Rebellion, and adopted the ways of the Jedi from Kanan Jarrus, becoming a more heroic Rebel and fighting for the Liberation of Lothal.")
    .setImage("https://img.cinemablend.com/filter:scale/quill/a/1/1/0/4/d/a1104d6a7b1ec7f90adc06b42d30dc3f1b22c34f.jpg?fw=1200")
const windu=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Mace Windu")
    .setColor(epic)
    .setDescription("\"We fight for justice because justice is the fundamental bedrock of civilization: an unjust civilization is built upon sand. It does not long survive a storm.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Mace Windu** was a senior Jedi Master and one of the chief Republic strategists in the Clone Wars. He was killed by Anakin Skywalker after almost successfully subduing Darth Sidious.")
    .setImage("https://www.denofgeek.com/wp-content/uploads/2020/12/the-mandalorian-mace-windu.jpg?resize=768%2C432")
const kanan=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Kanan Jarrus")
    .setColor(epic)
    .setDescription("\"Your connection to the Force allows you to see in ways others cannot. If you can see yourself, you will never be truly blind.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Kanan Jarrus** was a Padawan during the Clone Wars and one of the few Jedi survivors of Order 66. He operated the *Ghost* with his wife Hera. He joined the Rebellion but was permanently blinded during a duel with Darth Maul, forcing him to see the world through the Force.")
    .setImage("https://rpggamer.org/uploaded_images/maxresdefault%20(4).jpg")
const cad=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Cad Bane")
    .setColor(epic)
    .setDescription("\"Cad Bane, at yer service. I'll take on any job... fer da right price.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Cad Bane** was the most infamous bounty hunter in the galaxy during the Clone Wars, once holding the Senate itself hostage or staging the largest prison break in history.")
    .setImage("https://insidethemagic-119e2.kxcdn.com/wp-content/uploads/2020/12/cad-bane-550x413.jpg")
const sabine=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Sabine Wren")
    .setColor(epic)
    .setDescription("\"That might be the Mandalorian way, but it's not *my* way. Not anymore.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Sabine Wren** was a Mandalorian graffiti artist and Imperial Academy dropout who joined the crew of the *Ghost* and fought in the Rebellion. She once held the Darksaber but chose to pass on the responsibility and leave behind her Mandalorian heritage.")
    .setImage("http://i.kinja-img.com/gawker-media/image/upload/s--jCszNkzl--/c_scale,fl_progressive,q_80,w_800/a8mpghcswcxue4twjmwl.jpg")
const hera=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Hera Syndulla")
    .setColor(epic)
    .setDescription("\"It doesn't matter where we come from, Admiral. Our will to be free is what's going to beat you.\"\n\nFranchise: Star Wars\nRarity: **Epic**\n\n**Hera Syndulla** was the Twi'lek pilot of the *Ghost* and one of the best squadron leaders of the Rebellion, having enormous faith in its cause.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/hera-syndulla-s3_cf5e7f07.jpeg?region=0%2C8%2C1560%2C781")
const revan=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Revan")
    .setColor(rare)
    .setDescription("\"**Peace is a lie**. There is only passion.\nThrough passion, I gain strength.\nThrough strength, I gain power.\nThrough power, I gain victory.\nThrough victory, my chains are broken.\n***The Force will set me free.***\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Revan** was originally a Jedi Master, until he was drawn to the Dark Side to become the Sith Lord **Darth Revan**, and later was brainwashed back to the light. He played a pivotal role throughout the entirety of the Old Republic Era.")
    .setImage("https://i.ytimg.com/vi/TEZBFGw2uWs/maxresdefault.jpg")
const jabba=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Jabba the Hutt")
    .setColor(rare)
    .setDescription("\"Ah ha ha ha ha!\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Jabba the Hutt** was a Hutt crime lord based on Tatooine who commanded massive influence throughout the galaxy.")
    .setImage("https://starwarsblog.starwars.com/wp-content/uploads/2018/08/jabba-the-hut-palace-3.jpg")
const snoke=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Supreme Leader Snoke")
    .setColor(rare)
    .setDescription("\"I watched the Galactic Empire rise, and then fall. The gullible prattle on about the triumph of truth and justice, of individualism and free will. As if such things were solid and real instead of simple subjective judgments. The historians have it all wrong. It was neither poor strategy nor arrogance that brought down the Empire. You know too well what did.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Supreme Leader Snoke** was the founder of the First Order and the mentor of Kylo Ren. He was a clone of Palpatine and was designed to ready the galaxy for him.")
    .setImage("https://www.indiewire.com/wp-content/uploads/2017/12/snoke-lucasfilm.jpg")
const padme=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Padme Amidala")
    .setColor(rare)
    .setDescription("\"So this is how liberty dies. In thunderous applause.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Padme Amidala** was the Queen of Naboo and during the Clone Wars a Senator for it. She also had a forbidden affair with Anakin Skywalker.")
    .setImage("https://media.wired.com/photos/5dcde20af348560008126104/2:1/w_5078,h_2539,c_limit/Padme-C5DDGY-SOURCE-Moviestore-Collection-Alamy.jpg")
const rey=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Rey Skywalker")
    .setColor(rare)
    .setDescription("\"People keep telling me they know me. I'm afraid no one does.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Rey** was an Force-sensitive orphan from Jakku who was trained by Luke Skywalker and defeated Darth Sidious, redeeming Kylo Ren and adopting the surname **Skywalker**.")
    .setImage("https://img.cinemablend.com/filter:scale/quill/e/d/2/e/2/4/ed2e24c30510fe740bbbc729a403b7ba9ee4159d.jpg?mw=600")
const jyn=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Jyn Erso")
    .setColor(rare)
    .setDescription("\"We have hope. Rebellions are *built* on hope!\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Jyn Erso** was a criminal who joined the Rebellion, leading *Rogue One* and sacrificing her life to secure the plans to the Death Star so that it could be destroyed.")
    .setImage("https://i.pinimg.com/originals/0a/d5/19/0ad519f29d64d0d78b45b430206cda6a.jpg")
const satine=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Satine Kryze")
    .setColor(rare)
    .setDescription("\"I remember a time when Jedi were not generals, but peacekeepers.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Satine Kryze** was the Duchess of Mandalore, a staunch pacifist who tried to quell the Mandalorian urges to war, and the lover of Obi-Wan Kenobi.")
    .setImage("https://am21.mediaite.com/tms/cnt/uploads/2014/03/databank_duchesssatinekryze_01_169_8f214c2b-650x366.jpeg")
const hondo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Hondo Ohnaka")
    .setColor(rare)
    .setDescription("\"Let me warn you, you are not the first laser-sword wielding *maniac* I've had to deal with! And Hondo Ohnaka survives *every* time!\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Hondo Ohnaka** was a powerful pirate leader during the Clone Wars, always sniffing out profit even from the most dangerous places, and after the rise of the Empire he continued on as a solo pirate.")
    .setImage("https://www.jedinews.com/wp-content/uploads/2016/09/Pic-6-Hondo-696x467.jpg")
const zeb=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Garazeb Orrelios")
    .setColor(rare)
    .setDescription("\"What happened on Lasan, it's over for me. I've moved on.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Garazeb Orrelios**, better known as **Zeb**, was a Lasat captain, one of the only survivors of the destruction of Lasan. He later joined the crew of the *Ghost* and fought in the Rebellion.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/zeb-orellios-s3_1587d51d.jpeg?region=0%2C49%2C1560%2C780")
const viszla=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Pre Viszla")
    .setColor(rare)
    .setDescription("\"For generations, my ancestors fought proudly as warriors against the Jedi.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Pre Viszla** was a Mandalorian of Clan Viszla, the wielder of the Darksaber and leader of Death Watch. He advocated the Mandalorian warrior faith and briefly ruled Mandalore before his death in trial by combat.")
    .setImage("https://live.staticflickr.com/8191/8406766434_b6e3d64184_b.jpg")
const poe=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Poe Dameron")
    .setColor(rare)
    .setDescription("\"We are the spark that'll light the fire that'll burn the First Order down.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Poe Dameron** was a spice runner on Kijimi before becoming a pilot for the Resistance and eventually acting General of the Resistance.")
    .setImage("https://img.cinemablend.com/filter:scale/quill/c/0/d/2/f/0/c0d2f05348ee6b23e77a465b7790d417dd646fc2.jpg?fw=1200")
const finn=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Finn")
    .setColor(rare)
    .setDescription("\"I was raised to fight... for the first time I had something to fight for.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**FN-2187** was a stormtrooper for the First Order who defected after seeing the horrors he was causing and joined the Resistance under the name **Finn**.")
    .setImage("https://www.cbr.com/wp-content/uploads/2021/03/Star-Wars-Finn-Stormtrooper.jpg")
const jango=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Jango Fett")
    .setColor(rare)
    .setDescription("\"I'm just a simple man trying to make my way in the universe.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Jango Fett** was a Mandalorian foundling who went on to be one of the most infamous bounty hunters ever. The Kaminoans used his genetic template to commission a massive clone army for the Jedi.")
    .setImage("https://i.ytimg.com/vi/-tEmnJVlm8w/maxresdefault.jpg")
const savage=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Savage Opress")
    .setColor(rare)
    .setDescription("\"Brother, I'm an unworthy apprentice. I'm not like you. I never was.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Savage Opress** was brainwashed and used as a tool of the Nightsisters for revenge against Count Dooku, although he had a mind of his own and escaped with his brother Darth Maul.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/databank_savageopress_01_169_02e79834.jpeg?region=0%2C0%2C1560%2C878&width=960")
const ventress=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Asajj Ventress")
    .setColor(rare)
    .setDescription("\"I am fear. I am the queen of a blood-soaked planet and an architect of genocide.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Asajj Ventress** was a Sith assassin of Count Dooku and a former Nightsister. After Dooku's betrayal, Ventress sought revenge on him, and eventually turned from the Dark Side and became a bounty hunter.")
    .setImage("https://static.wikia.nocookie.net/starwars/images/4/4f/Ventress-SWE.jpg/revision/latest?cb=20120317173552")
const bokatan=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Bo-Katan Kryze")
    .setColor(rare)
    .setDescription("\"Not all Mandalorians are bounty hunters. Some of us serve a higher purpose.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Bo-Katan Kryze** was a Mandalorian believer in the warrior faith and opposed its pacifist reign by Duchess Satine. After its rule by Maul, however, she rebelled against him, and remained a rebel against Imperial occupation. She once united Mandalore using the Darksaber but the saber was taken from her and she lost Mandalore to the Empire.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/playlist-bo-katan-mando-169_a44ca874.jpeg?region=0%2C40%2C1280%2C640")
const qira=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Qi'ra")
    .setColor(rare)
    .setDescription("\"The object isn't to win, it's just to stay in it as long as you can.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Qi'ra** was a Correllian criminal who worked for Darth Maul, and a former lover of Han Solo.")
    .setImage("http://images6.fanpop.com/image/photos/41000000/Emilia-Clarke-in-Solo-A-Star-Wars-Story-movie-picture-emilia-clarke-41008671-669-279.jpg")
const fisto=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Kit Fisto")
    .setColor(rare)
    .setDescription("\"Those who have power should restrain themselves from using it.\"\n\nFranchise: Star Wars\nRarity: **Rare**\n\n**Kit Fisto** was a wise Nautolan Jedi Master during the Clone Wars who was personally killed by Darth Sidious.")
    .setImage("https://static.wikia.nocookie.net/swfanon/images/2/26/Kit_Fisto_dual_sabers.png/revision/latest?cb=20160603161006")
const bossk=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Bossk")
    .setColor(uncommon)
    .setDescription("\"I had brothers when I was spawned. And you know what? **I ate them.**\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Bossk** was an infamous Trandoshan bounty hunter specializing in Wookies.")
    .setImage("https://hips.hearstapps.com/digitalspyuk.cdnds.net/18/20/1526578550-bossk-star-wars.jpg?crop=0.6375xw:1xh;center,top&resize=480:*")
const bane=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Darth Bane")
    .setColor(uncommon)
    .setDescription("\"Equality is a lie, a myth to appease the masses. Simply look around and you will see the lie for what it is! There are those with power, those with the strength and will to lead. And there are those meant to follow — those incapable of anything but servitude and a meager, worthless existence.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Darth Bane** was an infamous Sith Lord who devised the Rule of Two.")
    .setImage("https://www.small-screen.co.uk/wp-content/uploads/2020/10/darth-bane-star-wars-disney-plus-darth-revan.jpg")
const dune=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Cara Dune")
    .setColor(uncommon)
    .setDescription("\"I'm shooting my way out of here.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Carasynthia Dune** was an Alderaanian mercenery who eventually assigned as Marshal of Nevarro by the New Republic.")
    .setImage("https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/826040f5-466d-4fe5-ad72-dbcdfd174c26/de7in9y-5b52012c-e20e-4aa4-8186-2d441fdef81b.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOiIsImlzcyI6InVybjphcHA6Iiwib2JqIjpbW3sicGF0aCI6IlwvZlwvODI2MDQwZjUtNDY2ZC00ZmU1LWFkNzItZGJjZGZkMTc0YzI2XC9kZTdpbjl5LTViNTIwMTJjLWUyMGUtNGFhNC04MTg2LTJkNDQxZmRlZjgxYi5wbmcifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6ZmlsZS5kb3dubG9hZCJdfQ.65YMjETBNKWbVqkjZ_Q5XfXYzH_xEtgxaBVKTes8bfM")
const andor=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Cassian Andor")
    .setColor(uncommon)
    .setDescription("\"You're not the only one who lost everything. Some of us just decided to do something about it.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Cassian Andor** was a Separatist during the Clone Wars, and became a Rebel pilot during the Imperial era, joining the crew of *Rogue One*.")
    .setImage("https://starwarsblog.starwars.com/wp-content/uploads/2018/11/diego-luna-cassian-andor-tall-A.jpg")
const beckett=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Tobias Beckett")
    .setColor(uncommon)
    .setDescription("\"Assume everyone will betray you and you'll never be disappointed.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Tobias Beckett** was a hardened Crimson Dawn criminal and thief who acted as a mentor for Han Solo before betraying him.")
    .setImage("https://www.fanthatracks.com/wp-content/uploads/2018/05/CountdownToSolo_16_COVER.jpg")
const organa=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Bail Organa")
    .setColor(uncommon)
    .setDescription("\"The simplest gesture of kindness can fill a galaxy with hope.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Bail Organa** was an influential Senator from Alderaan, a notable pacifist and Rebel sympathizer, and the father of Leia Organa.")
    .setImage("https://am21.mediaite.com/tms/cnt/uploads/2016/12/bail-organa.jpeg")
const tarkin=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Grand Moff Tarkin")
    .setColor(uncommon)
    .setDescription("\"The Jedi Code prevents them from going far enough to achieve victory, to do whatever it takes to win, the very reason why peacekeepers should not be leading a war.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Wilhuff Tarkin** was a captain in the Republic who was critical of the peaceful methods of the Jedi. He gained favor with the Emperor and became a Grand Moff in the Empire, overseeing the Death Star project.")
    .setImage("https://www.retrozap.com/wp-content/uploads/2015/08/TarkinBattleOfYavin_cover.png")
const rex=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Captain Rex")
    .setColor(uncommon)
    .setDescription("\"In my book, experience outranks everything.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**CT-7567**, better known as **Captain Rex**, was a clone of Jango Fett who served in the Republic's clone army as a Captain. One of the few clones to escape the Empire's command by removing his microchip, he lived in exile in Seelos until joining the crew of the *Ghost* and fighting in the Rebellion.")
    .setImage("https://64.media.tumblr.com/6f3ec019816b62971391e04835549333/2b1d1a17cd574eb0-c5/s500x750/5bb6b3d9556c1b6b2f401d1ed92a68285f6c0a81.jpg")
const kaytoo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... K-2SO")
    .setColor(uncommon)
    .setDescription("\"You are being rescued, please do not resist.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**K-2SO** was a reprogrammed Imperial droid working for the Rebellion on the crew of *Rogue One*.")
    .setImage("https://s.abcnews.com/images/Entertainment/HT-k2so-rogue-one-jef-170111_16x9_992.jpg")
const chirrut=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Chirrut Îmwe")
    .setColor(uncommon)
    .setDescription("\"I am one with the Force and the Force is with me.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Chirrut Îmwe** was a blind monk, a Guardian of the Whills, who has an intense belief in the Force despite having no powers. He works for the Rebellion on the crew of *Rogue One*.")
    .setImage("https://i.ytimg.com/vi/znfIhAXUfmE/maxresdefault.jpg")
const kallus=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Agent Kallus")
    .setColor(uncommon)
    .setDescription("\"By the light of Lothal's moons...\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Alexsandr Kallus** was an Imperial Agent tasked with snuffing out Rebellion on Lothal, although after being stranded on an ice moon with rebel Garazeb Orrelios he begins to question his Imperial overseers and act as a Rebel spy for Lothal under the codename Fulcrum.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/agent-kallus-s3_46fb5ec2.jpeg?region=33%2C0%2C1527%2C764")
const aurra=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Aurra Sing")
    .setColor(uncommon)
    .setDescription("\"I never took you for a coward.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Aurra Sing** was a ruthless bounty hunter during the Clone Wars, and a former member of Hondo Ohnaka's team.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/databank_aurrasing_01_169_dce3aa30.jpeg?region=0%2C0%2C1560%2C780")
const son=new Discord.MessageEmbed()
    .setTitle("You have unlocked... The Son")
    .setColor(uncommon)
    .setDescription("\"How simple you make it. *Light* and *Dark*. As if there is one without the other.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\nThe **Son** was one of the three Force-wielders of Mortis. He was the embodiment of the Dark Side of the Force.")
    .setImage("https://static.wikia.nocookie.net/starwars/images/2/2a/Epguide316.jpg/revision/latest?cb=20120312233700")
const gideon=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Moff Gideon")
    .setColor(uncommon)
    .setDescription("\"You have something I want. You may think you have some idea of what you are in possession of, **but you do not.** In a few moments it will be mine. **It means more to me than you will ever know.**\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Moff Gideon** was an Imperial officer in the ISB. After the Fall of the Republic, Gideon banded together the Imperial remnants into his own force, try to capture Grogu for his blood. Gideon was also the wielder of the Darksaber, although he lost it to Din Djarin.")
    .setImage("https://boundingintocomics.com/wp-content/uploads/2020/12/2020.12.18-07.47-boundingintocomics-5fdd0757222fb.png")
const inquisitor=new Discord.MessageEmbed()
    .setTitle("You have unlocked... The Grand Inquisitor")
    .setColor(uncommon)
    .setDescription("\"There are some things far more frightening than death.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**The Grand Inquisitor** was a Jedi Temple Guard who fell to the Dark Side before Order 66. He was trained by Darth Vader as head of the Inquisitorius, tasked with hunting down and exterminating the remnants of the Jedi Order.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/image_253e49bc.jpeg?region=0%2C0%2C1600%2C900&width=960")
const ig=new Discord.MessageEmbed()
    .setTitle("You have unlocked... IG-88")
    .setColor(uncommon)
    .setDescription("\"I think, therefore I am. I destroy, therefore I endure.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**IG-88** was an assassin droid and bounty hunter during the Imperial era who once worked for Darth Vader, trying to capture Han Solo and the rebels.")
    .setImage("https://pm1.narvii.com/6032/0bcc588e86d30e3af209d1541cbdb217dbf44da0_hq.jpg")
const malbus=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Baze Malbus")
    .setColor(uncommon)
    .setDescription("\"They destroyed our home. I will kill them.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Baze Malbus** was a former Guardian of the Whills who joined the crew of *Rogue One* and fought in the Rebellion, being good friends with Chirrut Imwe.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/mwc-35c-repeating-cannon-main_46aa5a0e.jpeg?region=0%2C0%2C1560%2C878&width=960")
const krennic=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Director Krennic")
    .setColor(uncommon)
    .setDescription("\"We were on the verge of greatness, we were *this* close to providing peace and security to the galaxy.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Orson Krennic** was a Republic commander in the Clone Wars who became a Director of Military Research in the Empire, responsible for the creation of the original Death Star, although he died in its blast.")
    .setImage("https://www.denofgeek.com/wp-content/uploads/2016/12/rogue-one-orson-krennic.png?fit=1280%2C720")
const hux=new Discord.MessageEmbed()
    .setTitle("You have unlocked... General Hux")
    .setColor(uncommon)
    .setDescription("\"We have them tied on the end of a string.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Armitage Hux** was a General of the First Order who disapproved of Kylo Ren and eventually acted as a mole for the New Republic within the First Order, which he was executed for.")
    .setImage("https://compote.slate.com/images/54d2a699-638a-48fc-984b-ffc4247bea8f.png?width=780&height=520&rect=952x635&offset=92x0")
const plo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Plo Koon")
    .setColor(uncommon)
    .setDescription("\"Sorrow is a part of life as well as joy. There are gifts to be found, even in death and sorrow... strange gifts.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Plo Koon** was a wise and respected Jedi Master during the Clone Wars, notable for originally recruiting Ahsoka Tano.")
    .setImage("https://starwarsblog.starwars.com/wp-content/uploads/2019/07/plo-koon.jpg")
const rook=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Bodhi Rook")
    .setColor(uncommon)
    .setDescription("\"We are all on the same side. If you see past the uniform for a minute.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Bodhi Rook** was an Imperial pilot who defected and joined the Rebellion on the crew of *Rogue One*.")
    .setImage("https://imgix.bustle.com/inverse/f0/8b/01/f7/da16/40df/ac18/e2f8a3799280/rook12png.png?w=1200&h=630&fit=crop&crop=faces&fm=jpg")
const barriss=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Barriss Offee")
    .setColor(uncommon)
    .setDescription("\"My attack on the temple was an attack on what the Jedi have become - an army fighting for the Dark Side, fallen from the light that we once held so dear. This Republic is ***FAILING!*** It's only a matter of time.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Barriss Offee** was the Jedi Padawan of Luminara Unduli. However, she became disillusioned with the ways of the Jedi during the Clone Wars and bombed the Jedi Temples in protest.")
    .setImage("https://www.comicbasics.com/wp-content/uploads/2018/05/Barriss-Offee.jpg")
const bendu=new Discord.MessageEmbed()
    .setTitle("You have unlocked... The Bendu")
    .setColor(uncommon)
    .setDescription("\"The Jedi and Sith wield the Ashla and the Bogon. The Light and the Dark. I'm the one in the middle. **The Bendu**.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**The Bendu** was an ancient Force residing on Atollon for millennia, having great wisdom but remaining aloof from the ways of the Jedi or Sith.")
    .setImage("https://static0.cbrimages.com/wordpress/wp-content/uploads/2020/01/bendu-kannan-star-wars-rebels.jpg")
const father=new Discord.MessageEmbed()
    .setTitle("You have unlocked... The Father")
    .setColor(uncommon)
    .setDescription("\"You have a very simple view of the universe. I am neither Sith nor Jedi.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**The Father** was one of the three Force-wielders of Mortis; he was the physical embodiment of balance in the Force. He tried to recruit Anakin Skywalker as the Chosen One to become his successor as the gatekeeper of the Force, putting him through a test of his balance.")
    .setImage("https://assets1.ignimgs.com/2017/04/18/father-1492474485808.png")
const shaakti=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Shaak Ti")
    .setColor(uncommon)
    .setDescription("\"Unity wins war, gentlemen.\"\n\nFranchise: Star Wars\nRarity: **Uncommon**\n\n**Shaak Ti** was a Jedi Master during the Clone Wars who was responsible for overseeing and defending the Kaminoan cloning facility, and one of the few survivors of Order 66, although she was killed by Vader's Inquisitors.")
    .setImage("https://comicvine1.cbsistatic.com/uploads/original/11134/111341901/7547836-9134464306-73510.jpg")
const shand=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Fennec Shand")
    .setColor(common)
    .setDescription("\"Make the best deal for yourself and survive.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Fennec Shand** was a Tatooine mercenary and assassin left for dead by Toro Calican, although she was rescued by Boba Fett and became his right hand man.")
    .setImage("https://dorksideoftheforce.com/files/2020/12/the-mandalorian-chapter-14-fennec-02.jpg")
const krell=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Pong Krell")
    .setColor(common)
    .setDescription("\"Because I can. Because you fell for it. *Because you're inferior*.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Pong Krell** was a Jedi General during the Clone Wars who had a severe prejudice against clones, seeing them as fundamentally inferior life forms, with no regard for their life. An extremely successful general, albeit with the highest casualty rate in the Republic, he was eventually executed for treason when trying to join the Separatists.")
    .setImage("https://cdna.artstation.com/p/assets/images/images/023/118/110/large/alexandr-elichev-swd-k0754-d1870-25488-b1generalkrelld-alexandrelichev.jpg?1578159127")
const talzin=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Mother Talzin")
    .setColor(common)
    .setDescription("\"To betray one's self is the ultimate defeat.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Mother Talzin** was the matriarch of the Dathomirian Nightsisters, and one of the most powerful magick users ever. She was one of the only survivors of Count Dooku's massacre of Dathomir.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/databank_mothertalzin_01_169_50fa6fd0.jpeg?region=0%2C0%2C1560%2C878&width=960")
const greedo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Greedo")
    .setColor(common)
    .setDescription("\"Koona t'chuta Solo?\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Greedo** was a Rodian bounty hunter who was hired by the Separatists in the Clone Wars, and later was hired to capture Han Solo for Jabba the Hutt.")
    .setImage("https://www.cnet.com/a/img/63RZoGhxTSxqAp1HVW5pRd33ngc=/940x0/2015/11/30/ecd7a68d-ccd4-44a5-8768-6da9b1ace572/greedo.jpg")
const luminara=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Luminara Unduli")
    .setColor(common)
    .setDescription("\"We suffer a great many losses in these battles. Too many.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Luminara Unduli** was a Jedi Master during the Clone Wars who trained Barriss Offee.")
    .setImage("https://cdn.jwplayer.com/v2/media/ZzzD6bQb/poster.jpg?width=720")
const rose=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Rose Tico")
    .setColor(common)
    .setDescription("\"That's how we're gonna win. Not fighting what we hate, saving what we love.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Rose Tico** was a Resistance maintenance worker who joined the search on Canto Bight for the Master Codebreaker and participated in the Battle of Crait.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/rose-tico-main_cbac29b9.jpeg?region=0%2C113%2C1281%2C641")
const bb=new Discord.MessageEmbed()
    .setTitle("You have unlocked... BB-8")
    .setColor(common)
    .setDescription("\"Bree wrrrrp! Wrrrr beep beep!\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**BB-8** was a BB astromech droid who worked for Poe Dameron and helped the Resistance. He also held a crucial part of the map to Luke Skywalker's exile.")
    .setImage("https://www.denofgeek.com/wp-content/uploads/2020/03/ae163166eb4a92bed505e6adcdcbc895.jpg?resize=768%2C432")
const greef=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Greef Karga")
    .setColor(common)
    .setDescription("\"The Empire is gone, Mando. All that is left is mercenaries and warlords.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Greef Karga** was an agent for the Bounty Hunters' Guild who became the Magistrate of Nevarro for the New Republic following its Imperial occupation.")
    .setImage("https://static.wikia.nocookie.net/disney/images/6/69/The-Mandalorian-Screen-3.jpg/revision/latest?cb=20190414183208")
const gunray=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Nute Gunray")
    .setColor(common)
    .setDescription("\"In time, the suffering of your people will persuade you to see our point of view.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Nute Gunray** was a Viceroy of the Trade Federation who joined the Separatist Alliance at the beginning of the Clone Wars.")
    .setImage("https://assets.change.org/photos/2/jp/wo/sMjPwOJvVEWthxB-1600x900-noPad.jpg?1526868476")
const chopper=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Chopper")
    .setColor(common)
    .setDescription("\"Choppppp, chopchopchop!\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**C1-10P**, better known as **Chopper**, was Hera Syndulla's astromech droid and a key member of the crew of the *Ghost*.")
    .setImage("https://fastly.syfy.com/sites/syfy/files/styles/1200x680/public/chopper-star-wars-rebels-hero.jpg?offset-y=0")
const daughter=new Discord.MessageEmbed()
    .setTitle("You have unlocked... The Daughter")
    .setColor(common)
    .setDescription("\"My nature is to do what is selfless.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**The Daughter** is one of the three Force-wielders of Mortis. She is an embodiment of the Light Side of the Force, and the first of the Force-wielders to be killed.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/databank_daughter_01_169_e42fc3ce.jpeg?region=0%2C19%2C1560%2C780")
const jarjar=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Jar Jar Binks")
    .setColor(common)
    .setDescription("\"Mesa called Jar Jar Binks, mesa your humble servant!\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Jar Jar Binks** is a Gungan who aids Qui-Gon Jinn and later helps the Republic during the Clone Wars.")
    .setImage("https://pbs.twimg.com/media/D0ef0MhX0AIdLjo.jpg")
const cham=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Cham Syndulla")
    .setColor(common)
    .setDescription("\"Not a terrorist, but a freedom fighter.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Cham Syndulla** was a Twi'lek freedom fighter for Ryloth, whom some considered an extremist. He was the father of Hera Syndulla.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/cham-syndulla_322e71bd.jpeg?region=38%2C0%2C1618%2C809")
const vos=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Dryden Vos")
    .setColor(common)
    .setDescription("\"Once you're part of Crimson Dawn, you can't leave.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Dryden Vos** was a high ranking member of Crimson Dawn who tried to kill Han Solo after having a coaxium shipment stolen.")
    .setImage("https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/paul-bettany-as-dryden-vos-1610450794.jpg")
const holdo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Vice Admiral Holdo")
    .setColor(common)
    .setDescription("\"Hope is like the sun. If you only believe in it when you see it, you'll never make it through the night.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Amilyn Holdo** was a Vice Admiral of the Resistance known for devising the Holdo Maneuver, a hyperspace ram through an enemy ship.")
    .setImage("https://d.newsweek.com/en/full/749838/holdo.jpg")
const mayfeld=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Migs Mayfeld")
    .setColor(common)
    .setDescription("\"Look, I'm just sayin', we're all the same. Everyone's got their lines they don't cross... until things get messy. As far as I'm concerned, if you can make it through the day and still sleep at night, you're doin' better than most.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Migs Mayfeld** was a former Imperial sharpshooter who became a freelance mercenary and went to prison. Eventually, he was illegally released from prison by Cara Dune after helping her team.")
    .setImage("https://img.cinemablend.com/filter:scale/quill/4/9/e/f/0/8/49ef0851b9fcf11928ee44e1c3f2128d52df3fcf.jpg?mw=600")
const embo=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Embo")
    .setColor(common)
    .setDescription("\"You're outmanned, laserblade.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Embo** was a famous bounty hunter during the Clone Wars who had a weaponized hat.")
    .setImage("https://i.pinimg.com/originals/c5/fc/ce/c5fcce4a7682e174a35b8ac860e259a2.jpg")
const gallia=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Adi Gallia")
    .setColor(common)
    .setDescription("\"Better a few faithful supporters than a wealth of false friends.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Adi Gallia** was a Jedi Master during the Clone Wars.")
    .setImage("https://i.insider.com/5e010965954bda48e207dfc9?width=1000&format=jpeg&auto=webp")
const mundi=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Ki-Adi-Mundi")
    .setColor(common)
    .setDescription("\"What about the droid attack on the Wookies?\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Ki-Adi-Mundi** was a Jedi Master during the Clone Wars.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/databank_kiadimundi_01_169_0a8842d3.jpeg?region=0%2C0%2C1560%2C878&width=960")
const pryce=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Governor Pryce")
    .setColor(common)
    .setDescription("\"I serve the Empire until the end.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Governor Pryce** was Imperial Governor of Lothal during the beginning of the Rebellion.")
    .setImage("https://i0.wp.com/MynockManor.com/wp-content/uploads/2016/08/Governor-Arihnda-Pryce-Defiant-Until-the-End.png")
const secura=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Aayla Secura")
    .setColor(common)
    .setDescription("\"Isn't liberty worth fighting for?\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Aayla Secura** was a Jedi Master during the Clone Wars.")
    .setImage("https://44.media.tumblr.com/7bc4c8dc7355388b4e4424d9b88120e4/8da36ee8702ada8c-9a/s1280x1920_f1/2896d4174a1a1cf6a4f932f21c88b690bf650f9c.gifv")
const quinlan=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Quinlan Vos")
    .setColor(common)
    .setDescription("\"Jedi aren't without emotion. We're allowed to grieve.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Quinlan Vos** was an unorthodox Jedi Master and an expert tracker. He fell to the Dark Side in his fight against the Sith but eventually returned to the light thanks to Asajj Ventress.")
    .setImage("https://oyster.ignimgs.com/wordpress/stg.ign.com/2017/03/quinlan-vos.jpg")
const mothma=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Mon Mothma")
    .setColor(common)
    .setDescription("\"What they do not realize and the reason they are doomed to failure is that all the power in the universe comes from free and willful investing of power from one person to another.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Mon Mothma** was a Senator in the Republic during the Clone Wars, and as an Imperial Senator was as a Rebel sympathizer. She was the first Chancellor of the New Republic.")
    .setImage("https://starwarsblog.starwars.com/wp-content/uploads/2017/04/mon-mothma-rogue-one-tall.jpg")
const sister=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Seventh Sister")
    .setColor(common)
    .setDescription("\"Well then my brave young boy... come and prove it!\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**The Seventh Sister** was a former Jedi Padawan who survived Order 66 and joined Darth Vader's Inquisitorius to hunt down the remaining Jedi.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/seventh-sister_f5c85134.jpeg?region=0%2C0%2C1560%2C878&width=960")
const phasma=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Captain Phasma")
    .setColor(common)
    .setDescription("\"I fought for everything that I have, every bit of what I am.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Captain Phasma** was a stormtrooper captain in the First Order who was killed by former stormtrooper Finn.")
    .setImage("https://media1.popsugar-assets.com/files/thumbor/hD6ds503UJGF9fTI4zQhliHNphQ/fit-in/728xorig/filters:format_auto-!!-:strip_icc-!!-/2017/12/18/710/n/41541398/tmp_yDQvWF_82d42c9b710c461c_captain_phasma.0.jpg")
const brother=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Fifth Brother")
    .setColor(common)
    .setDescription("\"I care not for your struggles.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**The Fifth Brother** was an Inquisitor who was part of Darth Vader's Inquisitorius.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/strangers-in-the-night-sw_cd5063d1.jpeg?region=0%2C120%2C1920%2C960&width=960")
const ackbar=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Admiral Ackbar")
    .setColor(common)
    .setDescription("\"It's a trap!\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Admiral Ackbar** was a royal Mon Cala Captain during the Clone Wars and later an admiral of the Rebellion who led the assault on Endor.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/databank_ackbar_01_169_55137220.jpeg?region=0%2C49%2C1560%2C780")
const enfys=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Enfys Nest")
    .setColor(common)
    .setDescription("\"We're not marauders. We're allies, and the war has just begun.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Enfys Nest** was the leader of the pirate band the Cloud-Riders, and she fought against the criminal syndicate Crimson Dawn.")
    .setImage("https://www.slashfilm.com/wp/wp-content/images/enfys-nest.jpeg")
const zorii=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Zorii Bliss")
    .setColor(common)
    .setDescription("\"That's how they win... by making you think you're alone.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Zorii Bliss** was the leader of the Spice Runners of Kijimi and had a former relationship with Poe Dameron.")
    .setImage("https://www.denofgeek.com/wp-content/uploads/2019/12/star-wars-the-rise-of-skywalker-zorii-bliss.jpg?fit=2500%2C1250")
const maz=new Discord.MessageEmbed()
    .setTitle("You have unlocked... Maz Kanata")
    .setColor(common)
    .setDescription("\"If you live long enough, you see the same eyes in different people.\"\n\nFranchise: Star Wars\nRarity: **Common**\n\n**Maz Kanata** was an wise and ancient collector of antiques, including the Skywalker saber.")
    .setImage("https://lumiere-a.akamaihd.net/v1/images/tfa-db-maz-kanata-main-image_5022305c.jpeg?region=0%2C0%2C1560%2C878&width=960")

// character lists
list = [vader, kenobi, yoda, solo, luke, ahsoka, mando, artoo, palpatine, maul, boba, chewie, leia, threepio, kylo, dooku, quigon, lando, grievous, grogu, thrawn, ezra, windu, kanan, cad, sabine, hera, revan, jabba, snoke, padme, rey, jyn, satine, hondo, zeb, viszla, poe, finn, jango, savage, ventress, bokatan, qira, fisto, bossk, bane, dune, andor, beckett, organa, tarkin, rex, kaytoo, chirrut, kallus, aurra, son, gideon, inquisitor, ig, malbus, krennic, hux, plo, rook, barriss, bendu, father, shaakti, shand, krell, talzin, greedo, luminara, rose, bb, greef, gunray, chopper, daughter, jarjar, cham, vos, holdo, mayfeld, embo, gallia, mundi, pryce, secura, quinlan, mothma, sister, phasma, brother, ackbar, enfys, zorii, maz]
names = ["Darth Vader","Obi-Wan Kenobi","Master Yoda","Han Solo","Luke Skywalker","Ahsoka Tano","The Mandalorian","R2-D2","Emperor Palpatine","Darth Maul","Boba Fett","Chewbacca","Leia Organa","C-3PO","Kylo Ren","Count Dooku","Qui-Gon Jinn","Lando Calrissian","General Grievous","Grogu","Grand Admiral Thrawn","Ezra Bridger","Mace Windu","Kanan Jarrus","Cad Bane","Sabine Wren","Hera Syndulla","Revan","Jabba the Hutt","Supreme Leader Snoke","Padme Amidala","Rey Skywalker","Jyn Erso","Satine Kryze","Hondo Ohnaka","Garazeb Orrelios","Pre Viszla","Poe Dameron","Finn","Jango Fett","Savage Opress","Asajj Ventress","Bo-Katan Kryze","Qi'ra","Kit Fisto","Bossk","Darth Bane","Cara Dune","Cassian Andor","Tobias Beckett","Bail Organa","Grand Moff Tarkin","Captain Rex","K-2SO","Chirrut Îmwe","Agent Kallus","Aurra Sing","The Son","Moff Gideon","The Grand Inquisitor","IG-88","Baze Malbus","Director Krennic","General Hux","Plo Koon","Bodhi Rook","Barriss Offee","The Bendu","The Father","Shaak Ti","Fennec Shand","Pong Krell","Mother Talzin","Greedo","Luminara Unduli","Rose Tico","BB-8","Greef Karga","Nute Gunray","Chopper","The Daughter","Jar Jar Binks","Cham Syndulla","Dryden Vos","Vice Admiral Holdo","Migs Mayfeld","Embo","Adi Gallia","Ki-Adi-Mundi","Governor Pryce","Aayla Secura","Quinlan Vos","Mon Mothma","The Seventh Sister","Captain Phasma","The Fifth Brother","Admiral Ackbar","Enfys Nest","Zorii Bliss","Maz Kanata"]
rars=["Common","Uncommon","Rare","Epic","Legendary","Mythical"] // unweighted list of rarities
allrars=["Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Common","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Uncommon","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Rare","Epic","Epic","Epic","Epic","Epic","Epic","Epic","Epic","Epic","Epic","Epic","Epic","Epic","Epic","Legendary","Legendary","Legendary","Legendary","Legendary","Legendary","Legendary","Legendary","Legendary","Legendary","Mythical","Mythical","Mythical"]

/* --- Listening for messages --- */
client.on('message', async msg => { // setting up asynchronous process to listen
    // if mentioned, respond
    if (msg.mentions.has(client.user.username)) {
        msg.channel.send("Aloe vera, glad you mentioned me! Type `!help` for more information. Type `!info {command}` for more information on a specific command.")
    }
    if (msg.content.includes("oof")) {
        msg.channel.send("YOU EVIL UFCULTER! HOW DARE YOU!")
    }
    if (msg.content == "317") {
        msg.channel.send("<@687820912191733775> They actually did it though!!! Come back here!")
    }
    if (msg.content.substring(0,1) != prefix) { return; } // listening for prefix
    let args = msg.content.substring(prefix.length).split(" ") // reading arguments
    
    // check commands
    switch(args[0]) {
        case "button":
          msg.channel.send("Oh my god discord has buttons!!!!!!", button);
          break;
        // command to collect credits
        case "bou":
        case "bounty":
            let d = new Date() // current time
            // check if author exists in database; if not, initialize
            let exist = await db.list(msg.author.id)
            if (!exist.length) {
                await db.set(`${msg.author.id}-credits`,0)
                await db.set(`${msg.author.id}-time`,0)
                for (i=0; i<100; i++) {
                    await db.set(`${msg.author.id}-chars-${i}`,0)
                }
            }
            let curtime = await db.get(`${msg.author.id}-time`)
            let diff = d.getTime() - curtime
            if (diff > 43200000) {
                await db.set(`${msg.author.id}-time`,d.getTime())
                msg.channel.send(getcredits)
                let creds = await db.get(`${msg.author.id}-credits`)
                await db.set(`${msg.author.id}-credits`,creds+5)
            }
            else {
                let wait=new Discord.MessageEmbed()
                    .setTitle("Too Soon")
                    .setColor(basic)
                    .setDescription(`Sorry, you have to wait another **${pretty(43200000-diff, {compact: true}, {verbose: true})}** before collecting more credits.`)
                msg.channel.send(wait)
            }
            break;
        case "bank":
            if (!msg.mentions.users.first()) {balanceUser=msg.author}
            else {balanceUser=msg.mentions.users.first()}
            let exist1 = await db.list(balanceUser.id)
            if (!exist1.length) {
                await db.set(`${balanceUser.id}-credits`,0)
                await db.set(`${balanceUser.id}-time`,0)
                for (i=0; i<100; i++) {
                    await db.set(`${balanceUser.id}-chars-${i}`,0)
                }
            }
            let balamount = await db.get(`${balanceUser.id}-credits`)
            let balance = new Discord.MessageEmbed()
                .setTitle("Balance of "+balanceUser.username)
                .setColor(basic)
                .setDescription(`User's credits: **${balamount}**`)
                .setThumbnail(balanceUser.avatarURL())
            msg.channel.send(balance)
            break;
        case "help":
            msg.channel.send(help)
            break;
        case "force":
            let exist2 = await db.list(msg.author.id)
            if (!exist2.length) {
                await db.set(`${msg.author.id}-credits`,0)
                await db.set(`${msg.author.id}-time`,0)
                for (i=0; i<100; i++) {
                    await db.set(`${msg.author.id}-chars-${i}`,0)
                }
            }
            let amount = await db.get(`${msg.author.id}-credits`)
            if (amount < 3) {
                msg.channel.send(poor)
                return;
            }
            await db.set(`${msg.author.id}-credits`,amount-3)
            char=chance.weighted(nums,probs)
            let thischar = await db.get(`${msg.author.id}-chars-${char}`)
            if (!thischar) {
                msg.channel.send(list[char])
                await db.set(`${msg.author.id}-chars-${char}`,1)
            }
            else {
                if (probs[char]==21) {
                    rar = "Common"
                    refund=1
                }
                else if (probs[char]==15) {
                    rar = "Uncommon"
                    refund=2
                }
                else if (probs[char]==10) {
                    rar = "Rare"
                    refund=3
                }
                else if (probs[char]==6) {
                    rar = "Epic"
                    refund=4
                }
                else if (probs[char]==3) {
                    rar = "Legendary"
                    refund=5
                }
                else if (probs[char]==1) {
                    rar = "Mythical"
                    refund=6
                }
                let already=new Discord.MessageEmbed()
                    .setTitle("Already Unlocked")
                    .setColor(basic)
                    .setDescription(`You have already unlocked that **${rar}** character. You get a **${refund}**-credit refund.`)
                msg.channel.send(already)
                let prev = await db.get(`${msg.author.id}-credits`)
                await db.set(`${msg.author.id}-credits`,prev+refund)
            }
            break;
        case "kyb":
        case "kyber":
            let existkyb = await db.list(msg.author.id)
            if (!existkyb.length) {
                await db.set(`${msg.author.id}-credits`,0)
                await db.set(`${msg.author.id}-time`,0)
                for (i=0; i<100; i++) {
                    await db.set(`${msg.author.id}-chars-${i}`,0)
                }
            }
            amount = await db.get(`${msg.author.id}-credits`)
            if (amount < 6) {
                msg.channel.send(poor)
                return;
            }
            await db.set(`${msg.author.id}-credits`,amount-6)
            char=chance.weighted(nums2,probs2)
            thischar = await db.get(`${msg.author.id}-chars-${char}`)
            if (!thischar) {
                msg.channel.send(list[char])
                await db.set(`${msg.author.id}-chars-${char}`,1)
            }
            else {
                if (probs[char]==15) {
                    rar = "Uncommon"
                    refund=2
                }
                else if (probs[char]==10) {
                    rar = "Rare"
                    refund=3
                }
                else if (probs[char]==6) {
                    rar = "Epic"
                    refund=4
                }
                else if (probs[char]==3) {
                    rar = "Legendary"
                    refund=5
                }
                else if (probs[char]==1) {
                    rar = "Mythical"
                    refund=6
                }
                let already=new Discord.MessageEmbed()
                    .setTitle("Already Unlocked")
                    .setColor(basic)
                    .setDescription(`You have already unlocked that **${rar}** character. You get a **${refund}**-credit refund.`)
                msg.channel.send(already)
                let prev = await db.get(`${msg.author.id}-credits`)
                await db.set(`${msg.author.id}-credits`,prev+refund)
            }
            break;
        case "holo":
        case "holocron":
            let existhol = await db.list(msg.author.id)
            if (!existhol.length) {
                await db.set(`${msg.author.id}-credits`,0)
                await db.set(`${msg.author.id}-time`,0)
                for (i=0; i<100; i++) {
                    await db.set(`${msg.author.id}-chars-${i}`,0)
                }
            }
            amount = await db.get(`${msg.author.id}-credits`)
            if (amount < 12) {
                msg.channel.send(poor)
                return;
            }
            await db.set(`${msg.author.id}-credits`,amount-12)
            char=chance.weighted(nums3,probs3)
            thischar = await db.get(`${msg.author.id}-chars-${char}`)
            if (!thischar) {
                msg.channel.send(list[char])
                await db.set(`${msg.author.id}-chars-${char}`,1)
            }
            else {
                if (probs[char]==10) {
                    rar = "Rare"
                    refund=3
                }
                else if (probs[char]==6) {
                    rar = "Epic"
                    refund=4
                }
                else if (probs[char]==3) {
                    rar = "Legendary"
                    refund=5
                }
                else if (probs[char]==1) {
                    rar = "Mythical"
                    refund=6
                }
                let already=new Discord.MessageEmbed()
                    .setTitle("Already Unlocked")
                    .setColor(basic)
                    .setDescription(`You have already unlocked that **${rar}** character. You get a **${refund}**-credit refund.`)
                msg.channel.send(already)
                let prev = await db.get(`${msg.author.id}-credits`)
                await db.set(`${msg.author.id}-credits`,prev+refund)
            }
            break;
        case "mem":
        case "memory":
            if (!msg.mentions.users.first()) {inventoryUser=msg.author}
            else {inventoryUser=msg.mentions.users.first()}
            let exist3 = await db.list(inventoryUser.id)
            if (!exist3.length) {
                await db.set(`${inventoryUser.id}-credits`,0)
                await db.set(`${inventoryUser.id}-time`,0)
                for (i=0; i<100; i++) {
                    await db.set(`${inventoryUser.id}-chars-${i}`,0)
                }
            }
            let inventorylist=[]
            let rarslist={}
            for (i=0; i<100; i++) {
                let thatchar = await db.get(`${inventoryUser.id}-chars-${i}`)
                if (thatchar) {inventorylist.push(names[i])}
            }
            let inventory=new Discord.MessageEmbed()
                .setTitle("Inventory of "+inventoryUser.username)
                .setColor(basic)
                .setDescription(inventorylist)
                .setThumbnail(inventoryUser.avatarURL())
            msg.channel.send(inventory)
            break;
        case "docu":
            msg.channel.send(documentation)
            break;
        case "info":
            if (!args[1]) { msg.channel.send(moreinfo) }
            else {
                switch(args[1]) {
                    case "help":
                        msg.channel.send(helpinfo)
                        break;
                    case "bou":
                    case "bounty":
                        msg.channel.send(collectinfo)
                        break;
                    case "bal":
                    case "balance":
                        msg.channel.send(balanceinfo)
                        break;
                    case "info":
                        msg.channel.send(infoinfo)
                        break;
                    case "unlock":
                        msg.channel.send(unlockinfo)
                        break;
                    case "inv":
                    case "inventory": msg.channel.send(inventoryinfo)
                }
            }
            break;
        default:
            msg.channel.send(inval)
    }
});
client.login(process.env.token)
