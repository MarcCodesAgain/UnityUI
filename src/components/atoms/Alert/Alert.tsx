import styled from 'styled-components';
import { colors, spacing, borderWidth, fontFamily, fontWeight, fontSize, letterSpacing } from '../../../tokens';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AlertVariant  = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: React.ReactNode;
  /** Show a dismiss × button */
  onDismiss?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

// ─── Token maps ───────────────────────────────────────────────────────────────

const variantTokens: Record<AlertVariant, {
  accent: string;
  bg: string;
  iconChar: string;
}> = {
  info: {
    accent:   colors.primary,
    bg:       colors.infoBg,
    iconChar: 'i',
  },
  success: {
    accent:   colors.successBright,
    bg:       colors.successBg,
    iconChar: '✓',
  },
  warning: {
    accent:   colors.warningBright,
    bg:       colors.warningBg,
    iconChar: '!',
  },
  error: {
    accent:   colors.errorBright,
    bg:       colors.errorBg,
    iconChar: '×',
  },
};

// ─── Styled ───────────────────────────────────────────────────────────────────

const Wrapper = styled.div<{ $variant: AlertVariant }>`
  display: flex;
  gap: ${spacing[4]};
  padding: ${spacing[4]} ${spacing[5]};
  background-color: ${({ $variant }) => variantTokens[$variant].bg};
  border-left: ${borderWidth[2]} solid ${({ $variant }) => variantTokens[$variant].accent};
  position: relative;
`;

const IconBubble = styled.div<{ $variant: AlertVariant }>`
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  background-color: ${({ $variant }) => variantTokens[$variant].accent};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 1px;

  font-family: ${fontFamily.mono};
  font-weight: ${fontWeight.bold};
  font-size: ${fontSize.xs};
  color: ${colors.white};
  line-height: 1;
  user-select: none;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[1]};
  flex: 1;
  min-width: 0;
`;

const Title = styled.span`
  font-family: ${fontFamily.mono};
  font-weight: ${fontWeight.semibold};
  font-size: ${fontSize.sm};
  letter-spacing: ${letterSpacing.wide};
  color: ${colors.textPrimary};
  line-height: 1.4;
`;

const Message = styled.span`
  font-family: ${fontFamily.base};
  font-weight: ${fontWeight.regular};
  font-size: ${fontSize.sm};
  color: ${colors.textSecondary};
  line-height: 1.5;
`;

const DismissButton = styled.button`
  flex-shrink: 0;
  appearance: none;
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${colors.textSecondary};
  font-family: ${fontFamily.mono};
  font-size: ${fontSize.base};
  line-height: 1;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 150ms ease;
  margin-top: 1px;

  &:hover { color: ${colors.textPrimary}; }
  &:focus-visible {
    outline: 2px solid ${colors.borderFocus};
    outline-offset: 2px;
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className,
  style,
}: AlertProps) {
  const { iconChar } = variantTokens[variant];

  // role="alert" implicitly assertive; role="status" implicitly polite.
  // No need for explicit aria-live — it would be redundant.
  const isError = variant === 'error';

  return (
    <Wrapper
      $variant={variant}
      role={isError ? 'alert' : 'status'}
      className={className}
      style={style}
    >
      <IconBubble $variant={variant} aria-hidden="true">
        {iconChar}
      </IconBubble>

      <Content>
        {title && <Title>{title}</Title>}
        <Message>{children}</Message>
      </Content>

      {onDismiss && (
        <DismissButton
          onClick={onDismiss}
          aria-label="Dismiss alert"
        >
          ×
        </DismissButton>
      )}
    </Wrapper>
  );
}
