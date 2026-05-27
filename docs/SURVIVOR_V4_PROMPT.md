# インフォデミック・サバイバー v4 アップデート

src/data/posts.js を新しいデータに差し替え済みです。
以下の4つの新機能を追加してください。

## 1. ナビゲーター（ラウンド間の1行テキスト）

各ラウンドの前に、ナビゲーターのテキストを1行表示します。
データは posts.js の NAVIGATOR オブジェクトにあります。

表示方法:
- 画面の上部または中央に、フェードインで1行テキストを表示
- 1.5秒表示後にフェードアウトして、ラウンドが始まる
- フォント: Space Mono, italic, 14px, 色: #8899a6
- タップでスキップ可能

表示タイミング:
- Day開始時: NAVIGATOR.dayX.intro
- 特定ラウンド前: NAVIGATOR.dayX.beforeVersus, beforeDM, beforeSpeed, afterVersus
- GameEngine.jsx で、各ラウンドの type に応じて対応するナビテキストを表示

例:
```
Day 2, postIndex 0 → NAVIGATOR.day2.intro
Day 2, type==='versus' → NAVIGATOR.day2.beforeVersus
Day 1, type==='dm' → NAVIGATOR.day1.beforeDM
```

## 2. VERSUSの2ターン化

VERSUSデータに counterAttack フィールドが追加されました。
正しいカードを選んだ場合のみ、2ターン目が発生します。

フロー:
```
1ターン目: 反論カード選択 → チャット展開（dialogue）
  不正解カード → OBJECTION OVERRULED（終了）
  正解カード → チャット展開後...

2ターン目: 敵が切り返してくる
  counterAttack.enemyResponse を敵の吹き出しで表示（0.5秒後）
  → counterAttack.cards の3択を表示
  → 選択 → 結果
    correct → OBJECTION SUSTAINED + HP回復 + フォロワー奪取
    incorrect → 各カードに応じたhpChange/followerSteal
```

チャットの表示:
- 1行ずつ0.5秒間隔でフェードイン
- 全行表示後に敵の切り返し（counterAttack.enemyResponse）
- 切り返し後に2ターン目の3択

VersusRound.jsx を修正して、2ターン制に対応してください。
1ターン目で不正解の場合は counterAttack は発生しません。

## 3. デッキ構築（Day間の報酬カード選択）

DaySummary の後に報酬カード選択画面を表示します。
データは posts.js の REWARD_CARDS にあります。

新コンポーネント: RewardSelect.jsx

表示タイミング: Day 1, 2, 3, 4 完了後（Day 5完了後はなし→結果画面へ）

画面:
```
┌─────────────────────────────────┐
│                                 │
│      CHOOSE YOUR REWARD         │
│                                 │
│  ┌────────┐ ┌────────┐ ┌────────┐
│  │ QUICK  │ │ SHIELD │ │ KEEN   │
│  │ SCAN   │ │        │ │ EYE    │
│  │        │ │        │ │        │
│  │タイマー │ │次のミス │ │ハイライ │
│  │+5秒    │ │1回無効  │ │トが光る │
│  └────────┘ └────────┘ └────────┘
│                                 │
│  1枚選んでください              │
│                                 │
└─────────────────────────────────┘
```

- 3枚のカードが横並び
- タップで選択（選択したカードが拡大 + 光るアニメーション）
- 選択確定後にDECKに追加される
- カードのデザイン: ダークカード、Space Monoで名前、下にdesc

取得したカードの管理: useGameState に ownedCards: [] を追加
各カードの効果は effect フィールドで定義されているので、
GameEngine内で適用:

```javascript
// timer_bonus: タイマーに秒数を加算
if (hasCard('quick_scan')) timeLimit += 5;

// shield: ミス時にHP減少を無効化、使用後にカードを消費
if (hasCard('shield') && isWrong) { 
    consumeCard('shield'); 
    // HPを減らさない 
}

// hint_glow: INSPECTのハイライトゾーンにかすかなグローを追加
// （操作的投稿の正解ゾーンだけでなく、正当投稿のtrapゾーンも光るので完全な答えではない）

// objection_hp_bonus: 完璧なOBJECTION時のHP回復を+5
// combo_boost: コンボ倍率の段階を1つ引き上げ（2連→1.5倍が2連→2.0倍に）
// damage_reduce: ミス時のHP減少を5軽減
// versus_bonus: VERSUS正解時のfollowerStealを2倍
// retry: INSPECT理由選択を1回やり直せる（間違えた時に「もう一度」ボタン出現）
// speed_bonus: SPEEDラウンドのtimeLimitに30秒追加
// heal: HPを100に回復（即時適用）
// reveal: 次のDayの最初のINSPECTで正解ゾーンが最初から表示
// final_shield: shield と同じだが2回分
```

全カード効果を完璧に実装する必要はない。まずは以下の3つだけ実装:
- timer_bonus（タイマー加算）
- shield（ミス無効化）
- heal（HP回復）
残りは効果が適用されなくても、カード選択画面とDECK表示は動くようにする。

DECK表示: HUD の下部に小さくアイコンで所持カードを表示
```
DECK: [QS] [SH]   ← 取得済みカードの略称
```

## 4. 投稿テキストの更新

posts.js が全面的に書き直されています。
- SNSネイティブな文体（ハッシュタグ、絵文字、口語体）
- 正当な投稿にもtrapハイライトゾーンが追加済み
- VERSUSにcounterAttack（2ターン目）が追加済み
- NAVIGATORとREWARD_CARDSのデータが追加済み

これらのデータ構造の変更に合わせて、各ラウンドコンポーネントが
正しくデータを読み込めるようにしてください。

## 動作確認

1. 各Day開始時にナビゲーターテキストが表示される
2. VERSUS/DM前にもナビテキストが表示される
3. VERSUSで正解カードを選ぶと2ターン目が発生する
4. VERSUSで不正解カードを選ぶと1ターンで終了する
5. Day 1-4 完了後に報酬カード選択画面が表示される
6. 選択したカードがHUDのDECKに表示される
7. timer_bonus, shield, heal の効果が動作する
8. 正当な投稿にもハイライトゾーン（trap）が表示される
9. 全Dayを通しでプレイしてエラーがないこと
