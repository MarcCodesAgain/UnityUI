import styled, { css } from 'styled-components';
import { createContext, useContext } from 'react';
import { colors, spacing, borderWidth } from '../../../tokens';
import { Divider } from '../../atoms/Divider';

// Context so sub-components know if they're inside a flush card
const FlushContext = createContext(false);

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardVariant  = 'default' | 'outlined' | 'ghost';

export interface CardProps {
  variant?: CardVariant;
  /** Enables hover border + keyboard interaction */
  interactive?: boolean;
  /** Removes all padding — useful when you need full-bleed content */
  flush?: boolean;
  /** Called on click or keyboard Enter/Space when interactive */
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export interface CardHeaderProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export interface CardBodyProps {
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

export interface CardFooterProps {
  /** Render a Divider above the footer */
  divider?: boolean;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

// ─── Variant styles ───────────────────────────────────────────────────────────

const variantStyles: Record<CardVariant, ReturnType<typeof css>> = {
  default: css`
    background-color: ${colors.bgPage};
    border: ${borderWidth[1]} solid ${colors.borderDefault};
  `,
  outlined: css`
    background-color: ${colors.bgPage};
    border: ${borderWidth[2]} solid ${colors.black};
  `,
  ghost: css`
    background-color: ${colors.bgSurface};
    border: ${borderWidth[1]} solid transparent;
  `,
};

// ─── Styled container ─────────────────────────────────────────────────────────
//
// Hover micro-interaction: Electric Blue left bar grows top → bottom.
// Same easing as Button block-reveal and Typography highlight — one system.
//
// ::before is the bar: height starts at 0%, expands to 100% on hover.
// Only active when $interactive is true.

const StyledCard = styled.div<{
  $variant: CardVariant;
  $interactive: boolean;
}>`
  position: relative;
  border-radius: 0;           /* Swiss — no rounding */
  overflow: hidden;
  transition: border-color 200ms ease;

  ${({ $variant }) => variantStyles[$variant]}

  ${({ $interactive }) =>
    $interactive &&
    css`
      cursor: pointer;

      /* ::after overlay paints on top of all children (including images) */
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border: 2px solid transparent;
        pointer-events: none;
        transition: border-color 200ms ease;
        z-index: 1;
      }

      &:hover::after,
      &:focus-visible::after {
        border-color: ${colors.primary};
      }

      &:hover,
      &:focus-visible {
        border-color: transparent;
        outline: none;
      }
    `}
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StyledHeader = styled.div<{ $flush: boolean }>`
  padding: ${({ $flush }) => ($flush ? '0' : spacing[6])};
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const StyledBody = styled.div<{ $flush: boolean }>`
  padding: ${({ $flush }) => ($flush ? '0' : `0 ${spacing[6]} ${spacing[6]}`)};
`;

const StyledFooter = styled.div<{ $flush: boolean }>`
  padding: ${({ $flush }) => ($flush ? '0' : `${spacing[4]} ${spacing[6]}`)};
`;

// ─── Card.Header ──────────────────────────────────────────────────────────────

function CardHeader({ children, className, style }: CardHeaderProps) {
  const flush = useContext(FlushContext);
  return <StyledHeader $flush={flush} className={className} style={style}>{children}</StyledHeader>;
}

// ─── Card.Body ────────────────────────────────────────────────────────────────

function CardBody({ children, className, style }: CardBodyProps) {
  const flush = useContext(FlushContext);
  return <StyledBody $flush={flush} className={className} style={style}>{children}</StyledBody>;
}

// ─── Card.Footer ──────────────────────────────────────────────────────────────

function CardFooter({ divider = true, children, className, style }: CardFooterProps) {
  const flush = useContext(FlushContext);
  return (
    <>
      {divider && <Divider spacing="none" />}
      <StyledFooter $flush={flush} className={className} style={style}>{children}</StyledFooter>
    </>
  );
}

// ─── Card (compound) ──────────────────────────────────────────────────────────

export function Card({
  variant = 'default',
  interactive = false,
  flush = false,
  onClick,
  className,
  style,
  children,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <FlushContext.Provider value={flush}>
      <StyledCard
        $variant={variant}
        $interactive={interactive}
        className={className}
        style={style}
        onClick={onClick}
        // Expose keyboard role whenever interactive — even without onClick
        {...(interactive ? {
          role: 'button',
          tabIndex: 0,
          onKeyDown: handleKeyDown,
        } : {})}
      >
        {children}
      </StyledCard>
    </FlushContext.Provider>
  );
}

Card.Header = CardHeader;
Card.Body   = CardBody;
Card.Footer = CardFooter;
