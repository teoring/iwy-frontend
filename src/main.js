import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import { router  } from './router'

import PrimeVue from 'primevue/config';
import Button from "primevue/button"
import Panel from "primevue/panel"
import Password from "primevue/password"
import InputText from "primevue/inputtext"
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import Card from 'primevue/card';
import Image from 'primevue/image';
import StyleClass from 'primevue/styleclass';
import Ripple from 'primevue/ripple';
import Tooltip from 'primevue/tooltip';
import BadgeDirective from "primevue/badgedirective";
import Avatar from 'primevue/avatar';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import InlineMessage from 'primevue/inlinemessage';
import Menubar from 'primevue/menubar';
import Badge from 'primevue/badge';
import Sidebar from 'primevue/sidebar';
import Menu from 'primevue/menu';
import DataView from 'primevue/dataview';
import DataViewLayoutOptions from 'primevue/dataviewlayoutoptions'
import Skeleton from 'primevue/skeleton';
import Tag from 'primevue/tag';
import Chip from 'primevue/chip'
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import Toolbar from 'primevue/toolbar';
import InputNumber from 'primevue/inputnumber';
import Listbox from 'primevue/listbox';
import SelectButton from 'primevue/selectbutton';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import DialogService from 'primevue/dialogservice';
import DynamicDialog from 'primevue/dynamicdialog';
import Steps from 'primevue/steps';
import ProgressSpinner from 'primevue/progressspinner';
import Chart from 'primevue/chart';

import '@/assets/styles.scss';

const app = createApp(App);

app.use(DialogService);
app.use(PrimeVue, { ripple: true });

app.directive('tooltip', Tooltip);
app.directive('badge', BadgeDirective);
app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);

app.component('Steps', Steps);
app.component('DynamicDialog', DynamicDialog);
app.component('Divider', Divider);
app.component('Dialog', Dialog);
app.component('Listbox', Listbox);
app.component('InputNumber', InputNumber);
app.component('Toolbar', Toolbar);
app.component('Dropdown', Dropdown);
app.component('Checkbox', Checkbox);
app.component('Chip', Chip);
app.component('Tag', Tag);
app.component('Skeleton', Skeleton);
app.component('DataViewLayoutOptions', DataViewLayoutOptions);
app.component('Menu', Menu);
app.component('Sidebar', Sidebar);
app.component('Badge', Badge);
app.component('InlineMessage', InlineMessage);
app.component('Toast', Toast);
app.component('Avatar', Avatar);
app.component('Button', Button);
app.component('Panel', Panel);
app.component('Password', Password);
app.component('InputText', InputText);
app.component('Card', Card);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('Image', Image);
app.component('Menubar', Menubar);
app.component('DataView', DataView);
app.component('SelectButton', SelectButton );
app.component('ProgressSpinner', ProgressSpinner);
app.component('Chart', Chart);

app.use(store)
app.use(router)
app.use(ToastService);

app.mount('#app')
