import React from 'react';
import styles from './DeliveryStatusCard.module.css';

const STEPS = ['상품 준비중', '택배사 전달', '배송중', '배송 완료'];

export default function DeliveryStatusCard({ delivery }) {
  const date = delivery?.date ?? '';
  const summary = delivery?.summary ?? '조회 가능한 배송 정보가 없습니다.';
  const currentStep = Number.isInteger(delivery?.currentStep)
    ? delivery.currentStep
    : null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {date && <span className={styles.date}>{date}</span>}
        <span className={styles.summary}>{summary}</span>
      </div>

      <div className={styles.divider} />

      <div className={styles.progressWrap} aria-label="배송 진행 상태">
        {STEPS.map((label, idx) => {
          const isCurrent = currentStep !== null && idx === currentStep;
          const isCurrentSegment =
            currentStep !== null &&
            idx === currentStep && // 현재 단계의 "오른쪽 구간"
            idx !== STEPS.length - 1; // 마지막이면 구간 없음

          return (
            <React.Fragment key={label}>
              <div
                className={`${styles.step} ${
                  isCurrent ? styles.stepCurrent : ''
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {label}
              </div>

              {/* ✅ 라인은 항상 렌더링(공간 유지), 현재 구간만 보이게 */}
              {idx !== STEPS.length - 1 && (
                <div
                  className={`${styles.line} ${
                    isCurrentSegment ? styles.lineVisible : ''
                  }`}
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
