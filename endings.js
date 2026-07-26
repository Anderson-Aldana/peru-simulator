/* ==========================================
   PERÚ SIMULATOR - FINALES DE VIDA (endings.js)
   ========================================== */

window.GAME_ENDINGS = [
    {
        id: "muerte_prematura",
        title: "💀 FIN PREMATURO",
        emoji: "💀",
        stars: 1,
        desc: "Tu salud llegó a 0%. El sistema de salud no llegó a tiempo, o tal vez comiste un cebiche carretillero de S/. 2.50 de noche. Q.E.P.D.",
        condition: (p) => p.health <= 0
    },
    {
        id: "emolientero_multimillonario",
        title: "🌽 VENDEDOR DE EMOLIENTE MULTIMILLONARIO",
        emoji: "🌽",
        stars: 5,
        desc: "¡Final Secreto! Empezaste con una carretilla humilde en una esquina. Tu receta secreta con alfalfa, linaza, uña de gato y el 'toquecito del casero' se volvió viral en TikTok. Hoy tienes una franquicia internacional, 20 locales y exportas emoliente en polvo a Dubai. Eres el rey indiscutible de las mañanas frías.",
        condition: (p) => p.job === "Emolientero Magnate" && p.money >= 1000000
    },
    {
        id: "leyenda_peruana",
        title: "👑 LEYENDA PERUANA",
        emoji: "👑",
        stars: 5,
        desc: "Viviste una vida ejemplar. Lograste acumular una inmensa fortuna, compraste propiedades en la playa, criaste una hermosa familia y nunca te faltó tu pollito a la brasa los domingos. La SUNAT te respeta, y tu nombre se pronuncia con admiración en las pichangas de tu barrio.",
        condition: (p) => p.age >= 80 && p.money >= 2000000 && p.happiness >= 80
    },
    {
        id: "politico_congreso",
        title: "🏛️ OTORONGO DEL CONGRESO",
        emoji: "🏛️",
        stars: 4,
        desc: "Usaste tu 95% de contactos y tu karma caótico/malvado para postular al Congreso. No presentaste ningún proyecto de ley relevante, pero aprobaste el 'Día Nacional del Suspiro a la Limeña de Lúcuma'. Cobras tu sueldo, tus gastos de representación, tus bonos navideños y tienes inmunidad. Eres indestructible.",
        condition: (p) => p.contacts >= 85 && p.karma === "Caótico" && p.money >= 200000
    },
    {
        id: "programador_remoto",
        title: "💻 PROGRAMADOR REMOTO GLOBAL",
        emoji: "💻",
        stars: 5,
        desc: "Estudiaste sistemas y lograste evadir el tráfico de Javier Prado trabajando desde tu cama para una startup de Silicon Valley. Ganas en dólares, gastas en soles, tu setup tiene más luces RGB que una combi de la Vía Expresa y tu única interacción humana es con el repartidor de Rappi. El sueño peruano cumplido.",
        condition: (p) => p.job === "Programador Senior" && p.money >= 400000
    },
    {
        id: "rey_yape",
        title: "💸 EL REY DEL YAPE",
        emoji: "💸",
        stars: 3,
        desc: "Te convertiste en un experto en decir 'Ya te yapeo saliendo'. Jamás llevaste efectivo ni pagaste la cuenta a tiempo. Creaste pantallas falsas de transferencias e hiciste del 'pago mañana' tu religión. Eres rico, pero nadie te invita a las reuniones porque saben que 'se te va a ir la señal' al momento de pagar.",
        condition: (p) => p.karma === "Caótico" && p.money >= 30000 && p.happiness >= 70 && p.assets.includes("iPhone Bamba")
    },
    {
        id: "endeudado_profesional",
        title: "📉 ENDEUDADO PROFESIONAL",
        emoji: "📉",
        stars: 1,
        desc: "Aceptaste 5 tarjetas de crédito de diferentes bancos, pediste un préstamo para viajar a Cancún y otro para comprar zapatillas de marca. Ahora te llaman de 14 números diferentes desde las 7:00 a.m. Eres miembro honorario del Infocorp y tu casa está a nombre de tu perro para evitar embargos.",
        condition: (p) => p.money <= -30000
    },
    {
        id: "fuga_cerebros",
        title: "✈️ FUGA DE CEREBROS EXTRANJERO",
        emoji: "✈️",
        stars: 4,
        desc: "Decidiste comprar un pasaje de ida al extranjero. Ahora vives en España o Alemania. Ganas bien y tienes estabilidad, pero lloras cada vez que ves una foto de un ají de gallina y sufres pagando 15 euros por un limón medio seco en el supermercado europeo. Extrañas el caos patrio.",
        condition: (p) => p.assets.includes("Residencia en el Extranjero") || (p.age >= 60 && p.education >= 80 && p.money >= 300000 && p.happiness < 50)
    },
    {
        id: "empresario_exitoso",
        title: "🏬 EMPRESARIO DE GAMARRA",
        emoji: "🏬",
        stars: 4,
        desc: "Comenzaste vendiendo polos en una mochila y terminaste siendo dueño de una galería de 5 pisos en el corazón de Gamarra. Sobreviviste a la SUNAT, a las campañas navideñas caóticas y al contrabando. Ahora diseñas jeans con marcas raras que visten a media Lima.",
        condition: (p) => p.job === "Dueño de Negocio" && p.money >= 500000
    },
    {
        id: "proximo_ano_ahorro",
        title: "😅 EL REY DEL 'EL PRÓXIMO AÑO AHORRO'",
        emoji: "😅",
        stars: 2,
        desc: "Llegaste a la vejez con S/. 150 en tu cuenta de ahorros. Viviste el día a día comprando combos de hamburguesas, entradas para conciertos a revendedores y ropa en oferta que nunca usaste. Jubilado, pero con muchas anécdotas divertidas y sin remordimientos. 'La plata va y viene, el colágeno no', decías.",
        condition: (p) => p.age >= 70 && p.money < 5000 && p.happiness >= 65
    },
    {
        id: "tio_piolines",
        title: "👵 EL REY DE LOS PIOLINES Y WHATSAPP",
        emoji: "👵",
        stars: 2,
        desc: "Tu vida social se limitó a reenviar imágenes de Piolín con frases como 'Buenos días familia, que Dios los bendiga'. Te convertiste en el administrador oficial del grupo de la familia. Tienes 483 chats sin leer y tu galería está llena de fotos de tazas de café virtuales.",
        condition: (p) => p.age >= 65 && p.socialLogCount >= 15 && p.happiness >= 60
    },
    {
        id: "bodeguero_vip",
        title: "🏪 BODEGUERO DE LA ESQUINA",
        emoji: "🏪",
        stars: 3,
        desc: "Dueño de la bodega más surtida del vecindario. Conoces todos los chismes de la cuadra, dominas el arte de redondear el vuelto con caramelos de limón y tu mirada intimida a cualquiera que intente pedir fiado. Tu bodega es el centro financiero y social del barrio.",
        condition: (p) => p.job === "Dueño de Bodega" && p.money >= 100000
    },
    {
        id: "sobreviviente_metropolitano",
        title: "🚌 SOBREVIVIENTE DEL TRANSPORTE",
        emoji: "🚌",
        stars: 2,
        desc: "Hiciste del Metropolitano y del Chosicano tu segundo hogar. Tus costillas son de acero templado tras años de empujones en hora punta. Conoces la ruta exacta de memoria, sabes qué cobradores te van a cobrar pasaje escolar y puedes dormir parado en una combi que viaja a 100 km/h.",
        condition: (p) => p.age >= 65 && p.stress >= 75 && p.money < 80000
    },
    {
        id: "rey_pichangas",
        title: "⚽ LEYENDA DE LA PICHANGA",
        emoji: "⚽",
        stars: 3,
        desc: "Tus rodillas están destruidas por jugar en loza deportiva de concreto sin zapatillas adecuadas. Pero ganaste 12 trofeos de latón de la liga distrital, te consagraste como el goleador del barrio y el tercer tiempo de cervezas heladas con los amigos fue tu verdadera jubilación. ¡Salud!",
        condition: (p) => p.age >= 60 && p.happiness >= 75 && p.contacts >= 60
    },
    {
        id: "eterno_estudiante",
        title: "🎓 EL ETERNO ESTUDIANTE",
        emoji: "🎓",
        stars: 2,
        desc: "Tienes tres carreras incompletas, dos maestrías en trámite y cuatro diplomados online. Tu cerebro está lleno de teoría cuántica e historia del derecho romano, pero tu billetera está vacía. Vives de becas y de lo que te prestan tus papás mientras decides qué hacer cuando seas grande.",
        condition: (p) => p.age >= 45 && p.education >= 90 && p.money < 10000
    },
    {
        id: "taxista_chacalon",
        title: "🚕 TAXISTA COMPADRE",
        emoji: "🚕",
        stars: 3,
        desc: "Compraste tu carro y decidiste 'hacer taxi' para ser tu propio jefe. Recorriste cada rincón de la ciudad escuchando Chacalón o cumbia norteña. Conoces los atajos de todos los cerros, has conversado con ministros, delincuentes y chamanes en el asiento de atrás, y tienes una opinión formada sobre absolutamente todo.",
        condition: (p) => p.job === "Taxista" && p.money >= 20000
    },
    {
        id: "chaman_mistico",
        title: "🔮 CHAMÁN DE PACASMAYO",
        emoji: "🔮",
        stars: 3,
        desc: "Te dedicaste al rubro místico. Haces lecturas de cartas, amarres de amor eternos en el norte y vendes agua de azahar embotellada. Tu consultorio huele a ruda y humo de cigarro. No tienes título profesional, pero tus clientes ricos te pagan fortunas para que les digas qué números jugar en la Tinka.",
        condition: (p) => p.job === "Curandero / Místico" && p.money >= 80000
    },
    {
        id: "jubilado_playero",
        title: "🌊 JUBILADO EN MÁNCORA",
        emoji: "🌊",
        stars: 4,
        desc: "Ahorraste lo suficiente y vendiste tu depa ruidoso en Lima. Te mudaste a una casita cerca de la playa en el norte del país. Pasas tus días tomando agua de coco, comiendo cebiche fresco del día y viendo el atardecer sin preocuparte por el tráfico ni por el despertador.",
        condition: (p) => p.age >= 65 && p.money >= 200000 && p.happiness >= 75 && p.health >= 60
    },
    {
        id: "casero_brasero",
        title: "🍗 EL CASERO DEL AÑO",
        emoji: "🍗",
        stars: 3,
        desc: "Gasta lo que tengas, pero el pollito a la brasa con papas crocantes y abundante ají casero nunca faltó en tu mesa. Tu cuerpo está compuesto en un 40% de mayonesa y papas fritas. Tienes colesterol elevado, pero una sonrisa imborrable en el rostro.",
        condition: (p) => p.happiness >= 80 && p.health < 40 && p.money >= 5000
    },
    {
        id: "final_estandar",
        title: "🏢 PERUANO DE PIE",
        emoji: "🏢",
        stars: 3,
        desc: "Viviste una vida promedio en el Perú. Trabajaste duro, pagaste tus impuestos (cuando te tocaba), renegaste con la política, celebraste los goles de la selección y disfrutaste de tu familia. No saliste en los periódicos ni te volviste millonario, pero sobreviviste con dignidad y humor.",
        condition: (p) => true // Final por defecto si no cumple ningún otro
    }
];

// Función para determinar el final adecuado según las estadísticas del jugador
window.determineEnding = function(player) {
    // Recorrer los finales en orden. El primero cuya condición se cumpla es el que se retorna.
    // Colocamos los finales específicos al inicio y el estándar al final.
    for (let ending of window.GAME_ENDINGS) {
        if (ending.condition(player)) {
            return ending;
        }
    }
    return window.GAME_ENDINGS[window.GAME_ENDINGS.length - 1]; // Retorna el final estándar por defecto
};
