// Threaded comments component
function renderCommentSection(container, targetType, targetId) {
  const section = createElement('div', { className: 'comments-section' });
  section.innerHTML = `
    <h3 class="comments-title">Discussion</h3>
    <div id="commentForm"></div>
    <div id="commentList" class="comment-list"></div>
  `;
  container.appendChild(section);

  renderCommentForm(section.querySelector('#commentForm'), targetType, targetId);
  loadComments(section.querySelector('#commentList'), targetType, targetId);
}

function renderCommentForm(container, targetType, targetId, parentId = null) {
  const user = Store.get('user');
  if (!user) {
    container.innerHTML = `
      <div class="comment-login-prompt">
        <button class="btn btn--sm btn--primary" onclick="handleLogin()">Login with GitHub</button>
        <span class="text-muted">to join the discussion</span>
      </div>
    `;
    return;
  }

  const formId = parentId ? `replyForm-${parentId}` : 'mainCommentForm';
  container.innerHTML = `
    <form id="${formId}" class="comment-form" onsubmit="submitComment(event, '${targetType}', ${targetId}, ${parentId || 'null'})">
      <textarea class="comment-input" placeholder="${parentId ? 'Write a reply...' : 'Add to the discussion...'}" required rows="3"></textarea>
      <div class="comment-form-actions">
        <button type="submit" class="btn btn--sm btn--primary">Post</button>
        ${parentId ? '<button type="button" class="btn btn--sm btn--ghost" onclick="this.closest(\'.comment-reply-form\').remove()">Cancel</button>' : ''}
      </div>
    </form>
  `;
}

async function loadComments(container, targetType, targetId) {
  try {
    const comments = await API.getComments(targetType, targetId);
    if (comments.length === 0) {
      container.innerHTML = '<p class="text-muted" style="padding:var(--space-md) 0;">No comments yet. Be the first to contribute.</p>';
      return;
    }
    container.innerHTML = '';
    for (const comment of comments) {
      container.appendChild(renderComment(comment, targetType, targetId));
    }
  } catch (err) {
    container.innerHTML = '<p class="text-muted">Could not load comments.</p>';
  }
}

function renderComment(comment, targetType, targetId, depth = 0) {
  const user = Store.get('user');
  const isOwner = user && user.id === comment.user_id;
  const isAdmin = user && user.role === 'admin';

  const el = createElement('div', { className: `comment ${depth > 0 ? 'comment--reply' : ''}` });
  el.setAttribute('data-comment-id', comment.id);
  el.innerHTML = `
    <div class="comment-header">
      <img src="${escapeHtml(comment.avatar_url || '')}" alt="" class="comment-avatar">
      <span class="comment-author">${escapeHtml(comment.display_name || comment.username)}</span>
      ${comment.role === 'admin' ? '<span class="badge badge--risk-low" style="font-size:0.7rem;">admin</span>' : ''}
      <span class="comment-date">${timeAgo(comment.created_at)}</span>
    </div>
    <div class="comment-body">${escapeHtml(comment.content)}</div>
    <div class="comment-actions">
      ${user ? `<button class="btn btn--xs btn--ghost" onclick="showReplyForm(this, '${targetType}', ${targetId}, ${comment.id})">Reply</button>` : ''}
      ${isOwner || isAdmin ? `<button class="btn btn--xs btn--ghost text-danger" onclick="deleteComment(${comment.id}, '${targetType}', ${targetId})">Delete</button>` : ''}
    </div>
  `;

  if (comment.replies && comment.replies.length > 0) {
    const repliesEl = createElement('div', { className: 'comment-replies' });
    for (const reply of comment.replies) {
      repliesEl.appendChild(renderComment(reply, targetType, targetId, depth + 1));
    }
    el.appendChild(repliesEl);
  }

  return el;
}

function showReplyForm(btn, targetType, targetId, parentId) {
  // Remove any existing reply forms
  const existing = document.querySelector('.comment-reply-form');
  if (existing) existing.remove();

  const container = createElement('div', { className: 'comment-reply-form' });
  btn.closest('.comment').appendChild(container);
  renderCommentForm(container, targetType, targetId, parentId);
  container.querySelector('textarea')?.focus();
}

async function submitComment(event, targetType, targetId, parentId) {
  event.preventDefault();
  const form = event.target;
  const textarea = form.querySelector('textarea');
  const content = textarea.value.trim();
  if (!content) return;

  try {
    await API.postComment(targetType, targetId, content, parentId);
    textarea.value = '';
    // Reload comments
    const list = document.getElementById('commentList');
    if (list) loadComments(list, targetType, targetId);
    // Remove reply form if it was a reply
    if (parentId) {
      const replyForm = form.closest('.comment-reply-form');
      if (replyForm) replyForm.remove();
    }
  } catch (err) {
    alert(err.message);
  }
}

async function deleteComment(commentId, targetType, targetId) {
  if (!confirm('Delete this comment?')) return;
  try {
    await API.deleteComment(commentId);
    const list = document.getElementById('commentList');
    if (list) loadComments(list, targetType, targetId);
  } catch (err) {
    alert(err.message);
  }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr + 'Z').getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}
