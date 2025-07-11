
const Home = {
  template: `
    <div class="landing-hero">
      <div class="hero-content">
        <img class="hero-logo" src="https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg" alt="Logo">
        <h1>Professional Invoice Generator</h1>
        <p>Create, customize and manage invoices in seconds.</p>
        <div class="hero-buttons">
          <router-link to="/create"><button class="cta">Create Invoice</button></router-link>
          <router-link to="/history"><button class="cta">View History</button></router-link>
        </div>
      </div>
    </div>
  `
};

const CreateInvoice = {
  data() {
    return {
      id: null,
      client: '',
      date: '',
      items: [
        { description: 'Logo Design', qty: 1, rate: 1000 },
        { description: 'Web Development', qty: 2, rate: 5000 },
        { description: 'Hosting Service', qty: 1, rate: 2000 },
        { description: 'Maintenance Package', qty: 3, rate: 1500 },
        { description: 'SEO Optimization', qty: 1, rate: 2500 }
      ]
    };
  },
  created() {
    if (this.$route.params.id) {
      const invoice = JSON.parse(localStorage.getItem('invoices'))?.find(inv => inv.id === this.$route.params.id);
      if (invoice) {
        this.id = invoice.id;
        this.client = invoice.client;
        this.date = invoice.date;
        this.items = invoice.items;
      }
    }
  },
  computed: {
    total() {
      return this.items.reduce((sum, item) => sum + item.qty * item.rate, 0);
    }
  },
  methods: {
    saveInvoice() {
      let invoices = JSON.parse(localStorage.getItem('invoices')) || [];
      const data = {
        id: this.id || Date.now().toString(),
        client: this.client,
        date: this.date,
        items: this.items
      };

      if (this.id) {
        invoices = invoices.map(inv => inv.id === this.id ? data : inv);
      } else {
        invoices.push(data);
      }

      localStorage.setItem('invoices', JSON.stringify(invoices));
      this.$router.push('/history');
    }
  },
  template: `
    <div>
      <h2>{{ id ? 'Edit Invoice' : 'Create Invoice' }}</h2>
      <div class="form-group">
        <label>Client Name</label>
        <input v-model="client" type="text" placeholder="Enter client name">
      </div>
      <div class="form-group">
        <label>Date</label>
        <input v-model="date" type="date">
      </div>
      <h3>Items (Max 5)</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Description</th>
            <th>Qty</th>
            <th>Rate</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in items" :key="index">
            <td>{{ index + 1 }}</td>
            <td><input v-model="item.description"></td>
            <td><input type="number" v-model.number="item.qty" min="0"></td>
            <td><input type="number" v-model.number="item.rate" min="0"></td>
            <td>₹{{ item.qty * item.rate }}</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Total:</strong> ₹{{ total }}</p>
      <button @click="saveInvoice">Save Invoice</button>
    </div>
  `
};

const InvoiceHistory = {
  data() {
    return { invoices: [] };
  },
  mounted() {
    this.invoices = JSON.parse(localStorage.getItem('invoices')) || [];
  },
  methods: {
    deleteInvoice(id) {
      if (confirm("Are you sure you want to delete this invoice?")) {
        this.invoices = this.invoices.filter(inv => inv.id !== id);
        localStorage.setItem('invoices', JSON.stringify(this.invoices));
      }
    }
  },
  template: `
    <div>
      <h2>Invoice History</h2>
      <table v-if="invoices.length">
        <thead>
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Date</th>
            <th>Total</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inv in invoices" :key="inv.id">
            <td>{{ inv.id }}</td>
            <td>{{ inv.client }}</td>
            <td>{{ inv.date }}</td>
            <td>₹{{ inv.items.reduce((t, i) => t + i.qty * i.rate, 0) }}</td>
            <td>
              <router-link :to="'/edit/' + inv.id">Edit</router-link> |
              <a href="#" @click.prevent="deleteInvoice(inv.id)">Delete</a>
            </td>
          </tr>
        </tbody>
      </table>
      <p v-else>No invoices available.</p>
    </div>
  `
};

const routes = [
  { path: '/', component: Home },
  { path: '/create', component: CreateInvoice },
  { path: '/edit/:id', component: CreateInvoice },
  { path: '/history', component: InvoiceHistory }
];

const router = VueRouter.createRouter({
  history: VueRouter.createWebHashHistory(),
  routes
});

Vue.createApp({}).use(router).mount('#app');

