import { colorGenerator } from './utils';

/**
 * Constants
 */
const VOTE_NUM = 1;
const STABLE_TIME = 2 * 1000;
const BACKGROUND_COLOR = '#000';

/**
 * Types
 */
interface FingerPoint {
  el: HTMLDivElement;
  color: string;
  x: number;
  y: number;
}

enum STATE {
  WAIT,
  VOTE,
}

export function setupChwazi(
  listener: HTMLElement,
  container: HTMLElement,
): () => void {
  const fpMap = new Map<number, FingerPoint>();
  const randomColor = colorGenerator();

  let voteTimer: ReturnType<typeof setTimeout> | null = null;
  let state = STATE.WAIT;

  const focusBack = document.createElement('div');
  focusBack.className = 'focus-back';
  container.appendChild(focusBack);
  const showFocusBack = (x: number, y: number, color: string) => {
    focusBack.style.visibility = 'visible';
    focusBack.style.left = `calc(${x}px - 50vmax)`;
    focusBack.style.top = `calc(${y}px - 50vmax)`;
    focusBack.style.backgroundColor = color;
    focusBack.style.transform = 'scale(3)';
  };
  const hideFocusBack = () => {
    focusBack.style.visibility = 'hidden';
    focusBack.style.transform = 'scale(0)';
  };

  const focusFingerPoint = (fp: FingerPoint): void => {
    fp.el.style.backgroundColor = BACKGROUND_COLOR;
    showFocusBack(fp.x, fp.y, fp.color);
  };
  const unfocusFingerPoint = (fp: FingerPoint): void => {
    fp.el.style.backgroundColor = 'transparent';
    hideFocusBack();
  };

  const resetVoteTimer = (): void => {
    if (state === STATE.VOTE) return;

    if (voteTimer !== null) {
      clearTimeout(voteTimer);
    }

    voteTimer = setTimeout(() => {
      const ids = [...fpMap.keys()];
      if (ids.length <= VOTE_NUM) return;

      // vote begin
      state = STATE.VOTE;
      // randomly select a fp
      const selectedId = ids[Math.floor(Math.random() * ids.length)];
      // remove all unselected fp
      for (const id of ids) {
        if (id !== selectedId) {
          removeFingerPoint(id);
        }
      }
      // do voting animation
      const fp = fpMap.get(selectedId);
      if (fp) focusFingerPoint(fp);
    }, STABLE_TIME);
  };

  const removeFingerPoint = (id: number): void => {
    if (fpMap.has(id)) {
      container.removeChild(fpMap.get(id)!.el);
      fpMap.delete(id);
    }
  };

  const onFingerDown = (e: TouchEvent): void => {
    if (state === STATE.VOTE) return;
    // select one unrecorded touch as current touch
    // @FIX may be multiple unrecorded touches?
    const touches = e.changedTouches;
    let curTouch: Touch | undefined;
    for (const touch of touches) {
      if (!fpMap.has(touch.identifier)) {
        curTouch = touch;
        break;
      }
    }
    if (!curTouch) return;
    // create finger point and render
    const fp = renderFingerPoint(
      curTouch.clientX,
      curTouch.clientY,
      randomColor(),
    );
    fpMap.set(curTouch.identifier, fp);
    container.appendChild(fp.el);

    resetVoteTimer();

    e.preventDefault();
  };

  const onFingerLeave = (e: TouchEvent): void => {
    if (state === STATE.WAIT) {
      const touches = e.changedTouches;
      for (const touch of touches) {
        removeFingerPoint(touch.identifier);
      }
      resetVoteTimer();
    } else if (state === STATE.VOTE) {
      const touches = e.changedTouches;
      for (const touch of touches) {
        const id = touch.identifier;
        // only focused fp left
        if (fpMap.has(id)) {
          unfocusFingerPoint(fpMap.get(id)!);
          removeFingerPoint(id);
          state = STATE.WAIT;
        }
      }
    }
  };

  listener.addEventListener('touchstart', onFingerDown);
  listener.addEventListener('touchend', onFingerLeave);
  /**
   * clean all side effects
   */
  const clean = () => {
    container.removeChild(focusBack);
    fpMap.forEach((fp) => {
      container.removeChild(fp.el);
    });
    fpMap.clear();
    listener.removeEventListener('touchstart', onFingerDown);
    listener.removeEventListener('touchend', onFingerLeave);
  };

  return clean;
}

/**
 * render one finger point on screen
 */
function renderFingerPoint(
  x: number,
  y: number,
  color: string,
  size: number = 96,
): FingerPoint {
  const fpOuter = document.createElement('div');
  fpOuter.className = 'fp-outer';
  fpOuter.style.top = `${y - size / 2 - 24}px`;
  fpOuter.style.left = `${x - size / 2 - 24}px`;

  const fpRing = document.createElement('div');
  fpRing.className = 'fp';
  fpRing.style.width = `${size}px`;
  fpRing.style.height = `${size}px`;
  fpRing.style.padding = `${size / 16}px`;
  fpRing.style.borderWidth = `${size / 8}px`;
  fpRing.style.borderLeftColor = color;
  fpRing.style.borderTopColor = color;

  const fpCircle = document.createElement('div');
  fpCircle.style.backgroundColor = color;

  fpRing.appendChild(fpCircle);
  fpOuter.appendChild(fpRing);

  return {
    el: fpOuter,
    x,
    y,
    color,
  };
}
