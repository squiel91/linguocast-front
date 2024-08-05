import { cn } from '@/utils/styles.utils';
import styles from './styles.soundwave.ui..module.css';

export const Soundwave = ({ className }: { className?: CSSStyleValue }) => (
  <div className={cn(styles.soundwave, className)}>
    <div className={styles.stroke} />
    <div className={styles.stroke} />
    <div className={styles.stroke} />
    <div className={styles.stroke} />
    <div className={styles.stroke} />
    <div className={styles.stroke} />
    <div className={styles.stroke} />
  </div>
)