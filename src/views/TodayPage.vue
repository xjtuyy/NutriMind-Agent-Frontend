<template>
  <div class="page-shell today-page">
    <header class="page-head">
      <div>
        <span class="status-chip"><CalendarCheck :size="16" weight="bold" /> 训练日计划预览</span>
        <h1 class="page-title">今天，继续保持节奏。</h1>
        <p class="page-description">先保证训练表现，再用稳定的热量缺口推进减脂目标。</p>
      </div>
      <FuelButton variant="secondary" @click="router.push('/coach')">问 AI 教练</FuelButton>
    </header>

    <section class="dashboard-grid" aria-label="今日营养概览">
      <article class="energy-panel surface">
        <EnergyRing :value="1460" :total="2140" />
        <div class="energy-copy">
          <span>还可以摄入</span>
          <strong class="metric-number"><CountUp :to="680" suffix=" kcal" /></strong>
          <p>晚餐优先安排高蛋白主食和足量蔬菜，不需要为了减脂跳过一餐。</p>
          <div class="energy-meta"><Fire :size="19" weight="fill" /><span>当前热量缺口约 410 kcal</span></div>
        </div>
      </article>

      <SpotlightCard class="coach-card">
        <div class="coach-card-inner">
          <span class="coach-icon"><Sparkle :size="25" weight="fill" /></span>
          <div>
            <small>今天的重点</small>
            <h2>训练后补够蛋白质</h2>
            <p>你今天还差 42g 蛋白质。晚餐可以选择鸡胸肉、牛肉或豆腐，再配一份主食。</p>
          </div>
          <button @click="router.push('/coach')">查看建议 <ArrowRight :size="17" weight="bold" /></button>
        </div>
      </SpotlightCard>

      <section class="macro-panel surface">
        <div class="panel-heading"><div><h2 class="section-title">三大营养素</h2><p>根据训练日目标计算</p></div><ChartDonut :size="26" weight="duotone" /></div>
        <div class="macro-list">
          <MacroBar label="蛋白质" :value="108" :total="150" />
          <MacroBar label="碳水" :value="162" :total="240" />
          <MacroBar label="脂肪" :value="46" :total="65" />
        </div>
      </section>

      <GlareHover class="meal-panel surface">
        <img src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1000&q=82" width="1000" height="800" alt="蔬菜、鸡蛋和谷物组成的健康餐" loading="lazy" />
        <div class="meal-copy">
          <div><small>最近一餐</small><h2>鸡肉谷物能量碗</h2></div>
          <strong class="metric-number">620 <i>kcal</i></strong>
          <ul><li>蛋白质 42g</li><li>碳水 71g</li><li>脂肪 18g</li></ul>
        </div>
      </GlareHover>

      <section class="activity-panel surface">
        <div class="panel-heading"><div><h2 class="section-title">今日安排</h2><p>完成两项，保持稳定即可</p></div><Barbell :size="26" weight="duotone" /></div>
        <div class="activities">
          <article v-for="item in activities" :key="item.title">
            <span :class="{ done: item.done }"><component :is="item.icon" :size="20" weight="bold" /></span>
            <div><b>{{ item.title }}</b><small>{{ item.detail }}</small></div>
            <strong>{{ item.time }}</strong>
          </article>
        </div>
      </section>
    </section>
  </div>
</template>

<script setup>
import { markRaw } from 'vue'
import { useRouter } from 'vue-router'
import {
  PhArrowRight as ArrowRight, PhBarbell as Barbell, PhCalendarCheck as CalendarCheck,
  PhChartDonut as ChartDonut, PhCheck as Check, PhFire as Fire,
  PhForkKnife as ForkKnife, PhPersonSimpleRun as PersonSimpleRun, PhSparkle as Sparkle,
} from '@phosphor-icons/vue'
import CountUp from '@/components/motion/CountUp.vue'
import SpotlightCard from '@/components/motion/SpotlightCard.vue'
import GlareHover from '@/components/motion/GlareHover.vue'
import FuelButton from '@/components/ui/FuelButton.vue'
import EnergyRing from '@/components/data/EnergyRing.vue'
import MacroBar from '@/components/data/MacroBar.vue'

const router = useRouter()
const activities = [
  { title: '早餐记录', detail: '燕麦、鸡蛋和无糖酸奶', time: '08:20', done: true, icon: markRaw(Check) },
  { title: '力量训练', detail: '上肢推拉，预计 55 分钟', time: '18:30', done: false, icon: markRaw(PersonSimpleRun) },
  { title: '训练后晚餐', detail: '目标蛋白质不少于 40g', time: '20:00', done: false, icon: markRaw(ForkKnife) },
]
</script>

<style lang="scss" scoped>
.today-page { padding-bottom: 34px; }
.page-head { margin-bottom: 26px; display: flex; align-items: end; justify-content: space-between; gap: 24px; }
.page-head .status-chip { margin-bottom: 18px; }
.dashboard-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(310px, .65fr); gap: 18px; }
.energy-panel { min-height: 440px; padding: clamp(24px, 4vw, 52px); display: grid; grid-template-columns: auto 1fr; align-items: center; gap: clamp(28px, 5vw, 74px); background: radial-gradient(circle at 20% 30%, rgba(159,226,75,.07), transparent 22rem), var(--surface); }
.energy-copy > span { color: var(--text-secondary); font-size: .84rem; }
.energy-copy > strong { margin: 8px 0 16px; display: block; font-family: "Barlow Condensed"; font-size: clamp(3.4rem, 6vw, 6rem); font-weight: 600; line-height: .9; letter-spacing: -.035em; }
.energy-copy p { max-width: 40ch; margin: 0; color: var(--text-secondary); line-height: 1.7; }
.energy-meta { margin-top: 24px; padding-top: 18px; display: flex; align-items: center; gap: 9px; color: var(--accent); border-top: 1px solid var(--border); font-size: .8rem; }
.coach-card { min-height: 440px; }
.coach-card-inner { height: 100%; padding: 28px; display: flex; flex-direction: column; }
.coach-icon { width: 52px; height: 52px; display: grid; place-items: center; color: #11160f; background: var(--primary); border-radius: 13px; }
.coach-card small { margin: auto 0 8px; display: block; color: var(--primary); font-size: .72rem; font-weight: 600; }
.coach-card h2 { margin: 0 0 12px; font-family: "Barlow Condensed", MiSans, sans-serif; font-size: 2.15rem; line-height: 1.04; font-weight: 600; }
.coach-card p { margin: 0; color: var(--text-secondary); line-height: 1.65; }
.coach-card button { margin-top: 24px; padding: 14px 0 0; display: flex; align-items: center; justify-content: space-between; color: var(--text); background: transparent; border: 0; border-top: 1px solid var(--border); font-weight: 600; }
.macro-panel, .activity-panel { padding: 24px; }
.panel-heading { margin-bottom: 24px; display: flex; align-items: start; justify-content: space-between; color: var(--primary); }
.panel-heading p { margin: 5px 0 0; color: var(--muted); font-size: .75rem; }
.macro-list { display: grid; gap: 22px; }
.meal-panel { min-height: 330px; display: grid; grid-template-columns: .9fr 1.1fr; }
.meal-panel :deep(img) { width: 100%; height: 100%; min-height: 330px; object-fit: cover; }
.meal-copy { position: relative; z-index: 3; padding: 26px; display: flex; flex-direction: column; }
.meal-copy small { color: var(--primary); font-size: .72rem; font-weight: 600; }
.meal-copy h2 { margin: 8px 0 0; font-family: "Barlow Condensed", MiSans, sans-serif; font-size: 2rem; line-height: 1; }
.meal-copy > strong { margin: auto 0 16px; display: block; font-size: 3rem; line-height: 1; }
.meal-copy i { color: var(--accent); font-size: .8rem; font-style: normal; }
.meal-copy ul { margin: 0; padding: 14px 0 0; display: flex; flex-wrap: wrap; gap: 8px 16px; color: var(--text-secondary); border-top: 1px solid var(--border); list-style: none; font-size: .75rem; }
.activities { display: grid; }
.activities article { min-height: 70px; display: grid; grid-template-columns: 42px 1fr auto; align-items: center; gap: 12px; border-bottom: 1px solid var(--border); }
.activities article:last-child { border-bottom: 0; }
.activities article > span { width: 36px; height: 36px; display: grid; place-items: center; color: var(--muted); background: var(--surface-soft); border-radius: 9px; }
.activities article > span.done { color: #11160f; background: var(--primary); }
.activities article div { display: grid; gap: 3px; }
.activities b { font-size: .84rem; }
.activities small { color: var(--muted); font-size: .72rem; }
.activities strong { color: var(--text-secondary); font-family: "Barlow Condensed"; font-size: 1rem; font-weight: 500; }

@media (max-width: 1180px) {
  .energy-panel { grid-template-columns: 1fr; justify-items: center; text-align: center; }
  .energy-copy p { margin-inline: auto; }
  .energy-meta { justify-content: center; }
  .meal-panel { grid-template-columns: 1fr; }
  .meal-panel :deep(img) { height: 220px; min-height: 220px; }
}
@media (max-width: 760px) {
  .page-head { align-items: flex-start; flex-direction: column; }
  .page-head > :last-child { width: 100%; }
  .dashboard-grid { grid-template-columns: 1fr; }
  .energy-panel, .coach-card { min-height: auto; }
  .energy-panel { padding: 28px 18px; }
  .coach-card-inner { min-height: 360px; }
  .meal-panel { min-height: auto; }
}
</style>
