const $ = (selector, root=document)=>root.querySelector(selector);
const escapeHTML = value=>String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const dateLabel=value=>value?new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date(`${value}T12:00:00`)):'';
const demoArticles=[
['ideas-and-algorithms','When an algorithm makes a decision, whose values are in it?','AI & Technology','A place to explore the assumptions hiding inside automated decisions — and who gets to question them.'],
['rules-for-new-tools','Can the law keep up with technology?','Law & Society','Thinking about what it means to regulate something that changes faster than the rules around it.'],
['attention-and-politics','What happens to public debate when attention is the prize?','Politics & Current Affairs','An open question about social platforms, political conversation and the incentives that shape what we see.'],
['who-is-accountable','Who should be accountable when AI gets it wrong?','AI & Technology','A starting point for tracing responsibility across the people and organisations involved in AI.'],
['rights-in-a-digital-world','What do our rights look like in a digital world?','Law & Society','Exploring how familiar ideas about rights meet data collection, automated systems and online life.'],
['news-and-nuance','Can we make room for nuance in the news?','Politics & Current Affairs','A reflection on complexity, headlines and how we form opinions about fast-moving events.'],
['ai-in-the-classroom','What should students learn about AI?','AI & Technology','Questions about learning, authorship and using new tools thoughtfully in education.'],
['rules-and-real-life','When a rule meets real life','Law & Society','A space to consider the gap between what a policy promises and how it affects people.'],
['who-gets-a-voice','Who gets a voice in decisions about technology?','Politics & Current Affairs','Thinking about participation, expertise and whose experience shapes public choices.'],
['a-question-of-progress','What do we mean when we call something progress?','Ideas & Elsewhere','An invitation to look beyond the newest thing and ask who benefits, who bears the cost and what matters.']
].map(([slug,title,category,summary])=>({slug,title,category,summary,placeholder:true,body_html:'<p>This is a clearly labelled placeholder for a future article by Adyan. Replace it with your own writing before sharing the piece as published work.</p><h2>Start with a question</h2><p>Use this space to develop your idea, explain the context and share your own perspective.</p>'}));
async function showArticle(){
 const slug=new URLSearchParams(location.search).get('slug');const container=$('#article-content');let article=null;
 const config=window.PORTFOLIO_CONFIG||{};
 if(config.supabaseUrl&&config.supabaseAnonKey&&window.supabase){try{const db=window.supabase.createClient(config.supabaseUrl,config.supabaseAnonKey);const {data,error}=await db.from('articles').select('slug,title,summary,category,body_html,published_at,cover_image').eq('slug',slug).eq('is_published',true).maybeSingle();if(error)throw error;article=data;}catch(error){console.error(error);}}
 if(!article)article=demoArticles.find(item=>item.slug===slug)||null;
 if(!article){container.innerHTML='<p class="eyebrow">NOT FOUND</p><h1>That piece isn’t here.</h1><p class="reader-summary">It may have moved or the link may be incomplete.</p><a class="text-link" href="index.html#articles">Return to all articles →</a>';return;}
 document.title=`${article.title} — Adyan's Portfolio`;
 const sanitized=window.DOMPurify?window.DOMPurify.sanitize(article.body_html||'<p>There is no article text yet.</p>',{USE_PROFILES:{html:true},ADD_ATTR:['target','rel']}):escapeHTML(article.body_html||'').replace(/\n/g,'<br>');
 container.innerHTML=`<header class="reader-header"><p class="card-category">${escapeHTML(article.category||'Ideas & Elsewhere')}${article.published_at?` <span>· ${escapeHTML(dateLabel(article.published_at))}</span>`:''}</p>${article.placeholder?'<span class="placeholder-tag">PLACEHOLDER — REPLACE WITH YOUR WRITING</span>':''}<h1>${escapeHTML(article.title)}</h1><p class="reader-summary">${escapeHTML(article.summary||'')}</p>${article.cover_image?`<img class="reader-cover" src="${escapeHTML(article.cover_image)}" alt="">`:''}<div class="reader-byline"><span>By Adyan</span><span>·</span><span>${article.placeholder?'An idea in progress':'A personal perspective'}</span></div></header><div class="prose">${sanitized}</div><p class="reader-disclaimer">These are Adyan’s own words and views.</p>`;
}
const menuButton=$('.menu-toggle'),navigation=$('#site-nav');if(menuButton&&navigation)menuButton.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')==='true';menuButton.setAttribute('aria-expanded',String(!open));navigation.classList.toggle('open',!open);});
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());showArticle();
