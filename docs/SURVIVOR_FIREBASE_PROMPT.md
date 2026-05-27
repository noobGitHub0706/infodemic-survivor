# インフォデミック・サバイバー Firebase接続

ゲームデータをFirebaseに保存し、研究ポータルとID連携できるようにします。

## 1. Firebase セットアップ

Infodemic Chronicleと同じFirebaseプロジェクトを使用。
src/lib/firebase.js を作成:

```javascript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

.env ファイルにFirebaseの設定値を記入（Infodemic Chronicleと同じ値）。

## 2. 参加者IDの受け取り

研究ポータルからリダイレクトされてくる場合:
  URL: https://game.example.com/?id=IC-xxx

URLパラメータから id を取得:
```javascript
const params = new URLSearchParams(window.location.search);
const participantId = params.get('id');
```

idがない場合（直接アクセス）:
  自動でセッションIDを生成: `anon_${Date.now()}_${Math.random().toString(36).slice(2,6)}`
  匿名プレイヤーとして記録（研究データとしては使わないが、ゲーム改善用に保存）

## 3. データ保存のタイミングと構造

Firestoreコレクション: `survivor_sessions`

### 3-1. ゲーム開始時

```javascript
// survivor_sessions/{participantId || sessionId}
{
    participantId: string | null,  // 研究ポータル経由ならID、直接アクセスならnull
    sessionId: string,
    startedAt: serverTimestamp(),
    completed: false,
    status: 'playing',
    userAgent: navigator.userAgent,  // デバイス情報
}
```

### 3-2. 各Day完了時

Day完了のたびに保存（ブラウザクラッシュ対策）。

```javascript
// survivor_sessions/{id} を merge: true で更新
{
    [`day${dayNum}`]: {
        answers: [...],          // そのDayの全回答
        summary: {
            correct, total, accuracy, hpStart, hpEnd, durationMs,
        },
        cardSelected: cardId | null,  // Day後に選んだカード
        completedAt: serverTimestamp(),
    },
    lastActiveDay: dayNum,
    status: 'playing',
}
```

### 3-3. ゲーム完了時

```javascript
// survivor_sessions/{id} を merge: true で更新
{
    completed: true,
    status: 'complete',
    completedAt: serverTimestamp(),
    totalDurationMs: number,
    gameOverDay: number | null,
    retryCount: number,

    result: {
        totalScore, rank, accuracy, maxCombo,
        finalHp, finalFollowers, enemyFollowersStolen,
    },

    techniqueAccuracy: {
        fear: { correct, total },
        authority: { correct, total },
        fabricated_evidence: { correct, total },
        testimonial: { correct, total },
        social_proof: { correct, total },
    },

    cardSelections: [
        { afterDay: 1, selectedCardId: 'extra_time' },
        { afterDay: 2, selectedCardId: 'armor' },
        ...
    ],

    allAnswers: [...],  // 全Dayの全回答を1つの配列にまとめたもの
}
```

### 3-4. ゲームオーバー時

```javascript
{
    status: 'game_over',
    gameOverDay: number,
    retryCount: number,
    // 以降リトライした場合は status が 'playing' に戻る
    // 最終的に complete または game_over_final になる
}
```

## 4. 実装: useGameData.js

新しいhook: src/hooks/useGameData.js

```javascript
import { doc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useGameData(participantId) {
    const sessionId = participantId || `anon_${Date.now()}_${Math.random().toString(36).slice(2,6)}`;
    const docRef = doc(db, 'survivor_sessions', sessionId);

    const initSession = async () => {
        try {
            await setDoc(docRef, {
                participantId: participantId || null,
                sessionId,
                startedAt: serverTimestamp(),
                completed: false,
                status: 'playing',
                userAgent: navigator.userAgent,
            });
        } catch (e) {
            console.error('[Firebase] initSession error:', e);
        }
    };

    const saveDayResult = async (dayNum, dayData) => {
        try {
            await updateDoc(docRef, {
                [`day${dayNum}`]: {
                    ...dayData,
                    completedAt: serverTimestamp(),
                },
                lastActiveDay: dayNum,
            });
        } catch (e) {
            console.error('[Firebase] saveDayResult error:', e);
        }
    };

    const saveGameComplete = async (resultData) => {
        try {
            await updateDoc(docRef, {
                ...resultData,
                completed: true,
                status: 'complete',
                completedAt: serverTimestamp(),
            });
        } catch (e) {
            console.error('[Firebase] saveGameComplete error:', e);
        }
    };

    const saveGameOver = async (gameOverData) => {
        try {
            await updateDoc(docRef, {
                ...gameOverData,
                status: 'game_over',
            });
        } catch (e) {
            console.error('[Firebase] saveGameOver error:', e);
        }
    };

    return { sessionId, initSession, saveDayResult, saveGameComplete, saveGameOver };
}
```

## 5. GameEngine.jsx への統合

```javascript
// GameEngine.jsx
const params = new URLSearchParams(window.location.search);
const participantId = params.get('id');

const { sessionId, initSession, saveDayResult, saveGameComplete, saveGameOver } = useGameData(participantId);

// ゲーム開始時
useEffect(() => {
    if (phase !== 'title') return;
    initSession();
}, []);

// Day完了時
const handleDayComplete = (dayNum, dayData) => {
    saveDayResult(dayNum, {
        answers: dayData.answers,
        summary: dayData.summary,
        cardSelected: dayData.cardSelected,
    });
};

// ゲーム完了時
const handleGameComplete = (resultData) => {
    saveGameComplete({
        totalDurationMs: Date.now() - gameStartTime,
        gameOverDay: null,
        retryCount: state.retryCount,
        result: resultData.result,
        techniqueAccuracy: resultData.techniqueAccuracy,
        cardSelections: resultData.cardSelections,
        allAnswers: resultData.allAnswers,
    });

    // 研究ポータルへのリダイレクト（participantIdがある場合のみ）
    if (participantId) {
        const returnUrl = import.meta.env.VITE_RESEARCH_PORTAL_URL;
        if (returnUrl) {
            setTimeout(() => {
                window.location.href = `${returnUrl}/?id=${participantId}&phase=postMediator`;
            }, 3000); // 結果画面を3秒見せてからリダイレクト
        }
    }
};

// ゲームオーバー時
const handleGameOver = (day) => {
    saveGameOver({
        gameOverDay: day,
        retryCount: state.retryCount,
    });
};
```

## 6. 回答データの記録

useGameState.js で各ラウンドの完了時に answer オブジェクトを構築:

```javascript
const recordAnswer = (postData, playerAction) => {
    const answer = {
        id: postData.id,
        day: currentDay,
        type: postData.type,
        isManipulative: postData.isManipulative,
        techniques: postData.techniques || [],
        primaryTechnique: postData.primaryTechnique,
        action: playerAction.action,
        isCorrect: playerAction.isCorrect,
        responseTimeMs: playerAction.responseTimeMs,
        highlightedZones: playerAction.highlightedZones || null,
        selectedCard: playerAction.selectedCard || null,
        counterAttackChoice: playerAction.counterAttackChoice || null,
        followerSteal: playerAction.followerSteal || null,
        selectedResponse: playerAction.selectedResponse || null,
        responseQuality: playerAction.responseQuality || null,
        hpBefore: state.hp,
        hpAfter: state.hp + playerAction.hpChange,
        scoreBefore: state.score,
        scoreAfter: state.score + playerAction.scoreChange,
        comboCount: state.combo,
    };
    dispatch({ type: 'RECORD_ANSWER', payload: answer });
};
```

## 7. Firebase セキュリティルール

Firebaseコンソールで survivor_sessions コレクションへのアクセスを許可:

```
match /survivor_sessions/{sessionId} {
    allow create, update: if true;
    allow read: if true;
    allow delete: if true;  // 開発中のみ
}
```

## 8. 研究ポータルへのリダイレクト

ゲーム完了時（結果画面表示後）に研究ポータルへ戻す。

.env に追加:
  VITE_RESEARCH_PORTAL_URL=https://research.example.com

participantId がある場合のみリダイレクト。
ない場合（直接アクセス）はリダイレクトしない。

リダイレクト前に結果画面を見せる:
  「結果をシェア」ボタンの横に
  「3秒後に次のステップに移動します...」と表示
  または [次のステップへ] ボタンを表示

## 9. エラーハンドリング

Firebase接続エラーはゲーム体験を中断しない:
- 全てのFirebase操作をtry-catchで囲む
- エラー時はconsole.errorのみ
- ゲーム自体は正常に動作し続ける
- オフラインでもプレイ可能（データは失われるが体験は保たれる）

## 10. 動作確認

1. npm install firebase を実行
2. .env にFirebase設定値を記入
3. ゲームを開始してFirebaseコンソールでsurvivor_sessionsにドキュメントが作成されることを確認
4. Day完了時にデータが更新されることを確認
5. ゲーム完了時にresultとallAnswersが保存されることを確認
6. ?id=TEST-001 でアクセスした場合、participantIdが記録されることを確認
7. idなしでアクセスした場合、anon_xxxのsessionIdが記録されることを確認
