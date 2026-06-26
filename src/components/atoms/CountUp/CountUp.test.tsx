import { render, screen, act } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { theme } from '../../../styles/theme';
import { CountUp } from './CountUp';

const wrap = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

// ── Mock IntersectionObserver ──────────────────────────────────────────────────
let observerCallback: IntersectionObserverCallback | null = null;

beforeEach(() => {
  vi.useFakeTimers();

  // matchMedia shim — jsdom doesn't implement it; default to no reduced-motion
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  // requestAnimationFrame shim:
  // Each animation needs 2 frames: frame 1 sets startRef (elapsed=0, progress=0),
  // frame 2 returns startRef+999_999 so elapsed >> duration → progress=1 → done.
  let rafId = 0;
  let callCount = 0;
  const BASE_TS = 1000;
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    const id = ++rafId;
    const isFirstOfPair = (++callCount % 2) === 1;
    const ts = isFirstOfPair ? BASE_TS : BASE_TS + 999_999;
    queueMicrotask(() => cb(ts));
    return id;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());

  // IntersectionObserver shim — must be a class so `new` works
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        observerCallback = cb;
      }
      observe    = vi.fn();
      disconnect = vi.fn();
      unobserve  = vi.fn();
    },
  );
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  observerCallback = null;
});

function triggerIntersection(isIntersecting = true) {
  observerCallback?.(
    [{ isIntersecting } as IntersectionObserverEntry],
    {} as IntersectionObserver,
  );
}

// The animated NumberEl is aria-hidden; the accessible value lives in the
// aria-live SrOnly node. Tests query the live region for the final value,
// and the aria-hidden span for the intermediate/initial visual value.
const getAriaLive = () => document.querySelector('[aria-live]');
const getVisual   = () => document.querySelector('[aria-hidden="true"]');

describe('CountUp', () => {
  it('renders initial "from" value before animation starts', () => {
    wrap(<CountUp to={1000} from={0} triggerOnView={false} />);
    expect(getVisual()?.textContent).toBe('0');
  });

  it('reaches target value after animation completes', async () => {
    wrap(<CountUp to={500} from={0} duration={100} triggerOnView={false} />);
    await act(async () => { vi.advanceTimersByTime(200); });
    // Both visual and live region should show final value
    expect(getVisual()?.textContent).toBe('500');
    expect(getAriaLive()?.textContent).toBe('500');
  });

  it('applies prefix and suffix', async () => {
    wrap(<CountUp to={100} prefix="$" suffix="+" duration={100} triggerOnView={false} />);
    await act(async () => { vi.advanceTimersByTime(200); });
    expect(getAriaLive()?.textContent).toBe('$100+');
  });

  it('applies thousands separator', async () => {
    wrap(<CountUp to={1000} separator="," duration={100} triggerOnView={false} />);
    await act(async () => { vi.advanceTimersByTime(200); });
    expect(getAriaLive()?.textContent).toBe('1,000');
  });

  it('renders correct decimal places', async () => {
    wrap(<CountUp to={3.7} decimals={1} duration={100} triggerOnView={false} />);
    await act(async () => { vi.advanceTimersByTime(200); });
    expect(getAriaLive()?.textContent).toBe('3.7');
  });

  it('starts animation when intersection fires', async () => {
    wrap(<CountUp to={200} duration={100} triggerOnView />);
    // Before intersection — visual still at 0, live region also at 0
    expect(getVisual()?.textContent).toBe('0');

    act(() => triggerIntersection(true));
    await act(async () => { vi.advanceTimersByTime(200); });
    expect(getAriaLive()?.textContent).toBe('200');
  });

  it('does not animate when intersection is false', async () => {
    wrap(<CountUp to={200} duration={100} triggerOnView />);
    act(() => triggerIntersection(false));
    await act(async () => { vi.advanceTimersByTime(200); });
    // Still at from=0 — live region not updated yet
    expect(getVisual()?.textContent).toBe('0');
    expect(getAriaLive()?.textContent).toBe('0');
  });

  it('aria-live region announces final value only after animation completes', async () => {
    wrap(<CountUp to={42} prefix="$" suffix="k" duration={100} triggerOnView={false} />);
    // Before animation: live region has initial from value
    expect(getAriaLive()?.textContent).toBe('$0k');
    await act(async () => { vi.advanceTimersByTime(200); });
    // After animation: live region has final value
    expect(getAriaLive()?.textContent).toBe('$42k');
  });

  it('visual number is aria-hidden', () => {
    wrap(<CountUp to={100} triggerOnView={false} />);
    expect(getVisual()).toHaveAttribute('aria-hidden', 'true');
  });

  it('calls onComplete callback after animation', async () => {
    const onComplete = vi.fn();
    wrap(<CountUp to={10} duration={100} triggerOnView={false} onComplete={onComplete} />);
    await act(async () => { vi.advanceTimersByTime(200); });
    expect(onComplete).toHaveBeenCalled();
  });
});
