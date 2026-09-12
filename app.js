// Video data is now loaded live from Firestore (see the module script
// near the end of this file). It's populated by setVideos() once the
// "videos" collection has been fetched.
let videos = [];

const feed = document.getElementById('feed');

function renderFeed(list){
  feed.innerHTML = '';
  if(list.length === 0){
    feed.innerHTML = `<div class="no-results">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
      <span>No videos found</span>
    </div>`;
    return;
  }
  list.forEach((v,i)=>{
    const post = document.createElement('div');
    post.className='post';
    post.style.animationDelay = `${i*60}ms`;
    post.innerHTML = `
      <div class="bubble">
        <div class="thumb">
          <img src="${v.image}" alt="${v.title}" loading="lazy">
        </div>
        <div class="caption">
          <h3>${v.title}</h3>
          <p>${v.caption}</p>
        </div>
        <div class="links-tab">
          ${v.links.slice(0,2).map(l => `
            <a class="link-row" href="${l.url}">
              <span class="link-left">
                <span class="icon-dot">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                </span>
                <span>${l.label}</span>
              </span>
              <svg class="go-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
            </a>`).join('')}
          ${v.links.length > 2 ? `
          <div class="extra-links">
            ${v.links.slice(2).map(l => `
              <a class="link-row" href="${l.url}">
                <span class="link-left">
                  <span class="icon-dot">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>
                  </span>
                  <span>${l.label}</span>
                </span>
                <svg class="go-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"></path></svg>
              </a>`).join('')}
          </div>
          <button class="show-more-row" type="button">
            <span class="show-more-label">Show ${v.links.length - 2} more</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>` : ''}
        </div>
      </div>
      <div class="meta">
        <span class="chip heart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"></path></svg>
          ${v.likes}
        </span>
        <span class="spacer"></span>
        <button class="share-btn" aria-label="Forward">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </div>
    `;
    feed.appendChild(post);

    const showMoreBtn = post.querySelector('.show-more-row');
    if(showMoreBtn){
      const extra = post.querySelector('.extra-links');
      const label = showMoreBtn.querySelector('.show-more-label');
      const extraCount = v.links.length - 2;
      showMoreBtn.addEventListener('click', ()=>{
        const isOpen = extra.classList.toggle('open');
        showMoreBtn.classList.toggle('open', isOpen);
        label.textContent = isOpen ? 'Show less' : `Show ${extraCount} more`;
      });
    }
  });
}

// Show a loading state until Firestore responds.
feed.innerHTML = `<div class="no-results"><span>Loading videos…</span></div>`;

// Called by the Firebase module script once the "videos" collection loads.
function setVideos(data){
  videos = data;
  renderFeed(videos);
}

// Called by the Firebase module script if the fetch fails.
function showLoadError(message){
  feed.innerHTML = `<div class="no-results">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="13"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
    <span>${message || "Couldn't load videos"}</span>
  </div>`;
}

// --- Search ---
const titleBlock = document.getElementById('titleBlock');
const searchWrap = document.getElementById('searchWrap');
const searchBtn = document.getElementById('searchBtn');
const searchInput = document.getElementById('searchInput');
const searchClear = document.getElementById('searchClear');

function openSearch(){
  titleBlock.style.display = 'none';
  searchWrap.classList.add('open');
  searchBtn.classList.add('active');
  searchInput.focus();
}
function closeSearch(){
  searchWrap.classList.remove('open');
  searchBtn.classList.remove('active');
  titleBlock.style.display = '';
  searchInput.value = '';
  renderFeed(videos);
}

searchBtn.addEventListener('click', ()=>{
  if(searchWrap.classList.contains('open')){
    closeSearch();
  } else {
    openSearch();
  }
});

searchClear.addEventListener('click', ()=>{
  if(searchInput.value){
    searchInput.value = '';
    renderFeed(videos);
    searchInput.focus();
  } else {
    closeSearch();
  }
});

searchInput.addEventListener('input', ()=>{
  const q = searchInput.value.trim().toLowerCase();
  if(!q){ renderFeed(videos); return; }
  const filtered = videos.filter(v =>
    v.title.toLowerCase().includes(q) ||
    v.caption.toLowerCase().includes(q)
  );
  renderFeed(filtered);
});

searchInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Escape') closeSearch();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').catch(()=>{});
}
