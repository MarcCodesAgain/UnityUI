import styled, { css } from 'styled-components';
import { colors, spacing, borderWidth } from '../../../tokens';
import { Divider } from '../../atoms/Divider';

// ─── Types ────────────────────────────────────────────────────────────────────

export type CardVariant  = 'default' | 'outlined' | 'ghost';

export interface CardProps {
  variant?: CardVariant;
  /** Enables left-bar hover micro-interaction */
  interactive?: boolean;
  /** Removes all padding — useful when you need full-bleed content */
  flush?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface CardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardBodyProps {
  className?: string;
  children: React.ReactNode;
}

export interface CardFooterProps {
  /** Render a Divider above the footer */
  divider?: boolean;
  className?: string;
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
  $flush: boolean;
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

      /* Blue border on hover — inset box-shadow avoids layout shift */
      &:hover {
        box-shadow: inset 0 0 0 2px ${colors.primary};
        border-color: transparent;
      }
    `}

  ${({ $flush }) =>
    !$flush &&
    css`
      /* Padding delegated to Header/Body/Footer — Card itself stays flush */
    `}
`;

// ─── Sub-components ───────────────────────────────────────────────────────────

const StyledHeader = styled.div`
  padding: ${spacing[6]};
  display: flex;
  flex-direction: column;
  gap: ${spacing[2]};
`;

const StyledBody = styled.div`
  padding: ${spacing[6]};
  padding-top: 0;
`;

const StyledFooter = styled.div`
  padding: ${spacing[4]} ${spacing[6]};
`;

// ─── Card.Header ──────────────────────────────────────────────────────────────

function CardHeader({ children, className }: CardHeaderProps) {
  return <StyledHeader className={className}>{children}</StyledHeader>;
}

// ─── Card.Body ────────────────────────────────────────────────────────────────

function CardBody({ children, className }: CardBodyProps) {
  return <StyledBody className={className}>{children}</StyledBody>;
}

// ─── Card.Footer ──────────────────────────────────────────────────────────────

function CardFooter({ divider = true, children, className }: CardFooterProps) {
  return (
    <>
      {divider && <Divider spacing="none" />}
      <StyledFooter className={className}>{children}</StyledFooter>
    </>
  );
}

// ─── Card (compound) ──────────────────────────────────────────────────────────

export function Card({
  variant = 'default',
  interactive = false,
  flush = false,
  className,
  children,
}: CardProps) {
  return (
    <StyledCard
      $variant={variant}
      $interactive={interactive}
      $flush={flush}
      className={className}
    >
      {children}
    </StyledCard>
  );
}

Card.Header = CardHeader;
Card.Body   = CardBody;
Card.Footer = CardFooter;
