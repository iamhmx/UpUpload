import Vue from 'vue'
import {
  Button,
  Progress,
  Message,
  Input,
  RadioGroup,
  RadioButton,
  MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Progress)
Vue.use(Input)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
