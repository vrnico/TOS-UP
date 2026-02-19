// Vote buttons for flag assessments (agree/disagree)
function renderVoteButtons(container, companyId, flagId, tally, userVote) {
  const agrees = tally?.agrees || 0;
  const disagrees = tally?.disagrees || 0;

  const el = createElement('div', { className: 'vote-buttons' });
  el.innerHTML = `
    <button class="vote-btn vote-btn--agree ${userVote === 1 ? 'active' : ''}"
      onclick="castFlagVote(${companyId}, ${flagId}, ${userVote === 1 ? 0 : 1}, this)"
      title="Agree with this flag assessment">
      <span class="vote-icon">&#9650;</span>
      <span class="vote-count">${agrees}</span>
    </button>
    <button class="vote-btn vote-btn--disagree ${userVote === -1 ? 'active' : ''}"
      onclick="castFlagVote(${companyId}, ${flagId}, ${userVote === -1 ? 0 : -1}, this)"
      title="Disagree with this flag assessment">
      <span class="vote-icon">&#9660;</span>
      <span class="vote-count">${disagrees}</span>
    </button>
  `;
  container.appendChild(el);
}

async function castFlagVote(companyId, flagId, vote, btn) {
  const user = Store.get('user');
  if (!user) {
    handleLogin();
    return;
  }

  try {
    await API.castVote(companyId, flagId, vote);
    // Reload votes for this company
    const data = await API.getVotes(companyId);
    Store.set('currentVotes', data);
    // Re-render all vote buttons on the page
    document.querySelectorAll(`.vote-buttons[data-flag="${flagId}"]`).forEach(el => {
      const t = data.votes[flagId] || { agrees: 0, disagrees: 0 };
      const uv = data.userVotes[flagId] || 0;
      el.innerHTML = '';
      renderVoteButtons(el.parentElement, companyId, flagId, t, uv);
    });
  } catch (err) {
    if (err.message.includes('Login')) handleLogin();
  }
}
