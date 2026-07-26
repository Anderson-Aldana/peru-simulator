/* ==========================================
   PERÚ SIMULATOR - MOTOR DE JUEGO PRINCIPAL (game.js)
   ========================================== */

// Nombres para generación aleatoria
const RANDOM_FIRST_NAMES_M = ["Brayan", "Kevin", "Jeferson", "Aldair", "Paolo", "Renato", "Julio", "Christian", "Anderson", "Jean Pierre", "Jhony", "Gerson", "Gianfranco"];
const RANDOM_FIRST_NAMES_F = ["Kimberly", "Yahaira", "Sheyla", "Shirley", "Milagros", "Fiorella", "Leslie", "Estefany", "Angie", "Brenda", "Xiomara", "Dayana", "Kiara"];
const RANDOM_LAST_NAMES = ["Quispe", "Mamani", "Flores", "Condori", "Huamán", "Ramos", "Castillo", "Gonzales", "Rojas", "Díaz", "Mendoza", "Alvarado", "Chávez", "Sánchez"];

// Emojis de avatar basados en edad y género
const STAGE_AVATARS = {
    m: { baby: "👶", kid: "👦", youth: "🧑", adult: "👨", senior: "👴" },
    f: { baby: "👶", kid: "👧", youth: "👩", adult: "👩", senior: "👵" },
    nb: { baby: "👶", kid: "🛸", youth: "🛸", adult: "🛸", senior: "🛸" }
};

class PeruSimulator {
    constructor() {
        // Estado del jugador
        this.player = {
            name: "",
            gender: "m",
            birthplace: "lima",
            socialClass: "media",
            familyDynamic: "normal",
            age: 0,
            stage: "baby", // baby, kid, youth, adult, senior
            money: 0,
            health: 100,
            happiness: 100,
            stress: 0,
            education: 0,
            contacts: 0,
            luck: 50,
            karmaValue: 50, // 0 = Caótico/Malvado, 100 = Santo
            
            job: "Ninguno",
            partner: null, // { name: "", relationValue: 50, married: false }
            assets: [], // Lista de bienes
            pets: [], // Lista de mascotas
            
            studyPath: "", // nacional, particular_barata, particular_cara, trabajo
            socialLogCount: 0, // Contador para envíos de WhatsApp
            unlockedAchievements: [], // IDs de logros
            recentLogs: [],
            activeEventId: null
        };
        
        // Configuración
        this.chaosMode = false;
        this.activeEvent = null; // Evento decisivo en pantalla
        
        // Historial General (Persistido en LocalStorage)
        this.history = {
            totalLives: 0,
            maxAge: 0,
            maxMoney: 0,
            unlockedEndings: [],
            livesHistory: []
        };
        
        // Minijuegos variables temporales
        this.activeMinigame = null;
        this.penaltyStreak = 0;
        this.memoryCards = [];
        this.memoryFlipped = [];
        this.memoryMatches = 0;
        this.memoryTimer = null;
        this.memoryTimeLeft = 20;

        // Contexto de Audio (Inicializado flojo)
        this.audioCtx = null;
    }

    init() {
        this.loadSystemData();
        this.bindEvents();
        this.updateMainMenuUI();
        this.playBeep("success"); // Sonido inicial de carga
        
        const justBorn = localStorage.getItem("peru_simulator_just_born");
        if (justBorn === "true") {
            localStorage.removeItem("peru_simulator_just_born");
            const savedGame = localStorage.getItem("peru_simulator_current_run");
            const savedChaos = localStorage.getItem("peru_simulator_chaos_mode");
            if (savedGame) {
                this.player = JSON.parse(savedGame);
                this.injectPlayerMethods();
                this.chaosMode = savedChaos ? JSON.parse(savedChaos) : false;
            }
            
            const logContainer = document.getElementById("console-log");
            if (logContainer) logContainer.innerHTML = "";
            this.pushLog(`👶 Naces en ${this.getBirthplaceLabel(this.player.birthplace)}. ¡Que empiece la vida!`);
            
            this.switchScreen("screen-gameplay");
            this.updateGameplayUI();
            this.triggerEventById("nacimiento_options");
        } else {
            this.switchScreen("screen-main-menu");
        }
    }

    // --- SONIDOS SINTETIZADOS CON WEB AUDIO API ---
    initAudio() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    playBeep(type) {
        try {
            this.initAudio();
            if (!this.audioCtx || this.audioCtx.state === 'suspended') {
                return; // Navegador bloquea audio hasta interacción
            }
            
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            
            const now = this.audioCtx.currentTime;
            
            if (type === "click") {
                osc.type = "sine";
                osc.frequency.setValueAtTime(400, now);
                osc.frequency.exponentialRampToValueAtTime(100, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
            } else if (type === "success") {
                osc.type = "triangle";
                osc.frequency.setValueAtTime(587.33, now); // D5
                osc.frequency.setValueAtTime(880.00, now + 0.1); // A5
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.25);
                osc.start(now);
                osc.stop(now + 0.25);
            } else if (type === "fail") {
                osc.type = "sawtooth";
                osc.frequency.setValueAtTime(220, now); // A3
                osc.frequency.linearRampToValueAtTime(80, now + 0.3);
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.35);
                osc.start(now);
                osc.stop(now + 0.35);
            } else if (type === "achievement") {
                osc.type = "sine";
                // Arpegio alegre
                const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C E G C E G
                notes.forEach((freq, idx) => {
                    const time = now + idx * 0.07;
                    osc.frequency.setValueAtTime(freq, time);
                });
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.linearRampToValueAtTime(0.01, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            }
        } catch (e) {
            console.warn("AudioContext no disponible o bloqueado", e);
        }
    }

    // --- ENLACE DE EVENTOS DOM ---
    bindEvents() {
        // Helper seguro: evita crashes si algún elemento no existe en el DOM
        const on = (id, event, handler) => {
            const el = document.getElementById(id);
            if (el) el.addEventListener(event, handler);
        };

        // Pantallas
        on("btn-new-game", "click", () => {
            this.playBeep("click");
            this.switchScreen("screen-character-creator");
        });
        on("btn-creator-back", "click", () => {
            this.playBeep("click");
            this.switchScreen("screen-main-menu");
        });
        on("btn-random-name", "click", () => {
            this.playBeep("click");
            this.generateRandomName();
        });
        on("btn-start-life", "click", () => {
            this.playBeep("click");
            this.startNewLife();
        });

        // Toggle Modo Caótico
        on("toggle-chaos-mode", "change", (e) => {
            this.playBeep("click");
            this.chaosMode = e.target.checked;
        });

        // Botones Generales de Tablero
        on("btn-action-next-year", "click", () => {
            this.playBeep("click");
            this.advanceYear();
        });
        on("btn-action-save", "click", () => {
            this.playBeep("success");
            this.saveGameProgress();
            alert("¡Partida guardada correctamente!");
        });
        on("btn-action-quit", "click", () => {
            this.playBeep("click");
            if (confirm("¿Estás seguro de salir al menú? Tu progreso no guardado se perderá.")) {
                this.switchScreen("screen-main-menu");
            }
        });

        // Modales - Abrir
        on("btn-open-achievements", "click", () => {
            this.playBeep("click");
            this.openAchievementsModal();
        });
        on("btn-open-stats-history", "click", () => {
            this.playBeep("click");
            this.openStatsHistoryModal();
        });
        on("btn-tab-activities", "click", () => {
            this.playBeep("click");
            this.openActivitiesModal();
        });
        on("btn-tab-relationships", "click", () => {
            this.playBeep("click");
            this.openRelationshipsModal();
        });
        on("btn-tab-minigames", "click", () => {
            this.playBeep("click");
            this.openMinigamesModal();
        });

        // Modales - Cerrar
        document.querySelectorAll(".modal-close, .modal-overlay").forEach(closeEl => {
            closeEl.addEventListener("click", (e) => {
                if (e.target === closeEl || e.target.classList.contains("modal-close")) {
                    this.playBeep("click");
                    document.querySelectorAll(".modal-overlay").forEach(modal => modal.classList.remove("active"));
                }
            });
        });

        // Actividades - Cambios de pestaña
        document.querySelectorAll(".modal-tabs .tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.playBeep("click");
                const targetTab = btn.getAttribute("data-tab");
                btn.parentElement.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const modal = btn.closest(".modal-content");
                modal.querySelectorAll(".tab-panel").forEach(panel => panel.classList.remove("active"));
                const targetPanel = modal.querySelector(`#${targetTab}`);
                if (targetPanel) targetPanel.classList.add("active");
            });
        });

        // Minijuegos - Acciones
        on("btn-select-penalties", "click", () => {
            this.playBeep("click");
            this.startMinigame("penalties");
        });
        on("btn-select-memory", "click", () => {
            this.playBeep("click");
            this.startMinigame("memory");
        });
        on("btn-select-roulette", "click", () => {
            this.playBeep("click");
            this.startMinigame("roulette");
        });
        on("btn-back-to-selector", "click", () => {
            this.playBeep("click");
            this.exitMinigameView();
        });

        // Penalties - Chutes
        document.querySelectorAll(".goal-target").forEach(target => {
            target.addEventListener("click", () => {
                this.playBeep("click");
                this.shootPenalty(target.getAttribute("data-dir"));
            });
        });

        // Roulette - Apuesta
        document.querySelectorAll(".roulette-bet-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                this.playBeep("click");
                this.spinRoulette(btn.getAttribute("data-bet"));
            });
        });

        // Social - Acciones extras
        on("btn-find-partner", "click", () => {
            this.playBeep("click");
            this.socialSearchPartner();
        });
        on("btn-adopt-pet", "click", () => {
            this.playBeep("click");
            this.socialAdoptPet();
        });

        // Finales
        on("btn-ending-menu", "click", () => {
            this.playBeep("click");
            this.switchScreen("screen-main-menu");
        });
        on("btn-share-text", "click", () => {
            this.playBeep("success");
            this.shareResultsAsText();
        });
        on("btn-download-dni", "click", () => {
            this.playBeep("success");
            this.downloadDNIImage();
        });

        // Botón Cargar del Menú Principal
        on("btn-load-game", "click", () => {
            this.playBeep("click");
            this.loadSavedGame();
        });

        // Borrar datos
        on("btn-clear-history", "click", () => {
            if (confirm("¿Estás seguro de borrar todos tus récords, logros e historial? Esta acción no se puede deshacer.")) {
                this.playBeep("fail");
                localStorage.clear();
                this.loadSystemData();
                this.updateMainMenuUI();
                alert("Datos eliminados correctamente.");
                document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
            }
        });
    }

    // --- ALMACENAMIENTO DE DATOS ---
    loadSystemData() {
        const localHistory = localStorage.getItem("peru_simulator_history");
        if (localHistory) {
            try {
                this.history = JSON.parse(localHistory);
            } catch (e) {
                console.error("Error cargando historial de guardado", e);
            }
        }
        
        // Cargar logros desbloqueados globales
        const localAchievements = localStorage.getItem("peru_simulator_achievements");
        if (localAchievements) {
            try {
                const unlockedList = JSON.parse(localAchievements);
                window.GAME_ACHIEVEMENTS.forEach(ach => {
                    if (unlockedList.includes(ach.id)) {
                        ach.unlocked = true;
                    }
                });
            } catch (e) {
                console.error("Error cargando logros de guardado", e);
            }
        }

        // Revisar si hay una partida en progreso para habilitar el botón "Cargar Partida"
        const savedGame = localStorage.getItem("peru_simulator_current_run");
        const btnLoad = document.getElementById("btn-load-game");
        if (btnLoad) {
            if (savedGame) {
                btnLoad.removeAttribute("disabled");
            } else {
                btnLoad.setAttribute("disabled", "true");
            }
        }
    }

    saveSystemData() {
        localStorage.setItem("peru_simulator_history", JSON.stringify(this.history));
        
        // Guardar logros desbloqueados
        const unlockedIds = window.GAME_ACHIEVEMENTS.filter(a => a.unlocked).map(a => a.id);
        localStorage.setItem("peru_simulator_achievements", JSON.stringify(unlockedIds));
    }

    saveGameProgress() {
        localStorage.setItem("peru_simulator_current_run", JSON.stringify(this.player));
        localStorage.setItem("peru_simulator_chaos_mode", JSON.stringify(this.chaosMode));
        const btnLoad = document.getElementById("btn-load-game");
        if (btnLoad) {
            btnLoad.removeAttribute("disabled");
        }
    }

    loadSavedGame() {
        const savedGame = localStorage.getItem("peru_simulator_current_run");
        const savedChaos = localStorage.getItem("peru_simulator_chaos_mode");
        if (savedGame) {
            try {
                this.player = JSON.parse(savedGame);
                // Inyectar métodos al objeto player ya que provienen de JSON plano
                this.injectPlayerMethods();
                this.chaosMode = savedChaos ? JSON.parse(savedChaos) : false;
                
                const toggleChaos = document.getElementById("toggle-chaos-mode");
                if (toggleChaos) toggleChaos.checked = this.chaosMode;
                this.switchScreen("screen-gameplay");
                this.updateGameplayUI();
                this.pushLog("💾 Partida cargada exitosamente.");
                
                // Restaurar bitácora de logs histórica
                const logContainer = document.getElementById("console-log");
                if (logContainer && this.player.recentLogs) {
                    logContainer.innerHTML = "";
                    this.player.recentLogs.forEach(msg => {
                        const entry = document.createElement("div");
                        entry.className = "log-entry";
                        entry.innerHTML = msg;
                        logContainer.appendChild(entry);
                    });
                    logContainer.scrollTop = logContainer.scrollHeight;
                }

                // RESTAURAR O GENERAR BOTÓN INTERACTIVO
                if (this.player.activeEventId) {
                    this.triggerEventById(this.player.activeEventId);
                } else {
                    this.displayEventCard({
                        title: "Partida Cargada",
                        description: "Has reanudado tu vida en el Perú. Presiona 'Siguiente Año' para continuar tu camino.",
                        emoji: "💾",
                        options: [
                            {
                                text: "Entendido",
                                resolve: () => {
                                    return "Listo para continuar.";
                                }
                            }
                        ]
                    });
                    this.activeEvent = null; // Permitir avanzar de año
                }
            } catch (e) {
                alert("Error al cargar la partida.");
                console.error(e);
            }
        } else {
            alert("No hay partida guardada en este navegador.");
        }
    }

    injectPlayerMethods() {
        // Volvemos a atar los métodos de desbloqueo de logros que se borraron en JSON.stringify
        this.player.unlockAchievement = (id) => this.unlockAchievement(id);
    }

    // --- LÓGICA DE JUEGO ---
    switchScreen(screenId) {
        document.querySelectorAll(".game-screen").forEach(screen => {
            screen.classList.remove("active");
        });
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add("active");
        } else {
            console.warn(`[switchScreen] Pantalla no encontrada: #${screenId}`);
        }
    }

    generateRandomName() {
        const gender = document.querySelector('input[name="char-gender"]:checked').value;
        let firstName = "";
        if (gender === "m") {
            firstName = RANDOM_FIRST_NAMES_M[Math.floor(Math.random() * RANDOM_FIRST_NAMES_M.length)];
        } else if (gender === "f") {
            firstName = RANDOM_FIRST_NAMES_F[Math.floor(Math.random() * RANDOM_FIRST_NAMES_F.length)];
        } else {
            firstName = "El " + RANDOM_FIRST_NAMES_M[Math.floor(Math.random() * RANDOM_FIRST_NAMES_M.length)];
        }
        const lastName1 = RANDOM_LAST_NAMES[Math.floor(Math.random() * RANDOM_LAST_NAMES.length)];
        const lastName2 = RANDOM_LAST_NAMES[Math.floor(Math.random() * RANDOM_LAST_NAMES.length)];
        
        document.getElementById("char-name").value = `${firstName} ${lastName1} ${lastName2}`;
    }

    startNewLife() {
        const nameInput = document.getElementById("char-name").value.trim();
        if (!nameInput) {
            alert("Por favor ingresa un nombre para tu personaje.");
            return;
        }

        const genderEl = document.querySelector('input[name="char-gender"]:checked');
        const birthplaceEl = document.querySelector('input[name="char-birthplace"]:checked');
        const socialClassEl = document.querySelector('input[name="char-class"]:checked');
        const familyDynamicEl = document.querySelector('input[name="char-family"]:checked');

        const gender = genderEl ? genderEl.value : "m";
        const birthplace = birthplaceEl ? birthplaceEl.value : "lima";
        const socialClass = socialClassEl ? socialClassEl.value : "media";
        const familyDynamic = familyDynamicEl ? familyDynamicEl.value : "normal";

        // Resetear jugador
        this.player = {
            name: nameInput,
            gender: gender,
            birthplace: birthplace,
            socialClass: socialClass,
            familyDynamic: familyDynamic,
            age: 0,
            stage: "baby",
            money: 0,
            health: 100,
            happiness: 100,
            stress: 0,
            education: 0,
            contacts: 0,
            luck: 50,
            karmaValue: 50,
            job: "Ninguno",
            partner: null,
            assets: [],
            pets: [],
            studyPath: "",
            socialLogCount: 0,
            unlockedAchievements: [],
            recentLogs: [],
            activeEventId: null
        };
        this.injectPlayerMethods();

        // Aplicar bonificaciones iniciales de origen
        // Región
        if (birthplace === "lima") {
            this.player.luck += 5;
            this.player.stress += 10;
        } else if (birthplace === "costa") {
            this.player.happiness += 10;
            this.player.health += 5;
        } else if (birthplace === "sierra") {
            this.player.health += 15;
            this.player.education += 5;
        } else if (birthplace === "selva") {
            this.player.happiness += 15;
            this.player.luck += 10;
        }

        // Clase social (Alcancía / Dinero realista de bebé)
        if (socialClass === "pobre") {
            this.player.luck += 15;
            this.player.contacts = 0;
            this.player.money = 0; // Bebé sin ahorros
        } else if (socialClass === "media") {
            this.player.money = 20; // Alcancía de chibolo
            this.player.contacts += 10;
            this.player.education += 10;
        } else if (socialClass === "rico") {
            this.player.money = 100; // Regalo de bautizo
            this.player.contacts += 30;
            this.player.education += 20;
        }

        // Familia
        if (familyDynamic === "estricta") {
            this.player.education += 10;
            this.player.stress += 5;
        } else if (familyDynamic === "relajada") {
            this.player.happiness += 10;
        } else if (familyDynamic === "caotica") {
            this.player.stress += 10;
            this.player.luck += 5;
        }

        // Guardar progreso inicial y modo caos
        this.saveGameProgress();
        
        // Iniciar vida directamente en SPA
        this.switchScreen("screen-gameplay");
        this.updateGameplayUI();
        const logContainer = document.getElementById("console-log");
        if (logContainer) logContainer.innerHTML = "";
        this.pushLog(`👶 Naces en ${this.getBirthplaceLabel(this.player.birthplace)}. ¡Que empiece la vida!`);
        this.triggerEventById("nacimiento_options");
    }

    getBirthplaceLabel(val) {
        const labels = { lima: "Lima 🏙️", costa: "la Costa 🌊", sierra: "la Sierra 🏔️", selva: "la Selva 🌴" };
        return labels[val] || val;
    }

    updateGameplayUI() {
        // Header
        document.getElementById("gameplay-name").innerText = this.player.name;
        document.getElementById("gameplay-age").innerText = this.player.age;
        
        let genderText = "No Binario";
        if (this.player.gender === "m") genderText = "Hombre";
        if (this.player.gender === "f") genderText = "Mujer";
        if (this.player.gender === "nb") genderText = "Combi Voladora 🚐";
        document.getElementById("gameplay-gender").innerText = genderText;
        
        document.getElementById("gameplay-birthplace").innerText = this.getBirthplaceLabel(this.player.birthplace);
        
        const classLabels = { pobre: "Humilde", media: "Clase Media", rico: "Acomodada" };
        const classBadge = document.getElementById("gameplay-class");
        classBadge.innerText = classLabels[this.player.socialClass] || this.player.socialClass;
        classBadge.className = `badge class-${this.player.socialClass}`;
        
        // Etapa de vida
        this.updateLifeStage();
        document.getElementById("gameplay-stage").innerText = this.getStageLabel(this.player.stage);
        
        // Avatar
        const avatars = STAGE_AVATARS[this.player.gender] || STAGE_AVATARS.nb;
        document.getElementById("gameplay-avatar").innerText = avatars[this.player.stage] || "👶";

        // Karma
        const karmaBadge = document.getElementById("gameplay-karma");
        let karmaText = "Neutral 😐";
        let karmaColor = "#9e9eaf";
        if (this.player.karmaValue >= 65) {
            karmaText = "Santo 😇";
            karmaColor = "#00e676";
            this.player.karma = "Santo";
        } else if (this.player.karmaValue <= 35) {
            karmaText = "Caótico 😈";
            karmaColor = "#ff1744";
            this.player.karma = "Caótico";
        } else {
            this.player.karma = "Neutral";
        }
        karmaBadge.innerText = karmaText;
        karmaBadge.style.color = karmaColor;

        // Chaos badge
        const chaosBadge = document.getElementById("gameplay-chaos-badge");
        if (this.chaosMode) {
            chaosBadge.classList.remove("hide");
        } else {
            chaosBadge.classList.add("hide");
        }

        // Barra de progreso de vida (de 0 a 95 años)
        const progressPercent = Math.min(100, (this.player.age / 95) * 100);
        document.getElementById("gameplay-life-progress").style.width = `${progressPercent}%`;

        // Estadísticas numéricas y barras
        this.renderStat("money", `S/. ${this.formatMoney(this.player.money)}`, null, this.player.money < 0 ? "val-bad" : "val-good");
        this.renderStat("health", `${this.player.health}%`, this.player.health);
        this.renderStat("happiness", `${this.player.happiness}%`, this.player.happiness);
        this.renderStat("stress", `${this.player.stress}%`, this.player.stress, this.player.stress > 70 ? "val-bad" : (this.player.stress > 35 ? "val-mid" : "val-good"));
        this.renderStat("education", `${this.player.education}%`, this.player.education);
        this.renderStat("contacts", `${this.player.contacts}%`, this.player.contacts);

        // Fichas resumen de pie
        document.getElementById("summary-job").innerText = `💼 ${this.player.job}`;
        
        let partnerText = "❤️ Soltero";
        if (this.player.partner) {
            partnerText = `${this.player.partner.married ? '💍' : '💖'} con ${this.player.partner.name}`;
        }
        document.getElementById("summary-partner").innerText = partnerText;

        const assetCount = this.player.assets.length;
        document.getElementById("summary-assets").innerText = `🏠 Bienes (${assetCount})`;

        const petCount = this.player.pets.length;
        document.getElementById("summary-pets").innerText = `🐕 Mascotas (${petCount})`;
    }

    renderStat(statName, valueText, percentVal, forceClass = null) {
        const textEl = document.getElementById(`stat-${statName}-percent`) || document.getElementById(`stat-${statName}`);
        if (textEl) {
            textEl.innerText = valueText;
        }

        const barEl = document.getElementById(`stat-${statName}-bar`);
        if (barEl && percentVal !== null) {
            barEl.style.width = `${percentVal}%`;
            
            // Quitar clases anteriores
            barEl.className = "stat-bar-fill";
            
            if (forceClass) {
                barEl.classList.add(forceClass);
            } else {
                // Clases por rango normal
                if (statName === "stress") {
                    // El estrés es malo si es alto
                    if (percentVal > 70) barEl.classList.add("val-bad");
                    else if (percentVal > 35) barEl.classList.add("val-mid");
                    else barEl.classList.add("val-low");
                } else {
                    if (percentVal > 65) barEl.classList.add("val-good");
                    else if (percentVal > 30) barEl.classList.add("val-mid");
                    else barEl.classList.add("val-bad");
                }
            }
        }
    }

    updateLifeStage() {
        const age = this.player.age;
        if (age <= 5) this.player.stage = "baby";
        else if (age <= 12) this.player.stage = "kid";
        else if (age <= 18) this.player.stage = "youth";
        else if (age <= 60) this.player.stage = "adult";
        else this.player.stage = "senior";
    }

    getStageLabel(stage) {
        const stages = { baby: "Bebé 🍼", kid: "Niño 🎒", youth: "Adolescente 🛹", adult: "Adulto 💼", senior: "Adulto Mayor 👴" };
        return stages[stage] || stage;
    }

    formatMoney(val) {
        return Number(val).toLocaleString('es-PE');
    }

    pushLog(msg) {
        this.player.recentLogs.push(msg);
        if (this.player.recentLogs.length > 30) {
            this.player.recentLogs.shift();
        }
        
        // Render logs
        const logContainer = document.getElementById("console-log");
        if (logContainer) {
            const entry = document.createElement("div");
            entry.className = "log-entry";
            entry.innerHTML = msg;
            logContainer.appendChild(entry);
            logContainer.scrollTop = logContainer.scrollHeight;
        }
    }

    // --- ACCIÓN DE AVANZAR AÑO ---
    advanceYear() {
        if (this.activeEvent) {
            alert("Debes resolver la decisión pendiente antes de avanzar de año.");
            this.playBeep("fail");
            return;
        }

        // Incrementar edad
        this.player.age += 1;
        this.updateLifeStage();
        this.pushLog(`🌟 Cumples ${this.player.age} años.`);

        // Salud crítica / Muerte natural
        if (this.player.health <= 0) {
            this.triggerEnding();
            return;
        }
        if (this.player.age >= 95) {
            this.pushLog("👴 Tu cuerpo ya no resiste más. Falleces de vejez pacíficamente rodeado de tus seres queridos.");
            this.triggerEnding();
            return;
        }
        // Probabilidad de muerte aleatoria por mala salud
        if (this.player.health < 25 && Math.random() < 0.15) {
            this.pushLog("💀 Sufres un paro cardíaco por complicaciones de salud. No lograste sobrevivir.");
            this.player.health = 0;
            this.triggerEnding();
            return;
        }

        // Ingresos y egresos anuales
        this.applyAnnualFinance();

        // Envejecimiento de relaciones y mascotas
        if (this.player.partner) {
            this.player.partner.relationValue = Math.max(0, this.player.partner.relationValue - 5);
            if (this.player.partner.relationValue <= 10) {
                this.pushLog(`💔 ${this.player.partner.name} se cansó de tu indiferencia y te dejó.`);
                this.player.partner = null;
            }
        }
        
        // Decaimiento natural de estadísticas con la edad
        if (this.player.age > 45) {
            this.player.health = Math.max(10, this.player.health - 2);
        }
        if (this.player.stress > 80) {
            this.player.health = Math.max(5, this.player.health - 8);
            this.pushLog("⚠️ Estás sumamente estresado. Tu salud se está deteriorando rápidamente.");
        }

        // Disparar Eventos
        this.triggerYearlyEvents();
        
        // Auto-guardado
        this.saveGameProgress();
    }

    applyAnnualFinance() {
        // Sueldos por empleo activo
        let income = 0;
        let jobStress = 0;
        
        const jobsEarnings = {
            "Practicante de Oficina": 1025,
            "Practicante por Mérito": 1200,
            "Emprendedor de Helados": 1300,
            "Trabajador Informal": 1100,
            "Dueño de Negocio": 8000,
            "Programador Senior": 12000,
            "Supervisor / Jefe": 4000,
            "Especialista Senior": 6000,
            "Taxista": 2500,
            "Curandero / Místico": 3500,
            "Dueño de Bodega": 3000,
            "Emolientero Magnate": 15000 // Secreto
        };

        const jobsStress = {
            "Practicante de Oficina": 10,
            "Practicante por Mérito": 15,
            "Emprendedor de Helados": 20,
            "Trabajador Informal": 25,
            "Dueño de Negocio": 40,
            "Programador Senior": 20,
            "Supervisor / Jefe": 35,
            "Especialista Senior": 25,
            "Taxista": 30,
            "Curandero / Místico": 10,
            "Dueño de Bodega": 20,
            "Emolientero Magnate": 15
        };

        if (jobsEarnings[this.player.job]) {
            income = jobsEarnings[this.player.job] * 12; // Anualizado
            jobStress = jobsStress[this.player.job];
            this.player.money += income;
            this.player.stress = Math.min(100, this.player.stress + jobStress - Math.floor(this.player.luck / 10));
            this.pushLog(`💰 Cobras tu sueldo anual de ${this.player.job}: +S/. ${this.formatMoney(income)}.`);
        }

        // Impuestos / Gastos de propiedades o deudas
        if (this.player.money < 0) {
            // Intereses por deuda
            const interest = Math.floor(Math.abs(this.player.money) * 0.15);
            this.player.money -= interest;
            this.pushLog(`📈 Pagas intereses del 15% por tu sobregiro: -S/. ${this.formatMoney(interest)}.`);
            
            if (Math.abs(this.player.money) >= 50000) {
                this.unlockAchievement("endeudado_profesional");
            }
        }
    }

    triggerEventById(eventId) {
        const evt = window.GAME_EVENTS.find(e => e.id === eventId);
        if (evt) {
            this.displayEventCard(evt);
        } else {
            console.warn("triggerEventById: evento no encontrado ->", eventId);
            this.updateGameplayUI();
        }
    }

    triggerYearlyEvents() {
        const age = this.player.age;
        
        // Probabilidades de disparar evento de decisión vs evento rápido
        let decisionChance = this.chaosMode ? 0.65 : 0.35;
        let quickChance = this.chaosMode ? 0.30 : 0.45;
        
        const rand = Math.random();
        
        if (rand < decisionChance) {
            // Filtrar eventos por edad
            const eligibleEvents = window.GAME_EVENTS.filter(evt => {
                const min = evt.minAge !== undefined ? evt.minAge : 0;
                const max = evt.maxAge !== undefined ? evt.maxAge : 100;
                return age >= min && age <= max;
            });
            
            if (eligibleEvents.length > 0) {
                const randomEvt = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
                this.displayEventCard(randomEvt);
                return;
            }
        } 
        
        if (rand < decisionChance + quickChance) {
            // Disparar evento rápido filtrado estrictamente por la edad actual
            const eligibleQuick = window.GAME_QUICK_EVENTS.filter(evt => {
                const min = evt.minAge !== undefined ? evt.minAge : 0;
                const max = evt.maxAge !== undefined ? evt.maxAge : 100;
                return age >= min && age <= max;
            });
            
            if (eligibleQuick.length > 0) {
                const quickEvt = eligibleQuick[Math.floor(Math.random() * eligibleQuick.length)];
                this.displayQuickEvent(quickEvt);
                return;
            }
        }

        // Año tranquilo
        this.pushLog("☁️ El año transcurre con normalidad. Ninguna novedad importante en el vecindario.");
        this.updateGameplayUI();
    }

    displayEventCard(evt) {
        this.activeEvent = evt;
        if (this.player) {
            this.player.activeEventId = evt.id || null;
        }
        
        const panel = document.getElementById("event-panel");
        const titleEl = document.getElementById("event-title");
        const descEl = document.getElementById("event-description");
        const emojiEl = document.getElementById("event-large-emoji");
        const optionsContainer = document.getElementById("event-options");
        
        emojiEl.innerText = evt.emoji || "❓";
        titleEl.innerText = evt.title;
        descEl.innerText = evt.description;
        
        optionsContainer.innerHTML = "";
        
        evt.options.forEach((opt, index) => {
            const btn = document.createElement("button");
            btn.className = "btn-option";
            btn.innerText = opt.text;
            btn.addEventListener("click", () => {
                this.resolveEventOption(index);
            });
            optionsContainer.appendChild(btn);
        });

        // Hacer scroll automático al panel de evento
        panel.scrollIntoView({ behavior: 'smooth' });
    }

    displayQuickEvent(evt) {
        // Hacemos que actúe temporalmente como un evento interactivo de un solo botón
        this.activeEvent = {
            title: evt.title,
            description: evt.description,
            emoji: evt.emoji,
            options: [
                {
                    text: "Entendido",
                    resolve: (p) => {
                        evt.resolve(p);
                        return "Decisión registrada.";
                    }
                }
            ]
        };
        
        const panel = document.getElementById("event-panel");
        const titleEl = document.getElementById("event-title");
        const descEl = document.getElementById("event-description");
        const emojiEl = document.getElementById("event-large-emoji");
        const optionsContainer = document.getElementById("event-options");
        
        emojiEl.innerText = evt.emoji || "⚡";
        titleEl.innerText = evt.title;
        descEl.innerText = evt.description;
        
        optionsContainer.innerHTML = "";
        const btn = document.createElement("button");
        btn.className = "btn-option";
        btn.innerText = "Continuar";
        btn.addEventListener("click", () => {
            this.resolveEventOption(0);
        });
        optionsContainer.appendChild(btn);
    }

    resolveEventOption(optionIndex) {
        if (!this.activeEvent) return;
        
        this.playBeep("success");
        
        const option = this.activeEvent.options[optionIndex];
        const resolveMsg = option.resolve(this.player);
        
        this.pushLog(`👉 Elegiste: "${option.text}"`);
        this.pushLog(`📣 Resultado: ${resolveMsg}`);
        
        // Resetear evento activo
        this.activeEvent = null;
        if (this.player) {
            this.player.activeEventId = null;
        }

        // Actualizar estadísticas de UI inmediatamente
        this.updateGameplayUI();

        // Mostrar resumen de resolución con botón activo para avanzar
        const panel = document.getElementById("event-panel");
        const titleEl = document.getElementById("event-title");
        const descEl = document.getElementById("event-description");
        const emojiEl = document.getElementById("event-large-emoji");
        const optionsContainer = document.getElementById("event-options");
        
        emojiEl.innerText = "✅";
        titleEl.innerText = "Decisión Registrada";
        descEl.innerText = resolveMsg;
        
        optionsContainer.innerHTML = "";
        const btn = document.createElement("button");
        btn.className = "btn btn-primary btn-large";
        btn.innerText = "⏳ Avanzar al Siguiente Año";
        btn.addEventListener("click", () => {
            this.playBeep("click");
            this.advanceYear();
        });
        optionsContainer.appendChild(btn);

        panel.scrollIntoView({ behavior: 'smooth' });
    }

    triggerEventById(eventId) {
        const found = window.GAME_EVENTS.find(e => e.id === eventId);
        if (found) {
            this.displayEventCard(found);
        }
    }

    // --- LOGROS SISTEMA ---
    unlockAchievement(id) {
        const ach = window.GAME_ACHIEVEMENTS.find(a => a.id === id);
        if (ach && !ach.unlocked) {
            ach.unlocked = true;
            this.playBeep("achievement");
            
            // Push visual notification
            this.pushLog(`🏆 <strong>¡Logro Desbloqueado!</strong> [${ach.title}] - ${ach.desc}`);
            this.saveSystemData();
            this.updateMainMenuUI();
        }
    }

    // --- INTERFAZ MENÚ PRINCIPAL ---
    updateMainMenuUI() {
        const badge = document.getElementById("unlocked-count-badge");
        const totalCount = window.GAME_ACHIEVEMENTS.length;
        const unlockedCount = window.GAME_ACHIEVEMENTS.filter(a => a.unlocked).length;
        if (badge) {
            badge.innerText = `(${unlockedCount}/${totalCount})`;
        }
    }

    // --- MODALES GESTORES ---
    openAchievementsModal() {
        const grid = document.getElementById("achievements-grid");
        grid.innerHTML = "";
        
        document.getElementById("total-achievements-count").innerText = window.GAME_ACHIEVEMENTS.length;

        window.GAME_ACHIEVEMENTS.forEach(ach => {
            const row = document.createElement("div");
            row.className = `achievement-row ${ach.unlocked ? 'unlocked' : ''}`;
            
            row.innerHTML = `
                <span class="ach-icon">${ach.emoji}</span>
                <div class="ach-details">
                    <h5>${ach.unlocked ? ach.title : '???' }</h5>
                    <p>${ach.unlocked ? ach.desc : 'Mantén este logro oculto hasta completarlo.'}</p>
                </div>
                <span class="ach-meta">${ach.rarity}</span>
            `;
            grid.appendChild(row);
        });

        document.getElementById("modal-achievements").classList.add("active");
    }

    openStatsHistoryModal() {
        document.getElementById("record-total-lives").innerText = this.history.totalLives || 0;
        document.getElementById("record-max-age").innerText = (this.history.maxAge || 0) + " años";
        document.getElementById("record-max-money").innerText = "S/. " + this.formatMoney(this.history.maxMoney || 0);

        const list = document.getElementById("history-list");
        list.innerHTML = "";

        if (this.history.livesHistory && this.history.livesHistory.length > 0) {
            // Invertir lista para mostrar las más recientes primero
            const reversed = [...this.history.livesHistory].reverse();
            reversed.forEach(run => {
                const item = document.createElement("div");
                item.className = "history-item";
                item.innerHTML = `
                    <div class="left-info">
                        <h6>${run.name} (${run.age} años)</h6>
                        <p>${run.endingTitle} • ${run.stage}</p>
                    </div>
                    <span class="right-fortune">S/. ${this.formatMoney(run.fortune)}</span>
                `;
                list.appendChild(item);
            });
        } else {
            list.innerHTML = '<p class="empty-msg">Aún no tienes vidas registradas en este navegador.</p>';
        }

        document.getElementById("modal-stats-history").classList.add("active");
    }

    openActivitiesModal() {
        const list = document.getElementById("activities-list");
        list.innerHTML = "";

        // Actividades que cambian según rango de edad
        const age = this.player.age;
        let activities = [];

        if (age < 12) {
            activities = [
                {
                    title: "Jugar pichanga en la calle ⚽",
                    effect: "Ganas felicidad y contactos, pero arriesgas raspaduras.",
                    costText: "S/. 0",
                    action: () => {
                        this.player.happiness = Math.min(100, this.player.happiness + 15);
                        this.player.contacts = Math.min(100, this.player.contacts + 5);
                        if (Math.random() < 0.3) {
                            this.player.health = Math.max(5, this.player.health - 8);
                            return "Te caíste sobre el asfalto raspándote las rodillas. Felicidad +15, Salud -8.";
                        }
                        return "Hiciste un golazo de rabona. Todos tus amigos te aplauden. Felicidad +15.";
                    }
                },
                {
                    title: "Estudiar la tabla de multiplicar 📚",
                    effect: "Ganas educación y estresas un poco a tu mente.",
                    costText: "S/. 0",
                    action: () => {
                        this.player.education = Math.min(100, this.player.education + 10);
                        this.player.stress = Math.min(100, this.player.stress + 5);
                        return "Te memorizaste la tabla del 9. Tu profesor te felicitó con una estrella en la frente.";
                    }
                }
            ];
        } else if (age < 18) {
            activities = [
                {
                    title: "Jugar videojuegos en cabinas de internet 🎮",
                    effect: "Ganas felicidad. Cuesta poco dinero.",
                    costText: "S/. 5",
                    action: () => {
                        if (this.player.money < 5) return "No tienes suficiente dinero.";
                        this.player.money -= 5;
                        this.player.happiness = Math.min(100, this.player.happiness + 20);
                        this.player.education = Math.max(0, this.player.education - 2);
                        return "Jugaste 3 horas de Dota con los chicos de la cabina. Felicidad +20, S/. 5 gastados.";
                    }
                },
                {
                    title: "Ayudar en el negocio familiar (Pyme) 📦",
                    effect: "Ganas contactos y contactos de negocios, trabajas duro.",
                    costText: "S/. 0",
                    action: () => {
                        this.player.contacts = Math.min(100, this.player.contacts + 10);
                        this.player.stress = Math.min(100, this.player.stress + 10);
                        this.player.money += 20; // Propinita
                        return "Cargaste cajas de mercadería en Gamarra. Tu tío te regaló S/. 20. Contactos +10.";
                    }
                }
            ];
        } else {
            // Adulto y mayor
            activities = [
                {
                    title: "Trabajar de Taxista por horas 🚕",
                    effect: "Ganas dinero pero incrementa el estrés limeño.",
                    costText: "S/. 0 (Ingreso: S/. 200)",
                    action: () => {
                        this.player.money += 200;
                        this.player.stress = Math.min(100, this.player.stress + 15);
                        this.player.job = "Taxista";
                        return "Hiciste taxi de noche de Javier Prado a Chorrillos. Ganaste S/. 200 pero el tráfico te estresó. Estrés +15.";
                    }
                },
                {
                    title: "Ir a Pollería Familiar 🍗",
                    effect: "Eleva felicidad y te sana la fatiga alimenticia.",
                    costText: "S/. 80",
                    action: () => {
                        if (this.player.money < 80) return "No tienes suficiente dinero para invitar.";
                        this.player.money -= 80;
                        this.player.happiness = Math.min(100, this.player.happiness + 20);
                        this.player.health = Math.max(5, this.player.health - 2); // grasa
                        this.unlockAchievement("casero_vip");
                        return "Comiste un cuarto de pollo con papas y bastante ají. Felicidad +20, Logro Desbloqueado: Casero VIP.";
                    }
                },
                {
                    title: "Limpia espiritual con Curandero/Chamán 🔮",
                    effect: "Reduce estrés y te brinda suerte y salud.",
                    costText: "S/. 50",
                    action: () => {
                        if (this.player.money < 50) return "No te alcanza para el ritual.";
                        this.player.money -= 50;
                        this.player.stress = Math.max(0, this.player.stress - 20);
                        this.player.luck = Math.min(100, this.player.luck + 15);
                        this.player.health = Math.min(100, this.player.health + 10);
                        this.unlockAchievement("chaman_vip");
                        return "Te azotaron ruda y escupieron pisco en la espalda. Te sientes renovado y con suerte. Salud +10, Estrés -20.";
                    }
                },
                {
                    title: "Protestar frente a la SUNAT ⚖️",
                    effect: "Ganas contactos urbanos pero arriesgas una multa.",
                    costText: "S/. 0",
                    action: () => {
                        this.player.stress = Math.min(100, this.player.stress + 10);
                        this.player.contacts = Math.min(100, this.player.contacts + 10);
                        if (Math.random() < 0.25) {
                            this.player.money = Math.max(-50000, this.player.money - 200);
                            return "Fuiste gaseado por la policía y te pusieron una multa por disturbios de S/. 200. Estrés +10, Dinero -200.";
                        }
                        return "Gritaste consignas en megáfono y conociste a otros emprendedores enojados. Contactos +10.";
                    }
                },
                {
                    title: "Estudiar un Curso Online de Sistemas 💻",
                    effect: "Incrementa educación a cambio de inversión.",
                    costText: "S/. 150",
                    action: () => {
                        if (this.player.money < 150) return "No tienes suficiente dinero.";
                        this.player.money -= 150;
                        this.player.education = Math.min(100, this.player.education + 12);
                        this.player.stress = Math.min(100, this.player.stress + 5);
                        
                        // Si educación es alta, se vuelve programador senior
                        if (this.player.education >= 80 && this.player.job !== "Programador Senior") {
                            this.player.job = "Programador Senior";
                            this.unlockAchievement("programador_sr");
                            this.pushLog("💻 ¡Enhorabuena! Te contrataron como Programador Senior Remoto en dólares.");
                        }
                        return "Estudiaste HTML, CSS y JS de madrugada. Educación +12, S/. 150 invertidos.";
                    }
                }
            ];
        }

        // Rellenar lista de actividades en modal
        activities.forEach(act => {
            const card = document.createElement("div");
            card.className = "activity-card";
            card.innerHTML = `
                <div class="act-info">
                    <span class="act-title">${act.title}</span>
                    <span class="act-effect">${act.effect}</span>
                </div>
                <div class="act-cost">${act.costText}</div>
                <button class="act-btn">Hacer</button>
            `;
            
            card.querySelector(".act-btn").addEventListener("click", () => {
                const res = act.action();
                this.pushLog(`💼 Actividad: ${res}`);
                this.playBeep("success");
                this.updateGameplayUI();
                document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
            });

            list.appendChild(card);
        });

        // Rellenar lista de COMPRAS (Tienda)
        const purchasesList = document.getElementById("purchases-list");
        purchasesList.innerHTML = "";

        const shopItems = [
            {
                name: "iPhone Bamba",
                cost: 500,
                desc: "Traído de Polvos Azules. Pantalla un poco opaca pero el logo de manzana se ve bien.",
                effect: "Popularidad +10, Contactos +5",
                action: () => {
                    this.player.contacts = Math.min(100, this.player.contacts + 5);
                    this.player.happiness = Math.min(100, this.player.happiness + 10);
                }
            },
            {
                name: "PC Gamer de Wilson",
                cost: 2500,
                desc: "Procesador Ryzen potente con luces RGB. Perfecta para jugar y aprender a programar.",
                effect: "Felicidad +25, Educación +5",
                action: () => {
                    this.player.happiness = Math.min(100, this.player.happiness + 25);
                    this.player.education = Math.min(100, this.player.education + 5);
                }
            },
            {
                name: "Terreno en Carabayllo",
                cost: 15000,
                desc: "En cerro, no tiene luz ni agua aún pero el plano promete un mirador hermoso.",
                effect: "Adquieres una propiedad inmueble. Desbloquea Logro.",
                action: () => {
                    this.unlockAchievement("casa_propia");
                    if (this.player.age < 35) this.unlockAchievement("casa_joven");
                }
            },
            {
                name: "Departamento en Miraflores",
                cost: 85000,
                desc: "Vista interna, de 40m². Excelente para estatus social alto y mudarse de casa.",
                effect: "Felicidad +30, Contactos +25.",
                action: () => {
                    this.player.happiness = Math.min(100, this.player.happiness + 30);
                    this.player.contacts = Math.min(100, this.player.contacts + 25);
                    this.unlockAchievement("casa_propia");
                    if (this.player.age < 35) this.unlockAchievement("casa_joven");
                }
            },
            {
                name: "Residencia en el Extranjero",
                cost: 30000,
                desc: "Pasaporte, visa y pasajes listos para vivir legalmente en España o Japón.",
                effect: "Desbloquea finales de emigración en el extranjero.",
                action: () => {
                    this.pushLog("✈️ Has tramitado tu visa de residencia en el extranjero. Te espera una nueva vida afuera.");
                }
            }
        ];

        shopItems.forEach(item => {
            // Revisar si ya lo compró (evitar duplicados de bienes únicos)
            const alreadyBought = this.player.assets.includes(item.name);
            
            const card = document.createElement("div");
            card.className = "purchase-card";
            card.innerHTML = `
                <div class="pur-info">
                    <span class="pur-title">${item.name} ${alreadyBought ? '(Adquirido)' : ''}</span>
                    <span class="pur-effect">${item.desc} | <strong style="color:var(--accent)">Efecto: ${item.effect}</strong></span>
                </div>
                <div class="pur-cost">S/. ${this.formatMoney(item.cost)}</div>
                <button class="pur-btn" ${alreadyBought ? 'disabled' : ''}>Comprar</button>
            `;

            card.querySelector(".pur-btn").addEventListener("click", () => {
                if (this.player.money < item.cost) {
                    alert("No tienes suficiente saldo.");
                    this.playBeep("fail");
                    return;
                }
                this.player.money -= item.cost;
                this.player.assets.push(item.name);
                item.action();
                
                this.pushLog(`🛒 Compraste: ${item.name} por S/. ${this.formatMoney(item.cost)}.`);
                this.playBeep("success");
                this.updateGameplayUI();
                document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
            });

            purchasesList.appendChild(card);
        });

        document.getElementById("modal-activities").classList.add("active");
    }

    openRelationshipsModal() {
        const list = document.getElementById("relationships-list");
        list.innerHTML = "";

        if (this.player.partner) {
            const rel = this.player.partner;
            const card = document.createElement("div");
            card.className = "relationship-card";
            card.innerHTML = `
                <div class="rel-left">
                    <span class="rel-emoji">${this.player.gender === 'm' ? '👩' : '👨'}</span>
                    <div class="rel-details">
                        <span class="rel-name">${rel.name}</span>
                        <span class="rel-relation-type">${rel.married ? 'Esposo(a) 💍' : 'Enamorado(a) 💖'}</span>
                        <div class="rel-bar-container"><div class="rel-bar-fill" style="width: ${rel.relationValue}%;"></div></div>
                    </div>
                </div>
                <div class="rel-actions-group">
                    <button class="rel-act-btn btn-salchipapa">Invitar Salchipapa (S/. 25)</button>
                    <button class="rel-act-btn btn-marry" ${rel.married ? 'disabled' : ''}>Casarse (S/. 1000)</button>
                </div>
            `;
            
            card.querySelector(".btn-salchipapa").addEventListener("click", () => {
                if (this.player.money < 25) {
                    alert("No tienes dinero para la salchipapa.");
                    return;
                }
                this.player.money -= 25;
                rel.relationValue = Math.min(100, rel.relationValue + 20);
                this.player.happiness = Math.min(100, this.player.happiness + 10);
                this.pushLog(`❤️ Invitaste a ${rel.name} una salchipapa bien servida con todas las cremas.`);
                this.updateGameplayUI();
                document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
            });

            card.querySelector(".btn-marry").addEventListener("click", () => {
                if (this.player.money < 1000) {
                    alert("Una boda decente cuesta al menos S/. 1,000.");
                    return;
                }
                this.player.money -= 1000;
                rel.married = true;
                rel.relationValue = Math.min(100, rel.relationValue + 30);
                this.player.happiness = Math.min(100, this.player.happiness + 20);
                
                // Posibilidad de tener un hijo al casarse
                this.player.partner = rel;
                this.player.pets.push("Firulais"); // Regalo de bodas
                this.unlockAchievement("primer_hijo");
                this.pushLog(`💍 ¡Te casaste con ${rel.name}! La fiesta en el local comunal tuvo orquesta y arroz chaufa.`);
                this.updateGameplayUI();
                document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
            });

            list.appendChild(card);
        } else {
            list.innerHTML = '<p class="empty-msg">Actualmente estás soltero. No tienes pareja.</p>';
        }

        // Mascotas en relaciones
        this.player.pets.forEach((pet, index) => {
            const card = document.createElement("div");
            card.className = "relationship-card";
            card.innerHTML = `
                <div class="rel-left">
                    <span class="rel-emoji">🐕</span>
                    <div class="rel-details">
                        <span class="rel-name">${pet}</span>
                        <span class="rel-relation-type">Mascota Leal</span>
                    </div>
                </div>
                <div class="rel-actions-group">
                    <button class="rel-act-btn btn-feed">Pasear & Dar Chocman (S/. 5)</button>
                </div>
            `;
            card.querySelector(".btn-feed").addEventListener("click", () => {
                if (this.player.money < 5) return;
                this.player.money -= 5;
                this.player.happiness = Math.min(100, this.player.happiness + 10);
                this.pushLog(`🐕 Paseaste a ${pet} por el parque de tu barrio y le compartiste un pedazo de queque.`);
                this.updateGameplayUI();
                document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
            });
            list.appendChild(card);
        });

        document.getElementById("modal-relationships").classList.add("active");
    }

    socialSearchPartner() {
        if (this.player.age < 14) {
            alert("¡Aún eres muy joven! Debes tener al menos 14 años para salir a citas o buscar pareja.");
            return;
        }
        if (this.player.partner) {
            alert("Ya tienes una relación activa.");
            return;
        }
        if (this.player.money < 100) {
            alert("Necesitas dinero para salir a citas (S/. 100).");
            return;
        }
        this.player.money -= 100;
        
        // Probabilidad de éxito basada en suerte
        const chance = (this.player.luck + 30) / 130;
        if (Math.random() < chance) {
            const listNames = this.player.gender === "f" ? RANDOM_FIRST_NAMES_M : RANDOM_FIRST_NAMES_F;
            const partnerName = listNames[Math.floor(Math.random() * listNames.length)] + " " + RANDOM_LAST_NAMES[Math.floor(Math.random() * RANDOM_LAST_NAMES.length)];
            
            this.player.partner = {
                name: partnerName,
                relationValue: 50,
                married: false
            };
            this.pushLog(`💖 ¡Encontraste el amor! Empezaste a salir con ${partnerName}. Felicidad +20.`);
            this.player.happiness = Math.min(100, this.player.happiness + 20);
        } else {
            this.pushLog("💔 Saliste a discotecas y bares pero te dejaron en visto ('te mandaron a la zona de amigos'). Gastaste S/. 100.");
            this.player.happiness = Math.max(0, this.player.happiness - 10);
        }
        
        this.updateGameplayUI();
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
    }

    socialAdoptPet() {
        if (this.player.age < 5) {
            alert("¡Eres un bebé! Necesitas tener al menos 5 años para cuidar una mascota.");
            return;
        }
        const petNames = ["Firulais", "Chucky", "Bobby", "Toby", "Rambo", "Pelusa", "Negrito"];
        const name = petNames[Math.floor(Math.random() * petNames.length)];
        
        this.player.pets.push(name);
        this.player.happiness = Math.min(100, this.player.happiness + 15);
        this.player.karmaValue += 5; // Karma positivo por adoptar
        
        this.pushLog(`🐕 Adoptaste a un perrito callejero en tu barrio y lo bautizaste como ${name}. Ganas felicidad.`);
        this.updateGameplayUI();
        document.querySelectorAll(".modal-overlay").forEach(m => m.classList.remove("active"));
    }

    // --- MINIJUEGOS CONTROLADORES ---
    openMinigamesModal() {
        this.exitMinigameView();
        document.getElementById("modal-minigames").classList.add("active");
    }

    startMinigame(gameId) {
        this.activeMinigame = gameId;
        
        // Hide selector and show game area
        document.getElementById("minigames-selector-view").classList.add("hide");
        
        const area = document.getElementById("minigame-play-area");
        area.classList.remove("hide");
        
        // Hide all sub panels
        area.querySelectorAll(".minigame-sub-panel").forEach(p => p.classList.add("hide"));
        
        // Show selected game panel
        document.getElementById(`minigame-${gameId}`).classList.remove("hide");
        
        // Initialize game specific logic
        if (gameId === "penalties") {
            this.initPenalties();
        } else if (gameId === "memory") {
            this.initMemory();
        } else if (gameId === "roulette") {
            this.initRoulette();
        }
    }

    exitMinigameView() {
        this.activeMinigame = null;
        if (this.memoryTimer) clearInterval(this.memoryTimer);
        
        document.getElementById("minigames-selector-view").classList.remove("hide");
        document.getElementById("minigame-play-area").classList.add("hide");
    }

    // Minijuego 1: Penales
    initPenalties() {
        this.penaltyStreak = 0;
        document.getElementById("penalty-result").innerText = "Chuta tu primer penal para empezar la tanda.";
        document.getElementById("penalty-result").style.color = "#ffffff";
    }

    shootPenalty(direction) {
        const directions = ["izq-sup", "centro-sup", "der-sup", "izq-inf", "centro-inf", "der-inf"];
        
        // El arquero ataja una de las 6 esquinas al azar
        const keeperDir = directions[Math.floor(Math.random() * directions.length)];
        
        const resultEl = document.getElementById("penalty-result");
        
        if (direction === keeperDir) {
            // Atajó
            this.playBeep("fail");
            this.penaltyStreak = 0;
            resultEl.innerText = `❌ ¡El arquero atajó a la ${keeperDir}! Fallaste. Racha reiniciada.`;
            resultEl.style.color = "var(--text-danger)";
            
            this.player.stress = Math.min(100, this.player.stress + 10);
            this.player.happiness = Math.max(0, this.player.happiness - 5);
        } else {
            // Gol
            this.playBeep("success");
            this.penaltyStreak += 1;
            resultEl.innerText = `⚽ ¡GOOOOOOL! La clavaste donde el portero no llegaba. ¡Racha: ${this.penaltyStreak}!`;
            resultEl.style.color = "var(--text-success)";
            
            this.player.money += 300;
            this.player.happiness = Math.min(100, this.player.happiness + 10);
            this.player.stress = Math.max(0, this.player.stress - 5);
            
            this.pushLog(`⚽ Anotaste un golazo de penal. ¡Ganaste S/. 300!`);
            
            if (this.penaltyStreak >= 3) {
                this.unlockAchievement("pichanguero_historico");
            }
        }
        
        this.updateGameplayUI();
    }

    // Minijuego 2: Memoria
    initMemory() {
        const emojis = ["🚌", "🧔", "👩", "🦙", "💰", "📦", "👮", "🍗"];
        const deck = [...emojis, ...emojis];
        
        // Barajar deck
        deck.sort(() => Math.random() - 0.5);
        
        this.memoryCards = deck;
        this.memoryFlipped = [];
        this.memoryMatches = 0;
        this.memoryTimeLeft = 20;
        
        const grid = document.getElementById("memory-grid");
        grid.innerHTML = "";
        
        deck.forEach((emoji, index) => {
            const card = document.createElement("div");
            card.className = "memory-card";
            card.setAttribute("data-index", index);
            card.innerHTML = "?";
            card.addEventListener("click", () => {
                this.flipMemoryCard(card);
            });
            grid.appendChild(card);
        });

        document.getElementById("memory-result").innerText = "Encuentra las parejas de pasajeros.";
        document.getElementById("memory-result").style.color = "#ffffff";
        document.getElementById("memory-timer").innerText = "20s";

        // Iniciar temporizador
        if (this.memoryTimer) clearInterval(this.memoryTimer);
        this.memoryTimer = setInterval(() => {
            this.memoryTimeLeft -= 1;
            document.getElementById("memory-timer").innerText = `${this.memoryTimeLeft}s`;
            
            if (this.memoryTimeLeft <= 0) {
                clearInterval(this.memoryTimer);
                this.endMemoryGame(false);
            }
        }, 1000);
    }

    flipMemoryCard(card) {
        const index = parseInt(card.getAttribute("data-index"));
        
        // Bloquear clics si ya está flipped o matched, o ya hay 2 cartas volteadas
        if (card.classList.contains("flipped") || card.classList.contains("matched") || this.memoryFlipped.length >= 2) {
            return;
        }

        this.playBeep("click");
        card.classList.add("flipped");
        card.innerHTML = this.memoryCards[index];
        this.memoryFlipped.push({ card, index });

        if (this.memoryFlipped.length === 2) {
            setTimeout(() => {
                this.checkMemoryMatch();
            }, 600);
        }
    }

    checkMemoryMatch() {
        const first = this.memoryFlipped[0];
        const second = this.memoryFlipped[1];

        if (this.memoryCards[first.index] === this.memoryCards[second.index]) {
            // Coinciden
            first.card.classList.add("matched");
            second.card.classList.add("matched");
            this.memoryMatches += 1;
            this.playBeep("success");

            if (this.memoryMatches === 8) {
                clearInterval(this.memoryTimer);
                this.endMemoryGame(true);
            }
        } else {
            // No coinciden
            first.card.classList.remove("flipped");
            first.card.innerHTML = "?";
            second.card.classList.remove("flipped");
            second.card.innerHTML = "?";
            this.playBeep("fail");
        }

        this.memoryFlipped = [];
    }

    endMemoryGame(win) {
        const resultEl = document.getElementById("memory-result");
        if (win) {
            resultEl.innerText = "🏆 ¡Ganaste! Encontraste todos los pasajeros antes del colapso del bus.";
            resultEl.style.color = "var(--text-success)";
            
            this.player.education = Math.min(100, this.player.education + 10);
            this.player.happiness = Math.min(100, this.player.happiness + 15);
            this.pushLog("🚌 Ganaste en el minijuego de Memoria. Educación +10, Felicidad +15.");
        } else {
            resultEl.innerText = "💥 ¡Perdiste! El Metropolitano chocó o se llenó de mercadería informal.";
            resultEl.style.color = "var(--text-danger)";
            
            this.player.stress = Math.min(100, this.player.stress + 15);
            this.pushLog("🚌 Perdiste en el minijuego de Memoria. Estrés +15.");
        }
        this.updateGameplayUI();
    }

    // Minijuego 3: Ruleta del Jirón
    initRoulette() {
        document.getElementById("roulette-result").innerText = "Elige una opción de apuesta.";
        document.getElementById("roulette-result").style.color = "#ffffff";
        document.getElementById("roulette-wheel-visual").style.transform = "rotate(0deg)";
    }

    spinRoulette(betOption) {
        if (this.player.money < 100) {
            alert("No tienes S/. 100 para apostar.");
            return;
        }
        this.player.money -= 100;
        this.updateGameplayUI();

        const resultEl = document.getElementById("roulette-result");
        resultEl.innerText = "🎡 Girando la ruleta callejera...";
        resultEl.style.color = "#ffffff";

        const wheel = document.getElementById("roulette-wheel-visual");
        wheel.classList.add("spinning");
        this.playBeep("click");

        setTimeout(() => {
            wheel.classList.remove("spinning");
            
            const rand = Math.random();
            let finalColor = "black";
            let angle = 180;

            if (rand < 0.425) {
                finalColor = "red";
                angle = 360; // Gira al rojo
            } else if (rand < 0.85) {
                finalColor = "black";
                angle = 180; // Gira al negro
            } else {
                finalColor = "gold";
                angle = 90; // Gira al dorado (15% prob)
            }

            wheel.style.transform = `rotate(${angle + 1440}deg)`; // Añade 4 vueltas completas

            if (betOption === finalColor) {
                this.playBeep("success");
                let reward = 0;
                if (finalColor === "gold") {
                    reward = 500;
                    this.unlockAchievement("casino_master");
                    resultEl.innerText = `🟡 ¡FANTÁSTICO! Cayó Dorado. Multiplicaste tu apuesta x5. Ganas S/. 500.`;
                } else {
                    reward = 200;
                    resultEl.innerText = `🎉 ¡Ganaste! Cayó ${finalColor === 'red' ? 'Rojo' : 'Negro'}. Ganas S/. 200.`;
                }
                this.player.money += reward;
                this.player.happiness = Math.min(100, this.player.happiness + 15);
                this.pushLog(`🎰 Ganaste S/. ${reward} en la ruleta del Jirón.`);
            } else {
                this.playBeep("fail");
                resultEl.innerText = `❌ Perdiste. Cayó color ${finalColor === 'red' ? '🔴 Rojo' : (finalColor === 'gold' ? '🟡 Dorado' : '⚫ Negro')}. Perdiste S/. 100.`;
                this.player.stress = Math.min(100, this.player.stress + 10);
                this.player.happiness = Math.max(0, this.player.happiness - 10);
                this.pushLog(`🎰 Perdiste S/. 100 en la ruleta del Jirón.`);
            }

            this.updateGameplayUI();
        }, 1500);
    }

    // --- FINALES Y LOGROS PANTALLA ---
    triggerEnding() {
        this.playBeep("fail");
        
        // Evaluar final correspondiente
        const ending = window.determineEnding(this.player);
        
        // Guardar en historial local
        this.history.totalLives += 1;
        this.history.maxAge = Math.max(this.history.maxAge || 0, this.player.age);
        this.history.maxMoney = Math.max(this.history.maxMoney || 0, this.player.money);
        
        if (!this.history.unlockedEndings.includes(ending.id)) {
            this.history.unlockedEndings.push(ending.id);
        }
        
        this.history.livesHistory.push({
            name: this.player.name,
            age: this.player.age,
            endingTitle: ending.title,
            stage: this.getStageLabel(this.player.stage),
            fortune: this.player.money
        });

        // Registrar logros basados en el final
        if (ending.id === "leyenda_peruana") this.unlockAchievement("leyenda_peruana");
        if (ending.id === "rey_yape") this.unlockAchievement("rey_yape");
        if (ending.id === "emolientero_multimillonario") this.unlockAchievement("emolientero_millonario");
        
        this.saveSystemData();
        
        // Borrar guardado automático para que no puedan reanudar una partida muerta
        localStorage.removeItem("peru_simulator_current_run");

        // Rellenar pantalla de final UI
        document.getElementById("ending-emoji").innerText = ending.emoji;
        document.getElementById("ending-rank").innerText = ending.title;
        document.getElementById("ending-description").innerText = ending.desc;
        
        document.getElementById("ending-age-reached").innerText = `${this.player.age} años`;
        document.getElementById("ending-fortune").innerText = `S/. ${this.formatMoney(this.player.money)}`;
        
        let relText = "Soltero";
        if (this.player.partner) {
            relText = `${this.player.partner.married ? 'Casado(a)' : 'En pareja'} con ${this.player.partner.name}`;
        }
        if (this.player.pets.length > 0) {
            relText += ` y con mascota ${this.player.pets[0]}`;
        }
        document.getElementById("ending-relations").innerText = relText;
        
        document.getElementById("ending-job").innerText = this.player.job;
        document.getElementById("ending-karma-type").innerText = this.player.karma;

        // Cambiar pantalla
        this.switchScreen("screen-ending");
        
        // Dibujar el DNI Canvas
        setTimeout(() => {
            this.drawDNICanvas(ending);
        }, 100);
    }

    drawDNICanvas(ending) {
        const canvas = document.getElementById("dni-canvas");
        const ctx = canvas.getContext("2d");

        // Limpiar
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, 600, 360);

        // Fondo del DNI (Celeste cian y azul degradado)
        const gradient = ctx.createLinearGradient(0, 0, 600, 360);
        gradient.addColorStop(0, "#e8f0fe");
        gradient.addColorStop(1, "#c7dcfb");
        ctx.fillStyle = gradient;
        ctx.fillRect(10, 10, 580, 340);

        // Bordes redondeados del DNI
        ctx.strokeStyle = "#467ac7";
        ctx.lineWidth = 4;
        ctx.strokeRect(10, 10, 580, 340);

        // Cabecera
        ctx.fillStyle = "#2d528b";
        ctx.font = "bold 20px 'Space Grotesk', Arial";
        ctx.fillText("REPÚBLICA DEL PERÚ", 160, 45);
        
        ctx.fillStyle = "#d91a2a";
        ctx.font = "bold 13px 'Outfit', Arial";
        ctx.fillText("DOCUMENTO NACIONAL DE IDENTIDAD DE SUPERVIVIENTE", 160, 65);

        // Línea roja superior
        ctx.fillStyle = "#d91a2a";
        ctx.fillRect(160, 75, 410, 3);

        // Marco de Foto (Avatar)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(30, 95, 110, 140);
        ctx.strokeStyle = "#467ac7";
        ctx.lineWidth = 2;
        ctx.strokeRect(30, 95, 110, 140);

        // Dibujar Emoji en el Marco
        ctx.font = "70px Arial";
        ctx.textAlign = "center";
        const avatars = STAGE_AVATARS[this.player.gender] || STAGE_AVATARS.nb;
        const currentAvatar = avatars[this.player.stage] || "👶";
        ctx.fillText(currentAvatar, 85, 185);
        ctx.textAlign = "left"; // Reset

        // Huella Digital Mock
        ctx.fillStyle = "#467ac7";
        ctx.fillRect(30, 250, 45, 60);
        ctx.fillStyle = "#ffffff";
        ctx.font = "8px Arial";
        ctx.fillText("HUELLA", 35, 305);

        // Firma Mock
        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(90, 270);
        ctx.bezierCurveTo(100, 250, 120, 290, 130, 270);
        ctx.bezierCurveTo(140, 250, 150, 290, 155, 270);
        ctx.stroke();
        
        ctx.fillStyle = "#777777";
        ctx.font = "10px Arial";
        ctx.fillText("Firma del Ciudadano", 90, 305);

        // Información Textual
        ctx.fillStyle = "#333333";
        ctx.font = "bold 11px Arial";
        
        // Campos
        const startY = 105;
        const spacing = 32;

        const fields = [
            { label: "APELLIDOS / NOMBRES:", val: this.player.name.toUpperCase() },
            { label: "ESTADO FINAL:", val: ending.title },
            { label: "EDAD AL DEJAR EL PAÍS/FALLECIMIENTO:", val: `${this.player.age} AÑOS` },
            { label: "FORTUNA NETO ACUMULADA:", val: `S/. ${this.formatMoney(this.player.money)}` },
            { label: "PROFESIÓN U OFICIO:", val: this.player.job.toUpperCase() },
            { label: "CONDUCTA Y KARMA GENERAL:", val: this.player.karma.toUpperCase() }
        ];

        fields.forEach((f, idx) => {
            ctx.fillStyle = "#163c70";
            ctx.font = "bold 10px Arial";
            ctx.fillText(f.label, 160, startY + idx * spacing);
            
            ctx.fillStyle = "#000000";
            ctx.font = "13px Arial";
            ctx.fillText(f.val, 160, startY + idx * spacing + 15);
        });

        // Sello SUNAT o Marca de agua del juego
        ctx.save();
        ctx.translate(500, 280);
        ctx.rotate(-0.2);
        ctx.fillStyle = "rgba(0, 230, 118, 0.25)";
        ctx.strokeStyle = "rgba(0, 230, 118, 0.4)";
        ctx.lineWidth = 3;
        ctx.strokeRect(-50, -25, 100, 45);
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.fillText("SUNAT", 0, -5);
        ctx.font = "bold 9px Arial";
        ctx.fillText("EXENTO / OK", 0, 12);
        ctx.restore();
    }

    shareResultsAsText() {
        const ending = window.determineEnding(this.player);
        const text = `🇵🇪 Perú Simulator: Naciste, Ahora Sobrevive
🙋‍♂️ Nombre: ${this.player.name}
🏆 Final Desbloqueado: ${ending.title}
⏳ Edad alcanzada: ${this.player.age} años
💰 Fortuna Final: S/. ${this.formatMoney(this.player.money)}
💼 Trabajo: ${this.player.job}
😇 Karma: ${this.player.karma}
🔥 Modo Caótico: ${this.chaosMode ? 'Sí' : 'No'}
Juega tú también en: https://peru-simulator.net`;

        navigator.clipboard.writeText(text).then(() => {
            alert("¡Resumen de tu vida copiado en el portapapeles! Compártelo con tus amigos.");
        }).catch(err => {
            console.error("Error al copiar texto", err);
        });
    }

    downloadDNIImage() {
        const canvas = document.getElementById("dni-canvas");
        const url = canvas.toDataURL("image/png");
        
        const link = document.createElement("a");
        link.download = `DNI_Simulador_Peru_${this.player.name.replace(/\s+/g, '_')}.png`;
        link.href = url;
        link.click();
    }
}

// Inicializar el juego al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    window.gameEngine = new PeruSimulator();
    window.gameEngine.init();
});
