<template>
  <main class="auth-shell">
    <section class="intro">
      <div class="brand">
        <span class="brand-mark">N</span>
        <div><b>NutriMind</b><small>智能营养知识平台</small></div>
      </div>
      <div class="intro-content">
        <span class="eyebrow"><i></i> KNOWLEDGE-DRIVEN AI</span>
        <h1>用可信知识，<br />驱动专业决策。</h1>
        <p>统一沉淀、检索与管理营养健康资料，为智能分析建立高质量的知识基础。</p>
        <div class="trust-list">
          <span>安全身份认证</span>
          <span>语义知识检索</span>
          <span>结构化资料管理</span>
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
.intro-content { position: relative; width: min(610px, 100%); margin: auto 0; padding: 72px 0; }.eyebrow { display: flex; align-items: center; gap: 10px; color: #79d2b6; font-size: 11px; font-weight: 700; letter-spacing: .18em; }.eyebrow i { width: 24px; height: 1px; background: #79d2b6; }.intro h1 { margin: 28px 0 24px; font-size: clamp(44px, 5vw, 68px); font-weight: 640; line-height: 1.14; letter-spacing: -.04em; }.intro-content > p { max-width: 550px; margin-bottom: 34px; color: rgba(255,255,255,.68); font-size: 16px; line-height: 1.85; }.trust-list { display: flex; flex-wrap: wrap; gap: 10px 24px; color: rgba(255,255,255,.82); font-size: 12px; }.trust-list span::before { content: "✓"; margin-right: 8px; color: #79d2b6; font-weight: 800; }.copyright { position: relative; margin: 0; color: rgba(255,255,255,.35); font-size: 11px; }
.form-side { min-height: 100vh; padding: 40px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #f8fafb; }.form-card { width: min(430px, 100%); padding: 42px; background: #fff; border: 1px solid $border; border-radius: $radius-lg; box-shadow: $shadow-lg; }.security { margin: 24px 0 0; color: $muted; font-size: 11px; letter-spacing: .03em; }.mobile-brand { display: none; }
@media (max-width: 920px) { .auth-shell { grid-template-columns: 1fr; } .intro { display: none; } .form-side { padding: 24px; }.mobile-brand { width: min(430px,100%); margin-bottom: 22px; display: flex; align-items: center; gap: 10px; color: $navy; font-size: 17px; }.mobile-brand span { width: 34px; height: 34px; display: grid; place-items: center; color: #fff; background: $navy; border-radius: 9px; font-weight: 800; } }
@media (max-width: 520px) { .form-side { padding: 18px; justify-content: flex-start; }.mobile-brand { margin-top: 18px; }.form-card { padding: 28px 22px; box-shadow: none; } }
</style>
