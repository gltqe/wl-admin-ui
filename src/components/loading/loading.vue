<template>
  <div class="loading-container" v-if="show">
    <div class="jumping-boxes">
      <div class="box box1"></div>
      <div class="box box2"></div>
      <div class="box box3"></div>
      <div class="box box4"></div>
    </div>
  </div>
</template>

<script setup name="Loading">
import {onMounted, ref} from "vue";

const show = ref(false);

const showLoading = () => {
  show.value = true;
  document.body.style.overflow = "hidden";
  document.addEventListener("touchmove", () => {
  }, true);
};

const hideLoading = () => {
  show.value = false;
  const mo = function (e) {
    e.preventDefault();
  };
  document.body.style.overflow = "";
  document.removeEventListener("touchmove", mo, true);
};

onMounted(() => {
});

defineExpose({
  show,
  showLoading,
  hideLoading,
});
</script>

<style scoped>
.loading-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.jumping-boxes {
  display: flex;
  align-items: center;
  height: 100px;
  margin-top: -5%;
}

.box {
  width: 20px;
  height: 20px;
  margin: 0 8px;
  background-color: #2196F3;
  animation: jump 0.8s ease-in-out infinite;
}

.box1 {
  animation-delay: 0.1s;
}

.box2 {
  animation-delay: 0.2s;
}

.box3 {
  animation-delay: 0.3s;
}

.box4 {
  animation-delay: 0.4s;
}

@keyframes jump {
  0%, 100% {
    transform: translateY(0);
    background-color: #2196F3;
  }
  30% {
    transform: translateY(-30px);
    background-color: #0D47A1;
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-15px);
  }
}
</style>
