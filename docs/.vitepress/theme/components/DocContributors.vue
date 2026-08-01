<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const last = computed(() => page.value.gitLastModifier || null)
const contributors = computed(() => page.value.gitContributors || [])
const count = computed(() => page.value.gitContributorCount || 0)

// 最后修改日期格式化（YYYY-MM-DD）
const lastDate = computed(() => {
  if (!last.value || !last.value.date) return ''
  const d = new Date(last.value.date)
  if (Number.isNaN(d.getTime())) return ''
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
})

const names = computed(() => contributors.value.map((c) => c.name).filter(Boolean))
</script>

<template>
  <div class="doc-contrib" v-if="count > 0 || last">
    <div class="doc-contrib__head">
      <span class="doc-contrib__dot" />
      <span class="doc-contrib__title">本文贡献</span>
    </div>

    <p class="doc-contrib__line" v-if="last">
      最后修改：<b>{{ last.name }}</b>
      <span class="doc-contrib__date" v-if="lastDate">· {{ lastDate }}</span>
    </p>

    <p class="doc-contrib__line" v-if="names.length">
      贡献者（{{ count }}）：
      <span class="doc-contrib__chips">
        <span class="doc-contrib__chip" v-for="n in names" :key="n">{{ n }}</span>
      </span>
    </p>
  </div>
</template>

<style scoped>
.doc-contrib {
  margin-top: 2.5rem;
  padding: 1.1rem 1.25rem;
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  background: var(--vp-c-bg-soft);
}

.doc-contrib__head {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.6rem;
}

.doc-contrib__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  box-shadow: 0 0 0 4px var(--vp-c-brand-soft);
}

.doc-contrib__title {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--vp-c-text-1);
}

.doc-contrib__line {
  margin: 0.35rem 0;
  font-size: 0.85rem;
  line-height: 1.7;
  color: var(--vp-c-text-2);
}

.doc-contrib__line b {
  color: var(--vp-c-text-1);
  font-weight: 600;
}

.doc-contrib__date {
  opacity: 0.8;
}

.doc-contrib__chips {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-left: 0.2rem;
}

.doc-contrib__chip {
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}
</style>
