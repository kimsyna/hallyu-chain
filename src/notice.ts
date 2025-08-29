import { setState, subscribe } from './state/store.ts';

const notice = document.createElement('div');
notice.className = 'notice';
notice.setAttribute('role', 'status');
notice.setAttribute('aria-live', 'polite');
notice.hidden = true;
document.body.appendChild(notice);
let noticeTimeout: ReturnType<typeof setTimeout>;

subscribe((state) => {
  const data = state.notice as { message: string; delay?: number } | undefined;
  if (!data) return;
  notice.textContent = data.message;
  notice.hidden = false;
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => {
    notice.hidden = true;
    notice.textContent = '';
    setState({ notice: null });
  }, data.delay || 4000);
});

export function showNotice(message: string, delay = 4000) {
  setState({ notice: { message, delay } });
}

declare global {
  interface Window {
    showNotice?: typeof showNotice;
  }
}

if (typeof window !== 'undefined') {
  window.showNotice = showNotice;
}
