const mineflayer = require('mineflayer');
const mineflayerViewer = require('prismarine-viewer').mineflayer
const { EventEmitter } = require('events')
const socks = require('socks').SocksClient
const ProxyAgent = require('proxy-agent')
const botApi = new EventEmitter()
const fetch = require('node-fetch')
const fs = require('fs')
const currentVersion = "2.4"
var http = require("http");
let stopBot = false

// bot stop event listener
botApi.on('stopBots', () => {
    stopBot = true
})

// bot connect method
async function connectBot() {
    stopBot = false;
    let stopLoop = false;
    const count = idBotCount.value ? idBotCount.value : 1

    for (let i = 0; i < count; i++) {
        if (stopBot || stopLoop) break;
    
        let botInfo;
    
        switch (idNameMethod.value) {
            case "random":
                botInfo = getBotInfo(salt(10), i);
                break;
            case "legit":
                botInfo = getBotInfo(genName(), i);
                break;
            case "file":
                startAccountFile(idAccountFilePath.files[0].path);
                stopLoop = true;
                break;
            default:
                const username = count != 1
                    ? idBotUsername.value + "_" + i
                    : idBotUsername.value;
    
                botInfo = getBotInfo(username, i);
        }
    
        if (!stopLoop) {
            newBot(botInfo);
            await delay(idJoinDelay.value ? idJoinDelay.value : 1000);
        }
    }
    
}

// connection methods
async function startAccountFile(accountFile) {
    sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> System Account File Loaded. </li>`)
    const file = fs.readFileSync(accountFile)
    const lines = file.toString().split(/\r?\n/)
    const count = idBotCount.value ? idBotCount.value : lines.length
    for (var i = 0; i < count; i++) {
        if (stopBot) break;
        newBot(getBotInfo(lines[i], i))
        await delay(idJoinDelay.value ? idJoinDelay.value : 1000)
    }
}

// send bot info
function getBotInfo(botName, num) {
    const serverHost = idIp.value.split(':')[0] ? idIp.value.split(':')[0] : "localhost";
    const serverPort = idIp.value.split(':')[1] ? idIp.value.split(':')[1] : 25565;

    if (idProxyToggle.checked) {
        if(idProxyType.value === "4" || idProxyType.value === "5") {
            const proxy = getProxy(num);
            const proxyHost = proxy.split(":")[0];
            const proxyPort = proxy.split(":")[1];
            
            options = {
                connect: client => {
                    socks.createConnection({
                        proxy: {
                            host: proxyHost,
                            port: parseInt(proxyPort),
                            type: parseInt(idProxyType.value)
                        },
                        command: 'connect',
                        destination: {
                            host: serverHost,
                            port: parseInt(serverPort)
                        }
                    }, (err, info) => {
                        if (err) {
                            sendLog(`[ProxyError] [${botName}] [${proxyHost}:${proxyPort}] ${err}`)
                            return;
                        }
                        client.setSocket(info.socket);
                        client.emit('connect')
                    })
                },
                agent: new ProxyAgent({
                    protocol: `socks${idProxyType.value}`,
                    host: proxyHost,
                    port: proxyPort
                }),
                checkTimeoutInterval: 65 * 10000,
                connectTimeout: 60000,
                host: serverHost,
                port: serverPort,
                username: botName,
                version: idBotVersion.value,
                auth: idAuthType.value,
                hideErrors: true,
                easyMcToken: idAltToken.value,
                onMsaCode: function(data) {
                    const code = data.user_code
                    sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)">[${botName}] First time signing in. Please authenticate now: To sign in, use a web browser to open the page <b style="cursor: pointer; color: blue;" onClick="shell.openExternal('https://www.microsoft.com/link')">https://www.microsoft.com/link</b> and enter the code: ${code} <img src="./assets/icons/clipboard.svg" onclick="navigator.clipboard.writeText('${code}')" style="cursor: pointer; filter: brightness(0) invert(1);" height="16px;"> to authenticate. </li>`)
                }
            };
            return options;
        } else {
            let proxyAuth
            let proxyHost
            let proxyPort
            let authed
            if (getProxy(num).split("@").length > 1) {
                proxyAuth = btoa(getProxy(num).split("@")[0]);
                proxyHost = getProxy(num).split("@")[1].split(":")[0];
                proxyPort = parseInt(getProxy(num).split("@")[1].split(":")[1]);
                authed = true
            } else {
                proxyHost = getProxy(num).split(":")[0];
                proxyPort = parseInt(getProxy(num).split(":")[1]);
                authed = false
            }
            
            options = {
                connect: client => {
                    let req = http.request({
                        host: proxyHost,
                        port: proxyPort,
                        method: 'CONNECT',
                        path: serverHost + ":" + parseInt(serverPort)
                    });
                    if (authed) {
                        req = http.request({
                            host: proxyHost,
                            port: proxyPort,
                            method: 'CONNECT',
                            headers: {
                                "host": `${serverHost}:${serverPort}`,
                                "proxy-authorization": "Basic " + proxyAuth
                            },
                            path: serverHost + ':' + serverPort
                        })
                    }
                    req.end()

                    req.on('connect', (res, stream) => {
                        client.setSocket(stream)
                        client.emit('connect')
                    })
                },
                agent: new ProxyAgent({ protocol: 'http', host: proxyHost, port: proxyPort }),
                checkTimeoutInterval: 65 * 10000,
                connectTimeout: 60000,
                host: serverHost,
                port: serverPort,
                username: botName,
                version: idBotVersion.value,
                auth: idAuthType.value,
                hideErrors: true,
                easyMcToken: idAltToken.value,
                onMsaCode: function(data) {
                    const code = data.user_code
                    sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)">[${botName}] First time signing in. Please authenticate now: To sign in, use a web browser to open the page <b style="cursor: pointer; color: blue;" onClick="shell.openExternal('https://www.microsoft.com/link')">https://www.microsoft.com/link</b> and enter the code: ${code} <img src="./assets/icons/clipboard.svg" onclick="navigator.clipboard.writeText('${code}')" style="cursor: pointer; filter: brightness(0) invert(1);" height="16px;"> to authenticate. </li>`)
                }
            };
            return options;
        }
    } else {
        options = {
            host: serverHost,
            port: serverPort,
            username: botName,
            version: idBotVersion.value,
            auth: idAuthType.value,
            hideErrors: true,
            easyMcToken: idAltToken.value,
            onMsaCode: function(data) {
                const code = data.user_code
                sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)">[${botName}] First time signing in. Please authenticate now: To sign in, use a web browser to open the page <b style="cursor: pointer; color: blue;" onClick="shell.openExternal('https://www.microsoft.com/link')">https://www.microsoft.com/link</b> and enter the code: ${code} <img src="./assets/icons/clipboard.svg" onclick="navigator.clipboard.writeText('${code}')" style="cursor: pointer; filter: brightness(0) invert(1);" height="16px;"> to authenticate. </li>`)
            }
        };
        return options;
    }
}

// get proxy from file with line number
function getProxy(n) {
    const file = idProxylist.value
    const lines = file.toString().split(/\r?\n/)
    const rnd = Math.floor(Math.random() * lines.length)

    if (n >= lines.length || idProxyOrderRnd.checked) {
        return lines[rnd]
    } else {
        return lines[n]
    }
}

// random char
function salt(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// delay function
function delay(ms) {
    return new Promise(res => setTimeout(res, ms))
};

// add players to player list
function addPlayer(name) {
    const b = document.createElement("li")
    b.id = "list" + name
    b.style = "font-weight:bold"
    b.innerHTML = name
    b.addEventListener('click', () => {
        selectBot(event)
    })
    idBotList.appendChild(b)
    idBotList.scrollTop = idBotList.scrollHeight
    updateBotCount()
    if(idAutoSelect.checked) {selectAll()}
}

// remove player from list
function rmPlayer(name) {
    if (document.getElementById("list" + name)) document.getElementById("list" + name).remove()
    updateBotCount()
    if(idAutoSelect.checked) {selectAll()}
}

// log error
function errBot(name) {
    rmPlayer(name)
    updateBotCount()
}

// logs info to chat
function sendLog(log) {
    if(!log) return;
    const b = document.createElement("li")
    //const minib = document.createElement("li")
    b.innerHTML = log
    //minib.innerHTML = log
    idChatBox.appendChild(b)
    idChatBox.scrollTop = idChatBox.scrollHeight
    //idMiniChatBox.appendChild(minib)
    //idMiniChatBox.scrollTop = idMiniChatBox.scrollHeight
}
// logs info to proxy logs
function proxyLog(log) {
    if(!log) return;
    const b = document.createElement("li")
    b.innerHTML = log
    idProxyLogs.appendChild(b)
    idProxyLogs.scrollTop = idProxyLogs.scrollHeight
}

// execute command all bots
async function exeAll(command, ...args) {
    
    const list = selectedList()
    if(list.length === 0) return notification("No bots selected", "warning")
    //sendLog(`<li> <img src="./assets/icons/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(89%) sepia(82%) saturate(799%) hue-rotate(1deg) brightness(103%) contrast(102%)">No bots selected!</li>`);
    
    for (var i = 0; i < list.length; i++) {
        botApi.emit(list[i] + command, ...args)
        await delay(idLinearValue.value)
    }
    if(command === "hit") return;
    sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> System [${command}] ${args} </li>`)
}

function updateBotCount() {
    idDownbarBotCount.innerHTML = idBotList.getElementsByTagName("li").length
}

// script controler
async function startScript(botId, script) {
    sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${botId}] Script started. </li>`)

    const lines = script.toString().split(/\r?\n/)

    for (var i = 0; i < lines.length; i++) {
        const args = lines[i].split(" ")
        const command = args.shift().toLowerCase();
        
        if (command === "delay") {
            await delay(args[0])
        }
        if (command === "chat") {
            botApi.emit(botId + command, lines[i].slice(5))
            sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${botId}] chat ${lines[i].slice(5)} </li>`)
        } else {
            botApi.emit(botId + command, ...args)
            sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [${botId}] ${command} ${args} </li>`)
        }
    }
}

// //check version

function checkVer() {
    const outdatedVersionAlert = document.getElementById('outdatedVersion')
    const ids = ['aboutPageVersion', 'topBarVersion']
    ids.forEach(e => {
        document.getElementById(e).innerHTML = `v${currentVersion}`
    })
    fetch("https://raw.githubusercontent.com/RattlesHyper/TrafficerMC/main/VERSION", {
            method: 'GET'
        })
        .then(response => response.text())
        .then(result => {
            if (result.replaceAll("\n", "").replaceAll(" ", "") !== currentVersion) {
                outdatedVersionAlert.style.display = outdatedVersionAlert.style.display.replace("none", "")
                notification("New version found, Please update", "error")
            }
        })
}

// // name generator
function genName() {
    let name = ''
    const words = ["Ace", "Aid", "Aim", "Air", "Ale", "Arm", "Art", "Awl", "Eel", "Ear", "Era", "Ice", "Ire", "Ilk", "Oar", "Oak", "Oat", "Oil", "Ore", "Owl", "Urn", "Web", "Cab", "Dab", "Jab", "Lab", "Tab", "Dad", "Fad", "Lad", "Mad", "Bag", "Gag", "Hag", "Lag", "Mag", "Rag", "Tag", "Pal", "Cam", "Dam", "Fam", "Ham", "Jam", "Ram", "Ban", "Can", "Fan", "Man", "Pan", "Tan", "Bap", "Cap", "Lap", "Pap", "Rap", "Sap", "Tap", "Yap", "Bar", "Car", "Jar", "Tar", "War", "Bat", "Cat", "Hat", "Mat", "Pat", "Tat", "Rat", "Vat", "Caw", "Jaw", "Law", "Maw", "Paw", "Bay", "Cay", "Day", "Hay", "Ray", "Pay", "Way", "Max", "Sax", "Tax", "Pea", "Sea", "Tea", "Bed", "Med", "Leg", "Peg", "Bee", "Lee", "Tee", "Gem", "Bet", "Jet", "Net", "Pet", "Set", "Den", "Hen", "Men", "Pen", "Ten", "Yen", "Dew", "Mew", "Pew", "Bib", "Fib", "Jib", "Rib", "Sib", "Bid", "Kid", "Lid", "Vid", "Tie", "Lie", "Pie", "Fig", "Jig", "Pig", "Rig", "Wig", "Dim", "Bin", "Din", "Fin", "Gin", "Pin", "Sin", "Tin", "Win", "Yin", "Dip", "Lip", "Pip", "Sip", "Tip", "Git", "Hit", "Kit", "Pit", "Wit", "Bod", "Cod", "God", "Mod", "Pod", "Rod", "Doe", "Foe", "Hoe", "Roe", "Toe", "Bog", "Cog", "Dog", "Fog", "Hog", "Jog", "Log", "Poi", "Con", "Son", "Ton", "Zoo", "Cop", "Hop", "Mop", "Pop", "Top", "Bot", "Cot", "Dot", "Lot", "Pot", "Tot", "Bow", "Cow", "Sow", "Row", "Box", "Lox", "Pox", "Boy", "Soy", "Toy", "Cub", "Nub", "Pub", "Sub", "Tub", "Bug", "Hug", "Jug", "Mug", "Rug", "Tug", "Bum", "Gum", "Hum", "Rum", "Tum", "Bun", "Gun", "Pun", "Run", "Sun", "Cup", "Pup", "Cut", "Gut", "Hut", "Nut", "Rut", "Egg", "Ego", "Elf", "Elm", "Emu", "End", "Era", "Eve", "Eye", "Ink", "Inn", "Ion", "Ivy", "Lye", "Dye", "Rye", "Pus", "Gym", "Her", "His", "Him", "Our", "You", "She", "Add", "Ail", "Are", "Eat", "Err", "Oil", "Use", "Nab", "Jab", "Bag", "Lag", "Nag", "Rag", "Sag", "Tag", "Wag", "Jam", "Ram", "Ran", "Tan", "Cap", "Lap", "Nap", "Rap", "Sap", "Tap", "Yap", "Mar", "Has", "Was", "Pat", "Sat", "Lay", "Pay", "Say", "Max", "Tax", "Fed", "See", "Get", "Let", "Net", "Met", "Pet", "Set", "Wet", "Mew", "Sew", "Lie", "Tie", "Bog", "Jog", "Boo", "Coo", "Moo", "Bop", "Hop", "Lop", "Mop", "Pop", "Top", "Sop", "Bow", "Mow", "Row", "Tow", "Dub", "Rub", "Dug", "Lug", "Tug", "Hum", "Sup", "Buy", "Got", "Jot", "Rot", "Nod", "Hem", "Led", "Wed", "Fib", "Jib", "Rib", "Did", "Dig", "Jig", "Rig", "Dip", "Nip", "Sip", "Rip", "Zip", "Gin", "Win", "Bit", "Hit", "Sit", "Won", "Pry", "Try", "Cry", "All", "Fab", "Bad", "Had", "Mad", "Rad", "Tad", "Far", "Fat", "Raw", "Lax", "Max", "Gay", "Big", "Dim", "Fit", "Red", "Wet", "Old", "New", "Hot", "Coy", "Fun", "Ill", "Odd", "Shy", "Dry", "Wry", "And", "But", "Yet", "For", "Nor", "The", "Not", "How", "Too", "Yet", "Now", "Off", "Any", "Out", "Bam", "Nah", "Yea", "Yep", "Naw", "Hey", "Yay", "Nay", "Pow", "Wow", "Moo", "Boo", "Bye", "Yum", "Ugh", "Bah", "Umm", "Why", "Aha", "Aye", "Hmm", "Hah", "Huh", "Ssh", "Brr", "Heh", "Oop", "Oof", "Zzz", "Gee", "Grr", "Yup", "Gah", "Mmm", "Dag", "Arr", "Eww", "Ehh"]
    for (var i = 0; i < Math.floor(Math.random() * 4) + 2; i++) {
        name += words[Math.floor(Math.random() * words.length)]
    }
    return name
}

// load theme
function loadTheme(file) {
    fs.exists(file, (exists) => {
        if(exists) {
            var link = document.createElement("link");
            link.href = file
            link.type = "text/css";
            link.rel = "stylesheet";
        
            document.getElementsByTagName("head")[0].appendChild(link);
            notification("Loaded custom CSS", "info")
        }
    });
}

function notification(text, type) {
    const notify = document.createElement('div');
    const notifyIcon = document.createElement('img');

    notify.classList.add('notify-content');
    notifyIcon.classList.add('notify-icon');

    notify.textContent = text;

    if(type === "warning") {
        notify.style.color = "#FFFFFF";
        notifyIcon.src = "./assets/icons/alert-triangle.svg";
        notifyIcon.style = "filter: brightness(0) saturate(100%) invert(89%) sepia(82%) saturate(799%) hue-rotate(1deg) brightness(103%) contrast(102%)"
    } else if(type === "error") {
        notify.style.color = "#FFFFFF"; 
        notifyIcon.src = "./assets/icons/error.svg";
        notifyIcon.style = "filter: invert(32%) sepia(95%) saturate(2397%) hue-rotate(340deg) brightness(101%) contrast(114%);"
    } else if(type === "info") {
        notify.style.color = "#FFFFFF"; 
        notifyIcon.src = "./assets/icons/info.svg";
    }

    notify.appendChild(notifyIcon);
    idPopupUl.appendChild(notify);

    setTimeout(() => {
        notify.style.right = 0;
    }, 100);
    setTimeout(() => {
        notify.style.opacity = 0;
        notify.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notify.remove()
        }, 275);
    }, 2150);
}

// json to html format
function formatText(json) {
    c = json
    return `<span style='${c.color ? `color: ${c.color};`: ""}${c.bold ? "font-weight:bold;" : ""}${c.italic ? "font-style:italic;" : ""} '>${c.text}</span>`;
}

// Gets list of selected bots
function selectedList() {
    var sels = document.getElementsByClassName("botSelected");
    let list = new Array;

    var liElements = Array.from(sels).filter(function(element) {
        return element.tagName === "LI";
    });

    liElements.forEach(e => {
        list.push(e.innerHTML)
    })

    return list;
}

function checkAuth() {
    const mode = document.getElementById('botAuthType').value;
    const easymcDiv = document.getElementById('easymcDiv');
    const usernameDiv = document.getElementById('usernameDiv');

    switch (mode) {
        case "easymc":
            easymcDiv.style.display = 'block';
            usernameDiv.style.display = 'none';
            document.getElementById('botUsename').value = '';
          break;
        default:
            easymcDiv.style.display = 'none';
            usernameDiv.style.display = 'block';
      }
}
async function easyMcAuth (client, options) {
    const fetchOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"token":"${options.easyMcToken}"}`
    }
    try {
        const res = await fetch('https://api.easymc.io/v1/token/redeem', fetchOptions)
        const resJson = await res.json()
        if (resJson.error) throw sendLog(`[EasyMC] ${resJson.error}`)
        if (!resJson) throw sendLog('[EasyMC] Empty response from EasyMC.')
        if (resJson.session?.length !== 43 || resJson.mcName?.length < 3 || resJson.uuid?.length !== 36) throw new Error('Invalid response from EasyMC.')
        const session = {
            accessToken: resJson.session,
            selectedProfile: {
                name: resJson.mcName,
                id: resJson.uuid
            }
        }
        options.haveCredentials = true
        client.session = session
        options.username = client.username = session.selectedProfile.name
        options.accessToken = session.accessToken
        client.emit('session', session)
    } catch (error) {
        client.emit('error', error)
        return
    }
    options.connect(client)
}

function createBot(options) {
    if (options.auth === 'easymc') {
        if (options.easyMcToken?.length !== 20) {
            throw sendLog('EasyMC authentication requires an alt token. See https://easymc.io/get .')
        }
        options.auth = easyMcAuth
        options.sessionServer ||= 'https://sessionserver.easymc.io'
        options.username = Buffer.alloc(0)
    }

    return mineflayer.createBot(options)
}

const httpProxies = [
    "http://worm.rip/http.txt",
    "https://raw.githubusercontent.com/almroot/proxylist/master/list.txt",
    "https://raw.githubusercontent.com/B4RC0DE-TM/proxy-list/main/HTTP.txt",
    "https://raw.githubusercontent.com/clarketm/proxy-list/master/proxy-list-raw.txt",
    "https://raw.githubusercontent.com/hendrikbgr/Free-Proxy-Repo/master/proxy_list.txt",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-http.txt",
    "https://raw.githubusercontent.com/mertguvencli/http-proxy-list/main/proxy-list/data.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/master/http.txt",
    "https://raw.githubusercontent.com/proxy4parsing/proxy-list/main/http.txt",
    "https://raw.githubusercontent.com/RX4096/proxy-list/main/online/http.txt",
    "https://raw.githubusercontent.com/saschazesiger/Free-Proxies/master/proxies/http.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/http.txt",
    "https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt",
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt",
    "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/http.txt",
    "https://www.proxy-list.download/api/v1/get?type=http",
    "https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/http.txt",
    "https://api.openproxylist.xyz/http.txt",
]

const socks4Proxies = [
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks4.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks4.txt",
    "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks4.txt",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks4.txt",
    "https://raw.githubusercontent.com/roosterkid/openproxylist/main/SOCKS4_RAW.txt",
    "https://www.proxy-list.download/api/v1/get?type=socks4",
    "https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/socks4.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/master/socks4.txt", 
    "https://api.openproxylist.xyz/socks4.txt",
    "https://openproxylist.xyz/socks4.txt", 
    "https://proxyspace.pro/socks4.txt" ,
    "https://raw.githubusercontent.com/B4RC0DE-TM/proxy-list/main/SOCKS4.txt",
]

const socks5Proxies = [
    "https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/socks5.txt",
    "https://raw.githubusercontent.com/ShiftyTR/Proxy-List/master/socks5.txt",
    "https://raw.githubusercontent.com/monosans/proxy-list/main/proxies/socks5.txt",
    "https://raw.githubusercontent.com/hookzof/socks5_list/master/proxy.txt",
    "https://raw.githubusercontent.com/jetkai/proxy-list/main/online-proxies/txt/proxies-socks5.txt",
    "https://raw.githubusercontent.com/roosterkid/openproxylist/main/SOCKS5_RAW.txt",
    "https://raw.githubusercontent.com/manuGMG/proxy-365/main/SOCKS5.txt",
    "https://www.proxy-list.download/api/v1/get?type=socks5",
    "https://raw.githubusercontent.com/rdavydov/proxy-list/main/proxies/socks5.txt",
    "https://raw.githubusercontent.com/mmpx12/proxy-list/master/socks5.txt",
    "https://api.openproxylist.xyz/socks5.txt",
    "https://openproxylist.xyz/socks5.txt",
    "https://proxyspace.pro/socks5.txt",
    "https://raw.githubusercontent.com/B4RC0DE-TM/proxy-list/main/SOCKS5.txt",
]

async function scrapeProxy() {
    if(idScrapeProtocol.value === "4") {
        getAllProxies(socks4Proxies).then(proxies => {
            idProxylist.value += proxies
            proxyLog("Proxy fetched:" + proxies.length)
        }).catch(error => {
            proxyLog('Error:', error);
        });
    } if(idScrapeProtocol.value === "5") {
        getAllProxies(socks5Proxies).then(proxies => {
            idProxylist.value += proxies
            proxyLog("Proxy fetched:" + proxies.length)
        }).catch(error => {
            proxyLog('Error:', error);
        });
    } else {
        getAllProxies(httpProxies).then(proxies => {
            idProxylist.value += proxies
            proxyLog("Proxy fetched:" + proxies.length)
        }).catch(error => {
            proxyLog('Error:', error);
        });
    }
}

async function getProxiesFromUrl(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        const proxyArray = data.split(',').map(proxy => proxy.trim());
        return proxyArray.filter(proxy => proxy !== '');
    } catch (error) {
        console.error(`Ошибка при запросе прокси с ${url}: ${error.message}`);
        return [];
    }
}

// Функция для получения прокси с нескольких URL-ов
async function getAllProxies(urls) {
    try {
        const results = await Promise.all(urls.map(url => getProxiesFromUrl(url)));
        // Объединяем массивы прокси в один
        const proxies = [].concat(...results);
        return proxies;
    } catch (error) {
        console.error(`Ошибка при получении прокси: ${error.message}`);
        return [];
    }
}

async function fetchList(link) {
    const fetchOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        body: null
    };

    try {
        const res = await fetch(link, fetchOptions);
        const text = await res.text();
        const lines = text.toString().split(/\r?\n/);
        let items = new Array;

        for (var i = 0; i < lines.length; i++) {
            let line = lines[i]
            if (line === "") continue;
            items.push(line);
        }
        return items

    } catch (error) {
        proxyLog(error);
        return;
    }
}

function getColor(colorId) {
	const colors = [
		{ red: 0, green: 0, blue: 0, alpha: 255 },
		{ red: 89, green: 125, blue: 39, alpha: 255 },
		{ red: 109, green: 153, blue: 48, alpha: 255 },
		{ red: 127, green: 178, blue: 56, alpha: 255 },
		{ red: 67, green: 94, blue: 29, alpha: 255 },
		{ red: 174, green: 164, blue: 115, alpha: 255 },
		{ red: 213, green: 201, blue: 140, alpha: 255 },
		{ red: 247, green: 233, blue: 163, alpha: 255 },
		{ red: 130, green: 123, blue: 86, alpha: 255 },
		{ red: 140, green: 140, blue: 140, alpha: 255 },
		{ red: 171, green: 171, blue: 171, alpha: 255 },
		{ red: 199, green: 199, blue: 199, alpha: 255 },
		{ red: 105, green: 105, blue: 105, alpha: 255 },
		{ red: 180, green: 0, blue: 0, alpha: 255 },
		{ red: 220, green: 0, blue: 0, alpha: 255 },
		{ red: 255, green: 0, blue: 0, alpha: 255 },
		{ red: 135, green: 0, blue: 0, alpha: 255 },
		{ red: 112, green: 112, blue: 180, alpha: 255 },
		{ red: 138, green: 138, blue: 220, alpha: 255 },
		{ red: 160, green: 160, blue: 255, alpha: 255 },
		{ red: 84, green: 84, blue: 135, alpha: 255 },
		{ red: 117, green: 117, blue: 117, alpha: 255 },
		{ red: 144, green: 144, blue: 144, alpha: 255 },
		{ red: 167, green: 167, blue: 167, alpha: 255 },
		{ red: 88, green: 88, blue: 88, alpha: 255 },
		{ red: 0, green: 87, blue: 0, alpha: 255 },
		{ red: 0, green: 106, blue: 0, alpha: 255 },
		{ red: 0, green: 124, blue: 0, alpha: 255 },
		{ red: 0, green: 65, blue: 0, alpha: 255 },
		{ red: 180, green: 180, blue: 180, alpha: 255 },
		{ red: 220, green: 220, blue: 220, alpha: 255 },
		{ red: 255, green: 255, blue: 255, alpha: 255 },
		{ red: 135, green: 135, blue: 135, alpha: 255 },
		{ red: 115, green: 118, blue: 129, alpha: 255 },
		{ red: 141, green: 144, blue: 158, alpha: 255 },
		{ red: 164, green: 168, blue: 184, alpha: 255 },
		{ red: 86, green: 88, blue: 97, alpha: 255 },
		{ red: 106, green: 76, blue: 54, alpha: 255 },
		{ red: 130, green: 94, blue: 66, alpha: 255 },
		{ red: 151, green: 109, blue: 77, alpha: 255 },
		{ red: 79, green: 57, blue: 40, alpha: 255 },
		{ red: 79, green: 79, blue: 79, alpha: 255 },
		{ red: 96, green: 96, blue: 96, alpha: 255 },
		{ red: 112, green: 112, blue: 112, alpha: 255 },
		{ red: 59, green: 59, blue: 59, alpha: 255 },
		{ red: 45, green: 45, blue: 180, alpha: 255 },
		{ red: 55, green: 55, blue: 220, alpha: 255 },
		{ red: 64, green: 64, blue: 255, alpha: 255 },
		{ red: 33, green: 33, blue: 135, alpha: 255 },
		{ red: 100, green: 84, blue: 50, alpha: 255 },
		{ red: 123, green: 102, blue: 62, alpha: 255 },
		{ red: 143, green: 119, blue: 72, alpha: 255 },
		{ red: 75, green: 63, blue: 38, alpha: 255 },
		{ red: 180, green: 177, blue: 172, alpha: 255 },
		{ red: 220, green: 217, blue: 211, alpha: 255 },
		{ red: 255, green: 252, blue: 245, alpha: 255 },
		{ red: 135, green: 133, blue: 129, alpha: 255 },
		{ red: 152, green: 89, blue: 36, alpha: 255 },
		{ red: 186, green: 109, blue: 44, alpha: 255 },
		{ red: 216, green: 127, blue: 51, alpha: 255 },
		{ red: 114, green: 67, blue: 27, alpha: 255 },
		{ red: 125, green: 53, blue: 152, alpha: 255 },
		{ red: 153, green: 65, blue: 186, alpha: 255 },
		{ red: 178, green: 76, blue: 216, alpha: 255 },
		{ red: 94, green: 40, blue: 114, alpha: 255 },
		{ red: 72, green: 108, blue: 152, alpha: 255 },
		{ red: 88, green: 132, blue: 186, alpha: 255 },
		{ red: 102, green: 153, blue: 216, alpha: 255 },
		{ red: 54, green: 81, blue: 114, alpha: 255 },
		{ red: 161, green: 161, blue: 36, alpha: 255 },
		{ red: 197, green: 197, blue: 44, alpha: 255 },
		{ red: 229, green: 229, blue: 51, alpha: 255 },
		{ red: 121, green: 121, blue: 27, alpha: 255 },
		{ red: 89, green: 144, blue: 17, alpha: 255 },
		{ red: 109, green: 176, blue: 21, alpha: 255 },
		{ red: 127, green: 204, blue: 25, alpha: 255 },
		{ red: 67, green: 108, blue: 13, alpha: 255 },
		{ red: 170, green: 89, blue: 116, alpha: 255 },
		{ red: 208, green: 109, blue: 142, alpha: 255 },
		{ red: 242, green: 127, blue: 165, alpha: 255 },
		{ red: 128, green: 67, blue: 87, alpha: 255 },
		{ red: 53, green: 53, blue: 53, alpha: 255 },
		{ red: 65, green: 65, blue: 65, alpha: 255 },
		{ red: 76, green: 76, blue: 76, alpha: 255 },
		{ red: 40, green: 40, blue: 40, alpha: 255 },
		{ red: 108, green: 108, blue: 108, alpha: 255 },
		{ red: 132, green: 132, blue: 132, alpha: 255 },
		{ red: 153, green: 153, blue: 153, alpha: 255 },
		{ red: 81, green: 81, blue: 81, alpha: 255 },
		{ red: 53, green: 89, blue: 108, alpha: 255 },
		{ red: 65, green: 109, blue: 132, alpha: 255 },
		{ red: 76, green: 127, blue: 153, alpha: 255 },
		{ red: 40, green: 67, blue: 81, alpha: 255 },
		{ red: 89, green: 44, blue: 125, alpha: 255 },
		{ red: 109, green: 54, blue: 153, alpha: 255 },
		{ red: 127, green: 63, blue: 178, alpha: 255 },
		{ red: 67, green: 33, blue: 94, alpha: 255 },
		{ red: 36, green: 53, blue: 125, alpha: 255 },
		{ red: 44, green: 65, blue: 153, alpha: 255 },
		{ red: 51, green: 76, blue: 178, alpha: 255 },
		{ red: 27, green: 40, blue: 94, alpha: 255 },
		{ red: 72, green: 53, blue: 36, alpha: 255 },
		{ red: 88, green: 65, blue: 44, alpha: 255 },
		{ red: 102, green: 76, blue: 51, alpha: 255 },
		{ red: 54, green: 40, blue: 27, alpha: 255 },
		{ red: 72, green: 89, blue: 36, alpha: 255 },
		{ red: 88, green: 109, blue: 44, alpha: 255 },
		{ red: 102, green: 127, blue: 51, alpha: 255 },
		{ red: 54, green: 67, blue: 27, alpha: 255 },
		{ red: 108, green: 36, blue: 36, alpha: 255 },
		{ red: 132, green: 44, blue: 44, alpha: 255 },
		{ red: 153, green: 51, blue: 51, alpha: 255 },
		{ red: 81, green: 27, blue: 27, alpha: 255 },
		{ red: 17, green: 17, blue: 17, alpha: 255 },
		{ red: 21, green: 21, blue: 21, alpha: 255 },
		{ red: 25, green: 25, blue: 25, alpha: 255 },
		{ red: 13, green: 13, blue: 13, alpha: 255 },
		{ red: 176, green: 168, blue: 54, alpha: 255 },
		{ red: 215, green: 205, blue: 66, alpha: 255 },
		{ red: 250, green: 238, blue: 77, alpha: 255 },
		{ red: 132, green: 126, blue: 40, alpha: 255 },
		{ red: 64, green: 154, blue: 150, alpha: 255 },
		{ red: 79, green: 188, blue: 183, alpha: 255 },
		{ red: 92, green: 219, blue: 213, alpha: 255 },
		{ red: 48, green: 115, blue: 112, alpha: 255 },
		{ red: 52, green: 90, blue: 180, alpha: 255 },
		{ red: 63, green: 110, blue: 220, alpha: 255 },
		{ red: 74, green: 128, blue: 255, alpha: 255 },
		{ red: 39, green: 67, blue: 135, alpha: 255 },
		{ red: 0, green: 153, blue: 40, alpha: 255 },
		{ red: 0, green: 187, blue: 50, alpha: 255 },
		{ red: 0, green: 217, blue: 58, alpha: 255 },
		{ red: 0, green: 114, blue: 30, alpha: 255 },
		{ red: 91, green: 60, blue: 34, alpha: 255 },
		{ red: 111, green: 74, blue: 42, alpha: 255 },
		{ red: 129, green: 86, blue: 49, alpha: 255 },
		{ red: 68, green: 45, blue: 25, alpha: 255 },
		{ red: 79, green: 1, blue: 0, alpha: 255 },
		{ red: 96, green: 1, blue: 0, alpha: 255 },
		{ red: 112, green: 2, blue: 0, alpha: 255 },
		{ red: 59, green: 1, blue: 0, alpha: 255 },
		{ red: 147, green: 124, blue: 113, alpha: 255 },
		{ red: 180, green: 152, blue: 138, alpha: 255 },
		{ red: 209, green: 177, blue: 161, alpha: 255 },
		{ red: 110, green: 93, blue: 85, alpha: 255 },
		{ red: 112, green: 57, blue: 25, alpha: 255 },
		{ red: 137, green: 70, blue: 31, alpha: 255 },
		{ red: 159, green: 82, blue: 36, alpha: 255 },
		{ red: 84, green: 43, blue: 19, alpha: 255 },
		{ red: 105, green: 61, blue: 76, alpha: 255 },
		{ red: 128, green: 75, blue: 93, alpha: 255 },
		{ red: 149, green: 87, blue: 108, alpha: 255 },
		{ red: 78, green: 46, blue: 57, alpha: 255 },
		{ red: 79, green: 76, blue: 97, alpha: 255 },
		{ red: 96, green: 93, blue: 119, alpha: 255 },
		{ red: 112, green: 108, blue: 138, alpha: 255 },
		{ red: 59, green: 57, blue: 73, alpha: 255 },
		{ red: 131, green: 93, blue: 25, alpha: 255 },
		{ red: 160, green: 114, blue: 31, alpha: 255 },
		{ red: 186, green: 133, blue: 36, alpha: 255 },
		{ red: 98, green: 70, blue: 19, alpha: 255 },
		{ red: 72, green: 82, blue: 37, alpha: 255 },
		{ red: 88, green: 100, blue: 45, alpha: 255 },
		{ red: 103, green: 117, blue: 53, alpha: 255 },
		{ red: 54, green: 61, blue: 28, alpha: 255 },
		{ red: 112, green: 54, blue: 55, alpha: 255 },
		{ red: 138, green: 66, blue: 67, alpha: 255 },
		{ red: 160, green: 77, blue: 78, alpha: 255 },
		{ red: 84, green: 40, blue: 41, alpha: 255 },
		{ red: 40, green: 28, blue: 24, alpha: 255 },
		{ red: 49, green: 35, blue: 30, alpha: 255 },
		{ red: 57, green: 41, blue: 35, alpha: 255 },
		{ red: 30, green: 21, blue: 18, alpha: 255 },
		{ red: 95, green: 75, blue: 69, alpha: 255 },
		{ red: 116, green: 92, blue: 84, alpha: 255 },
		{ red: 135, green: 107, blue: 98, alpha: 255 },
		{ red: 71, green: 56, blue: 51, alpha: 255 },
		{ red: 61, green: 64, blue: 64, alpha: 255 },
		{ red: 75, green: 79, blue: 79, alpha: 255 },
		{ red: 87, green: 92, blue: 92, alpha: 255 },
		{ red: 46, green: 48, blue: 48, alpha: 255 },
		{ red: 86, green: 51, blue: 62, alpha: 255 },
		{ red: 105, green: 62, blue: 75, alpha: 255 },
		{ red: 122, green: 73, blue: 88, alpha: 255 },
		{ red: 64, green: 38, blue: 46, alpha: 255 },
		{ red: 53, green: 43, blue: 64, alpha: 255 },
		{ red: 65, green: 53, blue: 79, alpha: 255 },
		{ red: 76, green: 62, blue: 92, alpha: 255 },
		{ red: 40, green: 32, blue: 48, alpha: 255 },
		{ red: 53, green: 35, blue: 24, alpha: 255 },
		{ red: 65, green: 43, blue: 30, alpha: 255 },
		{ red: 76, green: 50, blue: 35, alpha: 255 },
		{ red: 40, green: 26, blue: 18, alpha: 255 },
		{ red: 53, green: 57, blue: 29, alpha: 255 },
		{ red: 65, green: 70, blue: 36, alpha: 255 },
		{ red: 76, green: 82, blue: 42, alpha: 255 },
		{ red: 40, green: 43, blue: 22, alpha: 255 }
	]

	colorId -= 3 // 

	if(!colors[colorId]) return { red:255, green: 255, blue: 255, alpha: 255 }
	else return colors[colorId];
}

module.exports = {
    getBotInfo,
    connectBot,
    salt,
    delay,
    addPlayer,
    rmPlayer,
    errBot,
    sendLog,
    proxyLog,
    exeAll,
    startScript,
    checkVer,
    genName,
    loadTheme,
    notification,
    formatText,
    selectedList,
    checkAuth,
    createBot,
    scrapeProxy,
    botApi,
    mineflayerViewer,
    getColor,
    getProxy
}