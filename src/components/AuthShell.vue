<template>
  <main class="auth-shell">
    <section class="intro">
      <div class="brand">
        <span class="brand-mark">N</span>
        <div><b>NutriMind</b><small>AI 营养与体型管理</small></div>
      </div>
      <div class="intro-content">
        <span class="eyebrow"><i></i> EAT SMART · LIVE FIT</span>
        <h1>吃得明白，<br />练得更好。</h1>
        <p>用 AI 看懂每一餐的热量与营养，让减脂、塑形和健康饮食不再依赖猜测。</p>
        <div class="trust-list">
          <span>食物智能识别</span>
          <span>热量快速估算</span>
          <span>营养知识支持</span>
        </div>
        <div class="nutrition-card" aria-hidden="true">
          <div class="meal"><span>今日示例</span><b>鸡胸肉能量碗</b></div>
          <strong>426<small> kcal</small></strong>
          <div class="macros"><span><i class="protein"></i>蛋白质 38g</span><span><i class="carbs"></i>碳水 24g</span><span><i class="fat"></i>脂肪 18g</span></div>
        </div>
      </div>
      <p class="copyright">© 2026 NutriMind Technology</p>
    </section>
    <section class="form-side">
      <div class="mobile-brand"><span>N</span><b>NutriMind</b></div>
      <div class="form-card"><slot /></div>
      <p class="security">安全连接 · 数据隐私保护</p>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.auth-shell { min-height: 100%; display: grid; grid-template-columns: minmax(440px, 1.05fr) minmax(440px, .95fr); background: $surface; }
.intro { position: relative; min-height: 100vh; padding: 44px clamp(44px, 6vw, 96px); display: flex; flex-direction: column; overflow: hidden; color: #fff; background: $navy-deep; }
.intro::before { content: ""; position: absolute; width: 520px; height: 520px; right: -210px; top: -210px; border: 1px solid rgba(255,255,255,.08); border-radius: 50%; box-shadow: 0 0 0 72px rgba(255,255,255,.025), 0 0 0 144px rgba(255,255,255,.02); }
.brand { position: relative; display: flex; align-items: center; gap: 12px; }.brand-mark { width: 38px; height: 38px; display: grid; place-items: center; color: $navy-deep; background: #fff; border-radius: 10px; font-size: 20px; font-weight: 800; }.brand div { display: flex; flex-direction: column; }.brand b { font-size: 17px; letter-spacing: .01em; }.brand small { margin-top: 2px; color: rgba(255,255,255,.55); font-size: 10px; letter-spacing: .08em; }
.intro-content { position: relative; width: min(610px, 100%); margin: auto 0; padding: 62px 0; }.eyebrow { display: flex; align-items: center; gap: 10px; color: #8ce0aa; font-size: 11px; font-weight: 700; letter-spacing: .18em; }.eyebrow i { width: 24px; height: 1px; background: #8ce0aa; }.intro h1 { margin: 26px 0 22px; font-size: clamp(44px, 5vw, 68px); font-weight: 640; line-height: 1.14; letter-spacing: -.04em; }.intro-content > p { max-width: 550px; margin-bottom: 28px; color: rgba(255,255,255,.68); font-size: 16px; line-height: 1.85; }.trust-list { display: flex; flex-wrap: wrap; gap: 10px 24px; color: rgba(255,255,255,.82); font-size: 12px; }.trust-list span::before { content: "✓"; margin-right: 8px; color: #8ce0aa; font-weight: 800; }.nutrition-card { width:min(420px,100%); margin-top:32px; padding:17px 18px; display:grid; grid-template-columns:1fr auto; gap:12px 20px; color:$text; background:rgba(255,255,255,.95); border:1px solid rgba(255,255,255,.4); border-radius:14px; box-shadow:0 18px 40px rgba(0,0,0,.16); }.meal { display:grid; gap:4px; }.meal span { color:$muted; font-size:9px; }.meal b { color:$navy; font-size:12px; }.nutrition-card>strong { align-self:center; color:$primary; font-size:24px; letter-spacing:-.04em; }.nutrition-card>strong small { font-size:10px; letter-spacing:0; }.macros { grid-column:1/-1; padding-top:11px; display:flex; gap:16px; border-top:1px solid $border; color:$text-secondary; font-size:9px; }.macros span { display:flex; align-items:center; gap:5px; }.macros i { width:6px; height:6px; border-radius:50%; background:#5aa4e8; }.macros .carbs { background:#f1ab45; }.macros .fat { background:#e67874; }.copyright { position: relative; margin: 0; color: rgba(255,255,255,.35); font-size: 11px; }
.form-side { min-height: 100vh; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafb; }.form-card { width: min(430px, 100%); padding: 42px; background: #fff; border: 1px solid $border; border-radius: $radius-lg; box-shadow: $shadow-lg; }.security { margin: 24px 0 0; color: $muted; font-size: 11px; letter-spacing: .03em; }.mobile-brand { display: none; }
@media (max-width: 920px) { .auth-shell { grid-template-columns: 1fr; } .intro { display: none; } .form-side { padding: 24px; }.mobile-brand { width: min(430px,100%); margin-bottom: 22px; display: flex; align-items: center; gap: 10px; color: $navy; font-size: 17px; }.mobile-brand span { width: 34px; height: 34px; display: grid; place-items: center; color: #fff; background: $navy; border-radius: 9px; font-weight: 800; } }
@media (max-width: 520px) { .form-side { padding: 18px; justify-content: flex-start; }.mobile-brand { margin-top: 18px; }.form-card { padding: 28px 22px; box-shadow: none; } }
</style>
