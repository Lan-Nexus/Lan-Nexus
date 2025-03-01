<template>
  <div class="w-1/3 h-full bg-base-content shadow-lg flex flex-col pb-20 overflow-y-auto">
    <div>
      <div
        class="flex gap-4 p-4"
      >
        <img
          alt="game"
          class="h-8 sm:h-16 sm:h-16 md:h-20 md:h-20 lg:h-24"
        />
        <div class="flex flex-col justify-center items-center">
          <div
            class="md:text-1xl lg:text-2xl font-bold"
          >
          <p>title</p>
          <span class="badge badge-outline">
            installed
          </span>
          </div>
        </div>
      </div>
      <div class="flex gap-4 p-4 flex-justify-center items-center">
        <div
          class="skeleton h-8 sm:h-16 sm:h-16 md:h-20 md:h-20 lg:h-24 w-8 sm:w-16 sm:w-16 md:w-20 md:w-20 lg:w-24"
          v-if="true"
        ></div>
        <div
          class="skeleton h-8 w-1/2"
          v-if="true"
        ></div>
      </div>
      <div class="flex justify-center items-center h-12">
        <span
          v-show="true"
          class="loading loading-dots loading-lg"
        ></span>
      </div>
    </div>
  </div>
</template>
