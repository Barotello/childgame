import React, { useEffect, useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { gameTheme } from '@/constants/gameTheme';
import { useI18n } from '@/lib/i18n';

type ParentGateProps = {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function ParentGate({ visible, onClose, onSuccess }: ParentGateProps) {
  const { t } = useI18n();
  const [wrong, setWrong] = useState(false);
  const [holding, setHolding] = useState(false);
  const [stage, setStage] = useState<'hold' | 'question'>('hold');
  const [challenge, setChallenge] = useState(() => createChallenge());
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cancelHold = () => {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    holdTimer.current = null;
    setHolding(false);
  };

  const startHold = () => {
    cancelHold();
    setHolding(true);
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      setHolding(false);
      setStage('question');
    }, 1800);
  };

  useEffect(() => {
    if (!visible) return;
    setWrong(false);
    cancelHold();
    setStage('hold');
    setChallenge(createChallenge());
    return cancelHold;
  }, [visible]);

  const choose = (answer: number) => {
    if (answer === challenge.answer) {
      setWrong(false);
      onClose();
      setTimeout(onSuccess, 220);
      return;
    }
    setWrong(true);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Pressable
            onPress={onClose}
            style={styles.close}
            accessibilityRole="button"
            accessibilityLabel={t('close')}
          >
            <Feather name="x" size={22} color={gameTheme.colors.inkSoft} />
          </Pressable>
          <View style={styles.icon}>
            <Feather name="shield" size={32} color={gameTheme.colors.coral} />
          </View>
          <Text style={styles.title}>{t('parentGateTitle')}</Text>
          <Text style={styles.body}>
            {t(stage === 'hold' ? 'parentGateHold' : 'parentGateChallenge')}
          </Text>
          {stage === 'hold' ? (
            <Pressable
              onPressIn={startHold}
              onPressOut={cancelHold}
              style={[styles.holdButton, holding && styles.holdPressed]}
              accessibilityRole="button"
              accessibilityLabel={t('parentGateHoldButton')}
              accessibilityHint={t('parentGateHold')}
            >
              <Feather name={holding ? 'clock' : 'unlock'} size={26} color="#FFFFFF" />
              <Text style={styles.holdText}>{t('parentGateHoldButton')}</Text>
              <Text style={styles.holdSeconds}>{holding ? '…' : '2 sn'}</Text>
            </Pressable>
          ) : (
            <>
              <Text style={styles.question}>
                {challenge.left} × {challenge.right} − {challenge.subtract} = ?
              </Text>
              <View style={styles.answers}>
                {challenge.answers.map((answer) => (
              <Pressable
                key={answer}
                onPress={() => choose(answer)}
                style={({ pressed }) => [styles.answer, pressed && styles.answerPressed]}
                accessibilityRole="button"
                accessibilityLabel={String(answer)}
              >
                <Text style={styles.answerText}>{answer}</Text>
              </Pressable>
                ))}
              </View>
            </>
          )}
          {wrong ? <Text style={styles.wrong}>{t('parentGateWrong')}</Text> : null}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: 'rgba(61,49,91,0.48)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
    backgroundColor: gameTheme.colors.white,
    borderRadius: 30,
    borderWidth: 4,
    borderColor: '#F2E7D6',
    padding: 24,
  },
  close: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F1FA',
  },
  icon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF0EA',
    marginBottom: 12,
  },
  title: {
    color: gameTheme.colors.ink,
    fontSize: 22,
    fontWeight: '900',
  },
  body: {
    color: gameTheme.colors.inkSoft,
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  question: {
    color: gameTheme.colors.ink,
    fontSize: 30,
    fontWeight: '900',
    marginVertical: 20,
  },
  holdButton: {
    minWidth: 230,
    minHeight: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 24,
    backgroundColor: gameTheme.colors.coral,
    borderBottomWidth: 6,
    borderBottomColor: '#C94E3A',
    paddingHorizontal: 18,
    marginTop: 22,
  },
  holdPressed: { transform: [{ translateY: 3 }], borderBottomWidth: 3 },
  holdText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  holdSeconds: { color: '#FFFFFF', fontSize: 11, fontWeight: '900', opacity: 0.8 },
  answers: {
    flexDirection: 'row',
    gap: 12,
  },
  answer: {
    width: 68,
    height: 60,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: gameTheme.colors.skySoft,
    borderWidth: 3,
    borderColor: gameTheme.colors.sky,
  },
  answerPressed: {
    transform: [{ scale: 0.94 }],
  },
  answerText: {
    color: gameTheme.colors.ink,
    fontSize: 23,
    fontWeight: '900',
  },
  wrong: {
    color: '#A95D37',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 14,
  },
});

function createChallenge() {
  const left = 6 + Math.floor(Math.random() * 4);
  const right = 6 + Math.floor(Math.random() * 4);
  const subtract = 3 + Math.floor(Math.random() * 10);
  const answer = left * right - subtract;
  const answers = [answer, answer - 4, answer + 6, answer - 9]
    .sort(() => Math.random() - 0.5);
  return { left, right, subtract, answer, answers };
}
