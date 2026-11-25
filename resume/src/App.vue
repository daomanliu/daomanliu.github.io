<script setup>
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import InfoList from '@/components/InfoList.vue'
import NewsList from '@/components/NewsList.vue'
import ProfileHead from '@/components/ProfileHead.vue'
import PublicationList from '@/components/PublicationList.vue'
import SectionBlock from '@/components/SectionBlock.vue'
import SidebarProfile from '@/components/SidebarProfile.vue'
import TimelineList from '@/components/TimelineList.vue'
import { profile } from '@/data/profile'

const emailText = profile.email.replace('@', ' [AT] ')
const contactLinks = profile.links.filter((link) => link.label !== 'CV')
</script>

<template>
  <AppHeader />

  <main class="layout">
    <SidebarProfile />

    <div class="content">
      <ProfileHead />

      <SectionBlock id="about" title="简介" en="Biography">
        <div class="bio">
          <p v-for="(para, index) in profile.bio" :key="index">{{ para }}</p>
        </div>
      </SectionBlock>

      <SectionBlock
        v-if="profile.interests.length"
        id="interests"
        title="期待研究方向"
        en="Research Interest"
      >
        <ul class="bullets">
          <li v-for="item in profile.interests" :key="item.lead">
            <b>{{ item.lead }}</b>：{{ item.detail }}
          </li>
        </ul>
      </SectionBlock>

      <SectionBlock v-if="profile.skills.length" id="skills" title="技能" en="Skills">
        <ul class="bullets">
          <li v-for="item in profile.skills" :key="item.lead">
            <b>{{ item.lead }}</b>：{{ item.detail }}
          </li>
        </ul>
      </SectionBlock>

      <SectionBlock v-if="profile.education.length" id="education" title="教育经历" en="Education">
        <TimelineList :items="profile.education" />
      </SectionBlock>

      <SectionBlock v-if="profile.news.length" id="news" title="最新动态" en="News">
        <NewsList :items="profile.news" />
      </SectionBlock>

      <SectionBlock
        v-if="profile.publications.length"
        id="publications"
        title="论文发表"
        en="Publications"
      >
        <PublicationList :items="profile.publications" />
      </SectionBlock>

      <SectionBlock v-if="profile.awards.length" id="awards" title="获奖与荣誉" en="Awards">
        <InfoList :items="profile.awards" key-field="year" />
      </SectionBlock>

      <SectionBlock v-if="profile.services.length" id="services" title="学术服务" en="Services">
        <InfoList :items="profile.services" key-field="period" />
      </SectionBlock>

      <SectionBlock v-if="profile.teaching.length" id="teaching" title="教学经历" en="Teaching">
        <InfoList :items="profile.teaching" key-field="period" />
      </SectionBlock>

      <SectionBlock id="contact" title="联系我" en="Contact">
        <p class="contact-line">
          欢迎交流与合作，最直接的方式是邮件：
          <a :href="`mailto:${profile.email}`">{{ emailText }}</a>
        </p>
        <p class="contact-line contact-line--links">
          <template v-for="(link, index) in contactLinks" :key="link.label">
            <a :href="link.url" target="_blank" rel="noopener">{{ link.label }}</a>
            <span v-if="index < contactLinks.length - 1" class="sep" aria-hidden="true">·</span>
          </template>
        </p>
      </SectionBlock>
    </div>
  </main>

  <AppFooter />
</template>

<style scoped>
.layout {
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 46px 32px 0;
  display: grid;
  grid-template-columns: var(--aside) minmax(0, 1fr);
  gap: 56px;
  align-items: start;
}

.content {
  min-width: 0;
}

.bio p {
  margin: 0 0 15px;
  font-size: 16px;
  line-height: 1.9;
  color: var(--text);
}

.bio p:last-child {
  margin-bottom: 0;
}

.bullets {
  margin: 0;
  padding-left: 1.2em;
  display: grid;
  gap: 6px;
  font-size: 15.5px;
  line-height: 1.85;
  color: var(--text);
}

.bullets li::marker {
  color: var(--text-faint);
}

.contact-line {
  margin: 0 0 8px;
  font-size: 15.5px;
  line-height: 1.85;
  color: var(--text);
}

.contact-line--links {
  font-family: var(--font-sans);
  font-size: 13.5px;
  color: var(--text-soft);
}

.sep {
  margin: 0 8px;
  color: var(--text-faint);
}

@media (max-width: 820px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 30px;
    padding: 28px 20px 0;
  }
}
</style>
