<template>
    <header v-if="componentVisible">
      <div class="logo-container">
        <div class="title-glass-wrapper">
          <h1 class="text-logo">
            LaoWang Nav
            <sup class="trademark">®</sup>
          </h1>
        </div>
      </div>
      <!-- PageTitle removed to prevent duplicate text -->
      <div class="header-right">
        <HeaderInfo class="header-weather" />
        <Nav v-if="navVisible" :links="pageInfo.navLinks" class="nav" />
      </div>
    </header>
</template>

<script>
import PageTitle from '@/components/PageStrcture/PageTitle.vue';
import HeaderInfo from '@/components/PageStrcture/HeaderInfo.vue';
import Nav from '@/components/PageStrcture/Nav.vue';
import { shouldBeVisible } from '@/utils/SectionHelpers';

export default {
  name: 'Header',
  components: {
    PageTitle,
    HeaderInfo,
    Nav,
  },
  props: {
    pageInfo: Object,
  },
  computed: {
    componentVisible() {
      return shouldBeVisible(this.$route.name);
    },
    visibleComponents() {
      return this.$store.getters.visibleComponents;
    },
    titleVisible() {
      return this.visibleComponents.pageTitle;
    },
    navVisible() {
      return this.visibleComponents.navigation;
    },
  },
};
</script>

<style scoped lang="scss">

@import '@/styles/media-queries.scss';

  header {
    margin: 0;
    padding: 0.5rem;
    display: flex;
    justify-content: space-between;
    background: var(--background-darker);
    align-items: center;
    align-content: flex-start;
    @include phone {
      flex-direction: column-reverse;
    }
  }

  .logo-container {
    display: flex;
    align-items: center;
    padding-left: 1rem;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 1rem;
    
    @include phone {
      flex-direction: column;
      gap: 0.5rem;
    }
  }

  .header-weather {
    flex-shrink: 0;
  }

  .title-glass-wrapper {
    position: relative;
    padding: 0.5rem 1rem;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      transform: translateY(-2px);
    }
  }

  .text-logo {
    position: relative;
    font-size: 2.5rem;
    font-weight: 700;
    margin: 0;
    font-family: 'SF Pro Display', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, 
      var(--primary) 0%, 
      var(--heading-text-color) 50%,
      var(--primary) 100%);
    background-size: 200% 200%;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: none;
    animation: gradientShift 6s ease infinite;
    
    .trademark {
      position: absolute;
      top: 0.2rem;
      right: -1.2rem;
      font-size: 1.1rem;
      font-weight: 700;
      opacity: 0.9;
      background: var(--primary);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  @keyframes gradientShift {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }

  @include phone {
    .title-glass-wrapper {
      padding: 0.8rem 2rem;
    }
    
    .text-logo {
      font-size: 1.8rem;
      
      .trademark {
        font-size: 0.7rem;
        top: 0.2rem;
        right: -0.7rem;
      }
    }
  }
</style>
