import { setState, subscribe } from './state/store.js';
import { h } from './lib/dom.js';

const notice = h('div', {
  className: 'notice',
  role: 'status',
  'aria-live': 'polite',
  hidden: '',
});
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
