export const styleJsxGlobal =
  `
        /* Creating some classes and mixins to reuse */

        .primary-background-color {
          @apply bg-white;
        }
        .active-bg-color {
          @apply !bg-yellow-200;
        }
        .close-bg-color {
          @apply bg-red-400;
        }
        .active-text-color {
          @apply !text-red-400;
        }
        .primary-border-color {
          @apply border-red-400;
        }
        .primary-border-top-color {
          @apply !border-t-red-400;
        }
        .primary-border-bottom-color {
          @apply !border-b-red-400;
        }
        .border-based-arrow-color {
          @apply border-gray-700;
        }
        .item-hover-color {
          @apply !bg-gray-100;
        }
        .text-primary {
          @apply text-gray-700;
        }
        .text-light {
          @apply !text-gray-500;
        }
        .text-disabled {
          @apply !text-gray-300;
        }
        .scrollbar-base-color {
          @apply bg-yellow-100;
        }
        .scrollbar-thumb-color {
          @apply bg-yellow-300;
        }

        @mixin highlighted-item {
          & {
            @apply active-bg-color active-text-color;
            &:hover {
              @apply active-bg-color;
            }
          }
        }

        @mixin styled-scrollbar {
          &::-webkit-scrollbar-track {
            @apply scrollbar-base-color;
          }

          &::-webkit-scrollbar {
            @apply w-1 h-1 scrollbar-base-color;
          }

          &::-webkit-scrollbar-thumb {
            @apply scrollbar-thumb-color;
          }
        }

        @mixin option-arrow-base {
          & {
            content: "";
            @apply absolute block border-t border-r border-based-arrow-color h-2 w-2 left-1/2 -translate-x-1/2;
          }
        }

        .react-datepicker {
          @apply border primary-border-color rounded-md !p-2;
          &__navigation {
            *::before {
              @apply !border-t !border-r border-based-arrow-color;
            }
            &:hover *::before {
              @apply primary-border-color;
            }

            &--previous {
              @apply left-[0.625rem];
            }
            &--next {
              @apply right-[0.625rem];
            }
            &--next--with-time:not(&--next--with-today-button) {
              @apply left-[13.5rem];
            }
          }

          &__triangle::before {
            @apply h-[3px] border-[5px] !important;
          }

          &__triangle::after {
            @apply border-b-white h-[3px] border-[5px] !important;
          }

          &-popper[data-placement^="top"] {
            .react-datepicker__triangle::before {
              @apply primary-border-top-color primary-background-color !important;
            }
          }

          &-popper[data-placement^="bottom"] {
            .react-datepicker__triangle::before {
              @apply primary-border-bottom-color primary-background-color !important;
            }
          }

          &__header {
            @apply primary-background-color border-b-0;
          }

          &__current-month,
          &-year-header,
          &-time__header {
            @apply !text-xs !font-extralight text-light -mt-1 pb-1;
          }

          &__day {
            &-name {
              @apply text-light;
            }

            &:hover {
              @apply item-hover-color;
            }
          }

          &__year,
          &__quarter,
          &__month,
          &__day {
            @apply text-primary rounded-md;

            &--selected,
            &--keyboard-selected,
            &-text--selected,
            &-text--keyboard-selected,
            &--in-range,
            &--in-selecting-range {
              @include highlighted-item;
            }

            &--disabled,
            &--excluded {
              @apply text-disabled cursor-not-allowed;
            }
          }

          &__year,
          &__quarter,
          &__month {
            @apply py-[0.1rem];
            &-text {
              @apply py-[0.1rem] px-[0.1rem] !w-[4.5rem];
            }
          }

          &__time {
            &-container {
              @apply border-l-0 w-24;
            }

            &-list {
              @apply space-y-1;
              &-item {
                @apply flex rounded-md justify-center items-center text-xs mx-1;

                &:hover {
                  @apply item-hover-color;
                }

                &--selected {
                  @include highlighted-item;
                }

                &--disabled,
                &--excluded {
                  @apply text-disabled cursor-not-allowed !important;
                }
              }

              @include styled-scrollbar;
            }
          }

          &__close-icon {
            @apply pr-9;
            &::after {
              @apply close-bg-color font-extrabold;
            }
          }

          &__year,
          &__month,
          &__month-year {
            &-dropdown {
              @apply primary-background-color primary-border-color w-2/3 py-2;
              @include styled-scrollbar;

              &-container {
                @apply text-xs font-extralight text-light;
              }

              .react-datepicker__year-option {
                &:first-child {
                  a {
                    @apply h-4;
                    &::before {
                      @include option-arrow-base;
                      @apply top-1/2 translate-y-1/2 -rotate-45;
                    }
                  }
                }
                &:last-child {
                  a {
                    @apply h-4;
                    &::after {
                      @include option-arrow-base;
                      @apply -translate-y-1/2 rotate-[135deg];
                    }
                  }
                }
              }
            }

            &-read-view {
              &--down-arrow {
                @apply !border-t !border-r border-based-arrow-color h-[0.375rem] w-[0.375rem] mt-[0.188rem];
              }
              &:hover &--down-arrow {
                @apply primary-border-color;
              }
            }

            &-option,
            &-option--selected_month-year {
              @apply py-1;
            }
            &-option {
              &--selected {
                @apply active-text-color;
              }

              &:hover {
                @apply item-hover-color;
              }
            }
          }

          &__input-time-container {
            @apply flex items-center justify-between pr-6 text-primary;
            input {
              @apply outline-none;
            }
          }
        }
      `