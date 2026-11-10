import { CaseFile } from '../types';

export const CASE_FILES: CaseFile[] = [
  {
    id: 'case-001',
    caseNumber: 'CASE 001',
    title: 'The Falling Object',
    mystery: 'Mengapa bola besi berat dan bulu burung ringan dapat mencapai lantai bersamaan saat dijatuhkan dari puncak menara vakum?',
    synopsis: 'Sebuah laboratorium forensik menerima rekaman kontroversial: bola boling 5 kg dan sehelai bulu burung 2 gram tampak menyentuh lantai secara presisi pada detik yang sama di dalam tabung raksasa tanpa udara. Orang awam menduga rekaman itu manipulasi CGI.',
    category: 'Mekanika',
    concepts: ['Gerak Jatuh Bebas (GJB)', 'Percepatan Gravitasi (g)', 'Hambatan Udara (Drag Force)', 'Kecepatan Terminal'],
    difficulty: 'Pemula',
    xpReward: 350,
    imageUrl: '/src/assets/images/case_falling_object_1794295503599.jpg',
    simulationType: 'free-fall',
    observe: {
      incidentReport: 'TKP: Laboratorium Uji Gravitasi Florence. Sensor laser merekam dua objek (bola baja 5 kg dan bulu angsa 0.005 kg) dilepaskan dari ketinggian 20 meter pada saat bersamaan ($t_0 = 0.00\\text{ s}$). Di udara terbuka, bola jatuh dalam 2.02 detik sedangkan bulu melayang lambat selama 6.4 detik. Namun ketika pompa vakum diaktifkan hingga tekanan 0.01 kPa, keduanya menyentuh sensor dasar tepat di detik 2.02!',
      witnessStatement: '"Saya melihat dengan mata kepala sendiri! Mustahil bulu seringan itu bisa secepat bola baja pejal. Apakah gravitasi memilih-milih objek atau rekaman sensor telah diretas?" — Dr. Danu, Saksi Teknis.',
      sceneVisualDescription: 'Tabung silinder kaca transparan setinggi 20 meter dengan sistem pompa vakum bertekanan tinggi. Di atasnya terdapat pelepas elektromagnetik ganda untuk bola baja dan bulu. Di bawahnya terdapat pelat sensor piezoelektrik presisi milidetik.',
      keyObservations: [
        'Di udara terbuka, bentuk dan luas permukaan bulu yang besar menghasilkan hambatan udara signifikan.',
        'Di ruang hampa udara (vakum), hambatan udara ($F_{drag}$) bernilai nol.',
        'Waktu tempuh jatuh bebas tanpa hambatan udara hanya bergantung pada ketinggian ($h$) dan percepatan gravitasi ($g$).'
      ],
      guidingQuestions: [
        'Apakah percepatan gravitasi bumi menarik benda yang lebih berat dengan gaya tarik yang lebih besar?',
        'Jika gaya gravitasi pada bola besi jauh lebih besar ($W = m \\cdot g$), mengapa percepatannya sama persis dengan bulu ($a = g$)?'
      ]
    },
    evidenceList: [
      {
        id: 'ev-01-1',
        name: 'Sensor Barometer Tabung',
        location: 'Dinding Tabung Uji',
        description: 'Menunjukkan tekanan udara sebesar 0.02 atm (vakum parsial tinggi) saat uji coba kedua dilakukan.',
        scientificRelevance: 'Membuktikan partikel udara dikeluarkan sehingga gaya gesek aerodinamika ($F_{drag} = \\frac{1}{2} C_d \\rho A v^2$) mendekati nol.',
        dataValue: '0.02 atm / ~2 kPa',
        iconName: 'Gauge'
      },
      {
        id: 'ev-01-2',
        name: 'Catatan Timer Piezoelektrik',
        location: 'Lantai Dasar Tabung',
        description: 'Stempel waktu kontak dasar: Bola Baja ($t = 2.02\\text{ s}$), Bulu Burung ($t = 2.02\\text{ s}$) pada kondisi vakum.',
        scientificRelevance: 'Menghasilkan nilai percepatan empiris $g = \\frac{2h}{t^2} = \\frac{2 \\times 20}{2.02^2} \\approx 9.80\\text{ m/s}^2$ untuk kedua benda.',
        dataValue: 't1 = 2.02 s, t2 = 2.02 s',
        iconName: 'Timer'
      },
      {
        id: 'ev-01-3',
        name: 'Timbangan Massa Presisi',
        location: 'Meja Kalibrasi',
        description: 'Massa bola baja terukur $5.000\\text{ kg}$ sedangkan massa bulu terukur $0.003\\text{ kg}$ (perbandingan massa 1666 : 1).',
        scientificRelevance: 'Massa benda membatalkan dirinya sendiri dalam hukum kedua Newton untuk jatuh bebas: $a = \\frac{\\Sigma F}{m} = \\frac{m \\cdot g}{m} = g$.',
        dataValue: 'm1 = 5.0 kg vs m2 = 0.003 kg',
        iconName: 'Scale'
      }
    ],
    hypotheses: [
      {
        id: 'hyp-01-a',
        statement: 'Benda bermassa lebih besar memiliki inersia yang lebih besar sehingga butuh gaya gravitasi yang sebanding lebih besar untuk menghasilkan percepatan jatuh yang sama persis.',
        isScientificallySound: true,
        scientificFeedback: 'Hipotesis Tepat! Menurut Hukum II Newton, $F = m \\cdot a$, sementara gaya gravitasi $F = m \\cdot g$. Maka $a = \\frac{m \\cdot g}{m} = g$. Inersia benda menyeimbangkan gaya gravitasi yang diterimanya.'
      },
      {
        id: 'hyp-01-b',
        statement: 'Gravitasi bumi memiliki kekuatan konstan yang hanya menarik benda ringan jika tidak ada udara yang menahannya ke atas.',
        isScientificallySound: false,
        scientificFeedback: 'Kurang tepat secara sains. Gaya gravitasi tidak konstan untuk setiap benda melainkan sebanding dengan massa ($W = m \\cdot g$), namun percepatannya yang konstan ($g$).'
      },
      {
        id: 'hyp-01-c',
        statement: 'Kedua benda jatuh bersamaan semata-mata karena ketinggian 20 meter terlalu pendek sehingga perbedaannya belum sempat terjadi.',
        isScientificallySound: false,
        scientificFeedback: 'Salah. Di dalam ruang hampa, berapapun ketinggiannya (asalkan $g$ seragam), keduanya akan selalu jatuh dengan percepatan yang identik.'
      }
    ],
    experimentPreset: {
      title: 'Uji Tabung Jatuh Bebas Galileo',
      goal: 'Bandingkan waktu jatuh bola vs bulu pada kondisi Udara Terbuka vs Ruang Hampa (Vakum).',
      defaultVariables: {
        height: 20,
        gravity: 9.8,
        airResistance: false,
        massObject1: 5.0,
        massObject2: 0.1
      },
      instructions: [
        '1. Setel sakelar udara ke mode "Hampa Udara (Vakum)".',
        '2. Lepaskan kedua objek dari ketinggian 20 meter dan amati grafik ketinggian vs waktu.',
        '3. Beralih ke mode "Udara Terbuka (Atmosfer)" dan ulangi uji coba.',
        '4. Catat selisih waktu tiba dan kecepatan akhir di notebook investigasi.'
      ]
    },
    analysisQuestions: [
      {
        id: 'q-01-1',
        question: 'Sebuah benda bermassa 2 kg dan sebuah batu bermassa 10 kg dijatuhkan bebas bersamaan dari ketinggian 45 m di ruang hampa ($g = 10\\text{ m/s}^2$). Berapakah waktu yang dibutuhkan kedua benda untuk tiba di tanah?',
        options: ['Batu 10 kg tiba dalam 3 s, benda 2 kg tiba dalam 6 s', 'Kedua benda tiba bersamaan dalam waktu 3 detik', 'Kedua benda tiba bersamaan dalam waktu 4.5 detik', 'Batu 10 kg tiba dalam 1.5 detik'],
        correctOptionIndex: 1,
        explanation: 'Gunakan rumus GJB: $h = \\frac{1}{2} g t^2 \\implies 45 = \\frac{1}{2}(10) t^2 \\implies t^2 = 9 \\implies t = 3\\text{ detik}$. Karena tidak bergantung massa, keduanya tiba serentak di $t = 3\\text{ s}$.',
        formulaTip: 'h = 0.5 * g * t^2'
      },
      {
        id: 'q-01-2',
        question: 'Faktor fisis apa yang sesungguhnya membuat bulu jatuh sangat lambat ketika dijatuhkan di udara terbuka sehari-hari?',
        options: ['Karena massa bulu terlalu kecil untuk ditarik gravitasi', 'Karena hambatan udara menghasilkan gaya ke atas yang cepat mengimbangi berat bulu (kecepatan terminal rendah)', 'Karena kerapatan bulu menciptakan medan tolak magnetik', 'Karena percepatan gravitasi untuk benda ringan lebih kecil dari 9.8 m/s²'],
        correctOptionIndex: 1,
        explanation: 'Luas permukaan bulu yang relatif besar terhadap massanya menyebabkan gaya hambat udara ($F_d$) cepat menyamai gaya berat ($W = mg$), sehingga resultan gaya menjadi nol dan bulu mencapai kecepatan terminal yang sangat rendah.',
        formulaTip: 'F_net = W - F_drag = 0 (Kecepatan Terminal)'
      }
    ],
    finalDeductions: [
      {
        id: 'ded-01-1',
        verdict: 'Rekaman Asli & Terbukti Ilmiah: Di ruang hampa, percepatan gravitasi tidak bergantung pada massa benda.',
        explanation: 'Berdasarkan Hukum II Newton ($a = \\Sigma F / m$) dan Hukum Gravitasi ($W = m \\cdot g$), percepatan jatuh bebas $a = (m \\cdot g) / m = g \\approx 9.8\\text{ m/s}^2$. Perbedaan waktu jatuh pada kehidupan sehari-hari bukan disebabkan oleh massa, melainkan oleh gaya gesek aerodinamika (hambatan udara). Pada tabung vakum, hambatan udara ditiadakan sehingga bola dan bulu jatuh bersamaan.',
        isCorrect: true,
        physicsLaw: 'Hukum II Newton & Kinematika Gerak Jatuh Bebas'
      },
      {
        id: 'ded-01-2',
        verdict: 'Rekaman Palsu: Hukum alam menyatakan benda bermassa lebih besar pasti memiliki percepatan gravitasi lebih besar.',
        explanation: 'Pernyataan ini melanggar prinsip ekuivalensi Galileo dan mekanika klasik Newton.',
        isCorrect: false,
        physicsLaw: 'Miskonsepsi Aristotelian'
      }
    ]
  },
  {
    id: 'case-002',
    caseNumber: 'CASE 002',
    title: 'The Missing Energy',
    mystery: 'Ke mana hilangnya energi mekanik kereta uji ketika meluncur menuruni lintasan bidang miring?',
    synopsis: 'Sebuah prototipe kereta luncur darurat memiliki energi potensial 500 Joule di puncak bukit luncur. Namun sensor kecepatan di dasar bukit hanya mencatat energi kinetik sebesar 380 Joule. Apakah ada 120 Joule energi yang "lenyap dari alam semesta"?',
    category: 'Energi',
    concepts: ['Energi Kinetik ($E_k$)', 'Energi Potensial ($E_p$)', 'Hukum Kekekalan Energi Mekanik', 'Usaha Gaya Gesek ($W_f$)', 'Energi Termal (Kalor)'],
    difficulty: 'Menengah',
    xpReward: 420,
    imageUrl: '/src/assets/images/case_missing_energy_1794295504497.jpg',
    simulationType: 'energy-plane',
    observe: {
      incidentReport: 'TKP: Fasilitas Uji Luncur Roller R&D. Kereta uji $m = 10\\text{ kg}$ dilepas dari ketinggian $h = 5.0\\text{ m}$ ($E_{p} = mgh = 10 \\times 9.8 \\times 5 = 490\\text{ J}$). Di dasar lintasan miring sepanjang $s = 10\\text{ m}$, sensor inframerah mengukur kecepatan kereta $v = 8.5\\text{ m/s}$. Energi kinetik terukur hanya $E_k = \\frac{1}{2}mv^2 = \\frac{1}{2}(10)(8.5)^2 = 361.25\\text{ J}$. Terdapat selisih energi ~128.75 J.',
      witnessStatement: '"Hukum kekekalan energi menyatakan energi tidak dapat dimusnahkan. Namun layar komputer kami menunjukkan energi berkurang drastis setelah menuruni bidang miring! Apakah ada kebocoran medan gaya?" — Reza, Teknisi Riset.',
      sceneVisualDescription: 'Lintasan miring baja bergradien sudut $30^\\circ$ dengan fotogate di titik awal dan titik akhir. Kamera termal FLIR terpasang di atas rel mengawasi seluruh lintasan.',
      keyObservations: [
        'Lintasan rel terbuat dari logam dengan koefisien gesek tertentu $(\\mu_k > 0)$.',
        'Kamera termal menunjukkan jejak panas (suhu meningkat 3.2°C) di sepanjang rel yang baru saja dilalui kereta.',
        'Terdengar bunyi gemuruh gesekan roda kereta dengan rel logam.'
      ],
      guidingQuestions: [
        'Apakah energi mekanik selalu kekal pada sistem yang memiliki gaya non-konservatif seperti gesekan?',
        'Ke bentuk energi apa 128.75 Joule energi mekanik yang "hilang" tersebut bermutasi?'
      ]
    },
    evidenceList: [
      {
        id: 'ev-02-1',
        name: 'Citra Termal FLIR Rel',
        location: 'Permukaan Bidang Miring',
        description: 'Peningkatan temperatur rel dan bantalan roda sebesar $\\Delta T = +3.2^\\circ\\text{C}$ sesaat setelah kereta lewat.',
        scientificRelevance: 'Menjadi bukti langsung bahwa energi mekanik diubah menjadi energi dalam / energi termal (panas) akibat kerja gaya gesek ($W_f$).',
        dataValue: 'ΔT = +3.2 °C',
        iconName: 'Flame'
      },
      {
        id: 'ev-02-2',
        name: 'Koefisien Gesek Lintasan',
        location: 'Sertifikasi Material Rel',
        description: 'Nilai koefisien gesek kinetik rel terukur $\\mu_k = 0.15$. Dengan sudut $30^\\circ$, gaya normal $N = mg \\cos 30^\\circ$.',
        scientificRelevance: 'Gaya gesek $f_k = \\mu_k N = 0.15 \\times 10 \\times 9.8 \\times 0.866 \\approx 12.73\\text{ N}$. Usaha gesekan sepanjang 10 m: $W_f = f_k \\cdot s \\approx 127.3\\text{ J}$!',
        dataValue: 'μk = 0.15, s = 10 m',
        iconName: 'FileSpreadsheet'
      },
      {
        id: 'ev-02-3',
        name: 'Mikrofon Akustik Lab',
        location: 'Samping Lintasan',
        description: 'Tingkat kebisingan audio mencapai 78 dB frekuensi 400-1200 Hz saat kereta meluncur.',
        scientificRelevance: 'Sebagian kecil energi mekanik juga dikonversi menjadi energi gelombang bunyi akustik yang merambat ke udara.',
        dataValue: '78 dB SPL',
        iconName: 'Volume2'
      }
    ],
    hypotheses: [
      {
        id: 'hyp-02-a',
        statement: 'Energi mekanik tidak hilang dari alam, melainkan diubah menjadi energi termal (panas) dan bunyi akibat usaha yang dilakukan oleh gaya gesek non-konservatif antara roda dan rel.',
        isScientificallySound: true,
        scientificFeedback: 'Analisis Sangat Akurat! Hukum kekekalan energi total tetap berlaku: $E_{m1} = E_{m2} + W_{gesek} + E_{bunyi}$. Energi mekanik berkurang karena ada kerja gaya non-konservatif.'
      },
      {
        id: 'hyp-02-b',
        statement: 'Energi mekanik menghilang karena kereta melaju terlalu cepat melampaui batas elastisitas medan gravitasi lokal.',
        isScientificallySound: false,
        scientificFeedback: 'Salah. Gravitasi bumi tidak memiliki batasan elastisitas lokal semacam itu; energi total selalu kekal.'
      }
    ],
    experimentPreset: {
      title: 'Simulasi Konservasi Energi Bidang Miring',
      goal: 'Bandingkan energi di puncak dan dasar bidang miring saat koefisien gesek $\\mu = 0$ (licin sempurna) vs $\\mu > 0$ (kasar).',
      defaultVariables: {
        mass: 10,
        height: 5,
        frictionCoeff: 0.15,
        inclineAngle: 30
      },
      instructions: [
        '1. Atur koefisien gesek $\\mu = 0$ (bidang licin sempurna), lalu lepaskan kereta.',
        '2. Amati grafik batang $E_p, E_k,$ dan $E_m$. Perhatikan apakah $E_m$ tetap konstan.',
        '3. Naikkan koefisien gesek ke $\\mu = 0.15$ dan amati kemunculan batang kerja gesekan $W_{gesek}$ (termal).',
        '4. Periksa apakah $E_p(\\text{awal}) = E_k(\\text{akhir}) + W_{gesek}$.'
      ]
    },
    analysisQuestions: [
      {
        id: 'q-02-1',
        question: 'Sebuah balok bermassa 4 kg meluncur dari puncak bidang miring licin setinggi 3.2 m ($g = 10\\text{ m/s}^2$). Berapakah kecepatan balok di dasar bidang miring?',
        options: ['6.4 m/s', '8.0 m/s', '10.2 m/s', '16.0 m/s'],
        correctOptionIndex: 1,
        explanation: 'Karena bidang licin, $E_{p1} = E_{k2} \\implies mgh = \\frac{1}{2}mv^2 \\implies v = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 3.2} = \\sqrt{64} = 8.0\\text{ m/s}$.',
        formulaTip: 'v = sqrt(2 * g * h)'
      },
      {
        id: 'q-02-2',
        question: 'Jika pada percobaan balok di atas bidang ternyata kasar dan kecepatan di dasar hanya 6 m/s, berapakah besar usaha gaya gesek yang mengubah energi mekanik menjadi kalor?',
        options: ['56 Joule', '72 Joule', '128 Joule', '0 Joule'],
        correctOptionIndex: 0,
        explanation: '$E_p(\\text{awal}) = 4 \\times 10 \\times 3.2 = 128\\text{ J}$. $E_k(\\text{akhir}) = \\frac{1}{2}(4)(6^2) = 72\\text{ J}$. Usaha gesek $W_f = E_{p1} - E_{k2} = 128 - 72 = 56\\text{ Joule}$.',
        formulaTip: 'W_f = Ep_awal - Ek_akhir'
      }
    ],
    finalDeductions: [
      {
        id: 'ded-02-1',
        verdict: 'Kasus Terpecahkan: Energi 128.75 J tidak lenyap melainkan bertransformasi menjadi energi termal (panas) dan bunyi akibat gesekan rel.',
        explanation: 'Sesuai Teorema Usaha-Energi untuk gaya non-konservatif, $\\Delta E_m = -W_f$. Panas yang terdeteksi pada kamera FLIR dan nilai perhitungan $W_f = f_k \\cdot s$ cocok sempurna dengan selisih energi mekanik.',
        isCorrect: true,
        physicsLaw: 'Hukum Termodinamika I & Teorema Usaha-Energi'
      },
      {
        id: 'ded-02-2',
        verdict: 'Kegagalan Sensor: Hukum fisika rusak di lintasan miring dan energi lenyap ke dimensi lain.',
        explanation: 'Pernyataan tidak ilmiah dan bertentangan dengan hukum konservasi energi universal.',
        isCorrect: false,
        physicsLaw: 'Miskonsepsi Fatal'
      }
    ]
  },
  {
    id: 'case-003',
    caseNumber: 'CASE 003',
    title: 'The Invisible Force',
    mystery: 'Mengapa sebuah balok kargo tetap meluncur di lantai es meskipun mesin pendorongnya telah lama mati?',
    synopsis: 'Sebuah kargo laboratorium di stasiun kutub tergelincir di atas danau es licin. Saksi heran mengapa kargo terus melaju lurus tanpa berhenti meskipun motor pendorong sudah dimatikan 2 menit sebelumnya. Apakah ada "kekuatan gaib" yang mendorong kargo tersebut?',
    category: 'Dinamika',
    concepts: ['Hukum I Newton (Inersia)', 'Hukum II Newton (F = m a)', 'Gaya Gesek Kinetik & Statis', 'Resultan Gaya Nol'],
    difficulty: 'Pemula',
    xpReward: 380,
    imageUrl: '/src/assets/images/case_ice_inertia_1794298051087.jpg',
    simulationType: 'newton-force',
    observe: {
      incidentReport: 'TKP: Lapangan Uji Es Stasiun Antarktika. Balok kargo 200 kg didorong oleh roket dorong mini selama 5 detik hingga mencapai kecepatan $6\\text{ m/s}$. Setelah roket mati ($F_{dorong} = 0\\text{ N}$), balok terus meluncur sejauh 300 meter dengan laju yang nyaris tidak berkurang sama sekali.',
      witnessStatement: '"Menurut akal sehat saya, benda hanya bisa bergerak jika terus-menerus didorong. Jika pendorong mati, benda harusnya langsung diam seketika! Kenapa dia tetap meluncur kencang?" — Sersan Bagus, Penjaga Pos.',
      sceneVisualDescription: 'Hamparan es danau alami yang dipoles hingga sangat licin ($\\\\mu_k \\approx 0.005$). Garis penanda meteran di samping lintasan es.',
      keyObservations: [
        'Ketika roket pendorong mati, resultan gaya horizontal pada arah gerak mendekati nol (karena gesekan es sangat kecil).',
        'Benda mempertahankan keadaan geraknya (kecepatan konstan) sesuai sifat kelembaman.',
        'Gaya diperlukan untuk MENGUBAH gerak (menghasilkan percepatan), bukan untuk MEMPERTAHANKAN gerak!'
      ],
      guidingQuestions: [
        'Apakah gaya luar netto diperlukan agar suatu benda tetap bergerak lurus beraturan?',
        'Apa yang membedakan pandangan Aristoteles kuno dengan Hukum I Newton tentang inersia?'
      ]
    },
    evidenceList: [
      {
        id: 'ev-03-1',
        name: 'Data Telemetri Roket Pendorong',
        location: 'Modul Kontrol Kargo',
        description: 'Sensor arus menunjukkan daya propulsi roket benar-benar terputus pada detik ke-5.',
        scientificRelevance: 'Memvalidasi bahwa tidak ada gaya dorong mesin yang bekerja setelah $t = 5\\text{ s}$ ($F_{ext} = 0$).',
        dataValue: 'F_propulsi = 0 N (t > 5 s)',
        iconName: 'Zap'
      },
      {
        id: 'ev-03-2',
        name: 'Uji Tribologi Permukaan Es',
        location: 'Permukaan Danau Es',
        description: 'Nilai koefisien gesekan es basah terukur $\\mu_k = 0.004$.',
        scientificRelevance: 'Perlambatan kargo sangat kecil: $a = -\\mu_k \\cdot g = -0.004 \\times 9.8 = -0.0392\\text{ m/s}^2$. Butuh jarak $> 450\\text{ m}$ untuk berhenti total!',
        dataValue: 'μk = 0.004',
        iconName: 'Sparkles'
      }
    ],
    hypotheses: [
      {
        id: 'hyp-03-a',
        statement: 'Berdasarkan Hukum I Newton (Kelembaman), benda yang sedang bergerak akan terus bergerak lurus dengan kecepatan konstan jika tidak ada resultan gaya luar yang menghentikannya.',
        isScientificallySound: true,
        scientificFeedback: 'Tepat Sekali! Gaya tidak dibutuhkan untuk mempertahankan gerak. Hanya gaya gesek yang pada akhirnya akan memperlambat kargo tersebut secara bertahap.'
      },
      {
        id: 'hyp-03-b',
        statement: 'Kargo terus bergerak karena roket telah "menyimpan gaya" di dalam material kargo yang kemudian dikeluarkan perlahan.',
        isScientificallySound: false,
        scientificFeedback: 'Miskonsepsi Umum! Gaya adalah interaksi antar-benda, bukan substansi fluida yang dapat "disimpan" di dalam benda.'
      }
    ],
    experimentPreset: {
      title: 'Uji Hukum Gerak Newton & Gesekan',
      goal: 'Amati gerak balok ketika gaya dorong dihentikan pada variasi koefisien gesekan (es vs aspal).',
      defaultVariables: {
        appliedForce: 100,
        mass: 20,
        frictionCoeff: 0.01,
        initialVelocity: 5
      },
      instructions: [
        '1. Berikan gaya dorong $F = 100\\text{ N}$ lalu nolkan gaya dorong ($F = 0$).',
        '2. Bandingkan ketika gesekan $\\mu = 0$ (ruang angkasa/es super licin) vs $\\mu = 0.4$ (lantai karet kasar).',
        '3. Perhatikan grafik $v$ terhadap $t$. Pada $\\mu = 0$, grafik berupa garis horizontal datar ($v = \\text{konstan}$).'
      ]
    },
    analysisQuestions: [
      {
        id: 'q-03-1',
        question: 'Sebuah wahana antariksa bermassa 500 kg bergerak di ruang hampa antar bintang dengan kecepatan 10.000 m/s. Jika semua mesin roket dimatikan dan tidak ada gravitasi terdekat, berapa gaya yang dibutuhkan agar wahana terus melaju dengan kecepatan tersebut?',
        options: ['500 Newton', '5.000.000 Newton', '0 Newton', '9.800 Newton'],
        correctOptionIndex: 2,
        explanation: 'Sesuai Hukum I Newton ($\\\\Sigma F = 0$), benda yang sudah bergerak akan terus bergerak lurus beraturan tanpa memerlukan gaya dorong apapun!',
        formulaTip: 'Sigma F = 0 -> v = konstan'
      }
    ],
    finalDeductions: [
      {
        id: 'ded-03-1',
        verdict: 'Kasus Terpecahkan: Tidak ada kekuatan gaib; ini adalah manifestasi murni Hukum Inersia (Hukum I Newton).',
        explanation: 'Ketika gaya dorong mesin mati dan gesekan es sangat mendekati nol, resultan gaya $\\Sigma F \\approx 0$. Benda memiliki kelembaman untuk mempertahankan status geraknya pada kecepatan $6\\text{ m/s}$.',
        isCorrect: true,
        physicsLaw: 'Hukum I Newton (Inersia / Kelembaman)'
      }
    ]
  },
  {
    id: 'case-004',
    caseNumber: 'CASE 004',
    title: 'The Waving Mystery',
    mystery: 'Bagaimana sebuah bebek karet di danau hanya bergerak naik-turun saat gelombang lewat, namun gelombang tersebut mampu mengikis tebing di seberang danau?',
    synopsis: 'Sebuah pelampung sensor di danau observasi mencatat gelombang tsunami mini akibat jatuhnya batu besar. Anehnya, pelampung hanya berosilasi vertikal di tempat yang sama, namun di ujung tebing danau, dinding batu runtuh akibat hantaman energi gelombang raksasa.',
    category: 'Gelombang',
    concepts: ['Gelombang Mekanik', 'Amplitudo & Energi ($E \\propto A^2$)', 'Frekuensi & Periode', 'Panjang Gelombang & Cepat Rambat ($v = \\lambda f$)'],
    difficulty: 'Menengah',
    xpReward: 450,
    imageUrl: '/src/assets/images/case_water_wave_1794298069458.jpg',
    simulationType: 'wave',
    observe: {
      incidentReport: 'TKP: Danau Riset Hidrodinamika. Batu besar dijatuhkan di titik A menciptakan gelombang transversal dengan panjang gelombang $\\lambda = 2\\text{ m}$ dan frekuensi $f = 1.5\\text{ Hz}$. Bebek sensor di titik B berjarak 10 m dari pusat osilasi hanya bergerak naik-turun sejauh $\\pm 0.3\\text{ m}$ tanpa berpindah maju ke titik C. Namun tebing di titik C menerima hantaman berdaya 450 Watt!',
      witnessStatement: '"Jika air danau mengalir membawa batu ke tebing, mengapa bebek kami tidak ikut terbawa ke seberang danau bersama gelombang?" — Gita, Peneliti Limnologi.',
      sceneVisualDescription: 'Simulasi kolam air transparan dengan kisi-kisi partikel air yang ditandai warna fluorescent. Di permukaan air terdapat pelampung dengan pemancar GPS.',
      keyObservations: [
        'Partikel medium (air dan bebek) hanya bergetar di sekitar titik setimbangnya.',
        'Bukan materi medium yang merambat melintasi danau, melainkan ENERGI getaran dan momentum.',
        'Cepat rambat gelombang $v = \\lambda \\cdot f = 2 \\times 1.5 = 3.0\\text{ m/s}$.'
      ],
      guidingQuestions: [
        'Apa definisi fundamental dari gelombang mekanik?',
        'Bagaimana hubungan antara amplitudo gelombang dengan energi yang dihantarkan ke tebing?'
      ]
    },
    evidenceList: [
      {
        id: 'ev-04-1',
        name: 'Log GPS Pelampung Bebek',
        location: 'Tengah Danau',
        description: 'Posisi koordinat horizontal (X, Y) pelampung konstan $\\pm 2\\text{ cm}$, sementara koordinat Z berosilasi sinusoidal dengan periode $T = 0.67\\text{ s}$.',
        scientificRelevance: 'Membuktikan secara empiris bahwa materi air tidak berpindah tempat secara netto.',
        dataValue: 'ΔX = 0, Z = A sin(ωt)',
        iconName: 'Activity'
      },
      {
        id: 'ev-04-2',
        name: 'Sensor Piezo Dinding Tebing',
        location: 'Ujung Danau',
        description: 'Mencatat tekanan impak gelombang sebesar $1200\\text{ N/m}^2$ saat puncak gelombang tiba.',
        scientificRelevance: 'Menunjukkan transfer energi mekanik gelombang ke struktur fisik tebing.',
        dataValue: 'P = 1200 N/m²',
        iconName: 'ShieldAlert'
      }
    ],
    hypotheses: [
      {
        id: 'hyp-04-a',
        statement: 'Gelombang merambatkan energi dan momentum melalui osilasi terkopel antar partikel medium, tanpa memindahkan partikel medium itu sendiri secara keseluruhan.',
        isScientificallySound: true,
        scientificFeedback: 'Sempurna! Inilah hakikat sejati gelombang: usikan yang merambat membawa energi tanpa perpindahan materi secara permanen.'
      }
    ],
    experimentPreset: {
      title: 'Laboratorium Gelombang Transversal',
      goal: 'Amati osilasi partikel medium vs arah rambat gelombang serta pengaruh amplitudo terhadap energi.',
      defaultVariables: {
        amplitude: 0.4,
        frequency: 1.5,
        tension: 10,
        damping: 0.05
      },
      instructions: [
        '1. Jalankan gelombang harmonik dan perhatikan satu partikel berwarna jingga.',
        '2. Perhatikan bahwa partikel hanya bergerak vertikal naik-turun tegak lurus arah rambat gelombang.',
        '3. Naikkan amplitudo dari $0.2\\text{ m}$ ke $0.4\\text{ m}$ dan amati penggandaan energi gelombang ($E \\propto A^2$).'
      ]
    },
    analysisQuestions: [
      {
        id: 'q-04-1',
        question: 'Sebuah gelombang air memiliki frekuensi 4 Hz dan panjang gelombang 0.5 meter. Berapakah cepat rambat gelombang tersebut dan ke mana arah perpindahan partikel air?',
        options: ['2 m/s, partikel bergerak tegak lurus arah rambat', '8 m/s, partikel ikut berpindah bersama gelombang', '2 m/s, partikel bergerak searah rambat', '0.125 m/s, partikel diam tidak bergetar'],
        correctOptionIndex: 0,
        explanation: 'Cepat rambat $v = \\lambda \\cdot f = 0.5 \\times 4 = 2\\text{ m/s}$. Pada gelombang transversal, osilasi partikel tegak lurus arah rambatan.',
        formulaTip: 'v = lambda * f'
      }
    ],
    finalDeductions: [
      {
        id: 'ded-04-1',
        verdict: 'Kasus Terpecahkan: Gelombang adalah transfer energi, bukan perpindahan massa medium.',
        explanation: 'Bebek tetap di tempat karena air hanya berosilasi harmonik vertikal. Energi mekanik dari batu ditransmisikan dari partikel ke partikel tetangga hingga menghantam tebing seberang dengan daya perusak proporsional terhadap kuadrat amplitudo ($E \\propto A^2$).',
        isCorrect: true,
        physicsLaw: 'Prinsip Transmisi Energi Gelombang Mekanik'
      }
    ]
  },
  {
    id: 'case-005',
    caseNumber: 'CASE 005',
    title: 'The Electric Clue',
    mystery: 'Mengapa dua bohlam identik menyala redup saat dipasang berderet (seri), tetapi menyala sangat terang saat dipasang bercabang (paralel)?',
    synopsis: 'Sebuah instalasi lampu darurat di bungker markas mendadak redup drastis setelah seorang teknisi magang mengubah sambungan kabel. Saksi mencurigai baterai 12V telah melemah atau bohlam sengaja ditukar dengan watt rendah.',
    category: 'Kelistrikan',
    concepts: ['Hukum Ohm ($V = I \\cdot R$)', 'Rangkaian Seri vs Paralel', 'Daya Listrik ($P = I^2 R = V^2 / R$)', 'Hambatan Pengganti ($R_s$ vs $R_p$)'],
    difficulty: 'Lanjutan',
    xpReward: 500,
    imageUrl: '/src/assets/images/case_electric_circuit_1794295504710.jpg',
    simulationType: 'circuit',
    observe: {
      incidentReport: 'TKP: Ruang Panel Kelistrikan Bungker. Dua lampu identik dengan spesifikasi $12\\text{V}, 24\\text{W}$ ($R = 6\\,\\Omega$) dihubungkan ke aki $12\\text{V}$. Pada instalasi lama (paralel), kedua lampu menyala benderang. Setelah teknisi menghubungkannya secara seri, kedua lampu menyala redup dan daya total turun menjadi seperempat!',
      witnessStatement: '"Saya tidak menyentuh baterai sama sekali! Baterai masih penuh 12 Volt. Kenapa hanya dengan memindahkan ujung kabel kedua lampu menjadi redup seperti kunang-kunang?" — Joko, Teknisi Magang.',
      sceneVisualDescription: 'Papan rangkaian kayu dengan dua soket lampu pijar, aki 12V bertegangan stabil, amperemeter jarum analog, dan voltmeter digital.',
      keyObservations: [
        'Pada rangkaian seri, hambatan total bertambah ($R_s = R_1 + R_2 = 6 + 6 = 12\\,\\Omega$), sehingga arus total turun menjadi $I = \\frac{12}{12} = 1\\text{ A}$. Tegangan tiap lampu terbagi dua menjadi $6\\text{ V}$.',
        'Daya tiap lampu seri: $P = I^2 R = 1^2 \\times 6 = 6\\text{ Watt}$ (turun drastis dari 24 Watt!).',
        'Pada rangkaian paralel, setiap lampu menerima tegangan penuh $12\\text{ V}$ sehingga $P = \\frac{V^2}{R} = \\frac{144}{6} = 24\\text{ Watt}$ per lampu.'
      ],
      guidingQuestions: [
        'Bagaimana pengaruh cara merangkai komponen terhadap hambatan ekuivalen total?',
        'Mengapa kecerahan lampu ditentukan oleh daya listrik aktual ($P$), bukan sekadar nilai voltase sumber?'
      ]
    },
    evidenceList: [
      {
        id: 'ev-05-1',
        name: 'Multimeter Digital Fluke',
        location: 'Terminal Aki & Lampu',
        description: 'Tegangan aki terukur tetap $12.0\\text{ V}$. Namun tegangan pada terminal lampu 1 hanya $6.0\\text{ V}$ dan lampu 2 sebesar $6.0\\text{ V}$.',
        scientificRelevance: 'Membuktikan pembagian tegangan pada rangkaian seri: $V_{total} = V_1 + V_2$.',
        dataValue: 'V1 = 6V, V2 = 6V (V_sum = 12V)',
        iconName: 'Zap'
      },
      {
        id: 'ev-05-2',
        name: 'Amperemeter DC',
        location: 'Kabel Utama',
        description: 'Arus terukur hanya $1.0\\text{ Ampere}$ pada konfigurasi seri, padahal pada paralel arus total mencapai $4.0\\text{ Ampere}$.',
        scientificRelevance: 'Menegaskan bahwa hambatan pengganti seri membengkak dua kali lipat menjadi $12\\,\\Omega$.',
        dataValue: 'I_seri = 1.0 A vs I_paralel = 4.0 A',
        iconName: 'Gauge'
      }
    ],
    hypotheses: [
      {
        id: 'hyp-05-a',
        statement: 'Pada rangkaian seri, tegangan sumber terbagi rata dan hambatan total bertambah besar, menyebabkan arus mengecil sehingga daya disipasi tiap lampu turun menjadi 1/4 dari daya normalnya.',
        isScientificallySound: true,
        scientificFeedback: 'Analisis Fisika Brilian! Kecerahan lampu sebanding dengan daya $P = V^2 / R$. Karena tegangan per lampu turun dari 12V menjadi 6V, dayanya turun menjadi $(6/12)^2 = 1/4$ dari semula.'
      }
    ],
    experimentPreset: {
      title: 'Lab Analisis Rangkaian Seri vs Paralel',
      goal: 'Bandingkan arus, tegangan, hambatan pengganti, dan daya pada rangkaian 2 lampu dalam mode seri vs paralel.',
      defaultVariables: {
        voltage: 12,
        r1: 6,
        r2: 6,
        mode: 'series'
      },
      instructions: [
        '1. Pilih mode "Rangkaian Seri". Ukur tegangan pada Lampu A dan Lampu B.',
        '2. Catat daya lampu ($P = I^2 R$) dan amati redupnya nyala bohlam.',
        '3. Ganti ke mode "Rangkaian Paralel". Perhatikan bagaimana kedua lampu menerima 12V penuh dan menyala benderang.'
      ]
    },
    analysisQuestions: [
      {
        id: 'q-05-1',
        question: 'Tiga buah resistor identik masing-masing bernilai 6 Ohm dirangkai secara paralel dan dihubungkan ke sumber tegangan 12 Volt. Berapakah hambatan pengganti total dan kuat arus utama?',
        options: ['18 Ohm dan 0.67 Ampere', '2 Ohm dan 6 Ampere', '3 Ohm dan 4 Ampere', '0.5 Ohm dan 24 Ampere'],
        correctOptionIndex: 1,
        explanation: 'Hambatan paralel: $1/R_p = 1/6 + 1/6 + 1/6 = 3/6 \\implies R_p = 2\\,\\Omega$. Kuat arus utama: $I = V / R_p = 12 / 2 = 6\\text{ Ampere}$.',
        formulaTip: '1/Rp = 1/R1 + 1/R2 + 1/R3; I = V/Rp'
      }
    ],
    finalDeductions: [
      {
        id: 'ded-05-1',
        verdict: 'Kasus Terpecahkan: Tidak ada baterai rusak atau sabotase; lampu redup karena kesalahan konfigurasi seri vs paralel.',
        explanation: 'Pemasangan seri menyebabkan hambatan total menjadi $12\\,\\Omega$ dan tegangan terbagi menjadi $6\\text{ V}$ per lampu, sehingga daya lampu turun dari $24\\text{ W}$ menjadi hanya $6\\text{ W}$ per bohlam. Untuk mengembalikan terang maksimal, kabel harus dikembalikan ke konfigurasi paralel.',
        isCorrect: true,
        physicsLaw: 'Hukum Ohm & Rangkaian Resistor Kirchhoff'
      }
    ]
  }
];
