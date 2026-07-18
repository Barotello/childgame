# Kelime Bulmaca

4-7 yaş arası çocuklar için çok dilli kelime/harf sürükle-bırak oyunu (Expo/React Native). Seçilen dil hem arayüzü hem de oynanan kelimeleri belirler.

## Run & Operate

- `pnpm --filter @workspace/mobile run dev` — Expo dev server'ı çalıştırır (artifacts/mobile)
- `pnpm install --frozen-lockfile` — kilitli bağımlılıkları yükler
- `pnpm --filter @workspace/mobile run dev:replit` — Replit geliştirme ortamı için Expo sunucusunu çalıştırır
- `pnpm --filter @workspace/mobile run test` — kategori bazlı açılma kurallarını doğrular
- `pnpm --filter @workspace/mobile run typecheck` — mobil paket için tip kontrolü
- `pnpm --filter @workspace/api-server run dev` — API sunucusu (şu an oyun tarafından kullanılmıyor, ayrı bir artifact)
- `pnpm run typecheck` — tüm paketlerde tip kontrolü

## Stack

- Expo (React Native) + expo-router, TypeScript
- react-native-gesture-handler + react-native-reanimated: harf sürükle-bırak ve animasyonlar
- expo-audio: ses efektleri (doğru/yanlış/kutlama)
- expo-image: silüet → renkli görsel açılma efekti (tintColor overlay tekniği)
- @react-native-async-storage/async-storage: coin/seviye/ipucu ilerlemesinin cihazda kalıcı saklanması

## Product

- **Oyna** sekmesi: hedef nesnenin silüeti + harf sayısı kadar yuvarlak boş yuva; altta karışık harfler (doğru harfler + 2 çeldirici); doğru harf yuvaya bırakılınca ses+haptik+animasyon; kelime tamamlanınca görsel renkleniyor, kutlama ekranı ve coin ödülü geliyor; bir sonraki seviyeye otomatik ilerliyor.
- **Kitaplık** sekmesi: her kategorinin ilk kelimesi açıktır; sonraki kelimeler sırayla tamamlanınca açılır. Tamamlanan kelimeler onay işaretiyle, kilitli kelimeler kilit simgesiyle gösterilir.
- **Mağaza** sekmesi: coin karşılığı ipucu jetonu satın alma (tekli/5'li paket).
- **Ayarlar** sekmesi: uygulama dili (Türkçe, English, Français, Español, Italiano, Deutsch) ve ses efektleri aç/kapa ayarları.
- **6 dil desteği**: arayüz metinleri, kelime etiketleri, harf bulmacaları ve seslendirme `lib/i18n.tsx`, `constants/translations.ts` ve `constants/words.ts` üzerinden seçilen dile uyarlanır.
- İlerleme (coin, açılan/tamamlanan seviyeler, ipucu jetonu sayısı, ses aç/kapa, dil tercihi) `lib/gameState.tsx` ve `lib/i18n.tsx` içindeki Context'ler + AsyncStorage ile kalıcı tutuluyor.

## Gotchas

- `expo-audio` paketini pnpm workspace'e eklerken `npx expo install` (SDK'ya uygun versiyonu otomatik seçer) kullanıldı; ilk restart'ta Metro'nun native modül temp/maven klasörünü izlemeye çalışıp ENOENT ile patlaması geçiciydi — ikinci workflow restart'ında düzeldi.
- Kelime listesindeki her kelimenin harfleri kendi içinde tekrarsız tutuluyor (aynı harften birden fazla yoksa ipucu/kilitleme mantığı harf değerine göre çalışabiliyor, index eşleştirmesine gerek kalmıyor).

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
