const { ipcRenderer, shell } = require("electron");
const fs = require('fs');
const path = require('path');
const { mineflayerViewer, connectBot, delay, salt, addPlayer, rmPlayer, errBot, botApi, sendLog, exeAll, checkVer, startScript, loadTheme, createPopup, formatText, selectedList, checkAuth, createBot, scrapeProxy } = require(path.join(__dirname, "js", "utils.js"));
const { checkProxy } = require(path.join(__dirname, "js", "plugins", "proxy.js"))
const antiafk = require(path.join(__dirname, "js", "plugins", "afk.js"))

const inventoryViewer = require('mineflayer-web-inventory')
const PNGImage = require('pngjs-image');

let currentTime
let random;

// ids
const idBotUsername = document.getElementById('botUsename')
const idAuthType = document.getElementById('botAuthType')
const idIp = document.getElementById('botConnectIp')
const idBotCount = document.getElementById('botCount')
const idJoinDelay = document.getElementById('joinDelay')
const idJoinMessage = document.getElementById('joinMessage')
const idBtnStart = document.getElementById('btnStart')
const idBtnStop = document.getElementById('btnStop')
const idBotVersion = document.getElementById('botversion')
const idBotList = document.getElementById('botList')
const idBtnDc = document.getElementById('btnDisconnect')
const idBtnRc = document.getElementById('btnReconnect')
const idBtnUse = document.getElementById('btnUseHeld')
const idBtnClose = document.getElementById('btnCloseWin')
const idBtnStartScript = document.getElementById('btnStartScript')
const idBtnChat = document.getElementById('btnChatMessage')
const idChatMessage = document.getElementById('chatMessage')
const idSpamMessage = document.getElementById('spamMessageBox')
const idSpamDelay = document.getElementById('spamDelay')
const idProxyToggle = document.getElementById('useProxy')
const idDownbarBotCount = document.getElementById('downbarBotCount')
const idChatBox = document.getElementById('chatBox')
const idCheckAutoRc = document.getElementById('checkboxAutoRc')
const idReconDelay = document.getElementById('reconDelay')
const idBtnSpam = document.getElementById('startSpam')
const idBtnSpamStop = document.getElementById('stopSpam')
const idUptime = document.getElementById('uptime')
const idHotbarSlot = document.getElementById('hotbarSlot')
const idBtnSetHotbar = document.getElementById('btnSetHotbar')
const idBtnWinClickSlot = document.getElementById('windowValue')
const idClickWinLoR = document.getElementById('clickWindowLorR')
const idBtnWinClick = document.getElementById('btnWindowClick')
const idControlValue = document.getElementById('controlValue')
const idControlStart = document.getElementById('startControl')
const idControlStop = document.getElementById('stopControl')
const idLookValue = document.getElementById('lookValue')
const idBtnLookAt = document.getElementById('setLook')
const idCheckSprint = document.getElementById('checkboxSprint')
const idBtnDrop = document.getElementById('btnDrop')
const idDropValue = document.getElementById('dropValue')
const idLinearValue = document.getElementById('linearValue')
const idScriptPath = document.getElementById('scriptPath')
const idScriptCheck = document.getElementById('scriptCheck')
const idAccountFileCheck = document.getElementById('accountFileCheck')
const idAccountFilePath = document.getElementById('accountFilePath')
const idBtnM = document.getElementById('btnMinimize')
const idBtnC = document.getElementById('btnClose')
const idProxyFilePath = document.getElementById('proxyFilePath')
const idProxyType = document.getElementById('proxyType')
const idProxyOrderRnd = document.getElementById('proxyOrderRnd')
const idCheckAntiSpam = document.getElementById('checkAntiSpam')
const idAntiAfkLoad = document.getElementById('loadAntiAfk')
const idStartAfk = document.getElementById('startAfk')
const idStopAfk = document.getElementById('stopAfk')
const antiSpamLength = document.getElementById('antiSpamLength')
const idBtnCustomCss = document.getElementById('btnSaveTheme')
const idCustomCssFile = document.getElementById('customCssFile')
const idPopupUl = document.getElementById('listul')
const idShowChatCheck = document.getElementById('showChatCheck')
const idWindow = document.getElementById('botOpenWindow')
const idWindowTitle = document.getElementById('botOpenWindowName')
const idKarange = document.getElementById('kaRange')
const idKadelay = document.getElementById('kaDelay')
const idTplayer = document.getElementById('kaTp')
const idTvehicle = document.getElementById('kaTv')
const idTmob = document.getElementById('kaTm')
const idTanimal = document.getElementById('kaTa')
const idKaToggle = document.getElementById('toggleka')
const idKaLook = document.getElementById('toggleKaLook')
const idAutoSelect = document.getElementById('toggleAutoSelect')
const idCheckOnRespawn = document.getElementById('scriptCheckOnRespawn')
const idCheckOnDeath = document.getElementById('scriptCheckOnDeath')
const idCheckIgnoreFriends = document.getElementById('checkKaIgnoreSelected')
const idAltToken = document.getElementById('easymcAuthToken')
const idStartScrape = document.getElementById('proxyScrapeStart')
const idProxyLogs = document.getElementById('proxyLogs')
const idScrapeProtocol = document.getElementById('proxyScrapeProtocol')
const idProxylist = document.getElementById('proxyTextBox')
const idStartProxyCheck = document.getElementById('buttonStartCheckBoxList')
const idProxyCheckProtocol = document.getElementById('proxyCheckProtocol')
const idProxyTimeout = document.getElementById('proxyTimeout')
const idproxyCheckDelay = document.getElementById('proxyCheckDelay')
const idStopCheck = document.getElementById('buttonStopCheck')
const idProxyDownbar = document.getElementById('proxyInfoDownbar')
const idCheckCount = document.getElementById('proxyInfoDownbarCount')
const idBtnCheckFile = document.getElementById('checkProxyfile')
const idTabBot = document.getElementById('btnBotting')
const idNameMethod = document.getElementById('usernameMethod')

const idStartViewBot = document.getElementById('startViewBot')
const idStopViewBot = document.getElementById('stopViewBot')
const idPortMessage = document.getElementById('portMessageBox')
const idPortInventoryMessage = document.getElementById('portInventoryMessageBox')
const idStartViewInventory = document.getElementById('startViewInventory')
const idStopViewInventory = document.getElementById('stopViewInventory')
const idStartFishing = document.getElementById('btnStartFishing')
const idStopFishing = document.getElementById('btnStopFishing')
const idCaptcha = document.getElementById('captcha')
const idToggleCaptcha = document.getElementById('toggleCaptcha')
const idCaptchaID = document.getElementById('captchaId')
const idSendCaptchaID = document.getElementById('sendcaptchaID')
const idRegisterMessage = document.getElementById("btnRegisterMessage")

// button listeners

window.onload = () => {
    botApi.setMaxListeners(0)
    checkVer()
}

idBtnStart.onclick = () => {
    if(idNameMethod.value == "default" && !idBotUsername.value) {
        createPopup("Invalid Username!", "red")
        return;
    }
    connectBot();
    saveData();
    idTabBot.click()
}
idBtnStop.onclick = () => {botApi.emit('stopBots')}
idBtnDc.onclick = () => {exeAll("disconnect")}
idBtnUse.onclick = () => {exeAll("useheld")}
idBtnClose.onclick = () => {exeAll("closewindow")}
idBtnSpam.onclick = () => {botApi.emit("spam", idSpamMessage.value, idSpamDelay.value)}
idBtnSpamStop.onclick = () => {botApi.emit("stopspam")}
idBtnChat.onclick = () => {exeAll("chat", idChatMessage.value)}
idBtnSetHotbar.onclick = () => {exeAll("sethotbar", idHotbarSlot.value)}
idBtnWinClick.onclick = () => {exeAll("winclick", idBtnWinClickSlot.value, idClickWinLoR.value)}
idControlStart.onclick = () => {exeAll("startcontrol", idControlValue.value)}
idControlStop.onclick = () => {exeAll("stopcontrol", idControlValue.value)}
idBtnLookAt.onclick = () => {exeAll("look", idLookValue.value)}
idCheckSprint.onclick = () => {exeAll("sprintcheck", idCheckSprint.checked)}
idBtnDrop.onclick = () => {exeAll("drop", idDropValue.value)}
idStartScrape.onclick = () => {scrapeProxy()}
idStartProxyCheck.onclick = () => {checkProxy(idProxylist.value)}
idBtnCheckFile.onclick = () => {
    const path = fs.readFileSync(idProxyFilePath.files[0].path)
    if (!path) return createPopup("No file selected.")
    const list = path.toString()
    checkProxy(list)
}

idBtnStartScript.onclick = () => {
    const list = selectedList()
    if(list.length === 0) return createPopup("No bot selected")
    list.forEach(name => {
        startScript(name, idScriptPath.value)
    });
}
idStartAfk.onclick = () => {exeAll('afkon')}
idStopAfk.onclick = () => {exeAll('afkoff')}
idBtnC.onclick = () => {saveData(); window.close()}
idBtnM.onclick = () => {ipcRenderer.send('minimize')}
idBtnCustomCss.onclick = () => {
    const path = idCustomCssFile.files[0].path
    if(path) {
        loadTheme(path)
        ipcRenderer.send('theme', (event, path))
    }
}
idKaToggle.onchange = () => {
    if(idKaToggle.checked) {
        botApi.emit("toggleka", idKadelay.value)
    } else {
        botApi.emit("stopka")
    }
}
idAuthType.onchange = () => {checkAuth()}

idStartViewBot.onclick = () => {exeAll('viewboton', idPortMessage.value)}
idStopViewBot.onclick = () => {exeAll('viewbotoff')}
idStartViewInventory.onclick = () => {exeAll('viewinventoryon', idPortInventoryMessage)}
idStopViewInventory.onclick = () => {exeAll('viewinventoryoff')}
idStartFishing.onclick = () => {exeAll('fishingon')}
idStopFishing.onclick = () => {exeAll('fishingoff')}
idToggleCaptcha.onclick = () => {exeAll("togglecaptcha", idToggleCaptcha.checked)}
idSendCaptchaID.onclick = () => {exeAll("sendCaptcha"), idCaptchaID.value}
idRegisterMessage.onclick = () => {exeAll("sendRegister")}

async function newBot(options) {
    const bot = createBot(options)
    let afkLoaded = false

    await bot.once('login', ()=> {
        botApi.emit("login", bot.username)
        botApi.once(bot.username+'disconnect', () => {bot.quit()})
        botApi.once(bot.username+'reconnect', () => {newBot(options)})
        botApi.on(bot.username+'useheld', () => {bot.activateItem()})
        botApi.on(bot.username+'closewindow', () => {bot.closeWindow(bot.currentWindow)})
        botApi.on(bot.username+'chat', (o) => { 
            if(idCheckAntiSpam.checked) { 
                bot.chat(o.toString().replaceAll("(SALT)", salt(4))+" "+salt(antiSpamLength.value ? antiSpamLength.value : 5))
                fs.unlink(`${__dirname}/assets/captcha.png`+random, (err) => {})
            } else { 
                bot.chat(o.toString().replaceAll("(SALT)", salt(4))) 
            } 
        })
        botApi.on(bot.username+'sethotbar', (o) => {bot.setQuickBarSlot(o)})
        botApi.on(bot.username+'winclick', (o, i) => {if(i == 0) {bot.clickWindow(o, 0, 0)} else {bot.clickWindow(o, 1, 0)}})
        botApi.on(bot.username+'stopcontrol', (o) => {bot.setControlState(o, false)})
        botApi.on(bot.username+'look', (o) => {bot.look(o, 0)})
        botApi.on(bot.username+'sprintcheck', (o) => {bot.setControlState('sprint', o)})
        botApi.on(bot.username+'startscript', () => {startScript(bot.username, idScriptPath.value)})
        if(idScriptCheck.checked) { startScript(bot.username, idScriptPath.value)}
        
        botApi.on(bot.username+'afkon', () => {
            if(!afkLoaded) {
                afkLoaded = true
                bot.loadPlugin(antiafk)
                bot.afk.start()
            } else {
                bot.afk.start()
            }
        })
        botApi.on(bot.username+'afkoff', () => {bot.afk.stop()})
        
        botApi.on(bot.username+'viewboton', (o) => {
            if(o) {
                mineflayerViewer(bot,{ port:o, firstPerson:true, viewDistance: 'far', showViewedChunks: true })
            } else {
                mineflayerViewer(bot,{ port:8888, firstPerson:true, viewDistance: 'far', showViewedChunks: true })
            }
        })
        botApi.on(bot.username+'viewbotoff', () => {
            mineflayerViewer.close();
        })

        botApi.on(bot.username+'viewinventoryon', (o) => {
            inventoryViewer(bot)
        })

        botApi.on(bot.username+'viewinventoryoff', () => {
            inventoryViewer.close();
        })

        botApi.on(bot.username+'fishingon', () => {
        })

        botApi.on(bot.username+'fishingoff', () => {
        })

        bot._client.on('map', ({ data }) => {
            if(bot.heldItem.name === 'filled_map') {
                if(!data) return;
                
                const size = Math.sqrt(data.length);
                const image = PNGImage.createImage(size, size);
            
                for(let x = 0; x < size; x++) {
                    for(let z = 0; z < size; z++) {
                        const colorId = data[x + (z * size)];
                        image.setAt(x, z, getColor(colorId));
                    }
                }

                random = Math.random(1, 100)
                image.writeImage(`${__dirname}/assets/captcha.png`+random);
                document.getElementById("botCaptcha").innerText = "Bot: "+ bot.username
            }
        })
        
        botApi.on(bot.username+'sendCaptcha', (o) => {
            bot.chat(o.toString().replaceAll("(SALT)", salt(4))+" "+salt(antiSpamLength.value ? antiSpamLength.value : 5))
            fs.unlink(`${__dirname}/assets/captcha.png`+random, (err) => {});
        })

        botApi.on(bot.username+'sendRegister', (o) => {
            bot.chat("/register 123123")
            bot.chat("/register 123123 123123")
            bot.chat("/login 123123")
        })

        botApi.on(bot.username+'drop', (o) => {
            const inventory = bot.inventory;

            if(o) {
                bot.clickWindow(o, 0, 0)
                bot.clickWindow(-999, 0, 0)
            } else {
                (async () => {
                    const itemCount = bot.inventory.items().length
                    for (var i = 0; i < itemCount; i++) {
                        if (bot.inventory.items().length === 0) return
                        const item = bot.inventory.items()[0]
                        bot.tossStack(item)
                        await delay(10)
                    }
                  })();
            }
        })
    
        botApi.on(bot.username+'startcontrol', (o) => {
            bot.setControlState(o, true)
            if(idCheckSprint.checked === true) {bot.setControlState('sprint', true)} else {bot.setControlState('sprint', false)}
        })
    
        idBtnRc.addEventListener('click', () => {botApi.emit(bot.username+'reconnect')})
    
        botApi.on(bot.username + 'hit', () => {
            const entities = Object.values(bot.entities);
            entities.forEach((entity) => {
                const distance = bot.entity.position.distanceTo(entity.position);
                if (distance <= idKarange.value) {
                    if (entity.kind === "Hostile mobs" && idTmob.checked) {
                        if (idKaLook.checked) {
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            bot.attack(entity);
                        }
                        sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.kind === "Passive mobs" && idTanimal.checked) {
                        if (idKaLook.checked) {
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            bot.attack(entity);
                        }
                        sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.kind === "Vehicles" && idTvehicle.checked) {
                        if (idKaLook.checked) {
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            bot.attack(entity);
                        }
                        sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.type === "player" && entity.username !== bot.username && idTplayer.checked) {
                        const list = selectedList()
                        if(list.includes(entity.username) && idCheckIgnoreFriends.checked) return;
                        if (idKaLook.checked) {
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            bot.attack(entity);
                        }
                        sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.username} </li>`)
                    }
                }
            });
        })
    });
    
    bot.once('spawn', () => {
        botApi.emit("spawn", bot.username)
        if(idJoinMessage) {bot.chat(idJoinMessage.value)}
    });
    
    bot.once('kicked', (reason)=> {
        botApi.emit("kicked", bot.username, reason)
    });
    bot.once('end', (reason)=> {
        botApi.emit("end", bot.username, reason)
        if(idCheckAutoRc.checked === true) {
            recon()
            async function recon() {
                await delay(idReconDelay.value)
                newBot(options)
            }
        }
    });
    bot.once('error', (err)=> {
        botApi.emit("error", bot.username, err)
    });
    
    bot.on('messagestr', (message) => {
        if(!message) return;
        if(idShowChatCheck.checked) {
            sendLog(`[${bot.username}] ${message}`)
        }
    });

    bot.on('windowOpen', (window) => {
        sendLog(`[${bot.username}] Window opened`)
    })
    bot.on('death', function() {
        botApi.emit('death', bot.username)
        bot.once('respawn', function() {
            if(idCheckOnDeath.checked && idScriptPath.value) { startScript(bot.username, idScriptPath.value)}
        })
    })
    bot.on('respawn', function() {
        botApi.emit('respawn', bot.username)
        if(idCheckOnRespawn.checked && idScriptPath.value) { startScript(bot.username, idScriptPath.value)}
    })
}

botApi.on('toggleka', (dl)=> {
    botApi.once('stopka', ()=> {clearInterval(katoggle)})
    var katoggle = setInterval(() => {
        exeAll('hit')
    }, dl ? dl: 500);
})

botApi.on('spam', (msg, dl) => {
    botApi.once('stopspam', ()=> {clearInterval(chatSpam)})
    var chatSpam = setInterval(() => {
        exeAll("chat", msg)
    }, dl ? dl: 1000);
})

botApi.on("login", (name)=> {
    addPlayer(name)
    sendLog(`<li> <img src="./assets/icons/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(68%) sepia(74%) saturate(5439%) hue-rotate(86deg) brightness(128%) contrast(114%)"> ${name} Logged in.</li>`)
})
botApi.on("end", (name, reason)=> {
    rmPlayer(name)
    sendLog(`<li> <img src="./assets/icons/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(100%) sepia(61%) saturate(4355%) hue-rotate(357deg) brightness(104%) contrast(104%)"> [${name}] ${reason}</li>`)
})
botApi.on("error", (name, err)=> {
    errBot(name)
    sendLog(`<li> <img src="./assets/icons/alert-triangle.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(89%) sepia(82%) saturate(799%) hue-rotate(1deg) brightness(103%) contrast(102%)"> [${name}] ${err}</li>`)
})
botApi.on("spawn", (name)=> {
    sendLog(`<li> <img src="./assets/icons/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Spawned.</li>`)
})
botApi.on("death", (name)=> {
    sendLog(`<li> <img src="./assets/icons/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Died.</li>`)
})
botApi.on("respawn", (name)=> {
    sendLog(`<li> <img src="./assets/icons/arrow-right.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(26%) sepia(94%) saturate(5963%) hue-rotate(74deg) brightness(96%) contrast(101%)"> ${name} Respawned.</li>`)
})
botApi.on("kicked", (name, reason)=> {
    rmPlayer(name)
    sendLog(`<li> <img src="./assets/icons/arrow-left.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(11%) sepia(92%) saturate(6480%) hue-rotate(360deg) brightness(103%) contrast(113%)"> [${name}] : ${formatText(JSON.parse(reason))}</li>`)
})

// uptime counter
idBtnStart.addEventListener('click', () => {
    currentTime = Date.now()
    idBtnStart.addEventListener('click', () => {
        clearInterval(botUptime)
        idUptime.innerHTML = getTime(currentTime)
    })
    
let botUptime = setInterval(() => {
    idUptime.innerHTML = getTime(currentTime)
}, 1000);
})
function getTime(from) {
    const calc = Date.now() - from
    return convertTime((calc / 1000).toFixed())
}
function convertTime(number) {
    return `${formatTime(Math.floor(number / 60))}:${formatTime(number % 60)}`;
}
function formatTime(time) {
    if (10 > time) return "0" + time;
    return time;
}
function playAudio(filename) {
    new Audio( __dirname + `./assets/audios/${filename}`).play();
}
// save and restore config
ipcRenderer.on('restore', (event, data) => {
    Object.keys(data).forEach(v => {
        document.getElementById(v).value = data[v]
      });
      checkAuth()
})
ipcRenderer.on('restoreTheme', (event, path) => {
    loadTheme(path)
})
function saveData() {
    ipcRenderer.send('config', (event, {
        "botUsename": document.getElementById('botUsename').value,
        "botAuthType": document.getElementById('botAuthType').value,
        "botConnectIp": document.getElementById('botConnectIp').value,
        "botversion": document.getElementById('botversion').value,
        "botCount": document.getElementById('botCount').value,
        "joinDelay": document.getElementById('joinDelay').value,
        "joinMessage": document.getElementById('joinMessage').value,
        'scriptPath': document.getElementById('scriptPath').value
    }))
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

function updateImage() {
    idCaptcha.src = './assets/captcha.png'+random;
}

setInterval(updateImage, 500)