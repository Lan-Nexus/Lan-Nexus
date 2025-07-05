<template>
  <div>
    <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <img v-for="item in items" :key="item.id" :src="item.thumb"
        :class="imgClass(item)"
        class="rounded-lg cursor-pointer transition-all duration-200"
        @click="select(item)"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  title: String,
  items: Array,
  selected: Object,
  onSelect: Function,
  imgSize: {
    type: String,
    default: 'w-42'
  }
});

function select(item) {
  if (props.onSelect) props.onSelect(item);
}

const imgClass = (item) => {
  return [
    props.imgSize,
    props.selected === item
      ? 'ring-4 ring-blue-500 border-2 border-blue-500 scale-105'
      : 'hover:ring-2 hover:ring-blue-300'
  ].join(' ');
};

</script>
