// Rail text for each slide, verbatim from the pptx. Eyebrows are stored in normal
// Turkish case: CSS uppercases them under lang="tr". "Huawei" stays lang="en" or it
// would uppercase to "HUAWEİ".
const ph = html => html.replace(/\[[^\]]+\]/g, m => `<span class="ph">${m}</span>`);
const eb = t => `<p class="eb l">${t}</p>`;

const person = (r, name, uni) => `<div class="l"><b class="ph-b">${name}</b><p>${uni}</p><p>${r}</p></div>`;
const item = (h, p) => `<div class="l"><h3>${h}</h3><p>${p}</p></div>`;
const li = t => `<li>${t}</li>`;

export const SLIDES = [
  { title: 'sarı nokta', rail: `
    <div class="logos l"><img src="assets/img/shield.png" alt=""><img src="assets/img/huawei-ict-academy.png" alt="Huawei ICT Academy"></div>
    ${eb('<span lang="en">Huawei ICT Ideathon</span> · SDG 16.3 Herkes için adalete erişim')}
    <h1 class="l">sarı nokta</h1>
    <p class="lead l">Göçmen öğrenciler için hak, süre ve gönüllü avukat rehberi</p>
    <p class="l">Mobil uygulama</p>
    <p class="foot l">Diva · 8 Kasım 2026</p>` },

  { title: 'Önce bir soru', beats: 2, rail: `
    ${eb('Önce bir soru')}
    <h2 class="q l">Başka bir ülkede öğrencisiniz. Oturma izninizin bitmesine 10 gün kaldı. Bunu kimden öğrenirdiniz?</h2>
    <p class="lead foot b1">Biz göçmen değiliz. Bu soruyu, Türkiye’de okuyan 300.000’den fazla uluslararası öğrencinin yerine kendimizi koyarak sorduk.</p>` },

  { title: 'Projeye Genel Bakış', rail: `
    <h2 class="l">Projeye Genel Bakış</h2>
    <ol class="agenda">${['Takım Tanıtımı', 'Proje Tanıtımı', 'Fiyatlandırma Analizi', 'Fonksiyonlar', 'Yenilikler', 'İş Değerlemesi', 'Kazanımlar']
      .map((t, i) => `<li class="l"><span>0${i + 1}</span>${t}</li>`).join('')}</ol>` },

  { title: 'Sarı Nokta’nın arkasındaki ekip', rail: `
    ${eb('01 · Takım tanıtımı')}
    <h2 class="l">Sarı Nokta’nın arkasındaki ekip</h2>
    <div class="two team">${person('Araştırmacı', 'Dilşah Bahçeci', 'ODTÜ')}${person('Takım lideri', 'Arif Özer', 'ODTÜ')}${person('Tasarımcı', 'Taha Bayati', 'TED Üniversitesi')}</div>` },

  { title: 'Cevap çoğu zaman: kimseden', rail: `
    ${eb('02 · Proje tanıtımı · Problem')}
    <h2 class="l">Cevap çoğu zaman: kimseden</h2>
    <p class="stat l">300.000+</p>
    <p class="l stat-t">uluslararası öğrenci, 198 ülkeden gelip Türkiye’de okuyor</p>
    <div class="two">
      ${item('Dağınık bilgi', 'Mevzuat, Göç İdaresi, üniversite ve konsolosluk arasında bölünmüş')}
      ${item('Dil engeli', 'Hukuki metinler ağır ve çoğunlukla yalnızca Türkçe')}
      ${item('Kaçan süreler', 'İkamet izni dolarsa ceza ve sınır dışı edilme riski')}
      ${item('Dolandırıcılık', 'Sahte ikamet siteleri ve güvenilmez aracılar')}
    </div>
    <p class="src foot l">Kaynak: YÖK Başkanı Erol Özvar’ın açıklaması (Sözcü); sahte ikamet siteleri için Göç İdaresi Başkanlığı uyarısı</p>` },

  { title: 'SDG 16’da hangi hedefi karşılıyoruz?', rail: `
    ${eb('02 · Proje tanıtımı · SDG 16')}
    <h2 class="l">SDG 16’da hangi hedefi karşılıyoruz?</h2>
    <div class="goal l"><p class="num">16.3 <small>Ana hedef</small></p><h3>Herkes için adalete eşit erişim</h3>
      <p>“Hukukun üstünlüğünü teşvik etmek ve herkes için adalete eşit erişimi sağlamak.”</p>
      <p><b>Sarı Nokta’da: göçmen öğrenci, gönüllü avukata ücretsiz ve kendi dilinde ulaşır.</b></p></div>
    <div class="two">
      <div class="l"><p class="num s">16.10</p><h3>Bilgiye kamusal erişim</h3><p>Sarı Nokta’da: göçmenlik mevzuatı sade ve çok dilli</p></div>
      <div class="l"><p class="num s">16.b</p><h3>Ayrımcı olmayan yasa ve politikalar</h3><p>Sarı Nokta’da: göçmen öğrenci de hakkını bilir ve kullanır</p></div>
    </div>
    <p class="src foot l">Göç boyutu · SDG 10.7: düzenli, güvenli ve sorumlu göçü kolaylaştırmak. Öğrencinin yasal kalışını sürdürmesine yardım ediyoruz.</p>` },

  { title: 'Sarı Nokta etiketli gönüllü avukatlar', rail: `
    ${eb('02 · Proje tanıtımı · Gönüllü avukatlar')}
    <h2 class="l">Sarı Nokta etiketli gönüllü avukatlar</h2>
    <div class="steps">
      <div class="l"><span>Adım 1</span><div><h3>Öğrenci soruyu yazar</h3><p>Kendi dilinde, istersen anonim olarak</p></div></div>
      <div class="l"><span>Adım 2</span><div><h3>Uygulama eşleştirir</h3><p>Konuya ve dile göre uygun Sarı Nokta avukatına iletir</p></div></div>
      <div class="l"><span>Adım 3</span><div><h3>Avukat yanıtlar</h3><p>Yazılı yanıt ya da kısa görüşme; gerekirse adli yardıma yönlendirme</p></div></div>
    </div>
    <div class="two lists foot">
      <div class="l"><h3>Avukat neden gönüllü olur?</h3><ul>${['Sarı Nokta rozeti ve profil görünürlüğü', 'Belgelenen pro bono saatleri', 'Baro ve STK işbirliğiyle sosyal sorumluluk'].map(li).join('')}</ul></div>
      <div class="l"><h3>Güven nasıl sağlanır?</h3><ul>${['Baro sicil kontrolüyle doğrulama', 'Her yıl yenilenen Sarı Nokta etiketi', 'Öğrenci geri bildirimi ve puanlama'].map(li).join('')}</ul></div>
    </div>` },

  { title: 'Hakkını bil. Süreni kaçırma. Gerektiğinde gerçek bir avukata ulaş.', rail: `
    ${eb('02 · Proje tanıtımı · Çözüm')}
    <h2 class="big l">Hakkını bil. Süreni kaçırma. Gerektiğinde gerçek bir avukata ulaş.</h2>
    <div class="stack foot">
      ${item('Kişiye özel hak rehberi', 'Sınır dışı, çalışma izni, ikamet: kendi durumuna göre, kendi dilinde')}
      ${item('Süre takvimi', 'İkamet ve başvuru tarihlerine geri sayım, zamanında bildirim')}
      ${item('Sarı Nokta avukatları', 'Doğrulanmış gönüllü avukatlara konsolosluğa gitmeden soru sorma')}
    </div>` },

  { title: 'Cebindeki Sarı Nokta', beats: 3, rail: `
    ${eb('02 · Mobil uygulama')}
    <h2 class="big l">Cebindeki Sarı Nokta</h2>
    <p class="lead l">Göçmen öğrenci üç dokunuşta süresini görür, hakkını öğrenir, avukata sorar.</p>
    <ul class="tabs l"><li>Ana ekran</li><li>Hak rehberi</li><li>Avukata sor</li></ul>
    <p class="draft foot l">Ekranlar tasarım taslağıdır.</p>` },

  { title: 'Öğrenci için her zaman ücretsiz', beats: 2, rail: `
    ${eb('03 · Fiyatlandırma analizi')}
    <h2 class="l">Öğrenci için her zaman ücretsiz</h2>
    <table class="tbl l"><thead><tr><th>Kim</th><th>Ne öder?</th><th>Ne alır?</th></tr></thead><tbody>
      <tr class="hl"><td>Öğrenci</td><td><b>Ücretsiz</b></td><td>Hak rehberi, süre takvimi, gönüllü avukata soru</td></tr>
      <tr><td>Üniversite</td><td>Kurumsal lisans ₺150.000 / yıl (tahmini)</td><td>Öğrencilerine özel panel, toplu duyuru, raporlar</td></tr>
      <tr><td>Gönüllü avukat</td><td>Ücretsiz</td><td>Rozet, görünürlük, pro bono kaydı</td></tr>
      <tr><td>Ücretli danışmanlık</td><td>Platform komisyonu %15 (tahmini)</td><td>Gönüllü kapsamı dışındaki dava ve karmaşık işler</td></tr>
      <tr><td>Sponsor ve hibe</td><td>₺250.000 (tahmini)</td><td>SDG 16 görünürlüğü, sosyal etki raporu</td></tr>
    </tbody></table>` },

  { title: 'Uygulamada neler var?', rail: `
    ${eb('04 · Fonksiyonlar')}
    <h2 class="l">Uygulamada neler var?</h2>
    <div class="two six">
      ${item('Hak rehberi', 'Hangi durumda sınır dışı, hangi durumda çalışma izni: adım adım')}
      ${item('Süre takvimi', 'İkamet bitişine kaç gün kaldı; uzatma zamanı gelince bildirim')}
      ${item('Kart tarama', 'İkamet kartının fotoğrafından tarihleri otomatik okur')}
      ${item('Avukata sor', 'Sarı Nokta etiketli gönüllü avukatla yazışma')}
      ${item('Çok dilli', 'Türkçe, İngilizce, Arapça ve Farsça, Rusça')}
      ${item('Mevzuat uyarıları', 'Kural değişince avukat onaylı kısa özet bildirimi')}
    </div>` },

  { title: 'Bugün nasıl, Sarı Nokta ile nasıl?', rail: `
    ${eb('05 · Yenilikler')}
    <h2 class="l">Bugün nasıl, Sarı Nokta ile nasıl?</h2>
    <table class="tbl cmp l"><thead><tr><th></th><th class="m1">Bugün (konsolosluk, YİMER 157)</th><th class="m2"><span class="y">Sarı Nokta</span></th></tr></thead><tbody>
      <tr><td>Bilgi alma</td><td class="m1">Öğrenci arar, sorar, bekler</td><td class="m2">Durumuna göre hazır, kişisel rehber</td></tr>
      <tr><td>Süre takibi</td><td class="m1">Öğrencinin hafızasına kalmış</td><td class="m2">Otomatik geri sayım ve bildirim</td></tr>
      <tr><td>Hukuki destek</td><td class="m1">Ücretli avukat ya da aracı</td><td class="m2">Doğrulanmış gönüllü avukat</td></tr>
      <tr><td>Güvenilirlik</td><td class="m1">Sahte sitelere açık</td><td class="m2">Sarı Nokta etiketi ve baro doğrulaması</td></tr>
    </tbody></table>
    <div class="kits foot l"><h3>Huawei teknolojileri:</h3><p>ML Kit · metin tanıma ve çeviri</p><p>Push Kit · süre bildirimleri</p><p>Map Kit · yakındaki Sarı Noktalar</p></div>` },

  { title: 'Ankara’dan başla, Türkiye’ye yayıl', rail: `
    ${eb('06 · İş değerlemesi')}
    <h2 class="l">Ankara’dan başla, Türkiye’ye yayıl</h2>
    <div class="phases">
      <div class="l"><span>Faz 1 · 6 ay (tahmini)</span><h3>Pilot</h3><p>Ankara üniversiteleri, 3 dil, ilk gönüllü avukatlar</p></div>
      <div class="l"><span>Faz 2 · 12 ay (tahmini)</span><h3>Ölçek</h3><p>Türkiye geneli, üniversite lisansları, baro işbirlikleri</p></div>
      <div class="l"><span>Faz 3 · 24 ay (tahmini)</span><h3>Genişleme</h3><p>Diğer göçmen grupları ve yeni diller</p></div>
    </div>
    ${eb('Riskler ve önlemler').replace('eb l', 'eb l risks')}
    <div class="phases">
      <div class="l"><h3>Mevzuat değişir</h3><p>İçerik avukatlar tarafından düzenli güncellenir</p></div>
      <div class="l"><h3>Hukuki sorumluluk</h3><p>Genel bilgi “hukuki tavsiye değildir” diye işaretlenir</p></div>
      <div class="l"><h3>Hassas veri</h3><p>KVKK uyumu, tarihler cihazda saklanır</p></div>
    </div>` },

  { title: 'Herkes kazanır', rail: `
    ${eb('07 · Kazanımlar')}
    <h2 class="big l">Herkes kazanır</h2>
    <div class="stack foot">
      ${item('Öğrenciler', 'Haklarını bilir, süresini kaçırmaz, aracıya para kaptırmaz')}
      ${item('Gönüllü avukatlar', 'Görünürlük, belgelenmiş pro bono deneyimi, yeni müvekkil')}
      ${item('Üniversiteler', 'Uluslararası ofislerin yükü azalır, öğrenci memnuniyeti artar')}
      ${item('Toplum · SDG 16', 'Adalete eşit erişim, daha az düzensiz kalış, daha güçlü kurumlara güven')}
    </div>` },

  { title: 'Teşekkürler', tone: 'navy', rail: `
    <p class="thanks l">Teşekkürler</p>
    <blockquote class="l">Hiçbir öğrenci, hakkını bilmediği için okulundan olmasın.</blockquote>
    <p class="lead foot l">Sorularınız?</p>` },
].map(s => ({ beats: 1, ...s, rail: ph(s.rail) }));

export const frameName = (i, b, mode) => {
  const n = 's' + String(i + 1).padStart(2, '0');
  if (i === 11) return `${n}-${mode}`;
  return SLIDES[i].beats > 1 ? `${n}-${b + 1}` : n;
};
