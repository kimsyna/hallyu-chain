import { setState, subscribe } from './state/store.js';

const notice = document.createElement('div');
notice.className = 'notice';
notice.setAttribute('role', 'status');
notice.setAttribute('aria-live', 'polite');
notice.hidden = true;
document.body.appendChild(notice);
let noticeTimeout;

subscribe((state) => {
  const data = state.notice;
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

export function showNotice(message, delay = 4000) {
  setState({ notice: { message, delay } });
}

if (typeof window !== 'undefined') {
  window.showNotice = showNotice;
}
