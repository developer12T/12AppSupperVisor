<template>
    <div class="product-form">
        <h1>New Product</h1>

        <form @submit.prevent="onSubmit">
            <!-- Errors -->
            <div v-if="errors.length" class="errors">
                <p><strong>Please fix the following:</strong></p>
                <ul>
                    <li v-for="(e, i) in errors" :key="i">{{ e }}</li>
                </ul>
            </div>

            <!-- Basic Info -->
            <fieldset class="section">
                <legend>Basic Info</legend>
                <div class="grid">
                    <label>
                        <span>Product ID*</span>
                        <input v-model.trim="form.id" placeholder="e.g. 10010101006" required />
                    </label>
                    <label>
                        <span>Name*</span>
                        <input v-model.trim="form.name" placeholder="Product name" required />
                    </label>
                    <label class="col-2">
                        <span>Image URL</span>
                        <input v-model.trim="form.image" placeholder="https://..." />
                    </label>
                </div>
            </fieldset>

            <!-- Classification -->
            <fieldset class="section">
                <legend>Classification</legend>
                <div class="grid">
                    <label>
                        <span>Group</span>
                        <input v-model.trim="form.group" />
                    </label>
                    <label>
                        <span>Group Code</span>
                        <input v-model.trim="form.groupCode" />
                    </label>
                    <label>
                        <span>Group (M3)</span>
                        <input v-model.trim="form.groupM3" />
                    </label>
                    <label>
                        <span>Group Code (M3)</span>
                        <input v-model.trim="form.groupCodeM3" />
                    </label>
                    <label>
                        <span>Brand</span>
                        <input v-model.trim="form.brand" />
                    </label>
                    <label>
                        <span>Brand Code</span>
                        <input v-model.trim="form.brandCode" />
                    </label>
                    <label>
                        <span>Size</span>
                        <input v-model.trim="form.size" />
                    </label>
                    <label>
                        <span>Flavour</span>
                        <input v-model.trim="form.flavour" />
                    </label>
                    <label>
                        <span>Flavour Code</span>
                        <input v-model.trim="form.flavourCode" />
                    </label>
                    <label>
                        <span>Type</span>
                        <input v-model.trim="form.type" />
                    </label>
                </div>
            </fieldset>

            <!-- Weights -->
            <fieldset class="section">
                <legend>Weights</legend>
                <div class="grid">
                    <label>
                        <span>Weight Gross (kg)</span>
                        <input type="number" step="0.01" min="0" v-model.number="form.weightGross" />
                    </label>
                    <label>
                        <span>Weight Net (kg)</span>
                        <input type="number" step="0.01" min="0" v-model.number="form.weightNet" />
                    </label>
                </div>
            </fieldset>

            <!-- Statuses -->
            <fieldset class="section">
                <legend>Statuses</legend>
                <div class="grid">
                    <label>
                        <span>Status (Sale)</span>
                        <select v-model="form.statusSale">
                            <option value="">—</option>
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                            <option value="blocked">blocked</option>
                        </select>
                    </label>
                    <label>
                        <span>Status (Withdraw)</span>
                        <select v-model="form.statusWithdraw">
                            <option value="">—</option>
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                            <option value="blocked">blocked</option>
                        </select>
                    </label>
                    <label>
                        <span>Status (Refund)</span>
                        <select v-model="form.statusRefund">
                            <option value="">—</option>
                            <option value="active">active</option>
                            <option value="inactive">inactive</option>
                            <option value="blocked">blocked</option>
                        </select>
                    </label>
                </div>
            </fieldset>

            <!-- Units -->
            <fieldset class="section">
                <legend>Units & Prices</legend>
                <div class="units">
                    <table>
                        <thead>
                            <tr>
                                <th style="min-width: 120px;">Unit Code</th>
                                <th>Display Name</th>
                                <th>Factor*</th>
                                <th>Sale</th>
                                <th>Refund</th>
                                <th>Refund (Damage)</th>
                                <th>Change</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(u, idx) in form.listUnit" :key="idx">
                                <td>
                                    <input v-model.trim="u.unit" placeholder="e.g. CTN" />
                                </td>
                                <td>
                                    <input v-model.trim="u.name" placeholder="e.g. หีบ" />
                                </td>
                                <td>
                                    <input type="number" min="1" step="1" v-model.number="u.factor" />
                                </td>
                                <td>
                                    <input type="number" min="0" step="0.01" v-model.number="u.price.sale" />
                                </td>
                                <td>
                                    <input type="number" min="0" step="0.01" v-model.number="u.price.refund" />
                                </td>
                                <td>
                                    <input type="number" min="0" step="0.01" v-model.number="u.price.refundDmg" />
                                </td>
                                <td>
                                    <input type="number" min="0" step="0.01" v-model.number="u.price.change" />
                                </td>
                                <td class="actions">
                                    <button type="button" class="danger" @click="removeUnit(idx)"
                                        aria-label="Remove unit">✕</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="unit-actions">
                        <button type="button" class="secondary" @click="addUnit">+ Add Unit</button>
                    </div>
                </div>
            </fieldset>

            <!-- Actions -->
            <div class="form-actions">
                <button :disabled="submitting" class="primary" type="submit">
                    {{ submitting ? 'Saving…' : 'Save Product' }}
                </button>
                <button type="button" class="ghost" @click="resetToSample" :disabled="submitting">Reset to
                    Sample</button>
                <button type="button" class="ghost" @click="clearAll" :disabled="submitting">Clear All</button>
            </div>

            <!-- Preview JSON -->
            <details class="preview">
                <summary>Preview JSON</summary>
                <pre>{{ prettyForm }}</pre>
            </details>
        </form>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'

type Price = { sale: number; refund: number; refundDmg: number; change: number }
type Unit = { unit: string; name: string; factor: number; price: Price }

type Product = {
    id: string
    name: string
    group: string
    groupCode: string
    groupCodeM3: string
    groupM3: string
    brand: string
    brandCode: string
    size: string
    flavour: string
    flavourCode: string
    type: string
    weightGross: number
    weightNet: number
    statusSale: string
    statusWithdraw: string
    statusRefund: string
    image: string
    listUnit: Unit[]
}

const sampleProduct: Product = {
    id: '10010101006',
    name: 'New Product',
    group: 'new',
    groupCode: 'new',
    groupCodeM3: 'new',
    groupM3: 'new',
    brand: 'new',
    brandCode: 'new',
    size: 'new',
    flavour: 'new',
    flavourCode: 'new',
    type: 'new',
    weightGross: 3.12,
    weightNet: 2.4,
    statusSale: '',
    statusWithdraw: '',
    statusRefund: '',
    image: '',
    listUnit: [
        {
            unit: 'CTN',
            name: 'หีบ',
            factor: 10,
            price: { sale: 385, refund: 385, refundDmg: 385, change: 0 }
        },
        {
            unit: 'PCS',
            name: 'ชิ้น',
            factor: 1,
            price: { sale: 19.25, refund: 19.25, refundDmg: 19.25, change: 0 }
        }
    ]
}

const form = reactive<Product>(structuredClone(sampleProduct))
const submitting = ref(false)
const errors = ref<string[]>([])

const prettyForm = computed(() => JSON.stringify(form, null, 2))

function addUnit() {
    form.listUnit.push({
        unit: '',
        name: '',
        factor: 1,
        price: { sale: 0, refund: 0, refundDmg: 0, change: 0 }
    })
}

function removeUnit(index: number) {
    form.listUnit.splice(index, 1)
}

function resetToSample() {
    Object.assign(form, structuredClone(sampleProduct))
}

function clearAll() {
    const cleared: Product = {
        id: '',
        name: '',
        group: '',
        groupCode: '',
        groupCodeM3: '',
        groupM3: '',
        brand: '',
        brandCode: '',
        size: '',
        flavour: '',
        flavourCode: '',
        type: '',
        weightGross: 0,
        weightNet: 0,
        statusSale: '',
        statusWithdraw: '',
        statusRefund: '',
        image: '',
        listUnit: []
    }
    Object.assign(form, cleared)
}

function validate(): boolean {
    errors.value = []
    if (!form.id) errors.value.push('Product ID is required.')
    if (!form.name) errors.value.push('Name is required.')
    if (form.weightGross < 0) errors.value.push('Weight Gross must be \u2265 0.')
    if (form.weightNet < 0) errors.value.push('Weight Net must be \u2265 0.')
    if (!form.listUnit.length) errors.value.push('At least one unit is required.')

    form.listUnit.forEach((u, i) => {
        if (!u.unit) errors.value.push(`Unit code at row ${i + 1} is required.`)
        if (u.factor == null || u.factor < 1 || !Number.isFinite(u.factor))
            errors.value.push(`Factor at row ${i + 1} must be an integer \u2265 1.`)
                ; (['sale', 'refund', 'refundDmg', 'change'] as const).forEach((k) => {
                    const val = u.price[k]
                    if (val == null || val < 0 || !Number.isFinite(val))
                        errors.value.push(`${k} price at row ${i + 1} must be \u2265 0.`)
                })
    })

    return errors.value.length === 0
}

async function onSubmit() {
    if (!validate()) return
    try {
        submitting.value = true

        // Adjust the endpoint and headers to match your backend
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        })

        if (!res.ok) {
            const msg = await res.text()
            throw new Error(msg || 'Failed to save')
        }

        alert('Product saved successfully!')
        // Optionally clear form or keep values
        // clearAll()
    } catch (err: any) {
        alert(`Error: ${err.message || err}`)
    } finally {
        submitting.value = false
    }
}
</script>

<style scoped>
.product-form {
    max-width: 1100px;
    margin: 2rem auto;
    padding: 1.25rem;
}

.product-form h1 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
}

.section {
    margin: 1rem 0;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 1rem;
}

.section>legend {
    padding: 0 .5rem;
    font-weight: 600;
}

.grid {
    display: grid;
    gap: .75rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid .col-2 {
    grid-column: span 2;
}

label {
    display: grid;
    gap: .25rem;
    font-size: .9rem;
}

input,
select {
    height: 36px;
    padding: 0 .5rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: .95rem;
}

input[type="number"] {
    text-align: right;
}

.errors {
    background: #fff1f2;
    border: 1px solid #fecdd3;
    color: #991b1b;
    padding: .75rem;
    border-radius: 6px;
    margin-bottom: .75rem;
}

.errors ul {
    margin: .25rem 0 0 1rem;
}

.units table {
    width: 100%;
    border-collapse: collapse;
}

.units th,
.units td {
    border: 1px solid #e5e7eb;
    padding: .5rem;
}

.units .actions {
    text-align: center;
}

.unit-actions {
    margin-top: .5rem;
}

.form-actions {
    display: flex;
    gap: .5rem;
    margin-top: 1rem;
}

button {
    height: 38px;
    padding: 0 .9rem;
    border: 1px solid #d1d5db;
    background: #f9fafb;
    border-radius: 8px;
    cursor: pointer;
}

button.primary {
    background: #111827;
    color: #fff;
    border-color: #111827;
}

button.secondary {
    background: #111827;
    color: #fff;
    border-color: #111827;
}

button.ghost {
    background: transparent;
}

button.danger {
    background: #fee2e2;
    border-color: #fecaca;
}

button:disabled {
    opacity: .6;
    cursor: not-allowed;
}

.preview {
    margin-top: 1rem;
}

pre {
    background: #0b1020;
    color: #d1e7ff;
    padding: 1rem;
    border-radius: 8px;
    overflow: auto;
}
</style>
