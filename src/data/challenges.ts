import { QuizQuestion } from '../types';

export const DETECTIVE_QUIZZES: QuizQuestion[] = [
  {
    id: 'quiz-01',
    title: 'Misteri Apel Newton di Bulan',
    category: 'Mekanika',
    difficulty: 'Pemula',
    scenario: 'Seorang astronaut menjatuhkan palu seberat 2 kg dan sehelai bulu elang di permukaan Bulan (di mana tidak ada atmosfer dan gravitasi bernilai 1/6 g bumi). Apa hasil pengamatan kamera helm sang astronaut?',
    options: [
      'Palu mencapai permukaan bulan 6 kali lebih cepat daripada bulu',
      'Palu dan bulu mendarat serentak bersamaan di permukaan bulan',
      'Bulu melayang di angkasa dan tidak pernah mendarat di permukaan',
      'Palu mendarat lebih dulu karena ditarik medan gravitasi lokal'
    ],
    correctIndex: 1,
    explanation: 'Benar! Di Bulan tidak ada atmosfer sama sekali (vakum sempurna). Percepatan gravitasi Bulan ($g_{bulan} \\approx 1.62\\text{ m/s}^2$) menarik semua massa dengan percepatan yang sama persis tanpa ada hambatan udara ($F_d = 0$). Eksperimen ini pernah dibuktikan nyata oleh David Scott pada misi Apollo 15 tahun 1971.',
    points: 80
  },
  {
    id: 'quiz-02',
    title: 'Anomali Rem Darurat Truk',
    category: 'Energi',
    difficulty: 'Menengah',
    scenario: 'Sebuah truk bermassa 10.000 kg melaju dengan kecepatan 20 m/s kemudian rem blong dan terpaksa diarahkan ke tanjakan pasir darurat (escape ramp). Jika sudut kemiringan pasir membuat truk naik setinggi 15 meter sebelum berhenti, berapakah perkiraan energi yang diserap oleh gesekan pasir jika $g = 10\\text{ m/s}^2$?',
    options: [
      '2.000.000 Joule',
      '1.500.000 Joule',
      '500.000 Joule',
      '250.000 Joule'
    ],
    correctIndex: 2,
    explanation: 'Energi kinetik awal truk: $E_{k} = \\frac{1}{2} m v^2 = \\frac{1}{2}(10.000)(20^2) = 2.000.000\\text{ J}$. Energi potensial di titik berhenti: $E_p = m g h = 10.000 \\times 10 \\times 15 = 1.500.000\\text{ J}$. Sesuai hukum konservasi energi: $W_{gesek} = E_k - E_p = 2.000.000 - 1.500.000 = 500.000\\text{ Joule}$.',
    points: 100
  },
  {
    id: 'quiz-03',
    title: 'Teka-Teki Roket di Ruang Angkasa',
    category: 'Dinamika',
    difficulty: 'Pemula',
    scenario: 'Mengapa sebuah roket tetap bisa mempercepat lajunya di ruang hampa udara antariksa padahal tidak ada atmosfer atau udara untuk "didorong" oleh semburan apinya?',
    options: [
      'Karena gas semburan roket menekan medan partikel gelap kuantum',
      'Berdasarkan Hukum III Newton, roket mendorong massa gas ke belakang sehingga gas mendorong balik roket ke depan dengan gaya yang sama',
      'Karena di ruang hampa massa roket menjadi nol sehingga mudah bergerak',
      'Karena energi potensial bahan bakar berubah menjadi tarikan magnet bumi'
    ],
    correctIndex: 1,
    explanation: 'Tepat Sekali! Propulsi roket adalah implementasi murni Hukum III Newton ($F_{aksi} = -F_{reaksi}$) dan Hukum Kekekalan Momentum. Roket tidak mendorong medium luar, melainkan mendorong partikel gas buang internalnya ke arah belakang sehingga memperoleh gaya dorong reaksi (thrust) ke arah depan.',
    points: 80
  },
  {
    id: 'quiz-04',
    title: 'Gema Suara di Lembah Misterius',
    category: 'Gelombang',
    difficulty: 'Menengah',
    scenario: 'Seorang penyelidik berteriak di depan tebing tegap. Gema pantulan suaranya terdengar kembali tepat 1.2 detik kemudian. Jika cepat rambat bunyi di udara saat itu adalah 340 m/s, berapakah jarak penyelidik ke dinding tebing?',
    options: [
      '408 meter',
      '204 meter',
      '170 meter',
      '680 meter'
    ],
    correctIndex: 1,
    explanation: 'Bunyi merambat bolak-balik (menuju tebing lalu memantul kembali ke telinga penyelidik), sehingga jarak tempuh total gelombang adalah $2s = v \\cdot t$. Maka jarak ke tebing $s = \\frac{v \\cdot t}{2} = \\frac{340 \\times 1.2}{2} = \\frac{408}{2} = 204\\text{ meter}$.',
    points: 90
  },
  {
    id: 'quiz-05',
    title: 'Misteri Korsleting Kabel Rumah',
    category: 'Kelistrikan',
    difficulty: 'Lanjutan',
    scenario: 'Ketika terjadi hubungan pendek (korsleting) antara dua kabel fasa dan netral tanpa melewati beban peralatan (resistor), sekering atau MCB langsung trip (anjlok). Mengapa hal ini terjadi menurut Hukum Ohm?',
    options: [
      'Tegangan listrik mendadak turun menjadi 0 Volt sehingga sistem padam',
      'Hambatan rangkaian menjadi sangat mendekati nol ($R \\approx 0$), sehingga kuat arus melonjak luar biasa tinggi ($I = V/R \\to \\infty$) dan memicu proteksi',
      'Daya listrik lampu menyedot energi dari stasiun gardu trafo',
      'Kabel fasa kehabisan elektron bebas untuk dialirkan'
    ],
    correctIndex: 1,
    explanation: 'Menurut Hukum Ohm $I = V / R$. Ketika kawat saling bersentuhan langsung tanpa beban, resistansi $R$ mendekati nol. Akibatnya arus $I$ melonjak seketika hingga ratusan Ampere, menghasilkan panas ekstrem ($P = I^2 R_{kabel}$) yang dapat memicu kebakaran jika pemutus sirkuit (MCB) tidak segera memutus aliran.',
    points: 120
  },
  {
    id: 'quiz-06',
    title: 'Peluru Meriam & Gerak Parabola',
    category: 'Mekanika',
    difficulty: 'Menengah',
    scenario: 'Sebuah meriam menembakkan dua peluru identik dengan kelajuan awal yang sama ($v_0$). Peluru A ditembakkan dengan sudut elevasi $30^\\circ$ dan Peluru B dengan sudut elevasi $60^\\circ$. Tanpa hambatan udara, manakah pernyataan yang BENAR mengenai jangkauan horizontal maksimum ($X_{max}$)?',
    options: [
      'Peluru A memiliki jangkauan jauh lebih besar daripada Peluru B',
      'Peluru B memiliki jangkauan jauh lebih besar daripada Peluru A',
      'Kedua peluru jatuh pada jarak horizontal yang sama persis',
      'Peluru B tidak pernah menyentuh tanah karena sudutnya terlalu tinggi'
    ],
    correctIndex: 2,
    explanation: 'Rumus jangkauan maksimum gerak parabola adalah $X_{max} = \\frac{v_0^2 \\sin(2\\alpha)}{g}$. Untuk sudut $\\alpha_1 = 30^\\circ$, $\\sin(2 \\times 30^\\circ) = \\sin(60^\\circ) = \\frac{1}{2}\\sqrt{3}$. Untuk $\\alpha_2 = 60^\\circ$, $\\sin(2 \\times 60^\\circ) = \\sin(120^\\circ) = \\frac{1}{2}\\sqrt{3}$. Dua sudut komplementer (berjumlah $90^\\circ$) selalu menghasilkan jarak jangkauan horizontal yang sama persis!',
    points: 110
  }
];
