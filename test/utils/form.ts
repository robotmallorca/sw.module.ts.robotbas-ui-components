import { reactive } from 'vue'
import type { Reactive } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'

import {
  // RobotbasForm,
  RobotbasInput,
  RobotbasFormField,
  // RobotbasRadioGroup,
  // RobotbasTextarea,
  RobotbasCheckbox,
  RobotbasSelect,
  RobotbasCombobox,
  // RobotbasInputMenu,
  // RobotbasInputNumber,
  // RobotbasSwitch,
  // RobotbasSlider,
  // RobotbasPinInput,
  // RobotbasCheckboxGroup,
  // RobotbasFileUpload
} from '#components'

// export async function renderForm(options: {
//   state?: Reactive<any>
//   props?: Partial<FormProps<any>> & Record<string, any>
//   slotVars?: object
//   slotTemplate?: string
//   fixture?: string
// }) {
//   const state = options.state ?? reactive({})

//   if (options.fixture) {
//     const fixture = await import(/* @vite-ignore */ `../components/fixtures/${options.fixture}.vue`).then(c => c.default)
//     return await mountSuspended(fixture, {
//       props: options.props
//     })
//   }

//   return await mountSuspended(UForm, {
//     props: {
//       id: '42',
//       state,
//       ...options.props
//     },
//     slots: {
//       default: {
//         setup() {
//           return { state, ...options.slotVars }
//         },
//         components: {
//           RobotbasFormField,
//           // RobotbasForm,
//           RobotbasInput,
//           // RobotbasRadioGroup,
//           // RobotbasTextarea,
//           RobotbasCheckbox,
//           RobotbasSelect,
//           RobotbasCombobox,
//           // RobotbasInputMenu,
//           // RobotbasInputNumber,
//           // RobotbasSwitch,
//           // RobotbasSlider,
//           // RobotbasPinInput,
//           // RobotbasCheckboxGroup,
//           // RobotbasFileUpload
//         },
//         template: options.slotTemplate
//       }
//     }
//   })
// }
