/* ==========================================
   PERÚ SIMULATOR - BASE DE DATOS DE EVENTOS (events.js)
   ========================================== */

window.GAME_EVENTS = [
    // ------------------------------------------
    // INFANCIA (Edades 0 a 5)
    // ------------------------------------------
    {
        id: "nacimiento_options",
        title: "El Origen de tu Historia",
        description: "Tus padres te miran en el hospital y discuten qué nombre ponerte. ¿Qué decides hacer tú, un bebé recién nacido?",
        emoji: "👶",
        minAge: 0,
        maxAge: 0,
        category: "child",
        options: [
            {
                text: "Llorar con todas tus fuerzas",
                resolve: (p) => {
                    p.health = Math.min(100, p.health + 5);
                    p.happiness = Math.max(0, p.happiness - 5);
                    return "El médico se asusta y tu mamá te abraza. Tu salud sube, pero entras estresado al mundo.";
                }
            },
            {
                text: "Dormir plácidamente",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 10);
                    p.stress = Math.max(0, p.stress - 5);
                    return "Tus padres dicen que eres un angelito. Te relajas y sueñas con un futuro brillante.";
                }
            },
            {
                text: "Guiñar un ojo al enfermero",
                resolve: (p) => {
                    p.luck = Math.min(100, p.luck + 15);
                    p.contacts = Math.min(100, p.contacts + 10);
                    return "El enfermero le dice a tus padres: 'Este chibolo va a ser tremendo parador'. Ganas suerte y contactos.";
                }
            }
        ]
    },
    {
        id: "mercado_mama",
        title: "Paseo al Mercado",
        description: "Tu mamá te llevó al mercado de tu barrio en cochecito. Pasas por la sección de dulces y juguetes de plástico chinos. ¿Qué haces?",
        emoji: "🏪",
        minAge: 2,
        maxAge: 5,
        category: "child",
        options: [
            {
                text: "Pedir un dulce amablemente",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 10);
                    p.karmaValue += 2;
                    return "Tu mamá te compra un barquillo de S/. 0.50. Felicidad +10 y ganas Karma positivo.";
                }
            },
            {
                text: "Hacer un berrinche colosal",
                resolve: (p) => {
                    p.happiness = Math.max(0, p.happiness - 10);
                    p.stress = Math.min(100, p.stress + 15);
                    p.karmaValue -= 2;
                    return "Te cae un cocacho correctivo en seco. Estrés +15, Felicidad -10.";
                }
            },
            {
                text: "Salir corriendo a explorar",
                resolve: (p) => {
                    p.health = Math.max(0, p.health - 15);
                    p.luck = Math.min(100, p.luck + 10);
                    return "Te perdiste entre los puestos de papas y pollos por 10 minutos. Te rescató la señora del emoliente. Salud -15 por el susto, pero ganas suerte.";
                }
            }
        ]
    },
    {
        id: "firulais_vecino",
        title: "El Perro del Vecino",
        description: "Te encuentras cara a cara con un perrito criollo ('Firulais') que custodia la vereda. Te mira fijamente mientras mueve la cola a medias. ¿Qué haces?",
        emoji: "🐕",
        minAge: 3,
        maxAge: 6,
        category: "child",
        options: [
            {
                text: "Acariciarle la cabeza",
                resolve: (p) => {
                    if (Math.random() < 0.6) {
                        p.happiness = Math.min(100, p.happiness + 15);
                        p.contacts = Math.min(100, p.contacts + 5);
                        return "Firulais es manso. Te lame la mano y ahora tienes un amigo peludo en el barrio. Felicidad +15.";
                    } else {
                        p.health = Math.max(0, p.health - 25);
                        p.stress = Math.min(100, p.stress + 20);
                        return "Te mordió el brazo. Tuviste que ir a la posta por vacunas antirrábicas. Salud -25, Estrés +20.";
                    }
                }
            },
            {
                text: "Correr despavorido",
                resolve: (p) => {
                    p.stress = Math.min(100, p.stress + 10);
                    p.health = Math.min(100, p.health + 5);
                    return "El perro te persigue media cuadra ladrando. El cardio te hace bien para las piernas, pero el susto no te lo quita nadie.";
                }
            },
            {
                text: "Invitarle un pedazo de pan con mortadela",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 10);
                    p.contacts = Math.min(100, p.contacts + 15);
                    p.karmaValue += 3;
                    return "Firulais ahora es tu guardián personal. Te escolta a tu casa. Ganas contactos, felicidad y karma.";
                }
            }
        ]
    },

    // ------------------------------------------
    // NIÑEZ Y COLEGIO (Edades 6 a 12)
    // ------------------------------------------
    {
        id: "colegio_primer_dia",
        title: "Primer Día de Clase",
        description: "Llegas al salón de tu colegio. Todos los asientos están libres. ¿Al lado de quién te sientas?",
        emoji: "🏫",
        minAge: 6,
        maxAge: 7,
        category: "child",
        options: [
            {
                text: "Con el nerd de lentes (🤓)",
                resolve: (p) => {
                    p.education = Math.min(100, p.education + 15);
                    p.contacts = Math.min(100, p.contacts + 5);
                    return "Copias las tareas a tiempo y aprendes trucos matemáticos. Educación +15.";
                }
            },
            {
                text: "Con el payaso del salón (😂)",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 20);
                    p.stress = Math.max(0, p.stress - 10);
                    return "Te ríes toda la clase pero la profesora te bota al pasadizo tres veces. Felicidad +20, Educación -5.";
                }
            },
            {
                text: "Con el dueño de la pelota de fútbol (⚽)",
                resolve: (p) => {
                    p.contacts = Math.min(100, p.contacts + 15);
                    p.happiness = Math.min(100, p.happiness + 10);
                    return "Te eligen primero en las pichangas del recreo. Contactos +15, Felicidad +10.";
                }
            },
            {
                text: "Al fondo, solo (😎)",
                resolve: (p) => {
                    p.stress = Math.max(0, p.stress - 10);
                    p.luck = Math.min(100, p.luck + 5);
                    return "Eres el misterioso del salón. Duermes tranquilo sin que el profesor te vea.";
                }
            }
        ]
    },
    {
        id: "coleccion_tazos",
        title: "Guerra de Tazos",
        description: "En el recreo hay un círculo de compañeros jugando tazos de Pokemón sobre la loza de concreto. ¿Qué decides hacer?",
        emoji: "💿",
        minAge: 7,
        maxAge: 11,
        category: "child",
        options: [
            {
                text: "Apostar tus tazos más raros en modo 'chimba'",
                resolve: (p) => {
                    if (Math.random() < p.luck / 100) {
                        p.happiness = Math.min(100, p.happiness + 15);
                        p.contacts = Math.min(100, p.contacts + 10);
                        return "¡Tenías buena técnica de volteo! Les ganaste toda la colección. Te respetan en el patio. Felicidad +15.";
                    } else {
                        p.happiness = Math.max(0, p.happiness - 15);
                        p.stress = Math.min(100, p.stress + 10);
                        return "Perdiste tus tazos holográficos de Charizard. Lloras en el baño de primaria. Felicidad -15.";
                    }
                }
            },
            {
                text: "Mirar desde lejos comiendo tu marciano",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 5);
                    p.health = Math.min(100, p.health + 5);
                    return "Disfrutas tu marciano de maracuyá de S/. 0.50 de forma segura. Salud y tranquilidad.";
                }
            },
            {
                text: "Robar un tazo del suelo cuando nadie mire",
                resolve: (p) => {
                    p.karmaValue -= 5;
                    if (Math.random() < 0.7) {
                        p.luck = Math.min(100, p.luck + 10);
                        return "Nadie se dio cuenta. Guardaste el tazo en tu cartuchera. Eres astuto pero tu Karma baja.";
                    } else {
                        p.contacts = Math.max(0, p.contacts - 15);
                        p.stress = Math.min(100, p.stress + 15);
                        return "Te ampayaron. Te gritaron '¡Choro!' y nadie quiere juntarse contigo. Estrés +15, Contactos -15.";
                    }
                }
            }
        ]
    },
    {
        id: "perdido_supermercado",
        title: "Perdido en el Supermercado",
        description: "Te soltaste de la mano de tu mamá para ver los televisores encendidos en Plaza Vea y cuando volteaste, ya no estaba. ¿Cómo reaccionas?",
        emoji: "🏢",
        minAge: 6,
        maxAge: 9,
        category: "child",
        options: [
            {
                text: "Ir a la caja y pedir ayuda por megáfono",
                resolve: (p) => {
                    p.education = Math.min(100, p.education + 5);
                    p.stress = Math.min(100, p.stress + 10);
                    return "Tu mamá te recoge llorando pero aliviada. Demostraste madurez e inteligencia para resolver crisis.";
                }
            },
            {
                text: "Llorar ruidosamente al lado de los juguetes",
                resolve: (p) => {
                    p.stress = Math.min(100, p.stress + 20);
                    p.happiness = Math.max(0, p.happiness - 10);
                    return "Un guardia de seguridad te llevó a servicio al cliente. Tu mamá llegó molesta por la palta pública. Estrés +20.";
                }
            },
            {
                text: "Aprovechar y comer uvas gratis del stand",
                resolve: (p) => {
                    p.karmaValue -= 3;
                    p.happiness = Math.min(100, p.happiness + 10);
                    return "Comiste 10 uvas Italia antes de que te encuentren. Llenaste la barriga pero tu karma se resiente.";
                }
            }
        ]
    },

    // ------------------------------------------
    // ADOLESCENCIA (Edades 13 a 17)
    // ------------------------------------------
    {
        id: "examen_colegio",
        title: "Examen Bimestral de Ciencias",
        description: "Mañana es el examen bimestral de Física. No has estudiado nada porque te pasaste la semana jugando videojuegos en cabinas de internet. ¿Qué haces?",
        emoji: "📖",
        minAge: 13,
        maxAge: 16,
        category: "youth",
        options: [
            {
                text: "Quedarte despierto toda la noche estudiando",
                resolve: (p) => {
                    p.education = Math.min(100, p.education + 15);
                    p.health = Math.max(0, p.health - 15);
                    p.stress = Math.min(100, p.stress + 20);
                    return "Aprobaste con las justas (11/20), pero tienes ojeras gigantes y dolor de cabeza. Salud -15, Educación +15.";
                }
            },
            {
                text: "Jugar Free Fire con tus patas en discord",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 20);
                    p.education = Math.max(0, p.education - 10);
                    p.stress = Math.max(0, p.stress - 15);
                    return "Quedaste en rango Heroico en el juego, pero jalaste el examen con 05. Tu mamá ya alistó la chancla. Felicidad +20, Educación -10.";
                }
            },
            {
                text: "Preparar un plagio microscópico",
                resolve: (p) => {
                    p.karmaValue -= 5;
                    if (Math.random() < 0.7) {
                        p.education = Math.min(100, p.education + 10);
                        p.luck = Math.min(100, p.luck + 5);
                        return "La profesora no vio tu papelito. Aprobaste con 16/20. Eres un hacker criollo. Karma -5.";
                    } else {
                        p.stress = Math.min(100, p.stress + 30);
                        p.education = Math.max(0, p.education - 5);
                        return "Te ampayaron el plagio. Citación al apoderado y suspensión de 3 días. Estrés +30.";
                    }
                }
            }
        ]
    },
    {
        id: "quinceanero_barrio",
        title: "El Quinceañero de tu Amiga",
        description: "Estás invitado al quinceañero de una amiga del salón. Es en un local comunal y promete harto baile. ¿Cuál es tu plan de acción?",
        emoji: "💃",
        minAge: 14,
        maxAge: 16,
        category: "youth",
        options: [
            {
                text: "Ser el primero en la pista y bailar de todo",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 20);
                    p.contacts = Math.min(100, p.contacts + 15);
                    return "Bailaste cumbia, salsa y reggaetón viejito. Eres el alma de la fiesta. Felicidad +20, Contactos +15.";
                }
            },
            {
                text: "Comer todos los sandwiches de pollo triples",
                resolve: (p) => {
                    p.health = Math.max(0, p.health - 5);
                    p.happiness = Math.min(100, p.happiness + 15);
                    return "Devoraste una bandeja entera de bocaditos y gaseosa. Tuviste una indigestión leve, pero valió la pena.";
                }
            },
            {
                text: "Robar una botella de gaseosa de 3 litros de la mesa",
                resolve: (p) => {
                    p.karmaValue -= 4;
                    p.money = Math.min(10000, p.money + 10); // Valor simbólico
                    return "Te la metiste en la mochila al final de la fiesta. Desayunaste gaseosa negra al día siguiente. Karma -4.";
                }
            }
        ]
    },

    // ------------------------------------------
    // JUVENTUD (Edades 18 a 25)
    // ------------------------------------------
    {
        id: "eleccion_estudios",
        title: "La Encrucijada de los 18",
        description: "Terminaste el colegio. Tus tíos te preguntan qué vas a hacer de tu vida y la presión familiar se siente en el almuerzo. ¿Qué camino tomas?",
        emoji: "🎓",
        minAge: 17,
        maxAge: 18,
        category: "youth",
        options: [
            {
                text: "Postular a la Universidad Nacional (San Marcos/UNI)",
                resolve: (p) => {
                    p.education = Math.min(100, p.education + 10);
                    p.stress = Math.min(100, p.stress + 20);
                    p.money = Math.max(-10000, p.money - 200); // Costo de prospecto
                    p.studyPath = "nacional";
                    return "Te encierras en una academia por meses a estudiar. Tu cerebro echa humo, pero tu bolsillo no sufre tanto. Estrés +20.";
                }
            },
            {
                text: "Matricularte en una Universidad Particular barata",
                resolve: (p) => {
                    p.education = Math.min(100, p.education + 15);
                    p.money = Math.max(-50000, p.money - 3000);
                    p.studyPath = "particular_barata";
                    return "Tus padres piden un préstamo cooperativo para pagar tu matrícula. Tienes que estudiar y cuidar las finanzas.";
                }
            },
            {
                text: "Pedir que te paguen una Particular Cara (Pacifico/Lima/PUCP)",
                resolve: (p) => {
                    if (p.socialClass === "rico") {
                        p.education = Math.min(100, p.education + 25);
                        p.contacts = Math.min(100, p.contacts + 30);
                        p.money = Math.max(-100000, p.money - 15000);
                        p.studyPath = "particular_cara";
                        return "Tus papás la pagan sin problemas. Haces contactos influyentes desde el primer ciclo. Contactos +30, Educación +25.";
                    } else {
                        p.stress = Math.min(100, p.stress + 15);
                        return "Tus padres te miran feo y se ríen: '¿De dónde crees que somos millonarios? Elige otra opción'. El estrés sube.";
                    }
                }
            },
            {
                text: "No estudiar y empezar a trabajar de frente",
                resolve: (p) => {
                    p.money = Math.min(100000, p.money + 1200);
                    p.job = "Trabajador Informal";
                    p.studyPath = "trabajo";
                    return "Empiezas a ganar tus propios soles inmediatamente como ayudante de almacén. Dinero +S/. 1,200.";
                }
            }
        ]
    },
    {
        id: "primera_practica",
        title: "Búsqueda de Prácticas",
        description: "Estás buscando tus primeras prácticas pre-profesionales para convalidar tus estudios. Envías tu CV a 30 empresas. ¿Qué ocurre?",
        emoji: "💼",
        minAge: 19,
        maxAge: 22,
        category: "youth",
        options: [
            {
                text: "Usar los contactos de tu papá ('La Vara')",
                resolve: (p) => {
                    if (p.contacts >= 40) {
                        p.job = "Practicante de Oficina";
                        p.money = Math.min(100000, p.money + 1025);
                        p.stress = Math.min(100, p.stress + 5);
                        return "Un amigo de tu papá te contrató sin entrevista técnica. Entraste con vara. Sueldo de S/. 1,025 al mes.";
                    } else {
                        p.stress = Math.min(100, p.stress + 15);
                        return "No tienes suficientes contactos para que te recomienden. Te toca buscar por el camino difícil.";
                    }
                }
            },
            {
                text: "Postular limpiamente por portales web",
                resolve: (p) => {
                    if (p.education >= 50 || p.luck >= 60) {
                        p.job = "Practicante por Mérito";
                        p.money = Math.min(100000, p.money + 1200);
                        p.happiness = Math.min(100, p.happiness + 20);
                        // Desbloquea logro
                        p.unlockAchievement("trabajo_sin_vara");
                        return "¡Felicitaciones! Pasaste 4 dinámicas grupales y te aceptaron. Desbloqueas Logro: Sin Vara y de Frente.";
                    } else {
                        p.stress = Math.min(100, p.stress + 15);
                        return "Te respondieron diciendo: 'Gracias por postular, guardaremos tu CV'. Seguirás buscando.";
                    }
                }
            },
            {
                text: "Iniciar un emprendimiento vendiendo marcianos de pura fruta",
                resolve: (p) => {
                    p.job = "Emprendedor de Helados";
                    p.money = Math.max(-10000, p.money - 200); // Inversión en licuadora y vasos
                    p.happiness = Math.min(100, p.happiness + 10);
                    return "Compraste insumos y pusiste un letrero en tu ventana: 'Se venden marcianos'. Eres tu propio jefe.";
                }
            }
        ]
    },
    {
        id: "primer_sueldo_decision",
        title: "¿Qué haces con tu primer sueldo?",
        description: "Revisas tu cuenta bancaria y ves tu primer depósito completo (S/. 1,025). Tienes el dinero quemándote las manos. ¿En qué lo gastas?",
        emoji: "💸",
        minAge: 18,
        maxAge: 23,
        category: "youth",
        options: [
            {
                text: "Invitar un Pollito a la Brasa a toda tu familia",
                resolve: (p) => {
                    p.money = Math.max(-20000, p.money - 150);
                    p.happiness = Math.min(100, p.happiness + 25);
                    p.contacts = Math.min(100, p.contacts + 15);
                    p.karmaValue += 5;
                    p.unlockAchievement("primer_sueldo");
                    p.unlockAchievement("casero_vip");
                    return "Tu familia está orgullosa de ti. Comieron con bastante ají y ensalada. Felicidad +25, Logro Desbloqueado: Primer Sueldo.";
                }
            },
            {
                text: "Ahorrarlo todo bajo el colchón",
                resolve: (p) => {
                    p.happiness = Math.max(0, p.happiness - 5);
                    p.unlockAchievement("primer_sueldo");
                    return "No gastaste ni un sol. Eres tacaño pero precavido. Tus ahorros suben.";
                }
            },
            {
                text: "Comprar ropa y juegos de Steam",
                resolve: (p) => {
                    p.money = Math.max(-20000, p.money - 400);
                    p.happiness = Math.min(100, p.happiness + 20);
                    p.unlockAchievement("primer_sueldo");
                    return "Te compraste juegos que nunca vas a jugar en tu biblioteca de Steam. Felicidad a tope por unas horas.";
                }
            },
            {
                text: "Darle la inicial a una moto lineal usada",
                resolve: (p) => {
                    p.money = Math.max(-20000, p.money - 800);
                    p.assets.push("Moto Lineal");
                    p.happiness = Math.min(100, p.happiness + 15);
                    p.stress = Math.min(100, p.stress + 10);
                    p.unlockAchievement("primer_sueldo");
                    return "¡Ya tienes ruedas propias! Podrás hacer delivery en tus ratos libres, pero el tráfico te estresará.";
                }
            }
        ]
    },

    // ------------------------------------------
    // ADULTEZ Y MEMES (Edades 26 a 60)
    // ------------------------------------------
    {
        id: "estafa_whatsapp_event",
        title: "El Mensaje de WhatsApp Sospechoso",
        description: "Te llega un mensaje de un número de Indonesia: 'Hola sobrino, estoy en el aeropuerto y necesito que me yapees para liberar mis maletas'. ¿Qué haces?",
        emoji: "📱",
        minAge: 20,
        maxAge: 65,
        category: "adult",
        options: [
            {
                text: "Creerle y yapear S/. 500 inmediatamente",
                resolve: (p) => {
                    p.money = Math.max(-50000, p.money - 500);
                    p.happiness = Math.max(0, p.happiness - 30);
                    p.stress = Math.min(100, p.stress + 25);
                    p.unlockAchievement("estafado_whatsapp");
                    return "Era un preso de Lurigancho. Perdiste S/. 500 y desbloqueaste el logro 'Hola Tío'. Felicidad -30.";
                }
            },
            {
                text: "Responderle con memes obscenos de combis",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 15);
                    p.luck = Math.min(100, p.luck + 5);
                    return "Te bloqueó de inmediato, pero te reíste toda la tarde compartiendo el screenshot. Felicidad +15.";
                }
            },
            {
                text: "Ignorar y reportar el número",
                resolve: (p) => {
                    p.education = Math.min(100, p.education + 5);
                    return "No caíste en el cuento. Eres un ciudadano digital responsable.";
                }
            }
        ]
    },
    {
        id: "auditoria_sunat",
        title: "Notificación de la SUNAT",
        description: "Recibes una notificación en tu buzón electrónico de la SUNAT. Detectan que tus gastos en pollitos a la brasa superan tus ingresos declarados. ¿Cómo procedes?",
        emoji: "⚖️",
        minAge: 24,
        maxAge: 70,
        category: "adult",
        options: [
            {
                text: "Ir a la oficina con facturas e intentar conciliar",
                resolve: (p) => {
                    if (p.education >= 60 || p.luck >= 50) {
                        p.money = Math.max(-50000, p.money - 500); // Multa menor
                        p.stress = Math.min(100, p.stress + 10);
                        p.unlockAchievement("sobreviviente_sunat");
                        return "Pagas una pequeña multa de S/. 500. Te salvaste del embargo. Logro Desbloqueado: SUNAT no me Asusta.";
                    } else {
                        p.money = Math.max(-50000, p.money - 3000);
                        p.stress = Math.min(100, p.stress + 30);
                        return "No pudiste justificar tus cuentas y te aplicaron una multa severa de S/. 3,000. Estrés +30.";
                    }
                }
            },
            {
                text: "Esconderte y cambiar tu número de teléfono",
                resolve: (p) => {
                    p.karmaValue -= 5;
                    if (Math.random() < 0.3) {
                        p.stress = Math.max(0, p.stress - 10);
                        return "Te mudaste de distrito y prescribió la deuda. La suerte te acompaña temporalmente.";
                    } else {
                        p.money = Math.max(-50000, p.money - 8000);
                        p.stress = Math.min(100, p.stress + 40);
                        p.health = Math.max(0, p.health - 10);
                        return "Congelaron tus cuentas del banco. Te cobraron S/. 8,000 automáticamente. Colapso financiero. Estrés +40.";
                    }
                }
            },
            {
                text: "Contratar un contador experto de la Av. Wilson",
                resolve: (p) => {
                    p.money = Math.max(-50000, p.money - 300); // Honorarios del contador
                    p.contacts = Math.min(100, p.contacts + 10);
                    p.stress = Math.max(0, p.stress - 15);
                    p.unlockAchievement("sobreviviente_sunat");
                    return "El contador hizo su magia con facturas duplicadas. SUNAT archivó el caso. Pagaste S/. 300 al contador. Gran jugada.";
                }
            }
        ]
    },
    {
        id: "cobrador_combi_griton",
        title: "El Grito del Cobrador",
        description: "Estás parado en la puerta de la combi y el cobrador grita: '¡Avancen al fondo que hay sitio! ¡Uno más entra!'. La combi está al 200% de su capacidad. ¿Qué haces?",
        emoji: "🚐",
        minAge: 15,
        maxAge: 60,
        category: "adult",
        options: [
            {
                text: "Avanzar al fondo apretando costillas",
                resolve: (p) => {
                    p.stress = Math.min(100, p.stress + 15);
                    p.health = Math.max(0, p.health - 5);
                    p.unlockAchievement("sobreviviente_transporte");
                    return "Viajaste con la cara pegada a la luna trasera del bus. Estrés +15, pero llegaste a tu destino.";
                }
            },
            {
                text: "Gritarle: '¡No mienta jefe, ya no entra ni un alfiler!'",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 10);
                    p.contacts = Math.min(100, p.contacts + 5);
                    return "Todo el bus te respaldó en coro. El cobrador renegó pero cerró la puerta. Felicidad +10.";
                }
            },
            {
                text: "Bajarte e irte caminando",
                resolve: (p) => {
                    p.health = Math.min(100, p.health + 10);
                    p.stress = Math.max(0, p.stress - 10);
                    p.money = Math.max(-50000, p.money - 3.50);
                    return "Caminaste 20 cuadras. Tu cuerpo te lo agradece, pero gastaste S/. 3.50 adicionales en agua de mesa.";
                }
            }
        ]
    },
    {
        id: "clasificacion_mundial",
        title: "Perú juega el repechaje al Mundial",
        description: "La selección peruana juega el partido definitorio para clasificar al Mundial a las 8:00 p.m. Todo el país está paralizado. ¿Dónde lo ves?",
        emoji: "⚽",
        minAge: 10,
        maxAge: 80,
        category: "adult",
        options: [
            {
                text: "Comprar pack de cervezas y verlo con tus amigos del barrio",
                resolve: (p) => {
                    p.money = Math.max(-50000, p.money - 80);
                    p.happiness = Math.min(100, p.happiness + 30);
                    p.contacts = Math.min(100, p.contacts + 15);
                    p.unlockAchievement("peru_campeon");
                    return "¡Perú clasificó con gol al último minuto! La celebración duró hasta el amanecer del lunes. Felicidad +30, Contactos +15.";
                }
            },
            {
                text: "Quedarte trabajando horas extras en la oficina",
                resolve: (p) => {
                    p.money = Math.min(100000, p.money + 150);
                    p.stress = Math.min(100, p.stress + 10);
                    p.happiness = Math.max(0, p.happiness - 15);
                    return "Ganaste S/. 150 por horas extras, pero eres el único que no celebró. Escuchabas los gritos de gol por la ventana de la oficina.";
                }
            },
            {
                text: "Apostar S/. 500 a que Perú gana por goleada",
                resolve: (p) => {
                    if (Math.random() < p.luck / 100) {
                        p.money = Math.min(100000, p.money + 1500);
                        p.happiness = Math.min(100, p.happiness + 40);
                        p.unlockAchievement("casino_master");
                        return "¡Milagro! Perú goleó 3-0. Ganaste S/. 1,500 en la casa de apuestas. Felicidad +40.";
                    } else {
                        p.money = Math.max(-50000, p.money - 500);
                        p.happiness = Math.max(0, p.happiness - 25);
                        p.stress = Math.min(100, p.stress + 20);
                        return "Perdimos por un autogol absurdo. Perdiste tus S/. 500. El lunes fue feriado pero estabas deprimido y endeudado.";
                    }
                }
            }
        ]
    },
    {
        id: "cortaron_la_luz",
        title: "Apagón en el Barrio",
        description: "A mitad de la noche, se escucha una explosión en el poste de luz de la esquina y todo queda a oscuras en tu cuadra. ¿Qué haces?",
        emoji: "⚡",
        minAge: 8,
        maxAge: 75,
        category: "adult",
        options: [
            {
                text: "Prender velas y jugar ludo con tu familia",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 15);
                    p.stress = Math.max(0, p.stress - 10);
                    p.unlockAchievement("sin_luz");
                    return "Pasaste una hermosa noche conversando e inventando historias de terror con velas. Felicidad +15, Logro Desbloqueado.";
                }
            },
            {
                text: "Renegar, gritarle a la empresa de luz por Twitter y dormirte",
                resolve: (p) => {
                    p.stress = Math.min(100, p.stress + 10);
                    p.happiness = Math.max(0, p.happiness - 5);
                    return "Tu tuit tuvo cero interacciones y tuviste insomnio por el calor del cuarto sin ventilador.";
                }
            },
            {
                text: "Salir a la calle a ver qué vecinos están chismeando",
                resolve: (p) => {
                    p.contacts = Math.min(100, p.contacts + 10);
                    p.happiness = Math.min(100, p.happiness + 5);
                    return "Te enteraste de todos los amoríos de la cuadra conversando con los vecinos de la acera del frente. Contactos +10.";
                }
            }
        ]
    },

    // ------------------------------------------
    // MODO CAÓTICO Y MEMES PERUANOS (Aparecen con mayor frecuencia en Modo Caótico)
    // ------------------------------------------
    {
        id: "llama_escupitajo",
        title: "Visita Turística en Cusco",
        description: "Estás paseando por las calles de piedra de Cusco y ves a una llama preciosa adornada con pompones de colores. Te acercas a tomarte una selfie. ¿Qué pasa?",
        emoji: "🦙",
        minAge: 12,
        maxAge: 70,
        category: "chaotic",
        chaosOnly: false,
        options: [
            {
                text: "Aproximarte lentamente sonriendo",
                resolve: (p) => {
                    if (Math.random() < 0.4) {
                        p.happiness = Math.min(100, p.happiness + 20);
                        return "La llama posó perfecta para la foto. Eres viral en Instagram. Felicidad +20.";
                    } else {
                        p.happiness = Math.max(0, p.happiness - 15);
                        p.health = Math.max(0, p.health - 5);
                        p.unlockAchievement("escupido_llama");
                        return "¡La llama te escupió directamente en el ojo! El olor a pasto masticado no se te quitó en tres días. Logro Desbloqueado: Escupitajo Sagrado.";
                    }
                }
            },
            {
                text: "Darle de comer alfalfa que compraste a la casera",
                resolve: (p) => {
                    p.money = Math.max(-50000, p.money - 5);
                    p.happiness = Math.min(100, p.happiness + 15);
                    p.karmaValue += 2;
                    return "Te comió de la mano pacíficamente. Ganas la simpatía del reino animal andino.";
                }
            }
        ]
    },
    {
        id: "anticuchos_carretilla",
        title: "La Carretilla del Antojo",
        description: "Son las 11:30 p.m. y sales de trabajar con un hambre feroz. Huele a anticucho de corazón recién asado con su respectiva papa y ají en la carretilla de la esquina. ¿Qué haces?",
        emoji: "🍡",
        minAge: 15,
        maxAge: 75,
        category: "chaotic",
        options: [
            {
                text: "Comer el combo completo de S/. 7 con abundante ají picante",
                resolve: (p) => {
                    if (Math.random() < p.luck / 100 + 0.3) {
                        p.health = Math.min(100, p.health + 10);
                        p.happiness = Math.min(100, p.happiness + 25);
                        p.unlockAchievement("anticuchero");
                        return "¡Estómago de titanio! Disfrutaste el mejor anticucho de tu vida. Felicidad +25, Logro Desbloqueado.";
                    } else {
                        p.health = Math.max(0, p.health - 30);
                        p.stress = Math.min(100, p.stress + 15);
                        p.money = Math.max(-50000, p.money - 60); // Gasto en medicamentos
                        return "Tuviste una infección estomacal de película. Pasaste el fin de semana abrazado al inodoro. Salud -30, S/. 60 en pastillas.";
                    }
                }
            },
            {
                text: "Ignorar el aroma y cenar avena en tu casa",
                resolve: (p) => {
                    p.health = Math.min(100, p.health + 5);
                    p.happiness = Math.max(0, p.happiness - 10);
                    return "Cenaste sano pero aburrido. Lloras pensando en lo rico que hubieran estado esos trozos de corazón de res.";
                }
            }
        ]
    },
    {
        id: "tian_buenos_dias",
        title: "Las Imágenes de Buenos Días de la Tía",
        description: "Tu tía Clotilde envía 15 imágenes pesadas de Piolín y tazas de café con escarcha al grupo familiar de WhatsApp ('Familia Unida'). ¿Cómo reaccionas?",
        emoji: "👵",
        minAge: 15,
        maxAge: 80,
        category: "chaotic",
        options: [
            {
                text: "Responder con un GIF de oso bailando diciendo 'Gracias tía'",
                resolve: (p) => {
                    p.contacts = Math.min(100, p.contacts + 10);
                    p.socialLogCount = (p.socialLogCount || 0) + 1;
                    if (p.socialLogCount >= 10) p.unlockAchievement("tio_whatsapp");
                    return "Tu tía te adora y te dice 'bendiciones sobrino'. Ganas contactos familiares.";
                }
            },
            {
                text: "Salirte del grupo familiar sin decir nada",
                resolve: (p) => {
                    p.contacts = Math.max(0, p.contacts - 20);
                    p.stress = Math.max(0, p.stress - 15);
                    p.karmaValue -= 3;
                    return "Se armó un escándalo familiar. Tu mamá te llamó a reclamar por 'falta de respeto'. Bajaron tus contactos, pero tu paz mental mejoró.";
                }
            },
            {
                text: "Silenciar el grupo 'Para Siempre' y no abrirlo nunca",
                resolve: (p) => {
                    p.stress = Math.max(0, p.stress - 10);
                    return "Ojos que no ven, corazón que no siente. El celular ya no te vibra cada 5 minutos.";
                }
            }
        ]
    },
    {
        id: "policia_dni",
        title: "Control de Identidad de la Policía",
        description: "Estás caminando por el Jirón de la Unión y una patrulla de la Policía Nacional te detiene y te dice: 'Joven, su DNI por favor'. Buscas en tu bolsillo y no está. ¿Qué haces?",
        emoji: "👮",
        minAge: 18,
        maxAge: 70,
        category: "chaotic",
        options: [
            {
                text: "Explicar educadamente y mostrar foto de tu DNI en tu celular",
                resolve: (p) => {
                    if (p.education >= 40 || p.luck >= 50) {
                        p.happiness = Math.min(100, p.happiness + 5);
                        p.unlockAchievement("sin_dni");
                        return "El oficial entendió y te dejó ir con una advertencia. Logro Desbloqueado: Indocumentado.";
                    } else {
                        p.stress = Math.min(100, p.stress + 15);
                        return "El policía no te creyó y te retuvo 30 minutos al lado del patrullero verificando tus antecedentes. Qué palta. Estrés +15.";
                    }
                }
            },
            {
                text: "Salir corriendo a toda velocidad",
                resolve: (p) => {
                    p.karmaValue -= 5;
                    if (Math.random() < 0.3) {
                        p.health = Math.min(100, p.health + 5);
                        p.luck = Math.min(100, p.luck + 15);
                        return "¡Los perdiste por los callejones! Ganas adrenalina y suerte, pero tu karma baja por sospechoso.";
                    } else {
                        p.health = Math.max(0, p.health - 25);
                        p.stress = Math.min(100, p.stress + 30);
                        p.money = Math.max(-50000, p.money - 300); // Gasto judicial/fianza
                        return "Te taclearon a los 50 metros. Pasaste la noche en la comisaría por desacato. Salud -25, Estrés +30, multa de S/. 300.";
                    }
                }
            },
            {
                text: "Intentar dar una coima de S/. 20 ('Para la gaseosa')",
                resolve: (p) => {
                    p.karmaValue -= 10;
                    if (Math.random() < 0.5) {
                        p.money = Math.max(-50000, p.money - 20);
                        p.stress = Math.max(0, p.stress - 5);
                        return "Aceptó la gaseosa y te deseó buen día. Resolviste el problema de forma corrupta. Karma -10.";
                    } else {
                        p.stress = Math.min(100, p.stress + 45);
                        p.money = Math.max(-50000, p.money - 1500); // Gasto legal
                        return "¡El oficial era honesto! Te esposaron por cohecho activo. Tuviste que pagar abogado de emergencia. Estrés +45, S/. 1,500 gastados.";
                    }
                }
            }
        ]
    },
    {
        id: "cantar_carinito",
        title: "El Canto del Pasajero",
        description: "Vas en el Metropolitano lleno y tarareas en voz alta sin querer el coro de la canción 'Cariñito': 'Lloro por quererte, por amarte y por desearte...'. ¿Qué ocurre?",
        emoji: "🎤",
        minAge: 10,
        maxAge: 70,
        category: "chaotic",
        options: [
            {
                text: "Cantar el siguiente verso a todo pulmón (¡Ay cariño, ay mi cariño!)",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 20);
                    p.contacts = Math.min(100, p.contacts + 15);
                    p.unlockAchievement("canto_bus");
                    return "¡Todo el bus te siguió en coro! Hasta el cobrador aplaudió. Viviste un momento mágico de unión peruana. Felicidad +20, Logro Desbloqueado.";
                }
            },
            {
                text: "Hacerte el loco y disimular tosiendo",
                resolve: (p) => {
                    p.stress = Math.min(100, p.stress + 5);
                    return "La señora de tu costado te miró raro pero no pasó a mayores.";
                }
            }
        ]
    },
    {
        id: "chaman_tiktoker",
        title: "El Chamán de TikTok",
        description: "Un curandero andino en TikTok te sale en recomendados prometiendo hacerte millonario, limpiar tus deudas y traerte el amor de tu vida en 3 días a cambio de una donación voluntaria de S/. 200. ¿Qué haces?",
        emoji: "🔮",
        minAge: 18,
        maxAge: 80,
        category: "chaotic",
        options: [
            {
                text: "Yapear los S/. 200 por si acaso (Fe ciega)",
                resolve: (p) => {
                    p.money = Math.max(-50000, p.money - 200);
                    p.karmaValue += 1;
                    if (Math.random() < 0.15) {
                        p.luck = Math.min(100, p.luck + 30);
                        p.happiness = Math.min(100, p.happiness + 15);
                        p.unlockAchievement("chaman_vip");
                        return "¡Sorprendentemente funcionó! Encontraste 200 soles tirados al día siguiente y te sientes bendecido. Ganas suerte.";
                    } else {
                        p.happiness = Math.max(0, p.happiness - 15);
                        p.stress = Math.min(100, p.stress + 10);
                        p.unlockAchievement("chaman_vip");
                        return "El chamán cerró su cuenta de TikTok al recibir el pago. Te quedaste sin dinero y con las mismas deudas. Logro Desbloqueado: Creyente del Chamán.";
                    }
                }
            },
            {
                text: "Comprar ruda en el mercado por S/. 2 y hacerte tu propia limpia",
                resolve: (p) => {
                    p.money = Math.max(-50000, p.money - 2);
                    p.health = Math.min(100, p.health + 10);
                    p.happiness = Math.min(100, p.happiness + 10);
                    p.unlockAchievement("chaman_vip");
                    return "Te frotaste ruda por todo el cuerpo cantando cumbia. Te picó la piel por la hierba, pero te sientes fresco y libre de malas vibras. Salud +10.";
                }
            },
            {
                text: "Burlarte en los comentarios",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 5);
                    p.luck = Math.max(0, p.luck - 10); // Te echó la sal
                    return "Le pusiste 'jaja estafador'. El chamán te respondió con un emoji de calavera. Perdiste 10 de suerte por maldición digital.";
                }
            }
        ]
    },

    // ------------------------------------------
    // ADULTOS - TRABAJOS Y ASCENSOS (Edades 23 a 60)
    // ------------------------------------------
    {
        id: "ascenso_oficina",
        title: "Evaluación de Desempeño",
        description: "Tu jefe te cita a su oficina privada para evaluar tu desempeño anual. Hay oportunidad de ascenso, pero requiere más compromiso de tu parte. ¿Qué le dices?",
        emoji: "💼",
        minAge: 22,
        maxAge: 55,
        category: "work",
        options: [
            {
                text: "Decir que estás dispuesto a quedarte tarde y poner el pecho",
                resolve: (p) => {
                    p.stress = Math.min(100, p.stress + 20);
                    p.money = Math.min(100000, p.money + 1500); // Aumento
                    p.contacts = Math.min(100, p.contacts + 10);
                    p.job = "Supervisor / Jefe";
                    return "¡Te ascendieron a Supervisor! Tu sueldo aumenta, pero tu estrés se eleva a las nubes. Estrés +20.";
                }
            },
            {
                text: "Sugerir que tu trabajo habla por sí solo (Perfil bajo)",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 5);
                    p.stress = Math.max(0, p.stress - 5);
                    return "Tu jefe asiente respetuosamente. Sigues en el mismo puesto pero mantienes tu paz mental intacta.";
                }
            },
            {
                text: "Pedir aumento citando ofertas de la competencia",
                resolve: (p) => {
                    if (p.education >= 70 || p.luck >= 60) {
                        p.money = Math.min(100000, p.money + 2500);
                        p.job = "Especialista Senior";
                        return "¡Jugaste al límite y ganaste! Te duplicaron el sueldo para que no te vayas. Sueldo incrementado.";
                    } else {
                        p.job = "Desempleado";
                        p.stress = Math.min(100, p.stress + 25);
                        p.happiness = Math.max(0, p.happiness - 20);
                        return "Tu jefe consideró tu actitud desafiante y te despidió. Te mandó tus beneficios por correo. Quedaste desempleado.";
                    }
                }
            }
        ]
    },
    {
        id: "idea_negocio",
        title: "La Gran Idea de Negocio",
        description: "Tu primo te ofrece asociarte para abrir un local de 'Pollo a la Brasa Fusión' con toques orientales en un local alquilado. Requiere una inversión de S/. 5,000. ¿Qué decides?",
        emoji: "🏪",
        minAge: 23,
        maxAge: 50,
        category: "work",
        options: [
            {
                text: "Invertir S/. 5,000 y ser socio al 50%",
                resolve: (p) => {
                    p.money = Math.max(-50000, p.money - 5000);
                    if (p.luck >= 45) {
                        p.job = "Dueño de Negocio";
                        p.money = Math.min(1000000, p.money + 12000); // Retorno masivo
                        p.happiness = Math.min(100, p.happiness + 20);
                        p.unlockAchievement("empresario");
                        return "¡El negocio es un golazo! La gente hace cola de 3 cuadras por tu ají secreto de lúcuma. Recuperas la inversión y ganas S/. 12,000. Logro Desbloqueado: Mister Pyme.";
                    } else {
                        p.happiness = Math.max(0, p.happiness - 20);
                        p.stress = Math.min(100, p.stress + 25);
                        return "El local quebró en 6 meses por mala gestión del primo. Perdiste tus S/. 5,000 completos. Estrés +25.";
                    }
                }
            },
            {
                text: "Rechazar la oferta y sugerirle vender emoliente en carretilla",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 5);
                    p.job = "Emolientero Magnate"; // Oportunidad secreta!
                    return "Tu primo se ofendió, pero a ti te quedó rondando la idea de la carretilla de emoliente. Decides iniciar tu propia carretilla ambulante.";
                }
            },
            {
                text: "Desearle suerte y quedarte con tus ahorros",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 5);
                    return "No arriesgas dinero. Duermes tranquilo sabiendo que tus soles están a salvo en tu alcancía.";
                }
            }
        ]
    },

    // ------------------------------------------
    // JUBILACIÓN (Edades 60 a 90)
    // ------------------------------------------
    {
        id: "cola_banco_nacion",
        title: "Trámites en el Banco de la Nación",
        description: "Tienes que ir a cobrar tu pensión o bono estatal al Banco de la Nación. Llegas y la cola rodea 3 cuadras bajo el sol. ¿Qué decides?",
        emoji: "🏦",
        minAge: 60,
        maxAge: 95,
        category: "retired",
        options: [
            {
                text: "Hacer la cola pacientemente conversando con otros jubilados",
                resolve: (p) => {
                    p.health = Math.max(0, p.health - 15);
                    p.stress = Math.min(100, p.stress + 10);
                    p.contacts = Math.min(100, p.contacts + 10);
                    p.money = Math.min(100000, p.money + 500); // Cobra bono
                    return "Pasaste 4 horas parado. Te duelen los talones pero cobraste tu bono de S/. 500 y conversaste sobre política antigua. Salud -15.";
                }
            },
            {
                text: "Pagarle S/. 10 a un muchacho para que te cuide el sitio en la cola",
                resolve: (p) => {
                    p.money = Math.max(-50000, p.money - 10);
                    p.money = Math.min(100000, p.money + 500); // Cobra bono
                    p.health = Math.min(100, p.health + 5);
                    p.unlockAchievement("cola_rapida");
                    return "Fuiste a tomar un emoliente caliente mientras hacían cola por ti. Regresaste directo a ventanilla. ¡Gran jugada criolla! Logro Desbloqueado.";
                }
            },
            {
                text: "Irte a casa y regresar otro día a las 4:00 a.m.",
                resolve: (p) => {
                    p.stress = Math.min(100, p.stress + 5);
                    p.health = Math.max(0, p.health - 5);
                    return "Te levantas en la madrugada del día siguiente con un frío tremendo, pero logras cobrar de los primeros. Cobras tus S/. 500.";
                }
            }
        ]
    },
    {
        id: "consejo_nietos",
        title: "Consejo a los Nietos",
        description: "Tus nietos se reúnen en tu sala y se la pasan pegados a sus cascos de realidad virtual. Te piden un consejo de sabiduría para la vida. ¿Qué les dices?",
        emoji: "👵",
        minAge: 65,
        maxAge: 95,
        category: "retired",
        options: [
            {
                text: "'Estudien mucho y consigan contactos. La vara lo es todo'",
                resolve: (p) => {
                    p.education = Math.min(100, p.education + 5);
                    p.contacts = Math.min(100, p.contacts + 5);
                    return "Tus nietos te miran con respeto y guardan sus dispositivos por 10 minutos. Ganas karma y educación.";
                }
            },
            {
                text: "'No gasten su plata en tonterías, inviertan en terrenos en el cerro'",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 10);
                    p.karmaValue -= 1;
                    return "Se ríen y dicen que el tío/abuelo tiene mentalidad de tiburón de Gamarra. Divertido almuerzo familiar.";
                }
            },
            {
                text: "'Coman bastante ají y disfruten el hoy, la vida vuela'",
                resolve: (p) => {
                    p.happiness = Math.min(100, p.happiness + 15);
                    p.health = Math.min(100, p.health + 5);
                    return "Tus nietos te abrazan y te piden que los lleves a comer pollito a la brasa. Felicidad +15.";
                }
            }
        ]
    }
];

// Eventos complementarios rápidos de un solo botón que ocurren año a año para dar dinamismo
window.GAME_QUICK_EVENTS = [
    {
        title: "🔋 Gaseosa Helada",
        description: "Hacía un calor insoportable de 31°C y te tomaste una Inca Kola helada de vidrio. Felicidad +10, Salud -2.",
        emoji: "🥤",
        minAge: 4,
        maxAge: 95,
        resolve: (p) => { p.happiness = Math.min(100, p.happiness + 10); p.health = Math.max(0, p.health - 2); }
    },
    {
        title: "📱 Yapeo Incorrecto",
        description: "Le yapeaste S/. 150 a un número equivocado por apurado. Intentaste llamar pero te colgaron de inmediato. Dinero -S/. 150, Estrés +10.",
        emoji: "💸",
        minAge: 16,
        maxAge: 95,
        resolve: (p) => { p.money = Math.max(-50000, p.money - 150); p.stress = Math.min(100, p.stress + 10); }
    },
    {
        title: "🍀 20 Soles en el Pantalón",
        description: "Revisaste el bolsillo de tu casaca que no usabas desde el invierno pasado y encontraste un billete de S/. 20 arrugado. ¡Suerte! Dinero +S/. 20.",
        emoji: "💵",
        minAge: 8,
        maxAge: 95,
        resolve: (p) => { p.money = Math.min(1000000, p.money + 20); p.happiness = Math.min(100, p.happiness + 10); p.luck = Math.min(100, p.luck + 5); }
    },
    {
        title: "🚑 El Dengue del Norte",
        description: "Te picó un mosquito durante tus cortas vacaciones en Piura y contrajiste Dengue. Pasaste una semana con fiebre alta. Salud -20.",
        emoji: "🦟",
        minAge: 4,
        maxAge: 95,
        resolve: (p) => { p.health = Math.max(0, p.health - 20); p.stress = Math.min(100, p.stress + 15); }
    },
    {
        title: "🎂 Pollito de Cumpleaños",
        description: "Tu familia te sorprendió con una torta helada y un pollo a la brasa para celebrar tu cumpleaños. Felicidad +20, Contactos +5.",
        emoji: "🍗",
        minAge: 0,
        maxAge: 95,
        resolve: (p) => { p.happiness = Math.min(100, p.happiness + 20); p.contacts = Math.min(100, p.contacts + 5); }
    },
    {
        title: "🚔 Serenazgo Molesto",
        description: "Te quedaste conversando en la puerta de tu casa a medianoche y el serenazgo te alumbró con reflector pidiéndote que ingreses a tu domicilio. Estrés +5.",
        emoji: "🚓",
        minAge: 15,
        maxAge: 95,
        resolve: (p) => { p.stress = Math.min(100, p.stress + 5); }
    },
    {
        title: "🐶 Adopción Callejera",
        description: "Un perrito callejero flaco te siguió hasta tu casa con cara de pena. Le diste comida y se quedó a dormir en tu puerta. Ganas Karma positivo.",
        emoji: "🐕",
        minAge: 5,
        maxAge: 95,
        resolve: (p) => { p.karmaValue += 3; p.happiness = Math.min(100, p.happiness + 10); }
    },
    {
        title: "📦 Trámite de Pasaporte",
        description: "Tuviste que pasar toda la noche haciendo cola afuera de Migraciones para tramitar tu pasaporte bajo el frío limeño. Estrés +20, Educación +2.",
        emoji: "📄",
        minAge: 18,
        maxAge: 95,
        resolve: (p) => { p.stress = Math.min(100, p.stress + 20); p.health = Math.max(0, p.health - 5); }
    },
    {
        title: "⚽ Gol de la Selección",
        description: "Perú metió un gol de chalaca histórico y todo tu vecindario retumbó con gritos de alegría. Felicidad +15.",
        emoji: "⚽",
        minAge: 4,
        maxAge: 95,
        resolve: (p) => { p.happiness = Math.min(100, p.happiness + 15); }
    },
    {
        title: "🍠 Causa Rellena por 8 Días",
        description: "Tu mamá preparó una bandeja gigante de causa rellena de atún y comiste lo mismo de almuerzo y cena durante 8 días seguidos. Felicidad -5, Salud +5.",
        emoji: "🥔",
        minAge: 4,
        maxAge: 95,
        resolve: (p) => { p.happiness = Math.max(0, p.happiness - 5); p.health = Math.min(100, p.health + 5); }
    },
    {
        title: "🍻 Primer Trago en la Esquina",
        description: "Tus amigos de la cuadra abrieron unas cervezas en el pasaje a tus 13 años. Probaste un vaso helado por curiosidad. Felicidad +10, Salud -5, Educación -5.",
        emoji: "🍺",
        minAge: 12,
        maxAge: 17,
        resolve: (p) => { p.happiness = Math.min(100, p.happiness + 10); p.health = Math.max(0, p.health - 5); p.education = Math.max(0, p.education - 5); }
    }
];
