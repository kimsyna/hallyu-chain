const notice = document.createElement('div');
notice.className = 'notice';
notice.setAttribute('role', 'status');
notice.setAttribute('aria-live', 'polite');
notice.hidden = true;
document.body.appendChild(notice);
let noticeTimeout;
export function showNotice(message, delay = 4000) {
  notice.textContent = message;
  notice.hidden = false;
  clearTimeout(noticeTimeout);
  noticeTimeout = setTimeout(() => {
    notice.hidden = true;
    notice.textContent = '';
  }, delay);
}
if (typeof window !== 'undefined') {
  window.showNotice = showNotice;
}
