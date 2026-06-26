import React, { useRef, useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import {
  colors, fontFamily, fontWeight, fontSize,
  letterSpacing, spacing, borderWidth,
} from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpotlightCardProps {
  children: React.ReactNode;
  /** Glow colour — defaults to Electric Blue */
  glowColor?: string;
  /** Glow radius in px — how wide the spotlight spreads */
  glowSize?: number;
  /** Glow opacity at its peak (0–1) */
  glowIntensity?: number;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

// ─── Hex → rgba helper (runs once per prop change, not per mousemove) ─────────
//
// Supports:
//   '#rrggbb'  — 6-digit hex (primary format)
//   '#rgb'     — 3-digit shorthand, expanded to 6
//
// Non-hex values (named colours, rgb(), hsl()…) are returned as-is so the
// browser can still render something, but they will ignore the alpha parameter.
// A console.warn in development alerts the consumer early.

function hexToRgba(hex: string, alpha: number): string {
  let h = hex.trim();

  // Expand 3-digit shorthand → 6-digit (#abc → #aabbcc)
  if (/^#[0-9a-fA-F]{3}$/.test(h)) {
    h = `#${h[1]}${h[1]}${h[2]}${h[2]}${h[3]}${h[3]}`;
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(h)) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        `[SpotlightCard] glowColor="${hex}" is not a valid 6-digit hex colour. ` +
        'Pass a value like "#0047FF". The alpha channel will be ignored.',
      );
    }
    // Return the raw value — browser renders it without alpha control
    return hex;
  }

  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ─── Styled ───────────────────────────────────────────────────────────────────

const Wrapper = styled.div<{ $interactive: boolean }>`
  position: relative;
  overflow: hidden;
  background-color: ${colors.bgPage};
  border: ${borderWidth[1]} solid ${colors.borderDefault};
  cursor: ${({ $interactive }) => ($interactive ? 'pointer' : 'default')};

  transition: border-color 300ms cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    border-color: ${colors.primary};
  }

  &:focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }
`;

/**
 * The glow layer — reads position from CSS custom properties set directly
 * on its style attribute. This bypasses React's reconciler on every
 * mousemove, avoiding unnecessary re-renders.
 *
 * --glow-x, --glow-y  : cursor position relative to the card (px)
 * --glow-size         : radius of the radial gradient (px)
 * --glow-color        : rgba() string for the glow peak colour
 */
const Glow = styled.div<{ $visible: boolean }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 400ms cubic-bezier(0.4, 0, 0.2, 1);

  background: radial-gradient(
    var(--glow-size, 400px) circle at var(--glow-x, 50%) var(--glow-y, 50%),
    var(--glow-color, transparent),
    transparent 70%
  );
`;

/** Content sits above the glow */
const Content = styled.div`
  position: relative;
  z-index: 1;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function SpotlightCard({
  children,
  glowColor = colors.primary,
  glowSize = 400,
  glowIntensity = 0.12,
  className,
  style,
  onClick,
}: SpotlightCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const glowRef    = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  // Pre-compute the rgba string — only recalculates when props change, not
  // on every mousemove. The result is written into a CSS custom property.
  const glowColorRgba = useMemo(
    () => hexToRgba(glowColor, glowIntensity),
    [glowColor, glowIntensity],
  );

  // Update CSS custom properties directly on the DOM — zero React overhead.
  const updateGlowPosition = useCallback((clientX: number, clientY: number) => {
    const rect = wrapperRef.current?.getBoundingClientRect();
    const glow = glowRef.current;
    if (!rect || !glow) return;
    glow.style.setProperty('--glow-x', `${clientX - rect.left}px`);
    glow.style.setProperty('--glow-y', `${clientY - rect.top}px`);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    updateGlowPosition(e.clientX, e.clientY);
  }, [updateGlowPosition]);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    updateGlowPosition(e.clientX, e.clientY);
    setVisible(true);
  }, [updateGlowPosition]);

  const handleMouseLeave = useCallback(() => {
    setVisible(false);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick],
  );

  return (
    <Wrapper
      ref={wrapperRef}
      $interactive={!!onClick}
      className={className}
      style={style}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? 'button' : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Glow
        ref={glowRef}
        $visible={visible}
        style={{
          // Static custom properties (change only when props change)
          ['--glow-size' as string]: `${glowSize}px`,
          ['--glow-color' as string]: glowColorRgba,
        }}
      />
      <Content>{children}</Content>
    </Wrapper>
  );
}

// ─── Compound sub-parts ───────────────────────────────────────────────────────

export const SpotlightCardHeader = styled.div`
  padding: ${spacing[5]} ${spacing[6]};
  border-bottom: ${borderWidth[1]} solid ${colors.borderDefault};
`;

export const SpotlightCardBody = styled.div`
  padding: ${spacing[5]} ${spacing[6]};
`;

export const SpotlightCardFooter = styled.div`
  padding: ${spacing[4]} ${spacing[6]};
  border-top: ${borderWidth[1]} solid ${colors.borderDefault};
  display: flex;
  align-items: center;
  gap: ${spacing[3]};
`;

export const SpotlightCardTitle = styled.h3`
  margin: 0;
  font-family: ${fontFamily.base};
  font-size: ${fontSize.base};
  font-weight: ${fontWeight.semibold};
  color: ${colors.textPrimary};
  letter-spacing: ${letterSpacing.tight};
`;

export const SpotlightCardDescription = styled.p`
  margin: ${spacing[2]} 0 0;
  font-family: ${fontFamily.base};
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  line-height: 1.55;
`;

export const SpotlightCardIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: ${colors.bgSurface};
  border: ${borderWidth[1]} solid ${colors.borderDefault};
  font-size: 18px;
  flex-shrink: 0;
`;

// Attach sub-components
SpotlightCard.Header      = SpotlightCardHeader;
SpotlightCard.Body        = SpotlightCardBody;
SpotlightCard.Footer      = SpotlightCardFooter;
SpotlightCard.Title       = SpotlightCardTitle;
SpotlightCard.Description = SpotlightCardDescription;
SpotlightCard.Icon        = SpotlightCardIcon;
