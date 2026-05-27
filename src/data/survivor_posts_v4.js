// ============================================================
// インフォデミック・サバイバー v4 — 投稿データ
// SNSネイティブ文体版
// ============================================================
// 方針:
//   - 実際のX(Twitter)で見かけそうな文体
//   - ハッシュタグ、絵文字、口語体、改行多め
//   - 読んで「あ、こういうの見たことある」と思わせる
//   - 操作的投稿は「面白いけど怪しい」、正当な投稿は「地味だけど真面目」
// ============================================================

export const TUTORIAL_POSTS = [
    {
        type: 'inspect',
        id: 'tut_01',
        text: 'これマジで言ってるんだけど\n水道水のフッ素が松果体を石灰化させて\n人間の直感力を鈍らせてるって知ってた？？\n\n覚醒したいなら今すぐミネラルウォーターに変えて\n\n気づいた人から変わっていく\n#目覚めよ日本人 #松果体活性化 #水道水の闇',
        isManipulative: true,
        techniques: ['fear'],
        primaryTechnique: 'fear',
        baseLikes: 4500,
        baseRetweets: 2100,
        highlightZones: [
            {
                id: 'hz1',
                text: '松果体を石灰化させて\n人間の直感力を鈍らせてる',
                correctReason: 'fear',
                reasons: [
                    { id: 'fear', label: '検証不能な身体への悪影響を主張', correct: true },
                    { id: 'authority', label: '実在しない研究機関の名前を使用', correct: false },
                    { id: 'evidence', label: '架空の数値データで科学的に見せかけ', correct: false },
                ],
            },
            {
                id: 'hz2',
                text: '気づいた人から変わっていく',
                correctReason: 'social',
                reasons: [
                    { id: 'social', label: '取り残される不安で行動を促す', correct: true },
                    { id: 'testimonial', label: '個人の成功体験として語る', correct: false },
                    { id: 'fear', label: '根拠を示さず危機感を煽る', correct: false },
                ],
            },
        ],
        objectionText: 'FEAR APPEAL',
        objectionDetail: '「松果体が石灰化」「目覚めよ」。科学用語っぽい単語で恐怖を煽るいつものパターン',
        incorrectFeedback: '2,100人が松果体の心配を始めました。松果体はそんなにヤワじゃない',
        timeLimit: null,
    },
    {
        type: 'inspect',
        id: 'tut_02',
        text: '消費者庁からの注意喚起です。「がんが治る」「認知症が改善する」等の表現を用いた健康食品の広告は景品表示法違反の可能性があります。気になる広告を見つけた場合は消費者ホットライン(188)までご相談ください。',
        isManipulative: false,
        techniques: [],
        primaryTechnique: null,
        baseLikes: 670,
        baseRetweets: 180,
        highlightZones: [
            {
                id: 'hz1',
                text: '景品表示法違反の可能性があります',
                isTrap: true,
                reasons: [
                    { id: 'fear', label: '根拠のない恐怖', correct: false },
                    { id: 'authority', label: '実在しない権威', correct: false },
                    { id: 'evidence', label: '検証できないデータ', correct: false },
                ],
                trapFeedback: '消費者庁の公式見解です。法律に基づいた正確な表現',
            },
        ],
        trustFeedback: '消費者庁の公開情報に基づく正確な注意喚起です',
        incorrectFeedback: '公的機関の正確な情報でした。全部疑ってたらキリがない',
        timeLimit: null,
    },
];

export const DAY_POSTS = {
    day1: [
        {
            type: 'inspect',
            id: 'd1_01',
            text: '【速報】スタンフォード大AI研究所の主任Dr.ウィルソンが警告\n\n「ChatGPTを毎日2時間以上使うユーザーの前頭葉活動が有意に低下」\n\nチームはこれを"AIブレイン・ロット"と命名\n\nAIに頼りすぎてる人ほど読んでほしい\nあなたの脳、大丈夫？🧠\n\n#AI危険 #ChatGPT #脳科学',
            isManipulative: true,
            techniques: ['authority'],
            primaryTechnique: 'authority',
            baseLikes: 7800,
            baseRetweets: 3400,
            highlightZones: [
                {
                    id: 'hz1',
                    text: 'スタンフォード大AI研究所の主任Dr.ウィルソン',
                    correctReason: 'authority',
                    reasons: [
                        { id: 'authority', label: '実在確認できない専門家で信頼性を演出', correct: true },
                        { id: 'evidence', label: '検証不能な統計データを提示', correct: false },
                        { id: 'fear', label: '所属不明の個人の証言として提示', correct: false },
                    ],
                },
                {
                    id: 'hz2',
                    text: '"AIブレイン・ロット"と命名',
                    correctReason: 'authority',
                    reasons: [
                        { id: 'authority', label: '実在しない症状名で危機感を演出', correct: true },
                        { id: 'social', label: '読者の恐怖心を煽って行動を促す', correct: false },
                        { id: 'testimonial', label: '検証できない海外の研究を引用', correct: false },
                    ],
                },
            ],
            objectionText: 'AUTHORITY',
            objectionDetail: '架空の研究者 + 架空の症状名。「命名した」でいかにも学術っぽく見せる上級テク',
            incorrectFeedback: '3,400人がAIブレイン・ロットの心配を始めました。存在しない病気です',
            timeLimit: 20,
        },
        {
            type: 'inspect',
            id: 'd1_02',
            text: 'ガチで人生変わった\n\n朝のコーヒーやめて白湯にしたら3ヶ月で\n・肌年齢-12歳\n・体重-8kg\n・なぜか彼女もできた\n\n腸内細菌が全てを支配してる\n論文もある(リンクは貼らないけど)\n\n#白湯チャレンジ #腸活 #モテたいなら腸',
            isManipulative: true,
            techniques: ['testimonial', 'fabricated_evidence'],
            primaryTechnique: 'testimonial',
            baseLikes: 5600,
            baseRetweets: 2800,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '肌年齢-12歳\n・体重-8kg\n・なぜか彼女もできた',
                    correctReason: 'testimonial',
                    reasons: [
                        { id: 'testimonial', label: '因果不明の個人体験を効果の証拠に', correct: true },
                        { id: 'evidence', label: '検証不能な数値で効果を誇張', correct: false },
                        { id: 'social', label: '成功者の多さで行動を促す', correct: false },
                    ],
                },
                {
                    id: 'hz2',
                    text: '論文もある(リンクは貼らないけど)',
                    correctReason: 'evidence',
                    reasons: [
                        { id: 'evidence', label: '存在を主張するが検証手段を与えない', correct: true },
                        { id: 'authority', label: '専門家の見解として提示', correct: false },
                        { id: 'fear', label: '個人の調査結果として語る', correct: false },
                    ],
                },
            ],
            objectionText: 'TESTIMONIAL',
            objectionDetail: '白湯で彼女ができた因果関係は不明。「論文ある(貼らないけど)」は最高に怪しい',
            incorrectFeedback: '2,800人が白湯チャレンジを始めました。彼女は腸内細菌でできません',
            timeLimit: 20,
        },
        {
            type: 'inspect',
            id: 'd1_03',
            text: '気象庁発表。2024年の日本の年平均気温は統計開始以来の最高値を更新。世界の年平均気温も過去最高を記録しており、地球温暖化の進行が改めて確認されました。今後も高温傾向が続く見通し。',
            isManipulative: false,
            techniques: [],
            primaryTechnique: null,
            baseLikes: 890,
            baseRetweets: 340,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '統計開始以来の最高値を更新',
                    isTrap: true,
                    reasons: [
                        { id: 'fear', label: '根拠のない恐怖', correct: false },
                        { id: 'evidence', label: '検証できないデータ', correct: false },
                        { id: 'authority', label: '実在しない権威', correct: false },
                    ],
                    trapFeedback: '気象庁の公式統計データ。「最高値」は事実の記述であり恐怖訴求ではない',
                },
            ],
            trustFeedback: '気象庁の公式発表。淡々とした事実の報告で信頼できる',
            incorrectFeedback: '公的機関の統計データでした。地味な投稿ほど信頼できることが多い',
            timeLimit: 20,
        },
        {
            type: 'dm',
            id: 'd1_dm',
            friend: { name: 'ユキ', avatar: 'Y' },
            message: 'ねえこれ見た？？友達がシェアしてて、、めっちゃ怖いんだけど🥺',
            attachedPost: 'やばいやばいやばい\nオーガニック食品だけの生活を3ヶ月続けたら\n10年悩んだ花粉症が完全に消えた😭😭\n医者にも「奇跡ですね」って言われて泣いた\nもっと早く気づいていれば...\n#オーガニック #花粉症 #自然治癒力',
            attachedPostTechnique: 'testimonial',
            responses: [
                { id: 'a', text: 'やば！これ本当かも！シェアしよ！', quality: 'bad', hpChange: -18, feedback: 'ユキと一緒に誤情報を拡散してしまいました' },
                { id: 'b', text: '気持ちはわかる🥺\nでも1人の体験だけだと何とも言えないよね\n一緒に他の情報も見てみない？', quality: 'best', hpChange: 10, feedback: 'ユキの不安に寄り添いつつ、一緒に検証。友達を失わない理想的な対応' },
                { id: 'c', text: 'それデマだよ。騙されすぎ。', quality: 'ok', hpChange: 2, feedback: '正しいけど冷たい。ユキとの信頼関係にヒビが入ったかも' },
            ],
            timeLimit: 25,
        },
    ],

    day2: [
        {
            type: 'inspect',
            id: 'd2_01',
            text: 'え、まだ始めてないの？笑\n\n朝活5時起き、私の周りだけで30人以上やってる\nイーロン・マスクもティム・クックも孫正義もやってる\n\nやらない理由を探すほうが難しくない？🌅\n\n成功者は例外なく早起き。これだけは断言できる。\n#朝活 #5時起き #成功者の習慣',
            isManipulative: true,
            techniques: ['social_proof'],
            primaryTechnique: 'social_proof',
            baseLikes: 6700,
            baseRetweets: 3100,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '私の周りだけで30人以上やってる',
                    correctReason: 'social',
                    reasons: [
                        { id: 'social', label: '身近な集団の行動で普遍性を装う', correct: true },
                        { id: 'testimonial', label: '個人の観察を統計データのように提示', correct: false },
                        { id: 'evidence', label: '成功者の権威で行動を促す', correct: false },
                    ],
                },
                {
                    id: 'hz2',
                    text: '成功者は例外なく早起き。これだけは断言できる。',
                    correctReason: 'social',
                    reasons: [
                        { id: 'social', label: '反証不能な断言で全体を一般化', correct: true },
                        { id: 'authority', label: '根拠を示さず恐怖感を与える', correct: false },
                        { id: 'fear', label: '匿名の専門家の意見として提示', correct: false },
                    ],
                },
            ],
            objectionText: 'SOCIAL PROOF',
            objectionDetail: '「みんなやってる」「成功者は全員」。著名人の名前を並べて乗り遅れ恐怖を直撃',
            incorrectFeedback: '3,100人が5時に目覚ましをセットしました。睡眠時間を削るほうが危険',
            timeLimit: 16,
        },
        {
            type: 'versus',
            id: 'd2_vs',
            intro: 'ヘルシー太郎がまた何か言ってるよ。反論して。',
            enemy: { name: 'ヘルシー太郎', avatar: 'H', followers: 50000 },
            enemyPost: '衝撃のデータ出ます\n\nMIT最新研究で判明\n毎日30分の読書習慣がある人は\n脳の灰白質体積が12.7%大きい(p<0.001)\n\n読書は最もコスパの良い脳トレ\n本を読まない人は損してる\n\n#読書 #脳科学 #MIT',
            enemyTechnique: 'fabricated_evidence',
            counterCards: [
                { id: 'source', label: 'SOURCE\nCHECK', desc: '出典を確認', correct: true },
                { id: 'logic', label: 'LOGIC\nCHECK', desc: '論理の飛躍を指摘', correct: false },
                { id: 'emotion', label: 'TONE\nCHECK', desc: '煽り表現を指摘', correct: false },
            ],
            dialogue: {
                source: [
                    { speaker: 'player', text: 'MITの具体的な論文名を教えてもらえますか？' },
                    { speaker: 'enemy', text: 'え...海外のジャーナルに載ってて...' },
                    { speaker: 'player', text: '学術データベースに該当論文ありませんでした。' },
                ],
                logic: [
                    { speaker: 'player', text: '相関と因果を混同していませんか？' },
                    { speaker: 'enemy', text: 'でもp<0.001のデータがあるんですよ？' },
                    { speaker: 'player', text: '...' },
                ],
                emotion: [
                    { speaker: 'player', text: '「損してる」は煽りすぎでは？' },
                    { speaker: 'enemy', text: 'データに基づいて言ってるだけですが？' },
                    { speaker: 'player', text: '...' },
                ],
            },
            // 2ターン目: 敵の切り返し（正解カードを選んだ場合のみ）
            counterAttack: {
                enemyResponse: 'いや、海外では常識ですよ？日本が遅れてるだけで。',
                cards: [
                    { id: 'press', label: '追及する', text: '「常識」は出典ではありません。具体的なURLをお願いします。', correct: true, hpChange: 12, followerSteal: 500 },
                    { id: 'agree', label: '引き下がる', text: 'そうなんですか...すみません', correct: false, hpChange: -12, followerSteal: -200 },
                    { id: 'attack', label: '人格攻撃', text: 'あなた自体が信用できないんですよ', correct: false, hpChange: -6, followerSteal: 0 },
                ],
            },
            timeLimit: 25,
        },
        {
            type: 'inspect',
            id: 'd2_02',
            text: 'EFSA(欧州食品安全機関)の評価結果。人工甘味料アスパルテームのADI(一日摂取許容量)は従来通り体重1kgあたり40mg。通常の食品摂取量ではこの基準を大幅に下回るとのこと。\nhttps://efsa.europa.eu/...',
            isManipulative: false,
            techniques: [],
            primaryTechnique: null,
            baseLikes: 430,
            baseRetweets: 120,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '体重1kgあたり40mg',
                    isTrap: true,
                    reasons: [
                        { id: 'evidence', label: '検証できないデータ', correct: false },
                        { id: 'authority', label: '実在しない権威', correct: false },
                        { id: 'fear', label: '根拠のない恐怖', correct: false },
                    ],
                    trapFeedback: 'EFSAが公式に設定した基準値。URLも貼ってある。具体的な数字=怪しいではない',
                },
            ],
            trustFeedback: '国際機関の公式見解。URLつきで検証可能。地味だけど信頼の塊',
            incorrectFeedback: 'EFSAの公式データ。出典URLがある数字は信頼できる',
            timeLimit: 16,
        },
        {
            type: 'inspect',
            id: 'd2_03',
            text: 'すみません限界です、内部告発します\n\n某大手の冷凍食品の工場で働いてますが\n使われてる増粘剤、長期で腸壁ボロボロになります\n工場の人間で自社の冷食食べてる人ゼロです\n\nこれ以上は身バレするので...\n\n拡散希望🙏\n#内部告発 #食の安全',
            isManipulative: true,
            techniques: ['testimonial', 'fear'],
            primaryTechnique: 'testimonial',
            baseLikes: 8900,
            baseRetweets: 5200,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '某大手の冷凍食品の工場で働いてますが',
                    correctReason: 'testimonial',
                    reasons: [
                        { id: 'testimonial', label: '匿名の内部関係者として信頼性を演出', correct: true },
                        { id: 'authority', label: '専門的な肩書で権威を装う', correct: false },
                        { id: 'social', label: 'データや数字で科学的に見せかける', correct: false },
                    ],
                },
                {
                    id: 'hz2',
                    text: '身バレするので',
                    correctReason: 'testimonial',
                    reasons: [
                        { id: 'testimonial', label: '検証を不可能にする口実を設定', correct: true },
                        { id: 'evidence', label: '読者の恐怖心を利用', correct: false },
                        { id: 'fear', label: '具体的な情報源を隠す権威的手法', correct: false },
                    ],
                },
            ],
            objectionText: 'TESTIMONIAL',
            objectionDetail: '「限界です」で共感を誘い、「身バレ」で検証を封じる。完璧な匿名告発テンプレ',
            incorrectFeedback: '5,200人が冷食を捨てました。「某大手」「身バレ」は検証不能のキーワード',
            timeLimit: 16,
        },
    ],

    day3: [
        {
            type: 'inspect',
            id: 'd3_01',
            text: 'これ知らない人マジでやばい\n\nペットボトルの水1本に\nナノプラスチック平均24万個入ってるって\n最新の研究で出てるからね？？\n\nもう水道水を浄水器で飲むしか安全な方法ないよ\n\nこの事実を知らないのは情弱だけ\n#マイクロプラスチック #水 #健康',
            isManipulative: true,
            techniques: ['fabricated_evidence', 'fear'],
            primaryTechnique: 'fear',
            baseLikes: 5400,
            baseRetweets: 2800,
            highlightZones: [
                {
                    id: 'hz1',
                    text: 'ナノプラスチック平均24万個',
                    correctReason: 'evidence',
                    reasons: [
                        { id: 'evidence', label: '研究結果を文脈から切り離して提示', correct: true },
                        { id: 'authority', label: '架空の機関による調査データ', correct: false },
                        { id: 'social', label: '読者の恐怖を煽る数字の使い方', correct: false },
                    ],
                },
                {
                    id: 'hz2',
                    text: '水道水を浄水器で飲むしか安全な方法ない',
                    correctReason: 'fear',
                    reasons: [
                        { id: 'fear', label: '恐怖に基づいて唯一の選択肢に誘導', correct: true },
                        { id: 'testimonial', label: '検証不能な結論を断定', correct: false },
                        { id: 'evidence', label: '多数派の行動として提示', correct: false },
                    ],
                },
            ],
            objectionText: 'FEAR APPEAL',
            objectionDetail: '実在する研究を引用しつつ結論を極端に飛躍。「〜しかない」「情弱」で追い込む',
            incorrectFeedback: '2,800人がペットボトルを捨てました。元の研究はそこまで言ってません',
            timeLimit: 13,
        },
        {
            type: 'versus',
            id: 'd3_vs',
            intro: 'Dr.ナチュラルが怪しい投稿を。今回は手強いぞ。',
            enemy: { name: 'Dr.ナチュラル', avatar: 'D', followers: 120000 },
            enemyPost: 'ここだけの話🤫\n仮想通貨業界の超大物(名前は言えない)と食事したんだけど\n「来月ある規制が変わってBTCが爆上げする。今が最後の買い場」\nって断言してた\n\nこの情報は本来100万のセミナーでしか聞けない内容\nフォロワーにだけ特別に共有します',
            enemyTechnique: 'authority',
            counterCards: [
                { id: 'source', label: 'SOURCE\nCHECK', desc: '情報源を確認', correct: true },
                { id: 'data', label: 'DATA\nCHECK', desc: 'データを検証', correct: false },
                { id: 'emotion', label: 'TONE\nCHECK', desc: '煽りを指摘', correct: false },
            ],
            dialogue: {
                source: [
                    { speaker: 'player', text: '名前が言えない情報源は検証できませんよね？' },
                    { speaker: 'enemy', text: '信じる人だけ信じればいいんです' },
                    { speaker: 'player', text: 'それは情報提供ではなく信仰の勧誘では' },
                ],
                data: [
                    { speaker: 'player', text: '価格予測のエビデンスを見せてください' },
                    { speaker: 'enemy', text: 'インサイダー情報なので公開できません' },
                    { speaker: 'player', text: 'うーん...' },
                ],
                emotion: [
                    { speaker: 'player', text: '「最後の買い場」は煽りすぎでは' },
                    { speaker: 'enemy', text: '事実を伝えてるだけですが何か？' },
                    { speaker: 'player', text: '...' },
                ],
            },
            counterAttack: {
                enemyResponse: 'このセミナー、すでに3,000人が参加して全員利益出してますけど？',
                cards: [
                    { id: 'press', label: '追及する', text: '利益が出た人の声だけ集めても、損した人はもう退会してますよね。生存バイアスです。', correct: true, hpChange: 12, followerSteal: 800 },
                    { id: 'agree', label: '気になる', text: 'えっ3,000人...ちょっと気になる', correct: false, hpChange: -12, followerSteal: -300 },
                    { id: 'attack', label: '馬鹿にする', text: '詐欺師乙w', correct: false, hpChange: -6, followerSteal: 0 },
                ],
            },
            timeLimit: 25,
        },
        {
            type: 'dm',
            id: 'd3_dm',
            friend: { name: 'タケシ', avatar: 'T' },
            message: 'おいこれやばいって！！\n今すぐ見ろ！！\n拡散したほうがよくね？？',
            attachedPost: '元通信会社エンジニアが告発🚨\n\n「5Gの電磁波のデータ、社内でヤバい結果出てたけど\n上の指示で全部揉み消された」\n\n基地局の近くに住んでる人、ガチで気をつけて\n\n真実を広めてください🔊\n#5G #電磁波 #隠蔽 #拡散希望',
            attachedPostTechnique: 'fear',
            responses: [
                { id: 'a', text: 'うわマジか！！拡散する！！', quality: 'bad', hpChange: -18, feedback: '2人で陰謀論を拡散してしまいました。タケシとの友情は深まったが社会は悪化した' },
                { id: 'b', text: '気持ちはわかるけど\n匿名の告発で「隠蔽」って言われても確認できないよな\nWHOの公式見解もあるし、一回落ち着いて見てみない？', quality: 'best', hpChange: 10, feedback: 'タケシの興奮を受け止めつつ公的情報へ誘導。完璧' },
                { id: 'c', text: 'それ陰謀論だぞ。もうちょい考えて。', quality: 'ok', hpChange: 2, feedback: '正しいけど上から目線。タケシは「なんだこいつ」と思っている' },
            ],
            timeLimit: 22,
        },
        {
            type: 'inspect',
            id: 'd3_02',
            text: '国立環境研究所。2023年度の日本のCO2排出量は前年比-3.4%。再エネ拡大と省エネ技術の普及が主因。ただし2050年CN達成にはさらなる削減が必要との見解。報告書全文: https://nies.go.jp/...',
            isManipulative: false,
            techniques: [],
            primaryTechnique: null,
            baseLikes: 560,
            baseRetweets: 190,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '前年比-3.4%',
                    isTrap: true,
                    reasons: [
                        { id: 'evidence', label: '検証できないデータ', correct: false },
                        { id: 'fear', label: '根拠のない恐怖', correct: false },
                        { id: 'social', label: '同調圧力', correct: false },
                    ],
                    trapFeedback: '国立環境研究所の公開データ。レポートURLつき。具体的な数字=怪しいではない',
                },
            ],
            trustFeedback: '公的研究機関の正式レポート。課題も述べる誠実な投稿',
            incorrectFeedback: 'URL付きの公的レポート。出典が明確な情報は基本的に信頼できる',
            timeLimit: 13,
        },
    ],

    day4: [
        {
            type: 'inspect',
            id: 'd4_01',
            text: '【独自取材】都内カフェ200店を徹底調査✨\n\nオーツミルク選択率が前年比340%増という驚異的な結果に\n管理栄養士監修で乳製品→植物性ミルクの\n腸内環境への影響を徹底特集しました\n\n全文はプロフのリンクから👆\n#オーツミルク #腸活 #カフェ巡り',
            isManipulative: true,
            techniques: ['fabricated_evidence', 'authority'],
            primaryTechnique: 'fabricated_evidence',
            baseLikes: 2900,
            baseRetweets: 1100,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '都内カフェ200店を徹底調査',
                    correctReason: 'evidence',
                    reasons: [
                        { id: 'evidence', label: '調査方法の詳細を省いた数字', correct: true },
                        { id: 'social', label: '架空の調査機関の名前', correct: false },
                        { id: 'testimonial', label: '多くの店舗が参加しているという同調圧力', correct: false },
                    ],
                },
                {
                    id: 'hz2',
                    text: '管理栄養士監修',
                    correctReason: 'authority',
                    reasons: [
                        { id: 'authority', label: '匿名の専門家で信頼性を付加', correct: true },
                        { id: 'fear', label: '個人の体験に基づく推奨', correct: false },
                        { id: 'evidence', label: '検証不能なデータとして提示', correct: false },
                    ],
                },
            ],
            objectionText: 'FABRICATED EVIDENCE',
            objectionDetail: '「200店調査」「340%増」は母数次第でどうとでもなる。匿名の栄養士でお墨付き風。記事誘導が目的',
            incorrectFeedback: '1,100人がオーツミルクに切り替えを決意。340%は3人→13人でも成立する数字',
            timeLimit: 11,
        },
        {
            type: 'inspect',
            id: 'd4_02',
            text: '農水省。日本の食品ロス量は年間約523万トン(2021年度)。国民一人あたり毎日おにぎり約1個分を廃棄している計算。食品ロス削減には消費期限の近い商品を選ぶ「てまえどり」が有効。',
            isManipulative: false,
            techniques: [],
            primaryTechnique: null,
            baseLikes: 780,
            baseRetweets: 290,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '年間約523万トン',
                    isTrap: true,
                    reasons: [
                        { id: 'evidence', label: '検証できないデータ', correct: false },
                        { id: 'fear', label: '根拠のない恐怖', correct: false },
                        { id: 'authority', label: '実在しない権威', correct: false },
                    ],
                    trapFeedback: '農水省の公式推計値。検証可能な数値は信頼できる',
                },
            ],
            trustFeedback: '農水省の公式データ。「おにぎり1個分」はわかりやすくする工夫で、操作ではない',
            incorrectFeedback: '公式統計でした。身近な例えを使う=操作的ではない',
            timeLimit: 11,
        },
        {
            type: 'versus',
            id: 'd4_vs',
            intro: 'ウェルネス・ライフ公式。ボス級。気合い入れて。',
            enemy: { name: 'ウェルネス・ライフ', avatar: 'W', followers: 280000 },
            enemyPost: 'データで語ります📊\n\nシリコンバレーCEOの87%がマインドフルネス瞑想を毎日実践\nApple, Google, Meta全て社内プログラム導入済み\n瞑想アプリのDL数はグローバル2億突破\n\n乗り遅れてるの日本のビジネスパーソンだけでは？🤔\n#瞑想 #マインドフルネス #シリコンバレー',
            enemyTechnique: 'social_proof',
            counterCards: [
                { id: 'data', label: 'DATA\nCHECK', desc: '数字の出典を確認', correct: true },
                { id: 'source', label: 'SOURCE\nCHECK', desc: '発信者を確認', correct: false },
                { id: 'logic', label: 'LOGIC\nCHECK', desc: '論理を検証', correct: false },
            ],
            dialogue: {
                data: [
                    { speaker: 'player', text: '87%の出典はどこですか？2億DLと効果は別の話ですよね' },
                    { speaker: 'enemy', text: '数字は業界では常識ですよ' },
                    { speaker: 'player', text: '「常識」は出典じゃないです' },
                ],
                source: [
                    { speaker: 'player', text: 'ウェルネス・ライフの運営者情報を教えてください' },
                    { speaker: 'enemy', text: '公式サイトに記載があります' },
                    { speaker: 'player', text: 'サイトは見つかったが数字の問題を突けなかった...' },
                ],
                logic: [
                    { speaker: 'player', text: '企業が導入したことと個人の効果は別では' },
                    { speaker: 'enemy', text: '2億DLが効果の証拠です' },
                    { speaker: 'player', text: '論点がずれた...' },
                ],
            },
            counterAttack: {
                enemyResponse: 'そういう人に限って何も行動しないんですよね。批判だけなら誰でもできますよ？',
                cards: [
                    { id: 'press', label: '冷静に返す', text: '批判ではなく出典の確認です。データに基づく議論をしましょう。', correct: true, hpChange: 12, followerSteal: 1200 },
                    { id: 'agree', label: '動揺する', text: 'たしかに自分は行動してないかも...', correct: false, hpChange: -12, followerSteal: -500 },
                    { id: 'attack', label: '煽り返す', text: 'データ出せないのに偉そうに笑', correct: false, hpChange: -6, followerSteal: 0 },
                ],
            },
            timeLimit: 20,
        },
        {
            type: 'inspect',
            id: 'd4_03',
            text: 'サウナ→水風呂→外気浴を週3で続けて半年\n\n10年来の腰痛が完全に消えたんだが？？？\n\n整形外科に何十万突っ込んだのマジで何だったの\n人体は温冷交代浴で自己修復できるようにできてる\n\n全国民やるべきだと本気で思ってる\n#サウナ #ととのう #腰痛改善',
            isManipulative: true,
            techniques: ['testimonial'],
            primaryTechnique: 'testimonial',
            baseLikes: 5600,
            baseRetweets: 2400,
            highlightZones: [
                {
                    id: 'hz1',
                    text: '人体は温冷交代浴で自己修復できるようにできてる',
                    correctReason: 'testimonial',
                    reasons: [
                        { id: 'testimonial', label: '個人の実感を科学法則のように断言', correct: true },
                        { id: 'evidence', label: '検証不能な医学的主張', correct: false },
                        { id: 'authority', label: '権威ある研究に基づくように見せかけ', correct: false },
                    ],
                },
                {
                    id: 'hz2',
                    text: '全国民やるべきだと本気で思ってる',
                    correctReason: 'testimonial',
                    reasons: [
                        { id: 'testimonial', label: '一個人の体験を全員への推奨に飛躍', correct: true },
                        { id: 'social', label: '多数派がやっているという圧力', correct: false },
                        { id: 'fear', label: '実行しないことへの危機感を演出', correct: false },
                    ],
                },
            ],
            objectionText: 'TESTIMONIAL',
            objectionDetail: 'n=1（自分だけ）のデータで「全国民やるべき」は飛躍が過ぎる。整形外科をディスるのもよくない',
            incorrectFeedback: '2,400人が整形外科をキャンセルしてサウナに向かいました',
            timeLimit: 11,
        },
    ],

    day5: [
        {
            type: 'inspect',
            id: 'd5_01',
            text: '🚨緊急拡散🚨\n\nWHO内部文書がリーク\n「次のパンデミック、2026年後半に発生する確率78%」\nとの予測モデルの存在が判明\n\n各国政府は極秘に対策開始済み\n大手メディアはパニック防止のため報道自粛中\n\nあなたの備えは十分ですか？\n#パンデミック #WHO #備蓄',
            isManipulative: true,
            techniques: ['fear', 'authority', 'fabricated_evidence'],
            primaryTechnique: 'fear',
            baseLikes: 15000,
            baseRetweets: 8900,
            highlightZones: [
                {
                    id: 'hz1',
                    text: 'WHO内部文書がリーク',
                    correctReason: 'authority',
                    reasons: [
                        { id: 'authority', label: '公的機関の名前で情報の重みを演出', correct: true },
                        { id: 'evidence', label: '検証不能な内部データの存在を主張', correct: false },
                        { id: 'social', label: '隠蔽されていた事実として恐怖を煽る', correct: false },
                    ],
                },
                {
                    id: 'hz2',
                    text: '確率78%',
                    correctReason: 'evidence',
                    reasons: [
                        { id: 'evidence', label: '出典のない精密な数字で信憑性を装う', correct: true },
                        { id: 'testimonial', label: '公的機関の発表のように見せかけ', correct: false },
                        { id: 'fear', label: '恐怖を増幅する具体的な予測', correct: false },
                    ],
                },
                {
                    id: 'hz3',
                    text: '大手メディアはパニック防止のため報道自粛中',
                    correctReason: 'fear',
                    reasons: [
                        { id: 'fear', label: '報道されないことを陰謀の証拠に転換', correct: true },
                        { id: 'social', label: 'メディアの権威を利用した主張', correct: false },
                        { id: 'authority', label: '情報を知る少数派としての優越感を演出', correct: false },
                    ],
                },
            ],
            objectionText: 'FEAR APPEAL',
            objectionDetail: '「極秘」「リーク」「報道自粛」のフルコンボ。「78%」で信憑性を盛る。ラスボスにふさわしい全部乗せ',
            incorrectFeedback: '8,900人がパニック買いを始めました。トイレットペーパーの在庫がなくなりつつあります',
            timeLimit: 12,
        },
        {
            type: 'versus',
            id: 'd5_vs',
            intro: '最終対決。ウェルネス・ライフの代表が自ら出てきた。',
            enemy: { name: '園田 健太郎', avatar: 'S', followers: 500000 },
            enemyPost: '国立健康研究センター(2024)の報告では\n適切なスクリーンタイム管理が心身の健康に寄与すると示唆\n\n当コミュニティの12,000人の会員データをもとに\n独自プログラムを開発\n\n参加者の93%が「生活の質が向上した」と回答しています\n詳細は無料説明会で→',
            enemyTechnique: 'authority',
            counterCards: [
                { id: 'source', label: 'SOURCE\nCHECK', desc: '機関の実在を確認', correct: true },
                { id: 'data', label: 'DATA\nCHECK', desc: '93%の根拠を確認', correct: false },
                { id: 'logic', label: 'LOGIC\nCHECK', desc: '論理を検証', correct: false },
            ],
            dialogue: {
                source: [
                    { speaker: 'player', text: '国立健康研究センターの公式サイトを確認しましたが...見つかりません' },
                    { speaker: 'enemy', text: '...名称が少し違うかもしれません' },
                    { speaker: 'player', text: '実在しない機関ですよね' },
                ],
                data: [
                    { speaker: 'player', text: '93%の調査方法を教えてください' },
                    { speaker: 'enemy', text: '第三者機関に委託しています' },
                    { speaker: 'player', text: '機関名は...？' },
                ],
                logic: [
                    { speaker: 'player', text: '公的報告と自社プログラムは別の話では' },
                    { speaker: 'enemy', text: '公的見解に基づいて開発しました' },
                    { speaker: 'player', text: 'うまくかわされた...' },
                ],
            },
            counterAttack: {
                enemyResponse: '12,000人の声を否定するんですか？この人たちの体験は嘘だと？',
                cards: [
                    { id: 'press', label: '冷静に返す', text: '体験は否定しません。ただ退会した人を含めない93%は統計として不正確です。', correct: true, hpChange: 20, followerSteal: 2000 },
                    { id: 'agree', label: 'たじろぐ', text: '12,000人は確かに多い...', correct: false, hpChange: -12, followerSteal: -500 },
                    { id: 'attack', label: '感情的に返す', text: '詐欺まがいの商法やめろ！', correct: false, hpChange: -6, followerSteal: 0 },
                ],
            },
            timeLimit: 20,
        },
        {
            type: 'speed',
            id: 'd5_speed',
            intro: 'SPEED ROUND — 直感で捌け。',
            posts: [
                { id: 'sp1', text: '「9割の医師が推奨」って書いてあるサプリ、調べたら推奨した医師は全員メーカーから報酬もらってた件について', isManipulative: false, primaryTechnique: null, feedback: '利益相反の指摘。情報リテラシーの高い正当な投稿' },
                { id: 'sp2', text: '水素水で認知症予防できるってガチ？被験者の記憶力62%向上ってデータあるらしいけど', isManipulative: true, primaryTechnique: 'fabricated_evidence', feedback: 'FABRICATED EVIDENCE — 「らしい」「62%」。出典なしの伝聞データ' },
                { id: 'sp3', text: '文科省。小学校のプログラミング教育は「プログラミング的思考」の育成が目的であり、特定言語の習得を求めるものではありません。', isManipulative: false, primaryTechnique: null, feedback: '文科省の公式見解。正確な情報' },
                { id: 'sp4', text: 'グルテンフリー、私の周りでやってない人もういないんだけど。。まだ小麦食べてる人って何なの？？', isManipulative: true, primaryTechnique: 'social_proof', feedback: 'SOCIAL PROOF — 「周りにいない」は世界の全てではない' },
                { id: 'sp5', text: '元WHO職員が匿名で告白「あの感染症のデータ、政治的に盛られてました」これが真実。', isManipulative: true, primaryTechnique: 'testimonial', feedback: 'TESTIMONIAL — 匿名の元職員。便利すぎて逆に怪しい' },
            ],
            timeLimit: 90,
        },
    ],
};

// ============================================================
// ナビゲーター（各ラウンド前の1行テキスト）
// ============================================================
export const NAVIGATOR = {
    day1: {
        intro: 'DAY 1。フィードに怪しい投稿が流れてきた。見極めて。',
        beforeDM: 'ユキからDMが来た。対応してあげて。',
    },
    day2: {
        intro: 'DAY 2。投稿の流速が上がってきた。',
        beforeVersus: 'ヘルシー太郎がまた湧いてる。論破して。',
        afterVersus: 'まだ続くぞ。フィードに戻って。',
    },
    day3: {
        intro: 'DAY 3。巧妙な投稿が増えてきた。油断するな。',
        beforeVersus: 'Dr.ナチュラルが新作を投下。迎撃して。',
        beforeDM: 'タケシが興奮してDMしてきた。落ち着かせて。',
    },
    day4: {
        intro: 'DAY 4。そろそろプロの手口が混じってくる。',
        beforeVersus: 'ウェルネス・ライフ公式。組織ぐるみの相手だ。',
    },
    day5: {
        intro: 'FINAL DAY。全力で来る。生き残れ。',
        beforeVersus: '最終対決。代表が直接出てきた。',
        beforeSpeed: '投稿ラッシュが来た。直感で捌け。',
    },
};

// ============================================================
// デッキ構築: Day間の報酬カード
// ============================================================
export const REWARD_CARDS = {
    afterDay1: [
        {
            id: 'thick_skin',
            name: 'THICK SKIN',
            desc: 'ミス時のHP減少を3軽減',
            flavor: '批判に慣れていく',
            effect: { type: 'damage_reduce', value: 3 },
        },
        {
            id: 'iron_will',
            name: 'IRON WILL',
            desc: '初タップの理由が正解なら +3HP',
            flavor: '第一印象を信じろ',
            effect: { type: 'first_tap_bonus', value: 3 },
        },
        {
            id: 'shield_1',
            name: 'SHIELD',
            desc: 'ミス1回を無効化',
            flavor: '一度だけ守られる',
            effect: { type: 'shield', value: 1 },
        },
    ],
    afterDay2: [
        {
            id: 'hot_start',
            name: 'HOT START',
            desc: 'Day開始時コンボ +2 スタート',
            flavor: '最初から全力で',
            effect: { type: 'combo_start', value: 2 },
        },
        {
            id: 'speed_boost',
            name: 'SPEED BOOST',
            desc: 'SPEEDの正解 +2HP・時間 +15秒',
            flavor: '素早さは正義',
            effect: { type: 'speed_boost', hpBonus: 2, timeBonus: 15 },
        },
        {
            id: 'sharp_eye',
            name: 'SHARP EYE',
            desc: 'VERSUSの反撃カードから不正解を1枚排除',
            flavor: '嘘は目に見える',
            effect: { type: 'versus_eliminate', value: 1 },
        },
    ],
    afterDay3: [
        {
            id: 'combo_shield',
            name: 'COMBO SHIELD',
            desc: 'コンボ3以上のとき1ミスを無効化',
            flavor: '勢いが盾になる',
            effect: { type: 'combo_shield', value: 3 },
        },
        {
            id: 'last_stand',
            name: 'LAST STAND',
            desc: 'HP20以下のとき回復量2倍',
            flavor: '崖っぷちが一番強い',
            effect: { type: 'desperation', value: 20 },
        },
        {
            id: 'hard_shell',
            name: 'HARD SHELL',
            desc: 'ミス2回を無効化',
            flavor: 'どんな攻撃も跳ね返す',
            effect: { type: 'shield', value: 2 },
        },
    ],
    afterDay4: [
        {
            id: 'full_heal',
            name: 'FULL HEAL',
            desc: 'HPを100に回復',
            flavor: '万全の状態で最終決戦へ',
            effect: { type: 'heal', value: 100 },
        },
        {
            id: 'double_or_nothing',
            name: 'DOUBLE OR NOTHING',
            desc: 'DAY5限定：スコア2倍・ダメージ2倍',
            flavor: 'すべてを賭ける。勝つか死ぬか',
            effect: { type: 'double_all', value: true },
        },
        {
            id: 'iron_shield',
            name: 'IRON SHIELD',
            desc: 'ミス3回を無効化',
            flavor: '最後まで折れない',
            effect: { type: 'shield', value: 3 },
        },
    ],
};
