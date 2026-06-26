import React, { useEffect, useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CountUpEasing = 'easeOut' | 'easeInOut' | 'linear';

export interface CountUpProps {
  /** Target number to count up to */
  to: number;
  /** Starting number (default 0) */
  from?: number;
  /** Animation duration in ms (default 1800) */
  duration?: number;
  /** Decimal places to display (default 0) */
  decimals?: number;
  /** Thousands separator (default ',') */
  separator?: string;
  /** Decimal point character (default '.') */
  decimal?: string;
  /** String prepended to the number (e.g. '$', '€') */
  prefix?: string;
  /** String appended to the number (e.g. '%', 'K', '+') */
  suffix?: string;
  /** Easing function */
  easing?: CountUpEasing;
  /** Start animating only when the element enters the viewport */
  triggerOnView?: boolean;
  /** Intersection observer threshold (0–1) */
  viewThreshold?: number;
  /** Re-trigger animation every time the element enters the viewport */
  repeat?: boolean;
  /** Called when the animation finishes */
  onComplete?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Easing functions ─────────────────────────────────────────────────────────

const easings: Record<CountUpEasing, (t: number) => number> = {
  linear:    (t) => t,
  easeOut:   (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

// ─── Formatter ────────────────────────────────────────────────────────────────

function formatNumber(
  value: number,
  decimals: number,
  separator: string,
  decimal: string,
): string {
  const fixed = value.toFixed(decimals);
  const [int, dec] = fixed.split('.');
  const intFormatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
  return dec !== undefined ? `${intFormatted}${decimal}${dec}` : intFormatted;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const NumberEl = styled.span`
  font-variant-numeric: tabular-nums;
  /* Inherits font/color from parent by default — override via className/style */
`;

// Visually hidden node that screen readers monitor via aria-live.
// The animated NumberEl is aria-hidden so readers don't announce every
// intermediate value — only the final value is announced, politely.
const SrOnly = styled.span`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// ─── StatCard — convenience wrapper used in stories ──────────────────────────

export const StatCard = styled.div`
  padding: ${spacing[6]};
  border: ${borderWidth[1]} solid ${colors.borderDefault};
  background-color: ${colors.bgPage};
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
  min-width: 180px;
`;

export const StatValue = styled.span`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize['4xl']};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textPrimary};
  letter-spacing: ${letterSpacing.tight};
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;

export const StatLabel = styled.span`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  font-weight: ${fontWeight.medium};
  letter-spacing: ${letterSpacing.widest};
  text-transform: uppercase;
  color: ${colors.textSecondary};
`;

export const StatDelta = styled.span<{ $positive?: boolean }>`
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.xs};
  color: ${({ $positive }) =>
    $positive === undefined
      ? colors.textSecondary
      : $positive
      ? colors.successBright
      : colors.errorBright};
  margin-top: ${spacing[1]};
`;

// ─── CountUp component ────────────────────────────────────────────────────────

export function CountUp({
  to,
  from = 0,
  duration = 1800,
  decimals = 0,
  separator = ',',
  decimal = '.',
  prefix = '',
  suffix = '',
  easing = 'easeOut',
  triggerOnView = true,
  viewThreshold = 0.3,
  repeat = false,
  onComplete,
  className,
  style,
}: CountUpProps) {
  const [displayValue,   setDisplayValue]   = useState(from);
  const [announcedValue, setAnnouncedValue] = useState(from);
  const [hasTriggered,   setHasTriggered]   = useState(false);
  const rafRef   = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const elRef    = useRef<HTMLSpanElement>(null);

  // Keep latest animation params in refs so the rAF tick always sees current
  // values without needing to recreate runAnimation on every prop change.
  // This lets runAnimation have a stable identity (deps: []) and removes
  // the need for the eslint-disable workaround.
  const toRef              = useRef(to);
  const fromRef            = useRef(from);
  const durationRef        = useRef(duration);
  const easeFnRef          = useRef(easings[easing]);
  const onCompleteRef      = useRef(onComplete);
  const setAnnouncedRef    = useRef(setAnnouncedValue);

  useEffect(() => { toRef.current = to; },             [to]);
  useEffect(() => { fromRef.current = from; },         [from]);
  useEffect(() => { durationRef.current = duration; }, [duration]);
  useEffect(() => { easeFnRef.current = easings[easing]; }, [easing]);
  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Stable reference — never recreated, always reads latest values via refs.
  const runAnimation = useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    startRef.current = null;

    // Skip animation entirely when the user has requested reduced motion.
    // Jump straight to the final value and announce it immediately.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(toRef.current);
      setAnnouncedRef.current(toRef.current);
      onCompleteRef.current?.();
      return;
    }

    const tick = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const elapsed      = timestamp - startRef.current;
      const progress     = Math.min(elapsed / durationRef.current, 1);
      const easedProgress = easeFnRef.current(progress);
      const current      = fromRef.current + (toRef.current - fromRef.current) * easedProgress;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setDisplayValue(toRef.current);
        // Only now announce the final value to screen readers
        setAnnouncedRef.current(toRef.current);
        onCompleteRef.current?.();
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  }, []); // stable — reads all values through refs

  // ── Trigger via IntersectionObserver ──
  useEffect(() => {
    if (!triggerOnView) {
      runAnimation();
      return;
    }

    const el = elRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!hasTriggered || repeat) {
            setHasTriggered(true);
            runAnimation();
          }
          if (!repeat) observer.disconnect();
        }
      },
      { threshold: viewThreshold },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [triggerOnView, repeat, viewThreshold, hasTriggered, runAnimation]);

  // ── Re-animate when target changes — proper deps, no eslint-disable ──
  useEffect(() => {
    if (!triggerOnView || hasTriggered) {
      runAnimation();
    }
  }, [to, triggerOnView, hasTriggered, runAnimation]);

  // ── Single rAF cleanup on unmount ──
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const formatted  = formatNumber(displayValue,   decimals, separator, decimal);
  const announced  = formatNumber(announcedValue, decimals, separator, decimal);

  return (
    // Outer span is the measurement anchor for IntersectionObserver (ref=elRef)
    // and the layout container. It has no ARIA role of its own.
    <span ref={elRef} className={className} style={{ display: 'contents', ...style }}>
      {/* Animated number — hidden from AT so intermediate values aren't read out */}
      <NumberEl aria-hidden="true">
        {prefix}{formatted}{suffix}
      </NumberEl>

      {/* Screen-reader node — updated only when animation completes (polite) */}
      <SrOnly aria-live="polite" aria-atomic="true">
        {prefix}{announced}{suffix}
      </SrOnly>
    </span>
  );
}
