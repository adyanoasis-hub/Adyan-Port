const placeholderArticles = [
  {slug:'ideas-and-algorithms',title:'When an algorithm makes a decision, whose values are in it?',summary:'A place to explore the assumptions hiding inside automated decisions — and who gets to question them.',category:'AI & Technology',date:null,placeholder:true},
  {slug:'rules-for-new-tools',title:'Can the law keep up with technology?',summary:'Thinking about what it means to regulate something that changes faster than the rules around it.',category:'Law & Society',date:null,placeholder:true},
  {slug:'attention-and-politics',title:'What happens to public debate when attention is the prize?',summary:'An open question about social platforms, political conversation and the incentives that shape what we see.',category:'Politics & Current Affairs',date:null,placeholder:true},
  {slug:'who-is-accountable',title:'Who should be accountable when AI gets it wrong?',summary:'A starting point for tracing responsibility across the people and organisations involved in AI.',category:'AI & Technology',date:null,placeholder:true},
  {slug:'rights-in-a-digital-world',title:'What do our rights look like in a digital world?',summary:'Exploring how familiar ideas about rights meet data collection, automated systems and online life.',category:'Law & Society',date:null,placeholder:true},
  {slug:'news-and-nuance',title:'Can we make room for nuance in the news?',summary:'A reflection on complexity, headlines and how we form opinions about fast-moving events.',category:'Politics & Current Affairs',date:null,placeholder:true},
  {slug:'ai-in-the-classroom',title:'What should students learn about AI?',summary:'Questions about learning, authorship and using new tools thoughtfully in education.',category:'AI & Technology',date:null,placeholder:true},
  {slug:'rules-and-real-life',title:'When a rule meets real life',summary:'A space to consider the gap between what a policy promises and how it affects people.',category:'Law & Society',date:null,placeholder:true},
  {slug:'who-gets-a-voice',title:'Who gets a voice in decisions about technology?',summary:'Thinking about participation, expertise and whose experience shapes public choices.',category:'Politics & Current Affairs',date:null,placeholder:true},
  {slug:'a-question-of-progress',title:'What do we mean when we call something progress?',summary:'An invitation to look beyond the newest thing and ask who benefits, who bears the cost and what matters.',category:'Ideas & Elsewhere',date:null,placeholder:true}
];

const $ = (selector, root=document) => root.querySelector(selector);
let allArticles = [];
let activeCategory = 'All topics';

function escapeHTML(value='') {
  return String(value).replace(/[&<>"']/g, (character) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
}
function formatDate(value) {
  if (!value) return '';
  const date = new Date(`${value}T12:00:00`);
  return Number.isNaN(date.valueOf()) ? '' : new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric'}).format(date);
}
function articleURL(article) { return `read.html?slug=${encodeURIComponent(article.slug)}`; }
function renderFilters(articles) {
  const host = $('#topic-filters');
  if (!host) return;
  const categories = ['All topics', ...new Set(articles.map(item=>item.category).filter(Boolean))];
  if (!categories.includes(activeCategory)) activeCategory = 'All topics';
  host.innerHTML = categories.map(category=>`<button class="topic-chip ${activeCategory===category?'selected':''}" type="button" aria-pressed="${activeCategory===category}" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`).join('');
}
function renderCards() {
  const grid = $('#article-grid'); if (!grid) return;
  const visible = activeCategory==='All topics' ? allArticles : allArticles.filter(item=>item.category===activeCategory);
  $('#article-count').textContent = `${String(visible.length).padStart(2,'0')} ${visible.length===1?'PIECE':'PIECES'} · ${activeCategory==='All topics'?'IN THE NOTEBOOK':escapeHTML(activeCategory.toUpperCase())}`;
  $('#empty-filter').hidden = visible.length>0;
  grid.innerHTML = visible.map((article,index)=>`<article class="article-card ${index%3===1?'card-offset':''}">
    <div class="card-topline"><span class="card-index">${String(index+1).padStart(2,'0')}</span><span class="placeholder-tag">${article.placeholder?'PLACEHOLDER':''}</span></div>
    ${article.cover_image?`<img class="article-cover" src="${escapeHTML(article.cover_image)}" alt="">`:''}
    <p class="card-category">${escapeHTML(article.category||'Ideas & Elsewhere')}${article.published_at?` <span>· ${escapeHTML(formatDate(article.published_at))}</span>`:''}</p>
    <h3><a href="${articleURL(article)}">${escapeHTML(article.title)}</a></h3>
    <p class="card-summary">${escapeHTML(article.summary||'A new idea, collected in one place.')}</p>
    <a class="read-link" href="${articleURL(article)}">${article.placeholder?'Open placeholder':'Read the article'} <span aria-hidden="true">↗</span></a>
    <span class="card-decoration" aria-hidden="true">${index%3===0?'✳':index%3===1?'↗':'·'}</span>
  </article>`).join('');
}
async function loadPublicArticles() {
  const config = window.PORTFOLIO_CONFIG||{};
  if (!config.supabaseUrl || !config.supabaseAnonKey || !window.supabase) {
    allArticles = placeholderArticles; renderFilters(allArticles); renderCards(); return;
  }
  try {
    const client = window.supabase.createClient(config.supabaseUrl,config.supabaseAnonKey);
    const {data,error}=await client.from('articles').select('slug,title,summary,category,published_at,cover_image').eq('is_published',true).order('published_at',{ascending:false,nullsFirst:false});
    if(error) throw error;
    allArticles = data||[];
    if(!allArticles.length) allArticles = placeholderArticles;
    renderFilters(allArticles); renderCards();
  } catch (error) {
    console.error('Could not load published articles:',error);
    allArticles=placeholderArticles; renderFilters(allArticles); renderCards();
    const message=document.createElement('p'); message.className='connection-note'; message.textContent='Showing clearly labelled placeholders while the article service is unavailable.'; $('#article-grid').before(message);
  }
}

const menuButton=$('.menu-toggle'); const navigation=$('#site-nav');
if(menuButton&&navigation){menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));navigation.classList.toggle('open',!open);});navigation.addEventListener('click',event=>{if(event.target.closest('a')){menuButton.setAttribute('aria-expanded','false');navigation.classList.remove('open');}});}
$('#topic-filters')?.addEventListener('click',event=>{const button=event.target.closest('[data-category]');if(!button)return;activeCategory=button.dataset.category;renderFilters(allArticles);renderCards();});
document.querySelectorAll('[data-year]').forEach(element=>element.textContent=new Date().getFullYear());
loadPublicArticles();
