const STORAGE_KEY = "corporate-housing-proposal-v1";
const CLOUD_SYNC_ENDPOINT_KEY = "vm-cloud-sync-endpoint";
const SUPABASE_URL_KEY = "vm-supabase-url";
const SUPABASE_ANON_KEY = "vm-supabase-anon-key";
const AUTH_CONFIG_LOCK_KEY = "vm-auth-config-locked";
const LOCAL_TEST_SESSION_KEY = "vm-local-test-session";
const DEFAULT_SUPABASE_URL = "https://ohrjghkdrwqslvdtcleo.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "sb_publishable_toVTnlfbkYpprefiRvfo1w_BbwyrdKO";
const OWNER_ADMIN_EMAILS = new Set([
  "fmarquesescritorio@gmail.com",
  "lu.priscila@hotmail.com",
]);
const CLOUD_STATE_SYNC_DEBOUNCE_MS = 1200;
const CLOUD_SHARED_STATE_ID = "global";
const CLOUD_SHARED_STATE_REFRESH_MS = 12000;
const LOCAL_TEST_EMAIL = "teste@vila.com";
const LOCAL_TEST_USERNAME = "teste";
const LOCAL_TEST_PASSWORD = "teste";
const ALLOW_LOCAL_TEST_LOGIN = false;
const ALLOW_PUBLIC_SIGNUP = false;
const FIXED_LOGO_PATH = "/assets/logo-vila-marques.png";
const CONTRACTOR_INFO = {
  companyName: "Vila Marques Alojamentos",
  cnpj: "58.924.922/0001-75",
  responsible: "Fred Marques",
  phone: "(31) 99578-5160",
};
const DEFAULT_FURNITURE = [
  { item: "Geladeira", environment: "Cozinha" },
  { item: "Fogão", environment: "Cozinha" },
  { item: "Micro-ondas", environment: "Cozinha" },
  { item: "Armário", environment: "Cozinha" },
  { item: "Multiuso", environment: "Quarto" },
  { item: "Cama box", environment: "Quarto" },
  { item: "Colchão D33", environment: "Quarto" },
  { item: "Ventilador", environment: "Quarto" },
  { item: "TV Smart", environment: "Sala" },
  { item: "Varais", environment: "Área de serviço" },
  { item: "Tábua de passar", environment: "Área de serviço" },
  { item: "Ferro de passar", environment: "Área de serviço" },
  { item: "Sofá", environment: "Sala" },
  { item: "Máquina de lavar roupas", environment: "Área de serviço" },
  { item: "Papeleira", environment: "Banheiro" },
  { item: "Papeleira", environment: "Cozinha" },
  { item: "Porta-Copos", environment: "Cozinha" },
  { item: "Escova sanitária", environment: "Banheiro" },
  { item: "Mesa para 4 pessoas", environment: "Copa/Cozinha" },
  { item: "Mesa para 6 pessoas", environment: "Copa/Cozinha" },
];
const ENVIRONMENT_ORDER = [
  "Cozinha",
  "Copa/Cozinha",
  "Sala",
  "Quarto",
  "Banheiro",
  "Área de serviço",
  "Não informado",
];
const FURNITURE_VARIANTS = {
  "Cama box": {
    label: "Tipo",
    options: ["Solteiro", "Casal"],
  },
  Multiuso: {
    label: "Modelo",
    options: ["2 portas", "3 portas"],
  },
};

const state = {
  company: {},
  clients: [],
  property: {},
  furniture: [],
  proposalPhotos: [],
  pricing: {},
  proposal: {},
  payslip: {
    competence: "",
    referenceMonth: "",
    paymentDate: "",
    paymentMethod: "",
    selectedEmployeeId: "",
    monthTotalDays: "30",
    firstWorkDayInMonth: "",
    lastWorkDayInMonth: "",
    businessDaysInMonth: "22",
    absenceDays: "0",
    allowanceDays: "0",
    employeeName: "",
    employeeCpf: "",
    position: "",
    registration: "",
    baseSalary: "0",
    mealAllowanceFixed: "0",
    mealAllowanceDaily: "0",
    fixedDiscountPercent: "0",
    earnings: [],
    discounts: [],
  },
  payslipEmployees: [],
  balance: {
    entries: [],
  },
  taxes: {
    records: [],
  },
  contracts: createEmptyContract(),
  contractsPortfolio: [],
  activeContractId: "",
  rentedProperties: [],
  exports: [],
  deletedExportIds: [],
};
const uiState = {
  activeTab: "home",
  proposalStarted: false,
  proposalStep: 1,
  maxProposalStep: 6,
  editingClientId: "",
  viewingClientId: "",
  editingEmployeeId: "",
  viewingEmployeeId: "",
  pendingEmployeeDocuments: [],
  clientsFormOpen: false,
  employeesFormOpen: false,
  payslipFormOpen: false,
  contractsSavedView: "effective",
  contractsFormOpen: false,
  contractsEditMode: false,
  contractsVisibleValuesById: {},
  contractsSummaryVisible: false,
  contractsSimulationOpen: false,
  contractsSimulation: {
    capacity: "0",
    monthlyTaxPercent: "0",
    targetMonthlyProfit: "0",
    dailyRatePerPerson: "0",
    rentCost: "0",
    staffCost: "0",
    furnitureCost: "0",
    cleaningProductsCost: "0",
    waterCost: "0",
    electricityCost: "0",
    internetCost: "0",
    maintenanceCost: "0",
    proLaboreCost: "0",
  },
  rentedPropertiesFormOpen: false,
  editingRentedPropertyId: "",
  notificationsOpen: false,
  balanceMode: "monthly",
  balanceYear: new Date().getFullYear(),
  balanceMonth: new Date().getMonth() + 1,
  balanceContractId: "",
  editingTaxRecordId: "",
};

const authState = {
  client: null,
  user: null,
  mode: "none",
  permissions: null,
};
const cloudSyncState = {
  saveTimer: null,
  saveInFlight: false,
  pendingSave: false,
  suppressSave: false,
  hasLoadedFromCloud: false,
  sharedExports: [],
  sharedExportsLoaded: false,
  sharedExportsLoading: false,
  sharedExportsLastSyncAt: 0,
  sharedStateRefreshTimer: null,
  sharedStateLastUpdatedAt: 0,
};

const DEFAULT_APP_PERMISSIONS = {
  isAdmin: false,
  roleCategory: "funcionario",
  accessProposals: true,
  accessClients: true,
  accessEmployees: true,
  accessPayslip: false,
  accessBalance: true,
  accessContracts: false,
  accessExports: false,
  editClients: false,
  editEmployees: false,
  editContracts: false,
  exportProposal: true,
  exportPayslip: false,
  syncExports: false,
  viewFinancialValues: false,
};

const ROLE_PERMISSIONS = {
  administrador: {
    isAdmin: true,
    roleCategory: "administrador",
    accessProposals: true,
    accessClients: true,
    accessEmployees: true,
    accessPayslip: true,
    accessBalance: true,
    accessContracts: true,
    accessExports: true,
    editClients: true,
    editEmployees: true,
    editContracts: true,
    exportProposal: true,
    exportPayslip: true,
    syncExports: true,
    viewFinancialValues: true,
  },
  funcionario: {
    isAdmin: false,
    roleCategory: "funcionario",
    accessProposals: true,
    accessClients: true,
    accessEmployees: true,
    accessPayslip: false,
    accessBalance: true,
    accessContracts: false,
    accessExports: false,
    editClients: false,
    editEmployees: false,
    editContracts: false,
    exportProposal: true,
    exportPayslip: false,
    syncExports: false,
    viewFinancialValues: false,
  },
};

const currencyBRL = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
const CONTRACT_MONEY_FIELDS = [
  "dailyRatePerPerson",
  "rentCost",
  "staffCost",
  "furnitureCost",
  "cleaningProductsCost",
  "waterCost",
  "electricityCost",
  "internetCost",
  "maintenanceCost",
  "proLaboreCost",
];
const EXPENSE_CATEGORY_LABELS = {
  combustivel: "Combustível",
  pedagios: "Pedágios",
  alimentacao: "Alimentação",
  aluguel: "Aluguel",
  salario: "Salário",
  manutencao: "Manutenção",
  impostos: "Impostos",
  agua: "Água",
  luz: "Luz",
  internet: "Internet",
  outros: "Outros",
};
const APP_TABS = [
  "home",
  "proposals",
  "clients",
  "employees",
  "payslip",
  "balance",
  "taxes",
  "contracts",
  "rentedProperties",
  "exports",
];
const TAB_TO_SLUG = {
  home: "inicio",
  proposals: "propostas",
  clients: "clientes",
  employees: "funcionarios",
  payslip: "contracheque",
  balance: "balanco",
  taxes: "impostos",
  contracts: "contratos",
  rentedProperties: "imoveis-alugados",
  exports: "exportados",
};
const SLUG_TO_TAB = Object.entries(TAB_TO_SLUG).reduce((acc, [tab, slug]) => {
  acc[slug] = tab;
  return acc;
}, {});

function createEmptyContract() {
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    contractName: "",
    accommodationAddress: "",
    accommodationStreet: "",
    accommodationNumber: "",
    accommodationComplement: "",
    accommodationDistrict: "",
    accommodationCity: "",
    accommodationState: "",
    accommodationZipCode: "",
    clientId: "",
    rentedPropertyId: "",
    capacity: "0",
    dailyRatePerPerson: "0",
    monthlyTaxPercent: "0",
    measurementStartDay: "24",
    measurementEndDay: "24",
    receiptDay: "15",
    nextReceiptDateISO: "",
    receiptHistory: [],
    rentCost: "0",
    staffCost: "0",
    furnitureCost: "0",
    cleaningProductsCost: "0",
    waterCost: "0",
    electricityCost: "0",
    internetCost: "0",
    maintenanceCost: "0",
    proLaboreCost: "0",
    proLaboreRecipient: "",
    isEffective: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createEmptyRentedProperty() {
  const today = new Date();
  const nextYear = addMonthsSafe(today, 12, today.getDate());
  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: "",
    street: "",
    number: "",
    complement: "",
    district: "",
    city: "",
    state: "",
    zipCode: "",
    contractId: "",
    rentAmount: "0",
    contractStartDateISO: toISODateOnly(today),
    contractEndDateISO: toISODateOnly(nextYear),
    nextDueDateISO: toISODateOnly(today),
    paymentHistory: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

function createEmptyContractSimulation() {
  return {
    capacity: "0",
    monthlyTaxPercent: "0",
    targetMonthlyProfit: "0",
    dailyRatePerPerson: "0",
    rentCost: "0",
    staffCost: "0",
    furnitureCost: "0",
    cleaningProductsCost: "0",
    waterCost: "0",
    electricityCost: "0",
    internetCost: "0",
    maintenanceCost: "0",
    proLaboreCost: "0",
  };
}

function normalizeRentedProperty(property) {
  const base = { ...createEmptyRentedProperty(), ...(property || {}) };
  return {
    id: String(base.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    name: String(base.name || "").trim(),
    street: String(base.street || "").trim(),
    number: String(base.number || "").trim(),
    complement: String(base.complement || "").trim(),
    district: String(base.district || "").trim(),
    city: String(base.city || "").trim(),
    state: String(base.state || "").toUpperCase().replace(/[^A-Z]/g, "").slice(0, 2),
    zipCode: formatCEP(base.zipCode || ""),
    contractId: String(base.contractId || "").trim(),
    rentAmount: String(parseBRLNumber(base.rentAmount || 0)),
    contractStartDateISO: String(base.contractStartDateISO || "").trim(),
    contractEndDateISO: String(base.contractEndDateISO || "").trim(),
    nextDueDateISO: String(base.nextDueDateISO || "").trim(),
    paymentHistory: (Array.isArray(base.paymentHistory) ? base.paymentHistory : [])
      .map((entry) => ({
        id: String(entry.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
        dueDateISO: String(entry.dueDateISO || "").trim(),
        paymentDateISO: String(entry.paymentDateISO || "").trim(),
        expectedAmount: Number(entry.expectedAmount || 0),
        paidAmount: Number(entry.paidAmount ?? entry.expectedAmount ?? 0),
        discountAmount: Number(entry.discountAmount || 0),
        discountReason: String(entry.discountReason || "").trim(),
        createdAt: String(entry.createdAt || new Date().toISOString()),
      }))
      .filter((entry) => entry.dueDateISO && entry.paymentDateISO),
    createdAt: String(base.createdAt || new Date().toISOString()),
    updatedAt: String(base.updatedAt || new Date().toISOString()),
  };
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

function formatCNPJ(value) {
  const digits = onlyDigits(value).slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2");
}

function formatPhoneBR(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }

  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function formatCEP(value) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits.replace(/^(\d{5})(\d)/, "$1-$2");
}

function formatCPF(value) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function formatRG(value) {
  const raw = String(value || "").toUpperCase().replace(/[^0-9X]/g, "");
  const xCount = (raw.match(/X/g) || []).length;
  const digitsOnly = raw.replace(/X/g, "").slice(0, 9);
  const normalized = xCount > 0
    ? `${digitsOnly.slice(0, 8)}X`
    : digitsOnly;
  const p1 = normalized.slice(0, 2);
  const p2 = normalized.slice(2, 5);
  const p3 = normalized.slice(5, 8);
  const p4 = normalized.slice(8, 9);
  let output = p1;
  if (p2) output += `.${p2}`;
  if (p3) output += `.${p3}`;
  if (p4) output += `-${p4}`;
  return output;
}

function fieldNameTokens(name) {
  const normalized = String(name || "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toLowerCase();
  return normalized.split(/[^a-z0-9]+/).filter(Boolean);
}

function applyBrazilianInputPattern(input, phase = "input") {
  if (!input) return;
  const fieldName = String(input.name || "").trim();
  if (!fieldName) return;
  const tokens = fieldNameTokens(fieldName);
  const lowerName = fieldName.toLowerCase();

  if (tokens.includes("cnpj")) {
    input.value = formatCNPJ(input.value);
    return;
  }
  if (tokens.includes("cpf")) {
    input.value = formatCPF(input.value);
    return;
  }
  if (tokens.includes("rg")) {
    input.value = formatRG(input.value);
    return;
  }
  if (tokens.includes("cep") || lowerName.includes("zipcode")) {
    input.value = formatCEP(input.value);
    return;
  }
  if (tokens.includes("phone") || tokens.includes("telefone") || tokens.includes("celular")) {
    input.value = formatPhoneBR(input.value);
    return;
  }
  if (tokens.includes("state") || tokens.includes("uf")) {
    input.value = String(input.value || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 2);
    return;
  }
  if (tokens.includes("email") && phase === "blur") {
    input.value = String(input.value || "").trim().toLowerCase();
  }
}

function formatDateBR(value) {
  if (!value) return "-";
  const parts = value.split("-");
  if (parts.length !== 3) return value;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function normalizeDayOfMonth(value, fallback = 1) {
  const day = Number(value || 0);
  if (!Number.isFinite(day)) return String(fallback);
  return String(Math.max(1, Math.min(31, Math.trunc(day))));
}

function parseBRLNumber(value) {
  let str = String(value ?? "").trim();
  if (!str) return 0;
  str = str.replace(/[^\d,.-]/g, "");
  if (!str) return 0;

  if (str.includes(",") && str.includes(".")) {
    if (str.lastIndexOf(",") > str.lastIndexOf(".")) {
      str = str.replace(/\./g, "").replace(",", ".");
    } else {
      str = str.replace(/,/g, "");
    }
  } else if (str.includes(",")) {
    str = str.replace(/\./g, "").replace(",", ".");
  }

  const parsed = Number(str);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatBRLInputValue(value) {
  return currencyBRL.format(parseBRLNumber(value));
}

function promptPaymentSettlement({ title, expectedAmount }) {
  const expected = Number(expectedAmount || 0);
  const defaultPaidValue = formatBRLInputValue(expected);

  while (true) {
    const typedPaid = prompt(`${title}\nInforme o valor pago/recebido (R$):`, defaultPaidValue);
    if (typedPaid === null) return null;
    const paidAmount = parseBRLNumber(typedPaid);
    if (!Number.isFinite(paidAmount) || paidAmount < 0) {
      alert("Valor inválido. Informe um valor em R$ válido.");
      continue;
    }

    const discountAmount = Math.max(0, expected - paidAmount);
    let discountReason = "";
    if (discountAmount > 0) {
      const typedReason = prompt(
        `Foi identificado desconto de ${currencyBRL.format(discountAmount)}.\nInforme a justificativa do desconto:`,
        "",
      );
      if (typedReason === null) return null;
      discountReason = String(typedReason || "").trim();
      if (!discountReason) {
        alert("A justificativa do desconto é obrigatória.");
        continue;
      }
    }

    return {
      expectedAmount: expected,
      paidAmount,
      discountAmount,
      discountReason,
    };
  }
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Falha ao ler arquivo de imagem."));
    reader.readAsDataURL(file);
  });
}

async function addProposalPhotosFromFiles(files) {
  const imageFiles = Array.from(files || []).filter((file) => file.type.startsWith("image/"));
  if (!imageFiles.length) return 0;

  const nextPhotos = [];
  for (const file of imageFiles) {
    const dataUrl = await fileToDataUrl(file);
    nextPhotos.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: file.name || "foto",
      dataUrl,
    });
  }

  state.proposalPhotos.push(...nextPhotos);
  saveState();
  renderAll();
  return nextPhotos.length;
}

function formatFileSize(bytes) {
  const size = Number(bytes || 0);
  if (size <= 0) return "0 B";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function downloadBlob(filename, blob) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(filename, blob);
}

async function addEmployeeDocumentsFromFiles(files) {
  const list = Array.from(files || []);
  if (!list.length) return 0;

  const docs = [];
  for (const file of list) {
    const dataUrl = await fileToDataUrl(file);
    docs.push({
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: String(file.name || "arquivo").trim() || "arquivo",
      type: String(file.type || "").trim(),
      size: Number(file.size || 0),
      dataUrl,
    });
  }

  uiState.pendingEmployeeDocuments.push(...docs);
  renderPendingEmployeeDocuments();
  return docs.length;
}

function canonicalFurnitureItemName(item) {
  const raw = String(item || "").trim();
  const lower = raw.toLowerCase();
  if (lower === "armário multiuso" || lower === "armario multiuso") {
    return "Multiuso";
  }
  return raw;
}

function applyBRLMask(input) {
  if (!input) return;
  const digits = onlyDigits(input.value);
  const amount = Number(digits || 0) / 100;
  input.value = currencyBRL.format(amount);
}

function setupBRLInputs(container) {
  if (!container) return;
  container.querySelectorAll("input[data-brl]").forEach((input) => {
    if (!String(input.value || "").trim()) input.value = "R$ 0,00";
    else input.value = formatBRLInputValue(input.value);

    if (input.dataset.brlBound === "1") return;
    input.dataset.brlBound = "1";
    input.addEventListener("input", () => applyBRLMask(input));
    input.addEventListener("blur", () => {
      input.value = formatBRLInputValue(input.value);
    });
  });
}

function normalizeContract(contract) {
  const base = { ...createEmptyContract(), ...(contract || {}) };
  const legacyAddress = String(base.accommodationAddress || "").trim();
  const measurementStartDay = normalizeDayOfMonth(base.measurementStartDay, 24);
  const measurementEndDay = normalizeDayOfMonth(base.measurementEndDay, 24);
  const receiptDay = normalizeDayOfMonth(base.receiptDay, 15);
  const fallbackReceiptISO = calculateContractTimeline({
    ...base,
    measurementStartDay,
    measurementEndDay,
    receiptDay,
  }).receiptDateISO;
  const nextReceiptDateISO = String(base.nextReceiptDateISO || "").trim() || fallbackReceiptISO;
  const receiptHistory = (Array.isArray(base.receiptHistory) ? base.receiptHistory : [])
    .map((entry) => ({
      id: String(entry.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      dueDateISO: String(entry.dueDateISO || "").trim(),
      paymentDateISO: String(entry.paymentDateISO || "").trim(),
      expectedAmount: Number(entry.expectedAmount || 0),
      paidAmount: Number(entry.paidAmount ?? entry.expectedAmount ?? 0),
      discountAmount: Number(entry.discountAmount || 0),
      discountReason: String(entry.discountReason || "").trim(),
      createdAt: String(entry.createdAt || new Date().toISOString()),
    }))
    .filter((entry) => entry.dueDateISO && entry.paymentDateISO);
  return {
    ...base,
    id: String(base.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    contractName: String(base.contractName || "").trim(),
    accommodationAddress: legacyAddress,
    accommodationStreet: String(base.accommodationStreet || legacyAddress).trim(),
    accommodationNumber: String(base.accommodationNumber || "").trim(),
    accommodationComplement: String(base.accommodationComplement || "").trim(),
    accommodationDistrict: String(base.accommodationDistrict || "").trim(),
    accommodationCity: String(base.accommodationCity || "").trim(),
    accommodationState: String(base.accommodationState || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 2),
    accommodationZipCode: formatCEP(base.accommodationZipCode || ""),
    clientId: String(base.clientId || "").trim(),
    rentedPropertyId: String(base.rentedPropertyId || "").trim(),
    capacity: String(Number(base.capacity || 0)),
    dailyRatePerPerson: String(parseBRLNumber(base.dailyRatePerPerson || 0)),
    monthlyTaxPercent: String(Number(base.monthlyTaxPercent || 0)),
    measurementStartDay,
    measurementEndDay,
    receiptDay,
    nextReceiptDateISO,
    receiptHistory,
    rentCost: String(parseBRLNumber(base.rentCost || 0)),
    staffCost: String(parseBRLNumber(base.staffCost || 0)),
    furnitureCost: String(parseBRLNumber(base.furnitureCost || 0)),
    cleaningProductsCost: String(parseBRLNumber(base.cleaningProductsCost || 0)),
    waterCost: String(parseBRLNumber(base.waterCost || 0)),
    electricityCost: String(parseBRLNumber(base.electricityCost || 0)),
    internetCost: String(parseBRLNumber(base.internetCost || 0)),
    maintenanceCost: String(parseBRLNumber(base.maintenanceCost || 0)),
    proLaboreCost: String(parseBRLNumber(base.proLaboreCost || 0)),
    proLaboreRecipient: String(base.proLaboreRecipient || "").trim(),
    isEffective: Boolean(base.isEffective),
    createdAt: String(base.createdAt || new Date().toISOString()),
    updatedAt: String(base.updatedAt || new Date().toISOString()),
  };
}

function hasContractContent(contract) {
  if (!contract) return false;
  if (String(contract.contractName || "").trim()) return true;
  if (String(contract.accommodationAddress || "").trim()) return true;
  if (String(contract.accommodationStreet || "").trim()) return true;
  if (String(contract.accommodationNumber || "").trim()) return true;
  if (String(contract.accommodationComplement || "").trim()) return true;
  if (String(contract.accommodationDistrict || "").trim()) return true;
  if (String(contract.accommodationCity || "").trim()) return true;
  if (String(contract.accommodationState || "").trim()) return true;
  if (String(contract.accommodationZipCode || "").trim()) return true;
  if (String(contract.clientId || "").trim()) return true;
  if (String(contract.rentedPropertyId || "").trim()) return true;
  if (String(contract.proLaboreRecipient || "").trim()) return true;
  if (Number(contract.capacity || 0) > 0) return true;
  if (Number(parseBRLNumber(contract.dailyRatePerPerson || 0)) > 0) return true;
  return CONTRACT_MONEY_FIELDS
    .filter((field) => field !== "dailyRatePerPerson")
    .some((field) => Number(parseBRLNumber(contract[field] || 0)) > 0);
}

function ensureContractsPortfolio() {
  if (!Array.isArray(state.contractsPortfolio)) state.contractsPortfolio = [];
  state.contractsPortfolio = state.contractsPortfolio
    .map((item) => normalizeContract(item))
    .filter((item) => hasContractContent(item));

  if (!state.contractsPortfolio.length) {
    state.activeContractId = "";
    state.contracts = normalizeContract(state.contracts || createEmptyContract());
    return;
  }

  const active = state.contractsPortfolio.find((item) => item.id === state.activeContractId);
  if (active) {
    state.contracts = { ...active };
    return;
  }

  if (!state.activeContractId) {
    state.contracts = normalizeContract(state.contracts || createEmptyContract());
    return;
  }

  state.activeContractId = state.contractsPortfolio[0].id;
  state.contracts = { ...state.contractsPortfolio[0] };
}

function getActiveContractRecord() {
  ensureContractsPortfolio();
  if (!state.activeContractId) return null;
  return state.contractsPortfolio.find((item) => item.id === state.activeContractId) || null;
}

function setActiveContractById(contractId) {
  ensureContractsPortfolio();
  const target = state.contractsPortfolio.find((item) => item.id === contractId);
  if (!target) return;
  state.activeContractId = target.id;
  state.contracts = { ...target };
}

function persistActiveContract(data) {
  ensureContractsPortfolio();
  const active = getActiveContractRecord();
  const normalized = normalizeContract({
    ...(active || createEmptyContract()),
    ...(data || {}),
    id: state.activeContractId || active?.id,
    updatedAt: new Date().toISOString(),
  });
  const idx = state.contractsPortfolio.findIndex((item) => item.id === normalized.id);
  if (idx >= 0) state.contractsPortfolio[idx] = normalized;
  else state.contractsPortfolio.push(normalized);
  state.activeContractId = normalized.id;
  state.contracts = { ...normalized };
}

function applyStateSnapshot(data) {
  if (!data || typeof data !== "object") return false;
  state.company = data.company || {};
  state.clients = Array.isArray(data.clients) ? data.clients : [];
  state.property = data.property || {};
  state.furniture = data.furniture || [];
  state.proposalPhotos = data.proposalPhotos || [];
  state.pricing = data.pricing || {};
  state.proposal = data.proposal || {};
  state.payslip = {
    ...state.payslip,
    ...(data.payslip || {}),
    earnings: (data.payslip && data.payslip.earnings) || [],
    discounts: (data.payslip && data.payslip.discounts) || [],
  };
  state.payslipEmployees = Array.isArray(data.payslipEmployees) ? data.payslipEmployees : [];
  state.balance = {
    ...state.balance,
    ...(data.balance || {}),
    entries: (data.balance && data.balance.entries) || [],
  };
  state.taxes = {
    ...state.taxes,
    ...(data.taxes || {}),
    records: (data.taxes && data.taxes.records) || [],
  };
  state.contracts = {
    ...state.contracts,
    ...(data.contracts || {}),
  };
  state.contractsPortfolio = Array.isArray(data.contractsPortfolio) ? data.contractsPortfolio : [];
  state.activeContractId = String(data.activeContractId || "").trim();
  state.rentedProperties = Array.isArray(data.rentedProperties) ? data.rentedProperties : [];
  state.exports = Array.isArray(data.exports) ? data.exports : [];
  state.deletedExportIds = Array.isArray(data.deletedExportIds) ? data.deletedExportIds : [];
  normalizeStatePatterns();
  return true;
}

function getStateSnapshot() {
  return {
    company: cloneSnapshot(state.company || {}),
    clients: cloneSnapshot(state.clients || []),
    property: cloneSnapshot(state.property || {}),
    furniture: cloneSnapshot(state.furniture || []),
    proposalPhotos: cloneSnapshot(state.proposalPhotos || []),
    pricing: cloneSnapshot(state.pricing || {}),
    proposal: cloneSnapshot(state.proposal || {}),
    payslip: cloneSnapshot(state.payslip || {}),
    payslipEmployees: cloneSnapshot(state.payslipEmployees || []),
    balance: cloneSnapshot(state.balance || {}),
    taxes: cloneSnapshot(state.taxes || {}),
    contracts: cloneSnapshot(state.contracts || {}),
    contractsPortfolio: cloneSnapshot(state.contractsPortfolio || []),
    activeContractId: String(state.activeContractId || "").trim(),
    rentedProperties: cloneSnapshot(state.rentedProperties || []),
    exports: cloneSnapshot(state.exports || []),
    deletedExportIds: cloneSnapshot(state.deletedExportIds || []),
    savedAt: new Date().toISOString(),
  };
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const data = JSON.parse(raw);
    applyStateSnapshot(data);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function normalizeStatePatterns() {
  state.company.cnpj = formatCNPJ(state.company.cnpj);
  state.company.phone = formatPhoneBR(state.company.phone);
  state.company.email = String(state.company.email || "").trim().toLowerCase();
  state.property.zipCode = formatCEP(state.property.zipCode);
  state.property.dailyRatePerPerson = String(parseBRLNumber(state.property.dailyRatePerPerson || 0));
  state.property.state = String(state.property.state || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .slice(0, 2);

  const day = Number(state.proposal.paymentDay || 0);
  state.proposal.paymentDay = day >= 1 && day <= 31 ? String(day) : "";

  state.payslip.employeeCpf = formatCPF(state.payslip.employeeCpf);
  state.payslip.paymentMethod = String(state.payslip.paymentMethod || "").trim();
  state.payslip.selectedEmployeeId = String(state.payslip.selectedEmployeeId || "").trim();
  const payslipReference = inferReferenceYearMonth(state.payslip.referenceMonth, state.payslip.paymentDate);
  const payslipYear = payslipReference.year;
  const payslipMonth = payslipReference.month;
  state.payslip.referenceMonth = formatYearMonthISO(payslipYear, payslipMonth);
  state.payslip.competence = `${String(payslipMonth).padStart(2, "0")}/${payslipYear}`;
  const payslipMonthTotalDays = getDaysInMonth(payslipYear, payslipMonth);
  state.payslip.monthTotalDays = String(payslipMonthTotalDays);
  const defaultPayslipFirstDateISO = toISODateOnly(dateWithClampedDay(payslipYear, payslipMonth - 1, 1));
  const defaultPayslipLastDateISO = toISODateOnly(dateWithClampedDay(payslipYear, payslipMonth - 1, payslipMonthTotalDays));
  const parsedPayslipFirstDate = parseISODateOnly(state.payslip.firstWorkDayInMonth);
  const parsedPayslipLastDate = parseISODateOnly(state.payslip.lastWorkDayInMonth);
  const isPayslipFirstDateValid = parsedPayslipFirstDate
    && parsedPayslipFirstDate.getFullYear() === payslipYear
    && parsedPayslipFirstDate.getMonth() + 1 === payslipMonth;
  const isPayslipLastDateValid = parsedPayslipLastDate
    && parsedPayslipLastDate.getFullYear() === payslipYear
    && parsedPayslipLastDate.getMonth() + 1 === payslipMonth;
  state.payslip.firstWorkDayInMonth = isPayslipFirstDateValid ? toISODateOnly(parsedPayslipFirstDate) : defaultPayslipFirstDateISO;
  state.payslip.lastWorkDayInMonth = isPayslipLastDateValid ? toISODateOnly(parsedPayslipLastDate) : defaultPayslipLastDateISO;
  const normalizedPayslipFirstDay = parseISODateOnly(state.payslip.firstWorkDayInMonth)?.getDate() || 1;
  const normalizedPayslipLastDay = parseISODateOnly(state.payslip.lastWorkDayInMonth)?.getDate() || payslipMonthTotalDays;
  const calculatedPayslipBusinessDays = countWeekdaysBetweenDays(
    payslipYear,
    payslipMonth,
    normalizedPayslipFirstDay,
    normalizedPayslipLastDay,
  );
  state.payslip.businessDaysInMonth = String(calculatedPayslipBusinessDays);
  state.payslip.absenceDays = String(Number(state.payslip.absenceDays || 0));
  state.payslip.allowanceDays = String(Number(state.payslip.allowanceDays || 0));
  state.payslip.baseSalary = String(parseBRLNumber(state.payslip.baseSalary || 0));
  state.payslip.mealAllowanceFixed = String(parseBRLNumber(state.payslip.mealAllowanceFixed || 0));
  state.payslip.mealAllowanceDaily = String(parseBRLNumber(state.payslip.mealAllowanceDaily || 0));
  state.payslip.fixedDiscountPercent = String(Number(state.payslip.fixedDiscountPercent || 0));
  state.payslip.earnings = (state.payslip.earnings || []).map((item) => ({
    description: String(item.description || "").trim(),
    value: Number(item.value || 0),
  })).filter((item) => item.description);
  state.payslip.discounts = (state.payslip.discounts || []).map((item) => ({
    description: String(item.description || "").trim(),
    value: Number(item.value || 0),
  })).filter((item) => item.description);

  state.payslipEmployees = (state.payslipEmployees || [])
    .map((employee) => ({
      id: String(employee.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      employeeName: String(employee.employeeName || "").trim(),
      employeeCpf: formatCPF(employee.employeeCpf),
      position: String(employee.position || "").trim(),
      registration: String(employee.registration || "").trim(),
      baseSalary: String(parseBRLNumber(employee.baseSalary || 0)),
      mealAllowanceFixed: String(parseBRLNumber(employee.mealAllowanceFixed || 0)),
      mealAllowanceDaily: String(parseBRLNumber(employee.mealAllowanceDaily || 0)),
      fixedDiscountPercent: String(Number(employee.fixedDiscountPercent || 0)),
      salaryHistory: Array.isArray(employee.salaryHistory)
        ? employee.salaryHistory
          .map((item) => ({
            id: String(item.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
            paymentDateISO: String(item.paymentDateISO || "").trim(),
            referenceYear: Number(item.referenceYear || 0),
            referenceMonth: Number(item.referenceMonth || 0),
            monthTotalDays: Number(item.monthTotalDays || 0),
            workedCalendarDays: Number(item.workedCalendarDays || 0),
            businessDaysInMonth: Number(item.businessDaysInMonth || 0),
            absenceDays: Number(item.absenceDays || 0),
            allowanceDays: Number(item.allowanceDays || 0),
            absenceJustification: String(item.absenceJustification || "").trim(),
            allowanceJustification: String(item.allowanceJustification || "").trim(),
            salaryAfterAbsence: Number(item.salaryAfterAbsence || 0),
            mealAllowanceTotal: Number(item.mealAllowanceTotal || 0),
            mealAllowanceCardDiscountValue: Number(item.mealAllowanceCardDiscountValue || 0),
            netCashValue: Number(item.netCashValue || 0),
            totalReceivedValue: Number(item.totalReceivedValue || 0),
            createdAt: String(item.createdAt || "").trim(),
          }))
          .filter((item) => item.paymentDateISO && item.referenceYear && item.referenceMonth)
        : [],
      documents: (employee.documents || [])
        .map((doc) => ({
          id: String(doc.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
          name: String(doc.name || "arquivo").trim() || "arquivo",
          type: String(doc.type || "").trim(),
          size: Number(doc.size || 0),
          dataUrl: String(doc.dataUrl || "").trim(),
        }))
        .filter((doc) => doc.dataUrl),
    }))
    .filter((employee) => employee.employeeName);

  state.clients = (state.clients || [])
    .map((client) => ({
      id: String(client.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      clientName: String(client.clientName || "").trim(),
      clientCnpj: formatCNPJ(client.clientCnpj || ""),
      clientContact: String(client.clientContact || "").trim(),
      clientPhone: formatPhoneBR(client.clientPhone || ""),
      clientEmail: String(client.clientEmail || "").trim().toLowerCase(),
      clientStreet: String(client.clientStreet || "").trim(),
      clientNumber: String(client.clientNumber || "").trim(),
      clientComplement: String(client.clientComplement || "").trim(),
      clientDistrict: String(client.clientDistrict || "").trim(),
      clientCity: String(client.clientCity || "").trim(),
      clientState: String(client.clientState || "")
        .toUpperCase()
        .replace(/[^A-Z]/g, "")
        .slice(0, 2),
      clientZipCode: formatCEP(client.clientZipCode || ""),
      clientNotes: String(client.clientNotes || "").trim(),
    }))
    .filter((client) => client.clientName);
  const clientIds = new Set(state.clients.map((client) => client.id));
  state.company.clientId = clientIds.has(String(state.company.clientId || "")) ? String(state.company.clientId || "") : "";

  state.balance.entries = (state.balance.entries || []).map((entry) => ({
    id: String(entry.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    type: entry.type === "expense" ? "expense" : "income",
    description: String(entry.description || "").trim(),
    amount: Number(entry.amount || 0),
    dateTime: String(entry.dateTime || "").trim(),
    responsible: String(entry.responsible || "").trim(),
    contractId: String(entry.contractId || "").trim(),
    category: String(entry.category || "").trim().toLowerCase(),
    employeeId: String(entry.employeeId || "").trim(),
    linkedTaxRecordId: String(entry.linkedTaxRecordId || "").trim(),
    linkedContractPaymentId: String(entry.linkedContractPaymentId || "").trim(),
    linkedRentedPropertyPaymentId: String(entry.linkedRentedPropertyPaymentId || "").trim(),
  })).filter((entry) => entry.description && entry.amount >= 0 && entry.dateTime);

  state.taxes.records = (state.taxes.records || [])
    .map((record) => ({
      id: String(record.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      referenceMonth: formatYearMonthISO(
        parseYearMonthISO(record.referenceMonth)?.year || new Date().getFullYear(),
        parseYearMonthISO(record.referenceMonth)?.month || (new Date().getMonth() + 1),
      ),
      grossRevenue: Number(record.grossRevenue || 0),
      taxPaid: Number(record.taxPaid || 0),
      paymentDateISO: String(record.paymentDateISO || "").trim(),
      notes: String(record.notes || "").trim(),
      updatedAt: String(record.updatedAt || "").trim(),
    }))
    .filter((record) => record.referenceMonth)
    .sort((a, b) => String(b.referenceMonth).localeCompare(String(a.referenceMonth)));
  const taxIds = new Set((state.taxes.records || []).map((record) => String(record.id)));
  state.balance.entries = (state.balance.entries || []).filter((entry) => {
    const linkedId = String(entry.linkedTaxRecordId || "");
    if (!linkedId) return true;
    return taxIds.has(linkedId);
  });
  (state.taxes.records || []).forEach((record) => {
    upsertTaxBalanceEntry(record);
  });

  state.furniture = (state.furniture || []).map((item) => ({
    item: canonicalFurnitureItemName(item.item),
    environment: String(item.environment || "Não informado").trim(),
    quantity: Number(item.quantity || 0),
    notes: String(item.notes || "").trim(),
  })).filter((item) => item.item && item.quantity > 0);
  state.proposalPhotos = (state.proposalPhotos || [])
    .map((photo) => ({
      id: String(photo.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`),
      name: String(photo.name || "foto").trim() || "foto",
      dataUrl: String(photo.dataUrl || "").trim(),
    }))
    .filter((photo) => photo.dataUrl.startsWith("data:image/"));

  const legacyContract = normalizeContract(state.contracts);
  state.contractsPortfolio = (state.contractsPortfolio || [])
    .map((item) => normalizeContract(item))
    .map((item) => ({
      ...item,
      clientId: clientIds.has(String(item.clientId || "")) ? String(item.clientId || "") : "",
    }))
    .filter((item) => hasContractContent(item));
  const contractIds = new Set(state.contractsPortfolio.map((contract) => contract.id));
  state.rentedProperties = (state.rentedProperties || [])
    .map((item) => normalizeRentedProperty(item))
    .map((item) => ({
      ...item,
      contractId: contractIds.has(String(item.contractId || "")) ? String(item.contractId || "") : "",
    }))
    .filter((item) => (
      item.name
      || Number(item.rentAmount || 0) > 0
      || item.contractId
      || item.nextDueDateISO
      || item.contractStartDateISO
      || item.contractEndDateISO
    ));
  const rentedPropertyIds = new Set(state.rentedProperties.map((item) => item.id));
  state.contractsPortfolio = state.contractsPortfolio.map((contract) => ({
    ...contract,
    rentedPropertyId: rentedPropertyIds.has(String(contract.rentedPropertyId || ""))
      ? String(contract.rentedPropertyId || "")
      : "",
  }));

  if (!state.contractsPortfolio.length) {
    state.activeContractId = "";
    state.contracts = {
      ...legacyContract,
      rentedPropertyId: rentedPropertyIds.has(String(legacyContract.rentedPropertyId || ""))
        ? String(legacyContract.rentedPropertyId || "")
        : "",
    };
  } else {
    const selected = state.contractsPortfolio.find((item) => item.id === state.activeContractId);
    if (selected) {
      state.contracts = { ...selected };
    } else {
      state.activeContractId = state.contractsPortfolio[0].id;
      state.contracts = { ...state.contractsPortfolio[0] };
    }
    if (!clientIds.has(String(state.contracts.clientId || ""))) {
      state.contracts.clientId = "";
    }
    if (!rentedPropertyIds.has(String(state.contracts.rentedPropertyId || ""))) {
      state.contracts.rentedPropertyId = "";
    }
  }

  state.exports = mergeExportRecords(state.exports || [], []);
  state.deletedExportIds = Array.isArray(state.deletedExportIds)
    ? state.deletedExportIds
      .map((id) => String(id || "").trim())
      .filter(Boolean)
    : [];
  const deletedSet = new Set(state.deletedExportIds);
  if (deletedSet.size > 0) {
    state.exports = state.exports.filter((entry) => !deletedSet.has(String(entry.id || "")));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getStateSnapshot()));
  scheduleCloudStateSave();
}

function getSnapshotSavedAt(value) {
  const raw = String(value?.savedAt || "").trim();
  const date = raw ? new Date(raw) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function hasStateContent(snapshot) {
  if (!snapshot || typeof snapshot !== "object") return false;
  const hasArrayContent = (key) => Array.isArray(snapshot[key]) && snapshot[key].length > 0;
  const hasObjectContent = (key) => (
    snapshot[key]
    && typeof snapshot[key] === "object"
    && Object.values(snapshot[key]).some((value) => {
      if (value === null || value === undefined) return false;
      if (Array.isArray(value)) return value.length > 0;
      if (typeof value === "object") return Object.keys(value).length > 0;
      if (typeof value === "string") return value.trim().length > 0;
      if (typeof value === "number") return value !== 0;
      return Boolean(value);
    })
  );
  return (
    hasArrayContent("clients")
    || hasArrayContent("payslipEmployees")
    || hasArrayContent("contractsPortfolio")
    || hasArrayContent("rentedProperties")
    || hasArrayContent("exports")
    || hasObjectContent("company")
    || hasObjectContent("property")
    || hasObjectContent("pricing")
    || hasObjectContent("proposal")
    || hasObjectContent("contracts")
    || (snapshot.balance && Array.isArray(snapshot.balance.entries) && snapshot.balance.entries.length > 0)
    || (snapshot.taxes && Array.isArray(snapshot.taxes.records) && snapshot.taxes.records.length > 0)
  );
}

function getCloudSnapshotSavedAt(snapshot, updatedAtRaw) {
  const fromSnapshot = getSnapshotSavedAt(snapshot);
  if (fromSnapshot) return fromSnapshot;
  if (!hasStateContent(snapshot)) return null;
  const fromRowUpdatedAt = String(updatedAtRaw || "").trim();
  const parsed = fromRowUpdatedAt ? new Date(fromRowUpdatedAt) : null;
  return parsed && !Number.isNaN(parsed.getTime()) ? parsed : null;
}

async function saveCloudStateNow() {
  if (cloudSyncState.suppressSave) return;
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return;
  if (!cloudSyncState.hasLoadedFromCloud) return;
  if (cloudSyncState.saveInFlight) {
    cloudSyncState.pendingSave = true;
    return;
  }
  cloudSyncState.saveInFlight = true;
  try {
    const payload = getStateSnapshot();
    const { error } = await authState.client
      .from("app_shared_state")
      .upsert(
        {
          singleton_id: CLOUD_SHARED_STATE_ID,
          state_data: payload,
          updated_by: authState.user.id,
          updated_by_email: String(authState.user.email || "").trim().toLowerCase() || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "singleton_id" },
      );
    if (error) {
      console.warn("[cloud-state] Falha ao salvar:", error.message);
    } else {
      cloudSyncState.sharedStateLastUpdatedAt = Date.now();
    }
  } catch (error) {
    console.warn("[cloud-state] Erro ao salvar:", error);
  } finally {
    cloudSyncState.saveInFlight = false;
    if (cloudSyncState.pendingSave) {
      cloudSyncState.pendingSave = false;
      scheduleCloudStateSave();
    }
  }
}

function scheduleCloudStateSave() {
  if (cloudSyncState.suppressSave) return;
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return;
  if (!cloudSyncState.hasLoadedFromCloud) return;
  if (cloudSyncState.saveTimer) clearTimeout(cloudSyncState.saveTimer);
  cloudSyncState.saveTimer = setTimeout(() => {
    cloudSyncState.saveTimer = null;
    void saveCloudStateNow();
  }, CLOUD_STATE_SYNC_DEBOUNCE_MS);
}

async function fetchSharedStateFromCloud() {
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return null;
  const { data, error } = await authState.client
    .from("app_shared_state")
    .select("state_data, updated_at")
    .eq("singleton_id", CLOUD_SHARED_STATE_ID)
    .maybeSingle();
  if (error) {
    console.warn("[cloud-state] Falha ao carregar estado compartilhado:", error.message);
    return null;
  }
  return data || null;
}

async function fetchLegacyUserStateFromCloud() {
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return null;
  try {
    const { data, error } = await authState.client
      .from("app_user_state")
      .select("state_data, updated_at")
      .eq("user_id", authState.user.id)
      .maybeSingle();
    if (error) return null;
    return data || null;
  } catch {
    return null;
  }
}

async function refreshStateFromCloudIfNewer(force = false) {
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return;
  const data = await fetchSharedStateFromCloud();
  if (!data) return;
  const cloudSnapshot = data?.state_data && typeof data.state_data === "object" ? data.state_data : null;
  if (!cloudSnapshot) return;
  const cloudSavedAt = getCloudSnapshotSavedAt(cloudSnapshot, data?.updated_at);
  const localRaw = localStorage.getItem(STORAGE_KEY);
  let localSnapshot = null;
  try {
    localSnapshot = localRaw ? JSON.parse(localRaw) : null;
  } catch {
    localSnapshot = null;
  }
  const localSavedAt = getSnapshotSavedAt(localSnapshot);
  const cloudHasContent = hasStateContent(cloudSnapshot);
  const localHasContent = hasStateContent(localSnapshot);
  if (!cloudHasContent && localHasContent && !force) return;
  const cloudTs = cloudSavedAt ? cloudSavedAt.getTime() : 0;
  const localTs = localSavedAt ? localSavedAt.getTime() : 0;
  if (!force && cloudTs <= localTs) return;
  cloudSyncState.suppressSave = true;
  applyStateSnapshot(cloudSnapshot);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudSnapshot));
  cloudSyncState.suppressSave = false;
  cloudSyncState.sharedStateLastUpdatedAt = cloudTs || Date.now();
  renderAll();
}

function startSharedStateRefreshTimer() {
  if (cloudSyncState.sharedStateRefreshTimer) clearInterval(cloudSyncState.sharedStateRefreshTimer);
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return;
  cloudSyncState.sharedStateRefreshTimer = setInterval(() => {
    void refreshStateFromCloudIfNewer(false);
  }, CLOUD_SHARED_STATE_REFRESH_MS);
}

function stopSharedStateRefreshTimer() {
  if (!cloudSyncState.sharedStateRefreshTimer) return;
  clearInterval(cloudSyncState.sharedStateRefreshTimer);
  cloudSyncState.sharedStateRefreshTimer = null;
}

async function syncStateFromCloudOnLogin() {
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return;
  if (cloudSyncState.hasLoadedFromCloud) return;

  try {
    let data = await fetchSharedStateFromCloud();
    const cloudSnapshotInitial = data?.state_data && typeof data.state_data === "object" ? data.state_data : null;
    if (!hasStateContent(cloudSnapshotInitial)) {
      const legacyData = await fetchLegacyUserStateFromCloud();
      const legacySnapshot = legacyData?.state_data && typeof legacyData.state_data === "object"
        ? legacyData.state_data
        : null;
      if (hasStateContent(legacySnapshot)) {
        data = {
          state_data: legacySnapshot,
          updated_at: legacyData?.updated_at || new Date().toISOString(),
        };
      }
    }

    const localRaw = localStorage.getItem(STORAGE_KEY);
    const localSnapshot = localRaw ? JSON.parse(localRaw) : null;
    const localSavedAt = getSnapshotSavedAt(localSnapshot);
    const cloudSnapshot = data?.state_data && typeof data.state_data === "object" ? data.state_data : null;
    const cloudSavedAt = getCloudSnapshotSavedAt(cloudSnapshot, data?.updated_at);
    const cloudHasContent = hasStateContent(cloudSnapshot);
    const localHasContent = hasStateContent(localSnapshot);

    cloudSyncState.suppressSave = true;
    if (
      cloudSnapshot
      && (cloudHasContent || !localHasContent)
      && (!localSavedAt || (cloudSavedAt && cloudSavedAt > localSavedAt))
    ) {
      applyStateSnapshot(cloudSnapshot);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudSnapshot));
    } else if (localSnapshot) {
      applyStateSnapshot(localSnapshot);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localSnapshot));
      if (!cloudSnapshot || (localSavedAt && (!cloudSavedAt || localSavedAt > cloudSavedAt))) {
        await saveCloudStateNow();
      }
    } else if (cloudSnapshot) {
      applyStateSnapshot(cloudSnapshot);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudSnapshot));
    }
    cloudSyncState.suppressSave = false;
    cloudSyncState.sharedStateLastUpdatedAt = cloudSavedAt ? cloudSavedAt.getTime() : Date.now();
    cloudSyncState.hasLoadedFromCloud = true;
    startSharedStateRefreshTimer();
  } catch (error) {
    cloudSyncState.suppressSave = false;
    console.warn("[cloud-state] Erro ao sincronizar:", error);
  }
}

function isLocalTestCredential(login, password) {
  const normalizedLogin = String(login || "").trim().toLowerCase();
  const acceptedLogins = new Set([
    String(LOCAL_TEST_USERNAME || "").trim().toLowerCase(),
    String(LOCAL_TEST_EMAIL || "").trim().toLowerCase(),
  ]);
  return acceptedLogins.has(normalizedLogin) && String(password || "") === LOCAL_TEST_PASSWORD;
}

function sanitizeAuditPayload(value, depth = 0) {
  if (depth > 4) return "[truncated]";
  if (value === null || value === undefined) return null;
  if (typeof value === "string") {
    if (value.startsWith("data:")) return "[binary-data]";
    return value.length > 400 ? `${value.slice(0, 400)}...` : value;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.slice(0, 50).map((item) => sanitizeAuditPayload(item, depth + 1));
  if (typeof value === "object") {
    const output = {};
    Object.entries(value).forEach(([key, current]) => {
      if (["dataUrl", "snapshot", "password", "anonKey"].includes(String(key))) return;
      output[key] = sanitizeAuditPayload(current, depth + 1);
    });
    return output;
  }
  return String(value);
}

async function logAuditAction({
  action,
  module,
  entityType,
  entityId = "",
  description = "",
  before = null,
  after = null,
  metadata = null,
}) {
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return;

  const payload = {
    user_id: authState.user.id,
    user_email: String(authState.user.email || "").trim().toLowerCase() || null,
    action: String(action || "update"),
    module: String(module || "app"),
    entity_type: String(entityType || "unknown"),
    entity_id: String(entityId || "").trim() || null,
    description: String(description || "").trim() || null,
    before_data: before ? sanitizeAuditPayload(before) : null,
    after_data: after ? sanitizeAuditPayload(after) : null,
    metadata: metadata ? sanitizeAuditPayload(metadata) : null,
    occurred_at: new Date().toISOString(),
  };

  const { error } = await authState.client.from("app_audit_logs").insert(payload);
  if (error) {
    console.warn("[audit] Falha ao registrar ação:", error.message);
  }
}

function getCloudSyncEndpoint() {
  return String(localStorage.getItem(CLOUD_SYNC_ENDPOINT_KEY) || "").trim();
}

function setCloudSyncEndpoint(value) {
  const endpoint = String(value || "").trim();
  if (endpoint) {
    localStorage.setItem(CLOUD_SYNC_ENDPOINT_KEY, endpoint);
  } else {
    localStorage.removeItem(CLOUD_SYNC_ENDPOINT_KEY);
  }
}

function getSupabaseConfig() {
  const storedUrl = String(localStorage.getItem(SUPABASE_URL_KEY) || "").trim();
  const storedAnon = String(localStorage.getItem(SUPABASE_ANON_KEY) || "").trim();
  const defaultUrl = String(DEFAULT_SUPABASE_URL || "").trim();
  const defaultAnon = String(DEFAULT_SUPABASE_ANON_KEY || "").trim();
  const url = /^https?:\/\//i.test(storedUrl) ? storedUrl : defaultUrl;
  const anonKey = storedAnon.length > 12 ? storedAnon : defaultAnon;
  return {
    url,
    anonKey,
  };
}

function setSupabaseConfig(url, anonKey) {
  const nextUrl = String(url || "").trim();
  const nextAnon = String(anonKey || "").trim();
  if (nextUrl) localStorage.setItem(SUPABASE_URL_KEY, nextUrl);
  else localStorage.removeItem(SUPABASE_URL_KEY);
  if (nextAnon) localStorage.setItem(SUPABASE_ANON_KEY, nextAnon);
  else localStorage.removeItem(SUPABASE_ANON_KEY);
}

function isAuthConfigLocked() {
  return localStorage.getItem(AUTH_CONFIG_LOCK_KEY) === "1";
}

function setAuthConfigLocked(locked) {
  if (locked) localStorage.setItem(AUTH_CONFIG_LOCK_KEY, "1");
  else localStorage.removeItem(AUTH_CONFIG_LOCK_KEY);
}

function canEditAuthConfig() {
  return !isAuthConfigLocked();
}

function getLocalTestSession() {
  return localStorage.getItem(LOCAL_TEST_SESSION_KEY) === "1";
}

function setLocalTestSession(active) {
  if (active) localStorage.setItem(LOCAL_TEST_SESSION_KEY, "1");
  else localStorage.removeItem(LOCAL_TEST_SESSION_KEY);
}

function setAuthMessage(message, isError = false) {
  const container = document.getElementById("authMessage");
  if (!container) return;
  container.textContent = message || "";
  container.style.color = isError ? "#b91c1c" : "#334155";
}

function getDefaultPermissions() {
  return { ...DEFAULT_APP_PERMISSIONS };
}

function getRolePermissions(roleCategory) {
  const normalizedRole = String(roleCategory || "").trim().toLowerCase();
  const roleKey = normalizedRole === "administrador" ? "administrador" : "funcionario";
  return { ...ROLE_PERMISSIONS[roleKey] };
}

function getUserRoleCategory() {
  const permissions = authState.permissions || getDefaultPermissions();
  if (permissions.isAdmin) return "administrador";
  return "funcionario";
}

function canViewFinancialValues() {
  return hasPermission("viewFinancialValues");
}

function normalizePermissionsRow(row) {
  if (!row) return getDefaultPermissions();
  const isAdmin =
    row.is_admin === true
    || String(row.is_admin || "").trim().toLowerCase() === "true"
    || String(row.role_category || "").trim().toLowerCase() === "administrador";
  if (isAdmin) return getRolePermissions("administrador");

  // Regra fechada para categoria Funcionário:
  // nunca permite acesso aos módulos sensíveis e nem visualização de valores.
  return {
    ...getRolePermissions("funcionario"),
    accessProposals: row.access_proposals ?? true,
    accessClients: row.access_clients ?? true,
    accessEmployees: row.access_employees ?? true,
    accessBalance: row.access_balance ?? true,
    exportProposal: row.export_proposal ?? true,
  };
}

function hasPermission(permissionKey) {
  const permissions = authState.permissions || getDefaultPermissions();
  if (permissions.isAdmin) return true;
  return Boolean(permissions[permissionKey]);
}

function getUserDisplayNameFromEmail() {
  const email = String(authState.user?.email || "").trim().toLowerCase();
  if (!email) return "Usuário";
  const friendlyNamesByEmail = {
    "fmarquesescritorio@gmail.com": "Fred",
    "lu.priscila@hotmail.com": "Luana",
  };
  if (friendlyNamesByEmail[email]) return friendlyNamesByEmail[email];
  const localPart = email.split("@")[0] || "Usuário";
  const tokens = localPart
    .replace(/[._-]+/g, " ")
    .split(" ")
    .map((item) => item.trim())
    .filter(Boolean);
  const firstName = tokens[0] || localPart;
  return firstName.charAt(0).toUpperCase() + firstName.slice(1);
}

function canAccessTab(tabName) {
  if (!authState.user) return true;
  const map = {
    home: null,
    proposals: "accessProposals",
    clients: "accessClients",
    employees: "accessEmployees",
    payslip: "accessPayslip",
    balance: "accessBalance",
    taxes: "accessBalance",
    contracts: "accessContracts",
    rentedProperties: "accessContracts",
    exports: "accessExports",
  };
  const key = map[tabName];
  return key ? hasPermission(key) : true;
}

async function loadCurrentUserPermissions() {
  const currentUserEmail = String(authState.user?.email || "").trim().toLowerCase();
  if (OWNER_ADMIN_EMAILS.has(currentUserEmail)) {
    authState.permissions = getRolePermissions("administrador");
    return;
  }

  if (authState.mode === "local") {
    authState.permissions = getRolePermissions("administrador");
    return;
  }

  if (!authState.client || !authState.user) {
    authState.permissions = getDefaultPermissions();
    return;
  }

  const { data, error } = await authState.client
    .from("app_user_permissions")
    .select("*")
    .eq("user_id", authState.user.id)
    .maybeSingle();

  if (error) {
    if (OWNER_ADMIN_EMAILS.has(currentUserEmail)) {
      authState.permissions = getRolePermissions("administrador");
      return;
    }
    authState.permissions = getDefaultPermissions();
    setAuthMessage("Usuário sem permissões configuradas. Acesso básico aplicado.", true);
    return;
  }

  authState.permissions = normalizePermissionsRow(data);
}

function applyPermissionsUi() {
  const tabVisibility = [
    ["tabHome", null],
    ["tabProposals", "accessProposals"],
    ["tabClients", "accessClients"],
    ["tabEmployees", "accessEmployees"],
    ["tabPayslip", "accessPayslip"],
    ["tabBalance", "accessBalance"],
    ["tabTaxes", "accessBalance"],
    ["tabContracts", "accessContracts"],
    ["tabRentedProperties", "accessContracts"],
    ["tabExports", "accessExports"],
  ];
  tabVisibility.forEach(([id, permission]) => {
    const element = document.getElementById(id);
    if (!element) return;
    element.style.display = permission ? (hasPermission(permission) ? "" : "none") : "";
  });

  const btnExportProposal = document.getElementById("btnExportPdf");
  const btnExportPayslip = document.getElementById("btnExportPayslipPdf");
  if (btnExportProposal) {
    const canShowProposalExport = hasPermission("exportProposal") && uiState.activeTab === "proposals";
    btnExportProposal.style.display = canShowProposalExport ? "" : "none";
  }
  if (btnExportPayslip) {
    const canShowPayslipExport = hasPermission("exportPayslip") && uiState.activeTab === "payslip";
    btnExportPayslip.style.display = canShowPayslipExport ? "" : "none";
  }

  const btnNewClient = document.getElementById("btnNewClient");
  const btnNewEmployee = document.getElementById("btnNewEmployee");
  const btnNewContract = document.getElementById("btnNewContract");
  const btnSaveContractDraft = document.getElementById("btnSaveContractDraft");
  const btnSaveContract = document.getElementById("btnSaveContract");
  if (btnNewClient) btnNewClient.style.display = hasPermission("editClients") ? "" : "none";
  if (btnNewEmployee) btnNewEmployee.style.display = hasPermission("editEmployees") ? "" : "none";
  if (btnNewContract) btnNewContract.style.display = hasPermission("editContracts") ? "" : "none";
  if (btnSaveContractDraft) btnSaveContractDraft.style.display = hasPermission("editContracts") ? "" : "none";
  if (btnSaveContract) btnSaveContract.style.display = hasPermission("editContracts") ? "" : "none";

  const roleBadge = document.getElementById("userRoleBadge");
  const welcome = document.getElementById("userWelcome");
  if (roleBadge) {
    const role = getUserRoleCategory();
    if (role === "administrador") {
      roleBadge.textContent = "Administrador";
      roleBadge.className = "role-badge role-badge-admin";
    } else {
      roleBadge.textContent = "Funcionário";
      roleBadge.className = "role-badge role-badge-employee";
    }
  }
  if (welcome) {
    const name = authState.user ? getUserDisplayNameFromEmail() : "Usuário";
    welcome.textContent = `Bem-vindo(a), ${name}.`;
  }

  document.body.classList.toggle("balance-values-blurred", !canViewFinancialValues());
}

function showAppShell(show) {
  const authGate = document.getElementById("authGate");
  const appShell = document.getElementById("appShell");
  if (!authGate || !appShell) return;
  authGate.style.display = show ? "none" : "";
  appShell.classList.toggle("app-shell-hidden", !show);
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById("authTabLogin");
  const tabSignup = document.getElementById("authTabSignup");
  const tabForgot = document.getElementById("authTabForgot");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");
  const forgotForm = document.getElementById("forgotForm");
  const resetForm = document.getElementById("resetForm");
  if (!loginForm || !signupForm || !forgotForm || !resetForm) return;

  if (tabSignup) tabSignup.style.display = ALLOW_PUBLIC_SIGNUP ? "" : "none";
  if (!ALLOW_PUBLIC_SIGNUP && tab === "signup") {
    tab = "login";
  }

  const active = tab === "reset" ? "forgot" : tab;
  if (tabLogin) tabLogin.classList.toggle("tab-btn-active", active === "login");
  if (tabSignup) tabSignup.classList.toggle("tab-btn-active", active === "signup");
  if (tabForgot) tabForgot.classList.toggle("tab-btn-active", active === "forgot");

  loginForm.classList.toggle("auth-hidden", tab !== "login");
  signupForm.classList.toggle("auth-hidden", tab !== "signup");
  forgotForm.classList.toggle("auth-hidden", tab !== "forgot");
  resetForm.classList.toggle("auth-hidden", tab !== "reset");
}

function setModulesMenuOpen(isOpen) {
  const menu = document.getElementById("modulesMenu");
  if (!menu) return;
  menu.classList.toggle("modules-menu-hidden", !isOpen);
}

function normalizePathname(pathname) {
  return String(pathname || "")
    .trim()
    .replace(/^\/+|\/+$/g, "")
    .toLowerCase();
}

function getTabFromLocation() {
  const rawHash = String(window.location.hash || "").trim();
  const hashPath = rawHash.replace(/^#\/?/, "");
  const normalizedHashPath = normalizePathname(hashPath);
  if (normalizedHashPath) return SLUG_TO_TAB[normalizedHashPath] || "home";
  const normalizedPath = normalizePathname(window.location.pathname);
  if (!normalizedPath) return "home";
  return SLUG_TO_TAB[normalizedPath] || "home";
}

function getPathForTab(tabName) {
  const safeTab = APP_TABS.includes(tabName) ? tabName : "home";
  return `/${TAB_TO_SLUG[safeTab] || TAB_TO_SLUG.home}`;
}

function getHashForTab(tabName) {
  const safeTab = APP_TABS.includes(tabName) ? tabName : "home";
  return `#/${TAB_TO_SLUG[safeTab] || TAB_TO_SLUG.home}`;
}

function syncUrlWithTab(tabName, options = {}) {
  const { replace = false } = options;
  const nextHash = getHashForTab(tabName);
  if ((window.location.hash || "") === nextHash) return;
  if (replace) {
    window.history.replaceState({ tab: tabName }, "", `${window.location.pathname}${nextHash}`);
    return;
  }
  window.location.hash = nextHash;
}

function toggleSupabaseConfig(forceShow) {
  const form = document.getElementById("authConfigForm");
  if (!form) return;
  if (!canEditAuthConfig()) {
    setAuthMessage("Configuração de acesso bloqueada para segurança.");
    return;
  }
  const shouldShow = typeof forceShow === "boolean"
    ? forceShow
    : form.classList.contains("auth-hidden");
  form.classList.toggle("auth-hidden", !shouldShow);
}

function getRedirectUrl() {
  return `${window.location.origin}/`;
}

async function initAuthClient() {
  const config = getSupabaseConfig();
  if (config.url && config.anonKey && !isAuthConfigLocked()) setAuthConfigLocked(true);
  const cfgUrlInput = document.getElementById("supabaseUrlInput");
  const cfgAnonInput = document.getElementById("supabaseAnonKeyInput");
  const btnToggleConfig = document.getElementById("btnToggleSupabaseConfig");
  const btnUseTest = document.getElementById("btnUseTestAccess");
  const authTabSignup = document.getElementById("authTabSignup");
  const authQuickActions = document.querySelector(".auth-quick-actions");
  if (cfgUrlInput) cfgUrlInput.value = config.url;
  if (cfgAnonInput) cfgAnonInput.value = config.anonKey;
  if (btnUseTest) btnUseTest.style.display = ALLOW_LOCAL_TEST_LOGIN ? "" : "none";
  if (authTabSignup) authTabSignup.style.display = ALLOW_PUBLIC_SIGNUP ? "" : "none";
  if (btnToggleConfig) btnToggleConfig.style.display = canEditAuthConfig() ? "" : "none";
  if (authQuickActions && !ALLOW_LOCAL_TEST_LOGIN && !canEditAuthConfig()) {
    authQuickActions.classList.add("auth-hidden");
  }

  authState.client = null;
  authState.user = null;
  authState.mode = "none";
  authState.permissions = getDefaultPermissions();

  if (ALLOW_LOCAL_TEST_LOGIN && getLocalTestSession()) {
    authState.mode = "local";
    authState.user = { email: LOCAL_TEST_EMAIL };
    await loadCurrentUserPermissions();
    showAppShell(true);
    setAuthMessage("Acesso de teste local ativo.");
    renderAll();
    return;
  }

  if (!config.url || !config.anonKey) {
    const setupMsg = canEditAuthConfig()
      ? "Acesso não configurado. Configure o acesso para continuar."
      : "Configuração de autenticação bloqueada.";
    setAuthMessage(setupMsg, true);
    showAppShell(false);
    return;
  }

  if (!window.supabase || !window.supabase.createClient) {
    setAuthMessage("Biblioteca de autenticação não carregada.", true);
    showAppShell(false);
    return;
  }

  try {
    authState.client = window.supabase.createClient(config.url, config.anonKey);
  } catch (error) {
    console.warn("[auth] Falha ao criar cliente de autenticação:", error);
    setAuthMessage("Falha ao iniciar autenticação. Atualize a página e tente novamente.", true);
    showAppShell(false);
    return;
  }
  authState.mode = "supabase";
  const { data } = await authState.client.auth.getSession();
  authState.user = data.session ? data.session.user : null;
  await loadCurrentUserPermissions();

  authState.client.auth.onAuthStateChange(async (_event, session) => {
    authState.user = session ? session.user : null;
    stopSharedStateRefreshTimer();
    cloudSyncState.hasLoadedFromCloud = false;
    cloudSyncState.sharedExportsLoaded = false;
    await loadCurrentUserPermissions();
    if (authState.user) {
      await syncStateFromCloudOnLogin();
      await loadSharedExportsFromCloud(true);
      setActiveTab(getTabFromLocation(), { replaceUrl: true });
    }
    showAppShell(Boolean(authState.user));
    renderAll();
  });

  const hash = window.location.hash || "";
  if (hash.includes("type=recovery")) {
    switchAuthTab("reset");
    setAuthMessage("Defina sua nova senha.");
    showAppShell(false);
    return;
  }

  showAppShell(Boolean(authState.user));
  if (!authState.user) {
    switchAuthTab("login");
    setAuthMessage("Faça login para continuar.");
  } else {
    await syncStateFromCloudOnLogin();
    await loadSharedExportsFromCloud(true);
    setActiveTab(getTabFromLocation(), { replaceUrl: true });
  }
  renderAll();
}

async function syncExportToCloud(exportRecord) {
  const endpoint = getCloudSyncEndpoint();
  if (!endpoint) return false;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exportRecord),
      keepalive: true,
    });
    return response.ok;
  } catch {
    return false;
  }
}

async function upsertSharedExportToCloud(exportRecord) {
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return false;
  if (!exportRecord?.id) return false;
  try {
    const payload = {
      export_id: String(exportRecord.id),
      type: exportRecord.type === "payslip" ? "payslip" : "proposal",
      exported_at: String(exportRecord.exportedAt || new Date().toISOString()),
      proposal_number: String(exportRecord.proposalNumber || "").trim() || null,
      company_name: String(exportRecord.companyName || "").trim() || null,
      snapshot: exportRecord.snapshot && typeof exportRecord.snapshot === "object" ? exportRecord.snapshot : {},
      created_by: authState.user.id,
      created_by_email: String(authState.user.email || "").trim().toLowerCase() || null,
      updated_at: new Date().toISOString(),
    };
    const { error } = await authState.client
      .from("app_shared_exports")
      .upsert(payload, { onConflict: "export_id" });
    return !error;
  } catch {
    return false;
  }
}

async function deleteSharedExportFromCloud(exportId) {
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return false;
  if (!exportId) return false;
  try {
    const { error } = await authState.client
      .from("app_shared_exports")
      .delete()
      .eq("export_id", String(exportId));
    return !error;
  } catch {
    return false;
  }
}

async function loadSharedExportsFromCloud(force = false) {
  if (authState.mode !== "supabase" || !authState.client || !authState.user) return;
  if (!force && cloudSyncState.sharedExportsLoaded) return;
  if (cloudSyncState.sharedExportsLoading) return;
  cloudSyncState.sharedExportsLoading = true;
  try {
    const { data, error } = await authState.client
      .from("app_shared_exports")
      .select("export_id, type, exported_at, proposal_number, company_name, snapshot, created_by_email")
      .order("exported_at", { ascending: false })
      .limit(500);
    if (error) {
      cloudSyncState.sharedExports = [];
      cloudSyncState.sharedExportsLoaded = false;
      return;
    }
    cloudSyncState.sharedExports = (Array.isArray(data) ? data : []).map((entry) => normalizeExportRecord({
      id: entry.export_id,
      type: entry.type,
      exportedAt: entry.exported_at,
      proposalNumber: entry.proposal_number,
      companyName: entry.company_name,
      snapshot: entry.snapshot,
      cloudStatus: "synced",
      createdByEmail: entry.created_by_email,
    }));
    cloudSyncState.sharedExportsLoaded = true;
    cloudSyncState.sharedExportsLastSyncAt = Date.now();
  } catch {
    cloudSyncState.sharedExports = [];
    cloudSyncState.sharedExportsLoaded = false;
    cloudSyncState.sharedExportsLastSyncAt = 0;
  } finally {
    cloudSyncState.sharedExportsLoading = false;
  }
}

function cloneSnapshot(data) {
  return JSON.parse(JSON.stringify(data));
}

function normalizeExportRecord(item) {
  return {
    id: String(item?.id || ""),
    type: item?.type === "payslip" ? "payslip" : "proposal",
    exportedAt: String(item?.exportedAt || ""),
    proposalNumber: String(item?.proposalNumber || "").trim(),
    companyName: String(item?.companyName || "").trim(),
    snapshot: item?.snapshot && typeof item.snapshot === "object" ? item.snapshot : {},
    cloudStatus: String(item?.cloudStatus || "pending"),
    createdByEmail: String(item?.createdByEmail || "").trim().toLowerCase(),
  };
}

function mergeExportRecords(primaryList, secondaryList) {
  const merged = new Map();
  const pushRecord = (record) => {
    const normalized = normalizeExportRecord(record);
    if (!normalized.id || !normalized.exportedAt) return;
    const existing = merged.get(normalized.id);
    if (!existing) {
      merged.set(normalized.id, normalized);
      return;
    }
    const existingTs = new Date(existing.exportedAt).getTime();
    const nextTs = new Date(normalized.exportedAt).getTime();
    if (Number.isNaN(existingTs) || (!Number.isNaN(nextTs) && nextTs >= existingTs)) {
      merged.set(normalized.id, normalized);
    }
  };

  (Array.isArray(primaryList) ? primaryList : []).forEach(pushRecord);
  (Array.isArray(secondaryList) ? secondaryList : []).forEach(pushRecord);

  return Array.from(merged.values())
    .sort((a, b) => new Date(b.exportedAt).getTime() - new Date(a.exportedAt).getTime())
    .slice(0, 500);
}

function getAllAvailableExports() {
  const deletedSet = new Set((state.deletedExportIds || []).map((id) => String(id || "").trim()).filter(Boolean));
  const merged = mergeExportRecords(state.exports || [], cloudSyncState.sharedExports || []);
  if (!deletedSet.size) return merged;
  return merged.filter((entry) => !deletedSet.has(String(entry.id || "")));
}

async function syncExportRecordToCloudChannels(exportRecord) {
  const hasEndpoint = Boolean(getCloudSyncEndpoint());
  const endpointOk = hasEndpoint ? await syncExportToCloud(exportRecord) : false;
  const sharedOk = await upsertSharedExportToCloud(exportRecord);
  const anySuccess = sharedOk || endpointOk;
  return {
    anySuccess,
    endpointOk,
    sharedOk,
  };
}

function registerExport(type) {
  const exportRecord = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type,
    exportedAt: new Date().toISOString(),
    proposalNumber: String(state.proposal.proposalNumber || "").trim(),
    companyName: String(state.company.name || "").trim(),
    snapshot: cloneSnapshot({
      company: state.company,
      clients: state.clients,
      property: state.property,
      furniture: state.furniture,
      proposalPhotos: state.proposalPhotos,
      pricing: state.pricing,
      proposal: state.proposal,
      payslip: state.payslip,
      contracts: state.contracts,
    }),
    cloudStatus: "pending",
    createdByEmail: String(authState.user?.email || "").trim().toLowerCase(),
  };

  state.deletedExportIds = (state.deletedExportIds || []).filter((id) => String(id || "").trim() !== exportRecord.id);
  state.exports = [exportRecord, ...(state.exports || [])].slice(0, 500);
  saveState();
  void logAuditAction({
    action: "export",
    module: "exports",
    entityType: type === "payslip" ? "payslip" : "proposal",
    entityId: exportRecord.id,
    description: `Documento exportado em PDF (${type}).`,
    metadata: {
      proposalNumber: exportRecord.proposalNumber || "",
      companyName: exportRecord.companyName || "",
      exportedAt: exportRecord.exportedAt,
    },
  });
  renderExports();

  void syncExportRecordToCloudChannels(exportRecord).then(async (syncResult) => {
    const idx = state.exports.findIndex((item) => item.id === exportRecord.id);
    if (idx >= 0) {
      state.exports[idx].cloudStatus = syncResult.anySuccess ? "synced" : "failed";
      saveState();
    }
    if (syncResult.sharedOk) {
      await loadSharedExportsFromCloud(true);
    }
    renderExports();
  });
}

function resetActiveTabInputs() {
  if (uiState.activeTab === "proposals") {
    state.company = {};
    state.property = {};
    state.furniture = [];
    state.proposalPhotos = [];
    state.pricing = {};
    state.proposal = {};
    return;
  }

  if (uiState.activeTab === "payslip") {
    state.payslip = {
      competence: "",
      referenceMonth: "",
      paymentDate: "",
      paymentMethod: "",
      selectedEmployeeId: "",
      monthTotalDays: "30",
      firstWorkDayInMonth: "",
      lastWorkDayInMonth: "",
      businessDaysInMonth: "22",
      absenceDays: "0",
      allowanceDays: "0",
      employeeName: "",
      employeeCpf: "",
      position: "",
      registration: "",
      baseSalary: "0",
      mealAllowanceFixed: "0",
      mealAllowanceDaily: "0",
      fixedDiscountPercent: "0",
      earnings: [],
      discounts: [],
    };
    uiState.payslipFormOpen = false;
    return;
  }

  if (uiState.activeTab === "clients") {
    uiState.editingClientId = "";
    uiState.viewingClientId = "";
    uiState.clientsFormOpen = false;
    return;
  }

  if (uiState.activeTab === "employees") {
    uiState.editingEmployeeId = "";
    uiState.viewingEmployeeId = "";
    uiState.employeesFormOpen = false;
    return;
  }

  if (uiState.activeTab === "balance") {
    state.balance = { entries: [] };
    return;
  }

  if (uiState.activeTab === "taxes") {
    uiState.editingTaxRecordId = "";
    return;
  }

  if (uiState.activeTab === "contracts") {
    resetContractsDraftForm(false);
    uiState.contractsFormOpen = false;
    uiState.contractsSimulationOpen = false;
    uiState.contractsSimulation = createEmptyContractSimulation();
    return;
  }

  if (uiState.activeTab === "rentedProperties") {
    uiState.rentedPropertiesFormOpen = false;
    uiState.editingRentedPropertyId = "";
  }
}

function resetModuleUiState(moduleName) {
  if (moduleName === "proposals") {
    state.company = {};
    state.property = {};
    state.furniture = [];
    state.proposalPhotos = [];
    state.pricing = {};
    state.proposal = {};
    uiState.proposalStarted = false;
    uiState.proposalStep = 1;
    saveState();
    return;
  }

  if (moduleName === "clients") {
    uiState.clientsFormOpen = false;
    uiState.editingClientId = "";
    uiState.viewingClientId = "";
    return;
  }

  if (moduleName === "employees") {
    uiState.employeesFormOpen = false;
    uiState.editingEmployeeId = "";
    uiState.viewingEmployeeId = "";
    uiState.pendingEmployeeDocuments = [];
    return;
  }

  if (moduleName === "payslip") {
    uiState.payslipFormOpen = false;
    return;
  }

  if (moduleName === "contracts") {
    uiState.contractsFormOpen = false;
    uiState.contractsEditMode = false;
    uiState.contractsSummaryVisible = false;
    uiState.contractsSimulationOpen = false;
    uiState.contractsSimulation = createEmptyContractSimulation();
    uiState.contractsSavedView = "effective";
    uiState.contractsVisibleValuesById = {};
    return;
  }

  if (moduleName === "rentedProperties") {
    uiState.rentedPropertiesFormOpen = false;
    uiState.editingRentedPropertyId = "";
    return;
  }

  if (moduleName === "balance") {
    uiState.balanceMode = "monthly";
    uiState.balanceContractId = "";
    return;
  }

  if (moduleName === "taxes") {
    uiState.editingTaxRecordId = "";
  }
}

function setActiveTab(tabName, options = {}) {
  const { syncUrl = true, replaceUrl = false } = options;
  const previousTab = uiState.activeTab;
  const requestedTab = APP_TABS.includes(tabName)
    ? tabName
    : "home";
  let nextTab = requestedTab;
  let shouldFixUrlWithFallback = false;
  if (!canAccessTab(nextTab)) {
    setAuthMessage("Você não tem permissão para acessar este módulo.", true);
    nextTab = "home";
    shouldFixUrlWithFallback = true;
  }
  if (previousTab && previousTab !== nextTab) {
    resetModuleUiState(previousTab);
  }
  uiState.activeTab = nextTab;

  const homeModule = document.getElementById("homeModule");
  const proposalModule = document.getElementById("proposalModule");
  const clientsModule = document.getElementById("clientsModule");
  const employeesModule = document.getElementById("employeesModule");
  const payslipModule = document.getElementById("payslipModule");
  const balanceModule = document.getElementById("balanceModule");
  const taxesModule = document.getElementById("taxesModule");
  const contractsModule = document.getElementById("contractsModule");
  const rentedPropertiesModule = document.getElementById("rentedPropertiesModule");
  const exportsModule = document.getElementById("exportsModule");
  const tabHome = document.getElementById("tabHome");
  const tabProposals = document.getElementById("tabProposals");
  const tabClients = document.getElementById("tabClients");
  const tabEmployees = document.getElementById("tabEmployees");
  const tabPayslip = document.getElementById("tabPayslip");
  const tabBalance = document.getElementById("tabBalance");
  const tabTaxes = document.getElementById("tabTaxes");
  const tabContracts = document.getElementById("tabContracts");
  const tabRentedProperties = document.getElementById("tabRentedProperties");
  const tabExports = document.getElementById("tabExports");
  const btnExportProposal = document.getElementById("btnExportPdf");
  const btnExportPayslip = document.getElementById("btnExportPayslipPdf");

  homeModule.classList.toggle("module-active", uiState.activeTab === "home");
  proposalModule.classList.toggle("module-active", uiState.activeTab === "proposals");
  clientsModule.classList.toggle("module-active", uiState.activeTab === "clients");
  employeesModule.classList.toggle("module-active", uiState.activeTab === "employees");
  payslipModule.classList.toggle("module-active", uiState.activeTab === "payslip");
  balanceModule.classList.toggle("module-active", uiState.activeTab === "balance");
  taxesModule.classList.toggle("module-active", uiState.activeTab === "taxes");
  contractsModule.classList.toggle("module-active", uiState.activeTab === "contracts");
  rentedPropertiesModule.classList.toggle("module-active", uiState.activeTab === "rentedProperties");
  exportsModule.classList.toggle("module-active", uiState.activeTab === "exports");
  tabHome.classList.toggle("tab-btn-active", uiState.activeTab === "home");
  tabProposals.classList.toggle("tab-btn-active", uiState.activeTab === "proposals");
  tabClients.classList.toggle("tab-btn-active", uiState.activeTab === "clients");
  tabEmployees.classList.toggle("tab-btn-active", uiState.activeTab === "employees");
  tabPayslip.classList.toggle("tab-btn-active", uiState.activeTab === "payslip");
  tabBalance.classList.toggle("tab-btn-active", uiState.activeTab === "balance");
  tabTaxes.classList.toggle("tab-btn-active", uiState.activeTab === "taxes");
  tabContracts.classList.toggle("tab-btn-active", uiState.activeTab === "contracts");
  tabRentedProperties.classList.toggle("tab-btn-active", uiState.activeTab === "rentedProperties");
  tabExports.classList.toggle("tab-btn-active", uiState.activeTab === "exports");

  btnExportProposal.style.display = uiState.activeTab === "proposals" ? "" : "none";
  btnExportPayslip.style.display = uiState.activeTab === "payslip" ? "" : "none";
  uiState.notificationsOpen = false;
  setModulesMenuOpen(false);
  applyPermissionsUi();
  if (syncUrl || shouldFixUrlWithFallback) {
    syncUrlWithTab(nextTab, { replace: replaceUrl || shouldFixUrlWithFallback });
  }
  if (uiState.activeTab === "exports" && authState.mode === "supabase" && authState.user) {
    void loadSharedExportsFromCloud(true).then(() => {
      renderExports();
    });
  }
}

function setProposalStep(nextStep) {
  if (!uiState.proposalStarted) return;
  const step = Math.max(1, Math.min(uiState.maxProposalStep, Number(nextStep || 1)));
  uiState.proposalStep = step;

  const stepPanels = document.querySelectorAll(".proposal-step");
  const stepChips = document.querySelectorAll(".step-chip");
  const btnPrev = document.getElementById("btnPrevStep");
  const btnNext = document.getElementById("btnNextStep");

  stepPanels.forEach((panel) => {
    const panelStep = Number(panel.getAttribute("data-step"));
    panel.classList.toggle("proposal-step-active", panelStep === step);
  });

  stepChips.forEach((chip) => {
    const chipStep = Number(chip.getAttribute("data-step-jump"));
    chip.classList.toggle("step-chip-active", chipStep === step);
  });

  btnPrev.disabled = step === 1;
  btnNext.textContent = step === uiState.maxProposalStep ? "Última etapa" : "Próxima etapa";
}

function renderProposalEntryGate() {
  const entryGate = document.getElementById("proposalEntryGate");
  const workflow = document.getElementById("proposalWorkflow");
  if (!entryGate || !workflow) return;

  entryGate.classList.toggle("auth-hidden", uiState.proposalStarted);
  workflow.classList.toggle("auth-hidden", !uiState.proposalStarted);

  if (uiState.proposalStarted) {
    setProposalStep(uiState.proposalStep);
  }
}

function formToObject(form) {
  const data = new FormData(form);
  const obj = {};
  for (const [key, value] of data.entries()) obj[key] = String(value).trim();
  return obj;
}

function setFormValues(form, values) {
  Object.entries(values || {}).forEach(([key, value]) => {
    const element = form.elements.namedItem(key);
    if (element) element.value = value;
  });
}

function refreshBrazilianPatternInputs() {
  document.querySelectorAll("input[name]").forEach((input) => {
    applyBrazilianInputPattern(input, "input");
    applyBrazilianInputPattern(input, "blur");
  });
}

function renderDefaultFurnitureOptions() {
  const container = document.getElementById("defaultFurnitureOptions");
  if (!container) return;

  container.innerHTML = DEFAULT_FURNITURE.map(
    (entry, index) => {
      const variant = FURNITURE_VARIANTS[entry.item];
      const variantSelect = variant
        ? `
          <label class="furniture-option-qty-label">
            ${escapeHtml(variant.label)}
            <select class="default-furniture-variant" data-default-variant-index="${index}">
              ${variant.options.map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
            </select>
          </label>
        `
        : "";

      return `
      <div class="furniture-option-row">
        <label class="furniture-option-check">
          <input type="checkbox" class="default-furniture-checkbox" data-default-index="${index}" />
          <span>${escapeHtml(entry.item)}</span>
        </label>
        <div class="furniture-option-meta">
          <span class="furniture-option-environment">${escapeHtml(entry.environment)}</span>
          ${variantSelect}
          <label class="furniture-option-qty-label">
            Qtd
            <input
              type="number"
              min="1"
              value="1"
              class="default-furniture-qty"
              data-default-qty-index="${index}"
              aria-label="Quantidade de ${escapeHtml(entry.item)}"
            />
          </label>
        </div>
      </div>
    `;
    },
  ).join("");
}

function removeProposalPhotoById(photoId) {
  const idx = state.proposalPhotos.findIndex((photo) => photo.id === photoId);
  if (idx < 0) return;
  state.proposalPhotos.splice(idx, 1);
  saveState();
  renderAll();
}

function renderProposalPhotosList() {
  const container = document.getElementById("proposalPhotosList");
  if (!container) return;

  container.innerHTML = "";
  if (!state.proposalPhotos.length) {
    container.innerHTML = '<li><span class="small">Nenhuma foto anexada.</span></li>';
    return;
  }

  state.proposalPhotos.forEach((photo, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span><strong>${index + 1}.</strong> ${escapeHtml(photo.name)}</span>`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-danger";
    btn.textContent = "Remover";
    btn.addEventListener("click", () => removeProposalPhotoById(photo.id));
    li.appendChild(btn);
    container.appendChild(li);
  });
}

function upsertFurnitureItem(item, environment, quantity, notes = "") {
  const normalizedItem = canonicalFurnitureItemName(item);
  const normalizedEnv = String(environment || "").trim();
  const normalizedNotes = String(notes || "").trim();
  const qty = Number(quantity || 0);
  if (!normalizedItem || !normalizedEnv || qty <= 0) return;

  const existing = state.furniture.find(
    (x) => x.item === normalizedItem
      && x.environment === normalizedEnv
      && String(x.notes || "").trim() === normalizedNotes,
  );

  if (existing) {
    existing.quantity = Number(existing.quantity || 0) + qty;
    existing.notes = String(existing.notes || normalizedNotes).trim();
  } else {
    state.furniture.push({
      item: normalizedItem,
      environment: normalizedEnv,
      quantity: qty,
      notes: normalizedNotes,
    });
  }
}

function editFurnitureItem(item, environment, notes = "") {
  const target = state.furniture.find(
    (entry) =>
      entry.item === item
      && entry.environment === environment
      && String(entry.notes || "").trim() === String(notes || "").trim(),
  );
  if (!target) return;

  const currentQty = Number(target.quantity || 0);
  const qtyInput = prompt("Nova quantidade:", String(currentQty));
  if (qtyInput === null) return;
  const parsedQty = Number.parseInt(String(qtyInput || "").trim(), 10);
  if (!Number.isFinite(parsedQty) || parsedQty <= 0) {
    alert("Quantidade inválida. Informe um número inteiro maior que zero.");
    return;
  }

  const notesInput = prompt(
    "Observações (opcional):",
    String(target.notes || ""),
  );
  if (notesInput === null) return;

  target.quantity = parsedQty;
  target.notes = String(notesInput || "").trim();
  saveState();
  renderAll();
}

function renderFurnitureList() {
  const container = document.getElementById("furnitureList");
  if (!container) return;

  const sorted = getFurnitureSorted();
  container.innerHTML = "";
  if (!sorted.length) {
    container.innerHTML = '<li><span class="small">Nenhum item adicionado.</span></li>';
    return;
  }

  sorted.forEach((item) => {
    const li = document.createElement("li");
    const notesText = String(item.notes || "").trim();
    li.innerHTML = `
      <span>
        <strong>${escapeHtml(item.item)}</strong> (${escapeHtml(item.environment || "-")}) : ${escapeHtml(item.quantity)}
        ${notesText ? `<br /><small class="small">Obs.: ${escapeHtml(notesText)}</small>` : ""}
      </span>
    `;

    const actions = document.createElement("div");
    actions.className = "exports-actions";

    const btnEdit = document.createElement("button");
    btnEdit.type = "button";
    btnEdit.className = "btn";
    btnEdit.textContent = "Editar";
    btnEdit.addEventListener("click", () => {
      editFurnitureItem(item.item, item.environment, item.notes);
    });

    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.className = "btn btn-danger";
    btnRemove.textContent = "Remover";
    btnRemove.addEventListener("click", () => {
      const originalIndex = state.furniture.findIndex(
        (x) => x.item === item.item
          && x.environment === item.environment
          && String(x.notes || "").trim() === String(item.notes || "").trim(),
      );
      if (originalIndex >= 0) removeByIndex(state.furniture, originalIndex);
    });

    actions.appendChild(btnEdit);
    actions.appendChild(btnRemove);
    li.appendChild(actions);
    container.appendChild(li);
  });
}

function getFurnitureSorted() {
  const order = new Map(DEFAULT_FURNITURE.map((entry, index) => [entry.item, index]));
  const envOrder = new Map(ENVIRONMENT_ORDER.map((entry, index) => [entry, index]));
  return [...state.furniture].sort((a, b) => {
    const aEnv = a.environment || "Não informado";
    const bEnv = b.environment || "Não informado";
    const aEnvOrder = envOrder.has(aEnv) ? envOrder.get(aEnv) : 999;
    const bEnvOrder = envOrder.has(bEnv) ? envOrder.get(bEnv) : 999;
    if (aEnvOrder !== bEnvOrder) return aEnvOrder - bEnvOrder;

    const aOrder = order.has(a.item) ? order.get(a.item) : 999;
    const bOrder = order.has(b.item) ? order.get(b.item) : 999;
    if (aOrder !== bOrder) return aOrder - bOrder;
    return a.item.localeCompare(b.item, "pt-BR");
  });
}

function removeByIndex(list, index) {
  list.splice(index, 1);
  saveState();
  renderAll();
}

function renderList(container, list, labelFn, onRemove) {
  container.innerHTML = "";
  if (!list.length) {
    container.innerHTML = '<li><span class="small">Nenhum item adicionado.</span></li>';
    return;
  }

  list.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${labelFn(item)}</span>`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Remover";
    btn.addEventListener("click", () => onRemove(index));
    li.appendChild(btn);
    container.appendChild(li);
  });
}

function calculateTotal() {
  const capacity = Number(state.property.capacity || 0);
  const dailyRatePerPerson = parseBRLNumber(state.property.dailyRatePerPerson || 0);
  const dailyHostingTotal = capacity * dailyRatePerPerson;
  const monthlyValue = dailyHostingTotal * 30;

  const marginPercent = Number(state.pricing.marginPercent || 0);
  const adminFeePercent = Number(state.pricing.adminFeePercent || 0);
  const discountPercent = Number(state.pricing.discount || 0);

  const marginValue = monthlyValue * (marginPercent / 100);
  const adminFeeValue = monthlyValue * (adminFeePercent / 100);
  const subtotal = monthlyValue + marginValue + adminFeeValue;
  const discountValue = subtotal * (discountPercent / 100);

  return {
    capacity,
    dailyRatePerPerson,
    dailyHostingTotal,
    monthlyValue,
    marginPercent,
    marginValue,
    adminFeePercent,
    adminFeeValue,
    discountPercent,
    discountValue,
    final: Math.max(subtotal - discountValue, 0),
  };
}

function buildFullAddress(property) {
  if (property.address) return property.address;

  const line1 = [property.street, property.number].filter(Boolean).join(", ");
  const line2 = [property.complement, property.district].filter(Boolean).join(" - ");
  const line3 = [property.city, property.state].filter(Boolean).join(" / ");
  const line4 = property.zipCode || "";

  return [line1, line2, line3, line4].filter(Boolean).join(" | ");
}

function hasValue(value) {
  return String(value || "").trim().length > 0;
}

function renderProposal() {
  const output = document.getElementById("proposalOutput");
  const totals = calculateTotal();
  const showMarginRow = Number(totals.marginPercent || 0) > 0;
  const showAdminFeeRow = Number(totals.adminFeePercent || 0) > 0;
  const showDiscountRow = Number(totals.discountPercent || 0) > 0;

  const propertyName = state.property.name || "Não informado";
  const fullAddress = buildFullAddress(state.property);

  const clientEntries = [
    { label: "Empresa", value: state.company.name },
    { label: "Destinatário", value: state.proposal.recipient },
    { label: "CNPJ", value: state.company.cnpj },
    { label: "Contato", value: state.company.contact },
    { label: "Celular", value: state.company.phone },
    { label: "E-mail", value: state.company.email },
    { label: "Cidade", value: state.company.city },
  ].filter((entry) => hasValue(entry.value));

  const clientRowsHtml = clientEntries.length
    ? clientEntries
        .map(
          (entry) => `<div><strong>${escapeHtml(entry.label)}:</strong> ${escapeHtml(entry.value)}</div>`,
        )
        .join("")
    : '<div class="small" style="grid-column: 1 / -1;">Nenhuma informação de cliente preenchida.</div>';

  const addressRowHtml = hasValue(fullAddress)
    ? `<div style="grid-column: 1 / -1;"><strong>Endereço:</strong> ${escapeHtml(fullAddress)}</div>`
    : "";
  const propertyDescriptionRow = hasValue(state.property.description)
    ? `<div style="grid-column: 1 / -1;"><strong>Descrição:</strong> ${escapeHtml(state.property.description)}</div>`
    : "";
  const proposalNotes = state.company.notes
    || "Condições sujeitas a ajustes conforme volume de unidades e prazo contratual.";

  const sortedFurniture = getFurnitureSorted();
  const furnitureRows = sortedFurniture.length
    ? sortedFurniture
        .map((item, index, arr) => {
          const environment = item.environment || "Não informado";
          const previousEnvironment = index > 0 ? arr[index - 1].environment || "Não informado" : "";
          const environmentHeader =
            environment !== previousEnvironment
              ? `<tr><td colspan="4"><strong>${escapeHtml(environment)}</strong></td></tr>`
              : "";
          return `${environmentHeader}<tr><td>${escapeHtml(item.item)}</td><td>${escapeHtml(environment)}</td><td>${escapeHtml(item.quantity)}</td><td>${escapeHtml(item.notes || "-")}</td></tr>`;
        })
        .join("")
    : '<tr><td colspan="4">Não informado</td></tr>';

  const photoPages = [];
  for (let i = 0; i < state.proposalPhotos.length; i += 8) {
    photoPages.push(state.proposalPhotos.slice(i, i + 8));
  }
  const photosSectionHtml = photoPages.length
    ? `
      <section class="doc-section doc-photos-section">
        <h4>8. Anexos Fotográficos do Imóvel</h4>
        ${photoPages
          .map(
            (page) => `
              <div class="doc-photos-page">
                <div class="doc-photos-grid">
                  ${page
                    .map(
                      (photo, index) => `
                        <figure class="doc-photo-item">
                          <img src="${photo.dataUrl}" alt="Foto do imóvel ${index + 1}" />
                          <figcaption class="small">${escapeHtml(photo.name || "Foto do imóvel")}</figcaption>
                        </figure>
                      `,
                    )
                    .join("")}
                </div>
              </div>
            `,
          )
          .join("")}
      </section>
    `
    : "";

  output.innerHTML = `
    <article class="proposal-doc">
      <header class="doc-header">
        <div class="doc-brand">
          <img class="doc-logo" src="${FIXED_LOGO_PATH}" alt="Logo Vila Marques Alojamentos" />
          <div class="doc-title">
            <h3>Proposta Comercial</h3>
            <p>Alojamentos corporativos</p>
          </div>
        </div>
        <div class="doc-meta">
          <div><strong>Nº:</strong> ${escapeHtml(state.proposal.proposalNumber || "-")}</div>
          <div><strong>Emissão:</strong> ${formatDateBR(state.proposal.issueDate)}</div>
          <div><strong>Validade:</strong> ${formatDateBR(state.pricing.validUntil)}</div>
        </div>
      </header>

      <section class="doc-section">
        <h4>1. Dados do Cliente</h4>
        <div class="doc-grid">${clientRowsHtml}</div>
      </section>

      <section class="doc-section">
        <h4>2. Imóvel Ofertado</h4>
        <div class="doc-grid">
          <div><strong>Nome:</strong> ${escapeHtml(propertyName)}</div>
          <div><strong>Tipo:</strong> ${escapeHtml(state.property.type || "-")}</div>
          <div><strong>Classificação:</strong> ${escapeHtml(state.property.operationType || "-")}</div>
          <div><strong>Capacidade:</strong> ${escapeHtml(state.property.capacity || "-")} pessoa(s)</div>
          <div><strong>Quartos:</strong> ${escapeHtml(state.property.bedrooms || "-")}</div>
          <div><strong>Banheiros:</strong> ${escapeHtml(state.property.bathrooms || "-")}</div>
          <div><strong>Garagem:</strong> ${escapeHtml(state.property.garageSpots || "-")}</div>
          <div><strong>Área de serviço:</strong> ${escapeHtml(state.property.serviceAreaType || "-")}</div>
          <div><strong>Diária por pessoa:</strong> ${currencyBRL.format(parseBRLNumber(state.property.dailyRatePerPerson || 0))}</div>
          <div><strong>Total diária do imóvel:</strong> ${currencyBRL.format(totals.dailyHostingTotal)}</div>
          ${addressRowHtml}
          ${propertyDescriptionRow}
        </div>
      </section>

      <section class="doc-section">
        <h4>3. Mobília Inclusa</h4>
        <table class="doc-table">
          <thead>
            <tr><th>Item</th><th>Ambiente</th><th>Quantidade</th><th>Observações</th></tr>
          </thead>
          <tbody>${furnitureRows}</tbody>
        </table>
      </section>

      <section class="doc-section">
        <h4>4. Itens, Estrutura e Serviços Inclusos</h4>
        <ul class="doc-numbered-list">
          <li><strong>4.1</strong> Internet instalada;</li>
          <li><strong>4.2</strong> Utensílios para limpeza;</li>
          <li><strong>4.3</strong> Faxina 05 vezes por semana (segunda a sexta-feira);</li>
          <li><strong>4.4</strong> Lavagem de uniformes 03 vezes por semana;</li>
          <li><strong>4.5</strong> Troca e lavagem de roupas de cama 01 vez por semana;</li>
          <li><strong>4.6</strong> Manutenção elétrica e hidráulica (exceto vandalismo);</li>
          <li><strong>4.7</strong> Atendimento às NR's exigidas pela VALE / SAMARCO.</li>
        </ul>
      </section>

      <section class="doc-section doc-section-narrow">
        <h4>5. Condição Comercial</h4>
        <div class="doc-totals">
          <div class="doc-row"><span>Base diária (${totals.capacity} pessoa(s) x ${currencyBRL.format(totals.dailyRatePerPerson)})</span><strong>${currencyBRL.format(totals.dailyHostingTotal)}</strong></div>
          <div class="doc-row"><span>Valor mensal (diária x 30)</span><strong>${currencyBRL.format(totals.monthlyValue)}</strong></div>
          ${showMarginRow ? `<div class="doc-row"><span>Margem comercial (${totals.marginPercent}%)</span><strong>${currencyBRL.format(totals.marginValue)}</strong></div>` : ""}
          ${showAdminFeeRow ? `<div class="doc-row"><span>Taxa administrativa (${totals.adminFeePercent}%)</span><strong>${currencyBRL.format(totals.adminFeeValue)}</strong></div>` : ""}
          ${showDiscountRow ? `<div class="doc-row"><span>Desconto (${totals.discountPercent}%)</span><strong>- ${currencyBRL.format(totals.discountValue)}</strong></div>` : ""}
          <div class="doc-row doc-highlight"><span>Valor final da proposta</span><span>${currencyBRL.format(totals.final)}</span></div>
        </div>
      </section>

      <section class="doc-section doc-section-narrow">
        <h4>6. Vigência e Pagamento</h4>
        <div class="doc-grid">
          <div><strong>Vigência inicial:</strong> ${formatDateBR(state.proposal.contractStartDate)}</div>
          <div><strong>Vigência final:</strong> ${formatDateBR(state.proposal.contractEndDate)}</div>
          <div><strong>Dia de pagamento:</strong> ${escapeHtml(state.proposal.paymentDay || "-")}</div>
          <div style="grid-column: 1 / -1;">
            <strong>Condição de pagamento:</strong>
            Pagamento feito no dia ${escapeHtml(state.proposal.paymentDay || "-")} de cada mês durante todo o período de vigência do contrato, por meio de transferência PIX ou depósito bancário para a conta fornecida pela contratada.
          </div>
        </div>
      </section>

      <section class="doc-section doc-section-narrow">
        <h4>7. Responsabilidades Contratuais</h4>
        <p>
          Ficam sob responsabilidade do contratado todos os encargos referentes a aluguel, IPTU, água, energia
          elétrica, internet, manutenção estrutural e operacional do alojamento. Casos de danos decorrentes de
          vandalismo serão de responsabilidade do contratante.
        </p>
      </section>

      ${photosSectionHtml}

      <footer class="doc-footer doc-avoid-break">
        <p><strong>Contratado:</strong> ${escapeHtml(CONTRACTOR_INFO.companyName)}</p>
        <p><strong>CNPJ:</strong> ${escapeHtml(CONTRACTOR_INFO.cnpj)}</p>
        <p><strong>Responsável:</strong> ${escapeHtml(CONTRACTOR_INFO.responsible)} | <strong>Telefone:</strong> ${escapeHtml(CONTRACTOR_INFO.phone)}</p>
        <p><strong>Observações:</strong> ${escapeHtml(proposalNotes)}</p>
      </footer>
    </article>
  `;
}

function calculatePayslipTotals() {
  const reference = inferReferenceYearMonth(state.payslip.referenceMonth, state.payslip.paymentDate);
  const referenceYear = reference.year;
  const referenceMonth = reference.month;
  const selectedEmployee = (state.payslipEmployees || []).find(
    (employee) => employee.id === String(state.payslip.selectedEmployeeId || "").trim(),
  ) || null;
  const baseSalary = Number(state.payslip.baseSalary || 0);
  const monthTotalDays = getDaysInMonth(referenceYear, referenceMonth);
  const resolvedPeriod = resolveWorkPeriodFromDateInputs({
    year: referenceYear,
    monthNumber: referenceMonth,
    monthTotalDays,
    firstWorkDateISO: state.payslip.firstWorkDayInMonth,
    lastWorkDateISO: state.payslip.lastWorkDayInMonth,
  });
  const workPeriod = resolvedPeriod.ok
    ? resolveWorkPeriodInMonth(monthTotalDays, resolvedPeriod.firstDay, resolvedPeriod.lastDay)
    : resolveWorkPeriodInMonth(monthTotalDays, 1, monthTotalDays);
  const businessDaysByRange = countWeekdaysBetweenDays(
    referenceYear,
    referenceMonth,
    workPeriod.firstDay,
    workPeriod.lastDay,
  );
  const businessDaysInMonth = Math.min(
    Math.max(0, Number(state.payslip.businessDaysInMonth || businessDaysByRange)),
    businessDaysByRange,
  );
  const absenceDays = Math.max(0, Number(state.payslip.absenceDays || 0));
  const allowanceDays = Math.max(0, Number(state.payslip.allowanceDays || 0));
  const cappedAbsenceDays = Math.min(absenceDays, businessDaysInMonth);
  const cappedAllowanceDays = Math.min(allowanceDays, cappedAbsenceDays);
  const unexcusedAbsenceDays = Math.max(0, cappedAbsenceDays - cappedAllowanceDays);
  const salaryPaidDays = Math.max(0, workPeriod.workedCalendarDays - unexcusedAbsenceDays);
  const workedBusinessDays = Math.max(0, businessDaysInMonth - cappedAbsenceDays);
  const vaNotPaidDaysTotal = cappedAbsenceDays;
  const vaNotPaidDaysAboned = cappedAllowanceDays;
  const vaNotPaidDaysUnexcused = unexcusedAbsenceDays;
  const baseDailyValue = baseSalary / monthTotalDays;
  const proportionalBaseSalary = baseDailyValue * workPeriod.workedCalendarDays;
  const absenceSalaryDiscountValue = baseDailyValue * unexcusedAbsenceDays;
  const salaryAfterAbsence = Math.max(0, proportionalBaseSalary - absenceSalaryDiscountValue);
  const mealAllowanceFixed = 0;
  const mealAllowanceDaily = selectedEmployee
    ? Number(selectedEmployee.mealAllowanceDaily || 0)
    : Number(state.payslip.mealAllowanceDaily || 0);
  const fixedDiscountPercent = selectedEmployee
    ? Number(selectedEmployee.fixedDiscountPercent || 0)
    : Number(state.payslip.fixedDiscountPercent || 0);
  const maximumMealAllowanceDays = businessDaysInMonth;
  const mealAllowancePaidDays = workedBusinessDays;
  const mealAllowanceDailyTotal = mealAllowanceDaily * mealAllowancePaidDays;
  const mealAllowanceTotal = mealAllowanceDailyTotal;
  const mealAllowanceCardDiscountPercent = 20;
  const mealAllowanceCardDiscountValue = mealAllowanceTotal * (mealAllowanceCardDiscountPercent / 100);
  const customEarningsTotal = state.payslip.earnings.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const customDiscountsTotal = state.payslip.discounts.reduce((sum, item) => sum + Number(item.value || 0), 0);
  const fixedDiscountValue = salaryAfterAbsence * (fixedDiscountPercent / 100);
  const earningsTotal = proportionalBaseSalary + mealAllowanceDailyTotal + customEarningsTotal;
  const discountsTotal =
    customDiscountsTotal
    + fixedDiscountValue
    + mealAllowanceCardDiscountValue
    + absenceSalaryDiscountValue;
  const netCashValue =
    salaryAfterAbsence
    + customEarningsTotal
    - customDiscountsTotal
    - fixedDiscountValue
    - mealAllowanceCardDiscountValue;
  const totalReceivedValue = netCashValue + mealAllowanceTotal;

  return {
    referenceYear,
    referenceMonth,
    businessDaysInMonth,
    businessDaysByRange,
    monthTotalDays,
    firstWorkDayInMonth: workPeriod.firstDay,
    lastWorkDayInMonth: workPeriod.lastDay,
    firstWorkDateISO: resolvedPeriod.ok ? resolvedPeriod.firstDateISO : toISODateOnly(dateWithClampedDay(referenceYear, referenceMonth - 1, workPeriod.firstDay)),
    lastWorkDateISO: resolvedPeriod.ok ? resolvedPeriod.lastDateISO : toISODateOnly(dateWithClampedDay(referenceYear, referenceMonth - 1, workPeriod.lastDay)),
    workedCalendarDays: workPeriod.workedCalendarDays,
    absenceDays: cappedAbsenceDays,
    allowanceDays: cappedAllowanceDays,
    unexcusedAbsenceDays,
    salaryPaidDays,
    workedBusinessDays,
    vaNotPaidDaysTotal,
    vaNotPaidDaysAboned,
    vaNotPaidDaysUnexcused,
    baseDailyValue,
    proportionalBaseSalary,
    absenceSalaryDiscountValue,
    salaryAfterAbsence,
    mealAllowanceFixed,
    mealAllowanceDaily,
    mealAllowancePaidDays,
    maximumMealAllowanceDays,
    mealAllowanceDailyTotal,
    mealAllowanceTotal,
    mealAllowanceCardDiscountPercent,
    mealAllowanceCardDiscountValue,
    fixedDiscountPercent,
    fixedDiscountValue,
    customEarningsTotal,
    customDiscountsTotal,
    earningsTotal,
    discountsTotal,
    netCashValue,
    totalReceivedValue,
  };
}

function renderPayslipCopy(copyLabel) {
  const totals = calculatePayslipTotals();

  const earningsRows = [
    `<tr><td>Salário base bruto</td><td>${currencyBRL.format(
      Number(state.payslip.baseSalary || 0),
    )}</td></tr>`,
    `<tr><td>Salário proporcional (${totals.workedCalendarDays} dia(s))</td><td>${currencyBRL.format(totals.proportionalBaseSalary)}</td></tr>`,
    totals.mealAllowanceFixed > 0
      ? `<tr><td>Vale alimentação fixo</td><td>${currencyBRL.format(totals.mealAllowanceFixed)}</td></tr>`
      : "",
    totals.mealAllowanceDaily > 0
      ? `<tr><td>VA diário (${totals.mealAllowancePaidDays} dia(s) úteis)</td><td>${currencyBRL.format(totals.mealAllowanceDailyTotal)}</td></tr>`
      : "",
    ...state.payslip.earnings.map(
      (item) =>
        `<tr><td>${escapeHtml(item.description)}</td><td>${currencyBRL.format(
          Number(item.value || 0),
        )}</td></tr>`,
    ),
  ].join("");

  const discountItems = [];
  if (totals.absenceSalaryDiscountValue > 0) {
    discountItems.push(
      `<tr><td>Desconto por falta (${totals.unexcusedAbsenceDays} dia(s))</td><td>${currencyBRL.format(totals.absenceSalaryDiscountValue)}</td></tr>`,
    );
  }
  if (totals.mealAllowanceTotal > 0) {
    discountItems.push(
      `<tr><td>Coparticipação VA (${totals.mealAllowanceCardDiscountPercent}%)</td><td>${currencyBRL.format(totals.mealAllowanceCardDiscountValue)}</td></tr>`,
    );
  }
  if (totals.fixedDiscountPercent > 0) {
    discountItems.push(
      `<tr><td>Desconto fixo (${totals.fixedDiscountPercent}%)</td><td>${currencyBRL.format(totals.fixedDiscountValue)}</td></tr>`,
    );
  }
  state.payslip.discounts.forEach((item) => {
    discountItems.push(
      `<tr><td>${escapeHtml(item.description)}</td><td>${currencyBRL.format(Number(item.value || 0))}</td></tr>`,
    );
  });
  const discountRows = discountItems.join("") || "<tr><td>-</td><td>R$ 0,00</td></tr>";

  return `
    <article class="payslip-copy">
      <div class="payslip-header">
        <div class="payslip-brand">
          <img class="payslip-logo" src="${FIXED_LOGO_PATH}" alt="Logo Vila Marques" />
          <div>
            <div class="payslip-title">CONTRACHEQUE</div>
            <div class="small">${escapeHtml(CONTRACTOR_INFO.companyName)} | CNPJ ${escapeHtml(CONTRACTOR_INFO.cnpj)}</div>
          </div>
        </div>
        <div class="payslip-meta">
          <div><strong>Via:</strong> ${escapeHtml(copyLabel)}</div>
          <div><strong>Competência:</strong> ${escapeHtml(state.payslip.competence || "-")}</div>
          <div><strong>Pagamento:</strong> ${formatDateBR(state.payslip.paymentDate)}</div>
          <div><strong>Forma:</strong> ${escapeHtml(state.payslip.paymentMethod || "-")}</div>
        </div>
      </div>

      <div class="payslip-info">
        <div><strong>Funcionário:</strong> ${escapeHtml(state.payslip.employeeName || "-")}</div>
        <div><strong>CPF:</strong> ${escapeHtml(state.payslip.employeeCpf || "-")}</div>
        <div><strong>Cargo:</strong> ${escapeHtml(state.payslip.position || "-")}</div>
        <div><strong>Matrícula:</strong> ${escapeHtml(state.payslip.registration || "-")}</div>
        <div><strong>Período:</strong> ${formatDateBR(totals.firstWorkDateISO)} a ${formatDateBR(totals.lastWorkDateISO)}</div>
        <div><strong>Dias corridos:</strong> ${escapeHtml(String(totals.workedCalendarDays))} | <strong>Dias úteis:</strong> ${escapeHtml(String(totals.businessDaysInMonth))}</div>
        <div><strong>Faltas:</strong> ${escapeHtml(String(totals.absenceDays))} | <strong>Abonos:</strong> ${escapeHtml(String(totals.allowanceDays))} | <strong>Valor/dia:</strong> ${currencyBRL.format(totals.baseDailyValue)}</div>
        <div><strong>Dias pagos:</strong> Salário ${escapeHtml(String(totals.salaryPaidDays))} | VA ${escapeHtml(String(totals.mealAllowancePaidDays))}</div>
      </div>

      <table class="payslip-table">
        <thead>
          <tr><th>Descrição</th><th>Valor (R$)</th></tr>
        </thead>
        <tbody>${earningsRows}</tbody>
      </table>

      <table class="payslip-table">
        <thead>
          <tr><th>Descrição</th><th>Valor (R$)</th></tr>
        </thead>
        <tbody>${discountRows}</tbody>
      </table>

      <table class="payslip-table">
        <tbody>
          <tr><td><strong>Total de Proventos</strong></td><td><strong>${currencyBRL.format(totals.earningsTotal)}</strong></td></tr>
          <tr><td><strong>Total de Descontos</strong></td><td><strong>${currencyBRL.format(totals.discountsTotal)}</strong></td></tr>
          <tr><td><strong>Salário líquido</strong></td><td><strong>${currencyBRL.format(totals.netCashValue)}</strong></td></tr>
          <tr><td><strong>Crédito VA no cartão</strong></td><td><strong>${currencyBRL.format(totals.mealAllowanceTotal)}</strong></td></tr>
          <tr><td><strong>Total recebido (Salário + VA)</strong></td><td><strong>${currencyBRL.format(totals.totalReceivedValue)}</strong></td></tr>
        </tbody>
      </table>

      <div class="payslip-sign">
        <div class="sign-box">Assinatura do Empregador</div>
        <div class="sign-box">Assinatura do Funcionário</div>
      </div>
    </article>
  `;
}

function renderPayslip() {
  const output = document.getElementById("payslipOutput");
  if (!output) return;

  output.innerHTML = `
    <section class="payslip-sheet">
      ${renderPayslipCopy("Empresa")}
      ${renderPayslipCopy("Funcionário")}
    </section>
  `;
}

function printHtmlContent({ title, bodyClass = "", contentHtml }) {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("aria-hidden", "true");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "0";
  iframe.style.opacity = "0";
  iframe.style.pointerEvents = "none";
  document.body.appendChild(iframe);
  const loadedStylesheetHref = document.getElementById("mainStylesheet")?.href;
  const stylesHref = loadedStylesheetHref || `${window.location.origin}/styles.css`;
  const safeTitle = escapeHtml(title || "Documento");
  const safeBodyClass = String(bodyClass || "").trim();
  const printDocument = iframe.contentDocument;
  if (!printDocument) {
    iframe.remove();
    alert("Não foi possível preparar a impressão.");
    return false;
  }
  printDocument.open();
  printDocument.write(`<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${safeTitle}</title>
    <link rel="stylesheet" href="${stylesHref}" />
  </head>
  <body class="${safeBodyClass}">
    <main class="layout">${contentHtml}</main>
  </body>
</html>`);
  printDocument.close();
  const printWindow = iframe.contentWindow;
  if (!printWindow) {
    iframe.remove();
    alert("Não foi possível abrir a visualização de impressão.");
    return false;
  }
  const cleanup = () => {
    window.setTimeout(() => {
      iframe.remove();
    }, 300);
  };
  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
    cleanup();
  };
  printWindow.onafterprint = cleanup;
  if (printDocument.readyState === "complete") {
    window.setTimeout(triggerPrint, 50);
  } else {
    iframe.addEventListener("load", () => window.setTimeout(triggerPrint, 50), { once: true });
  }
  return true;
}

function waitForAnimationFrames(count = 2) {
  return new Promise((resolve) => {
    const steps = Math.max(1, Number(count || 1));
    let done = 0;
    const next = () => {
      done += 1;
      if (done >= steps) {
        resolve();
        return;
      }
      window.requestAnimationFrame(next);
    };
    window.requestAnimationFrame(next);
  });
}

function waitForImagesInNode(node, timeoutMs = 5000) {
  const container = node instanceof Element ? node : null;
  if (!container) return Promise.resolve();
  const pending = Array.from(container.querySelectorAll("img"))
    .filter((img) => String(img.currentSrc || img.src || "").trim())
    .filter((img) => !img.complete);
  if (!pending.length) return Promise.resolve();

  return Promise.all(
    pending.map((img) => new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };
      img.addEventListener("load", finish, { once: true });
      img.addEventListener("error", finish, { once: true });
      window.setTimeout(finish, timeoutMs);
    })),
  ).then(() => undefined);
}

async function waitForProposalRenderReady(node) {
  await waitForAnimationFrames(2);
  if (document.fonts && typeof document.fonts.ready?.then === "function") {
    try {
      await Promise.race([
        document.fonts.ready,
        new Promise((resolve) => window.setTimeout(resolve, 2500)),
      ]);
    } catch (_error) {
      // Ignora falha de API de fontes e segue.
    }
  }
  await waitForImagesInNode(node, 5000);
  await waitForAnimationFrames(1);
}

function loadExternalScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-external-src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "1") {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error(`Falha ao carregar script: ${src}`)), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.dataset.externalSrc = src;
    script.addEventListener("load", () => {
      script.dataset.loaded = "1";
      resolve();
    }, { once: true });
    script.addEventListener("error", () => reject(new Error(`Falha ao carregar script: ${src}`)), { once: true });
    document.head.appendChild(script);
  });
}

async function ensureHtml2PdfBundle() {
  if (window.html2pdf) return true;
  try {
    await loadExternalScript("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js");
  } catch (_error) {
    return false;
  }
  return Boolean(window.html2pdf);
}

function sanitizeFilenamePart(value, fallback = "sem-dado") {
  const normalized = String(value || "")
    .trim()
    .replace(/[\\/:*?"<>|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!normalized) return fallback;
  return normalized;
}

function formatDateForFileName(isoDate) {
  const value = String(isoDate || "").trim();
  if (!value) {
    const now = new Date();
    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = String(now.getFullYear());
    return `${dd}-${mm}-${yyyy}`;
  }
  const [yyyy, mm, dd] = value.split("-");
  if (yyyy && mm && dd) return `${dd}-${mm}-${yyyy}`;
  return sanitizeFilenamePart(value, "sem-data");
}

function formatMonthYearForFileName(isoDate) {
  const value = String(isoDate || "").trim();
  const [yyyy, mm] = value.split("-");
  if (yyyy && mm) return `${mm}-${yyyy}`;
  const now = new Date();
  return `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getFullYear())}`;
}

async function exportProposalAsPdfFile(proposalDocNode) {
  if (!proposalDocNode) return false;
  const hasLib = await ensureHtml2PdfBundle();
  if (!hasLib || !window.html2pdf) return false;
  await waitForProposalRenderReady(proposalDocNode);
  proposalDocNode.classList.add("proposal-doc-pdf");

  const companyName = sanitizeFilenamePart(state.company?.name || "Sem empresa", "Sem empresa");
  const issueDate = String(state.proposal?.issueDate || "").trim();
  const monthYear = formatMonthYearForFileName(issueDate);
  const contactName = sanitizeFilenamePart(
    state.company?.contact || state.proposal?.recipient || "Sem contato",
    "Sem contato",
  );
  const filename = `Proposta Comercial - ${companyName} - ${monthYear} - A C ${contactName}.pdf`;

  try {
    await window.html2pdf()
      .set({
        margin: [12, 10, 14, 10],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          windowWidth: 1440,
          scrollX: 0,
          scrollY: 0,
        },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .from(proposalDocNode)
      .save();
    return true;
  } catch (_error) {
    return false;
  } finally {
    proposalDocNode.classList.remove("proposal-doc-pdf");
  }
}

async function exportPayslipAsPdfFile(payslipSheetNode) {
  if (!payslipSheetNode) return false;
  const hasLib = await ensureHtml2PdfBundle();
  if (!hasLib || !window.html2pdf) return false;
  await waitForProposalRenderReady(payslipSheetNode);

  payslipSheetNode.classList.add("payslip-sheet-pdf");
  const paymentDate = String(state.payslip?.paymentDate || "").trim();
  const employeeName = sanitizeFilenamePart(state.payslip?.employeeName || "Sem funcionario", "Sem funcionario");
  const dateLabel = formatDateForFileName(paymentDate);
  const filename = `Contracheque - ${employeeName} - ${dateLabel}.pdf`;

  try {
    await window.html2pdf()
      .set({
        margin: [5, 5, 5, 5],
        filename,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, backgroundColor: "#ffffff" },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      })
      .from(payslipSheetNode)
      .save();
    return true;
  } catch (_error) {
    return false;
  } finally {
    payslipSheetNode.classList.remove("payslip-sheet-pdf");
  }
}

function toMonthKey(dateTimeStr) {
  const dt = new Date(dateTimeStr);
  if (Number.isNaN(dt.getTime())) return "Sem data";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function monthLabel(monthKey) {
  if (monthKey === "Sem data") return monthKey;
  const [year, month] = monthKey.split("-");
  const dt = new Date(Number(year), Number(month) - 1, 1);
  return dt.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
}

function monthNameByNumber(monthNumber) {
  return new Date(2000, monthNumber - 1, 1).toLocaleDateString("pt-BR", { month: "long" });
}

function formatYearMonthLabel(referenceMonth) {
  const parsed = parseYearMonthISO(referenceMonth);
  if (!parsed) return "-";
  return `${String(parsed.month).padStart(2, "0")}/${parsed.year}`;
}

function taxRatePercent(grossRevenue, taxPaid) {
  const gross = Number(grossRevenue || 0);
  const paid = Number(taxPaid || 0);
  if (gross <= 0 || paid <= 0) return 0;
  return (paid / gross) * 100;
}

function getTaxBalanceEntryDateISO(record) {
  const paymentDate = parseISODateOnly(String(record?.paymentDateISO || "").trim());
  if (paymentDate) return toISODateOnly(paymentDate);
  const parsedMonth = parseYearMonthISO(record?.referenceMonth);
  if (!parsedMonth) return toISODateOnly(new Date());
  return toISODateOnly(dateWithClampedDay(parsedMonth.year, parsedMonth.month - 1, 15));
}

function upsertTaxBalanceEntry(record) {
  if (!record || !record.id) return;
  const amount = Number(record.taxPaid || 0);
  const referenceLabel = formatYearMonthLabel(record.referenceMonth);
  const linkedIdx = (state.balance.entries || []).findIndex(
    (entry) => String(entry.linkedTaxRecordId || "") === String(record.id),
  );
  if (amount <= 0) {
    if (linkedIdx >= 0) state.balance.entries.splice(linkedIdx, 1);
    return;
  }
  const nextEntry = {
    id: linkedIdx >= 0
      ? String(state.balance.entries[linkedIdx].id || `${Date.now()}-${Math.random().toString(16).slice(2)}`)
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: "expense",
    description: `Impostos do mês ${referenceLabel}`,
    amount,
    dateTime: `${getTaxBalanceEntryDateISO(record)}T12:00`,
    responsible: "Fiscal",
    contractId: "",
    category: "impostos",
    employeeId: "",
    linkedTaxRecordId: String(record.id),
    linkedContractPaymentId: "",
    linkedRentedPropertyPaymentId: "",
  };
  if (linkedIdx >= 0) state.balance.entries[linkedIdx] = nextEntry;
  else state.balance.entries.push(nextEntry);
}

function formatDateTimeBR(value) {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString("pt-BR");
}

function getExpenseCategoryLabel(category) {
  const key = String(category || "").trim().toLowerCase();
  return EXPENSE_CATEGORY_LABELS[key] || "";
}

function resolveExpenseCategory(entry) {
  if (!entry || entry.type !== "expense") return "";
  const explicit = String(entry.category || "").trim().toLowerCase();
  if (explicit && EXPENSE_CATEGORY_LABELS[explicit]) return explicit;
  const text = String(entry.description || "").toLowerCase();
  if (text.includes("combustível") || text.includes("combustivel")) return "combustivel";
  if (text.includes("pedágio") || text.includes("pedagio")) return "pedagios";
  if (text.includes("alimentação") || text.includes("alimentacao")) return "alimentacao";
  if (text.includes("aluguel")) return "aluguel";
  if (text.includes("salário") || text.includes("salario")) return "salario";
  if (text.includes("manutenção") || text.includes("manutencao")) return "manutencao";
  if (text.includes("imposto") || text.includes("tributo")) return "impostos";
  if (text.includes("água") || text.includes("agua")) return "agua";
  if (text.includes("luz")) return "luz";
  if (text.includes("internet")) return "internet";
  return "";
}

function buildExpenseDescription(data) {
  const category = String(data.category || "").trim().toLowerCase();
  const details = String(data.details || "").trim();
  if (category === "combustivel") {
    return details ? `Combustível - ${details}` : "Combustível";
  }
  if (category === "pedagios") {
    return details ? `Pedágios - ${details}` : "Pedágios";
  }
  if (category === "alimentacao") {
    return details ? `Alimentação - ${details}` : "Alimentação";
  }
  if (category === "aluguel") {
    const contractName = getContractDisplayName(data.contractId);
    return details ? `Aluguel - ${contractName} - ${details}` : `Aluguel - ${contractName}`;
  }
  if (category === "salario") {
    const employee = (state.payslipEmployees || []).find((item) => item.id === String(data.employeeId || ""));
    const employeeName = employee ? String(employee.employeeName || "").trim() : "Funcionário";
    return details ? `Salário - ${employeeName} - ${details}` : `Salário - ${employeeName}`;
  }
  if (category === "manutencao") {
    const maintenanceDetails = String(data.maintenanceDetails || "").trim();
    return maintenanceDetails ? `Manutenção - ${maintenanceDetails}` : "Manutenção";
  }
  if (category === "impostos") {
    return details ? `Impostos - ${details}` : "Impostos";
  }
  if (category === "agua") {
    const contractName = getContractDisplayName(data.contractId);
    return details ? `Água - ${contractName} - ${details}` : `Água - ${contractName}`;
  }
  if (category === "luz") {
    const contractName = getContractDisplayName(data.contractId);
    return details ? `Luz - ${contractName} - ${details}` : `Luz - ${contractName}`;
  }
  if (category === "internet") {
    const contractName = getContractDisplayName(data.contractId);
    return details ? `Internet - ${contractName} - ${details}` : `Internet - ${contractName}`;
  }
  if (category === "outros") {
    return details ? `Outros - ${details}` : "Outros";
  }
  return details || "Despesa";
}

function toggleExpenseCategoryFields() {
  const expenseForm = document.getElementById("expenseForm");
  if (!expenseForm) return;
  const category = String(expenseForm.elements.namedItem("category")?.value || "").trim().toLowerCase();
  const contractRow = document.getElementById("expenseContractRow");
  const employeeRow = document.getElementById("expenseEmployeeRow");
  const maintenanceRow = document.getElementById("expenseMaintenanceRow");
  const contractSelect = expenseForm.elements.namedItem("contractId");
  const employeeSelect = expenseForm.elements.namedItem("employeeId");
  const maintenanceInput = expenseForm.elements.namedItem("maintenanceDetails");

  const categoryRequiresContract = ["aluguel", "manutencao", "agua", "luz", "internet"].includes(category);
  const showContract = categoryRequiresContract || category === "outros";
  const showEmployee = category === "salario";
  const showMaintenance = category === "manutencao";

  if (contractRow) contractRow.classList.toggle("auth-hidden", !showContract);
  if (employeeRow) employeeRow.classList.toggle("auth-hidden", !showEmployee);
  if (maintenanceRow) maintenanceRow.classList.toggle("auth-hidden", !showMaintenance);
  if (contractSelect) contractSelect.required = categoryRequiresContract;
  if (employeeSelect) employeeSelect.required = showEmployee;
  if (maintenanceInput) maintenanceInput.required = showMaintenance;

  if (!showContract && contractSelect) contractSelect.value = "";
  if (!showEmployee && employeeSelect) employeeSelect.value = "";
  if (!showMaintenance && maintenanceInput) maintenanceInput.value = "";
}

function isFuelExpense(entry) {
  if (!entry || entry.type !== "expense") return false;
  if (resolveExpenseCategory(entry) === "combustivel") return true;
  const text = String(entry.description || "").toLowerCase();
  const fuelKeywords = [
    "combustivel",
    "combustível",
    "gasolina",
    "diesel",
    "etanol",
    "alcool",
    "álcool",
    "abastecimento",
    "gnv",
  ];
  return fuelKeywords.some((keyword) => text.includes(keyword));
}

function isTollExpense(entry) {
  if (!entry || entry.type !== "expense") return false;
  const text = String(entry.description || "").toLowerCase();
  const tollKeywords = ["pedagio", "pedágio", "sem parar", "conectcar", "tag pedagio"];
  return tollKeywords.some((keyword) => text.includes(keyword));
}

function getMonthDateRange(year, monthNumber) {
  const month = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  const y = Number(year || new Date().getFullYear());
  const start = new Date(y, month - 1, 1);
  const end = new Date(y, month, 0);
  return { start, end };
}

function getDaysInMonth(year, monthNumber) {
  const month = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  const y = Number(year || new Date().getFullYear());
  return new Date(y, month, 0).getDate();
}

function getBusinessDaysInMonth(year, monthNumber) {
  const totalDays = getDaysInMonth(year, monthNumber);
  const y = Number(year || new Date().getFullYear());
  const month = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  let businessDays = 0;
  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(y, month - 1, day);
    const weekDay = date.getDay();
    if (weekDay >= 1 && weekDay <= 5) businessDays += 1;
  }
  return businessDays;
}

function countWeekdaysBetweenDays(year, monthNumber, startDay, endDay) {
  const y = Number(year || new Date().getFullYear());
  const month = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  const start = Math.max(1, Number(startDay || 1));
  const end = Math.max(start, Number(endDay || start));
  let businessDays = 0;
  for (let day = start; day <= end; day += 1) {
    const date = new Date(y, month - 1, day);
    const weekDay = date.getDay();
    if (weekDay >= 1 && weekDay <= 5) businessDays += 1;
  }
  return businessDays;
}

function resolveWorkPeriodInMonth(monthTotalDays, firstWorkDayInMonth, lastWorkDayInMonth) {
  const totalDays = Math.max(1, Number(monthTotalDays || 30));
  const firstDay = Math.max(1, Math.min(totalDays, Number(firstWorkDayInMonth || 1)));
  const lastDayRaw = Number(lastWorkDayInMonth || totalDays);
  const lastDay = Math.max(firstDay, Math.min(totalDays, lastDayRaw));
  const workedCalendarDays = Math.max(0, lastDay - firstDay + 1);
  return {
    firstDay,
    lastDay,
    workedCalendarDays,
  };
}

function resolveWorkPeriodFromDateInputs({
  year,
  monthNumber,
  monthTotalDays,
  firstWorkDateISO,
  lastWorkDateISO,
}) {
  const targetYear = Number(year || new Date().getFullYear());
  const targetMonth = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  const totalDays = Math.max(1, Number(monthTotalDays || getDaysInMonth(targetYear, targetMonth)));
  const firstDate = parseISODateOnly(firstWorkDateISO);
  const lastDate = parseISODateOnly(lastWorkDateISO);
  if (!firstDate || !lastDate) {
    return { ok: false, message: "Informe as datas de início e fim do período trabalhado." };
  }
  if (
    firstDate.getFullYear() !== targetYear
    || firstDate.getMonth() + 1 !== targetMonth
    || lastDate.getFullYear() !== targetYear
    || lastDate.getMonth() + 1 !== targetMonth
  ) {
    return { ok: false, message: "As datas trabalhadas devem estar dentro do mês/ano de referência." };
  }
  const firstDay = firstDate.getDate();
  const lastDay = lastDate.getDate();
  if (firstDay < 1 || firstDay > totalDays) {
    return { ok: false, message: "Data inicial inválida para o mês informado." };
  }
  if (lastDay < firstDay || lastDay > totalDays) {
    return { ok: false, message: "Data final inválida para o mês informado." };
  }
  const period = resolveWorkPeriodInMonth(totalDays, firstDay, lastDay);
  return {
    ok: true,
    firstDay: period.firstDay,
    lastDay: period.lastDay,
    workedCalendarDays: period.workedCalendarDays,
    firstDateISO: toISODateOnly(firstDate),
    lastDateISO: toISODateOnly(lastDate),
    monthTotalDays: totalDays,
  };
}

function getNthBusinessDayDate(year, monthNumber, nthBusinessDay = 5) {
  const totalDays = getDaysInMonth(year, monthNumber);
  const y = Number(year || new Date().getFullYear());
  const month = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  const target = Math.max(1, Number(nthBusinessDay || 1));
  let count = 0;
  for (let day = 1; day <= totalDays; day += 1) {
    const date = new Date(y, month - 1, day);
    const weekDay = date.getDay();
    if (weekDay >= 1 && weekDay <= 5) {
      count += 1;
      if (count === target) return date;
    }
  }
  return new Date(y, month - 1, totalDays);
}

function calculateMonthlySalarySettlement({
  employee,
  year,
  monthNumber,
  monthTotalDays,
  firstWorkDayInMonth,
  lastWorkDayInMonth,
  businessDaysInMonth,
  absenceDays,
  allowanceDays,
}) {
  const baseSalary = Number(employee?.baseSalary || 0);
  const mealAllowanceFixed = 0;
  const mealAllowanceDaily = Number(employee?.mealAllowanceDaily || 0);
  const fixedDiscountPercent = Number(employee?.fixedDiscountPercent || 0);
  const totalDays = Math.max(1, Number(monthTotalDays || getDaysInMonth(year, monthNumber)));
  const workPeriod = resolveWorkPeriodInMonth(totalDays, firstWorkDayInMonth, lastWorkDayInMonth);
  const businessDaysByRange = countWeekdaysBetweenDays(
    year,
    monthNumber,
    workPeriod.firstDay,
    workPeriod.lastDay,
  );
  const businessDaysInput = Math.max(0, Number(businessDaysInMonth || businessDaysByRange));
  const businessDays = Math.min(businessDaysInput, businessDaysByRange);
  const cappedAbsenceDays = Math.min(Math.max(0, Number(absenceDays || 0)), businessDays);
  const cappedAllowanceDays = Math.min(Math.max(0, Number(allowanceDays || 0)), cappedAbsenceDays);
  const unexcusedAbsenceDays = Math.max(0, cappedAbsenceDays - cappedAllowanceDays);
  const workedBusinessDays = Math.max(0, businessDays - cappedAbsenceDays);

  const baseDailyValue = baseSalary / totalDays;
  const proportionalBaseSalary = baseDailyValue * workPeriod.workedCalendarDays;
  const absenceSalaryDiscountValue = baseDailyValue * unexcusedAbsenceDays;
  const salaryAfterAbsence = Math.max(0, proportionalBaseSalary - absenceSalaryDiscountValue);
  const mealAllowanceDailyTotal = mealAllowanceDaily * workedBusinessDays;
  const mealAllowanceTotal = mealAllowanceDailyTotal;
  const mealAllowanceCardDiscountPercent = 20;
  const mealAllowanceCardDiscountValue = mealAllowanceTotal * (mealAllowanceCardDiscountPercent / 100);
  const fixedDiscountValue = salaryAfterAbsence * (fixedDiscountPercent / 100);
  const netCashValue = salaryAfterAbsence - fixedDiscountValue - mealAllowanceCardDiscountValue;
  const totalReceivedValue = netCashValue + mealAllowanceTotal;

  return {
    monthTotalDays: totalDays,
    firstWorkDayInMonth: workPeriod.firstDay,
    lastWorkDayInMonth: workPeriod.lastDay,
    workedCalendarDays: workPeriod.workedCalendarDays,
    businessDaysByRange,
    businessDaysInMonth: businessDays,
    absenceDays: cappedAbsenceDays,
    allowanceDays: cappedAllowanceDays,
    unexcusedAbsenceDays,
    workedBusinessDays,
    baseSalary,
    baseDailyValue,
    proportionalBaseSalary,
    absenceSalaryDiscountValue,
    salaryAfterAbsence,
    mealAllowanceFixed,
    mealAllowanceDaily,
    mealAllowanceDailyTotal,
    mealAllowanceTotal,
    mealAllowanceCardDiscountPercent,
    mealAllowanceCardDiscountValue,
    fixedDiscountPercent,
    fixedDiscountValue,
    netCashValue,
    totalReceivedValue,
  };
}

function isSalaryExpenseEntryForEmployeeInMonth(entry, employee, year, monthNumber) {
  if (!entry || entry.type !== "expense") return false;
  const date = new Date(entry.dateTime);
  if (Number.isNaN(date.getTime())) return false;
  if (date.getFullYear() !== Number(year) || date.getMonth() + 1 !== Number(monthNumber)) return false;
  const category = resolveExpenseCategory(entry);
  if (category !== "salario") return false;
  const employeeId = String(employee?.id || "").trim();
  if (employeeId && String(entry.employeeId || "").trim() === employeeId) return true;
  const employeeName = String(employee?.employeeName || "").trim().toLowerCase();
  if (!employeeName) return false;
  return String(entry.description || "").toLowerCase().includes(employeeName);
}

function hasAnySalaryExpenseInMonth(entries, year, monthNumber) {
  return (entries || []).some((entry) => {
    if (!entry || entry.type !== "expense") return false;
    const date = new Date(entry.dateTime);
    if (Number.isNaN(date.getTime())) return false;
    if (date.getFullYear() !== Number(year) || date.getMonth() + 1 !== Number(monthNumber)) return false;
    return resolveExpenseCategory(entry) === "salario";
  });
}

function sumEntryAmounts(entries, type) {
  return entries
    .filter((entry) => entry.type === type)
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
}

function compareYearMonth(yearA, monthA, yearB, monthB) {
  if (yearA !== yearB) return yearA < yearB ? -1 : 1;
  if (monthA !== monthB) return monthA < monthB ? -1 : 1;
  return 0;
}

function projectContractReceiptDateForMonth(contract, year, monthNumber) {
  const targetYear = Number(year || new Date().getFullYear());
  const targetMonth = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  let projectedDate = parseISODateOnly(getContractNextReceiptDateISO(contract));
  if (!projectedDate) return null;

  const receiptDay = Number(contract?.receiptDay || 15);
  let guard = 0;
  while (guard < 60) {
    const projectedYear = projectedDate.getFullYear();
    const projectedMonth = projectedDate.getMonth() + 1;
    const relation = compareYearMonth(projectedYear, projectedMonth, targetYear, targetMonth);
    if (relation === 0) return projectedDate;
    if (relation > 0) return null;
    projectedDate = addMonthsSafe(projectedDate, 1, receiptDay);
    guard += 1;
  }
  return null;
}

function projectMonthlyDateByBaseForMonth(baseDateISO, year, monthNumber) {
  const targetYear = Number(year || new Date().getFullYear());
  const targetMonth = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  let projectedDate = parseISODateOnly(baseDateISO);
  if (!projectedDate) return null;

  const recurringDay = projectedDate.getDate();
  let guard = 0;
  while (guard < 120) {
    const projectedYear = projectedDate.getFullYear();
    const projectedMonth = projectedDate.getMonth() + 1;
    const relation = compareYearMonth(projectedYear, projectedMonth, targetYear, targetMonth);
    if (relation === 0) return projectedDate;
    if (relation > 0) return null;
    projectedDate = addMonthsSafe(projectedDate, 1, recurringDay);
    guard += 1;
  }
  return null;
}

function buildBalanceMonthlyForecast(year, monthNumber) {
  const month = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  const y = Number(year || new Date().getFullYear());
  const salaryForecastDateISO = toISODateOnly(getNthBusinessDayDate(y, month, 5));
  const hasSalaryPaidInMonth = hasAnySalaryExpenseInMonth(state.balance.entries || [], y, month);
  const effectiveContracts = (state.contractsPortfolio || [])
    .filter((item) => item.isEffective && hasContractContent(item));

  const linkedPropertyIds = new Set();
  const expectedIncomes = [];
  const expectedExpenses = [];

  effectiveContracts.forEach((contract) => {
    const result = calculateContractsResult(contract);
    const contractExpenseDay = Number(contract.receiptDay || 15);
    const contractExpenseDateISO = toISODateOnly(dateWithClampedDay(y, month - 1, contractExpenseDay));
    const projectedReceiptDate = projectContractReceiptDateForMonth(contract, y, month);
    const receiptDateISO = projectedReceiptDate ? toISODateOnly(projectedReceiptDate) : "";
    const contractName = String(contract.contractName || "Sem nome").trim() || "Sem nome";

    if (receiptDateISO) {
      const clientName = getClientById(contract.clientId)?.clientName || "Não informado";
      expectedIncomes.push({
        source: "Contrato efetivado",
        description: `Recebimento do contrato ${contractName}`,
        dateISO: receiptDateISO,
        contractId: String(contract.id || ""),
        clientName: String(clientName || "").trim() || "Não informado",
        amount: Number(result.monthlyRevenue || 0),
      });
    }

    const linkedProperty = getRentedPropertyById(contract.rentedPropertyId);
    const propertyRentAmount = Number(linkedProperty?.rentAmount || 0);
    const contractRentAmount = Number(contract.rentCost || 0);
    const rentAmount = propertyRentAmount > 0 ? propertyRentAmount : contractRentAmount;
    const projectedRentDate = linkedProperty
      ? projectMonthlyDateByBaseForMonth(linkedProperty.nextDueDateISO, y, month)
      : null;
    const rentDateISO = projectedRentDate
      ? toISODateOnly(projectedRentDate)
      : contractExpenseDateISO;
    if (linkedProperty?.id) linkedPropertyIds.add(linkedProperty.id);

    const estimatedItems = [
      { description: `Aluguel - ${contractName}`, amount: rentAmount, dateISO: rentDateISO },
      { description: `Produtos de limpeza - ${contractName}`, amount: Number(contract.cleaningProductsCost || 0), dateISO: contractExpenseDateISO },
      { description: `Pró-labore - ${contractName}`, amount: Number(contract.proLaboreCost || 0), dateISO: contractExpenseDateISO },
      { description: `Água - ${contractName}`, amount: Number(contract.waterCost || 0), dateISO: contractExpenseDateISO },
      { description: `Luz/Energia - ${contractName}`, amount: Number(contract.electricityCost || 0), dateISO: contractExpenseDateISO },
      { description: `Internet - ${contractName}`, amount: Number(contract.internetCost || 0), dateISO: contractExpenseDateISO },
      { description: `Manutenção - ${contractName}`, amount: Number(contract.maintenanceCost || 0), dateISO: contractExpenseDateISO },
      { description: `Imposto sobre faturamento - ${contractName}`, amount: Number(result.monthlyTaxValue || 0), dateISO: contractExpenseDateISO },
    ];
    if (!hasSalaryPaidInMonth) {
      estimatedItems.push({
        description: `Salário (estimado) - ${contractName}`,
        amount: Number(contract.staffCost || 0),
        dateISO: salaryForecastDateISO,
      });
    }

    estimatedItems
      .filter((item) => item.amount > 0 && item.dateISO)
      .forEach((item) => {
        expectedExpenses.push({
          source: "Contrato efetivado",
          type: "Estimativa",
          ...item,
          contractId: String(contract.id || ""),
        });
      });
  });

  (state.rentedProperties || [])
    .filter((property) => !linkedPropertyIds.has(property.id))
    .forEach((property) => {
      const amount = Number(property.rentAmount || 0);
      if (amount <= 0) return;
      const projectedDueDate = projectMonthlyDateByBaseForMonth(property.nextDueDateISO, y, month);
      if (!projectedDueDate) return;
      expectedExpenses.push({
        source: "Imóvel alugado",
        type: "Estimativa",
        description: `Aluguel do imóvel ${String(property.name || "Sem nome").trim() || "Sem nome"} (não vinculado)`,
        amount,
        dateISO: toISODateOnly(projectedDueDate),
        contractId: "",
      });
    });

  (state.taxes.records || []).forEach((record) => {
    const parsed = parseYearMonthISO(record.referenceMonth);
    if (!parsed) return;
    if (parsed.year !== y || parsed.month !== month) return;
    const amount = Number(record.taxPaid || 0);
    if (amount <= 0) return;
    expectedExpenses.push({
      source: "Módulo de Impostos",
      type: "Real informado",
      description: `Impostos do mês ${formatYearMonthLabel(record.referenceMonth)}`,
      amount,
      dateISO: getTaxBalanceEntryDateISO(record),
      contractId: "",
    });
  });
  const estimatedExpensesTotal = expectedExpenses
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const totalExpectedExpenses = estimatedExpensesTotal;
  const totalExpectedIncomes = expectedIncomes.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  return {
    year: y,
    month,
    expectedIncomes,
    expectedExpenses,
    estimatedExpensesTotal,
    totalExpectedExpenses,
    totalExpectedIncomes,
    expectedProfit: totalExpectedIncomes - totalExpectedExpenses,
  };
}

function removeBalanceEntryById(id) {
  const index = state.balance.entries.findIndex((entry) => entry.id === id);
  if (index >= 0) {
    state.balance.entries.splice(index, 1);
    saveState();
    renderBalance();
  }
}

function applyPayslipFormDefaults({ forceReferenceFromPaymentDate = false } = {}) {
  const form = document.getElementById("payslipForm");
  if (!form) return null;
  const referenceMonthInput = form.elements.namedItem("referenceMonth");
  const paymentDateInput = form.elements.namedItem("paymentDate");
  const monthTotalDaysInput = form.elements.namedItem("monthTotalDays");
  const competenceInput = form.elements.namedItem("competence");
  const firstWorkInput = form.elements.namedItem("firstWorkDayInMonth");
  const lastWorkInput = form.elements.namedItem("lastWorkDayInMonth");
  const businessDaysInput = form.elements.namedItem("businessDaysInMonth");
  const reference = forceReferenceFromPaymentDate
    ? inferReferenceYearMonth("", String(paymentDateInput?.value || ""))
    : inferReferenceYearMonth(String(referenceMonthInput?.value || ""), String(paymentDateInput?.value || ""));
  const referenceMonthISO = formatYearMonthISO(reference.year, reference.month);
  const competence = `${String(reference.month).padStart(2, "0")}/${reference.year}`;
  const monthTotalDays = getDaysInMonth(reference.year, reference.month);
  const monthStartISO = toISODateOnly(dateWithClampedDay(reference.year, reference.month - 1, 1));
  const monthEndISO = toISODateOnly(dateWithClampedDay(reference.year, reference.month - 1, monthTotalDays));
  if (referenceMonthInput) referenceMonthInput.value = referenceMonthISO;
  if (competenceInput) competenceInput.value = competence;
  if (monthTotalDaysInput) monthTotalDaysInput.value = String(monthTotalDays);
  if (firstWorkInput) {
    const parsed = parseISODateOnly(String(firstWorkInput.value || ""));
    if (!parsed || parsed.getFullYear() !== reference.year || parsed.getMonth() + 1 !== reference.month) {
      firstWorkInput.value = monthStartISO;
    }
  }
  if (lastWorkInput) {
    const parsed = parseISODateOnly(String(lastWorkInput.value || ""));
    if (!parsed || parsed.getFullYear() !== reference.year || parsed.getMonth() + 1 !== reference.month) {
      lastWorkInput.value = monthEndISO;
    }
  }
  const firstDay = parseISODateOnly(String(firstWorkInput?.value || monthStartISO))?.getDate() || 1;
  const lastDay = parseISODateOnly(String(lastWorkInput?.value || monthEndISO))?.getDate() || monthTotalDays;
  const businessDays = countWeekdaysBetweenDays(reference.year, reference.month, firstDay, lastDay);
  if (businessDaysInput) businessDaysInput.value = String(businessDays);
  return {
    referenceYear: reference.year,
    referenceMonth: reference.month,
    referenceMonthISO,
    competence,
    monthTotalDays,
    firstWorkDateISO: String(firstWorkInput?.value || monthStartISO),
    lastWorkDateISO: String(lastWorkInput?.value || monthEndISO),
    businessDays,
  };
}

function applySalaryPaymentFormDefaults({ forceReferenceFromPaymentDate = false } = {}) {
  const form = document.getElementById("salaryPaymentForm");
  if (!form) return;
  const referenceMonthInput = form.elements.namedItem("referenceMonth");
  const monthDaysInput = form.elements.namedItem("monthTotalDays");
  const firstDayInput = form.elements.namedItem("firstWorkDayInMonth");
  const lastDayInput = form.elements.namedItem("lastWorkDayInMonth");
  const businessDaysInput = form.elements.namedItem("businessDaysInMonth");
  const paymentDateInput = form.elements.namedItem("paymentDateISO");
  if (paymentDateInput && !paymentDateInput.value) {
    paymentDateInput.value = toISODateOnly(getNthBusinessDayDate(uiState.balanceYear, uiState.balanceMonth, 5));
  }
  const reference = forceReferenceFromPaymentDate
    ? inferReferenceYearMonth("", String(paymentDateInput?.value || ""))
    : inferReferenceYearMonth(String(referenceMonthInput?.value || ""), String(paymentDateInput?.value || ""));
  const referenceMonthISO = formatYearMonthISO(reference.year, reference.month);
  const monthDays = getDaysInMonth(reference.year, reference.month);
  if (referenceMonthInput) referenceMonthInput.value = referenceMonthISO;
  if (monthDaysInput) monthDaysInput.value = String(monthDays);
  const monthStartISO = toISODateOnly(dateWithClampedDay(reference.year, reference.month - 1, 1));
  const monthEndISO = toISODateOnly(dateWithClampedDay(reference.year, reference.month - 1, monthDays));

  if (firstDayInput) {
    const parsed = parseISODateOnly(String(firstDayInput.value || ""));
    if (!parsed || parsed.getFullYear() !== reference.year || parsed.getMonth() + 1 !== reference.month) {
      firstDayInput.value = monthStartISO;
    }
  }
  if (lastDayInput) {
    const parsed = parseISODateOnly(String(lastDayInput.value || ""));
    if (!parsed || parsed.getFullYear() !== reference.year || parsed.getMonth() + 1 !== reference.month) {
      lastDayInput.value = monthEndISO;
    }
  }
  if (businessDaysInput) {
    const firstDay = parseISODateOnly(String(firstDayInput?.value || monthStartISO))?.getDate() || 1;
    const lastDay = parseISODateOnly(String(lastDayInput?.value || monthEndISO))?.getDate() || monthDays;
    const businessDays = countWeekdaysBetweenDays(reference.year, reference.month, firstDay, lastDay);
    businessDaysInput.value = String(businessDays);
  }
  const absenceInput = form.elements.namedItem("absenceDays");
  const allowanceInput = form.elements.namedItem("allowanceDays");
  const absenceJustificationInput = form.elements.namedItem("absenceJustification");
  const allowanceJustificationInput = form.elements.namedItem("allowanceJustification");
  const absenceDays = Math.max(0, Number(absenceInput?.value || 0));
  const allowanceDays = Math.max(0, Number(allowanceInput?.value || 0));
  if (absenceJustificationInput) {
    absenceJustificationInput.required = absenceDays > 0;
    if (absenceDays <= 0) absenceJustificationInput.value = "";
  }
  if (allowanceJustificationInput) {
    allowanceJustificationInput.required = allowanceDays > 0;
    if (allowanceDays <= 0) allowanceJustificationInput.value = "";
  }
}

function renderSalaryPaymentPreview() {
  const form = document.getElementById("salaryPaymentForm");
  const preview = document.getElementById("salaryPaymentPreview");
  if (!form || !preview) return;

  const data = formToObject(form);
  const employeeId = String(data.employeeId || "").trim();
  const employee = (state.payslipEmployees || []).find((item) => item.id === employeeId);
  if (!employee) {
    preview.innerHTML = "Selecione um funcionário para visualizar o cálculo do pagamento mensal.";
    return;
  }

  const reference = inferReferenceYearMonth(data.referenceMonth, data.paymentDateISO);
  const monthTotalDays = getDaysInMonth(reference.year, reference.month);
  const monthDaysInput = form.elements.namedItem("monthTotalDays");
  if (monthDaysInput) monthDaysInput.value = String(monthTotalDays);
  const period = resolveWorkPeriodFromDateInputs({
    year: reference.year,
    monthNumber: reference.month,
    monthTotalDays,
    firstWorkDateISO: data.firstWorkDayInMonth,
    lastWorkDateISO: data.lastWorkDayInMonth,
  });
  if (!period.ok) {
    preview.innerHTML = period.message;
    return;
  }
  const businessDaysByRange = countWeekdaysBetweenDays(
    reference.year,
    reference.month,
    period.firstDay,
    period.lastDay,
  );
  const businessDaysInput = form.elements.namedItem("businessDaysInMonth");
  if (businessDaysInput) {
    businessDaysInput.value = String(businessDaysByRange);
    data.businessDaysInMonth = String(businessDaysByRange);
  }

  const settlement = calculateMonthlySalarySettlement({
    employee,
    year: reference.year,
    monthNumber: reference.month,
    monthTotalDays,
    firstWorkDayInMonth: period.firstDay,
    lastWorkDayInMonth: period.lastDay,
    businessDaysInMonth: businessDaysByRange,
    absenceDays: Number(data.absenceDays || 0),
    allowanceDays: Number(data.allowanceDays || 0),
  });

  preview.innerHTML = `
    <strong>Prévia (${escapeHtml(monthNameByNumber(reference.month))}/${reference.year})</strong><br />
    Salário base: ${currencyBRL.format(settlement.baseSalary)} | Salário após faltas: ${currencyBRL.format(settlement.salaryAfterAbsence)}<br />
    VA total (cartão): ${currencyBRL.format(settlement.mealAllowanceTotal)} | Coparticipação VA (${settlement.mealAllowanceCardDiscountPercent}%): ${currencyBRL.format(settlement.mealAllowanceCardDiscountValue)}<br />
    Salário líquido: ${currencyBRL.format(settlement.netCashValue)} | Custo total recebido no mês: <strong>${currencyBRL.format(settlement.totalReceivedValue)}</strong>
  `;
}

function renderBalance() {
  const summaryContainer = document.getElementById("balanceSummary");
  const contractSummaryContainer = document.getElementById("balanceContractSummary");
  const byResponsibleContainer = document.getElementById("balanceByResponsible");
  const monthlyContainer = document.getElementById("balanceMonthly");
  const forecastContainer = document.getElementById("balanceForecast");
  const yearSelect = document.getElementById("balanceYearSelect");
  const monthSelect = document.getElementById("balanceMonthSelect");
  const contractSelect = document.getElementById("balanceContractSelect");
  const expenseContractSelect = document.getElementById("expenseContractSelect");
  const expenseEmployeeSelect = document.getElementById("expenseEmployeeSelect");
  const salaryPaymentEmployeeSelect = document.getElementById("salaryPaymentEmployeeSelect");
  const monthFilter = document.getElementById("balanceMonthFilter");
  const btnMonthly = document.getElementById("btnBalanceMonthly");
  const btnYearly = document.getElementById("btnBalanceYearly");
  if (!summaryContainer || !contractSummaryContainer || !byResponsibleContainer || !monthlyContainer || !forecastContainer) return;

  const entries = [...state.balance.entries].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime(),
  );

  const years = Array.from(
    new Set(
      entries
        .map((entry) => new Date(entry.dateTime).getFullYear())
        .filter((year) => Number.isFinite(year)),
    ),
  ).sort((a, b) => b - a);

  if (!years.length) years.push(new Date().getFullYear());
  if (!years.includes(uiState.balanceYear)) uiState.balanceYear = years[0];

  yearSelect.innerHTML = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");
  yearSelect.value = String(uiState.balanceYear);
  monthSelect.value = String(uiState.balanceMonth);
  const contractsForBalance = [...(state.contractsPortfolio || [])]
    .filter((item) => hasContractContent(item))
    .sort((a, b) => String(a.contractName || "").localeCompare(String(b.contractName || ""), "pt-BR"));
  const contractOptions = contractsForBalance
    .map((item) => `<option value="${escapeHtml(item.id)}">${escapeHtml(item.contractName || "Sem nome")}</option>`)
    .join("");
  if (contractSelect) {
    contractSelect.innerHTML = `<option value="">Geral (todos)</option>${contractOptions}`;
    const activeBalanceContractId = String(uiState.balanceContractId || "");
    const contractExists = contractsForBalance.some((item) => item.id === activeBalanceContractId);
    if (!contractExists) uiState.balanceContractId = "";
    contractSelect.value = String(uiState.balanceContractId || "");
  }
  if (expenseContractSelect) {
    const currentValue = String(expenseContractSelect.value || "");
    expenseContractSelect.innerHTML = `<option value="">Sem contrato (geral)</option>${contractOptions}`;
    if ([...(state.contractsPortfolio || [])].some((item) => item.id === currentValue)) {
      expenseContractSelect.value = currentValue;
    }
  }
  if (expenseEmployeeSelect) {
    const employeeOptions = [...(state.payslipEmployees || [])]
      .sort((a, b) => String(a.employeeName || "").localeCompare(String(b.employeeName || ""), "pt-BR"))
      .map((employee) => `<option value="${escapeHtml(employee.id)}">${escapeHtml(employee.employeeName || "Sem nome")}</option>`)
      .join("");
    const currentEmployeeId = String(expenseEmployeeSelect.value || "");
    expenseEmployeeSelect.innerHTML = `<option value="">Selecionar funcionário</option>${employeeOptions}`;
    if ((state.payslipEmployees || []).some((employee) => employee.id === currentEmployeeId)) {
      expenseEmployeeSelect.value = currentEmployeeId;
    }
    if (salaryPaymentEmployeeSelect) {
      const currentSalaryEmployeeId = String(salaryPaymentEmployeeSelect.value || "");
      salaryPaymentEmployeeSelect.innerHTML = `<option value="">Selecionar funcionário</option>${employeeOptions}`;
      if ((state.payslipEmployees || []).some((employee) => employee.id === currentSalaryEmployeeId)) {
        salaryPaymentEmployeeSelect.value = currentSalaryEmployeeId;
      }
    }
  }
  toggleExpenseCategoryFields();
  applySalaryPaymentFormDefaults();
  renderSalaryPaymentPreview();

  btnMonthly.classList.toggle("btn-primary", uiState.balanceMode === "monthly");
  btnYearly.classList.toggle("btn-primary", uiState.balanceMode === "yearly");
  monthFilter.style.display = uiState.balanceMode === "monthly" ? "" : "none";

  const entriesInYear = entries.filter(
    (entry) => new Date(entry.dateTime).getFullYear() === uiState.balanceYear,
  );
  const monthlyEntriesForForecast = entriesInYear.filter(
    (entry) => new Date(entry.dateTime).getMonth() + 1 === uiState.balanceMonth,
  );

  const scopedEntries =
    uiState.balanceMode === "monthly"
      ? monthlyEntriesForForecast
      : entriesInYear;

  const totalIncome = scopedEntries
    .filter((entry) => entry.type === "income")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalExpense = scopedEntries
    .filter((entry) => entry.type === "expense")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalFuelExpense = scopedEntries
    .filter((entry) => isFuelExpense(entry))
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalTollExpense = scopedEntries
    .filter((entry) => isTollExpense(entry))
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalTaxExpense = scopedEntries
    .filter((entry) => resolveExpenseCategory(entry) === "impostos")
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
  const totalProfit = totalIncome - totalExpense;

  const summaryTitle =
    uiState.balanceMode === "monthly"
      ? `${monthNameByNumber(uiState.balanceMonth)} de ${uiState.balanceYear}`
      : `Ano de ${uiState.balanceYear}`;

  const monthRange = getMonthDateRange(uiState.balanceYear, uiState.balanceMonth);
  const forecast = buildBalanceMonthlyForecast(uiState.balanceYear, uiState.balanceMonth);
  const confirmedIncomeInMonth = sumEntryAmounts(monthlyEntriesForForecast, "income");
  const confirmedExpenseInMonth = sumEntryAmounts(monthlyEntriesForForecast, "expense");

  const forecastExpenseRows = forecast.expectedExpenses.length
    ? forecast.expectedExpenses
      .sort((a, b) => String(a.dateISO || "").localeCompare(String(b.dateISO || "")))
      .map((item) => `
        <tr>
          <td>${escapeHtml(item.type)}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>${formatDateBR(item.dateISO)}</td>
          <td>${escapeHtml(getContractDisplayName(item.contractId))}</td>
          <td class="balance-expense">${currencyBRL.format(Number(item.amount || 0))}</td>
        </tr>
      `)
      .join("")
    : '<tr><td colspan="5" class="small">Sem despesas previstas automáticas para este mês.</td></tr>';

  const forecastIncomeRows = forecast.expectedIncomes.length
    ? forecast.expectedIncomes
      .sort((a, b) => String(a.dateISO || "").localeCompare(String(b.dateISO || "")))
      .map((item) => `
        <tr>
          <td>${escapeHtml(item.clientName || "Não informado")}</td>
          <td>${escapeHtml(item.description)}</td>
          <td>${formatDateBR(item.dateISO)}</td>
          <td>${escapeHtml(getContractDisplayName(item.contractId))}</td>
          <td class="balance-income">${currencyBRL.format(Number(item.amount || 0))}</td>
        </tr>
      `)
      .join("")
    : '<tr><td colspan="4" class="small">Sem recebimentos previstos automáticos para este mês.</td></tr>';

  forecastContainer.innerHTML = `
    <article class="yearly-overview">
      <h4>Previsão do Mês (${escapeHtml(monthNameByNumber(uiState.balanceMonth))} de ${uiState.balanceYear})</h4>
      <div class="small balance-forecast-note">
        Período do calendário real: ${formatDateBR(toISODateOnly(monthRange.start))} a ${formatDateBR(toISODateOnly(monthRange.end))}.<br />
        Todos os custos previstos (incluindo salário, aluguel, limpeza, água, luz/energia, internet e manutenção) são <strong>estimativas</strong>.<br />
        Salários previstos de contrato usam referência no <strong>5º dia útil</strong> do mês selecionado.<br />
        Um custo/recebimento só é considerado <strong>confirmado</strong> quando estiver pago e lançado no balanço.
      </div>
      <div class="balance-summary-grid" style="padding: 10px;">
        <div class="balance-summary-card"><div class="label">Recebimentos previstos</div><div class="value balance-income">${currencyBRL.format(forecast.totalExpectedIncomes)}</div></div>
        <div class="balance-summary-card"><div class="label">Gastos previstos (estimativa)</div><div class="value balance-expense">${currencyBRL.format(forecast.estimatedExpensesTotal)}</div></div>
        <div class="balance-summary-card"><div class="label">Total de gastos previstos</div><div class="value balance-expense">${currencyBRL.format(forecast.totalExpectedExpenses)}</div></div>
        <div class="balance-summary-card"><div class="label">Resultado previsto</div><div class="value ${forecast.expectedProfit >= 0 ? "balance-income" : "balance-expense"}">${currencyBRL.format(forecast.expectedProfit)}</div></div>
        <div class="balance-summary-card"><div class="label">Confirmado no balanço (mês)</div><div class="value">${currencyBRL.format(confirmedIncomeInMonth - confirmedExpenseInMonth)}</div></div>
      </div>
      <div class="balance-summary-grid" style="padding: 0 10px 10px;">
        <div class="balance-summary-card"><div class="label">Recebimentos confirmados (mês)</div><div class="value balance-income">${currencyBRL.format(confirmedIncomeInMonth)}</div></div>
        <div class="balance-summary-card"><div class="label">Gastos confirmados (mês)</div><div class="value balance-expense">${currencyBRL.format(confirmedExpenseInMonth)}</div></div>
      </div>
      <table class="balance-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Despesa prevista</th>
            <th>Data prevista</th>
            <th>Contrato</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>${forecastExpenseRows}</tbody>
      </table>
      <table class="balance-table" style="margin-top: 10px;">
        <thead>
          <tr>
            <th>Empresa (cliente)</th>
            <th>Recebimento previsto</th>
            <th>Data prevista</th>
            <th>Contrato</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>${forecastIncomeRows}</tbody>
      </table>
    </article>
  `;

  const contractScopedEntries = uiState.balanceContractId
    ? scopedEntries.filter((entry) => String(entry.contractId || "") === uiState.balanceContractId)
    : [];

  const expensesByResponsible = scopedEntries
    .filter((entry) => entry.type === "expense")
    .reduce((acc, entry) => {
      const key = String(entry.responsible || "Não informado").trim() || "Não informado";
      acc[key] = (acc[key] || 0) + Number(entry.amount || 0);
      return acc;
    }, {});

  const expensesByResponsibleRows = Object.entries(expensesByResponsible)
    .sort((a, b) => b[1] - a[1])
    .map(
      ([responsible, amount]) => `
        <tr>
          <td>${escapeHtml(responsible)}</td>
          <td class="balance-expense">${currencyBRL.format(amount)}</td>
        </tr>
      `,
    )
    .join("");

  summaryContainer.innerHTML = `
    <div class="small">Resumo de ${escapeHtml(summaryTitle)}</div>
    <div class="balance-summary-grid">
      <div class="balance-summary-card"><div class="label">Entradas Totais</div><div class="value balance-income">${currencyBRL.format(totalIncome)}</div></div>
      <div class="balance-summary-card"><div class="label">Despesas Totais</div><div class="value balance-expense">${currencyBRL.format(totalExpense)}</div></div>
      <div class="balance-summary-card"><div class="label">Combustível</div><div class="value balance-expense">${currencyBRL.format(totalFuelExpense)}</div></div>
      <div class="balance-summary-card"><div class="label">Pedágios</div><div class="value balance-expense">${currencyBRL.format(totalTollExpense)}</div></div>
      <div class="balance-summary-card"><div class="label">Impostos</div><div class="value balance-expense">${currencyBRL.format(totalTaxExpense)}</div></div>
      <div class="balance-summary-card"><div class="label">Lucro</div><div class="value">${currencyBRL.format(totalProfit)}</div></div>
    </div>
  `;

  byResponsibleContainer.innerHTML = expensesByResponsibleRows
    ? `
      <article class="yearly-overview">
        <h4>Comparativo de Gastos por Responsável (${escapeHtml(summaryTitle)})</h4>
        <table class="balance-table">
          <thead>
            <tr>
              <th>Responsável</th>
              <th>Total de despesas</th>
            </tr>
          </thead>
          <tbody>${expensesByResponsibleRows}</tbody>
        </table>
      </article>
    `
    : '<div class="small">Sem despesas no período para comparar responsáveis.</div>';

  if (!uiState.balanceContractId) {
    contractSummaryContainer.innerHTML = '<div class="small">Selecione um contrato no dropdown para ver o balanço específico dele.</div>';
  } else if (!contractScopedEntries.length) {
    contractSummaryContainer.innerHTML = `<div class="small">Sem lançamentos para o contrato "${escapeHtml(getContractDisplayName(uiState.balanceContractId))}" neste período.</div>`;
  } else {
    const contractIncome = contractScopedEntries
      .filter((entry) => entry.type === "income")
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const contractExpense = contractScopedEntries
      .filter((entry) => entry.type === "expense")
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const contractFuel = contractScopedEntries
      .filter((entry) => isFuelExpense(entry))
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const contractToll = contractScopedEntries
      .filter((entry) => isTollExpense(entry))
      .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);
    const contractProfit = contractIncome - contractExpense;
    const contractRows = contractScopedEntries
      .map((entry) => {
        const typeLabel = entry.type === "income" ? "Entrada" : "Despesa";
        const typeClass = entry.type === "income" ? "balance-income" : "balance-expense";
        return `
          <tr>
            <td>${typeLabel}</td>
            <td>${escapeHtml(entry.description)}</td>
            <td>${formatDateTimeBR(entry.dateTime)}</td>
            <td>${escapeHtml(entry.responsible || "-")}</td>
            <td class="${typeClass}">${currencyBRL.format(Number(entry.amount || 0))}</td>
          </tr>
        `;
      })
      .join("");

    contractSummaryContainer.innerHTML = `
      <article class="yearly-overview">
        <h4>Balanço do Contrato: ${escapeHtml(getContractDisplayName(uiState.balanceContractId))}</h4>
        <div class="balance-summary-grid" style="padding: 10px;">
          <div class="balance-summary-card"><div class="label">Entradas</div><div class="value balance-income">${currencyBRL.format(contractIncome)}</div></div>
          <div class="balance-summary-card"><div class="label">Despesas</div><div class="value balance-expense">${currencyBRL.format(contractExpense)}</div></div>
          <div class="balance-summary-card"><div class="label">Combustível</div><div class="value balance-expense">${currencyBRL.format(contractFuel)}</div></div>
          <div class="balance-summary-card"><div class="label">Pedágios</div><div class="value balance-expense">${currencyBRL.format(contractToll)}</div></div>
          <div class="balance-summary-card"><div class="label">Lucro</div><div class="value">${currencyBRL.format(contractProfit)}</div></div>
        </div>
        <table class="balance-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Descrição</th>
              <th>Dia e horário</th>
              <th>Responsável</th>
              <th>Valor</th>
            </tr>
          </thead>
          <tbody>${contractRows}</tbody>
        </table>
      </article>
    `;
  }

  if (!scopedEntries.length) {
    monthlyContainer.innerHTML = '<div class="small">Nenhum lançamento cadastrado ainda.</div>';
    return;
  }

  if (uiState.balanceMode === "monthly") {
    const rows = scopedEntries
        .map((entry) => {
          const typeLabel = entry.type === "income" ? "Entrada" : "Despesa";
          const typeClass = entry.type === "income" ? "balance-income" : "balance-expense";
          const fuelTag = isFuelExpense(entry) ? '<span class="small"> (Combustível)</span>' : "";
          const tollTag = isTollExpense(entry) ? '<span class="small"> (Pedágio)</span>' : "";
          const categoryTagLabel = getExpenseCategoryLabel(resolveExpenseCategory(entry));
          const categoryTag = categoryTagLabel ? `<span class="small"> (${escapeHtml(categoryTagLabel)})</span>` : "";
          const responsible = entry.type === "expense" ? escapeHtml(entry.responsible || "-") : "-";
          return `
            <tr>
              <td>${typeLabel}</td>
              <td>${escapeHtml(entry.description)}${fuelTag}${tollTag}${categoryTag}</td>
              <td>${formatDateTimeBR(entry.dateTime)}</td>
              <td>${escapeHtml(getContractDisplayName(entry.contractId))}</td>
              <td>${responsible}</td>
              <td class="${typeClass}">${currencyBRL.format(entry.amount)}</td>
              <td><button type="button" class="btn btn-danger btn-remove-balance" data-balance-id="${escapeHtml(entry.id)}">Remover</button></td>
            </tr>
          `;
        })
        .join("");

    monthlyContainer.innerHTML = `
        <article class="month-card">
          <div class="month-header">
            <div class="month-title">${escapeHtml(summaryTitle)}</div>
            <div class="month-profit">Lucro do mês: ${currencyBRL.format(totalProfit)}</div>
          </div>
          <table class="balance-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Descrição</th>
                <th>Dia e horário</th>
                <th>Contrato</th>
                <th>Responsável</th>
                <th>Valor</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </article>
      `;
  } else {
    const monthBuckets = Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
      const monthEntries = entriesInYear.filter(
        (entry) => new Date(entry.dateTime).getMonth() + 1 === month,
      );
      const income = monthEntries
        .filter((entry) => entry.type === "income")
        .reduce((sum, entry) => sum + entry.amount, 0);
      const expense = monthEntries
        .filter((entry) => entry.type === "expense")
        .reduce((sum, entry) => sum + entry.amount, 0);
      const fuelExpense = monthEntries
        .filter((entry) => isFuelExpense(entry))
        .reduce((sum, entry) => sum + entry.amount, 0);
      const tollExpense = monthEntries
        .filter((entry) => isTollExpense(entry))
        .reduce((sum, entry) => sum + entry.amount, 0);
      return {
        month,
        income,
        expense,
        fuelExpense,
        tollExpense,
        profit: income - expense,
      };
    });

    const yearlyRows = monthBuckets
      .map(
        (bucket) => `
          <tr>
            <td>${monthNameByNumber(bucket.month)}</td>
            <td class="balance-income">${currencyBRL.format(bucket.income)}</td>
            <td class="balance-expense">${currencyBRL.format(bucket.expense)}</td>
            <td class="balance-expense">${currencyBRL.format(bucket.fuelExpense)}</td>
            <td class="balance-expense">${currencyBRL.format(bucket.tollExpense)}</td>
            <td>${currencyBRL.format(bucket.profit)}</td>
          </tr>
        `,
      )
      .join("");

    monthlyContainer.innerHTML = `
      <article class="yearly-overview">
        <h4>Panorama Anual ${uiState.balanceYear}</h4>
        <table class="balance-table">
          <thead>
            <tr>
              <th>Mês</th>
              <th>Entradas</th>
              <th>Despesas</th>
              <th>Combustível</th>
              <th>Pedágios</th>
              <th>Lucro</th>
            </tr>
          </thead>
          <tbody>${yearlyRows}</tbody>
        </table>
      </article>
    `;
  }

  document.querySelectorAll(".btn-remove-balance").forEach((button) => {
    button.addEventListener("click", () => {
      removeBalanceEntryById(button.getAttribute("data-balance-id"));
    });
  });
}

function renderSavedPayslipEmployees() {
  const select = document.getElementById("savedPayslipEmployeeSelect");
  if (!select) return;

  const options = (state.payslipEmployees || [])
    .map((employee) => {
      const label = `${employee.employeeName}${employee.employeeCpf ? ` - ${employee.employeeCpf}` : ""}${employee.position ? ` (${employee.position})` : ""}`;
      return `<option value="${escapeHtml(employee.id)}">${escapeHtml(label)}</option>`;
    })
    .join("");

  select.innerHTML = `<option value="">Selecionar funcionário salvo</option>${options}`;
  select.value = String(state.payslip.selectedEmployeeId || "");
}

function loadSavedPayslipEmployee(employeeId) {
  const employee = state.payslipEmployees.find((item) => item.id === employeeId);
  if (!employee) return;
  state.payslip = {
    ...state.payslip,
    selectedEmployeeId: employee.id,
    employeeName: employee.employeeName,
    employeeCpf: employee.employeeCpf,
    position: employee.position,
    registration: employee.registration,
    baseSalary: employee.baseSalary,
    mealAllowanceFixed: String(Number(employee.mealAllowanceFixed || 0)),
    mealAllowanceDaily: String(Number(employee.mealAllowanceDaily || 0)),
    fixedDiscountPercent: String(Number(employee.fixedDiscountPercent || 0)),
  };
  saveState();
  renderAll();
}

function resetEmployeeCatalogForm() {
  const form = document.getElementById("employeeCatalogForm");
  if (!form) return;
  form.reset();
  uiState.editingEmployeeId = "";
  uiState.pendingEmployeeDocuments = [];
  const cpfInput = form.elements.namedItem("employeeCpf");
  if (cpfInput) cpfInput.value = "";
  form.querySelectorAll("input[data-brl]").forEach((input) => {
    input.value = "R$ 0,00";
  });
  const fixedDiscountInput = form.elements.namedItem("fixedDiscountPercent");
  if (fixedDiscountInput) fixedDiscountInput.value = "0";
  const docsInput = document.getElementById("employeeDocsInput");
  if (docsInput) docsInput.value = "";
  renderPendingEmployeeDocuments();
}

function setEmployeeCatalogForm(employee) {
  const form = document.getElementById("employeeCatalogForm");
  if (!form || !employee) return;
  uiState.editingEmployeeId = String(employee.id || "");
  setFormValues(form, {
    employeeName: employee.employeeName || "",
    employeeCpf: employee.employeeCpf || "",
    position: employee.position || "",
    registration: employee.registration || "",
    baseSalary: formatBRLInputValue(employee.baseSalary || 0),
    mealAllowanceFixed: formatBRLInputValue(employee.mealAllowanceFixed || 0),
    mealAllowanceDaily: formatBRLInputValue(employee.mealAllowanceDaily || 0),
    fixedDiscountPercent: employee.fixedDiscountPercent || "0",
  });
  uiState.pendingEmployeeDocuments = JSON.parse(JSON.stringify(employee.documents || []));
  renderPendingEmployeeDocuments();
  setupBRLInputs(form);
}

function renderPendingEmployeeDocuments() {
  const container = document.getElementById("employeePendingDocsList");
  if (!container) return;
  const docs = uiState.pendingEmployeeDocuments || [];
  if (!docs.length) {
    container.innerHTML = '<li><span class="small">Nenhum documento anexado.</span></li>';
    return;
  }

  container.innerHTML = "";
  docs.forEach((doc) => {
    const li = document.createElement("li");
    li.innerHTML = `<span><strong>${escapeHtml(doc.name)}</strong> <span class="small">(${escapeHtml(formatFileSize(doc.size))})</span></span>`;
    const actions = document.createElement("div");
    actions.className = "exports-actions";

    const btnDownload = document.createElement("button");
    btnDownload.type = "button";
    btnDownload.className = "btn";
    btnDownload.textContent = "Baixar";
    btnDownload.addEventListener("click", () => {
      fetch(doc.dataUrl)
        .then((response) => response.blob())
        .then((blob) => downloadBlob(doc.name, blob));
    });

    const btnRemove = document.createElement("button");
    btnRemove.type = "button";
    btnRemove.className = "btn btn-danger";
    btnRemove.textContent = "Remover";
    btnRemove.addEventListener("click", () => {
      uiState.pendingEmployeeDocuments = docs.filter((item) => item.id !== doc.id);
      renderPendingEmployeeDocuments();
    });

    actions.appendChild(btnDownload);
    actions.appendChild(btnRemove);
    li.appendChild(actions);
    container.appendChild(li);
  });
}

function exportEmployeesCsv() {
  const employees = [...(state.payslipEmployees || [])].sort((a, b) =>
    a.employeeName.localeCompare(b.employeeName, "pt-BR"),
  );
  const headers = [
    "Nome",
    "CPF",
    "Cargo",
    "Matrícula",
    "Salário Base",
    "VA Fixo",
    "VA Diário",
    "Desconto Fixo (%)",
    "Qtd. Anexos",
  ];
  const rows = employees.map((employee) => [
    employee.employeeName,
    employee.employeeCpf || "",
    employee.position || "",
    employee.registration || "",
    Number(employee.baseSalary || 0).toFixed(2),
    Number(employee.mealAllowanceFixed || 0).toFixed(2),
    Number(employee.mealAllowanceDaily || 0).toFixed(2),
    String(employee.fixedDiscountPercent || "0"),
    String((employee.documents || []).length),
  ]);

  const csvEscape = (value) => `"${String(value || "").replaceAll('"', '""')}"`;
  const csv = [headers, ...rows].map((row) => row.map(csvEscape).join(";")).join("\n");
  downloadTextFile("funcionarios-vila-marques.csv", `\uFEFF${csv}`, "text/csv;charset=utf-8");
}

function exportEmployeeJson(employee) {
  const payload = {
    id: employee.id,
    nome: employee.employeeName,
    cpf: employee.employeeCpf || "",
    cargo: employee.position || "",
    matricula: employee.registration || "",
    salarioBase: Number(employee.baseSalary || 0),
    valeAlimentacaoFixo: Number(employee.mealAllowanceFixed || 0),
    valeAlimentacaoDiario: Number(employee.mealAllowanceDaily || 0),
    descontoFixoPercentual: Number(employee.fixedDiscountPercent || 0),
    historicoPagamentos: (employee.salaryHistory || []).map((item) => ({
      id: item.id,
      pagoEm: item.paymentDateISO,
      referenciaAno: item.referenceYear,
      referenciaMes: item.referenceMonth,
      diasTotaisMes: item.monthTotalDays,
      diasCorridosTrabalhados: item.workedCalendarDays,
      diasUteis: item.businessDaysInMonth,
      faltas: item.absenceDays,
      abonos: item.allowanceDays,
      justificativaFaltas: item.absenceJustification,
      justificativaAbonos: item.allowanceJustification,
      salarioAposFaltas: Number(item.salaryAfterAbsence || 0),
      valeAlimentacaoTotal: Number(item.mealAllowanceTotal || 0),
      coparticipacaoVale: Number(item.mealAllowanceCardDiscountValue || 0),
      salarioLiquido: Number(item.netCashValue || 0),
      totalRecebido: Number(item.totalReceivedValue || 0),
    })),
    anexos: (employee.documents || []).map((doc) => ({
      nome: doc.name,
      tipo: doc.type,
      tamanho: doc.size,
      conteudoBase64: doc.dataUrl,
    })),
  };
  const safeName = String(employee.employeeName || "funcionario")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  downloadTextFile(`funcionario-${safeName || "arquivo"}.json`, JSON.stringify(payload, null, 2), "application/json;charset=utf-8");
}

function renderEmployeeCatalog() {
  const container = document.getElementById("employeeCatalogList");
  if (!container) return;

  const sorted = [...(state.payslipEmployees || [])]
    .sort((a, b) => a.employeeName.localeCompare(b.employeeName, "pt-BR"));

  if (!sorted.length) {
    container.innerHTML = '<div class="small">Nenhum funcionário cadastrado ainda.</div>';
    return;
  }

  const rows = sorted
    .map((employee) => `
      <tr>
        <td>${escapeHtml(employee.employeeName)}</td>
        <td>${escapeHtml(employee.employeeCpf || "-")}</td>
        <td>${escapeHtml(employee.position || "-")}</td>
        <td>${currencyBRL.format(Number(employee.baseSalary || 0))}</td>
        <td>${currencyBRL.format(Number(employee.mealAllowanceFixed || 0))}</td>
        <td>${currencyBRL.format(Number(employee.mealAllowanceDaily || 0))}</td>
        <td>${escapeHtml(employee.fixedDiscountPercent || "0")}%</td>
        <td>${escapeHtml(String((employee.documents || []).length))}</td>
        <td>
          <div class="exports-actions">
            <button type="button" class="btn" data-action="view-employee" data-employee-id="${escapeHtml(employee.id)}">Ver</button>
            ${hasPermission("editEmployees") ? `<button type="button" class="btn" data-action="edit-employee" data-employee-id="${escapeHtml(employee.id)}">Editar</button>` : ""}
            <button type="button" class="btn" data-action="use-employee" data-employee-id="${escapeHtml(employee.id)}">Usar no contracheque</button>
            <button type="button" class="btn" data-action="export-employee" data-employee-id="${escapeHtml(employee.id)}">Exportar</button>
            ${hasPermission("editEmployees") ? `<button type="button" class="btn btn-danger" data-action="delete-employee" data-employee-id="${escapeHtml(employee.id)}">Apagar</button>` : ""}
          </div>
        </td>
      </tr>
    `)
    .join("");

  container.innerHTML = `
    <table class="balance-table">
      <thead>
        <tr>
          <th>Nome</th>
          <th>CPF</th>
          <th>Cargo</th>
          <th>Salário base</th>
          <th>VA fixo</th>
          <th>VA diário</th>
          <th>Desc. fixo</th>
          <th>Anexos</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderClientsModule() {
  const formContainer = document.getElementById("clientsFormContainer");
  const viewContainer = document.getElementById("clientsViewContainer");
  const listContainer = document.getElementById("clientCatalogList");
  if (!formContainer || !viewContainer || !listContainer) return;
  formContainer.classList.toggle("auth-hidden", !uiState.clientsFormOpen);
  viewContainer.classList.toggle("auth-hidden", !uiState.viewingClientId);
  listContainer.classList.toggle("auth-hidden", uiState.clientsFormOpen || Boolean(uiState.viewingClientId));
}

function renderEmployeesModule() {
  const formContainer = document.getElementById("employeesFormContainer");
  const viewContainer = document.getElementById("employeesViewContainer");
  const listContainer = document.getElementById("employeeCatalogList");
  if (!formContainer || !viewContainer || !listContainer) return;
  formContainer.classList.toggle("auth-hidden", !uiState.employeesFormOpen);
  viewContainer.classList.toggle("auth-hidden", !uiState.viewingEmployeeId);
  listContainer.classList.toggle("auth-hidden", uiState.employeesFormOpen || Boolean(uiState.viewingEmployeeId));
}

function renderClientDetailsView() {
  const container = document.getElementById("clientDetailsContent");
  if (!container) return;
  const client = getClientById(uiState.viewingClientId);
  if (!client) {
    container.innerHTML = '<div class="small">Cliente não encontrado.</div>';
    return;
  }
  const rows = [
    ["Nome / Razão social", client.clientName],
    ["CNPJ", client.clientCnpj],
    ["Contato responsável", client.clientContact],
    ["Celular", client.clientPhone],
    ["E-mail", client.clientEmail],
    ["Rua", client.clientStreet],
    ["Número", client.clientNumber],
    ["Complemento", client.clientComplement],
    ["Bairro", client.clientDistrict],
    ["Cidade", client.clientCity],
    ["Estado (UF)", client.clientState],
    ["CEP", client.clientZipCode],
    ["Observações", client.clientNotes],
  ]
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(String(value || "-"))}</td></tr>`)
    .join("");
  container.innerHTML = `
    <h3 style="margin-top: 0;">Visualização de Cliente</h3>
    <table class="balance-table">
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderEmployeeDetailsView() {
  const container = document.getElementById("employeeDetailsContent");
  if (!container) return;
  const employee = (state.payslipEmployees || []).find((item) => item.id === uiState.viewingEmployeeId);
  if (!employee) {
    container.innerHTML = '<div class="small">Funcionário não encontrado.</div>';
    return;
  }
  const rows = [
    ["Nome", employee.employeeName],
    ["CPF", employee.employeeCpf],
    ["Cargo", employee.position],
    ["Matrícula", employee.registration],
    ["Salário base", currencyBRL.format(Number(employee.baseSalary || 0))],
    ["Vale alimentação fixo", currencyBRL.format(Number(employee.mealAllowanceFixed || 0))],
    ["Vale alimentação diário", currencyBRL.format(Number(employee.mealAllowanceDaily || 0))],
    ["Descontos fixos (%)", `${String(employee.fixedDiscountPercent || "0")}%`],
    ["Qtd. de anexos", String((employee.documents || []).length)],
  ]
    .map(([label, value]) => `<tr><th>${escapeHtml(label)}</th><td>${escapeHtml(String(value || "-"))}</td></tr>`)
    .join("");
  const salaryHistory = [...(employee.salaryHistory || [])]
    .sort((a, b) => String(b.paymentDateISO || "").localeCompare(String(a.paymentDateISO || "")));
  const salaryRows = salaryHistory
    .map((item) => `
      <tr>
        <td>${formatDateBR(item.paymentDateISO)}</td>
        <td>${escapeHtml(`${monthNameByNumber(item.referenceMonth)}/${item.referenceYear}`)}</td>
        <td>${escapeHtml(String(item.workedCalendarDays || 0))}</td>
        <td>${escapeHtml(String(item.businessDaysInMonth || 0))}</td>
        <td>${escapeHtml(String(item.absenceDays || 0))}</td>
        <td>${escapeHtml(String(item.allowanceDays || 0))}</td>
        <td>${escapeHtml(item.absenceJustification || "-")}</td>
        <td>${escapeHtml(item.allowanceJustification || "-")}</td>
        <td>${currencyBRL.format(Number(item.totalReceivedValue || 0))}</td>
      </tr>
    `)
    .join("");
  const salarySummary = salaryHistory.reduce((acc, item) => {
    acc.totalPaid += Number(item.totalReceivedValue || 0);
    acc.totalSalary += Number(item.salaryAfterAbsence || 0);
    acc.totalVA += Number(item.mealAllowanceTotal || 0);
    acc.totalCardDiscount += Number(item.mealAllowanceCardDiscountValue || 0);
    return acc;
  }, {
    totalPaid: 0,
    totalSalary: 0,
    totalVA: 0,
    totalCardDiscount: 0,
  });
  container.innerHTML = `
    <h3 style="margin-top: 0;">Visualização de Funcionário</h3>
    <table class="balance-table">
      <tbody>${rows}</tbody>
    </table>
    <h3 style="margin-top: 16px;">Relatório de Pagamentos Salariais</h3>
    ${salaryHistory.length ? `
      <table class="balance-table">
        <thead>
          <tr>
            <th>Pago em</th>
            <th>Referência</th>
            <th>Dias corridos</th>
            <th>Dias úteis</th>
            <th>Faltas</th>
            <th>Abonos</th>
            <th>Justificativa faltas</th>
            <th>Justificativa abonos</th>
            <th>Total recebido</th>
          </tr>
        </thead>
        <tbody>${salaryRows}</tbody>
      </table>
      <div class="small" style="margin-top: 8px;">
        <strong>Resumo:</strong> ${salaryHistory.length} pagamento(s) | Salário total: ${currencyBRL.format(salarySummary.totalSalary)} | VA total: ${currencyBRL.format(salarySummary.totalVA)} | Coparticipação VA: ${currencyBRL.format(salarySummary.totalCardDiscount)} | Total recebido: ${currencyBRL.format(salarySummary.totalPaid)}
      </div>
    ` : '<div class="small">Nenhum pagamento salarial registrado para este funcionário.</div>'}
  `;
}

function renderPayslipModule() {
  const formContainer = document.getElementById("payslipFormContainer");
  if (!formContainer) return;
  formContainer.classList.toggle("auth-hidden", !uiState.payslipFormOpen);
}

function getClientById(clientId) {
  return (state.clients || []).find((item) => item.id === clientId) || null;
}

function getContractDisplayName(contractId) {
  const contract = (state.contractsPortfolio || []).find((item) => item.id === contractId);
  if (!contract) return "-";
  return String(contract.contractName || "").trim() || "Sem nome";
}

function getRentedPropertyDisplayName(propertyId) {
  const property = (state.rentedProperties || []).find((item) => item.id === propertyId);
  if (!property) return "-";
  return String(property.name || "").trim() || "Sem nome";
}

function resolveContractIdFromText(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const byId = (state.contractsPortfolio || []).find((item) => item.id === raw);
  if (byId) return byId.id;
  const normalized = raw.toLowerCase();
  const byName = (state.contractsPortfolio || []).find(
    (item) => String(item.contractName || "").trim().toLowerCase() === normalized,
  );
  return byName ? byName.id : "";
}

function renderClientSelects() {
  const proposalEntrySelect = document.getElementById("proposalEntryClientSelect");
  const proposalSelect = document.getElementById("proposalClientSelect");
  const contractsSelect = document.getElementById("contractsClientSelect");
  const contractsRentedPropertySelect = document.getElementById("contractsRentedPropertySelect");
  const rentedPropertyContractSelect = document.getElementById("rentedPropertyContractSelect");
  const options = [...(state.clients || [])]
    .sort((a, b) => a.clientName.localeCompare(b.clientName, "pt-BR"))
    .map((client) => `<option value="${escapeHtml(client.id)}">${escapeHtml(client.clientName)}</option>`)
    .join("");
  const contractOptions = [...(state.contractsPortfolio || [])]
    .sort((a, b) => String(a.contractName || "").localeCompare(String(b.contractName || ""), "pt-BR"))
    .map((contract) => `<option value="${escapeHtml(contract.id)}">${escapeHtml(contract.contractName || "Sem nome")}</option>`)
    .join("");
  const rentedPropertyOptions = [...(state.rentedProperties || [])]
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || ""), "pt-BR"))
    .map((property) => `<option value="${escapeHtml(property.id)}">${escapeHtml(property.name || "Sem nome")}</option>`)
    .join("");

  if (proposalEntrySelect) {
    proposalEntrySelect.innerHTML = `<option value="">Selecionar cliente salvo</option>${options}`;
    proposalEntrySelect.value = String(state.company.clientId || "");
  }
  if (proposalSelect) {
    proposalSelect.innerHTML = `<option value="">Selecionar cliente salvo</option>${options}`;
    proposalSelect.value = String(state.company.clientId || "");
  }
  if (contractsSelect) {
    contractsSelect.innerHTML = `<option value="">Selecionar cliente salvo</option>${options}`;
    contractsSelect.value = String(state.contracts.clientId || "");
  }
  if (contractsRentedPropertySelect) {
    contractsRentedPropertySelect.innerHTML = `<option value="">Selecionar imóvel alugado</option>${rentedPropertyOptions}`;
    contractsRentedPropertySelect.value = String(state.contracts.rentedPropertyId || "");
  }
  if (rentedPropertyContractSelect) {
    rentedPropertyContractSelect.innerHTML = `<option value="">Selecionar contrato (opcional)</option>${contractOptions}`;
    if (uiState.editingRentedPropertyId) {
      const editingProperty = getRentedPropertyById(uiState.editingRentedPropertyId);
      rentedPropertyContractSelect.value = String(editingProperty?.contractId || "");
    }
  }
}

function renderTaxes() {
  const taxesList = document.getElementById("taxesList");
  const taxesRate = document.getElementById("taxesRatePreview");
  const taxesForm = document.getElementById("taxesForm");
  if (!taxesList || !taxesRate || !taxesForm) return;

  const currentData = formToObject(taxesForm);
  const grossRevenue = parseBRLNumber(currentData.grossRevenue || 0);
  const taxPaid = parseBRLNumber(currentData.taxPaid || 0);
  const rate = taxRatePercent(grossRevenue, taxPaid);
  taxesRate.innerHTML = `
    <strong>Alíquota automática do mês:</strong>
    ${rate.toFixed(2).replace(".", ",")}% (${currencyBRL.format(taxPaid)} sobre ${currencyBRL.format(grossRevenue)})
  `;

  const records = [...(state.taxes.records || [])].sort((a, b) =>
    String(b.referenceMonth || "").localeCompare(String(a.referenceMonth || "")),
  );
  if (!records.length) {
    taxesList.innerHTML = '<div class="small">Nenhum imposto mensal cadastrado.</div>';
    return;
  }

  const rows = records.map((record) => {
    const recordRate = taxRatePercent(record.grossRevenue, record.taxPaid);
    return `
      <tr>
        <td>${escapeHtml(formatYearMonthLabel(record.referenceMonth))}</td>
        <td>${currencyBRL.format(Number(record.grossRevenue || 0))}</td>
        <td>${currencyBRL.format(Number(record.taxPaid || 0))}</td>
        <td>${recordRate.toFixed(2).replace(".", ",")}%</td>
        <td>${formatDateBR(record.paymentDateISO)}</td>
        <td>${escapeHtml(record.notes || "-")}</td>
        <td>
          <div class="exports-actions">
            <button type="button" class="btn" data-action="edit-tax" data-tax-id="${escapeHtml(record.id)}">Editar</button>
            <button type="button" class="btn btn-danger" data-action="delete-tax" data-tax-id="${escapeHtml(record.id)}">Apagar</button>
          </div>
        </td>
      </tr>
    `;
  }).join("");

  taxesList.innerHTML = `
    <table class="balance-table">
      <thead>
        <tr>
          <th>Mês</th>
          <th>Faturamento bruto</th>
          <th>Imposto pago</th>
          <th>Alíquota</th>
          <th>Data do pagamento</th>
          <th>Observações</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function setTaxesFormValues(record) {
  const form = document.getElementById("taxesForm");
  if (!form) return;
  form.elements.namedItem("referenceMonth").value = String(record?.referenceMonth || "");
  form.elements.namedItem("paymentDateISO").value = String(record?.paymentDateISO || "");
  form.elements.namedItem("grossRevenue").value = formatBRLInputValue(record?.grossRevenue || 0);
  form.elements.namedItem("taxPaid").value = formatBRLInputValue(record?.taxPaid || 0);
  form.elements.namedItem("notes").value = String(record?.notes || "");
  setupBRLInputs(form);
}

function clearTaxesForm() {
  const form = document.getElementById("taxesForm");
  if (!form) return;
  form.reset();
  const monthInput = form.elements.namedItem("referenceMonth");
  if (monthInput && !monthInput.value) monthInput.value = formatYearMonthISO(new Date().getFullYear(), new Date().getMonth() + 1);
  form.elements.namedItem("grossRevenue").value = "R$ 0,00";
  form.elements.namedItem("taxPaid").value = "R$ 0,00";
  setupBRLInputs(form);
  uiState.editingTaxRecordId = "";
}

function useClientInProposal(clientId) {
  const client = getClientById(clientId);
  if (!client) return;
  state.company = {
    clientId: client.id,
    name: client.clientName || "",
    cnpj: client.clientCnpj || "",
    contact: client.clientContact || "",
    phone: client.clientPhone || "",
    email: client.clientEmail || "",
    city: client.clientCity || "",
    notes: client.clientNotes || "",
  };
  saveState();
  renderAll();
}

function getRentedPropertyById(propertyId) {
  return (state.rentedProperties || []).find((item) => item.id === propertyId) || null;
}

function getContractById(contractId) {
  return (state.contractsPortfolio || []).find((item) => item.id === contractId) || null;
}

function applyRentedPropertyAddressToContractData(contractData, property) {
  if (!contractData || !property) return contractData;
  return {
    ...contractData,
    accommodationStreet: String(property.street || "").trim(),
    accommodationNumber: String(property.number || "").trim(),
    accommodationComplement: String(property.complement || "").trim(),
    accommodationDistrict: String(property.district || "").trim(),
    accommodationCity: String(property.city || "").trim(),
    accommodationState: String(property.state || "").trim(),
    accommodationZipCode: formatCEP(property.zipCode || ""),
  };
}

function applyContractAddressToRentedPropertyData(propertyData, contract) {
  if (!propertyData || !contract) return propertyData;
  return {
    ...propertyData,
    street: String(contract.accommodationStreet || "").trim(),
    number: String(contract.accommodationNumber || "").trim(),
    complement: String(contract.accommodationComplement || "").trim(),
    district: String(contract.accommodationDistrict || "").trim(),
    city: String(contract.accommodationCity || "").trim(),
    state: String(contract.accommodationState || "").trim(),
    zipCode: formatCEP(contract.accommodationZipCode || ""),
  };
}

function copyAddressFromRentedPropertyToContractForm(propertyId) {
  const property = getRentedPropertyById(propertyId);
  const contractsForm = document.getElementById("contractsForm");
  if (!property || !contractsForm) return;
  setFormValues(contractsForm, {
    accommodationStreet: property.street || "",
    accommodationNumber: property.number || "",
    accommodationComplement: property.complement || "",
    accommodationDistrict: property.district || "",
    accommodationCity: property.city || "",
    accommodationState: property.state || "",
    accommodationZipCode: formatCEP(property.zipCode || ""),
  });
}

function copyAddressFromContractToRentedPropertyForm(contractId) {
  const contract = getContractById(contractId);
  const rentedPropertyForm = document.getElementById("rentedPropertyForm");
  if (!contract || !rentedPropertyForm) return;
  setFormValues(rentedPropertyForm, {
    street: contract.accommodationStreet || "",
    number: contract.accommodationNumber || "",
    complement: contract.accommodationComplement || "",
    district: contract.accommodationDistrict || "",
    city: contract.accommodationCity || "",
    state: contract.accommodationState || "",
    zipCode: formatCEP(contract.accommodationZipCode || ""),
  });
}

function isRentedPropertyOverdue(property, referenceDate = new Date()) {
  const due = parseISODateOnly(String(property?.nextDueDateISO || ""));
  if (!due) return false;
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  return due < today;
}

function dateOnlyToUtcMs(date) {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
}

function getRentedPropertyContractNoticeDays(property, referenceDate = new Date()) {
  const contractEndDate = parseISODateOnly(String(property?.contractEndDateISO || ""));
  if (!contractEndDate) return null;
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const diffMs = dateOnlyToUtcMs(contractEndDate) - dateOnlyToUtcMs(today);
  return Math.round(diffMs / (24 * 60 * 60 * 1000));
}

function getRentedPropertyContractNoticeLabel(property, referenceDate = new Date()) {
  const days = getRentedPropertyContractNoticeDays(property, referenceDate);
  if (days === null) return "";
  if (![60, 30, 15].includes(days)) return "";
  return `Aviso prévio (${days} dias)`;
}

function advanceRentedPropertyDueDate(currentDueISO) {
  const dueDate = parseISODateOnly(currentDueISO);
  if (!dueDate) return "";
  return toISODateOnly(addMonthsSafe(dueDate, 1, dueDate.getDate()));
}

function registerRentedPropertyPayment(property, paymentDateISO, settlement = null) {
  const normalized = normalizeRentedProperty(property);
  const dueDateISO = String(normalized.nextDueDateISO || "").trim();
  if (!dueDateISO) return normalized;
  const expectedAmount = Number(settlement?.expectedAmount ?? normalized.rentAmount ?? 0);
  const paidAmount = Number(settlement?.paidAmount ?? expectedAmount);
  const discountAmount = Math.max(0, expectedAmount - paidAmount);
  const discountReason = discountAmount > 0
    ? String(settlement?.discountReason || "").trim()
    : "";
  const history = Array.isArray(normalized.paymentHistory) ? [...normalized.paymentHistory] : [];
  history.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dueDateISO,
    paymentDateISO,
    expectedAmount,
    paidAmount,
    discountAmount,
    discountReason,
    createdAt: new Date().toISOString(),
  });
  return normalizeRentedProperty({
    ...normalized,
    paymentHistory: history,
    nextDueDateISO: advanceRentedPropertyDueDate(dueDateISO),
    updatedAt: new Date().toISOString(),
  });
}

function setRentedPropertyForm(property) {
  const form = document.getElementById("rentedPropertyForm");
  if (!form || !property) return;
  setFormValues(form, {
    name: property.name || "",
    contractId: property.contractId || "",
    street: property.street || "",
    number: property.number || "",
    complement: property.complement || "",
    district: property.district || "",
    city: property.city || "",
    state: property.state || "",
    zipCode: property.zipCode || "",
    rentAmount: currencyBRL.format(Number(property.rentAmount || 0)),
    contractStartDateISO: property.contractStartDateISO || "",
    contractEndDateISO: property.contractEndDateISO || "",
    nextDueDateISO: property.nextDueDateISO || "",
  });
}

function resetRentedPropertyForm() {
  const form = document.getElementById("rentedPropertyForm");
  if (form) {
    form.reset();
    const rentAmountInput = form.elements.namedItem("rentAmount");
    const contractStartDateInput = form.elements.namedItem("contractStartDateISO");
    const contractEndDateInput = form.elements.namedItem("contractEndDateISO");
    const dueDateInput = form.elements.namedItem("nextDueDateISO");
    const today = new Date();
    if (rentAmountInput) rentAmountInput.value = "R$ 0,00";
    if (contractStartDateInput) contractStartDateInput.value = toISODateOnly(today);
    if (contractEndDateInput) contractEndDateInput.value = toISODateOnly(addMonthsSafe(today, 12, today.getDate()));
    if (dueDateInput) dueDateInput.value = toISODateOnly(today);
  }
  uiState.editingRentedPropertyId = "";
}

function syncRentedPropertyToContractLink(propertyId, contractId) {
  const propertyIdStr = String(propertyId || "").trim();
  const contractIdStr = String(contractId || "").trim();
  if (!propertyIdStr) return;

  state.contractsPortfolio = (state.contractsPortfolio || []).map((contract) => {
    if (contract.id === contractIdStr) return { ...contract, rentedPropertyId: propertyIdStr };
    if (String(contract.rentedPropertyId || "") === propertyIdStr) return { ...contract, rentedPropertyId: "" };
    return contract;
  });

  state.rentedProperties = (state.rentedProperties || []).map((property) => {
    if (property.id === propertyIdStr) return { ...property, contractId: contractIdStr };
    if (contractIdStr && property.contractId === contractIdStr) return { ...property, contractId: "" };
    return property;
  });

  if (String(state.contracts.id || "") === contractIdStr) {
    state.contracts.rentedPropertyId = propertyIdStr;
  } else if (String(state.contracts.rentedPropertyId || "") === propertyIdStr) {
    state.contracts.rentedPropertyId = "";
  }
}

function renderRentedPropertiesModule() {
  const formContainer = document.getElementById("rentedPropertyFormContainer");
  const listContainer = document.getElementById("rentedPropertiesSavedList");
  const btnBack = document.getElementById("btnBackToRentedPropertiesList");
  if (!formContainer || !listContainer || !btnBack) return;

  formContainer.classList.toggle("auth-hidden", !uiState.rentedPropertiesFormOpen);
  btnBack.classList.toggle("auth-hidden", !uiState.rentedPropertiesFormOpen);

  if (uiState.rentedPropertiesFormOpen) {
    const editing = getRentedPropertyById(uiState.editingRentedPropertyId);
    if (editing) setRentedPropertyForm(editing);
  }

  const rows = [...(state.rentedProperties || [])]
    .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
    .map((property) => {
      const isOverdue = isRentedPropertyOverdue(property);
      const noticeLabel = getRentedPropertyContractNoticeLabel(property);
      return `
        <tr>
          <td>${escapeHtml(property.name || "Sem nome")}</td>
          <td>${escapeHtml(getContractDisplayName(property.contractId))}</td>
          <td>${formatDateBR(property.contractStartDateISO)} at&#233; ${formatDateBR(property.contractEndDateISO)}</td>
          <td>${noticeLabel ? `<span class="tag-overdue">${escapeHtml(noticeLabel)}</span>` : "-"}</td>
          <td>${formatDateBR(property.nextDueDateISO)} ${isOverdue ? '<span class="tag-overdue">Atrasado</span>' : ""}</td>
          <td class="balance-expense">${currencyBRL.format(Number(property.rentAmount || 0))}</td>
          <td>${formatDateTimeBR(property.updatedAt)}</td>
          <td>
            <div class="exports-actions">
              <button type="button" class="btn" data-action="edit-rented-property" data-rented-property-id="${escapeHtml(property.id)}">Editar</button>
              <button type="button" class="btn btn-primary" data-action="mark-rented-property-paid" data-rented-property-id="${escapeHtml(property.id)}">Marcar pago</button>
              <button type="button" class="btn btn-danger" data-action="delete-rented-property" data-rented-property-id="${escapeHtml(property.id)}">Apagar</button>
            </div>
          </td>
        </tr>
      `;
    })
    .join("");

  listContainer.innerHTML = rows
    ? `
      <table class="balance-table">
        <thead>
          <tr>
            <th>Imóvel</th>
            <th>Contrato</th>
            <th>Período do contrato</th>
            <th>Aviso prévio</th>
            <th>Próximo vencimento</th>
            <th>Aluguel mensal</th>
            <th>Atualizado em</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `
    : '<div class="small">Nenhum imóvel alugado cadastrado.</div>';
}

function resetClientCatalogForm() {
  const form = document.getElementById("clientCatalogForm");
  if (!form) return;
  form.reset();
  uiState.editingClientId = "";
}

function setClientCatalogForm(client) {
  const form = document.getElementById("clientCatalogForm");
  if (!form || !client) return;
  uiState.editingClientId = String(client.id || "");
  setFormValues(form, {
    clientName: client.clientName || "",
    clientCnpj: client.clientCnpj || "",
    clientContact: client.clientContact || "",
    clientPhone: client.clientPhone || "",
    clientEmail: client.clientEmail || "",
    clientStreet: client.clientStreet || "",
    clientNumber: client.clientNumber || "",
    clientComplement: client.clientComplement || "",
    clientDistrict: client.clientDistrict || "",
    clientCity: client.clientCity || "",
    clientState: client.clientState || "",
    clientZipCode: client.clientZipCode || "",
    clientNotes: client.clientNotes || "",
  });
}

function renderClientCatalog() {
  const container = document.getElementById("clientCatalogList");
  if (!container) return;
  const sorted = [...(state.clients || [])].sort((a, b) => a.clientName.localeCompare(b.clientName, "pt-BR"));
  if (!sorted.length) {
    container.innerHTML = '<div class="small">Nenhum cliente cadastrado ainda.</div>';
    return;
  }

  const rows = sorted
    .map((client) => `
      <tr>
        <td>${escapeHtml(client.clientName || "-")}</td>
        <td>${escapeHtml(client.clientCnpj || "-")}</td>
        <td>${escapeHtml(client.clientContact || "-")}</td>
        <td>${escapeHtml(client.clientPhone || "-")}</td>
        <td>${escapeHtml(client.clientCity || "-")}</td>
        <td>
          <div class="exports-actions">
            <button type="button" class="btn" data-action="view-client" data-client-id="${escapeHtml(client.id)}">Ver</button>
            ${hasPermission("editClients") ? `<button type="button" class="btn" data-action="edit-client" data-client-id="${escapeHtml(client.id)}">Editar</button>` : ""}
            <button type="button" class="btn" data-action="use-client-proposal" data-client-id="${escapeHtml(client.id)}">Usar na proposta</button>
            ${hasPermission("editClients") ? `<button type="button" class="btn btn-danger" data-action="delete-client" data-client-id="${escapeHtml(client.id)}">Apagar</button>` : ""}
          </div>
        </td>
      </tr>
    `)
    .join("");

  container.innerHTML = `
    <table class="balance-table">
      <thead>
        <tr>
          <th>Cliente</th>
          <th>CNPJ</th>
          <th>Contato</th>
          <th>Celular</th>
          <th>Cidade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function dateWithClampedDay(year, monthIndex, dayOfMonth) {
  const lastDay = new Date(year, monthIndex + 1, 0).getDate();
  const day = Math.max(1, Math.min(lastDay, Number(dayOfMonth || 1)));
  return new Date(year, monthIndex, day);
}

function addMonthsSafe(date, months, dayOfMonth) {
  const targetYear = date.getFullYear();
  const targetMonth = date.getMonth() + months;
  const probe = new Date(targetYear, targetMonth, 1);
  return dateWithClampedDay(probe.getFullYear(), probe.getMonth(), dayOfMonth);
}

function calculateContractTimeline(contractData, referenceDate = new Date()) {
  const measurementStartDay = Number(contractData.measurementStartDay || 24);
  const measurementEndDay = Number(contractData.measurementEndDay || 24);
  const receiptDay = Number(contractData.receiptDay || 15);

  const now = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  const currentMonthStart = dateWithClampedDay(now.getFullYear(), now.getMonth(), measurementStartDay);
  let cycleStart = now >= currentMonthStart
    ? currentMonthStart
    : addMonthsSafe(currentMonthStart, -1, measurementStartDay);
  let cycleEnd = addMonthsSafe(cycleStart, 1, measurementEndDay);
  let receiptDate = dateWithClampedDay(cycleEnd.getFullYear(), cycleEnd.getMonth(), receiptDay);
  if (receiptDate <= cycleEnd) {
    receiptDate = addMonthsSafe(receiptDate, 1, receiptDay);
  }

  let guard = 0;
  while (receiptDate <= now && guard < 24) {
    cycleStart = addMonthsSafe(cycleStart, 1, measurementStartDay);
    cycleEnd = addMonthsSafe(cycleStart, 1, measurementEndDay);
    receiptDate = dateWithClampedDay(cycleEnd.getFullYear(), cycleEnd.getMonth(), receiptDay);
    if (receiptDate <= cycleEnd) {
      receiptDate = addMonthsSafe(receiptDate, 1, receiptDay);
    }
    guard += 1;
  }

  const toISODate = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  return {
    measurementStartDay,
    measurementEndDay,
    receiptDay,
    cycleStart,
    cycleEnd,
    receiptDate,
    cycleStartISO: toISODate(cycleStart),
    cycleEndISO: toISODate(cycleEnd),
    receiptDateISO: toISODate(receiptDate),
  };
}

function parseISODateOnly(value) {
  const raw = String(value || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [y, m, d] = raw.split("-").map((part) => Number(part));
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

function toISODateOnly(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatYearMonthISO(year, monthNumber) {
  const y = Number(year || new Date().getFullYear());
  const month = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  return `${String(y).padStart(4, "0")}-${String(month).padStart(2, "0")}`;
}

function parseYearMonthISO(value) {
  const raw = String(value || "").trim();
  if (!/^\d{4}-\d{2}$/.test(raw)) return null;
  const [yRaw, mRaw] = raw.split("-");
  const year = Number(yRaw);
  const month = Number(mRaw);
  if (!Number.isFinite(year) || !Number.isFinite(month) || month < 1 || month > 12) return null;
  return { year, month };
}

function getPreviousYearMonth(year, monthNumber) {
  const normalizedMonth = Math.max(1, Math.min(12, Number(monthNumber || 1)));
  const normalizedYear = Number(year || new Date().getFullYear());
  if (normalizedMonth === 1) {
    return { year: normalizedYear - 1, month: 12 };
  }
  return { year: normalizedYear, month: normalizedMonth - 1 };
}

function inferReferenceYearMonth(referenceMonthISO, paymentDateISO, fallbackDate = new Date()) {
  const explicit = parseYearMonthISO(referenceMonthISO);
  if (explicit) return explicit;
  const paymentDate = parseISODateOnly(paymentDateISO);
  if (paymentDate) {
    return getPreviousYearMonth(paymentDate.getFullYear(), paymentDate.getMonth() + 1);
  }
  const fallback = fallbackDate instanceof Date ? fallbackDate : new Date();
  return getPreviousYearMonth(fallback.getFullYear(), fallback.getMonth() + 1);
}

function getContractNextReceiptDateISO(contractData) {
  const parsed = parseISODateOnly(contractData?.nextReceiptDateISO);
  if (parsed) return toISODateOnly(parsed);
  return calculateContractTimeline(contractData).receiptDateISO;
}

function isContractOverdue(contractData, referenceDate = new Date()) {
  const dueDate = parseISODateOnly(getContractNextReceiptDateISO(contractData));
  if (!dueDate) return false;
  const today = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), referenceDate.getDate());
  return dueDate < today;
}

function advanceContractNextReceiptDate(currentDueISO, receiptDay) {
  const dueDate = parseISODateOnly(currentDueISO);
  if (!dueDate) return "";
  return toISODateOnly(addMonthsSafe(dueDate, 1, Number(receiptDay || 15)));
}

function registerContractPayment(contractData, paymentDateISO, settlement = null) {
  const normalized = normalizeContract(contractData);
  const dueDateISO = getContractNextReceiptDateISO(normalized);
  const fallbackExpectedAmount = Number(calculateContractsResult(normalized).monthlyRevenue || 0);
  const expectedAmount = Number(settlement?.expectedAmount ?? fallbackExpectedAmount);
  const paidAmount = Number(settlement?.paidAmount ?? expectedAmount);
  const discountAmount = Math.max(0, expectedAmount - paidAmount);
  const discountReason = discountAmount > 0
    ? String(settlement?.discountReason || "").trim()
    : "";
  const history = Array.isArray(normalized.receiptHistory) ? [...normalized.receiptHistory] : [];
  history.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    dueDateISO,
    paymentDateISO,
    expectedAmount,
    paidAmount,
    discountAmount,
    discountReason,
    createdAt: new Date().toISOString(),
  });
  return normalizeContract({
    ...normalized,
    receiptHistory: history,
    nextReceiptDateISO: advanceContractNextReceiptDate(dueDateISO, normalized.receiptDay),
    updatedAt: new Date().toISOString(),
  });
}

function getContractNotificationItems() {
  return (state.contractsPortfolio || [])
    .filter((item) => item.isEffective && hasContractContent(item) && isContractOverdue(item))
    .map((item) => ({
      type: "contract",
      id: item.id,
      contractName: item.contractName || "Sem nome",
      dueDateISO: getContractNextReceiptDateISO(item),
    }))
    .sort((a, b) => a.dueDateISO.localeCompare(b.dueDateISO));
}

function getRentedPropertyNotificationItems() {
  return (state.rentedProperties || [])
    .flatMap((item) => {
      const notifications = [];
      if (isRentedPropertyOverdue(item)) {
        notifications.push({
          type: "rented_property",
          id: item.id,
          propertyName: item.name || "Sem nome",
          dueDateISO: String(item.nextDueDateISO || "").trim(),
        });
      }

      const noticeDays = getRentedPropertyContractNoticeDays(item);
      if ([60, 30, 15].includes(Number(noticeDays))) {
        notifications.push({
          type: "rented_property_contract_notice",
          id: item.id,
          propertyName: item.name || "Sem nome",
          dueDateISO: String(item.contractEndDateISO || "").trim(),
          daysBeforeEnd: Number(noticeDays),
        });
      }
      return notifications;
    })
    .sort((a, b) => a.dueDateISO.localeCompare(b.dueDateISO));
}

function calculateContractsResult(contractData = state.contracts) {
  const timeline = calculateContractTimeline(contractData);
  const capacity = Number(contractData.capacity || 0);
  const dailyRatePerPerson = Number(contractData.dailyRatePerPerson || 0);
  const monthlyTaxPercent = Number(contractData.monthlyTaxPercent || 0);
  const monthlyRevenue = capacity * dailyRatePerPerson * 30;
  const monthlyTaxValue = monthlyRevenue * (monthlyTaxPercent / 100);

  const rentCost = Number(contractData.rentCost || 0);
  const staffCost = Number(contractData.staffCost || 0);
  const furnitureCost = Number(contractData.furnitureCost || 0);
  const cleaningProductsCost = Number(contractData.cleaningProductsCost || 0);
  const waterCost = Number(contractData.waterCost || 0);
  const electricityCost = Number(contractData.electricityCost || 0);
  const internetCost = Number(contractData.internetCost || 0);
  const maintenanceCost = Number(contractData.maintenanceCost || 0);
  const proLaboreCost = Number(contractData.proLaboreCost || 0);
  const proLaboreRecipient = String(contractData.proLaboreRecipient || "").trim();

  const recurringCosts =
    rentCost
    + staffCost
    + cleaningProductsCost
    + waterCost
    + electricityCost
    + internetCost
    + maintenanceCost
    + proLaboreCost
    + monthlyTaxValue;
  const monthlyProfit = monthlyRevenue - recurringCosts;
  const firstMonthProfit = monthlyProfit - furnitureCost;
  const breakEvenMonths =
    monthlyProfit > 0
      ? furnitureCost / monthlyProfit
      : null;

  return {
    capacity,
    dailyRatePerPerson,
    monthlyTaxPercent,
    monthlyTaxValue,
    monthlyRevenue,
    recurringCosts,
    proLaboreCost,
    proLaboreRecipient,
    furnitureCost,
    monthlyProfit,
    firstMonthProfit,
    breakEvenMonths,
    timeline,
  };
}

function calculateContractSimulationResult(simulationData = uiState.contractsSimulation) {
  const capacity = Math.max(0, Number(simulationData.capacity || 0));
  const monthlyTaxPercent = Math.max(0, Number(simulationData.monthlyTaxPercent || 0));
  const taxFactor = 1 - (monthlyTaxPercent / 100);
  const healthyPartnerSharePercent = 30;

  const rentCost = Number(simulationData.rentCost || 0);
  const staffCost = Number(simulationData.staffCost || 0);
  const furnitureCost = Number(simulationData.furnitureCost || 0);
  const cleaningProductsCost = Number(simulationData.cleaningProductsCost || 0);
  const waterCost = Number(simulationData.waterCost || 0);
  const electricityCost = Number(simulationData.electricityCost || 0);
  const internetCost = Number(simulationData.internetCost || 0);
  const maintenanceCost = Number(simulationData.maintenanceCost || 0);
  const proLaboreCost = Number(simulationData.proLaboreCost || 0);
  const targetMonthlyProfit = Number(simulationData.targetMonthlyProfit || 0);
  const enteredDailyRate = Number(simulationData.dailyRatePerPerson || 0);

  const recurringFixedCosts =
    rentCost
    + staffCost
    + cleaningProductsCost
    + waterCost
    + electricityCost
    + internetCost
    + maintenanceCost
    + proLaboreCost;

  if (capacity <= 0 || taxFactor <= 0) {
    return {
      capacity,
      monthlyTaxPercent,
      recurringFixedCosts,
      furnitureCost,
      targetMonthlyProfit,
      valid: false,
    };
  }

  const requiredRevenueForBreakEven = recurringFixedCosts / taxFactor;
  const requiredDailyForBreakEven = requiredRevenueForBreakEven / (capacity * 30);
  const requiredRevenueForTarget = (recurringFixedCosts + Math.max(0, targetMonthlyProfit)) / taxFactor;
  const requiredDailyForTarget = requiredRevenueForTarget / (capacity * 30);

  const simulatedMonthlyRevenue = Math.max(0, enteredDailyRate) * capacity * 30;
  const simulatedMonthlyTax = simulatedMonthlyRevenue * (monthlyTaxPercent / 100);
  const simulatedMonthlyProfit = simulatedMonthlyRevenue - recurringFixedCosts - simulatedMonthlyTax;
  const simulatedFirstMonthProfit = simulatedMonthlyProfit - furnitureCost;
  const furnitureBreakEvenMonths = simulatedMonthlyProfit > 0 ? (furnitureCost / simulatedMonthlyProfit) : null;
  const healthyPartnerShareValue = Math.max(0, simulatedMonthlyProfit) * (healthyPartnerSharePercent / 100);

  return {
    capacity,
    monthlyTaxPercent,
    recurringFixedCosts,
    furnitureCost,
    targetMonthlyProfit: Math.max(0, targetMonthlyProfit),
    valid: true,
    requiredRevenueForBreakEven,
    requiredDailyForBreakEven,
    requiredRevenueForTarget,
    requiredDailyForTarget,
    enteredDailyRate: Math.max(0, enteredDailyRate),
    simulatedMonthlyRevenue,
    simulatedMonthlyTax,
    simulatedMonthlyProfit,
    simulatedFirstMonthProfit,
    furnitureBreakEvenMonths,
    healthyPartnerSharePercent,
    healthyPartnerShareValue,
  };
}

function renderContractSimulation() {
  const panel = document.getElementById("contractsSimulationPanel");
  const form = document.getElementById("contractsSimulationForm");
  const resultBox = document.getElementById("contractsSimulationResult");
  if (!panel || !form || !resultBox) return;

  panel.classList.toggle("auth-hidden", !uiState.contractsSimulationOpen);
  if (!uiState.contractsSimulationOpen) return;

  const result = calculateContractSimulationResult(uiState.contractsSimulation);
  const furnitureBreakEvenText = Number.isFinite(result.furnitureBreakEvenMonths)
    ? `${Number(result.furnitureBreakEvenMonths).toFixed(1)} meses`
    : "Sem previsão";
  if (!result.valid) {
    resultBox.innerHTML = `
      <div class="small">Informe capacidade de pessoas maior que zero e alíquota menor que 100% para simular.</div>
    `;
    return;
  }

  resultBox.innerHTML = `
    <div class="balance-summary-grid">
      <div class="balance-summary-card"><div class="label">Valor total do contrato (30 dias)</div><div class="value balance-income">${currencyBRL.format(result.simulatedMonthlyRevenue)}</div></div>
      <div class="balance-summary-card"><div class="label">Custos recorrentes mensais</div><div class="value balance-expense">${currencyBRL.format(result.recurringFixedCosts)}</div></div>
      <div class="balance-summary-card"><div class="label">Diária para empatar</div><div class="value">${currencyBRL.format(result.requiredDailyForBreakEven)}</div></div>
      <div class="balance-summary-card"><div class="label">Diária para lucro alvo</div><div class="value balance-income">${currencyBRL.format(result.requiredDailyForTarget)}</div></div>
      <div class="balance-summary-card"><div class="label">Lucro alvo mensal</div><div class="value">${currencyBRL.format(result.targetMonthlyProfit)}</div></div>
      <div class="balance-summary-card"><div class="label">Diária simulada informada</div><div class="value">${currencyBRL.format(result.enteredDailyRate)}</div></div>
      <div class="balance-summary-card"><div class="label">Lucro mensal simulado</div><div class="value ${result.simulatedMonthlyProfit >= 0 ? "balance-income" : "balance-expense"}">${currencyBRL.format(result.simulatedMonthlyProfit)}</div></div>
      <div class="balance-summary-card"><div class="label">Lucro 1º mês (com mobília)</div><div class="value ${result.simulatedFirstMonthProfit >= 0 ? "balance-income" : "balance-expense"}">${currencyBRL.format(result.simulatedFirstMonthProfit)}</div></div>
      <div class="balance-summary-card"><div class="label">Breakeven da mobília</div><div class="value">${furnitureBreakEvenText}</div></div>
      <div class="balance-summary-card"><div class="label">Participação saudável do sócio (${result.healthyPartnerSharePercent}% do lucro)</div><div class="value">${currencyBRL.format(result.healthyPartnerShareValue)}</div></div>
      <div class="balance-summary-card"><div class="label">Imposto mensal simulado</div><div class="value balance-expense">${currencyBRL.format(result.simulatedMonthlyTax)}</div></div>
    </div>
    <div class="small" style="margin-top: 8px;">
      Simulação temporária: não salva dados e é limpa ao fechar/sair da aba de contratos.
    </div>
  `;
}

function getContractsFormPayload() {
  const contractsForm = document.getElementById("contractsForm");
  if (!contractsForm) return null;
  const payload = formToObject(contractsForm);
  CONTRACT_MONEY_FIELDS.forEach((field) => {
    payload[field] = String(parseBRLNumber(payload[field]));
  });
  return payload;
}

function resetContractsDraftForm(closeForm = true) {
  state.contracts = createEmptyContract();
  state.activeContractId = "";
  if (closeForm) uiState.contractsFormOpen = false;
  uiState.contractsEditMode = false;
  uiState.contractsSummaryVisible = false;
  uiState.contractsSimulationOpen = false;
  uiState.contractsSimulation = createEmptyContractSimulation();
}

function saveContractFromForm({ isEffective }) {
  const payload = getContractsFormPayload();
  if (!payload) return false;
  const nowISO = new Date().toISOString();
  const existing = state.contractsPortfolio.find((item) => item.id === state.activeContractId) || null;
  const linkedProperty = getRentedPropertyById(payload.rentedPropertyId);
  const payloadWithLinkedAddress = linkedProperty
    ? applyRentedPropertyAddressToContractData(payload, linkedProperty)
    : payload;
  const contractToSave = normalizeContract({
    ...(existing || createEmptyContract()),
    ...(payloadWithLinkedAddress || {}),
    id: existing ? existing.id : `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    isEffective: Boolean(isEffective),
    createdAt: existing?.createdAt || nowISO,
    updatedAt: nowISO,
  });
  const previousRentedPropertyId = String(existing?.rentedPropertyId || "").trim();
  const nextRentedPropertyId = String(contractToSave.rentedPropertyId || "").trim();
  const idx = state.contractsPortfolio.findIndex((item) => item.id === contractToSave.id);
  if (idx >= 0) state.contractsPortfolio[idx] = contractToSave;
  else state.contractsPortfolio.push(contractToSave);
  if (nextRentedPropertyId) {
    syncRentedPropertyToContractLink(nextRentedPropertyId, contractToSave.id);
  } else if (previousRentedPropertyId) {
    syncRentedPropertyToContractLink(previousRentedPropertyId, "");
  }
  resetContractsDraftForm(true);
  saveState();
  void logAuditAction({
    action: existing ? "update" : "create",
    module: "contracts",
    entityType: "contract",
    entityId: contractToSave.id,
    description: existing ? "Contrato atualizado." : "Contrato criado.",
    before: existing,
    after: contractToSave,
    metadata: { isEffective: Boolean(contractToSave.isEffective) },
  });
  renderAll();
  return true;
}

function syncCurrentContractFromForm() {
  const payload = getContractsFormPayload();
  if (!payload) return;
  const currentId = state.activeContractId || state.contracts.id;
  state.contracts = normalizeContract({
    ...state.contracts,
    ...(payload || {}),
    id: currentId,
  });
}

function renderContractsOpenSummary() {
  const container = document.getElementById("contractsOpenSummary");
  if (!container) return;

  if (!uiState.contractsFormOpen) {
    container.innerHTML = "";
    return;
  }

  const result = calculateContractsResult(state.contracts);
  const nextReceiptISO = getContractNextReceiptDateISO(state.contracts);
  const isOverdue = isContractOverdue(state.contracts);
  const receiptHistory = [...(state.contracts.receiptHistory || [])]
    .sort((a, b) => b.dueDateISO.localeCompare(a.dueDateISO))
    .slice(0, 8);
  const breakEvenText = Number.isFinite(result.breakEvenMonths)
    ? `${Number(result.breakEvenMonths).toFixed(1)} meses`
    : "Sem previsão";
  const historyRows = receiptHistory.length
    ? receiptHistory
      .map((entry) => `
        <tr>
          <td>${formatDateBR(entry.dueDateISO)}</td>
          <td>${formatDateBR(entry.paymentDateISO)}</td>
          <td>${currencyBRL.format(Number(entry.expectedAmount || 0))}</td>
          <td class="balance-income">${currencyBRL.format(Number(entry.paidAmount ?? entry.expectedAmount ?? 0))}</td>
          <td class="balance-expense">${currencyBRL.format(Number(entry.discountAmount || 0))}</td>
          <td>${escapeHtml(entry.discountReason || "-")}</td>
          <td><span class="balance-income">Pago</span></td>
        </tr>
      `)
      .join("")
    : '<tr><td colspan="8" class="small">Nenhum recebimento marcado ainda.</td></tr>';

  container.classList.toggle("contracts-summary-hidden", !uiState.contractsSummaryVisible);
  container.innerHTML = `
    <div class="contracts-summary-toolbar">
      <h3 style="margin: 0;">Resumo Financeiro do Contrato</h3>
      <button id="btnToggleContractSummaryValues" type="button" class="btn ${uiState.contractsSummaryVisible ? "btn-primary" : ""}">
        ${uiState.contractsSummaryVisible ? "Ocultar resumo" : "Mostrar resumo"}
      </button>
    </div>
    <div class="small contracts-estimate-note">
      Água, Luz/Energia, Internet e Manutenção são valores de <strong>estimativa</strong>. Esses custos só ficam <strong>confirmados</strong> quando forem pagos e lançados no balanço.
    </div>
    <div class="contracts-summary-grid">
      <article class="contracts-summary-card">
        <div class="label">Investimento inicial (custo único)</div>
        <div class="value contracts-summary-sensitive">${currencyBRL.format(result.furnitureCost)}</div>
      </article>
      <article class="contracts-summary-card">
        <div class="label">Custos recorrentes mensais</div>
        <div class="value contracts-summary-sensitive">${currencyBRL.format(result.recurringCosts)}</div>
      </article>
      <article class="contracts-summary-card">
        <div class="label">Faturamento mensal</div>
        <div class="value contracts-summary-sensitive positive">${currencyBRL.format(result.monthlyRevenue)}</div>
      </article>
      <article class="contracts-summary-card">
        <div class="label">Lucro mensal</div>
        <div class="value contracts-summary-sensitive ${result.monthlyProfit >= 0 ? "positive" : "negative"}">${currencyBRL.format(result.monthlyProfit)}</div>
      </article>
      <article class="contracts-summary-card">
        <div class="label">Lucro do 1º mês (com investimento)</div>
        <div class="value contracts-summary-sensitive ${result.firstMonthProfit >= 0 ? "positive" : "negative"}">${currencyBRL.format(result.firstMonthProfit)}</div>
      </article>
      <article class="contracts-summary-card">
        <div class="label">Breakeven estimado</div>
        <div class="value contracts-summary-sensitive">${escapeHtml(breakEvenText)}</div>
      </article>
    </div>
    <div style="margin-top: 14px;">
      <h3 style="margin: 0 0 8px;">Resumo de Recebimentos Mensais</h3>
      <div class="contracts-summary-card" style="margin-bottom: 8px;">
        <div class="label">Próximo recebimento previsto</div>
        <div class="value contracts-summary-sensitive">${formatDateBR(nextReceiptISO)}${isOverdue ? '<span class="tag-overdue">Atrasado</span>' : ""}</div>
        ${uiState.contractsEditMode ? `
          <div style="margin-top: 8px;">
            <button id="btnMarkCurrentReceiptPaid" type="button" class="btn btn-primary">Marcar como pago</button>
          </div>
        ` : ""}
      </div>
      <table class="balance-table">
        <thead>
          <tr>
            <th>Competência (vencimento)</th>
            <th>Data de pagamento</th>
            <th>Valor previsto</th>
            <th>Valor recebido</th>
            <th>Desconto</th>
            <th>Justificativa</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${historyRows}
        </tbody>
      </table>
    </div>
  `;
}

function confirmContractDelete(contractName) {
  const normalizedName = String(contractName || "Sem nome").trim() || "Sem nome";
  if (!confirm(`Tem certeza que deseja excluir o contrato "${normalizedName}"?`)) return false;
  const typed = String(prompt('Digite EXCLUIR para confirmar a exclusão do contrato:') || "").trim();
  if (typed !== "EXCLUIR") {
    alert("Exclusão cancelada. Digite EXCLUIR exatamente para confirmar.");
    return false;
  }
  return true;
}

function renderContracts() {
  ensureContractsPortfolio();
  const formContainer = document.getElementById("contractsFormContainer");
  const listContainer = document.getElementById("contractsSavedList");
  const btnShowEffective = document.getElementById("btnShowEffectiveContracts");
  const btnShowDraft = document.getElementById("btnShowDraftContracts");
  const listActions = document.getElementById("contractsListActions");
  const openActions = document.getElementById("contractsOpenActions");
  const topActions = document.getElementById("contractsTopActions");
  if (!formContainer || !listContainer || !btnShowEffective || !btnShowDraft) return;

  formContainer.classList.toggle("auth-hidden", !uiState.contractsFormOpen);
  if (topActions) topActions.classList.toggle("auth-hidden", uiState.contractsFormOpen && !uiState.contractsEditMode);
  if (listActions) listActions.classList.toggle("auth-hidden", uiState.contractsFormOpen);
  if (openActions) openActions.classList.toggle("auth-hidden", !uiState.contractsFormOpen);
  listContainer.classList.toggle("auth-hidden", uiState.contractsFormOpen);
  btnShowEffective.classList.toggle("btn-primary", uiState.contractsSavedView === "effective");
  btnShowDraft.classList.toggle("btn-primary", uiState.contractsSavedView === "draft");
  renderContractsOpenSummary();
  renderContractSimulation();
  const btnToggleSummary = document.getElementById("btnToggleContractSummaryValues");
  if (btnToggleSummary) {
    btnToggleSummary.onclick = () => {
      uiState.contractsSummaryVisible = !uiState.contractsSummaryVisible;
      renderContractsOpenSummary();
    };
  }
  const btnMarkReceiptPaid = document.getElementById("btnMarkCurrentReceiptPaid");
  if (btnMarkReceiptPaid) {
    btnMarkReceiptPaid.onclick = () => {
      if (!hasPermission("editContracts")) {
        alert("Sem permissão para registrar pagamentos de contrato.");
        return;
      }
      if (!state.activeContractId) {
        alert("Salve o contrato antes de marcar recebimento como pago.");
        return;
      }
      const todayISO = toISODateOnly(new Date());
      const typedDate = String(prompt("Informe a data do pagamento (AAAA-MM-DD):", todayISO) || "").trim();
      const paymentDate = parseISODateOnly(typedDate);
      if (!paymentDate) {
        alert("Data inválida. Use o formato AAAA-MM-DD.");
        return;
      }
      const dueDateISO = getContractNextReceiptDateISO(state.contracts);
      const expectedAmount = Number(calculateContractsResult(state.contracts).monthlyRevenue || 0);
      const settlement = promptPaymentSettlement({
        title: "Pagamento de contrato",
        expectedAmount,
      });
      if (!settlement) return;
      const paidContract = registerContractPayment(state.contracts, toISODateOnly(paymentDate), settlement);
      const previousContract = { ...state.contracts };
      state.contracts = { ...paidContract };
      if (state.activeContractId) {
        const idx = state.contractsPortfolio.findIndex((item) => item.id === state.activeContractId);
        if (idx >= 0) state.contractsPortfolio[idx] = paidContract;
      }
      const autoIncomeId = `${paidContract.id}:${dueDateISO}`;
      const hasAutoIncome = (state.balance.entries || []).some(
        (entry) => String(entry.linkedContractPaymentId || "") === autoIncomeId,
      );
      if (!hasAutoIncome) {
        const contractName = String(paidContract.contractName || "Sem nome").trim() || "Sem nome";
        const discountText = Number(settlement.discountAmount || 0) > 0
          ? ` | Desconto: ${currencyBRL.format(settlement.discountAmount)} (${settlement.discountReason})`
          : "";
        const incomeEntry = {
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          type: "income",
          description: `Recebimento do contrato ${contractName} (${formatDateBR(dueDateISO)})${discountText}`,
          amount: Number(settlement.paidAmount || 0),
          dateTime: `${toISODateOnly(paymentDate)}T12:00`,
          responsible: "",
          contractId: String(paidContract.id || ""),
          category: "recebimento_contrato",
          employeeId: "",
          linkedContractPaymentId: autoIncomeId,
        };
        state.balance.entries.push(incomeEntry);
      }
      saveState();
      void logAuditAction({
        action: "mark_paid",
        module: "contracts",
        entityType: "contract_receipt",
        entityId: paidContract.id,
        description: "Recebimento mensal marcado como pago.",
        before: previousContract,
        after: paidContract,
        metadata: {
          paymentDateISO: toISODateOnly(paymentDate),
          dueDateISO,
          expectedAmount: Number(settlement.expectedAmount || 0),
          paidAmount: Number(settlement.paidAmount || 0),
          discountAmount: Number(settlement.discountAmount || 0),
          discountReason: String(settlement.discountReason || ""),
          autoBalanceIncomeLinkedId: autoIncomeId,
        },
      });
      renderAll();
    };
  }

  const contractsForm = document.getElementById("contractsForm");
  if (contractsForm) {
    contractsForm.querySelectorAll("input, select, textarea").forEach((field) => {
      field.disabled = !uiState.contractsEditMode;
    });
  }

  const filtered = state.contractsPortfolio
    .filter((item) => (uiState.contractsSavedView === "effective" ? item.isEffective : !item.isEffective))
    .map((item) => ({ item, result: calculateContractsResult(item) }))
    .sort((a, b) => new Date(b.item.updatedAt).getTime() - new Date(a.item.updatedAt).getTime());

  if (!filtered.length) {
    listContainer.innerHTML = uiState.contractsSavedView === "effective"
      ? '<div class="small">Nenhum contrato efetivado.</div>'
      : '<div class="small">Nenhum contrato em rascunho.</div>';
    return;
  }

  const rows = filtered
    .map(({ item, result }) => {
      const clientName = getClientById(item.clientId)?.clientName || "-";
      const isVisible = Boolean(uiState.contractsVisibleValuesById?.[item.id]);
      const nextReceiptISO = getContractNextReceiptDateISO(item);
      const overdueTag = isContractOverdue(item) ? '<span class="tag-overdue">Atrasado</span>' : "";
      return `
      <tr>
        <td>${escapeHtml(item.contractName || "Sem nome")}</td>
        <td>${escapeHtml(clientName)}</td>
        <td>${formatDateBR(nextReceiptISO)} ${overdueTag}</td>
        <td class="contracts-sensitive-value ${isVisible ? "" : "contracts-sensitive-value-hidden"} balance-income">${currencyBRL.format(result.monthlyRevenue)}</td>
        <td class="contracts-sensitive-value ${isVisible ? "" : "contracts-sensitive-value-hidden"} ${result.monthlyProfit >= 0 ? "balance-income" : "balance-expense"}">${currencyBRL.format(result.monthlyProfit)}</td>
        <td>${formatDateTimeBR(item.updatedAt)}</td>
        <td>
          <div class="exports-actions">
            <button type="button" class="btn contracts-eye-btn" data-action="toggle-contract-values" data-contract-id="${escapeHtml(item.id)}" title="${isVisible ? "Ocultar valores" : "Mostrar valores"}" aria-label="${isVisible ? "Ocultar valores" : "Mostrar valores"}">${isVisible ? "◉" : "◎"}</button>
            ${hasPermission("editContracts") ? `<button type="button" class="btn" data-action="edit-contract" data-contract-id="${escapeHtml(item.id)}">Editar</button>` : ""}
            <button type="button" class="btn" data-action="open-contract" data-contract-id="${escapeHtml(item.id)}">Abrir</button>
            ${hasPermission("editContracts") ? `<button type="button" class="btn btn-danger" data-action="delete-contract" data-contract-id="${escapeHtml(item.id)}">Excluir</button>` : ""}
          </div>
        </td>
      </tr>
    `;
    })
    .join("");

  listContainer.innerHTML = `
    <table class="balance-table">
      <thead>
        <tr>
          <th>Contrato</th>
          <th>Cliente</th>
          <th>Próx. recebimento</th>
          <th>Faturamento mensal</th>
          <th>Lucro mensal</th>
          <th>Atualizado em</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

function renderNotifications() {
  const btn = document.getElementById("btnNotifications");
  const badge = document.getElementById("notificationsBadge");
  const panel = document.getElementById("notificationsPanel");
  if (!btn || !badge || !panel) return;

  const items = [...getContractNotificationItems(), ...getRentedPropertyNotificationItems()]
    .sort((a, b) => String(a.dueDateISO || "").localeCompare(String(b.dueDateISO || "")));
  const total = items.length;
  badge.textContent = String(total);
  badge.classList.toggle("auth-hidden", total <= 0);
  btn.classList.toggle("btn-primary", total > 0);
  panel.classList.toggle("auth-hidden", !uiState.notificationsOpen);

  if (!items.length) {
    panel.innerHTML = '<div class="small">Sem notificações pendentes.</div>';
    return;
  }

  panel.innerHTML = items
    .map((item) => {
      if (item.type === "rented_property") {
        return `
          <article class="notification-item">
            <div><strong>${escapeHtml(item.propertyName)}</strong> <span class="tag-overdue">Atrasado</span></div>
            <div class="small">Aluguel pendente desde ${formatDateBR(item.dueDateISO)}</div>
            <div style="margin-top: 8px;">
              <button type="button" class="btn btn-primary" data-action="open-notification-rented-property" data-rented-property-id="${escapeHtml(item.id)}">Abrir imóvel alugado</button>
            </div>
          </article>
        `;
      }
      if (item.type === "rented_property_contract_notice") {
        return `
          <article class="notification-item">
            <div><strong>${escapeHtml(item.propertyName)}</strong> <span class="tag-overdue">Aviso pr&#233;vio</span></div>
            <div class="small">Contrato encerra em ${item.daysBeforeEnd} dias (${formatDateBR(item.dueDateISO)}).</div>
            <div style="margin-top: 8px;">
              <button type="button" class="btn btn-primary" data-action="open-notification-rented-property" data-rented-property-id="${escapeHtml(item.id)}">Abrir imóvel alugado</button>
            </div>
          </article>
        `;
      }
      return `
        <article class="notification-item">
          <div><strong>${escapeHtml(item.contractName)}</strong> <span class="tag-overdue">Atrasado</span></div>
          <div class="small">Recebimento pendente desde ${formatDateBR(item.dueDateISO)}</div>
          <div style="margin-top: 8px;">
            <button type="button" class="btn btn-primary" data-action="open-notification-contract" data-contract-id="${escapeHtml(item.id)}">Abrir contrato</button>
          </div>
        </article>
      `;
    })
    .join("");
}

function exportTypeLabel(type) {
  return type === "payslip" ? "Contracheque" : "Proposta Comercial";
}

function cloudStatusLabel(status) {
  if (status === "synced") return "Sincronizado";
  if (status === "failed") return "Falha";
  return "Pendente";
}

function renderExports() {
  const endpointInput = document.getElementById("cloudSyncEndpoint");
  const statusContainer = document.getElementById("cloudSyncStatus");
  const listContainer = document.getElementById("exportsList");
  if (!endpointInput || !statusContainer || !listContainer) return;

  endpointInput.value = getCloudSyncEndpoint();
  statusContainer.textContent = endpointInput.value
    ? "Endpoint configurado."
    : "Configure um endpoint para enviar os PDFs exportados para a nuvem.";

  const shouldRefreshSharedExports = authState.mode === "supabase"
    && authState.user
    && !cloudSyncState.sharedExportsLoading
    && (
      !cloudSyncState.sharedExportsLoaded
      || (Date.now() - Number(cloudSyncState.sharedExportsLastSyncAt || 0)) > 15000
    );
  if (shouldRefreshSharedExports) {
    void loadSharedExportsFromCloud(true).then(() => {
      renderExports();
    });
  }

  const rows = [...getAllAvailableExports()]
    .sort((a, b) => new Date(b.exportedAt).getTime() - new Date(a.exportedAt).getTime())
    .map(
      (entry) => `
        <tr>
          <td>${escapeHtml(exportTypeLabel(entry.type))}</td>
          <td>${formatDateTimeBR(entry.exportedAt)}</td>
          <td>${escapeHtml(entry.companyName || "-")}</td>
          <td>${escapeHtml(entry.proposalNumber || "-")}</td>
          <td>${escapeHtml(entry.createdByEmail || "-")}</td>
          <td>${escapeHtml(cloudStatusLabel(entry.cloudStatus))}</td>
          <td>
            <div class="exports-actions">
              <button type="button" class="btn" data-action="preview-export" data-export-id="${escapeHtml(entry.id)}">${entry.type === "payslip" ? "Ver contracheque" : "Ver proposta"}</button>
              <button type="button" class="btn" data-action="edit-export" data-export-id="${escapeHtml(entry.id)}">Abrir para editar</button>
              <button type="button" class="btn" data-action="sync-export" data-export-id="${escapeHtml(entry.id)}">Sincronizar</button>
              <button type="button" class="btn btn-danger" data-action="delete-export" data-export-id="${escapeHtml(entry.id)}">Apagar</button>
            </div>
          </td>
        </tr>
      `,
    )
    .join("");

  listContainer.innerHTML = rows
    ? `
      <table class="balance-table">
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Exportado em</th>
            <th>Cliente</th>
            <th>Nº Proposta</th>
            <th>Criado por</th>
            <th>Status nuvem</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `
    : '<div class="small">Nenhum documento exportado ainda.</div>';
}

function loadExportForEditing(exportRecord) {
  if (!exportRecord || !exportRecord.snapshot) return;
  const snapshot = exportRecord.snapshot;

  if (exportRecord.type === "proposal") {
    state.company = cloneSnapshot(snapshot.company || {});
    state.clients = cloneSnapshot(snapshot.clients || state.clients || []);
    state.property = cloneSnapshot(snapshot.property || {});
    state.furniture = cloneSnapshot(snapshot.furniture || []);
    state.proposalPhotos = cloneSnapshot(snapshot.proposalPhotos || []);
    state.pricing = cloneSnapshot(snapshot.pricing || {});
    state.proposal = cloneSnapshot(snapshot.proposal || {});
    persistActiveContract({
      ...(getActiveContractRecord() || state.contracts),
      ...cloneSnapshot(snapshot.contracts || {}),
    });
    normalizeStatePatterns();
    saveState();
    renderAll();
    setActiveTab("proposals");
    setProposalStep(1);
    return;
  }

  if (exportRecord.type === "payslip") {
    state.payslip = {
      ...state.payslip,
      ...cloneSnapshot(snapshot.payslip || {}),
      earnings: cloneSnapshot((snapshot.payslip && snapshot.payslip.earnings) || []),
      discounts: cloneSnapshot((snapshot.payslip && snapshot.payslip.discounts) || []),
    };
    normalizeStatePatterns();
    saveState();
    uiState.payslipFormOpen = true;
    renderAll();
    setActiveTab("payslip");
  }
}

function loadExportForPreview(exportRecord) {
  if (!exportRecord || !exportRecord.snapshot) return;
  const snapshot = exportRecord.snapshot;

  if (exportRecord.type === "proposal") {
    state.company = cloneSnapshot(snapshot.company || {});
    state.clients = cloneSnapshot(snapshot.clients || state.clients || []);
    state.property = cloneSnapshot(snapshot.property || {});
    state.furniture = cloneSnapshot(snapshot.furniture || []);
    state.proposalPhotos = cloneSnapshot(snapshot.proposalPhotos || []);
    state.pricing = cloneSnapshot(snapshot.pricing || {});
    state.proposal = cloneSnapshot(snapshot.proposal || {});
    persistActiveContract({
      ...(getActiveContractRecord() || state.contracts),
      ...cloneSnapshot(snapshot.contracts || {}),
    });
    normalizeStatePatterns();
    saveState();
    uiState.proposalStarted = true;
    renderAll();
    setActiveTab("proposals");
    setProposalStep(6);
    return;
  }

  if (exportRecord.type === "payslip") {
    state.payslip = {
      ...state.payslip,
      ...cloneSnapshot(snapshot.payslip || {}),
      earnings: cloneSnapshot((snapshot.payslip && snapshot.payslip.earnings) || []),
      discounts: cloneSnapshot((snapshot.payslip && snapshot.payslip.discounts) || []),
    };
    normalizeStatePatterns();
    saveState();
    uiState.payslipFormOpen = true;
    renderAll();
    setActiveTab("payslip");
  }
}

function renderAll() {
  ensureContractsPortfolio();
  applyPermissionsUi();
  setFormValues(document.getElementById("companyForm"), state.company);
  setFormValues(document.getElementById("propertyForm"), state.property);
  setFormValues(document.getElementById("pricingForm"), state.pricing);
  setFormValues(document.getElementById("proposalForm"), state.proposal);
  setFormValues(document.getElementById("payslipForm"), state.payslip);
  applyPayslipFormDefaults();
  setFormValues(document.getElementById("contractsForm"), state.contracts);
  refreshBrazilianPatternInputs();
  setupBRLInputs(document.getElementById("clientCatalogForm"));
  setupBRLInputs(document.getElementById("employeeCatalogForm"));
  setupBRLInputs(document.getElementById("propertyForm"));
  setupBRLInputs(document.getElementById("payslipForm"));
  setupBRLInputs(document.getElementById("earningForm"));
  setupBRLInputs(document.getElementById("discountForm"));
  setupBRLInputs(document.getElementById("incomeForm"));
  setupBRLInputs(document.getElementById("expenseForm"));
  setupBRLInputs(document.getElementById("rentedPropertyForm"));
  renderPendingEmployeeDocuments();
  renderProposalPhotosList();
  renderHomeDashboard();

  const contractsForm = document.getElementById("contractsForm");
  if (contractsForm) {
    CONTRACT_MONEY_FIELDS.forEach((field) => {
      const input = contractsForm.elements.namedItem(field);
      if (input) input.value = formatBRLInputValue(input.value);
    });
    setupBRLInputs(contractsForm);
  }

  renderFurnitureList();

  renderProposal();
  renderList(
    document.getElementById("earningList"),
    state.payslip.earnings,
    (item) => `${item.description}: ${currencyBRL.format(Number(item.value || 0))}`,
    (index) => removeByIndex(state.payslip.earnings, index),
  );
  renderList(
    document.getElementById("discountList"),
    state.payslip.discounts,
    (item) => `${item.description}: ${currencyBRL.format(Number(item.value || 0))}`,
    (index) => removeByIndex(state.payslip.discounts, index),
  );
  renderPayslip();
  renderPayslipModule();
  renderSavedPayslipEmployees();
  renderClientsModule();
  renderEmployeesModule();
  renderClientDetailsView();
  renderEmployeeDetailsView();
  renderClientSelects();
  renderProposalEntryGate();
  renderClientCatalog();
  renderEmployeeCatalog();
  renderBalance();
  renderTaxes();
  renderContracts();
  renderRentedPropertiesModule();
  renderExports();
  renderNotifications();
}

function renderHomeDashboard() {
  const greeting = document.getElementById("homeGreeting");
  const grid = document.getElementById("homeModulesGrid");
  if (!greeting || !grid) return;

  const name = authState.user ? getUserDisplayNameFromEmail() : "usuário";
  greeting.textContent = `Olá ${name}, o que você precisa fazer agora?`;

  const items = [
    { tab: "proposals", title: "Propostas Comerciais", description: "Criar, editar e exportar propostas." },
    { tab: "clients", title: "Clientes", description: "Consultar e gerenciar clientes." },
    { tab: "employees", title: "Funcionários", description: "Consultar e gerenciar funcionários." },
    { tab: "payslip", title: "Contracheque", description: "Gerar e exportar contracheques." },
    { tab: "balance", title: "Balanço", description: "Lançar entradas/saídas e acompanhar resultados." },
    { tab: "taxes", title: "Impostos", description: "Registrar faturamento, impostos e alíquota." },
    { tab: "contracts", title: "Contratos", description: "Gerenciar contratos e recebimentos." },
    { tab: "rentedProperties", title: "Imóveis Alugados", description: "Controlar alugueis e vencimentos." },
    { tab: "exports", title: "Exportados", description: "Acessar documentos exportados." },
  ].filter((item) => canAccessTab(item.tab));

  grid.innerHTML = items
    .map(
      (item) => `
      <button type="button" class="home-module-card" data-home-tab="${item.tab}">
        <strong>${item.title}</strong>
        <span>${item.description}</span>
      </button>
    `,
    )
    .join("");
}

function validatePayslipRequiredFields() {
  const payslipForm = document.getElementById("payslipForm");
  if (!payslipForm) return false;
  applyPayslipFormDefaults();
  if (!payslipForm.reportValidity()) return false;

  const cpfInput = payslipForm.elements.namedItem("employeeCpf");
  if (cpfInput) {
    const cpfDigits = onlyDigits(cpfInput.value || "");
    if (cpfDigits.length !== 11) {
      alert("Preencha um CPF válido com 11 dígitos.");
      cpfInput.focus();
      return false;
    }
  }

  const referenceMonthISO = String(payslipForm.elements.namedItem("referenceMonth")?.value || "").trim();
  const paymentDateISO = String(payslipForm.elements.namedItem("paymentDate")?.value || "").trim();
  const reference = inferReferenceYearMonth(referenceMonthISO, paymentDateISO);
  const monthTotalDays = getDaysInMonth(reference.year, reference.month);
  const firstWorkDateISO = String(payslipForm.elements.namedItem("firstWorkDayInMonth")?.value || "").trim();
  const lastWorkDateISO = String(payslipForm.elements.namedItem("lastWorkDayInMonth")?.value || "").trim();
  const businessDays = Number(payslipForm.elements.namedItem("businessDaysInMonth")?.value || 0);
  const absenceDays = Number(payslipForm.elements.namedItem("absenceDays")?.value || 0);
  const allowanceDays = Number(payslipForm.elements.namedItem("allowanceDays")?.value || 0);
  const referenceYear = reference.year;
  const referenceMonth = reference.month;
  const resolvedPeriod = resolveWorkPeriodFromDateInputs({
    year: referenceYear,
    monthNumber: referenceMonth,
    monthTotalDays,
    firstWorkDateISO,
    lastWorkDateISO,
  });
  if (!resolvedPeriod.ok) {
    alert(resolvedPeriod.message);
    payslipForm.elements.namedItem("firstWorkDayInMonth")?.focus();
    return false;
  }
  if (businessDays <= 0) {
    alert("Informe os dias úteis do mês com valor maior que zero.");
    payslipForm.elements.namedItem("businessDaysInMonth")?.focus();
    return false;
  }
  const businessDaysByRange = countWeekdaysBetweenDays(
    referenceYear,
    referenceMonth,
    resolvedPeriod.firstDay,
    resolvedPeriod.lastDay,
  );
  if (businessDays > businessDaysByRange) {
    alert(`Dias úteis considerados não podem ser maiores que os dias úteis do período trabalhado (${businessDaysByRange}).`);
    payslipForm.elements.namedItem("businessDaysInMonth")?.focus();
    return false;
  }
  if (absenceDays > businessDays) {
    alert("Faltas não podem ser maiores que os dias úteis considerados no período.");
    payslipForm.elements.namedItem("absenceDays")?.focus();
    return false;
  }
  if (allowanceDays > absenceDays) {
    alert("Dias de abono não podem ser maiores que os dias de falta.");
    payslipForm.elements.namedItem("allowanceDays")?.focus();
    return false;
  }

  return true;
}

function bindEvents() {
  const modulesToggle = document.getElementById("btnModulesToggle");
  const modulesMenu = document.getElementById("modulesMenu");
  const btnNotifications = document.getElementById("btnNotifications");
  const notificationsPanel = document.getElementById("notificationsPanel");
  if (modulesToggle && modulesMenu) {
    modulesToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isHidden = modulesMenu.classList.contains("modules-menu-hidden");
      setModulesMenuOpen(isHidden);
    });
    document.addEventListener("click", (event) => {
      if (!(event.target instanceof HTMLElement)) return;
      if (modulesMenu.contains(event.target) || modulesToggle.contains(event.target)) return;
      setModulesMenuOpen(false);
      if (notificationsPanel && btnNotifications) {
        if (notificationsPanel.contains(event.target) || btnNotifications.contains(event.target)) return;
      }
      uiState.notificationsOpen = false;
      renderNotifications();
    });
  }
  if (btnNotifications && notificationsPanel) {
    btnNotifications.addEventListener("click", (event) => {
      event.stopPropagation();
      uiState.notificationsOpen = !uiState.notificationsOpen;
      renderNotifications();
    });
    notificationsPanel.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest("button[data-action]");
      if (!button) return;
      const action = String(button.getAttribute("data-action") || "");
      if (action === "open-notification-contract") {
        const contractId = String(button.getAttribute("data-contract-id") || "");
        if (!contractId) return;
        setActiveContractById(contractId);
        uiState.contractsFormOpen = true;
        uiState.contractsEditMode = false;
        uiState.contractsSummaryVisible = false;
        uiState.contractsSavedView = "effective";
        uiState.notificationsOpen = false;
        setActiveTab("contracts");
        renderAll();
        return;
      }
      if (action === "open-notification-rented-property") {
        const propertyId = String(button.getAttribute("data-rented-property-id") || "");
        if (!propertyId) return;
        uiState.editingRentedPropertyId = propertyId;
        uiState.rentedPropertiesFormOpen = true;
        uiState.notificationsOpen = false;
        setActiveTab("rentedProperties");
        renderAll();
      }
    });
  }

  const authTabLogin = document.getElementById("authTabLogin");
  const authTabSignup = document.getElementById("authTabSignup");
  const authTabForgot = document.getElementById("authTabForgot");
  const btnToggleSupabaseConfig = document.getElementById("btnToggleSupabaseConfig");
  if (authTabLogin) authTabLogin.addEventListener("click", () => switchAuthTab("login"));
  if (authTabSignup) authTabSignup.addEventListener("click", () => switchAuthTab("signup"));
  if (authTabForgot) authTabForgot.addEventListener("click", () => switchAuthTab("forgot"));
  if (btnToggleSupabaseConfig) {
    btnToggleSupabaseConfig.addEventListener("click", () => {
      toggleSupabaseConfig();
    });
  }
  const btnUseTestAccess = document.getElementById("btnUseTestAccess");
  if (btnUseTestAccess) {
    btnUseTestAccess.addEventListener("click", () => {
      setAuthMessage("Login de teste desativado.", true);
    });
  }

  const authConfigForm = document.getElementById("authConfigForm");
  if (authConfigForm) {
    authConfigForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!canEditAuthConfig()) {
        setAuthMessage("Configuração de acesso bloqueada.", true);
        return;
      }
      const url = String(document.getElementById("supabaseUrlInput").value || "").trim();
      const anon = String(document.getElementById("supabaseAnonKeyInput").value || "").trim();
      setLocalTestSession(false);
      setSupabaseConfig(url, anon);
      if (url && anon) setAuthConfigLocked(true);
      setAuthMessage("Configuração salva. Inicializando autenticação...");
      await initAuthClient();
    });
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const data = formToObject(event.currentTarget);
      if (ALLOW_LOCAL_TEST_LOGIN && isLocalTestCredential(data.email, data.password)) {
        setLocalTestSession(true);
        authState.mode = "local";
        authState.user = { email: LOCAL_TEST_EMAIL };
        await loadCurrentUserPermissions();
        showAppShell(true);
        setAuthMessage("Login de teste realizado.");
        renderAll();
        return;
      }
      if (!authState.client) {
        await initAuthClient();
      }
      if (!authState.client) {
        setAuthMessage("Serviço de login indisponível no momento. Tente novamente.", true);
        return;
      }
      const { error } = await authState.client.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });
      if (error) {
        setAuthMessage(error.message, true);
        return;
      }
      setAuthMessage("Login realizado com sucesso.");
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!ALLOW_PUBLIC_SIGNUP) {
        setAuthMessage("Cadastro público desativado. Solicite criação ao administrador.", true);
        return;
      }
      if (!authState.client) {
        setAuthMessage("Configure o acesso antes do cadastro.", true);
        return;
      }
      const data = formToObject(event.currentTarget);
      const { error } = await authState.client.auth.signUp({
        email: data.email,
        password: data.password,
        options: { emailRedirectTo: getRedirectUrl() },
      });
      if (error) {
        setAuthMessage(error.message, true);
        return;
      }
      setAuthMessage("Cadastro enviado. Verifique seu e-mail para confirmar a conta.");
    });
  }

  const forgotForm = document.getElementById("forgotForm");
  if (forgotForm) {
    forgotForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!authState.client) {
        setAuthMessage("Configure o acesso antes de recuperar senha.", true);
        return;
      }
      const data = formToObject(event.currentTarget);
      const { error } = await authState.client.auth.resetPasswordForEmail(data.email, {
        redirectTo: getRedirectUrl(),
      });
      if (error) {
        setAuthMessage(error.message, true);
        return;
      }
      setAuthMessage("E-mail de recuperação enviado.");
    });
  }

  const resetForm = document.getElementById("resetForm");
  if (resetForm) {
    resetForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!authState.client) {
        setAuthMessage("Configure o acesso antes de redefinir senha.", true);
        return;
      }
      const data = formToObject(event.currentTarget);
      const { error } = await authState.client.auth.updateUser({ password: data.password });
      if (error) {
        setAuthMessage(error.message, true);
        return;
      }
      setAuthMessage("Senha atualizada. Faça login novamente.");
      switchAuthTab("login");
      if (window.location.hash) window.history.replaceState({}, document.title, getRedirectUrl());
    });
  }

  document.getElementById("btnLogout").addEventListener("click", async () => {
    setLocalTestSession(false);
    if (authState.mode === "supabase" && authState.user) {
      await saveCloudStateNow();
    }
    stopSharedStateRefreshTimer();
    if (cloudSyncState.saveTimer) clearTimeout(cloudSyncState.saveTimer);
    cloudSyncState.saveTimer = null;
    cloudSyncState.hasLoadedFromCloud = false;
    cloudSyncState.pendingSave = false;
    cloudSyncState.sharedExports = [];
    cloudSyncState.sharedExportsLoaded = false;
    cloudSyncState.sharedExportsLoading = false;
    cloudSyncState.sharedExportsLastSyncAt = 0;
    cloudSyncState.sharedStateLastUpdatedAt = 0;
    if (authState.client) {
      try {
        await authState.client.auth.signOut();
      } catch (error) {
        console.warn("[auth] Falha ao encerrar sessão Supabase:", error);
      }
    }
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith("sb-") && key.includes("-auth-token")) localStorage.removeItem(key);
    });
    authState.user = null;
    authState.mode = "none";
    authState.permissions = getDefaultPermissions();
    showAppShell(false);
    switchAuthTab("login");
    setAuthMessage("Sessão encerrada.");
    renderAll();
  });

  document.getElementById("tabHome").addEventListener("click", () => {
    setActiveTab("home");
  });

  document.getElementById("tabProposals").addEventListener("click", () => {
    setActiveTab("proposals");
  });

  document.getElementById("tabClients").addEventListener("click", () => {
    setActiveTab("clients");
  });

  document.getElementById("tabPayslip").addEventListener("click", () => {
    setActiveTab("payslip");
    renderPayslipModule();
  });

  document.getElementById("tabEmployees").addEventListener("click", () => {
    setActiveTab("employees");
  });

  document.getElementById("tabBalance").addEventListener("click", () => {
    setActiveTab("balance");
  });

  document.getElementById("tabTaxes").addEventListener("click", () => {
    setActiveTab("taxes");
    renderTaxes();
  });

  document.getElementById("tabContracts").addEventListener("click", () => {
    setActiveTab("contracts");
    renderContracts();
  });

  document.getElementById("tabRentedProperties").addEventListener("click", () => {
    setActiveTab("rentedProperties");
    renderRentedPropertiesModule();
  });

  document.getElementById("tabExports").addEventListener("click", () => {
    setActiveTab("exports");
    renderExports();
  });

  document.getElementById("homeModulesGrid")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const card = target.closest("[data-home-tab]");
    if (!card) return;
    const nextTab = String(card.getAttribute("data-home-tab") || "");
    if (!nextTab) return;
    setActiveTab(nextTab);
    renderAll();
  });

  const applyTabFromUrl = () => {
    const tabFromUrl = getTabFromLocation();
    setActiveTab(tabFromUrl, { syncUrl: false });
    renderAll();
  };
  window.addEventListener("popstate", applyTabFromUrl);
  window.addEventListener("hashchange", applyTabFromUrl);

  window.addEventListener("focus", () => {
    void refreshStateFromCloudIfNewer(false);
  });

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      void refreshStateFromCloudIfNewer(false);
    }
  });

  document.getElementById("btnBalanceMonthly").addEventListener("click", () => {
    uiState.balanceMode = "monthly";
    renderBalance();
  });

  document.getElementById("btnBalanceYearly").addEventListener("click", () => {
    uiState.balanceMode = "yearly";
    renderBalance();
  });

  document.getElementById("balanceYearSelect").addEventListener("change", (event) => {
    uiState.balanceYear = Number(event.currentTarget.value || uiState.balanceYear);
    renderBalance();
  });

  document.getElementById("balanceMonthSelect").addEventListener("change", (event) => {
    uiState.balanceMonth = Number(event.currentTarget.value || uiState.balanceMonth);
    renderBalance();
  });

  document.getElementById("balanceContractSelect").addEventListener("change", (event) => {
    uiState.balanceContractId = String(event.currentTarget.value || "");
    renderBalance();
  });

  const taxesForm = document.getElementById("taxesForm");
  if (taxesForm) {
    setupBRLInputs(taxesForm);
    if (!taxesForm.elements.namedItem("referenceMonth").value) {
      taxesForm.elements.namedItem("referenceMonth").value = formatYearMonthISO(new Date().getFullYear(), new Date().getMonth() + 1);
    }
    taxesForm.addEventListener("input", () => {
      renderTaxes();
    });
    taxesForm.addEventListener("change", () => {
      renderTaxes();
    });
    taxesForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const data = formToObject(event.currentTarget);
      const parsedMonth = parseYearMonthISO(data.referenceMonth);
      if (!parsedMonth) {
        alert("Informe um mês de referência válido.");
        return;
      }
      const referenceMonth = formatYearMonthISO(parsedMonth.year, parsedMonth.month);
      const grossRevenue = parseBRLNumber(data.grossRevenue || 0);
      const taxPaid = parseBRLNumber(data.taxPaid || 0);
      const paymentDateISO = String(data.paymentDateISO || "").trim();
      const notes = String(data.notes || "").trim();

      const duplicate = (state.taxes.records || []).find(
        (record) => record.referenceMonth === referenceMonth && record.id !== uiState.editingTaxRecordId,
      );
      if (duplicate) {
        alert("Já existe lançamento de impostos para este mês. Edite o registro existente.");
        return;
      }

      const record = {
        id: uiState.editingTaxRecordId || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        referenceMonth,
        grossRevenue,
        taxPaid,
        paymentDateISO,
        notes,
        updatedAt: new Date().toISOString(),
      };
      const idx = (state.taxes.records || []).findIndex((item) => item.id === record.id);
      if (idx >= 0) state.taxes.records[idx] = record;
      else state.taxes.records.push(record);
      upsertTaxBalanceEntry(record);
      state.taxes.records = (state.taxes.records || []).sort((a, b) =>
        String(b.referenceMonth || "").localeCompare(String(a.referenceMonth || "")),
      );
      uiState.editingTaxRecordId = "";
      clearTaxesForm();
      saveState();
      renderAll();
    });
  }

  document.getElementById("taxesList")?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-action]");
    if (!button) return;
    const action = String(button.getAttribute("data-action") || "");
    const taxId = String(button.getAttribute("data-tax-id") || "");
    if (!taxId) return;
    const record = (state.taxes.records || []).find((item) => item.id === taxId);
    if (!record) return;

    if (action === "edit-tax") {
      uiState.editingTaxRecordId = record.id;
      setTaxesFormValues(record);
      renderTaxes();
      return;
    }
    if (action === "delete-tax") {
      if (!confirm("Deseja apagar este lançamento de impostos?")) return;
      state.taxes.records = (state.taxes.records || []).filter((item) => item.id !== taxId);
      state.balance.entries = (state.balance.entries || []).filter(
        (entry) => String(entry.linkedTaxRecordId || "") !== taxId,
      );
      if (uiState.editingTaxRecordId === taxId) clearTaxesForm();
      saveState();
      renderAll();
    }
  });

  document.getElementById("btnPrevStep").addEventListener("click", () => {
    setProposalStep(uiState.proposalStep - 1);
  });

  document.getElementById("btnNextStep").addEventListener("click", () => {
    setProposalStep(uiState.proposalStep + 1);
  });

  document.querySelectorAll(".step-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      setProposalStep(Number(chip.getAttribute("data-step-jump")));
    });
  });

  document.getElementById("btnStartProposalWithClient").addEventListener("click", () => {
    const select = document.getElementById("proposalEntryClientSelect");
    const clientId = String(select?.value || "");
    if (!clientId) {
      alert("Selecione um cliente para iniciar a proposta.");
      return;
    }
    uiState.proposalStarted = true;
    uiState.proposalStep = 1;
    useClientInProposal(clientId);
    renderProposalEntryGate();
  });

  document.getElementById("btnStartProposalWithoutClient").addEventListener("click", () => {
    uiState.proposalStarted = true;
    uiState.proposalStep = 1;
    state.company = { ...state.company, clientId: "" };
    saveState();
    renderAll();
  });

  setActiveTab(getTabFromLocation(), { replaceUrl: true });
  uiState.proposalStarted = false;
  setProposalStep(1);
  renderProposalEntryGate();

  renderDefaultFurnitureOptions();

  document.querySelectorAll("input[name]").forEach((input) => {
    if (input.dataset.brPatternBound === "1") return;
    input.dataset.brPatternBound = "1";
    applyBrazilianInputPattern(input, "input");
    input.addEventListener("input", () => {
      applyBrazilianInputPattern(input, "input");
    });
    input.addEventListener("blur", () => {
      applyBrazilianInputPattern(input, "blur");
    });
  });

  const companyForm = document.getElementById("companyForm");
  const persistCompanyForm = () => {
    const currentClientId = String(state.company.clientId || "");
    state.company = formToObject(companyForm);
    state.company.clientId = currentClientId;
    state.company.cnpj = formatCNPJ(state.company.cnpj);
    state.company.phone = formatPhoneBR(state.company.phone);
    state.company.email = String(state.company.email || "").trim().toLowerCase();
    saveState();
    renderProposal();
  };
  companyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    persistCompanyForm();
    renderAll();
  });
  companyForm.addEventListener("input", () => {
    persistCompanyForm();
  });
  companyForm.addEventListener("change", () => {
    persistCompanyForm();
  });

  document.getElementById("btnUseSelectedClientInProposal").addEventListener("click", () => {
    const select = document.getElementById("proposalClientSelect");
    const clientId = String(select?.value || "");
    if (!clientId) {
      alert("Selecione um cliente para usar na proposta.");
      return;
    }
    useClientInProposal(clientId);
  });

  const clientCatalogForm = document.getElementById("clientCatalogForm");
  const persistClientCatalogForm = () => {
    const data = formToObject(clientCatalogForm);
    data.clientCnpj = formatCNPJ(data.clientCnpj);
    data.clientPhone = formatPhoneBR(data.clientPhone);
    data.clientZipCode = formatCEP(data.clientZipCode);
    data.clientState = String(data.clientState || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 2);
    data.clientEmail = String(data.clientEmail || "").trim().toLowerCase();
    setFormValues(clientCatalogForm, data);
    return data;
  };
  clientCatalogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!hasPermission("editClients")) {
      alert("Sem permissão para editar clientes.");
      return;
    }
    const data = persistClientCatalogForm();
    const clientName = String(data.clientName || "").trim();
    if (!clientName) {
      alert("Preencha o nome do cliente.");
      return;
    }

    const payload = {
      id: uiState.editingClientId || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      clientName,
      clientCnpj: String(data.clientCnpj || ""),
      clientContact: String(data.clientContact || "").trim(),
      clientPhone: String(data.clientPhone || ""),
      clientEmail: String(data.clientEmail || ""),
      clientStreet: String(data.clientStreet || "").trim(),
      clientNumber: String(data.clientNumber || "").trim(),
      clientComplement: String(data.clientComplement || "").trim(),
      clientDistrict: String(data.clientDistrict || "").trim(),
      clientCity: String(data.clientCity || "").trim(),
      clientState: String(data.clientState || "").trim(),
      clientZipCode: String(data.clientZipCode || "").trim(),
      clientNotes: String(data.clientNotes || "").trim(),
    };

    const existingIndex = state.clients.findIndex((item) => item.id === payload.id);
    const duplicateCnpjIndex = state.clients.findIndex(
      (item) => item.clientCnpj && item.clientCnpj === payload.clientCnpj && item.id !== payload.id,
    );
    if (duplicateCnpjIndex >= 0) {
      payload.id = state.clients[duplicateCnpjIndex].id;
    }
    const previousClient = existingIndex >= 0
      ? state.clients[existingIndex]
      : duplicateCnpjIndex >= 0
        ? state.clients[duplicateCnpjIndex]
        : null;
    const isEditing = Boolean(previousClient);

    if (existingIndex >= 0) state.clients[existingIndex] = payload;
    else if (duplicateCnpjIndex >= 0) state.clients[duplicateCnpjIndex] = payload;
    else state.clients.push(payload);

    saveState();
    void logAuditAction({
      action: isEditing ? "update" : "create",
      module: "clients",
      entityType: "client",
      entityId: payload.id,
      description: isEditing ? "Cliente atualizado." : "Cliente criado.",
      before: previousClient,
      after: payload,
    });
    uiState.clientsFormOpen = false;
    uiState.viewingClientId = "";
    resetClientCatalogForm();
    renderAll();
    alert("Cliente salvo com sucesso.");
  });

  document.getElementById("clientCatalogList").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-action]");
    if (!button) return;
    const action = button.getAttribute("data-action");
    const clientId = String(button.getAttribute("data-client-id") || "");
    if (!clientId) return;
    const client = getClientById(clientId);
    if (!client) return;

    if (action === "view-client") {
      uiState.clientsFormOpen = false;
      uiState.viewingClientId = client.id;
      renderAll();
      return;
    }

    if (action === "edit-client") {
      if (!hasPermission("editClients")) {
        alert("Sem permissão para editar clientes.");
        return;
      }
      uiState.viewingClientId = "";
      uiState.clientsFormOpen = true;
      setClientCatalogForm(client);
      renderAll();
      return;
    }

    if (action === "use-client-proposal") {
      useClientInProposal(client.id);
      setActiveTab("proposals");
      return;
    }

    if (action === "delete-client") {
      if (!hasPermission("editClients")) {
        alert("Sem permissão para apagar clientes.");
        return;
      }
      if (!confirm("Deseja apagar este cliente salvo?")) return;
      state.clients = state.clients.filter((item) => item.id !== client.id);
      if (uiState.viewingClientId === client.id) uiState.viewingClientId = "";
      state.contractsPortfolio = state.contractsPortfolio.map((contract) => (
        contract.clientId === client.id ? { ...contract, clientId: "" } : contract
      ));
      if (state.contracts.clientId === client.id) state.contracts.clientId = "";
      saveState();
      void logAuditAction({
        action: "delete",
        module: "clients",
        entityType: "client",
        entityId: client.id,
        description: "Cliente excluído.",
        before: client,
      });
      renderAll();
    }
  });

  const propertyForm = document.getElementById("propertyForm");
  const persistPropertyForm = () => {
    state.property = formToObject(propertyForm);
    state.property.zipCode = formatCEP(state.property.zipCode);
    state.property.state = String(state.property.state || "")
      .toUpperCase()
      .replace(/[^A-Z]/g, "")
      .slice(0, 2);
    saveState();
    renderProposal();
  };
  propertyForm.addEventListener("submit", (event) => {
    event.preventDefault();
    persistPropertyForm();
    renderAll();
  });
  propertyForm.addEventListener("input", () => {
    persistPropertyForm();
  });
  propertyForm.addEventListener("change", () => {
    persistPropertyForm();
  });

  const pricingForm = document.getElementById("pricingForm");
  pricingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.pricing = formToObject(event.currentTarget);
    saveState();
    renderAll();
  });

  pricingForm.addEventListener("input", () => {
    state.pricing = formToObject(pricingForm);
    saveState();
    renderProposal();
  });

  pricingForm.addEventListener("change", () => {
    state.pricing = formToObject(pricingForm);
    saveState();
    renderProposal();
  });

  const proposalForm = document.getElementById("proposalForm");
  proposalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    state.proposal = formToObject(event.currentTarget);
    saveState();
    renderAll();
  });

  proposalForm.addEventListener("input", () => {
    const next = formToObject(proposalForm);
    const day = Number(next.paymentDay || 0);
    next.paymentDay = day >= 1 && day <= 31 ? String(day) : "";
    state.proposal = next;
    saveState();
    renderProposal();
  });

  proposalForm.addEventListener("change", () => {
    const next = formToObject(proposalForm);
    const day = Number(next.paymentDay || 0);
    next.paymentDay = day >= 1 && day <= 31 ? String(day) : "";
    state.proposal = next;
    saveState();
    renderProposal();
  });

  const payslipForm = document.getElementById("payslipForm");
  setupBRLInputs(payslipForm);
  const persistPayslipForm = ({ forceReferenceFromPaymentDate = false } = {}) => {
    const defaults = applyPayslipFormDefaults({ forceReferenceFromPaymentDate });
    const next = formToObject(payslipForm);
    const selectedEmployee = (state.payslipEmployees || []).find(
      (employee) => employee.id === String(next.selectedEmployeeId || state.payslip.selectedEmployeeId || "").trim(),
    ) || null;
    const referenceMonthISO = defaults?.referenceMonthISO || String(next.referenceMonth || "").trim();
    const competence = String(defaults?.competence || "").trim();
    const monthTotalDays = Number(defaults?.monthTotalDays || getDaysInMonth(new Date().getFullYear(), new Date().getMonth() + 1));
    const normalizedFirstDateISO = defaults?.firstWorkDateISO || String(next.firstWorkDayInMonth || "").trim();
    const normalizedLastDateISO = defaults?.lastWorkDateISO || String(next.lastWorkDayInMonth || "").trim();
    const businessDaysInPeriod = Number(defaults?.businessDays || 0);

    state.payslip = {
      ...state.payslip,
      ...next,
      competence,
      referenceMonth: referenceMonthISO,
      employeeCpf: formatCPF(next.employeeCpf),
      baseSalary: String(parseBRLNumber(
        Object.prototype.hasOwnProperty.call(next, "baseSalary") ? next.baseSalary : state.payslip.baseSalary,
      )),
      mealAllowanceFixed: String(parseBRLNumber(
        selectedEmployee
          ? selectedEmployee.mealAllowanceFixed
          : Object.prototype.hasOwnProperty.call(next, "mealAllowanceFixed")
            ? next.mealAllowanceFixed
            : state.payslip.mealAllowanceFixed,
      )),
      mealAllowanceDaily: String(parseBRLNumber(
        selectedEmployee
          ? selectedEmployee.mealAllowanceDaily
          : Object.prototype.hasOwnProperty.call(next, "mealAllowanceDaily")
            ? next.mealAllowanceDaily
            : state.payslip.mealAllowanceDaily,
      )),
      fixedDiscountPercent: String(Number(
        selectedEmployee
          ? selectedEmployee.fixedDiscountPercent
          : Object.prototype.hasOwnProperty.call(next, "fixedDiscountPercent")
            ? next.fixedDiscountPercent
            : state.payslip.fixedDiscountPercent,
      )),
      monthTotalDays: String(monthTotalDays),
      firstWorkDayInMonth: normalizedFirstDateISO,
      lastWorkDayInMonth: normalizedLastDateISO,
      businessDaysInMonth: String(businessDaysInPeriod),
    };
  };
  payslipForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const target = event.target;
    const shouldForceReference = target instanceof HTMLFormElement
      && String(target.elements.namedItem("paymentDate")?.value || "").trim() !== String(state.payslip.paymentDate || "").trim();
    persistPayslipForm({ forceReferenceFromPaymentDate: shouldForceReference });
    saveState();
    renderAll();
  });

  payslipForm.addEventListener("input", (event) => {
    const target = event.target;
    const shouldForceReference = target instanceof HTMLInputElement && target.name === "paymentDate";
    persistPayslipForm({ forceReferenceFromPaymentDate: shouldForceReference });
    saveState();
    renderPayslip();
  });

  payslipForm.addEventListener("change", (event) => {
    const target = event.target;
    const shouldForceReference = target instanceof HTMLInputElement && target.name === "paymentDate";
    persistPayslipForm({ forceReferenceFromPaymentDate: shouldForceReference });
    saveState();
    renderPayslip();
  });

  setupBRLInputs(document.getElementById("earningForm"));
  document.getElementById("earningForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = formToObject(event.currentTarget);
    state.payslip.earnings.push({
      description: data.description,
      value: parseBRLNumber(data.value || 0),
    });
    event.currentTarget.reset();
    setupBRLInputs(document.getElementById("earningForm"));
    saveState();
    renderAll();
  });

  setupBRLInputs(document.getElementById("discountForm"));
  document.getElementById("discountForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = formToObject(event.currentTarget);
    state.payslip.discounts.push({
      description: data.description,
      value: parseBRLNumber(data.value || 0),
    });
    event.currentTarget.reset();
    setupBRLInputs(document.getElementById("discountForm"));
    saveState();
    renderAll();
  });

  document.getElementById("btnOpenEmployeesTab").addEventListener("click", () => {
    uiState.employeesFormOpen = true;
    setActiveTab("employees");
    renderAll();
  });

  document.getElementById("btnNewPayslip").addEventListener("click", () => {
    uiState.payslipFormOpen = true;
    setActiveTab("payslip");
    renderAll();
    window.requestAnimationFrame(() => {
      const input = document.getElementById("payslipForm")?.elements?.namedItem("competence");
      if (input) input.focus();
    });
  });

  document.getElementById("btnBackToPayslipList").addEventListener("click", () => {
    uiState.payslipFormOpen = false;
    renderAll();
  });

  document.getElementById("btnNewClient").addEventListener("click", () => {
    if (!hasPermission("editClients")) {
      alert("Sem permissão para cadastrar clientes.");
      return;
    }
    uiState.clientsFormOpen = true;
    uiState.viewingClientId = "";
    uiState.editingClientId = "";
    resetClientCatalogForm();
    renderAll();
    window.requestAnimationFrame(() => {
      const input = document.getElementById("clientCatalogForm")?.elements?.namedItem("clientName");
      if (input) input.focus();
    });
  });

  document.getElementById("btnBackToClientsList").addEventListener("click", () => {
    uiState.clientsFormOpen = false;
    uiState.viewingClientId = "";
    resetClientCatalogForm();
    renderAll();
  });

  document.getElementById("btnBackFromClientView").addEventListener("click", () => {
    uiState.viewingClientId = "";
    renderAll();
  });

  document.getElementById("btnNewEmployee").addEventListener("click", () => {
    if (!hasPermission("editEmployees")) {
      alert("Sem permissão para cadastrar funcionários.");
      return;
    }
    uiState.employeesFormOpen = true;
    uiState.viewingEmployeeId = "";
    uiState.editingEmployeeId = "";
    resetEmployeeCatalogForm();
    renderAll();
    window.requestAnimationFrame(() => {
      const input = document.getElementById("employeeCatalogForm")?.elements?.namedItem("employeeName");
      if (input) input.focus();
    });
  });

  document.getElementById("btnBackToEmployeesList").addEventListener("click", () => {
    uiState.employeesFormOpen = false;
    uiState.viewingEmployeeId = "";
    resetEmployeeCatalogForm();
    renderAll();
  });

  document.getElementById("btnBackFromEmployeeView").addEventListener("click", () => {
    uiState.viewingEmployeeId = "";
    renderAll();
  });

  document.getElementById("savedPayslipEmployeeSelect").addEventListener("change", (event) => {
    const employeeId = String(event.currentTarget.value || "");
    if (!employeeId) {
      state.payslip.selectedEmployeeId = "";
      saveState();
      return;
    }
    uiState.payslipFormOpen = true;
    loadSavedPayslipEmployee(employeeId);
  });

  const employeeCatalogForm = document.getElementById("employeeCatalogForm");
  setupBRLInputs(employeeCatalogForm);
  const employeeDocsInput = document.getElementById("employeeDocsInput");
  if (employeeDocsInput) {
    employeeDocsInput.addEventListener("change", async () => {
      await addEmployeeDocumentsFromFiles(employeeDocsInput.files);
      employeeDocsInput.value = "";
    });
  }
  employeeCatalogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!hasPermission("editEmployees")) {
      alert("Sem permissão para editar funcionários.");
      return;
    }
    const data = formToObject(employeeCatalogForm);
    const employeeName = String(data.employeeName || "").trim();
    const employeeCpf = formatCPF(data.employeeCpf || "");
    if (!employeeName || !employeeCpf) {
      alert("Preencha nome e CPF do funcionário.");
      return;
    }

    const payload = {
      id: uiState.editingEmployeeId || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      employeeName,
      employeeCpf,
      position: String(data.position || "").trim(),
      registration: String(data.registration || "").trim(),
      baseSalary: String(parseBRLNumber(data.baseSalary || 0)),
      mealAllowanceFixed: String(parseBRLNumber(data.mealAllowanceFixed || 0)),
      mealAllowanceDaily: String(parseBRLNumber(data.mealAllowanceDaily || 0)),
      fixedDiscountPercent: String(Number(data.fixedDiscountPercent || 0)),
      documents: JSON.parse(JSON.stringify(uiState.pendingEmployeeDocuments || [])),
      salaryHistory: [],
    };

    const existingIndex = state.payslipEmployees.findIndex((employee) => employee.id === payload.id);
    const duplicateCpfIndex = state.payslipEmployees.findIndex(
      (employee) => employee.employeeCpf === payload.employeeCpf && employee.id !== payload.id,
    );
    if (duplicateCpfIndex >= 0) {
      payload.id = state.payslipEmployees[duplicateCpfIndex].id;
    }
    const previousEmployee = existingIndex >= 0
      ? state.payslipEmployees[existingIndex]
      : duplicateCpfIndex >= 0
        ? state.payslipEmployees[duplicateCpfIndex]
        : null;
    const isEditing = Boolean(previousEmployee);
    payload.salaryHistory = JSON.parse(JSON.stringify((previousEmployee && previousEmployee.salaryHistory) || []));

    if (existingIndex >= 0) {
      state.payslipEmployees[existingIndex] = payload;
    } else if (duplicateCpfIndex >= 0) {
      state.payslipEmployees[duplicateCpfIndex] = payload;
    } else {
      state.payslipEmployees.push(payload);
    }

    if (state.payslip.selectedEmployeeId === payload.id) {
      uiState.employeesFormOpen = false;
      uiState.viewingEmployeeId = "";
      loadSavedPayslipEmployee(payload.id);
      void logAuditAction({
        action: isEditing ? "update" : "create",
        module: "employees",
        entityType: "employee",
        entityId: payload.id,
        description: isEditing ? "Funcionário atualizado." : "Funcionário criado.",
        before: previousEmployee,
        after: payload,
      });
      return;
    }

    saveState();
    void logAuditAction({
      action: isEditing ? "update" : "create",
      module: "employees",
      entityType: "employee",
      entityId: payload.id,
      description: isEditing ? "Funcionário atualizado." : "Funcionário criado.",
      before: previousEmployee,
      after: payload,
    });
    uiState.employeesFormOpen = false;
    uiState.viewingEmployeeId = "";
    resetEmployeeCatalogForm();
    renderAll();
    alert("Funcionário salvo com sucesso.");
  });

  document.getElementById("employeeCatalogList").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-action]");
    if (!button) return;
    const action = button.getAttribute("data-action");
    const employeeId = button.getAttribute("data-employee-id");
    if (!employeeId) return;

    const employee = state.payslipEmployees.find((item) => item.id === employeeId);
    if (!employee) return;

    if (action === "view-employee") {
      uiState.employeesFormOpen = false;
      uiState.viewingEmployeeId = employee.id;
      renderAll();
      return;
    }

    if (action === "edit-employee") {
      if (!hasPermission("editEmployees")) {
        alert("Sem permissão para editar funcionários.");
        return;
      }
      uiState.viewingEmployeeId = "";
      uiState.employeesFormOpen = true;
      setEmployeeCatalogForm(employee);
      renderAll();
      return;
    }

    if (action === "use-employee") {
      uiState.payslipFormOpen = true;
      loadSavedPayslipEmployee(employee.id);
      setActiveTab("payslip");
      return;
    }

    if (action === "export-employee") {
      exportEmployeeJson(employee);
      return;
    }

    if (action === "delete-employee") {
      if (!hasPermission("editEmployees")) {
        alert("Sem permissão para apagar funcionários.");
        return;
      }
      if (!confirm("Deseja apagar este funcionário salvo?")) return;
      state.payslipEmployees = state.payslipEmployees.filter((item) => item.id !== employee.id);
      if (uiState.viewingEmployeeId === employee.id) uiState.viewingEmployeeId = "";
      if (state.payslip.selectedEmployeeId === employee.id) {
        state.payslip.selectedEmployeeId = "";
      }
      saveState();
      void logAuditAction({
        action: "delete",
        module: "employees",
        entityType: "employee",
        entityId: employee.id,
        description: "Funcionário excluído.",
        before: employee,
      });
      renderAll();
    }
  });

  document.getElementById("btnExportEmployeesCsv").addEventListener("click", () => {
    exportEmployeesCsv();
  });

  document.getElementById("incomeForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = formToObject(event.currentTarget);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: "income",
      description: data.description,
      amount: parseBRLNumber(data.amount || 0),
      dateTime: data.dateTime,
      responsible: "",
      contractId: "",
    };
    state.balance.entries.push(entry);
    event.currentTarget.reset();
    setupBRLInputs(document.getElementById("incomeForm"));
    saveState();
    void logAuditAction({
      action: "create",
      module: "balance",
      entityType: "income_entry",
      entityId: entry.id,
      description: "Lançamento de entrada criado.",
      after: entry,
    });
    renderBalance();
  });

  document.getElementById("expenseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = formToObject(event.currentTarget);
    const category = String(data.category || "").trim().toLowerCase();
    if (!EXPENSE_CATEGORY_LABELS[category]) {
      alert("Selecione uma categoria válida para a despesa.");
      return;
    }
    const categoryRequiresContract = ["aluguel", "manutencao", "agua", "luz", "internet"].includes(category);
    if (categoryRequiresContract && !String(data.contractId || "").trim()) {
      if (category === "manutencao") {
        alert("Selecione o contrato para lançar despesa de manutenção.");
      } else if (category === "agua") {
        alert("Selecione o contrato para lançar despesa de água.");
      } else if (category === "luz") {
        alert("Selecione o contrato para lançar despesa de luz.");
      } else if (category === "internet") {
        alert("Selecione o contrato para lançar despesa de internet.");
      } else {
        alert("Selecione o contrato para lançar despesa de aluguel.");
      }
      return;
    }
    if (category === "salario" && !String(data.employeeId || "").trim()) {
      alert("Selecione o funcionário para lançar despesa de salário.");
      return;
    }
    if (category === "manutencao" && !String(data.maintenanceDetails || "").trim()) {
      alert("Especifique a manutenção realizada.");
      return;
    }
    const entryDescription = buildExpenseDescription(data);
    const entry = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      type: "expense",
      description: entryDescription,
      amount: parseBRLNumber(data.amount || 0),
      dateTime: data.dateTime,
      responsible: data.responsible,
      contractId: (categoryRequiresContract || category === "outros") ? String(data.contractId || "") : "",
      category,
      employeeId: category === "salario" ? String(data.employeeId || "") : "",
      linkedContractPaymentId: "",
    };
    state.balance.entries.push(entry);
    event.currentTarget.reset();
    setupBRLInputs(document.getElementById("expenseForm"));
    toggleExpenseCategoryFields();
    saveState();
    void logAuditAction({
      action: "create",
      module: "balance",
      entityType: "expense_entry",
      entityId: entry.id,
      description: "Lançamento de despesa criado.",
      after: entry,
    });
    renderBalance();
  });
  document.getElementById("expenseCategorySelect")?.addEventListener("change", () => {
    toggleExpenseCategoryFields();
  });

  const salaryPaymentForm = document.getElementById("salaryPaymentForm");
  if (salaryPaymentForm) {
    salaryPaymentForm.addEventListener("input", (event) => {
      const target = event.target;
      const shouldForceReference = target instanceof HTMLInputElement && target.name === "paymentDateISO";
      applySalaryPaymentFormDefaults({ forceReferenceFromPaymentDate: shouldForceReference });
      renderSalaryPaymentPreview();
    });
    salaryPaymentForm.addEventListener("change", (event) => {
      const target = event.target;
      const shouldForceReference = target instanceof HTMLInputElement && target.name === "paymentDateISO";
      applySalaryPaymentFormDefaults({ forceReferenceFromPaymentDate: shouldForceReference });
      renderSalaryPaymentPreview();
    });
    salaryPaymentForm.addEventListener("submit", (event) => {
      event.preventDefault();
      applySalaryPaymentFormDefaults();
      const data = formToObject(event.currentTarget);
      const employeeId = String(data.employeeId || "").trim();
      if (!employeeId) {
        alert("Selecione o funcionário.");
        return;
      }
      const employee = (state.payslipEmployees || []).find((item) => item.id === employeeId);
      if (!employee) {
        alert("Funcionário não encontrado.");
        return;
      }

      const paymentDate = parseISODateOnly(String(data.paymentDateISO || "").trim());
      if (!paymentDate) {
        alert("Informe uma data de pagamento válida.");
        return;
      }

      const reference = inferReferenceYearMonth(data.referenceMonth, data.paymentDateISO);
      const monthTotalDays = getDaysInMonth(reference.year, reference.month);
      const resolvedPeriod = resolveWorkPeriodFromDateInputs({
        year: reference.year,
        monthNumber: reference.month,
        monthTotalDays,
        firstWorkDateISO: data.firstWorkDayInMonth,
        lastWorkDateISO: data.lastWorkDayInMonth,
      });
      if (!resolvedPeriod.ok) {
        alert(resolvedPeriod.message);
        return;
      }
      const firstWorkDayInMonth = resolvedPeriod.firstDay;
      const lastWorkDayInMonth = resolvedPeriod.lastDay;
      const businessDaysInMonth = countWeekdaysBetweenDays(
        reference.year,
        reference.month,
        firstWorkDayInMonth,
        lastWorkDayInMonth,
      );
      const absenceDays = Math.max(0, Number(data.absenceDays || 0));
      const allowanceDays = Math.max(0, Number(data.allowanceDays || 0));
      const absenceJustification = String(data.absenceJustification || "").trim();
      const allowanceJustification = String(data.allowanceJustification || "").trim();
      if (absenceDays > businessDaysInMonth) {
        alert("Dias de falta não podem ser maiores que os dias úteis.");
        return;
      }
      if (allowanceDays > absenceDays) {
        alert("Dias de abono não podem ser maiores que os dias de falta.");
        return;
      }
      if (absenceDays > 0 && !absenceJustification) {
        alert("Informe a justificativa das faltas.");
        return;
      }
      if (allowanceDays > 0 && !allowanceJustification) {
        alert("Informe a justificativa dos abonos.");
        return;
      }

      const duplicateSalary = (state.balance.entries || []).some((entry) =>
        isSalaryExpenseEntryForEmployeeInMonth(entry, employee, reference.year, reference.month),
      );
      if (duplicateSalary) {
        alert("Já existe pagamento de salário deste funcionário no mês selecionado. Remova o lançamento antigo antes de registrar outro.");
        return;
      }

      const settlement = calculateMonthlySalarySettlement({
        employee,
        year: reference.year,
        monthNumber: reference.month,
        monthTotalDays,
        firstWorkDayInMonth,
        lastWorkDayInMonth,
        businessDaysInMonth,
        absenceDays,
        allowanceDays,
      });
      const employeeName = String(employee.employeeName || "Funcionário").trim() || "Funcionário";
      const entry = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: "expense",
        description: `Salário mensal - ${employeeName} (${monthNameByNumber(reference.month)}/${reference.year})`,
        amount: Number(settlement.totalReceivedValue || 0),
        dateTime: `${toISODateOnly(paymentDate)}T12:00`,
        responsible: "",
        contractId: "",
        category: "salario",
        employeeId,
        linkedContractPaymentId: "",
        linkedRentedPropertyPaymentId: "",
      };

      state.balance.entries.push(entry);
      const employeeIndex = (state.payslipEmployees || []).findIndex((item) => item.id === employeeId);
      if (employeeIndex >= 0) {
        const currentEmployee = state.payslipEmployees[employeeIndex];
        const salaryHistory = Array.isArray(currentEmployee.salaryHistory) ? [...currentEmployee.salaryHistory] : [];
        salaryHistory.push({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          paymentDateISO: toISODateOnly(paymentDate),
          referenceYear: reference.year,
          referenceMonth: reference.month,
          monthTotalDays: settlement.monthTotalDays,
          workedCalendarDays: settlement.workedCalendarDays,
          businessDaysInMonth: settlement.businessDaysInMonth,
          absenceDays: settlement.absenceDays,
          allowanceDays: settlement.allowanceDays,
          absenceJustification: settlement.absenceDays > 0 ? absenceJustification : "",
          allowanceJustification: settlement.allowanceDays > 0 ? allowanceJustification : "",
          salaryAfterAbsence: settlement.salaryAfterAbsence,
          mealAllowanceTotal: settlement.mealAllowanceTotal,
          mealAllowanceCardDiscountValue: settlement.mealAllowanceCardDiscountValue,
          netCashValue: settlement.netCashValue,
          totalReceivedValue: settlement.totalReceivedValue,
          createdAt: new Date().toISOString(),
        });
        state.payslipEmployees[employeeIndex] = {
          ...currentEmployee,
          salaryHistory,
        };
      }
      saveState();
      void logAuditAction({
        action: "create",
        module: "balance",
        entityType: "salary_payment_entry",
        entityId: entry.id,
        description: "Pagamento mensal de salário registrado.",
        after: entry,
        metadata: {
          employeeId,
          employeeName,
          referenceYear: reference.year,
          referenceMonth: reference.month,
          monthTotalDays: settlement.monthTotalDays,
          firstWorkDayInMonth: settlement.firstWorkDayInMonth,
          lastWorkDayInMonth: settlement.lastWorkDayInMonth,
          firstWorkDateISO: resolvedPeriod.firstDateISO,
          lastWorkDateISO: resolvedPeriod.lastDateISO,
          workedCalendarDays: settlement.workedCalendarDays,
          businessDaysByRange: settlement.businessDaysByRange,
          businessDaysInMonth: settlement.businessDaysInMonth,
          absenceDays: settlement.absenceDays,
          allowanceDays: settlement.allowanceDays,
          absenceJustification: settlement.absenceDays > 0 ? absenceJustification : "",
          allowanceJustification: settlement.allowanceDays > 0 ? allowanceJustification : "",
          unexcusedAbsenceDays: settlement.unexcusedAbsenceDays,
          mealAllowanceTotal: settlement.mealAllowanceTotal,
          mealAllowanceCardDiscountValue: settlement.mealAllowanceCardDiscountValue,
          netCashValue: settlement.netCashValue,
          totalReceivedValue: settlement.totalReceivedValue,
        },
      });
      renderBalance();
      alert("Pagamento mensal de salário registrado no balanço.");
    });
  }

  document.getElementById("expenseBatchForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = formToObject(event.currentTarget);
    const lines = String(data.batchText || "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (!lines.length) return;

    let imported = 0;
    lines.forEach((line) => {
      const parts = line.split(";").map((part) => part.trim());
      if (parts.length < 3) return;
      const description = parts[0];
      const amount = Number(String(parts[1]).replace(",", "."));
      const dateTime = parts[2];
      const responsible = parts[3] || "";
      const contractId = resolveContractIdFromText(parts[4] || "");
      if (!description || !Number.isFinite(amount) || amount < 0 || !dateTime) return;

      state.balance.entries.push({
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        type: "expense",
        description,
        amount,
        dateTime,
        responsible,
        contractId,
      });
      imported += 1;
    });

    if (!imported) {
      alert("Nenhuma linha válida para importar.");
      return;
    }

    saveState();
    void logAuditAction({
      action: "batch_import",
      module: "balance",
      entityType: "expense_entry",
      description: "Importação em lote de despesas.",
      metadata: { importedCount: imported },
    });
    event.currentTarget.reset();
    renderBalance();
    alert(`${imported} despesa(s) importada(s) com sucesso.`);
  });

  const contractsForm = document.getElementById("contractsForm");
  setupBRLInputs(contractsForm);
  const contractsClientSelect = document.getElementById("contractsClientSelect");
  const contractsRentedPropertySelect = document.getElementById("contractsRentedPropertySelect");
  if (contractsClientSelect) {
    contractsClientSelect.addEventListener("change", () => {
      state.contracts.clientId = String(contractsClientSelect.value || "");
      renderContractsOpenSummary();
    });
  }
  if (contractsRentedPropertySelect) {
    contractsRentedPropertySelect.addEventListener("change", () => {
      const propertyId = String(contractsRentedPropertySelect.value || "");
      state.contracts.rentedPropertyId = propertyId;
      if (propertyId) {
        copyAddressFromRentedPropertyToContractForm(propertyId);
      }
      syncCurrentContractFromForm();
      renderContractsOpenSummary();
    });
  }
  contractsForm.addEventListener("submit", (event) => {
    event.preventDefault();
  });
  contractsForm.addEventListener("input", () => {
    syncCurrentContractFromForm();
    renderContractsOpenSummary();
  });
  contractsForm.addEventListener("change", () => {
    syncCurrentContractFromForm();
    renderContractsOpenSummary();
  });

  const contractsSimulationForm = document.getElementById("contractsSimulationForm");
  if (contractsSimulationForm) {
    setupBRLInputs(contractsSimulationForm);
    const syncSimulationFromForm = () => {
      const payload = formToObject(contractsSimulationForm);
      const normalized = { ...createEmptyContractSimulation(), ...payload };
      [
        "targetMonthlyProfit",
        "dailyRatePerPerson",
        "rentCost",
        "staffCost",
        "furnitureCost",
        "cleaningProductsCost",
        "waterCost",
        "electricityCost",
        "internetCost",
        "maintenanceCost",
        "proLaboreCost",
      ].forEach((field) => {
        normalized[field] = String(parseBRLNumber(normalized[field] || 0));
      });
      normalized.capacity = String(Math.max(0, Number(normalized.capacity || 0)));
      normalized.monthlyTaxPercent = String(Math.max(0, Number(normalized.monthlyTaxPercent || 0)));
      uiState.contractsSimulation = normalized;
      renderContractSimulation();
    };
    contractsSimulationForm.addEventListener("input", syncSimulationFromForm);
    contractsSimulationForm.addEventListener("change", syncSimulationFromForm);
  }

  document.getElementById("btnNewContract").addEventListener("click", () => {
    if (!hasPermission("editContracts")) {
      alert("Sem permissão para editar contratos.");
      return;
    }
    uiState.contractsFormOpen = true;
    uiState.contractsEditMode = true;
    uiState.contractsSummaryVisible = false;
    state.activeContractId = "";
    state.contracts = createEmptyContract();
    renderAll();
    window.requestAnimationFrame(() => {
      const contractNameInput = contractsForm?.elements?.namedItem("contractName");
      if (contractNameInput) contractNameInput.focus();
    });
  });

  document.getElementById("btnOpenContractSimulation")?.addEventListener("click", () => {
    uiState.contractsSimulationOpen = true;
    if (!uiState.contractsSimulation) uiState.contractsSimulation = createEmptyContractSimulation();
    const form = document.getElementById("contractsSimulationForm");
    if (form) {
      setFormValues(form, uiState.contractsSimulation);
      setupBRLInputs(form);
    }
    renderContracts();
  });

  document.getElementById("btnCloseContractSimulation")?.addEventListener("click", () => {
    uiState.contractsSimulationOpen = false;
    uiState.contractsSimulation = createEmptyContractSimulation();
    renderContracts();
  });

  document.getElementById("btnClearContractSimulation")?.addEventListener("click", () => {
    uiState.contractsSimulation = createEmptyContractSimulation();
    const form = document.getElementById("contractsSimulationForm");
    if (form) {
      setFormValues(form, uiState.contractsSimulation);
      setupBRLInputs(form);
    }
    renderContractSimulation();
  });

  document.getElementById("btnSaveContractDraft").addEventListener("click", () => {
    if (!uiState.contractsEditMode || !hasPermission("editContracts")) return;
    uiState.contractsSavedView = "draft";
    saveContractFromForm({ isEffective: false });
  });

  document.getElementById("btnSaveContract").addEventListener("click", () => {
    if (!uiState.contractsEditMode || !hasPermission("editContracts")) return;
    uiState.contractsSavedView = "effective";
    saveContractFromForm({ isEffective: true });
  });

  document.getElementById("btnBackToContractsList").addEventListener("click", () => {
    uiState.contractsFormOpen = false;
    uiState.contractsEditMode = false;
    uiState.contractsSummaryVisible = false;
    renderContracts();
  });

  document.getElementById("btnShowEffectiveContracts").addEventListener("click", () => {
    uiState.contractsSavedView = "effective";
    renderContracts();
  });

  document.getElementById("btnShowDraftContracts").addEventListener("click", () => {
    uiState.contractsSavedView = "draft";
    renderContracts();
  });

  document.getElementById("contractsSavedList").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-action]");
    if (!button) return;
    const action = String(button.getAttribute("data-action") || "");
    const contractId = String(button.getAttribute("data-contract-id") || "");
    if (!contractId) return;

    if (action === "toggle-contract-values") {
      if (!canViewFinancialValues()) return;
      uiState.contractsVisibleValuesById[contractId] = !Boolean(uiState.contractsVisibleValuesById[contractId]);
      renderContracts();
      return;
    }

    if (action === "edit-contract") {
      if (!hasPermission("editContracts")) {
        alert("Sem permissão para editar contratos.");
        return;
      }
      setActiveContractById(contractId);
      uiState.contractsFormOpen = true;
      uiState.contractsEditMode = true;
      uiState.contractsSummaryVisible = false;
      renderAll();
      return;
    }

    if (action === "open-contract") {
      setActiveContractById(contractId);
      uiState.contractsFormOpen = true;
      uiState.contractsEditMode = false;
      uiState.contractsSummaryVisible = false;
      renderAll();
      return;
    }

    if (action === "delete-contract") {
      if (!hasPermission("editContracts")) {
        alert("Sem permissão para apagar contratos.");
        return;
      }
      const contract = state.contractsPortfolio.find((item) => item.id === contractId);
      if (!contract) return;
      if (!confirmContractDelete(contract.contractName || "Sem nome")) return;
      state.contractsPortfolio = state.contractsPortfolio.filter((item) => item.id !== contractId);
      state.rentedProperties = (state.rentedProperties || []).map((property) => (
        String(property.contractId || "") === contractId ? { ...property, contractId: "" } : property
      ));
      delete uiState.contractsVisibleValuesById[contractId];
      if (state.activeContractId === contractId) {
        resetContractsDraftForm(true);
      }
      saveState();
      void logAuditAction({
        action: "delete",
        module: "contracts",
        entityType: "contract",
        entityId: contractId,
        description: "Contrato excluído.",
        before: contract,
      });
      renderAll();
    }
  });

  document.getElementById("btnNewRentedProperty").addEventListener("click", () => {
    if (!hasPermission("editContracts")) {
      alert("Sem permissão para editar imóveis alugados.");
      return;
    }
    uiState.rentedPropertiesFormOpen = true;
    uiState.editingRentedPropertyId = "";
    resetRentedPropertyForm();
    renderAll();
  });

  document.getElementById("btnBackToRentedPropertiesList").addEventListener("click", () => {
    uiState.rentedPropertiesFormOpen = false;
    uiState.editingRentedPropertyId = "";
    resetRentedPropertyForm();
    renderRentedPropertiesModule();
  });

  document.getElementById("rentedPropertyForm").addEventListener("submit", (event) => {
    event.preventDefault();
    if (!hasPermission("editContracts")) {
      alert("Sem permissão para editar imóveis alugados.");
      return;
    }
    const data = formToObject(event.currentTarget);
    const name = String(data.name || "").trim();
    if (!name) {
      alert("Informe o nome do imóvel.");
      return;
    }
    const nextDueDateISO = String(data.nextDueDateISO || "").trim();
    if (!parseISODateOnly(nextDueDateISO)) {
      alert("Informe uma data de vencimento válida.");
      return;
    }
    const contractStartDateISO = String(data.contractStartDateISO || "").trim();
    const contractEndDateISO = String(data.contractEndDateISO || "").trim();
    const startDate = parseISODateOnly(contractStartDateISO);
    const endDate = parseISODateOnly(contractEndDateISO);
    if (!startDate) {
      alert("Informe a data de início do contrato.");
      return;
    }
    if (!endDate) {
      alert("Informe a data de término do contrato.");
      return;
    }
    if (endDate < startDate) {
      alert("A data de término do contrato deve ser igual ou posterior à data de início.");
      return;
    }

    const existing = getRentedPropertyById(uiState.editingRentedPropertyId);
    const basePayload = {
      ...(existing || createEmptyRentedProperty()),
      id: existing?.id || `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name,
      street: data.street,
      number: data.number,
      complement: data.complement,
      district: data.district,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      contractId: String(data.contractId || "").trim(),
      rentAmount: String(parseBRLNumber(data.rentAmount || 0)),
      contractStartDateISO,
      contractEndDateISO,
      nextDueDateISO,
      updatedAt: new Date().toISOString(),
    };
    const linkedContract = getContractById(basePayload.contractId);
    const payload = normalizeRentedProperty(
      linkedContract
        ? applyContractAddressToRentedPropertyData(basePayload, linkedContract)
        : basePayload,
    );

    const idx = state.rentedProperties.findIndex((item) => item.id === payload.id);
    if (idx >= 0) state.rentedProperties[idx] = payload;
    else state.rentedProperties.push(payload);

    syncRentedPropertyToContractLink(payload.id, payload.contractId);

    saveState();
    void logAuditAction({
      action: existing ? "update" : "create",
      module: "rented_properties",
      entityType: "rented_property",
      entityId: payload.id,
      description: existing ? "Imóvel alugado atualizado." : "Imóvel alugado criado.",
      before: existing,
      after: payload,
    });
    uiState.rentedPropertiesFormOpen = false;
    uiState.editingRentedPropertyId = "";
    resetRentedPropertyForm();
    renderAll();
  });

  document.getElementById("rentedPropertyContractSelect")?.addEventListener("change", () => {
    const select = document.getElementById("rentedPropertyContractSelect");
    const contractId = String(select?.value || "");
    if (!contractId) return;
    copyAddressFromContractToRentedPropertyForm(contractId);
  });

  document.getElementById("rentedPropertiesSavedList").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-action]");
    if (!button) return;
    const action = String(button.getAttribute("data-action") || "");
    const propertyId = String(button.getAttribute("data-rented-property-id") || "");
    if (!propertyId) return;
    const property = getRentedPropertyById(propertyId);
    if (!property) return;

    if (action === "edit-rented-property") {
      if (!hasPermission("editContracts")) {
        alert("Sem permissão para editar imóveis alugados.");
        return;
      }
      uiState.rentedPropertiesFormOpen = true;
      uiState.editingRentedPropertyId = property.id;
      renderAll();
      return;
    }

    if (action === "mark-rented-property-paid") {
      if (!hasPermission("editContracts")) {
        alert("Sem permissão para registrar pagamentos de aluguel.");
        return;
      }
      const todayISO = toISODateOnly(new Date());
      const typedDate = String(prompt("Informe a data do pagamento (AAAA-MM-DD):", todayISO) || "").trim();
      const paymentDate = parseISODateOnly(typedDate);
      if (!paymentDate) {
        alert("Data inválida. Use o formato AAAA-MM-DD.");
        return;
      }
      const previousProperty = { ...property };
      const dueDateISO = String(property.nextDueDateISO || "").trim();
      const expectedAmount = Number(property.rentAmount || 0);
      const settlement = promptPaymentSettlement({
        title: "Pagamento de aluguel",
        expectedAmount,
      });
      if (!settlement) return;
      const paidProperty = registerRentedPropertyPayment(property, toISODateOnly(paymentDate), settlement);
      state.rentedProperties = state.rentedProperties.map((item) => (item.id === property.id ? paidProperty : item));

      const autoExpenseId = `${paidProperty.id}:${dueDateISO}`;
      const hasAutoExpense = (state.balance.entries || []).some(
        (entry) => String(entry.linkedRentedPropertyPaymentId || "") === autoExpenseId,
      );
      if (!hasAutoExpense) {
        const discountText = Number(settlement.discountAmount || 0) > 0
          ? ` | Desconto: ${currencyBRL.format(settlement.discountAmount)} (${settlement.discountReason})`
          : "";
        state.balance.entries.push({
          id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
          type: "expense",
          description: `Aluguel pago - ${paidProperty.name} (${formatDateBR(dueDateISO)})${discountText}`,
          amount: Number(settlement.paidAmount || 0),
          dateTime: `${toISODateOnly(paymentDate)}T12:00`,
          responsible: "",
          contractId: String(paidProperty.contractId || ""),
          category: "aluguel",
          employeeId: "",
          linkedContractPaymentId: "",
          linkedRentedPropertyPaymentId: autoExpenseId,
        });
      }

      saveState();
      void logAuditAction({
        action: "mark_paid",
        module: "rented_properties",
        entityType: "rented_property_payment",
        entityId: paidProperty.id,
        description: "Pagamento de aluguel marcado como pago.",
        before: previousProperty,
        after: paidProperty,
        metadata: {
          paymentDateISO: toISODateOnly(paymentDate),
          dueDateISO,
          expectedAmount: Number(settlement.expectedAmount || 0),
          paidAmount: Number(settlement.paidAmount || 0),
          discountAmount: Number(settlement.discountAmount || 0),
          discountReason: String(settlement.discountReason || ""),
          autoBalanceExpenseLinkedId: autoExpenseId,
        },
      });
      renderAll();
      return;
    }

    if (action === "delete-rented-property") {
      if (!hasPermission("editContracts")) {
        alert("Sem permissão para apagar imóveis alugados.");
        return;
      }
      if (!confirm(`Deseja apagar o imóvel alugado "${property.name || "Sem nome"}"?`)) return;
      state.rentedProperties = state.rentedProperties.filter((item) => item.id !== property.id);
      state.contractsPortfolio = state.contractsPortfolio.map((contract) => (
        String(contract.rentedPropertyId || "") === property.id ? { ...contract, rentedPropertyId: "" } : contract
      ));
      if (String(state.contracts.rentedPropertyId || "") === property.id) {
        state.contracts.rentedPropertyId = "";
      }
      saveState();
      void logAuditAction({
        action: "delete",
        module: "rented_properties",
        entityType: "rented_property",
        entityId: property.id,
        description: "Imóvel alugado excluído.",
        before: property,
      });
      renderAll();
    }
  });

  document.getElementById("furnitureForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const data = formToObject(event.currentTarget);
    upsertFurnitureItem(
      data.item,
      data.environment,
      Number(data.quantity || 1),
      data.notes,
    );
    const newNotes = String(data.notes || "").trim();
    if (newNotes) {
      const inserted = state.furniture.find(
        (x) =>
          x.item === String(data.item || "").trim()
          && x.environment === String(data.environment || "").trim()
          && String(x.notes || "").trim() === newNotes,
      );
      if (inserted) inserted.notes = newNotes;
    }
    event.currentTarget.reset();
    saveState();
    renderAll();
  });

  const photosInput = document.getElementById("proposalPhotosInput");
  const photosCameraInput = document.getElementById("proposalPhotosCameraInput");
  const btnSelectPhotos = document.getElementById("btnSelectPhotos");
  const btnTakePhoto = document.getElementById("btnTakePhoto");

  if (btnSelectPhotos && photosInput) {
    btnSelectPhotos.addEventListener("click", () => {
      photosInput.click();
    });
  }

  if (btnTakePhoto && photosCameraInput) {
    btnTakePhoto.addEventListener("click", () => {
      photosCameraInput.click();
    });
  }

  if (photosInput) {
    photosInput.addEventListener("change", async () => {
      await addProposalPhotosFromFiles(photosInput.files);
      photosInput.value = "";
    });
  }

  if (photosCameraInput) {
    photosCameraInput.addEventListener("change", async () => {
      await addProposalPhotosFromFiles(photosCameraInput.files);
      photosCameraInput.value = "";
    });
  }

  const btnAddSelectedFurniture = document.getElementById("btnAddSelectedFurniture");
  if (btnAddSelectedFurniture) {
    btnAddSelectedFurniture.addEventListener("click", () => {
      const checkboxes = Array.from(
        document.querySelectorAll(".default-furniture-checkbox:checked"),
      );

      if (!checkboxes.length) return;

      checkboxes.forEach((checkbox) => {
        const idx = Number(checkbox.getAttribute("data-default-index"));
        const item = DEFAULT_FURNITURE[idx];
        const qtyInput = document.querySelector(
          `.default-furniture-qty[data-default-qty-index="${idx}"]`,
        );
        const parsedQty = Number.parseInt(String(qtyInput?.value || "1"), 10);
        const qty = Number.isFinite(parsedQty) && parsedQty > 0 ? parsedQty : 1;
        const variantInput = document.querySelector(
          `.default-furniture-variant[data-default-variant-index="${idx}"]`,
        );
        const variantValue = String(variantInput?.value || "").trim();
        const variantConfig = FURNITURE_VARIANTS[item?.item];
        const variantNote = variantValue && variantConfig
          ? `${variantConfig.label}: ${variantValue}`
          : "";
        if (!item) return;
        upsertFurnitureItem(item.item, item.environment, qty, variantNote);
        checkbox.checked = false;
        if (qtyInput) qtyInput.value = "1";
      });

      saveState();
      renderAll();
    });
  }

  document.getElementById("btnExportPdf").addEventListener("click", async () => {
    if (!hasPermission("exportProposal")) {
      alert("Sem permissão para exportar proposta.");
      return;
    }
    const exportBtn = document.getElementById("btnExportPdf");
    if (exportBtn) {
      exportBtn.disabled = true;
      exportBtn.textContent = "Gerando PDF...";
    }
    document.body.classList.remove("print-payslip");
    setActiveTab("proposals");
    setProposalStep(6);
    renderProposal();
    const proposalDoc = document.querySelector("#proposalArea .proposal-doc");
    if (!proposalDoc) {
      alert("Não foi possível gerar a proposta para impressão.");
      if (exportBtn) {
        exportBtn.disabled = false;
        exportBtn.textContent = "Exportar proposta em PDF";
      }
      return;
    }
    await waitForProposalRenderReady(proposalDoc);
    const downloaded = await exportProposalAsPdfFile(proposalDoc);
    if (downloaded) {
      registerExport("proposal");
    } else {
      const ok = printHtmlContent({
        title: "Proposta Comercial",
        contentHtml: `<section class="panel proposal">${proposalDoc.outerHTML}</section>`,
      });
      if (ok) registerExport("proposal");
      else alert("Não foi possível exportar em PDF. Tente novamente.");
    }
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.textContent = "Exportar proposta em PDF";
    }
  });

  document.getElementById("btnExportPayslipPdf").addEventListener("click", async () => {
    if (!hasPermission("exportPayslip")) {
      alert("Sem permissão para exportar contracheque.");
      return;
    }
    if (!validatePayslipRequiredFields()) return;
    const exportBtn = document.getElementById("btnExportPayslipPdf");
    if (exportBtn) {
      exportBtn.disabled = true;
      exportBtn.textContent = "Gerando PDF...";
    }
    setActiveTab("payslip");
    document.body.classList.add("print-payslip");
    renderPayslip();
    const payslipSheet = document.querySelector("#payslipOutput .payslip-sheet");
    if (!payslipSheet) {
      alert("Não foi possível gerar o contracheque para impressão.");
      document.body.classList.remove("print-payslip");
      if (exportBtn) {
        exportBtn.disabled = false;
        exportBtn.textContent = "Exportar contracheque A4";
      }
      return;
    }
    await waitForProposalRenderReady(payslipSheet);
    const downloaded = await exportPayslipAsPdfFile(payslipSheet);
    if (downloaded) {
      registerExport("payslip");
    } else {
      const payslipOutput = document.getElementById("payslipOutput");
      const payslipHtml = payslipOutput?.innerHTML || "";
      const ok = printHtmlContent({
        title: "Contracheque",
        bodyClass: "print-payslip",
        contentHtml: `<section id="payslipModule" class="module module-active"><section class="panel payslip-builder"><div class="payslip-output">${payslipHtml}</div></section></section>`,
      });
      if (ok) registerExport("payslip");
      else alert("Não foi possível exportar o contracheque em PDF.");
    }
    window.setTimeout(() => {
      document.body.classList.remove("print-payslip");
    }, 150);
    if (exportBtn) {
      exportBtn.disabled = false;
      exportBtn.textContent = "Exportar contracheque A4";
    }
  });

  window.addEventListener("afterprint", () => {
    document.body.classList.remove("print-payslip");
  });

  document.getElementById("btnClear").addEventListener("click", () => {
    if (!confirm("Deseja limpar somente os campos da aba atual para um novo preenchimento?")) return;

    resetActiveTabInputs();
    saveState();
    if (uiState.activeTab === "proposals") {
      [
        "companyForm",
        "propertyForm",
        "pricingForm",
        "proposalForm",
        "furnitureForm",
      ].forEach((id) => document.getElementById(id)?.reset());
      const proposalPhotosInput = document.getElementById("proposalPhotosInput");
      const proposalPhotosCameraInput = document.getElementById("proposalPhotosCameraInput");
      if (proposalPhotosInput) proposalPhotosInput.value = "";
      if (proposalPhotosCameraInput) proposalPhotosCameraInput.value = "";
    } else if (uiState.activeTab === "payslip") {
      ["payslipForm", "earningForm", "discountForm"].forEach((id) => document.getElementById(id)?.reset());
      ["payslipForm", "earningForm", "discountForm"].forEach((id) => setupBRLInputs(document.getElementById(id)));
      const savedEmployeeSelect = document.getElementById("savedPayslipEmployeeSelect");
      if (savedEmployeeSelect) savedEmployeeSelect.value = "";
    } else if (uiState.activeTab === "clients") {
      resetClientCatalogForm();
    } else if (uiState.activeTab === "employees") {
      resetEmployeeCatalogForm();
    } else if (uiState.activeTab === "balance") {
      ["incomeForm", "expenseForm"].forEach((id) => document.getElementById(id)?.reset());
      ["incomeForm", "expenseForm"].forEach((id) => setupBRLInputs(document.getElementById(id)));
    } else if (uiState.activeTab === "taxes") {
      clearTaxesForm();
    } else if (uiState.activeTab === "contracts") {
      document.getElementById("contractsForm")?.reset();
      uiState.contractsSimulationOpen = false;
      uiState.contractsSimulation = createEmptyContractSimulation();
    } else if (uiState.activeTab === "rentedProperties") {
      resetRentedPropertyForm();
    } else if (uiState.activeTab === "exports") {
      document.getElementById("cloudSyncForm")?.reset();
    }
    renderAll();
  });

  document.getElementById("cloudSyncForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const endpoint = String(document.getElementById("cloudSyncEndpoint").value || "").trim();
    setCloudSyncEndpoint(endpoint);
    renderExports();
  });

  document.getElementById("exportsList").addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const button = target.closest("button[data-action]");
    if (!button) return;

    const action = button.getAttribute("data-action");
    const exportId = button.getAttribute("data-export-id");
    if (!exportId) return;

    const exportRecord = getAllAvailableExports().find((entry) => entry.id === exportId);
    if (!exportRecord) return;

    if (action === "edit-export") {
      loadExportForEditing(exportRecord);
      return;
    }

    if (action === "preview-export") {
      loadExportForPreview(exportRecord);
      return;
    }

    if (action === "sync-export") {
      if (!hasPermission("syncExports")) {
        alert("Sem permissão para sincronizar exportados.");
        return;
      }
      exportRecord.cloudStatus = "pending";
      const localIdx = state.exports.findIndex((entry) => entry.id === exportId);
      if (localIdx >= 0) state.exports[localIdx].cloudStatus = "pending";
      saveState();
      renderExports();
      void syncExportRecordToCloudChannels(exportRecord).then(async (syncResult) => {
        const idx = state.exports.findIndex((entry) => entry.id === exportId);
        if (idx >= 0) state.exports[idx].cloudStatus = syncResult.anySuccess ? "synced" : "failed";
        saveState();
        if (syncResult.sharedOk) {
          await loadSharedExportsFromCloud(true);
        }
        renderExports();
      });
      return;
    }

    if (action === "delete-export") {
      if (!confirm("Deseja apagar este documento exportado do histórico?")) return;
      state.exports = (state.exports || []).filter((entry) => entry.id !== exportId);
      cloudSyncState.sharedExports = (cloudSyncState.sharedExports || []).filter((entry) => entry.id !== exportId);
      if (!Array.isArray(state.deletedExportIds)) state.deletedExportIds = [];
      if (!state.deletedExportIds.includes(exportId)) state.deletedExportIds.push(exportId);
      saveState();
      void deleteSharedExportFromCloud(exportId).then(async (ok) => {
        if (!ok && authState.mode === "supabase") {
          alert("Não foi possível apagar este exportado na nuvem. Verifique permissões do usuário.");
        }
        if (authState.mode === "supabase" && authState.user) {
          await loadSharedExportsFromCloud(true);
          renderExports();
        }
      });
      void logAuditAction({
        action: "delete",
        module: "exports",
        entityType: "export_record",
        entityId: exportId,
        description: "Documento exportado removido do histórico.",
        before: exportRecord,
      });
      renderExports();
    }
  });

}

async function initializeApp() {
  loadState();
  normalizeStatePatterns();
  bindEvents();
  renderAll();
  await initAuthClient();
}

initializeApp();
