import { KnowledgeTopic } from '../types';

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    id: 'kb-01',
    category: 'Mekanika',
    title: 'Gerak Jatuh Bebas & Percepatan Gravitasi',
    summary: 'Gerak lurus berubah beraturan (GLBB) vertikal ke bawah tanpa kecepatan awal yang hanya dipengaruhi oleh gaya tarik gravitasi bumi.',
    dailyPhenomenon: 'Buah kelapa yang terlepas dari tangkainya meluncur semakin cepat ke bawah hingga menghantam tanah dengan suara keras.',
    scientificExplanation: 'Pada gerak jatuh bebas, hambatan udara diabaikan sehingga percepatan benda selalu konstan sebesar percepatan gravitasi bumi ($g \\approx 9.8\\text{ m/s}^2$ atau $10\\text{ m/s}^2$). Karena $a = g$ konstan, kecepatan bertambah secara linier seiring bertambahnya waktu ($v = gt$), dan perpindahan bertambah sebanding dengan kuadrat waktu ($h = \\frac{1}{2}gt^2$). Yang paling menakjubkan: massa benda sama sekali tidak mempengaruhi waktu jatuh!',
    keyQuantities: [
      { symbol: 'h', name: 'Ketinggian Jatuh', unit: 'meter (m)', meaning: 'Jarak vertikal yang ditempuh benda dari titik lepas hingga tanah.' },
      { symbol: 'v', name: 'Kecepatan Sesaat / Akhir', unit: 'm/s', meaning: 'Laju benda pada saat tertentu atau saat menyentuh permukaan tanah.' },
      { symbol: 'g', name: 'Percepatan Gravitasi', unit: 'm/s²', meaning: 'Percepatan yang dialami benda akibat tarikan massa bumi (~9.8 m/s²).' },
      { symbol: 't', name: 'Waktu Tempuh', unit: 'sekon (s)', meaning: 'Durasi waktu dari saat dilepas hingga tiba di dasar.' }
    ],
    formulas: [
      { formula: 'v_t = g \\cdot t', explanation: 'Kecepatan akhir setelah jatuh selama waktu t sekon.' },
      { formula: 'h = \\frac{1}{2} g t^2', explanation: 'Ketinggian jatuh bebas dari keadaan diam ($v_0 = 0$).' },
      { formula: 'v_t = \\sqrt{2 g h}', explanation: 'Kecepatan saat mencapai ketinggian h tanpa memperhitungkan waktu t.' },
      { formula: 't = \\sqrt{\\frac{2h}{g}}', explanation: 'Waktu tempuh jatuh bebas dari ketinggian h.' }
    ],
    exampleProblem: {
      scenario: 'Sebuah bola tenis dilepaskan tanpa kecepatan awal dari lantai 4 sebuah gedung dengan ketinggian 20 meter dari tanah. Percepatan gravitasi diketahui $g = 10\\text{ m/s}^2$.',
      known: 'h = 20 m, v0 = 0 m/s, g = 10 m/s²',
      question: 'Berapakah waktu tempuh bola tenis hingga mencapai tanah dan berapa kecepatannya sesaat sebelum menumbuk tanah?',
      solutionSteps: [
        'Langkah 1: Gunakan rumus waktu tempuh jatuh bebas: $t = \\sqrt{\\frac{2h}{g}}$',
        'Langkah 2: Masukkan nilai: $t = \\sqrt{\\frac{2 \\times 20}{10}} = \\sqrt{4} = 2\\text{ sekon}$',
        'Langkah 3: Hitung kecepatan akhir: $v_t = g \\cdot t = 10 \\times 2 = 20\\text{ m/s}$ (atau $v_t = \\sqrt{2gh} = \\sqrt{2 \\times 10 \\times 20} = \\sqrt{400} = 20\\text{ m/s}$)'
      ],
      finalAnswer: 'Waktu jatuh = 2.0 detik, Kecepatan akhir = 20 m/s (72 km/jam).'
    },
    relatedCaseId: 'case-001'
  },
  {
    id: 'kb-02',
    category: 'Energi',
    title: 'Hukum Kekekalan Energi Mekanik',
    summary: 'Total energi mekanik suatu sistem terisolasi (hanya dipengaruhi gaya konservatif seperti gravitasi) nilainya selalu konstan.',
    dailyPhenomenon: 'Roller coaster melesat sangat cepat di lembah lintasan terendah dan melambat saat menaiki tanjakan lintasan tertinggi.',
    scientificExplanation: 'Energi mekanik adalah penjumlahan energi kinetik ($E_k$, energi karena gerak) dan energi potensial gravitasi ($E_p$, energi karena kedudukan tinggi). Tanpa adanya gesekan atau hambatan udara, energi potensial di titik tertinggi akan dikonversi seluruhnya menjadi energi kinetik di titik terendah: $E_{m1} = E_{m2} \\implies E_{p1} + E_{k1} = E_{p2} + E_{k2}$. Jika ada gesekan, sebagian energi mekanik berubah menjadi kalor (panas) melalui usaha gaya gesek $W_f = f_k \\cdot s$.',
    keyQuantities: [
      { symbol: 'Ep', name: 'Energi Potensial Gravitasi', unit: 'Joule (J)', meaning: 'Energi yang tersimpan akibat posisi benda terhadap acuan ($mgh$).' },
      { symbol: 'Ek', name: 'Energi Kinetik', unit: 'Joule (J)', meaning: 'Energi yang dimiliki benda karena gerak kelajuannya (½ m v²).' },
      { symbol: 'Em', name: 'Energi Mekanik Total', unit: 'Joule (J)', meaning: 'Jumlah dari energi potensial dan energi kinetik sistem.' },
      { symbol: 'W_f', name: 'Usaha Gaya Gesek', unit: 'Joule (J)', meaning: 'Kerja mekanik yang mengubah energi menjadi panas/kalor ($f_k \\times s$).' }
    ],
    formulas: [
      { formula: 'E_p = m \\cdot g \\cdot h', explanation: 'Energi potensial gravitasi pada ketinggian h.' },
      { formula: 'E_k = \\frac{1}{2} m v^2', explanation: 'Energi kinetik benda bermassa m dengan laju v.' },
      { formula: 'E_m = E_p + E_k = \\text{konstan}', explanation: 'Hukum kekekalan energi mekanik (gaya konservatif).' },
      { formula: 'E_{m1} = E_{m2} + W_f', explanation: 'Kekekalan energi ketika terdapat gaya gesek non-konservatif.' }
    ],
    exampleProblem: {
      scenario: 'Sebuah kereta mainan bermassa 2 kg meluncur dari puncak lintasan bidang miring licin setinggi 5 meter. Anggap $g = 10\\text{ m/s}^2$ dan kecepatan awal nol.',
      known: 'm = 2 kg, h = 5 m, v0 = 0 m/s, g = 10 m/s²',
      question: 'Berapakah energi kinetik dan kecepatan kereta saat mencapai dasar lintasan?',
      solutionSteps: [
        'Langkah 1: Hitung energi mekanik di puncak: $E_{p1} = mgh = 2 \\times 10 \\times 5 = 100\\text{ J}$, $E_{k1} = 0$, jadi $E_{m1} = 100\\text{ J}$.',
        'Langkah 2: Di dasar ($h_2 = 0$), $E_{p2} = 0$. Karena lintasan licin, $E_{k2} = E_{m1} = 100\\text{ J}$.',
        'Langkah 3: Hitung laju: $E_{k2} = \\frac{1}{2} m v^2 \\implies 100 = \\frac{1}{2}(2) v^2 \\implies v^2 = 100 \\implies v = 10\\text{ m/s}$.'
      ],
      finalAnswer: 'Energi kinetik di dasar = 100 Joule, Kecepatan kereta = 10 m/s.'
    },
    relatedCaseId: 'case-002'
  },
  {
    id: 'kb-03',
    category: 'Dinamika',
    title: 'Hukum-Hukum Newton tentang Gerak',
    summary: 'Tiga hukum fundamental Isaac Newton yang mendasari seluruh mekanika klasik dan hubungan antara gaya, massa, dan percepatan.',
    dailyPhenomenon: 'Saat mobil direm mendadak, tubuh penumpang tersentak maju ke depan; saat mobil digas, tubuh terdorong ke belakang jok.',
    scientificExplanation: 'Hukum I Newton (Inersia): Setiap benda mempertahankan keadaan diam atau gerak lurus beraturannya kecuali dipaksa oleh resultan gaya luar ($\\Sigma F = 0$). Hukum II Newton: Percepatan berbanding lurus dengan resultan gaya dan berbanding terbalik dengan massa ($\\Sigma F = m \\cdot a$). Hukum III Newton: Setiap aksi menghasilkan reaksi yang sama besar tetapi berlawanan arah ($F_{aksi} = -F_{reaksi}$).',
    keyQuantities: [
      { symbol: 'F', name: 'Gaya / Resultan Gaya', unit: 'Newton (N)', meaning: 'Tarikan atau dorongan interaksi yang dapat mengubah gerak benda.' },
      { symbol: 'm', name: 'Massa Inersia', unit: 'kilogram (kg)', meaning: 'Ukuran kelembaman benda untuk mempertahankan status geraknya.' },
      { symbol: 'a', name: 'Percepatan', unit: 'm/s²', meaning: 'Laju perubahan kecepatan terhadap waktu.' },
      { symbol: 'f_k, f_s', name: 'Gaya Gesek', unit: 'Newton (N)', meaning: 'Gaya hambat kontak antara dua permukaan yang bersentuhan.' }
    ],
    formulas: [
      { formula: '\\Sigma F = 0', explanation: 'Hukum I Newton: Keadaan setimbang dinamis ($v = \\text{konstan}$) atau statis ($v = 0$).' },
      { formula: '\\Sigma F = m \\cdot a', explanation: 'Hukum II Newton: Hubungan mendasar dinamika gerak translasi.' },
      { formula: 'F_{aksi} = -F_{reaksi}', explanation: 'Hukum III Newton: Pasangan gaya pada dua benda berbeda.' },
      { formula: 'f_k = \\mu_k \\cdot N', explanation: 'Gaya gesek kinetik antara permukaan benda dengan gaya normal N.' }
    ],
    exampleProblem: {
      scenario: 'Sebuah balok bermassa 5 kg ditarik dengan gaya horizontal $F = 30\\text{ N}$ di atas lantai kasar yang memiliki koefisien gesek kinetik $\\mu_k = 0.2$. Gunakan $g = 10\\text{ m/s}^2$.',
      known: 'm = 5 kg, F = 30 N, μk = 0.2, g = 10 m/s²',
      question: 'Berapakah percepatan yang dialami balok tersebut?',
      solutionSteps: [
        'Langkah 1: Hitung gaya normal: $N = W = m \\cdot g = 5 \\times 10 = 50\\text{ N}$.',
        'Langkah 2: Hitung gaya gesek kinetik: $f_k = \\mu_k \\cdot N = 0.2 \\times 50 = 10\\text{ N}$.',
        'Langkah 3: Hitung resultan gaya: $\\Sigma F = F - f_k = 30 - 10 = 20\\text{ N}$.',
        'Langkah 4: Hitung percepatan: $a = \\frac{\\Sigma F}{m} = \\frac{20}{5} = 4\\text{ m/s}^2$.'
      ],
      finalAnswer: 'Percepatan balok = 4.0 m/s² ke arah tarikan gaya.'
    },
    relatedCaseId: 'case-003'
  },
  {
    id: 'kb-04',
    category: 'Gelombang',
    title: 'Gelombang Mekanik & Karakteristik Gelombang',
    summary: 'Perambatan usikan yang membawa energi dan momentum dari suatu tempat ke tempat lain melalui medium tanpa memindahkan massa medium secara permanen.',
    dailyPhenomenon: 'Riak gelombang air lingkaran yang meluas saat kerikil dijatuhkan ke kolam yang tenang; suara speaker yang menggetarkan kaca jendela.',
    scientificExplanation: 'Berdasarkan arah getar dan rambatnya, gelombang mekanik dibedakan menjadi gelombang transversal (arah getar tegak lurus arah rambat, misal gelombang tali dan permukaan air) dan longitudinal (arah getar sejajar arah rambat, misal gelombang bunyi dan pegas slinki). Gelombang memiliki besaran dasar: frekuensi $f$ (jumlah gelombang per detik), periode $T$ (waktu satu gelombang penuh), panjang gelombang $\\lambda$ (jarak dua puncak berurutan), dan cepat rambat $v = \\lambda \\cdot f$. Energi gelombang sebanding dengan kuadrat amplitudo ($E \\propto A^2$).',
    keyQuantities: [
      { symbol: 'λ (lambda)', name: 'Panjang Gelombang', unit: 'meter (m)', meaning: 'Jarak antara dua titik berurutan yang memiliki fase getaran sama.' },
      { symbol: 'f', name: 'Frekuensi', unit: 'Hertz (Hz)', meaning: 'Banyaknya getaran atau gelombang yang terjadi tiap satu sekon.' },
      { symbol: 'T', name: 'Periode', unit: 'sekon (s)', meaning: 'Waktu yang diperlukan untuk menghasilkan satu gelombang penuh ($T = 1/f$).' },
      { symbol: 'v', name: 'Cepat Rambat', unit: 'm/s', meaning: 'Kelajuan perambatan puncak gelombang melintasi medium.' },
      { symbol: 'A', name: 'Amplitudo', unit: 'meter (m)', meaning: 'Simpangan maksimum partikel medium dari posisi setimbangnya.' }
    ],
    formulas: [
      { formula: 'v = \\lambda \\cdot f = \\frac{\\lambda}{T}', explanation: 'Persamaan umum cepat rambat gelombang mekanik.' },
      { formula: 'f = \\frac{1}{T}', explanation: 'Hubungan timbal balik antara frekuensi dan periode.' },
      { formula: 'y(x,t) = A \\sin(\\omega t \\mp kx)', explanation: 'Persamaan gelombang sinusoidal berjalan.' },
      { formula: 'E \\propto A^2', explanation: 'Energi gelombang sebanding dengan kuadrat amplitudo getarannya.' }
    ],
    exampleProblem: {
      scenario: 'Sebuah pemancar gelombang di danau menghasilkan 30 gelombang setiap 10 sekon. Jarak antara dua puncak gelombang yang berdekatan terukur sebesar 1.5 meter.',
      known: 'n = 30 gelombang, t = 10 s, λ = 1.5 m',
      question: 'Berapakah frekuensi, periode, dan cepat rambat gelombang tersebut?',
      solutionSteps: [
        'Langkah 1: Hitung frekuensi: $f = \\frac{n}{t} = \\frac{30}{10} = 3\\text{ Hz}$.',
        'Langkah 2: Hitung periode: $T = \\frac{1}{f} = \\frac{1}{3} \\approx 0.33\\text{ sekon}$.',
        'Langkah 3: Hitung cepat rambat gelombang: $v = \\lambda \\cdot f = 1.5 \\times 3 = 4.5\\text{ m/s}$.'
      ],
      finalAnswer: 'Frekuensi = 3 Hz, Periode = 0.33 s, Cepat rambat = 4.5 m/s.'
    },
    relatedCaseId: 'case-004'
  },
  {
    id: 'kb-05',
    category: 'Kelistrikan',
    title: 'Hukum Ohm & Rangkaian Arus Searah (DC)',
    summary: 'Prinsip aliran muatan listrik dalam konduktor yang dikendalikan oleh beda potensial dan hambatan listrik.',
    dailyPhenomenon: 'Baterai senter yang digunakan terus-menerus membuat nyala lampu semakin redup, atau pemasangan lampu hias pohon natal yang jika satu putus semua padam (seri) vs tetap menyala (paralel).',
    scientificExplanation: 'Hukum Ohm menyatakan bahwa kuat arus listrik ($I$) yang mengalir pada suatu kawat penghantar berbanding lurus dengan beda potensial ($V$) dan berbanding terbalik dengan hambatan ($R$): $I = \\frac{V}{R}$. Pada rangkaian SERI, arus pada semua komponen sama besar ($I_{tot} = I_1 = I_2$), tegangan terbagi ($V_{tot} = V_1 + V_2$), dan hambatan total bertambah ($R_s = R_1 + R_2$). Pada rangkaian PARALEL, tegangan pada semua cabang sama besar ($V_{tot} = V_1 = V_2$), arus terbagi sesuai Hukum I Kirchhoff ($I_{tot} = I_1 + I_2$), dan hambatan total mengecil ($1/R_p = 1/R_1 + 1/R_2$). Daya listrik yang menentukan terang lampu dirumuskan $P = V \\cdot I = I^2 R = \\frac{V^2}{R}$.',
    keyQuantities: [
      { symbol: 'V', name: 'Tegangan Listrik (Beda Potensial)', unit: 'Volt (V)', meaning: 'Energi per satuan muatan yang menggerakkan elektron.' },
      { symbol: 'I', name: 'Kuat Arus Listrik', unit: 'Ampere (A)', meaning: 'Banyaknya muatan listrik yang mengalir tiap satuan waktu ($Q/t$).' },
      { symbol: 'R', name: 'Hambatan Listrik (Resistansi)', unit: 'Ohm (Ω)', meaning: 'Ukuran perlawanan bahan konduktor terhadap aliran arus listrik.' },
      { symbol: 'P', name: 'Daya Listrik', unit: 'Watt (W)', meaning: 'Laju energi listrik yang diubah menjadi bentuk lain (cahaya/panas).' }
    ],
    formulas: [
      { formula: 'V = I \\cdot R', explanation: 'Hukum Ohm fundamental.' },
      { formula: 'P = V \\cdot I = I^2 R = \\frac{V^2}{R}', explanation: 'Daya listrik yang dilepaskan suatu komponen/lampu.' },
      { formula: 'R_{seri} = R_1 + R_2 + R_3 + \\dots', explanation: 'Hambatan pengganti rangkaian seri.' },
      { formula: '\\frac{1}{R_{paralel}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots', explanation: 'Hambatan pengganti rangkaian paralel.' }
    ],
    exampleProblem: {
      scenario: 'Dua buah resistor $R_1 = 4\\,\\Omega$ dan $R_2 = 6\\,\\Omega$ dihubungkan ke sumber tegangan baterai 12 Volt. Hitung arus total jika dirangkai seri vs paralel.',
      known: 'R1 = 4 Ω, R2 = 6 Ω, V = 12 V',
      question: 'Berapakah kuat arus total pada masing-masing konfigurasi seri dan paralel?',
      solutionSteps: [
        'Konfigurasi Seri: $R_s = 4 + 6 = 10\\,\\Omega$. Arus $I_{seri} = \\frac{V}{R_s} = \\frac{12}{10} = 1.2\\text{ Ampere}$.',
        'Konfigurasi Paralel: $\\frac{1}{R_p} = \\frac{1}{4} + \\frac{1}{6} = \\frac{3+2}{12} = \\frac{5}{12} \\implies R_p = 2.4\\,\\Omega$.',
        'Arus Paralel: $I_{paralel} = \\frac{V}{R_p} = \\frac{12}{2.4} = 5.0\\text{ Ampere}$.'
      ],
      finalAnswer: 'Arus rangkaian seri = 1.2 A, Arus rangkaian paralel = 5.0 A (lebih dari 4 kali lipat!).'
    },
    relatedCaseId: 'case-005'
  }
];
