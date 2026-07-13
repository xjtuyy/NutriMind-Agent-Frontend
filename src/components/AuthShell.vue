<template>
  <main class="auth-shell">
    <section class="intro">
      <span class="eyebrow">NUTRIMIND AGENT</span>
      <h1>让知识成为<br />智能体的养分</h1>
      <p>管理营养学资料，为后续智能问答与分析能力建立可靠知识基础。</p>
    </section>
    <section class="form-card"><slot /></section>
  </main>
</template>

<style lang="scss" scoped>
.auth-shell { min-height: 100%; display: grid; grid-template-columns: 1.1fr .9fr; background: linear-gradient(135deg, #173e34, #2f7d68 55%, #e6f2ed 55%); }
.intro { align-self: center; max-width: 620px; padding: 10%; color: #fff; }
.eyebrow { font-size: 13px; letter-spacing: .2em; opacity: .72; }
h1 { margin: 22px 0; font-size: clamp(42px, 6vw, 76px); line-height: 1.08; }
.intro p { max-width: 500px; font-size: 17px; line-height: 1.8; opacity: .82; }
.form-card { align-self: center; width: min(420px, calc(100% - 40px)); margin: auto; padding: 38px; background: rgba(255,255,255,.96); border-radius: 20px; box-shadow: 0 24px 70px rgba(18,54,44,.18); }
@media (max-width: 800px) { .auth-shell { grid-template-columns: 1fr; background: $bg; } .intro { display: none; } }
</style>
