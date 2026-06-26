import styled from 'styled-components';
import { colors, spacing, fontFamily, fontWeight, fontSize } from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AvatarSize    = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarStatus  = 'online' | 'offline' | 'busy' | 'away';

export interface AvatarProps {
  /** Image src — if absent, falls back to initials */
  src?: string;
  /**
   * Descriptive alt text for the avatar image.
   * Pass an empty string (`alt=""`) only when the avatar is purely decorative
   * and an adjacent text element already identifies the person.
   */
  alt?: string;
  /** Shown when no image is provided */
  initials?: string;
  size?: AvatarSize;
  /** Optional status dot */
  status?: AvatarStatus;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Token maps ───────────────────────────────────────────────────────────────

const sizeMap: Record<AvatarSize, string> = {
  xs: spacing[6],    // 24px
  sm: spacing[8],    // 32px
  md: spacing[10],   // 40px
  lg: spacing[14],   // 56px
  xl: spacing[20],   // 80px
};

const fontSizeMap: Record<AvatarSize, string> = {
  xs: fontSize.xs,    // 10px
  sm: fontSize.sm,    // 14px
  md: fontSize.base,  // 16px
  lg: fontSize.xl,    // 20px
  xl: fontSize['2xl'],// 24px
};

const dotSizeMap: Record<AvatarSize, string> = {
  xs: '6px',
  sm: '8px',
  md: '10px',
  lg: '12px',
  xl: '14px',
};

const statusColor: Record<AvatarStatus, string> = {
  online:  colors.successBright,
  offline: colors.grey400,
  busy:    colors.errorBright,
  away:    colors.warningBright,
};

// ─── Styled ───────────────────────────────────────────────────────────────────

const Wrapper = styled.div<{ $size: AvatarSize }>`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: ${({ $size }) => sizeMap[$size]};
  height: ${({ $size }) => sizeMap[$size]};
`;

const ImageEl = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

const Initials = styled.div<{ $size: AvatarSize }>`
  width: 100%;
  height: 100%;
  background-color: ${colors.black};
  display: flex;
  align-items: center;
  justify-content: center;

  font-family: ${fontFamily.mono};
  font-weight: ${fontWeight.semibold};
  font-size: ${({ $size }) => fontSizeMap[$size]};
  color: ${colors.white};
  letter-spacing: 0.04em;
  text-transform: uppercase;
  user-select: none;
`;

const StatusDot = styled.span<{ $status: AvatarStatus; $size: AvatarSize }>`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${({ $size }) => dotSizeMap[$size]};
  height: ${({ $size }) => dotSizeMap[$size]};
  background-color: ${({ $status }) => statusColor[$status]};
  border: 2px solid ${colors.bgPage};
  border-radius: 50%;
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Avatar({
  src,
  alt = '',
  initials,
  size = 'md',
  status,
  className,
  style,
}: AvatarProps) {
  return (
    <Wrapper
      $size={size}
      className={className}
      style={style}
      // Expose as img with label when no <img> is rendered (initials fallback)
      {...(!src && alt ? { role: 'img', 'aria-label': alt } : {})}
    >
      {src ? (
        <ImageEl src={src} alt={alt} />
      ) : (
        <Initials $size={size} aria-hidden="true">
          {initials ?? '?'}
        </Initials>
      )}
      {status && <StatusDot $status={status} $size={size} aria-hidden="true" />}
    </Wrapper>
  );
}
