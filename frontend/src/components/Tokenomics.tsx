function Tokenomics() {
  return (
    <section id="tokenomics">
      <h2 data-i18n="tokenomics_title">토큰 이코노미</h2>
      <ul className="icon-list">
        <li>
          <i className="material-symbols-outlined">pie_chart</i>
          <span data-i18n="tok_list1">총 발행량: {'{supply}'} HALL</span>
        </li>
        <li>
          <i className="material-symbols-outlined">account_balance</i>
          <span data-i18n="tok_list2">DAO 재무금고: {'{dao}'}%</span>
        </li>
        <li>
          <i className="material-symbols-outlined">card_giftcard</i>
          <span data-i18n="tok_list3">커뮤니티 리워드: {'{community}'}%</span>
        </li>
        <li>
          <i className="material-symbols-outlined">groups</i>
          <span data-i18n="tok_list4">팀: {'{team}'}%</span>
        </li>
        <li>
          <i className="material-symbols-outlined">support_agent</i>
          <span data-i18n="tok_list5">자문단: {'{advisors}'}%</span>
        </li>
        <li>
          <i className="material-symbols-outlined">trending_up</i>
          <span data-i18n="tok_list6">투자자: {'{investors}'}%</span>
        </li>
      </ul>
    </section>
  )
}

export default Tokenomics
