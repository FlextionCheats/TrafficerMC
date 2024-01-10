const { ipcRenderer, shell } = require("electron");
const fs = require('fs');
const path = require('path');
const { getColor, mineflayerViewer, connectBot, delay, salt, addPlayer, rmPlayer, errBot, botApi, sendLog, exeAll, checkVer, startScript, loadTheme, createPopup, formatText, selectedList, checkAuth, createBot, scrapeProxy } = require(path.join(__dirname, "js", "utils.js"));
const { checkProxy } = require(path.join(__dirname, "js", "plugins", "proxy.js"))
const antiafk = require(path.join(__dirname, "js", "plugins", "afk.js"))
const captchaSolver = require(`${__dirname}/js/plugins/captchaSolver.js`);

const inventoryViewer = require('mineflayer-web-inventory')
const PNGImage = require('pngjs-image');
const { pathfinder, Movements, goals } = require('mineflayer-pathfinder');

let currentTime
let targetPlayer = null;
const radius = 3; 
const captchaCheckState = new Map();
let following = false;

const bots = [];
let index = 0;

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
const idRegisterMessage = document.getElementById("btnRegisterMessage")
const idFollowingPlayer = document.getElementById("followingPlayer")
const idStartFollowingPlayer = document.getElementById("startFollowing")
const idStopFollowingPlayer = document.getElementById("stopFollowing")
const idKeyCaptcha = document.getElementById('keyCaptchaGuru')
const idCircleRadius = document.getElementById('circleRadius')
const idStartCircle = document.getElementById('startCircle')
const idStopCircle = document.getElementById('stopCircle')
const idFriends = document.getElementById('friends')
const idAutoJump = document.getElementById('autojump')

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
idStartViewInventory.onclick = () => {exeAll('viewinventoryon', idPortInventoryMessage.value)}
idStopViewInventory.onclick = () => {exeAll('viewinventoryoff')}
idStartFishing.onclick = () => {exeAll('fishingon')}
idStopFishing.onclick = () => {exeAll('fishingoff')}
idRegisterMessage.onclick = () => {exeAll("sendRegister")}
idStartFollowingPlayer.onclick = () => {exeAll('followingon', idFollowingPlayer.value)}
idStopFollowingPlayer.onclick = () => {exeAll('followingoff')}
idStartCircle.onclick = () => {exeAll('circleon', idCircleRadius.value)}
idStopCircle.onclick = () => {exeAll('circleoff')}

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

                image.writeImage(`${__dirname}/assets/captcha_`+bot.username+'.png');
                bots.push(bot);
            }
        })

        botApi.on(bot.username+'sendRegister', (o) => {
            bot.chat("/register 123123")
            bot.chat("/register 123123 123123")
            bot.chat("/login 123123")
        })

        botApi.on(bot.username+'followingon', (o) => {
            const targetUsername = o;
            targetPlayer = bot.players[targetUsername];
            if (targetPlayer) {
                sendLog(`Following player: ${targetUsername}`);
                followPlayer();
            } else {
                sendLog(`Player ${targetUsername} not found.`);
            }
        })

        botApi.on(bot.username+'followingoff', () => {
            targetPlayer = null;
            stopFollow();
        })

        bot.on('playerLeft', (player) => {
            if (targetPlayer && player.username === targetPlayer.username) {
                stopFollow();
                sendLog(`Player ${player.username} left. Stopped following.`);
                targetPlayer = null;
            }
        })

        botApi.on(bot.username+'circleon', (o) => {
            
        })

        function getAverageCoordinates() {
            let totalX = 0;
            let totalZ = 0;
        
            bots.forEach((bot) => {
                totalX += bot.entity.position.x;
                totalZ += bot.entity.position.z;
            });
        
            const centerX = totalX / bots.length;
            const centerZ = totalZ / bots.length;
        
            return { x: centerX, z: centerZ };
        }

        botApi.on(bot.username+'circleoff', () => {

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
    
        const lastAttackTimes = {};
        botApi.on(bot.username + 'hit', (dl) => {
            const entities = Object.values(bot.entities);
            if (!lastAttackTimes[bot.username]) {
                lastAttackTimes[bot.username] = Date.now(); // Если нет, установить текущее время
            }        
            entities.forEach((entity) => {
                const distance = bot.entity.position.distanceTo(entity.position);
                if (distance <= idKarange.value) {
                    const randomOffset = () => (Math.random() * 14 - 7) * 0.0175
                    if (entity.kind === "Hostile mobs" && idTmob.checked) {
                        if (idKaLook.checked) {
                            if(idAutoJump.checked === true) {
                                bot.setControlState('jump', true)
                                setTimeout(() => {
                                    bot.setControlState('jump', false)
                                }, 250)
                            }
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            if(idAutoJump.checked === true) {
                                bot.setControlState('jump', true)
                                setTimeout(() => {
                                    bot.setControlState('jump', false)
                                }, 250)
                            }
                            bot.attack(entity);
                        }
                        //sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.kind === "Passive mobs" && idTanimal.checked) {
                        if (idKaLook.checked) {
                            if(idAutoJump.checked === true) {
                                bot.setControlState('jump', true)
                                setTimeout(() => {
                                    bot.setControlState('jump', false)
                                }, 250)
                            }
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            if(idAutoJump.checked === true) {
                                bot.setControlState('jump', true)
                                setTimeout(() => {
                                    bot.setControlState('jump', false)
                                }, 250)
                            }
                            bot.attack(entity);
                        }
                        //sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.kind === "Vehicles" && idTvehicle.checked) {
                        if (idKaLook.checked) {
                            if(idAutoJump.checked === true) {
                                bot.setControlState('jump', true)
                                setTimeout(() => {
                                    bot.setControlState('jump', false)
                                }, 250)
                            }
                            bot.lookAt(entity.position, true);
                            bot.attack(entity);
                        } else {
                            if(idAutoJump.checked === true) {
                                bot.setControlState('jump', true)
                                setTimeout(() => {
                                    bot.setControlState('jump', false)
                                }, 250)
                            }
                            bot.attack(entity);
                        }
                        //sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.displayName ? entity.displayName : "Unknown Entity"} </li>`)
                    }
                    if (entity.type === "player" && entity.username !== bot.username && idTplayer.checked && !idFriends.value.toString().split(",").includes(entity.username)) {
                        const list = selectedList()
                        if(list.includes(entity.username) && idCheckIgnoreFriends.checked) return;
                        if (idKaLook.checked) {
                            if(idAutoJump.checked === true) {
                                bot.setControlState('jump', true)
                                setTimeout(() => {
                                    bot.setControlState('jump', false)
                                }, 250)
                            }
                            bot.lookAt(entity.position.offset(randomOffset(), 1.1, randomOffset()), true, true, (entity.yaw - bot.entity.yaw), (entity.pitch - bot.entity.pitch));
                            let interval = dl || 500;

                            const currentTime = Date.now();
                            const timeSinceLastAttack = currentTime - lastAttackTimes[bot.username];

                            if (timeSinceLastAttack >= interval) {
                                bot.attack(entity);
                                lastAttackTimes[bot.username] = currentTime;
                            }
                        } else {
                            if(idAutoJump.checked === true) {
                                bot.setControlState('jump', true)
                                setTimeout(() => {
                                    bot.setControlState('jump', false)
                                }, 250)
                            }
                            bot.attack(entity);
                        }
                        //sendLog(`<li> <img src="./assets/icons/code.svg" class="icon-sm" style="filter: brightness(0) saturate(100%) invert(28%) sepia(100%) saturate(359%) hue-rotate(172deg) brightness(93%) contrast(89%)"> [hit] ${entity.username} </li>`)
                    }
                }
            });
        })
    });
    
    bot.once('spawn', () => {
        botApi.emit("spawn", bot.username)
        if(idJoinMessage.value != '') {
            bot.chat("/register " + idJoinMessage.value)
            bot.chat("/login " + idJoinMessage.value)
        }
        bot.loadPlugin(pathfinder);
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

    function followPlayer() {
        if (targetPlayer && targetPlayer.entity) {
            following = true;
            bot.on('physicTick', () => {
                if (!targetPlayer || !targetPlayer.entity) {
                    stopFollow();
                    return;
                }
                if(!following) {return}

                const distanceToPlayer = bot.entity.position.distanceTo(targetPlayer.entity.position);

                const blockInFront = bot.blockAt(bot.entity.position.offset(0, 0, 1));
                const blockInFront3 = bot.blockAt(bot.entity.position.offset(0, 0, -1));
                const blockInFront2 = bot.blockAt(bot.entity.position.offset(1, 0, 0));
                const blockInFront4 = bot.blockAt(bot.entity.position.offset(-1, 0, 0));
                const blockInFront5 = bot.blockAt(bot.entity.position.offset(0, -1, 0));

                const blockInFront11 = bot.blockAt(bot.entity.position.offset(1, -1, 0));
                const blockInFront12 = bot.blockAt(bot.entity.position.offset(2, -1, 0));
                const blockInFront13 = bot.blockAt(bot.entity.position.offset(3, -1, 0));

                const blockInFront14 = bot.blockAt(bot.entity.position.offset(-1, -1, 0));
                const blockInFront15 = bot.blockAt(bot.entity.position.offset(-2, -1, 0));
                const blockInFront16 = bot.blockAt(bot.entity.position.offset(-3, -1, 0));

                const blockInFront17 = bot.blockAt(bot.entity.position.offset(0, -1, 1));
                const blockInFront18 = bot.blockAt(bot.entity.position.offset(0, -1, 2));
                const blockInFront19 = bot.blockAt(bot.entity.position.offset(0, -1, 3));

                const blockInFront20 = bot.blockAt(bot.entity.position.offset(0, -1, -1));
                const blockInFront21 = bot.blockAt(bot.entity.position.offset(0, -1, -2));
                const blockInFront22 = bot.blockAt(bot.entity.position.offset(0, -1, -3));

                const blockInFront30 = bot.blockAt(bot.entity.position.offset(1, -1, 0));
                const blockInFront31 = bot.blockAt(bot.entity.position.offset(2, -1, 0));
                const blockInFront32 = bot.blockAt(bot.entity.position.offset(3, -1, 0));
                const blockInFront33 = bot.blockAt(bot.entity.position.offset(4, -1, 0));

                const blockInFront34 = bot.blockAt(bot.entity.position.offset(-1, -1, 0));
                const blockInFront35 = bot.blockAt(bot.entity.position.offset(-2, -1, 0));
                const blockInFront36 = bot.blockAt(bot.entity.position.offset(-3, -1, 0));
                const blockInFront37 = bot.blockAt(bot.entity.position.offset(-4, -1, 0));

                const blockInFront38 = bot.blockAt(bot.entity.position.offset(0, -1, 1));
                const blockInFront39 = bot.blockAt(bot.entity.position.offset(0, -1, 2));
                const blockInFront40 = bot.blockAt(bot.entity.position.offset(0, -1, 3));
                const blockInFront41 = bot.blockAt(bot.entity.position.offset(0, -1, 4));

                const blockInFront42 = bot.blockAt(bot.entity.position.offset(0, -1, -1));
                const blockInFront43 = bot.blockAt(bot.entity.position.offset(0, -1, -2));
                const blockInFront44 = bot.blockAt(bot.entity.position.offset(0, -1, -3));
                const blockInFront45 = bot.blockAt(bot.entity.position.offset(0, -1, -4));

                if ((distanceToPlayer > 1) || (
                    (blockInFront11 && blockInFront12 && blockInFront13 && blockInFront11.type === 0 && blockInFront12.type === 0 && blockInFront13.type === 0) ||
                    (blockInFront14 && blockInFront15 && blockInFront16 && blockInFront14.type === 0 && blockInFront15.type === 0 && blockInFront16.type === 0) ||
                    (blockInFront17 && blockInFront18 && blockInFront19 && blockInFront17.type === 0 && blockInFront18.type === 0 && blockInFront19.type === 0) ||
                    (blockInFront20 && blockInFront21 && blockInFront22 && blockInFront20.type === 0 && blockInFront21.type === 0 && blockInFront22.type === 0)
                    )) {
                    bot.setControlState('sprint', true);
                } else if(blockInFront5 && blockInFront5.type !== 0) {
                    bot.setControlState('sprint', false);
                }

                if (distanceToPlayer > 1) {
                    bot.setControlState('forward', true);
                } else {
                    bot.setControlState('forward', false);
                }
    
                bot.lookAt(targetPlayer.entity.position.offset(0, targetPlayer.entity.height, 0));

                if (
                    (blockInFront && blockInFront.type !== 0) || 
                    (blockInFront2 && blockInFront2.type !== 0) ||
                    (blockInFront3 && blockInFront3.type !== 0) ||
                    (blockInFront4 && blockInFront4.type !== 0) ||
                    (blockInFront5 && blockInFront5.type === 0)
                    ) {
                    bot.setControlState('jump', true);
                    setTimeout(() => {
                        bot.setControlState('jump', false);
                    }, 250); 
                }
            });
        }
    }

    function stopFollow() {
        following = false
        bot.setControlState('forward', false);
        bot.setControlState('sprint', false);
        bot.setControlState('jump', false);
    }
}

botApi.on('toggleka', (dl)=> {
    botApi.once('stopka', ()=> {
        clearInterval(katoggle)
    })

    var katoggle = setInterval(() => {
        exeAll('hit', dl)
    }, 1);
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
        "scriptPath": document.getElementById('scriptPath').value,
        "key": document.getElementById('keyCaptchaGuru').value
    }))
}

async function captchaSolverValue() {
    if (index < bots.length) {
        const botCaptcha = bots[index];
        captchaPath = `${__dirname}/assets/captcha_` + botCaptcha.username + '.png'

        idCaptcha.src = './assets/captcha_' + bots[index].username + '.png';
        document.getElementById("botCaptcha").innerText = "Bot: "+ botCaptcha.username
        if (!captchaCheckState.has(botCaptcha.username) && botCaptcha.heldItem.name === 'filled_map') {
            await captchaSolver.solveCaptcha(captchaPath).then(result => {
                if (result) {
                    document.getElementById('solveCaptcha').innerText = "Answer: " + result;
                    botCaptcha.chat(result);
                }
            });
            captchaCheckState.set(botCaptcha.username, true);
        }

        if(botCaptcha.heldItem.name != 'filled_map') {
            fs.unlink(`${__dirname}/assets/captcha_` + bots[index].username + '.png', (err) => {});
            captchaCheckState.delete(botCaptcha.username);
            index++;
        }

        botCaptcha.on('end', () => {
            fs.unlink(`${__dirname}/assets/captcha_` + bots[index].username + '.png', (err) => {});
            captchaCheckState.delete(botCaptcha.username);
            index++;
        })
    } else {
        document.getElementById("botCaptcha").innerText = "Bot: "
        idCaptcha.src = '';
    }
}

setInterval(captchaSolverValue, 650)