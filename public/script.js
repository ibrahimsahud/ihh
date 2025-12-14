let donors = [];
let donations = [];
let beneficiaries = [];
let aids = [];
let staff = [];
let sponsorships = [];
let notifications = [];

const API_BASE_URL = 'http://localhost:3000/api';

const AUTH_FLAG_KEY = 'ihhAdminAuthed';

(function enforceDashboardAccess() {
    if (typeof window === 'undefined') {
        return;
    }
    const hasAccess = window.localStorage.getItem(AUTH_FLAG_KEY) || window.sessionStorage.getItem(AUTH_FLAG_KEY);
    if (!hasAccess) {
        window.location.href = 'admin-login.html';
    }
})();

let currentLanguage = 'tr';

const translations = {
    tr: {
        dashboard: 'Kontrol Paneli',
        donors: 'Bağışçılar',
        donations: 'Bağışlar',
        beneficiaries: 'Yararlanıcılar',
        aidDistribution: 'Yardım Dağıtımı',
        staff: 'Personel',
        orphanSponsorship: 'Yetim Sponsorluğu',
        reports: 'Raporlar',

        dashboardTitle: 'Kontrol Paneli',
        donorsManagement: 'Bağışçı Yönetimi',
        donationsManagement: 'Bağış Yönetimi',
        beneficiariesManagement: 'Yararlanıcı Yönetimi',
        aidDistributionTitle: 'Yardım Dağıtımı',
        staffManagement: 'Personel Yönetimi',
        orphanSponsorshipTitle: 'Yetim Sponsorluğu',
        reportsAndStats: 'Raporlar ve İstatistikler',

        totalDonors: 'Toplam Bağışçı',
        totalDonations: 'Toplam Bağış',
        totalBeneficiaries: 'Toplam Yararlanıcı',
        totalStaff: 'Toplam Personel',
        totalAidsDistributed: 'Dağıtılan Yardımlar',

        add: 'Ekle',
        addDonor: 'Bağışçı Ekle',
        addDonation: 'Bağış Kaydet',
        addBeneficiary: 'Yararlanıcı Ekle',
        addAid: 'Yardım Kaydet',
        addStaff: 'Personel Ekle',
        addSponsorship: 'Sponsorluk Ekle',
        edit: 'Düzenle',
        delete: 'Sil',
        view: 'Görüntüle',
        save: 'Kaydet',
        cancel: 'İptal',
        search: 'Ara...',
        exportReport: 'Rapor İndir',

        number: '#',
        firstName: 'Ad',
        lastName: 'Soyad',
        name: 'İsim',
        fullName: 'Tam Ad',
        phone: 'Telefon',
        email: 'E-posta',
        address: 'Adres',
        city: 'Şehir',
        country: 'Ülke',
        type: 'Tür',
        donorType: 'Bağışçı Türü',
        amount: 'Tutar',
        currency: 'Para Birimi',
        date: 'Tarih',
        donationDate: 'Bağış Tarihi',
        actions: 'İşlemler',
        status: 'Durum',
        donor: 'Bağışçı',
        beneficiary: 'Yararlanıcı',
        aidType: 'Yardım Türü',
        quantity: 'Miktar',
        value: 'Değer',
        notes: 'Notlar',
        position: 'Pozisyon',
        department: 'Bölüm',
        salary: 'Maaş',
        hireDate: 'İşe Alım Tarihi',
        orphanName: 'Yetim Adı',
        donorName: 'Bağışçı Adı',
        monthlyAmount: 'Aylık Tutar',
        startDate: 'Başlangıç Tarihi',
        endDate: 'Bitiş Tarihi',
        familySize: 'Aile Üye Sayısı',
        monthlyIncome: 'Aylık Gelir',
        paymentMethod: 'Ödeme Yöntemi',
        donationCount: 'Bağış Sayısı',
        totalAmount: 'Toplam Tutar',
        lastDonation: 'Son Bağış',
        percentage: 'Yüzde',
        frequency: 'Sıklık',

        individual: 'Birey',
        organization: 'Organizasyon',
        company: 'Şirket',

        orphan: 'Yetim',
        widow: 'Dul',
        disabled: 'Engelli',
        refugee: 'Mülteci',
        poor: 'Fakir',

        cash: 'Nakit',
        inkind: 'Ayni',
        monthly: 'Aylık',

        cashPayment: 'Nakit',
        bankTransfer: 'Banka Transferi',
        creditCard: 'Kredi Kartı',
        check: 'Çek',

        noData: 'Veri yok',
        loading: 'Yükleniyor...',
        deleteConfirm: 'Silmek istediğinizden emin misiniz?',
        addedSuccessfully: 'Başarıyla eklendi',
        updatedSuccessfully: 'Başarıyla güncellendi',
        deletedSuccessfully: 'Başarıyla silindi',
        errorOccurred: 'Bir hata oluştu',
        connectionError: 'Sunucuya bağlanırken hata',
        noDonorsData: 'Bağışçı verisi yok. Yeni bağışçı ekleyin.',
        noDonationsData: 'Kayıtlı bağış yok.',
        noBeneficiariesData: 'Yararlanıcı verisi yok.',
        noAidsData: 'Dağıtılmış yardım yok.',
        noStaffData: 'Personel verisi yok.',
        noSponsorshipsData: 'Kayıtlı sponsorluk yok.',

        notifications: 'Bildirimler',
        markAllAsRead: 'Tümünü Okundu İşaretle',
        noNotifications: 'Bildirim yok',

        systemManager: 'Sistem Yöneticisi',

        allPeriods: 'Tüm Dönemler',
        today: 'Bugün',
        thisWeek: 'Bu Hafta',
        thisMonth: 'Bu Ay',
        thisYear: 'Bu Yıl',
        monthlyDonations: 'Aylık Bağışlar',
        last6Months: 'Son 6 Ay',
        donationsByType: 'Türe Göre Bağış Dağılımı',
        topDonors: 'En İyi Bağışçılar',
        aidsByType: 'Türe Göre Yardımlar',
        performanceSummary: 'Performans Özeti',
        averageMonthlyDonation: 'Ortalama Aylık Bağış',
        beneficiaryFamilies: 'Yararlanıcı Aile Sayısı',
        annualGrowthRate: 'Yıllık Büyüme Oranı',
        sponsoredOrphans: 'Sponsor Olunan Yetimler',
        families: 'aile',
        orphans: 'yetim',

        searchResults: 'Arama Sonuçları',
        searchPlaceholder: 'Bağışçı, yararlanıcı, bağış ara...',
        noResults: 'Sonuç bulunamadı'
    }
};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupNavigation();
    setupMobileMenu();
    setupQuickActions();

    updateDonorsTable();
    updateDonationsTable();
    updateBeneficiariesTable();
    updateAidTable();
    updateStaffTable();
    updateSponsorshipTable();

    loadRealData();
});

function initializeApp() {
    console.log('IHH Sistemi hazır - Gerçek veritabanına bağlanıyor');
}

function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');

            const pageName = this.getAttribute('data-page');
            updatePageTitle(pageName);
            showPage(pageName);
        });
    });
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
}

function setupQuickActions() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) {
        return;
    }

    mainContent.addEventListener('click', function(event) {
        const button = event.target.closest('.quick-action-btn');
        if (!button) {
            return;
        }
        event.preventDefault();
        handleQuickAction(button);
    });
}

async function handleQuickAction(button) {
    const section = button.getAttribute('data-section');
    const action = button.getAttribute('data-action');

    if (!section || !action || button.classList.contains('is-busy')) {
        return;
    }

    button.classList.add('is-busy');

    try {
        if (action === 'refresh') {
            await refreshSectionData(section);
        } else if (action === 'export') {
            exportSectionData(section);
        } else if (action === 'add') {
            triggerQuickAdd(section);
        }
    } catch (error) {
        console.error('Hızlı işlem hatası:', error);
        showAlert('Hızlı işlem tamamlanamadı', 'error');
    } finally {
        const timeout = action === 'refresh' ? 800 : 250;
        setTimeout(() => button.classList.remove('is-busy'), timeout);
    }
}

async function refreshSectionData(section) {
    const config = getSectionActionConfig(section);
    if (!config || typeof config.loader !== 'function') {
        return;
    }

    try {
        await config.loader();
        if (config.refreshMessage) {
            showAlert(config.refreshMessage);
        }
    } catch (error) {
        console.error(`${section} verileri yenilenemedi:`, error);
        showAlert('Veriler yenilenemedi', 'error');
    }
}

function exportSectionData(section) {
    const config = getSectionActionConfig(section);
    if (!config || typeof config.exporter !== 'function') {
        showAlert('Bu bölüm için dışa aktarım tanımlı değil', 'error');
        return;
    }

    const success = config.exporter();
    if (!success) {
        showAlert('Dışa aktarılacak kayıt bulunamadı', 'error');
        return;
    }

    if (config.exportMessage) {
        showAlert(config.exportMessage);
    }
}

function triggerQuickAdd(section) {
    const config = getSectionActionConfig(section);
    if (config && typeof config.add === 'function') {
        config.add();
    }
}

function getSectionActionConfig(section) {
    const configs = {
        donors: {
            loader: loadDonors,
            add: () => showAddForm('donor'),
            refreshMessage: 'Bağışçı listesi yenilendi',
            exportMessage: 'Bağışçı listesi CSV olarak indirildi',
            exporter: () => exportEntitiesToCsv(
                'bagiscilar',
                donors,
                ['ID', 'İsim', 'Telefon', 'E-posta', 'Tür'],
                donor => {
                    const first = donor.firstName || donor.FirstName || '';
                    const last = donor.lastName || donor.LastName || '';
                    const type = donor.type || donor.Type || '';
                    return [
                        donor.id ?? donor.DonorID ?? '',
                        `${first} ${last}`.trim(),
                        donor.phone || donor.PhoneNumber || '-',
                        donor.email || donor.Email || '-',
                        type
                    ];
                }
            )
        },
        donations: {
            loader: loadDonations,
            add: () => showAddForm('donation'),
            refreshMessage: 'Bağış kaydı güncellendi',
            exportMessage: 'Bağış listesi CSV olarak indirildi',
            exporter: () => exportEntitiesToCsv(
                'bagislar',
                donations,
                ['ID', 'Bağışçı', 'Tutar', 'Yöntem', 'Tarih'],
                donation => {
                    const amount = Number(donation.amount ?? donation.DonationAmount ?? 0) || 0;
                    const currency = donation.currency || donation.DonationCurrency || 'TRY';
                    return [
                        donation.id ?? donation.DonationID ?? '',
                        donation.donorName || donation.DonorName || '-',
                        `${amount} ${currency}`.trim(),
                        donation.paymentMethod || donation.PaymentMethod || donation.type || donation.DonationType || '-',
                        donation.date || donation.DonationDate || ''
                    ];
                }
            )
        },
        beneficiaries: {
            loader: loadBeneficiaries,
            add: () => showAddForm('beneficiary'),
            refreshMessage: 'Yararlanıcı listesi yenilendi',
            exportMessage: 'Yararlanıcı listesi CSV olarak indirildi',
            exporter: () => exportEntitiesToCsv(
                'yararlanicilar',
                beneficiaries,
                ['ID', 'İsim', 'Tür', 'Şehir', 'Telefon'],
                beneficiary => {
                    const first = beneficiary.firstName || beneficiary.FirstName || '';
                    const last = beneficiary.lastName || beneficiary.LastName || '';
                    const type = beneficiary.type || beneficiary.BeneficiaryType || '-';
                    return [
                        beneficiary.id ?? beneficiary.BeneficiaryID ?? '',
                        `${first} ${last}`.trim(),
                        type,
                        beneficiary.city || beneficiary.City || '-',
                        beneficiary.phone || beneficiary.PhoneNumber || '-'
                    ];
                }
            )
        },
        aid: {
            loader: loadAidDistributions,
            add: () => showAddForm('aid'),
            refreshMessage: 'Yardım dağıtımları yenilendi',
            exportMessage: 'Yardım listesi CSV olarak indirildi',
            exporter: () => exportEntitiesToCsv(
                'yardimlar',
                aids,
                ['ID', 'Yararlanıcı', 'Yardım Türü', 'Değer', 'Tarih'],
                aid => {
                    const estimatedValue = Number(aid.estimatedValue ?? aid.EstimatedValue ?? 0) || 0;
                    return [
                        aid.id ?? aid.AidDistributionID ?? '',
                        aid.beneficiaryName || aid.BeneficiaryName || '-',
                        aid.aidType || aid.AidTypeName || '-',
                        estimatedValue,
                        aid.date || aid.DistributionDate || ''
                    ];
                }
            )
        },
        staff: {
            loader: loadStaff,
            add: () => showAddForm('staff'),
            refreshMessage: 'Personel listesi yenilendi',
            exportMessage: 'Personel listesi CSV olarak indirildi',
            exporter: () => exportEntitiesToCsv(
                'personel',
                staff,
                ['ID', 'İsim', 'Pozisyon', 'Bölüm', 'Maaş'],
                employee => {
                    const first = employee.firstName || employee.FirstName || '';
                    const last = employee.lastName || employee.LastName || '';
                    return [
                        employee.id ?? employee.EmployeeID ?? '',
                        `${first} ${last}`.trim(),
                        employee.position || employee.Position || '-',
                        employee.department || employee.Department || '-',
                        employee.salary ?? employee.Salary ?? '-'
                    ];
                }
            )
        },
        sponsorship: {
            loader: loadSponsorships,
            add: () => showAddForm('sponsorship'),
            refreshMessage: 'Sponsorluk akışı yenilendi',
            exportMessage: 'Sponsorluk listesi CSV olarak indirildi',
            exporter: () => exportEntitiesToCsv(
                'sponsorluklar',
                sponsorships,
                ['ID', 'Sponsor', 'Yetim', 'Aylık Tutar', 'Durum'],
                record => {
                    const amount = Number(record.monthlyAmount ?? record.MonthlyAmount ?? 0) || 0;
                    const active = isSponsorshipActive(record) ? 'Aktif' : 'Pasif';
                    return [
                        record.id ?? record.SponsorshipID ?? '',
                        record.donorName || record.DonorName || '-',
                        record.orphanName || record.BeneficiaryName || '-',
                        amount,
                        active
                    ];
                }
            )
        },
        reports: {
            loader: loadReports,
            refreshMessage: 'Rapor verileri yenilendi',
            exportMessage: 'Rapor verileri CSV olarak indirildi',
            exporter: () => exportReport({ silent: true })
        }
    };

    return configs[section];
}

function exportEntitiesToCsv(filenamePrefix, source, headers, mapRow) {
    if (!Array.isArray(source) || source.length === 0) {
        return false;
    }

    const rows = [headers, ...source.map(item => mapRow(item))];
    const csvContent = rows
        .map(row => row.map(sanitizeCsvValue).join(','))
        .join('\n');

    const timestamp = new Date().toISOString().split('T')[0];
    downloadCsv(csvContent, `${filenamePrefix}_${timestamp}.csv`);
    return true;
}

function sanitizeCsvValue(value) {
    if (value === null || value === undefined) {
        return '';
    }
    const stringValue = value.toString().replace(/"/g, '""');
    if (/[",\n]/.test(stringValue)) {
        return `"${stringValue}"`;
    }
    return stringValue;
}

function downloadCsv(content, filename) {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function updatePageTitle(pageName) {
    const t = translations[currentLanguage];
    const titles = {
        'dashboard': t.dashboardTitle,
        'donors': t.donorsManagement,
        'donations': t.donationsManagement,
        'beneficiaries': t.beneficiariesManagement,
        'aid': t.aidDistributionTitle,
        'staff': t.staffManagement,
        'sponsorship': t.orphanSponsorshipTitle,
        'reports': t.reportsAndStats
    };

    document.querySelector('.page-title').textContent = titles[pageName] || t.dashboardTitle;
}

function showPage(pageName) {
    const pages = document.querySelectorAll('.page');

    pages.forEach(page => {
        page.classList.remove('active');
    });

    const targetPage = document.getElementById(pageName);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    if (pageName === 'dashboard') {
        loadDashboardStats();
    } else if (pageName === 'donors') {
        loadDonors();
    } else if (pageName === 'donations') {
        loadDonations();
    } else if (pageName === 'beneficiaries') {
        loadBeneficiaries();
    } else if (pageName === 'aid') {
        loadAidDistributions();
    } else if (pageName === 'staff') {
        loadStaff();
    } else if (pageName === 'sponsorship') {
        loadSponsorships();
    } else if (pageName === 'reports') {
        loadReports();
    }
}

function showAlert(message, type = 'success') {
    const alert = document.getElementById('alert');
    alert.textContent = message;
    alert.className = type === 'error' ? 'alert alert-error' : 'alert';
    alert.style.display = 'block';

    setTimeout(() => {
        alert.style.display = 'none';
    }, 3000);
}



async function loadRealData() {
    try {
        await loadDashboardStats();
        showAlert('Veriler başarıyla yüklendi');
    } catch (error) {
        console.error('Veri yükleme hatası:', error);
    }
}


async function loadDashboardStats() {
    try {
        console.log('🔄 Kontrol paneli istatistikleri yükleniyor::', `${API_BASE_URL}/dashboard/stats`);
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const stats = await response.json();
        console.log('✅ İstatistikler yüklendi:', stats);

        document.getElementById('dashDonorsCount').textContent = stats.totalDonors || 0;
        document.getElementById('dashDonationsCount').textContent = stats.totalDonations || 0;
        document.getElementById('dashBeneficiariesCount').textContent = stats.totalBeneficiaries || 0;
        document.getElementById('dashStaffCount').textContent = stats.totalStaff || 0;
    } catch (error) {
        console.error('❌ İstatistik yükleme hatası:', error);
        console.log('ℹ️ Demo istatistikleri kullanılıyor');
        document.getElementById('dashDonorsCount').textContent = donors.length;
        document.getElementById('dashDonationsCount').textContent = donations.length;
        document.getElementById('dashBeneficiariesCount').textContent = beneficiaries.length;
        document.getElementById('dashStaffCount').textContent = staff.length;
    }
}


async function loadDonors() {
    try {
        console.log('🔄 Bağışçılar yükleniyor:', `${API_BASE_URL}/donors`);
        const response = await fetch(`${API_BASE_URL}/donors`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        donors = await response.json();
        console.log('✅ Yüklendi:', donors.length, 'bağışçı');
        updateDonorsTable();
    } catch (error) {
        console.error('❌ Bağışçılar yüklenirken hata:', error);
        console.log('ℹ️ Demo verileri kullanılıyor');
        updateDonorsTable();
    }
}

function updateDonorsStats() {
    const total = donors.length;
    const individual = donors.filter(d => d.type === 'Individual').length;
    const corporate = donors.filter(d => d.type === 'Corporate').length;
    const foundation = donors.filter(d => d.type === 'Foundation').length;

    const totalEl = document.getElementById('donorsStatTotal');
    const individualEl = document.getElementById('donorsStatIndividual');
    const corporateEl = document.getElementById('donorsStatCorporate');
    const foundationEl = document.getElementById('donorsStatFoundation');

    if (totalEl) totalEl.textContent = total;
    if (individualEl) individualEl.textContent = individual;
    if (corporateEl) corporateEl.textContent = corporate;
    if (foundationEl) foundationEl.textContent = foundation;
}

function updateDonorsTable() {
    const t = translations[currentLanguage];
    const tbody = document.getElementById('donorsTableBody');
    tbody.innerHTML = '';

    updateDonorsStats();

    if (donors.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">${t.noDonorsData}</td></tr>`;
        return;
    }

    donors.forEach(donor => {
        const typeText = donor.type === 'Individual' ? 'Birey' :
                        donor.type === 'Corporate' ? 'Şirket' : 'Vakıf';

        const row = `
            <tr>
                <td>${donor.id}</td>
                <td>${donor.firstName} ${donor.lastName}</td>
                <td>${donor.phone || '-'}</td>
                <td>${donor.email || '-'}</td>
                <td><span class="badge badge-success">${typeText}</span></td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editDonor(${donor.id})">Düzenle</button>
                    <button class="btn-delete" onclick="deleteDonor(${donor.id})">Sil</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function addDonor(event) {
    event.preventDefault();

    const donorData = {
        firstName: document.getElementById('donorFirstName').value,
        lastName: document.getElementById('donorLastName').value,
        phone: document.getElementById('donorPhone').value,
        email: document.getElementById('donorEmail').value,
        address: document.getElementById('donorAddress').value,
        city: document.getElementById('donorCity').value,
        country: document.getElementById('donorCountry').value || 'Turkey',
        type: document.getElementById('donorType').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/donors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donorData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Eklendi bağışçı başarıyla');
            closeModal();
            loadDonors();
            loadDashboardStats();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Ekleme hatası bağışçı:', error);
    }

    return false;
}

async function editDonor(id) {
    const donor = donors.find(d => d.id === id);
    if (!donor) return;

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = 'Bağışçı Bilgilerini Düzenle';
    modalBody.innerHTML = `
        <form id="editDonorForm" onsubmit="updateDonor(event, ${id})">
            <div class="form-grid">
                <div class="form-group">
                    <label>Ad *</label>
                    <input type="text" id="editDonorFirstName" value="${donor.firstName}" required>
                </div>
                <div class="form-group">
                    <label>Soyad *</label>
                    <input type="text" id="editDonorLastName" value="${donor.lastName}" required>
                </div>
                <div class="form-group">
                    <label>Telefon Numarası</label>
                    <input type="tel" id="editDonorPhone" value="${donor.phone || ''}">
                </div>
                <div class="form-group">
                    <label>E-posta</label>
                    <input type="email" id="editDonorEmail" value="${donor.email || ''}">
                </div>
                <div class="form-group">
                    <label>Adres</label>
                    <input type="text" id="editDonorAddress" value="${donor.address || ''}">
                </div>
                <div class="form-group">
                    <label>Şehir</label>
                    <input type="text" id="editDonorCity" value="${donor.city || ''}">
                </div>
                <div class="form-group">
                    <label>Ülke</label>
                    <input type="text" id="editDonorCountry" value="${donor.country || 'Turkey'}">
                </div>
                <div class="form-group">
                    <label>Bağışçı Türü *</label>
                    <select id="editDonorType" required>
                        <option value="Individual" ${donor.type === 'Individual' ? 'selected' : ''}>Birey</option>
                        <option value="Corporate" ${donor.type === 'Corporate' ? 'selected' : ''}>Şirket</option>
                        <option value="Foundation" ${donor.type === 'Foundation' ? 'selected' : ''}>Vakıf</option>
                    </select>
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                <button type="submit" class="btn btn-primary">Güncelle</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

async function updateDonor(event, id) {
    event.preventDefault();

    const donorData = {
        firstName: document.getElementById('editDonorFirstName').value,
        lastName: document.getElementById('editDonorLastName').value,
        phone: document.getElementById('editDonorPhone').value,
        email: document.getElementById('editDonorEmail').value,
        address: document.getElementById('editDonorAddress').value,
        city: document.getElementById('editDonorCity').value,
        country: document.getElementById('editDonorCountry').value,
        type: document.getElementById('editDonorType').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donorData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Güncellendi bağışçı başarıyla');
            closeModal();
            loadDonors();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Güncelleme hatası bağışçı:', error);
    }

    return false;
}

async function deleteDonor(id) {
    if (!confirm('Bu bağışçıyı silmek istediğinize emin misiniz?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/donors/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Silindi bağışçı başarıyla');
            loadDonors();
            loadDashboardStats();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Silme hatası bağışçı:', error);
    }
}


async function loadDonations() {
    try {
        console.log('🔄 Yükleniyor bağışlar den:', `${API_BASE_URL}/donations`);
        const response = await fetch(`${API_BASE_URL}/donations`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        donations = await response.json();
        console.log('✅ Yüklendi', donations.length, 'bağış');
        updateDonationsTable();
    } catch (error) {
        console.error('❌ Yükleme hatası bağışlar:', error);
        console.log('ℹ️ Demo verileri kullanılıyor');
        updateDonationsTable();
    }
}

function updateDonationsStats() {
    const total = donations.length;
    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const cashDonations = donations.filter(d => d.type === 'Cash').length;
    const monthlyDonations = donations.filter(d => d.type === 'Monthly').length;

    const totalEl = document.getElementById('donationsStatTotal');
    const amountEl = document.getElementById('donationsStatAmount');
    const cashEl = document.getElementById('donationsStatCash');
    const monthlyEl = document.getElementById('donationsStatMonthly');

    if (totalEl) totalEl.textContent = total;
    if (amountEl) amountEl.textContent = `${totalAmount.toLocaleString('tr-TR')} TRY`;
    if (cashEl) cashEl.textContent = cashDonations;
    if (monthlyEl) monthlyEl.textContent = monthlyDonations;
}

function updateDonationsTable() {
    const t = translations[currentLanguage];
    const tbody = document.getElementById('donationsTableBody');
    tbody.innerHTML = '';

    updateDonationsStats();

    if (donations.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">${t.noDonationsData}</td></tr>`;
        return;
    }

    donations.forEach(donation => {
        const paymentText = {
            'Cash': 'Nakit',
            'Card': 'Kart',
            'BankTransfer': 'Banka Transferi',
            'Check': 'Çek'
        }[donation.paymentMethod] || donation.paymentMethod;

        const row = `
            <tr>
                <td>${donation.id}</td>
                <td>${donation.donorName}</td>
                <td class="amount">${donation.amount.toLocaleString()} ${donation.currency || 'TRY'}</td>
                <td><span class="badge badge-success">${paymentText}</span></td>
                <td>${donation.date}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="viewDonation(${donation.id})">Görüntüle</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function addDonation(event) {
    event.preventDefault();

    const donationData = {
        donorId: parseInt(document.getElementById('donationDonor').value),
        branchId: 1,
        amount: parseFloat(document.getElementById('donationAmount').value),
        currency: document.getElementById('donationCurrency').value,
        type: document.getElementById('donationType').value,
        paymentMethod: document.getElementById('donationPaymentMethod').value,
        notes: document.getElementById('donationNotes').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/donations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(donationData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Kaydedildi bağış başarıyla');
            closeModal();
            loadDonations();
            loadDashboardStats();
            loadReportsData();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Kaydetme hatası bağış:', error);
    }

    return false;
}

function viewDonation(id) {
    const donation = donations.find(d => d.id === id);
    if (!donation) return;

    showAlert(`Detaylar bağış: ${donation.donorName} - ${donation.amount} ${donation.currency}`, 'info');
}


async function loadBeneficiaries() {
    try {
        console.log('🔄 Yükleniyor yararlanıcılar den:', `${API_BASE_URL}/beneficiaries`);
        const response = await fetch(`${API_BASE_URL}/beneficiaries`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        beneficiaries = await response.json();
        console.log('✅ Yüklendi', beneficiaries.length, 'yararlanıcı');
        updateBeneficiariesTable();
    } catch (error) {
        console.error('❌ Yükleme hatası yararlanıcılar:', error);
        console.log('ℹ️ Demo verileri kullanılıyor');
        updateBeneficiariesTable();
    }
}

function updateBeneficiariesStats() {
    const total = beneficiaries.length;
    const orphan = beneficiaries.filter(b => b.type === 'Orphan').length;
    const widow = beneficiaries.filter(b => b.type === 'Widow').length;
    const poor = beneficiaries.filter(b => b.type === 'Poor').length;

    const totalEl = document.getElementById('beneficiariesStatTotal');
    const orphanEl = document.getElementById('beneficiariesStatOrphan');
    const widowEl = document.getElementById('beneficiariesStatWidow');
    const poorEl = document.getElementById('beneficiariesStatPoor');

    if (totalEl) totalEl.textContent = total;
    if (orphanEl) orphanEl.textContent = orphan;
    if (widowEl) widowEl.textContent = widow;
    if (poorEl) poorEl.textContent = poor;
}

function updateBeneficiariesTable() {
    updateBeneficiariesStats();

    const t = translations[currentLanguage];
    const tbody = document.getElementById('beneficiariesTableBody');
    tbody.innerHTML = '';

    if (beneficiaries.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">${t.noBeneficiariesData}</td></tr>`;
        return;
    }

    beneficiaries.forEach(beneficiary => {
        const typeText = {
            'Orphan': 'Yetim',
            'Widow': 'Dul',
            'Disabled': 'Engelli',
            'Refugee': 'Mülteci',
            'Poor': 'Fakir'
        }[beneficiary.type] || beneficiary.type;

        const row = `
            <tr>
                <td>${beneficiary.id}</td>
                <td>${beneficiary.firstName} ${beneficiary.lastName}</td>
                <td><span class="badge badge-warning">${typeText}</span></td>
                <td>${beneficiary.phone || '-'}</td>
                <td>${beneficiary.city || '-'}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editBeneficiary(${beneficiary.id})">Düzenle</button>
                    <button class="btn-delete" onclick="deleteBeneficiary(${beneficiary.id})">Sil</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

async function addBeneficiary(event) {
    event.preventDefault();

    const beneficiaryData = {
        firstName: document.getElementById('beneficiaryFirstName').value,
        lastName: document.getElementById('beneficiaryLastName').value,
        phone: document.getElementById('beneficiaryPhone').value,
        address: document.getElementById('beneficiaryAddress').value,
        city: document.getElementById('beneficiaryCity').value,
        country: document.getElementById('beneficiaryCountry').value || 'Turkey',
        type: document.getElementById('beneficiaryType').value,
        familySize: parseInt(document.getElementById('beneficiaryFamilySize').value) || 1,
        monthlyIncome: parseFloat(document.getElementById('beneficiaryIncome').value) || 0
    };

    try {
        const response = await fetch(`${API_BASE_URL}/beneficiaries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(beneficiaryData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Eklendi yararlanıcı başarıyla');
            closeModal();
            loadBeneficiaries();
            loadDashboardStats();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Ekleme hatası yararlanıcı:', error);
    }

    return false;
}

async function editBeneficiary(id) {
    const beneficiary = beneficiaries.find(b => b.id === id);
    if (!beneficiary) return;

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = 'Yararlanıcı Bilgilerini Düzenle';
    modalBody.innerHTML = `
        <form id="editBeneficiaryForm" onsubmit="updateBeneficiary(event, ${id})">
            <div class="form-grid">
                <div class="form-group">
                    <label>Ad *</label>
                    <input type="text" id="editBeneficiaryFirstName" value="${beneficiary.firstName}" required>
                </div>
                <div class="form-group">
                    <label>Soyad *</label>
                    <input type="text" id="editBeneficiaryLastName" value="${beneficiary.lastName}" required>
                </div>
                <div class="form-group">
                    <label>Telefon Numarası</label>
                    <input type="tel" id="editBeneficiaryPhone" value="${beneficiary.phone || ''}">
                </div>
                <div class="form-group">
                    <label>Adres</label>
                    <input type="text" id="editBeneficiaryAddress" value="${beneficiary.address || ''}">
                </div>
                <div class="form-group">
                    <label>Şehir</label>
                    <input type="text" id="editBeneficiaryCity" value="${beneficiary.city || ''}">
                </div>
                <div class="form-group">
                    <label>Ülke</label>
                    <input type="text" id="editBeneficiaryCountry" value="${beneficiary.country || 'Turkey'}">
                </div>
                <div class="form-group">
                    <label>Yararlanıcı Türü *</label>
                    <select id="editBeneficiaryType" required>
                        <option value="Orphan" ${beneficiary.type === 'Orphan' ? 'selected' : ''}>Yetim</option>
                        <option value="Widow" ${beneficiary.type === 'Widow' ? 'selected' : ''}>Dul</option>
                        <option value="Disabled" ${beneficiary.type === 'Disabled' ? 'selected' : ''}>Engelli</option>
                        <option value="Refugee" ${beneficiary.type === 'Refugee' ? 'selected' : ''}>Mülteci</option>
                        <option value="Poor" ${beneficiary.type === 'Poor' ? 'selected' : ''}>Fakir</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Aile Üye Sayısı</label>
                    <input type="number" id="editBeneficiaryFamilySize" value="${beneficiary.familySize || 1}" min="1">
                </div>
                <div class="form-group">
                    <label>Gelir Aylık (TRY)</label>
                    <input type="number" id="editBeneficiaryIncome" value="${beneficiary.monthlyIncome || 0}" step="0.01">
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                <button type="submit" class="btn btn-primary">Güncelle</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

async function updateBeneficiary(event, id) {
    event.preventDefault();

    const beneficiaryData = {
        firstName: document.getElementById('editBeneficiaryFirstName').value,
        lastName: document.getElementById('editBeneficiaryLastName').value,
        phone: document.getElementById('editBeneficiaryPhone').value,
        address: document.getElementById('editBeneficiaryAddress').value,
        city: document.getElementById('editBeneficiaryCity').value,
        country: document.getElementById('editBeneficiaryCountry').value,
        type: document.getElementById('editBeneficiaryType').value,
        familySize: parseInt(document.getElementById('editBeneficiaryFamilySize').value) || 1,
        monthlyIncome: parseFloat(document.getElementById('editBeneficiaryIncome').value) || 0
    };

    try {
        const response = await fetch(`${API_BASE_URL}/beneficiaries/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(beneficiaryData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Güncellendi yararlanıcı başarıyla');
            closeModal();
            loadBeneficiaries();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Güncelleme hatası yararlanıcı:', error);
    }

    return false;
}

async function deleteBeneficiary(id) {
    if (!confirm('Bu yararlanıcıyı silmek istediğinize emin misiniz?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/beneficiaries/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Silindi yararlanıcı başarıyla');
            loadBeneficiaries();
            loadDashboardStats();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Silme hatası yararlanıcı:', error);
    }
}


async function loadAidDistributions() {
    try {
        console.log('🔄 Yükleniyor yardımlar den:', `${API_BASE_URL}/aid-distributions`);
        const response = await fetch(`${API_BASE_URL}/aid-distributions`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        aids = await response.json();
        console.log('✅ Yüklendi', aids.length, 'yardım');
        updateAidTable();
    } catch (error) {
        console.error('❌ Yükleme hatası yardımlar:', error);
        console.log('ℹ️ Demo verileri kullanılıyor');
        updateAidTable();
    }
}

function updateAidTable() {
    const t = translations[currentLanguage];
    const tbody = document.getElementById('aidTableBody');
    tbody.innerHTML = '';

    if (aids.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">${t.noAidsData}</td></tr>`;
        return;
    }

    aids.forEach(aid => {
        const aidTypeText = getAidTypeLabel(aid.aidType || aid.AidTypeName);
        const estimatedValue = Number(aid.estimatedValue ?? aid.EstimatedValue ?? 0);

        const row = `
            <tr>
                <td>${aid.id}</td>
                <td>${aid.beneficiaryName}</td>
                <td><span class="badge badge-info">${aidTypeText}</span></td>
                <td class="amount">${estimatedValue ? estimatedValue.toLocaleString('tr-TR') + ' TRY' : '-'}</td>
                <td>${aid.date}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="viewAid(${aid.id})">Görüntüle</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function getAidTypeLabel(type) {
    if (!type) return '-';
    const normalized = type.toString().toLowerCase();
    const map = {
        'food': 'Gıda',
        'gıda': 'Gıda',
        'medical': 'Tıbbi',
        'tıbbi': 'Tıbbi',
        'education': 'Eğitim',
        'eğitim': 'Eğitim',
        'housing': 'Konut',
        'konut': 'Konut',
        'emergency': 'Acil',
        'acil': 'Acil',
        'other': 'Diğer',
        'diğer': 'Diğer'
    };
    return map[normalized] || type;
}

async function addAidDistribution(event) {
    event.preventDefault();

    const aidData = {
        beneficiaryId: parseInt(document.getElementById('aidBeneficiary').value),
        aidType: document.getElementById('aidType').value,
        quantity: parseInt(document.getElementById('aidQuantity').value),
        estimatedValue: parseFloat(document.getElementById('aidValue').value),
        notes: document.getElementById('aidNotes').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/aid-distributions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(aidData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Kaydedildi yardım başarıyla');
            closeModal();
            loadAidDistributions();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Kaydetme hatası yardım:', error);
    }

    return false;
}

function viewAid(id) {
    const aid = aids.find(a => a.id === id);
    if (!aid) return;

    showAlert(`Detaylar yardım: ${aid.beneficiaryName} - ${aid.aidType}`, 'info');
}


async function loadStaff() {
    try {
        console.log('🔄 Yükleniyor personeller den:', `${API_BASE_URL}/staff`);
        const response = await fetch(`${API_BASE_URL}/staff`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        staff = await response.json();
        console.log('✅ Yüklendi', staff.length, 'personel');
        updateStaffTable();
    } catch (error) {
        console.error('❌ Yükleme hatası personeller:', error);
        console.log('ℹ️ Demo verileri kullanılıyor');
        updateStaffTable();
    }
}

function updateStaffTable() {
    updateStaffStats();

    const t = translations[currentLanguage];
    const tbody = document.getElementById('staffTableBody');
    tbody.innerHTML = '';

    if (staff.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">${t.noStaffData}</td></tr>`;
        return;
    }

    staff.forEach(employee => {
        const row = `
            <tr>
                <td>${employee.id}</td>
                <td>${employee.firstName} ${employee.lastName}</td>
                <td>${employee.position || '-'}</td>
                <td>${employee.department || '-'}</td>
                <td class="amount">${employee.salary ? employee.salary.toLocaleString() + ' TRY' : '-'}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="editStaff(${employee.id})">Düzenle</button>
                    <button class="btn-delete" onclick="deleteStaff(${employee.id})">Sil</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function updateStaffStats() {
    const total = staff.length;
    const departmentSet = new Set();
    let salarySum = 0;
    let managementCount = 0;

    staff.forEach(employee => {
        if (employee.department) {
            departmentSet.add(employee.department);
            if (employee.department.toLowerCase() === 'yönetim') {
                managementCount += 1;
            }
        }
        salarySum += employee.salary || 0;
    });

    const avgSalary = total ? salarySum / total : 0;

    const totalEl = document.getElementById('staffStatTotal');
    const deptEl = document.getElementById('staffStatDepartments');
    const avgEl = document.getElementById('staffStatAverageSalary');
    const mgmtEl = document.getElementById('staffStatManagement');

    if (totalEl) totalEl.textContent = total;
    if (deptEl) deptEl.textContent = departmentSet.size;
    if (avgEl) avgEl.textContent = `${Math.round(avgSalary).toLocaleString('tr-TR')} TRY`;
    if (mgmtEl) mgmtEl.textContent = managementCount;
}

async function addStaff(event) {
    event.preventDefault();

    const staffData = {
        firstName: document.getElementById('staffFirstName').value,
        lastName: document.getElementById('staffLastName').value,
        phone: document.getElementById('staffPhone').value,
        email: document.getElementById('staffEmail').value,
        position: document.getElementById('staffPosition').value,
        department: document.getElementById('staffDepartment').value,
        salary: parseFloat(document.getElementById('staffSalary').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/staff`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staffData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Eklendi personel başarıyla');
            closeModal();
            loadStaff();
            loadDashboardStats();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Ekleme hatası personel:', error);
    }

    return false;
}

async function editStaff(id) {
    const employee = staff.find(s => s.id === id);
    if (!employee) return;

    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    modalTitle.textContent = 'Personel Bilgilerini Düzenle';
    modalBody.innerHTML = `
        <form id="editStaffForm" onsubmit="updateStaff(event, ${id})">
            <div class="form-grid">
                <div class="form-group">
                    <label>Ad *</label>
                    <input type="text" id="editStaffFirstName" value="${employee.firstName}" required>
                </div>
                <div class="form-group">
                    <label>Soyad *</label>
                    <input type="text" id="editStaffLastName" value="${employee.lastName}" required>
                </div>
                <div class="form-group">
                    <label>Telefon Numarası</label>
                    <input type="tel" id="editStaffPhone" value="${employee.phone || ''}">
                </div>
                <div class="form-group">
                    <label>E-posta</label>
                    <input type="email" id="editStaffEmail" value="${employee.email || ''}">
                </div>
                <div class="form-group">
                    <label>Pozisyon *</label>
                    <input type="text" id="editStaffPosition" value="${employee.position || ''}" required>
                </div>
                <div class="form-group">
                    <label>Bölüm *</label>
                    <input type="text" id="editStaffDepartment" value="${employee.department || ''}" required>
                </div>
                <div class="form-group">
                    <label>Maaş (TRY) *</label>
                    <input type="number" id="editStaffSalary" value="${employee.salary || 0}" step="0.01" required>
                </div>
            </div>
            <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                <button type="submit" class="btn btn-primary">Güncelle</button>
            </div>
        </form>
    `;

    modal.classList.add('active');
}

async function updateStaff(event, id) {
    event.preventDefault();

    const staffData = {
        firstName: document.getElementById('editStaffFirstName').value,
        lastName: document.getElementById('editStaffLastName').value,
        phone: document.getElementById('editStaffPhone').value,
        email: document.getElementById('editStaffEmail').value,
        position: document.getElementById('editStaffPosition').value,
        department: document.getElementById('editStaffDepartment').value,
        salary: parseFloat(document.getElementById('editStaffSalary').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(staffData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Güncellendi personel başarıyla');
            closeModal();
            loadStaff();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Güncelleme hatası personel:', error);
    }

    return false;
}

async function deleteStaff(id) {
    if (!confirm('Bu personeli silmek istediğinize emin misiniz?')) return;

    try {
        const response = await fetch(`${API_BASE_URL}/staff/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Silindi personel başarıyla');
            loadStaff();
            loadDashboardStats();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Silme hatası personel:', error);
    }
}


async function loadSponsorships() {
    try {
        console.log('🔄 Yükleniyor sponsorluklar den:', `${API_BASE_URL}/sponsorships`);
        const response = await fetch(`${API_BASE_URL}/sponsorships`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        sponsorships = await response.json();
        console.log('✅ Yüklendi', sponsorships.length, 'sponsorluk');
        updateSponsorshipTable();
    } catch (error) {
        console.error('❌ Yükleme hatası sponsorluklar:', error);
        console.log('ℹ️ Demo verileri kullanılıyor');
        updateSponsorshipTable();
    }
}

function updateSponsorshipTable() {
    updateSponsorshipStats();

    const t = translations[currentLanguage];
    const tbody = document.getElementById('sponsorshipTableBody');
    tbody.innerHTML = '';

    if (sponsorships.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px;">${t.noSponsorshipsData}</td></tr>`;
        return;
    }

    sponsorships.forEach(sponsorship => {
        const paymentFrequency = sponsorship.paymentFrequency || sponsorship.frequency;
        const frequencyText = {
            'Monthly': 'Aylık',
            'Quarterly': 'Üç Aylık',
            'Yearly': 'Yıllık'
        }[paymentFrequency] || paymentFrequency || 'Bilinmiyor';

        const active = isSponsorshipActive(sponsorship);
        const statusText = active ?
            '<span class="status-dot success"></span> Aktif' :
            '<span class="status-dot"></span> Pasif';

        const row = `
            <tr>
                <td>${sponsorship.id}</td>
                <td>${sponsorship.donorName}</td>
                <td>${sponsorship.orphanName}</td>
                <td class="amount">${sponsorship.monthlyAmount.toLocaleString()} TRY</td>
                <td><span class="badge badge-info">${frequencyText}</span></td>
                <td>${statusText}</td>
                <td class="action-buttons">
                    <button class="btn-edit" onclick="viewSponsorship(${sponsorship.id})">Görüntüle</button>
                </td>
            </tr>
        `;
        tbody.innerHTML += row;
    });
}

function updateSponsorshipStats() {
    const total = sponsorships.length;
    const totalMonthlyAmount = sponsorships.reduce((sum, sponsorship) => sum + (sponsorship.monthlyAmount || 0), 0);
    const activeCount = sponsorships.filter(isSponsorshipActive).length;
    const averagePerOrphan = total ? totalMonthlyAmount / total : 0;

    const totalEl = document.getElementById('sponsorshipStatTotal');
    const activeEl = document.getElementById('sponsorshipStatActive');
    const monthlyEl = document.getElementById('sponsorshipStatMonthlyAmount');
    const avgEl = document.getElementById('sponsorshipStatAverage');

    if (totalEl) totalEl.textContent = total;
    if (activeEl) activeEl.textContent = activeCount;
    if (monthlyEl) monthlyEl.textContent = `${Math.round(totalMonthlyAmount).toLocaleString('tr-TR')} TRY`;
    if (avgEl) avgEl.textContent = `${Math.round(averagePerOrphan).toLocaleString('tr-TR')} TRY`;
}

function isSponsorshipActive(record) {
    if (!record) return false;
    if (typeof record.isActive === 'boolean') {
        return record.isActive;
    }
    if (typeof record.status === 'string') {
        return record.status.toLowerCase() === 'active' || record.status.toLowerCase() === 'aktif';
    }
    return false;
}

async function addSponsorship(event) {
    event.preventDefault();

    const sponsorshipData = {
        donorId: parseInt(document.getElementById('sponsorshipDonor').value),
        beneficiaryId: parseInt(document.getElementById('sponsorshipOrphan').value),
        monthlyAmount: parseFloat(document.getElementById('sponsorshipAmount').value),
        paymentFrequency: document.getElementById('sponsorshipFrequency').value
    };

    try {
        const response = await fetch(`${API_BASE_URL}/sponsorships`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(sponsorshipData)
        });

        const result = await response.json();

        if (result.success) {
            showAlert('Kaydedildi sponsorluk başarıyla');
            closeModal();
            loadSponsorships();
            refreshNotificationsAfterChange();
        } else {
        }
    } catch (error) {
        console.error('Kaydetme hatası sponsorluk:', error);
    }

    return false;
}

function viewSponsorship(id) {
    const sponsorship = sponsorships.find(s => s.id === id);
    if (!sponsorship) return;

    showAlert(`Detaylar sponsorluk: ${sponsorship.donorName} ← ${sponsorship.orphanName}`, 'info');
}


async function loadReports() {
    console.log('🔄 Yükleniyor raporlar');
    loadReportsData();
    return;

    try {
        console.log('🔄 Yükleniyor raporlar den:', `${API_BASE_URL}/reports`);
        const response = await fetch(`${API_BASE_URL}/reports`);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const reports = await response.json();
        console.log('✅ Yüklendi raporlar başarıyla');

        document.getElementById('totalDonations').textContent =
            `${reports.totalDonationAmount ? reports.totalDonationAmount.toLocaleString() : '0'} TRY`;
        document.getElementById('reportDonorsCount').textContent = reports.totalDonors || 0;
        document.getElementById('reportBeneficiariesCount').textContent = reports.totalBeneficiaries || 0;
        document.getElementById('totalAids').textContent = reports.totalAidDistributions || 0;

        if (reports.topDonors && reports.topDonors.length > 0) {
            const topDonorsBody = document.getElementById('topDonorsTable');
            topDonorsBody.innerHTML = '';

            reports.topDonors.forEach(donor => {
                const row = `
                    <tr>
                        <td>${donor.donorName}</td>
                        <td>${donor.donationCount}</td>
                        <td class="amount">${donor.totalAmount.toLocaleString()} TRY</td>
                    </tr>
                `;
                topDonorsBody.innerHTML += row;
            });
        }

        if (reports.aidByType && reports.aidByType.length > 0) {
            const aidByTypeBody = document.getElementById('aidByTypeTable');
            aidByTypeBody.innerHTML = '';

            reports.aidByType.forEach(aid => {
                const aidTypeText = {
                    'Food': 'Gıda',
                    'Medical': 'Tıbbi',
                    'Education': 'Eğitim',
                    'Housing': 'Konut',
                    'Emergency': 'Acil',
                    'Other': 'Diğer'
                }[aid.aidType] || aid.aidType;

                const row = `
                    <tr>
                        <td>${aidTypeText}</td>
                        <td>${aid.count}</td>
                        <td class="amount">${aid.totalValue ? aid.totalValue.toLocaleString() : '0'} TRY</td>
                    </tr>
                `;
                aidByTypeBody.innerHTML += row;
            });
        }

    } catch (error) {
        console.error('❌ Yükleme hatası raporlar:', error);
        console.error('Detaylar:', error.message);
    }
}


function showAddForm(type) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');

    if (type === 'donor') {
        modalTitle.textContent = 'Yeni Bağışçı Ekle';
        modalBody.innerHTML = `
            <form id="donorForm" onsubmit="addDonor(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Ad *</label>
                        <input type="text" id="donorFirstName" required>
                    </div>
                    <div class="form-group">
                        <label>Soyad *</label>
                        <input type="text" id="donorLastName" required>
                    </div>
                    <div class="form-group">
                        <label>Telefon Numarası</label>
                        <input type="tel" id="donorPhone" placeholder="+90 555 123 4567">
                    </div>
                    <div class="form-group">
                        <label>E-posta</label>
                        <input type="email" id="donorEmail" placeholder="example@email.com">
                    </div>
                    <div class="form-group">
                        <label>Adres</label>
                        <input type="text" id="donorAddress">
                    </div>
                    <div class="form-group">
                        <label>Şehir</label>
                        <input type="text" id="donorCity">
                    </div>
                    <div class="form-group">
                        <label>Ülke</label>
                        <input type="text" id="donorCountry" value="Turkey">
                    </div>
                    <div class="form-group">
                        <label>Bağışçı Türü *</label>
                        <select id="donorType" required>
                            <option value="">Tür Seçin</option>
                            <option value="Individual">Birey</option>
                            <option value="Corporate">Şirket</option>
                            <option value="Foundation">Vakıf</option>
                        </select>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                    <button type="submit" class="btn btn-primary">Ekle</button>
                </div>
            </form>
        `;
    } else if (type === 'donation') {
        loadDonors().then(() => {
            modalTitle.textContent = 'Yeni Bağış Kaydet';
            modalBody.innerHTML = `
                <form id="donationForm" onsubmit="addDonation(event)">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Bağışçı *</label>
                            <select id="donationDonor" required>
                                <option value="">Bağışçı Seçin</option>
                                ${donors.map(d => `<option value="${d.id}">${d.firstName} ${d.lastName}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Tutar *</label>
                            <input type="number" id="donationAmount" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Para Birimi</label>
                            <select id="donationCurrency">
                                <option value="TRY">Türk Lirası (TRY)</option>
                                <option value="USD">ABD Doları (USD)</option>
                                <option value="EUR">Euro (EUR)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Bağış Türü *</label>
                            <select id="donationType" required>
                                <option value="">Tür Seçin</option>
                                <option value="Cash">Nakit</option>
                                <option value="Online">Online</option>
                                <option value="BankTransfer">Banka Transferi</option>
                                <option value="InKind">Ayni</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Ödeme Yöntemi *</label>
                            <select id="donationPaymentMethod" required>
                                <option value="">Yöntem Seçin</option>
                                <option value="Cash">Nakit</option>
                                <option value="Card">Kart</option>
                                <option value="BankTransfer">Banka Transferi</option>
                                <option value="Check">Çek</option>
                            </select>
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label>Notlar</label>
                            <textarea id="donationNotes" rows="3"></textarea>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                        <button type="submit" class="btn btn-primary">kaydetme</button>
                    </div>
                </form>
            `;
        });
    } else if (type === 'beneficiary') {
        modalTitle.textContent = 'Yeni Yararlanıcı Ekle';
        modalBody.innerHTML = `
            <form id="beneficiaryForm" onsubmit="addBeneficiary(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Ad *</label>
                        <input type="text" id="beneficiaryFirstName" required>
                    </div>
                    <div class="form-group">
                        <label>Soyad *</label>
                        <input type="text" id="beneficiaryLastName" required>
                    </div>
                    <div class="form-group">
                        <label>Telefon Numarası</label>
                        <input type="tel" id="beneficiaryPhone">
                    </div>
                    <div class="form-group">
                        <label>Adres</label>
                        <input type="text" id="beneficiaryAddress">
                    </div>
                    <div class="form-group">
                        <label>Şehir</label>
                        <input type="text" id="beneficiaryCity">
                    </div>
                    <div class="form-group">
                        <label>Ülke</label>
                        <input type="text" id="beneficiaryCountry" value="Turkey">
                    </div>
                    <div class="form-group">
                        <label>Yararlanıcı Türü *</label>
                        <select id="beneficiaryType" required>
                            <option value="">Tür Seçin</option>
                            <option value="Orphan">Yetim</option>
                            <option value="Widow">Dul</option>
                            <option value="Disabled">Engelli</option>
                            <option value="Refugee">Mülteci</option>
                            <option value="Poor">Fakir</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Aile Üye Sayısı</label>
                        <input type="number" id="beneficiaryFamilySize" value="1" min="1">
                    </div>
                    <div class="form-group">
                        <label>Gelir Aylık (TRY)</label>
                        <input type="number" id="beneficiaryIncome" step="0.01" value="0">
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                    <button type="submit" class="btn btn-primary">Ekle</button>
                </div>
            </form>
        `;
    } else if (type === 'aid') {
        loadBeneficiaries().then(() => {
            modalTitle.textContent = 'Yeni Yardım Kaydet';
            modalBody.innerHTML = `
                <form id="aidForm" onsubmit="addAidDistribution(event)">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Yararlanıcı *</label>
                            <select id="aidBeneficiary" required>
                                <option value="">Yararlanıcı Seçin</option>
                                ${beneficiaries.map(b => `<option value="${b.id}">${b.firstName} ${b.lastName}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Yardım Türü *</label>
                            <select id="aidType" required>
                                <option value="">Tür Seçin</option>
                                <option value="Food">Gıda</option>
                                <option value="Medical">Tıbbi</option>
                                <option value="Education">Eğitim</option>
                                <option value="Housing">Konut</option>
                                <option value="Emergency">Acil</option>
                                <option value="Other">Diğer</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Miktar *</label>
                            <input type="number" id="aidQuantity" value="1" min="1" required>
                        </div>
                        <div class="form-group">
                            <label>Tahmini Değer (TRY)</label>
                            <input type="number" id="aidValue" step="0.01">
                        </div>
                        <div class="form-group" style="grid-column: 1 / -1;">
                            <label>Notlar</label>
                            <textarea id="aidNotes" rows="3"></textarea>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                        <button type="submit" class="btn btn-primary">kaydetme</button>
                    </div>
                </form>
            `;
        });
    } else if (type === 'staff') {
        modalTitle.textContent = 'Yeni Personel Ekle';
        modalBody.innerHTML = `
            <form id="staffForm" onsubmit="addStaff(event)">
                <div class="form-grid">
                    <div class="form-group">
                        <label>Ad *</label>
                        <input type="text" id="staffFirstName" required>
                    </div>
                    <div class="form-group">
                        <label>Soyad *</label>
                        <input type="text" id="staffLastName" required>
                    </div>
                    <div class="form-group">
                        <label>Telefon Numarası</label>
                        <input type="tel" id="staffPhone">
                    </div>
                    <div class="form-group">
                        <label>E-posta</label>
                        <input type="email" id="staffEmail">
                    </div>
                    <div class="form-group">
                        <label>Pozisyon *</label>
                        <input type="text" id="staffPosition" required>
                    </div>
                    <div class="form-group">
                        <label>Bölüm *</label>
                        <input type="text" id="staffDepartment" required>
                    </div>
                    <div class="form-group">
                        <label>Maaş (TRY) *</label>
                        <input type="number" id="staffSalary" step="0.01" required>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                    <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                    <button type="submit" class="btn btn-primary">Ekle</button>
                </div>
            </form>
        `;
    } else if (type === 'sponsorship') {
        Promise.all([loadDonors(), loadBeneficiaries()]).then(() => {
            const orphans = beneficiaries.filter(b => b.type === 'Orphan');

            modalTitle.textContent = 'Yeni Sponsorluk Ekle';
            modalBody.innerHTML = `
                <form id="sponsorshipForm" onsubmit="addSponsorship(event)">
                    <div class="form-grid">
                        <div class="form-group">
                            <label>Sponsor *</label>
                            <select id="sponsorshipDonor" required>
                                <option value="">Sponsor Seçin</option>
                                ${donors.map(d => `<option value="${d.id}">${d.firstName} ${d.lastName}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Yetim *</label>
                            <select id="sponsorshipOrphan" required>
                                <option value="">Yetim Seçin</option>
                                ${orphans.map(o => `<option value="${o.id}">${o.firstName} ${o.lastName}</option>`).join('')}
                            </select>
                        </div>
                        <div class="form-group">
                            <label>Aylık Tutar (TRY) *</label>
                            <input type="number" id="sponsorshipAmount" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label>Ödeme Sıklığı *</label>
                            <select id="sponsorshipFrequency" required>
                                <option value="">Sıklık Seçin</option>
                                <option value="Monthly">Aylık</option>
                                <option value="Quarterly">Üç Aylık</option>
                                <option value="Yearly">Yıllık</option>
                            </select>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px; justify-content: flex-end; margin-top: 20px;">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">İptal</button>
                        <button type="submit" class="btn btn-primary">kaydetme</button>
                    </div>
                </form>
            `;
        });
    }

    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.remove('active');
}

window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}


function switchLanguage(lang) {
    currentLanguage = lang;

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });

    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');

    const activeLink = document.querySelector('.nav-link.active');
    const currentPage = (activeLink && activeLink.getAttribute('data-page')) || 'dashboard';
    updatePageTitle(currentPage);

    updateStaticTexts();

    translateAllPageContent();

    const activePage = document.querySelector('.page.active');
    if (activePage) {
        const pageId = activePage.id;
        if (pageId === 'donors' && donors.length > 0) updateDonorsTable();
        else if (pageId === 'donations' && donations.length > 0) updateDonationsTable();
        else if (pageId === 'beneficiaries' && beneficiaries.length > 0) updateBeneficiariesTable();
        else if (pageId === 'aid-distribution' && aids.length > 0) updateAidTable();
        else if (pageId === 'staff' && staff.length > 0) updateStaffTable();
        else if (pageId === 'orphan-sponsorship' && sponsorships.length > 0) updateSponsorshipTable();
    }
}

function updateStaticTexts() {
    const t = translations[currentLanguage];

    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.placeholder = t.searchPlaceholder;

    const notificationTitle = document.getElementById('notificationTitle');
    if (notificationTitle) notificationTitle.textContent = t.notifications;

    const markAllReadBtn = document.getElementById('markAllReadBtn');
    if (markAllReadBtn) markAllReadBtn.textContent = t.markAllAsRead;

    const navLinks = {
        'dashboard': t.dashboard,
        'donors': t.donors,
        'donations': t.donations,
        'beneficiaries': t.beneficiaries,
        'aid-distribution': t.aidDistribution,
        'staff': t.staff,
        'orphan-sponsorship': t.orphanSponsorship,
        'reports': t.reports
    };

    document.querySelectorAll('.nav-link').forEach(link => {
        const page = link.getAttribute('data-page');
        const span = link.querySelector('span');
        if (span && navLinks[page]) {
            span.textContent = navLinks[page];
        }
    });

    updatePageHeadings(t);

    updateActionButtons(t);

    updateTableHeaders(t);

    updateReportsPageTexts(t);
}

function updatePageHeadings(t) {
    const statCards = document.querySelectorAll('.stat-card h4');
    if (statCards[0]) statCards[0].textContent = t.totalDonors;
    if (statCards[1]) statCards[1].textContent = t.totalDonations;
    if (statCards[2]) statCards[2].textContent = t.totalBeneficiaries;
    if (statCards[3]) statCards[3].textContent = t.totalStaff;
}

function updateActionButtons(t) {
    const addButtons = document.querySelectorAll('.btn-primary');
    addButtons.forEach(btn => {
        const text = btn.textContent.trim();
        if (text.includes('Bağışçı Ekle') || text.includes('Bağışçı Ekle')) {
            btn.innerHTML = btn.innerHTML.replace(/Bağışçı Ekle|Bağışçı Ekle/, t.addDonor);
        } else if (text.includes('kaydetme bağış') || text.includes('Bağış Kaydet')) {
            btn.innerHTML = btn.innerHTML.replace(/kaydetme bağış|Bağış Kaydet/, t.addDonation);
        } else if (text.includes('Yararlanıcı Ekle') || text.includes('Yararlanıcı Ekle')) {
            btn.innerHTML = btn.innerHTML.replace(/Yararlanıcı Ekle|Yararlanıcı Ekle/, t.addBeneficiary);
        } else if (text.includes('kaydetme yardım') || text.includes('Yardım Kaydet')) {
            btn.innerHTML = btn.innerHTML.replace(/kaydetme yardım|Yardım Kaydet/, t.addAid);
        } else if (text.includes('Personel Ekle') || text.includes('Personel Ekle')) {
            btn.innerHTML = btn.innerHTML.replace(/Personel Ekle|Personel Ekle/, t.addStaff);
        } else if (text.includes('Sponsorluk Ekle') || text.includes('Sponsorluk Ekle')) {
            btn.innerHTML = btn.innerHTML.replace(/Sponsorluk Ekle|Sponsorluk Ekle/, t.addSponsorship);
        } else if (text.includes('Rapor İndir') || text.includes('Rapor İndir')) {
            const svg = btn.querySelector('svg');
            btn.innerHTML = '';
            if (svg) btn.appendChild(svg);
            btn.appendChild(document.createTextNode(t.exportReport));
        }
    });
}

function updateTableHeaders(t) {
    document.querySelectorAll('thead th').forEach(th => {
        const text = th.textContent.trim();
        const headerMap = {
            'Numara': t.number,
            '#': t.number,
            'Numara': t.number,
            'Ad': t.name,
            'İsim': t.name,
            'Ad': t.name,
            'Telefon': t.phone,
            'Telefon': t.phone,
            'E-posta': t.email,
            'E-posta': t.email,
            'Şehir': t.city,
            'Şehir': t.city,
            'Ülke': t.country,
            'Ülke': t.country,
            'Tür': t.type,
            'Tür': t.type,
            'Tutar': t.amount,
            'Tutar': t.amount,
            'Aylık Tutar': t.monthlyAmount,
            'Aylık Tutar': t.monthlyAmount,
            'Tarih': t.date,
            'Tarih': t.date,
            'İşlemler': t.actions,
            'İşlemler': t.actions,
            'bağışçı': t.donor,
            'Bağışçı': t.donor,
            'yararlanıcı': t.beneficiary,
            'Yararlanıcı': t.beneficiary,
            'Sponsor': t.donor,
            'Sponsor': t.donor,
            'Yetim': t.orphan,
            'Yetim': t.orphan,
            'Pozisyon': t.position,
            'Pozisyon': t.position,
            'Bölüm': t.department,
            'Bölüm': t.department,
            'Maaş': t.salary,
            'Maaş': t.salary,
            'Durum': t.status,
            'Durum': t.status,
            'Sıklık': t.frequency,
            'Sıklık': t.frequency,
            'Tekrar': t.frequency,
            'Bağış Sayısı': t.donationCount,
            'Bağış Sayısı': t.donationCount,
            'Toplam Tutar': t.totalAmount,
            'Toplam Tutar': t.totalAmount,
            'Son Bağış': t.lastDonation,
            'Son Bağış': t.lastDonation,
            'Yardım Türü': t.aidType,
            'Yardım Türü': t.aidType,
            'Sayı': t.quantity,
            'Miktar': t.quantity,
            'Değer': t.value,
            'Değer': t.value,
            'Toplam Değer': t.totalAmount,
            'Toplam Değer': t.totalAmount,
            'Yüzde': t.percentage,
            'Yüzde': t.percentage,
            'Detaylar': 'Detaylar',
            'Detaylar': 'Detaylar'
        };

        if (headerMap[text]) {
            th.textContent = headerMap[text];
        }
    });
}

function updateReportsPageTexts(t) {
    const reportPeriod = document.getElementById('reportPeriod');
    if (reportPeriod) {
        reportPeriod.options[0].text = t.allPeriods;
        reportPeriod.options[1].text = t.today;
        reportPeriod.options[2].text = t.thisWeek;
        reportPeriod.options[3].text = t.thisMonth;
        reportPeriod.options[4].text = t.thisYear;
    }

    const statLabels = document.querySelectorAll('.stat-label');
    if (statLabels[0]) statLabels[0].textContent = t.totalDonations;
    if (statLabels[1]) statLabels[1].textContent = t.totalDonors;
    if (statLabels[2]) statLabels[2].textContent = t.totalBeneficiaries;
    if (statLabels[3]) statLabels[3].textContent = t.totalAidsDistributed;

    const chartHeaders = document.querySelectorAll('.chart-card .card-header h3');
    if (chartHeaders[0]) chartHeaders[0].textContent = t.monthlyDonations;
    if (chartHeaders[1]) chartHeaders[1].textContent = t.donationsByType;

    const chartSubtitles = document.querySelectorAll('.chart-subtitle');
    if (chartSubtitles[0]) chartSubtitles[0].textContent = t.last6Months;

    const insightLabels = document.querySelectorAll('.insight-label');
    if (insightLabels[0]) insightLabels[0].textContent = t.averageMonthlyDonation;
    if (insightLabels[1]) insightLabels[1].textContent = t.beneficiaryFamilies;
    if (insightLabels[2]) insightLabels[2].textContent = t.annualGrowthRate;
    if (insightLabels[3]) insightLabels[3].textContent = t.sponsoredOrphans;
}

function translateAllPageContent() {
    const t = translations[currentLanguage];

    const dashStatCards = document.querySelectorAll('#dashboard .stat-card .stat-label');
    if (dashStatCards[0]) dashStatCards[0].textContent = t.totalDonors;
    if (dashStatCards[1]) dashStatCards[1].textContent = t.totalDonations;
    if (dashStatCards[2]) dashStatCards[2].textContent = t.totalBeneficiaries;
    if (dashStatCards[3]) dashStatCards[3].textContent = t.totalStaff;

    const pageHeaders = {
        'donors': t.donorsManagement,
        'donations': t.donationsManagement,
        'beneficiaries': t.beneficiariesManagement,
        'aid-distribution': t.aidDistributionTitle,
        'staff': t.staffManagement,
        'orphan-sponsorship': t.orphanSponsorshipTitle,
        'reports': t.reportsAndStats
    };

    document.querySelectorAll('.page').forEach(page => {
        const pageId = page.id;
        const h2 = page.querySelector('.page-header h2');
        if (h2 && pageHeaders[pageId]) {
            h2.textContent = pageHeaders[pageId];
        }
    });

    translateAddButtons(t);

    const chartLabels = document.querySelectorAll('#reports .chart-labels span');
    const monthsAr = ['Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const monthsTr = ['Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
    const months = currentLanguage === 'ar' ? monthsAr : monthsTr;
    chartLabels.forEach((label, index) => {
        if (months[index]) label.textContent = months[index];
    });

    const pieLabels = document.querySelectorAll('#reports .pie-chart-item span');
    const typesAr = ['Nakit', 'Ayni', 'sponsorluklar'];
    const typesTr = ['Nakit', 'Ayni', 'Sponsorluk'];
    const types = currentLanguage === 'ar' ? typesAr : typesTr;
    pieLabels.forEach((label, index) => {
        if (types[index]) label.textContent = types[index];
    });

    const reportCardHeaders = document.querySelectorAll('#reports .card-header h3');
    if (reportCardHeaders[2]) reportCardHeaders[2].textContent = t.topDonors;
    if (reportCardHeaders[3]) reportCardHeaders[3].textContent = t.aidsByType;
    if (reportCardHeaders[4]) reportCardHeaders[4].textContent = t.performanceSummary;

    const badges = document.querySelectorAll('.badge');
    badges.forEach(badge => {
        if (badge.textContent.includes('Top 10')) {
            badge.textContent = 'Top 10';
        } else if (badge.textContent.includes('Detaylı') || badge.textContent.includes('Detaylı')) {
            badge.textContent = currentLanguage === 'ar' ? 'Detaylı' : 'Detaylı';
        }
    });

    translateNoDataMessages(t);

    translateTableHeaders(t);
}

function translateAddButtons(t) {
    document.querySelectorAll('.btn-primary').forEach(btn => {
        const onclick = btn.getAttribute('onclick');
        if (!onclick) return;

        let newText = '';
        if (onclick.includes('showAddForm(\'donor\')')) {
            newText = t.addDonor;
        } else if (onclick.includes('showAddForm(\'donation\')')) {
            newText = t.addDonation;
        } else if (onclick.includes('showAddForm(\'beneficiary\')')) {
            newText = t.addBeneficiary;
        } else if (onclick.includes('showAddForm(\'aid\')')) {
            newText = t.addAid;
        } else if (onclick.includes('showAddForm(\'staff\')')) {
            newText = t.addStaff;
        } else if (onclick.includes('showAddForm(\'sponsorship\')')) {
            newText = t.addSponsorship;
        } else if (onclick.includes('exportReport()')) {
            const svg = btn.querySelector('svg');
            if (svg) {
                btn.innerHTML = '';
                btn.appendChild(svg);
                btn.appendChild(document.createTextNode(t.exportReport));
            }
            return;
        }

        if (newText) {
            btn.textContent = newText;
        }
    });
}

function translateNoDataMessages(t) {
    document.querySelectorAll('tbody p, .no-notifications p, .search-results p').forEach(p => {
        if (p.textContent.includes('Veri yok') || p.textContent.includes('Veri yok')) {
            p.textContent = t.noData;
        } else if (p.textContent.includes('Bildirim yok') || p.textContent.includes('Bildirim yok')) {
            p.textContent = t.noNotifications;
        } else if (p.textContent.includes('Sonuç bulunamadı') || p.textContent.includes('Sonuç bulunamadı')) {
            p.textContent = t.noResults;
        }
    });
}


async function loadNotifications(autoRender = true) {
    try {
        const response = await fetch(`${API_BASE_URL}/notifications`);
        if (!response.ok) {
            throw new Error('API notifications unavailable');
        }

        const data = await response.json();
        notifications = data.map(normalizeNotificationPayload);
    } catch (error) {
        const errorMessage = error && error.message ? error.message : error;
        console.warn('Using sample notifications', errorMessage);
        notifications = getSampleNotifications();
    }

    updateNotificationBadge();

    const notificationPanel = document.getElementById('notificationPanel');
    if (autoRender && notificationPanel && notificationPanel.classList.contains('active')) {
        renderNotifications();
    }
}

function normalizeNotificationPayload(item) {
    return {
        id: item.id,
        type: item.type || 'info',
        title: item.title || '',
        message: item.message || '',
        createdAt: item.createdAt || item.time || new Date().toISOString(),
        read: Boolean(item.read ?? item.isRead ?? false)
    };
}

function getSampleNotifications() {
    const now = Date.now();
    const baseSamples = currentLanguage === 'ar'
        ? [
            { id: 1, type: 'success', title: 'Yeni Bağış', message: 'Mehmet Ahmet\'ten 5000 TRY bağış alındı', time: '5 dakika önce', read: false },
            { id: 2, type: 'info', title: 'Yeni Yararlanıcı', message: 'Yetim sponsorluğu sistemine yeni yararlanıcı eklendi', time: '1 saat önce', read: false },
            { id: 3, type: 'warning', title: 'Uyarı', message: 'Aylık yardım dağıtım tarihi yaklaşıyor', time: '2 saat önce', read: true },
            { id: 4, type: 'success', title: 'Aylık Rapor', message: 'Aralık ayı aylık raporu başarıyla oluşturuldu', time: '3 saat önce', read: true },
            { id: 5, type: 'info', title: 'Yeni Personel', message: 'Yardım bölümüne yeni personel eklendi', time: 'Dün', read: true }
        ]
        : [
            { id: 1, type: 'success', title: 'Yeni Bağış', message: 'Mehmet Ahmet\'ten 5000 TL bağış alındı', time: '5 dakika önce', read: false },
            { id: 2, type: 'info', title: 'Yeni Yararlanıcı', message: 'Yetim sponsorluğu sistemine yeni bir yararlanıcı kaydedildi', time: '1 saat önce', read: false },
            { id: 3, type: 'warning', title: 'Uyarı', message: 'Aylık yardım dağıtım tarihi yaklaşıyor', time: '2 saat önce', read: true },
            { id: 4, type: 'success', title: 'Aylık Rapor', message: 'Aralık ayı raporu başarıyla oluşturuldu', time: '3 saat önce', read: true },
            { id: 5, type: 'info', title: 'Yeni Personel', message: 'Yardım bölümüne yeni bir personel eklendi', time: 'Dün', read: true }
        ];

    return baseSamples.map((item, index) => normalizeNotificationPayload({
        ...item,
        createdAt: new Date(now - (index + 1) * 15 * 60 * 1000).toISOString()
    }));
}

function toggleNotifications() {
    const panel = document.getElementById('notificationPanel');
    const isActive = panel.classList.toggle('active');

    if (isActive) {
        renderNotifications();
        loadNotifications();
    }

    if (isActive) {
        setTimeout(() => {
            document.addEventListener('click', closeNotificationsOnClickOutside);
        }, 100);
    } else {
        document.removeEventListener('click', closeNotificationsOnClickOutside);
    }
}

function closeNotificationsOnClickOutside(event) {
    const panel = document.getElementById('notificationPanel');
    const notificationBtn = document.querySelector('.notification-btn');

    if (!panel.contains(event.target) && !notificationBtn.contains(event.target)) {
        panel.classList.remove('active');
        document.removeEventListener('click', closeNotificationsOnClickOutside);
    }
}

function renderNotifications() {
    const notificationList = document.getElementById('notificationList');
    const t = translations[currentLanguage];

    if (notifications.length === 0) {
        notificationList.innerHTML = `
            <div class="no-notifications">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                </svg>
                <p>${t.noNotifications}</p>
            </div>
        `;
        return;
    }

    notificationList.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'}" onclick="markAsRead(${notif.id})">
            <div class="notification-icon ${notif.type}">
                ${getNotificationIcon(notif.type)}
            </div>
            <div class="notification-content">
                <div class="notification-title">${notif.title}</div>
                <div class="notification-message">${notif.message}</div>
                <div class="notification-time">${formatNotificationTime(notif.createdAt) || notif.time || ''}</div>
            </div>
        </div>
    `).join('');
}

function getNotificationIcon(type) {
    const icons = {
        success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>',
        warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
        info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>'
    };
    return icons[type] || icons.info;
}

function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('.notification-badge');

    if (badge) {
        if (unreadCount > 0) {
            badge.textContent = unreadCount;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    }
}

function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (!notification || notification.read) return;

    notification.read = true;
    updateNotificationBadge();
    renderNotifications();

    fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'POST'
    }).catch(err => console.error('Bildirim güncellenemedi:', err));
}

function markAllAsRead() {
    notifications.forEach(n => n.read = true);
    updateNotificationBadge();
    renderNotifications();

    fetch(`${API_BASE_URL}/notifications/read-all`, {
        method: 'POST'
    }).catch(err => console.error('Bildirimler güncellenemedi:', err));
}

document.addEventListener('DOMContentLoaded', function() {
    loadNotifications();
});

function formatNotificationTime(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';

    const diffMs = Date.now() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return 'Az önce';
    if (diffMinutes < 60) return `${diffMinutes} dk önce`;
    if (diffHours < 24) return `${diffHours} sa önce`;
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleString('tr-TR');
}

function refreshNotificationsAfterChange() {
    loadNotifications(false);
}


async function loadReportsData() {
    const periodSelect = document.getElementById('reportPeriod');
    const period = (periodSelect && periodSelect.value) || 'month';

    try {
        const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
        if (response.ok) {
            const stats = await response.json();

            document.getElementById('totalDonationsAmount').textContent =
                (stats.totalDonationAmount || 0).toLocaleString('tr-TR') + ' ₺';
            document.getElementById('reportDonorsCount').textContent = stats.totalDonors || 0;
            document.getElementById('reportBeneficiariesCount').textContent = stats.totalBeneficiaries || 0;
            document.getElementById('totalAidsCount').textContent = stats.totalAidDistributions || 0;

        }

        await loadTopDonors();

        await loadAidByType();

    } catch (error) {
        console.error('Rapor verisi yükleme hatası:', error);
    }
}

async function loadTopDonors() {
    try {
        const donorsResponse = await fetch(`${API_BASE_URL}/donors`);
        const donationsResponse = await fetch(`${API_BASE_URL}/donations`);

        if (!donorsResponse.ok || !donationsResponse.ok) {
            throw new Error('Top donor API cevabı geçersiz');
        }

        const donorList = await donorsResponse.json();
        const donationList = await donationsResponse.json();

        const donorStats = {};
        donationList.forEach(donation => {
            const donorId = donation.donorId ?? donation.DonorID;
            if (!donorId) return;

            const amount = parseFloat(donation.amount ?? donation.DonationAmount ?? 0) || 0;
            const dateValue = donation.date || donation.DonationDate || new Date().toISOString();
            const parsedDate = parseDateString(dateValue) || new Date();

            if (!donorStats[donorId]) {
                donorStats[donorId] = {
                    count: 0,
                    total: 0,
                    lastDate: parsedDate
                };
            }

            donorStats[donorId].count += 1;
            donorStats[donorId].total += amount;

            if (parsedDate > donorStats[donorId].lastDate) {
                donorStats[donorId].lastDate = parsedDate;
            }
        });

        const topDonors = donorList
            .filter(donor => donorStats[donor.id ?? donor.DonorID])
            .map(donor => {
                const donorId = donor.id ?? donor.DonorID;
                return {
                    id: donorId,
                    firstName: donor.firstName || donor.FirstName || '',
                    lastName: donor.lastName || donor.LastName || '',
                    ...donorStats[donorId]
                };
            })
            .sort((a, b) => b.total - a.total)
            .slice(0, 10);

        updateTopDonorsTable(topDonors);
    } catch (error) {
        console.error('En iyi bağışçılar yükleme hatası:', error);
        updateTopDonorsTable([]);
    }
}

function updateTopDonorsTable(topDonors) {
    const tbody = document.getElementById('topDonorsTable');
    const t = translations[currentLanguage];

    if (!tbody) {
        return;
    }

    if (!topDonors || topDonors.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:40px; color: #999;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.3;">
                        <path d="M9 2v6h6V2M19 9h-5v5h5M6 9v5H1V9m7 7v6h6v-6"></path>
                    </svg>
                    <p>${t.noNotifications || 'Veri yok'}</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = topDonors.map((donor, index) => {
        const lastDonationDate = parseDateString(donor.lastDate);
        const formattedDate = lastDonationDate
            ? lastDonationDate.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'tr-TR')
            : '-';

        return `
        <tr>
            <td><strong>${index + 1}</strong></td>
            <td>${donor.firstName} ${donor.lastName}</td>
            <td>${donor.count}</td>
            <td><strong>${(donor.total || 0).toLocaleString('tr-TR')} ₺</strong></td>
            <td>${formattedDate}</td>
        </tr>`;
    }).join('');
}

async function loadAidByType() {
    try {
        if (aids.length === 0) {
            await loadAidDistributions();
        }

        if (aids.length === 0) {
            updateAidByTypeTable([]);
            return;
        }

        const typeStats = aids.reduce((acc, aid) => {
            const key = (aid.aidType || aid.AidTypeName || 'Other').trim();
            const value = Number(aid.estimatedValue ?? aid.EstimatedValue ?? 0) || 0;

            if (!acc[key]) {
                acc[key] = { typeName: key, count: 0, total: 0 };
            }

            acc[key].count += 1;
            acc[key].total += value;
            return acc;
        }, {});

        const totalValue = Object.values(typeStats).reduce((sum, stat) => sum + stat.total, 0);
        const aidByType = Object.values(typeStats)
            .map(stat => ({
                ...stat,
                percentage: totalValue > 0 ? ((stat.total / totalValue) * 100).toFixed(1) : '0.0'
            }))
            .sort((a, b) => b.total - a.total);

        updateAidByTypeTable(aidByType);
    } catch (error) {
        console.error('Türe göre yardımlar yükleme hatası:', error);
        updateAidByTypeTable([]);
    }
}

function updateAidByTypeTable(aidByType) {
    const tbody = document.getElementById('aidByTypeTable');
    const t = translations[currentLanguage];

    if (aidByType.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center; padding:40px; color: #999;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 48px; height: 48px; margin-bottom: 12px; opacity: 0.3;">
                        <path d="M9 2v6h6V2M19 9h-5v5h5M6 9v5H1V9m7 7v6h6v-6"></path>
                    </svg>
                    <p>${t.noNotifications || 'Veri yok'}</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = aidByType.map((type, index) => `
        <tr>
            <td><strong>${index + 1}</strong></td>
            <td>${getAidTypeLabel(type.typeName || type.TypeName)}</td>
            <td>${type.count}</td>
            <td><strong>${(type.total || 0).toLocaleString('tr-TR')} ₺</strong></td>
            <td><span class="badge badge-info">${type.percentage}%</span></td>
        </tr>
    `).join('');
}

function exportReport(options = {}) {
    const periodSelect = document.getElementById('reportPeriod');
    const period = (periodSelect && periodSelect.value) || 'month';
    const t = translations[currentLanguage];
    const silent = options.silent === true;

    let csv = 'IHH Charity Management System - Report\n\n';
    csv += `Period: ${period}\n`;
    csv += `Generated: ${new Date().toLocaleString()}\n\n`;

    csv += 'Statistics:\n';
    const reportDonorsCountEl = document.getElementById('reportDonorsCount');
    const totalDonationsAmountEl = document.getElementById('totalDonationsAmount');
    const reportBeneficiariesCountEl = document.getElementById('reportBeneficiariesCount');
    const totalAidsCountEl = document.getElementById('totalAidsCount');

    csv += `Total Donors,${reportDonorsCountEl ? reportDonorsCountEl.textContent : 0}\n`;
    csv += `Total Donations,${totalDonationsAmountEl ? totalDonationsAmountEl.textContent : '0 ₺'}\n`;
    csv += `Total Beneficiaries,${reportBeneficiariesCountEl ? reportBeneficiariesCountEl.textContent : 0}\n`;
    csv += `Total Aids,${totalAidsCountEl ? totalAidsCountEl.textContent : 0}\n`;

    downloadCsv(csv, `IHH_Report_${period}_${Date.now()}.csv`);
    if (!silent) {
        showAlert('Rapor başarıyla indirildi', 'success');
    }
    return true;
}

function downloadReportPdf() {
    const reportSection = document.getElementById('reports');
    if (!reportSection) {
        showAlert('Rapor alanı bulunamadı', 'error');
        return;
    }

    const printWindow = window.open('', '_blank', 'width=1024,height=768');
    if (!printWindow) {
        showAlert('Tarayıcı yeni pencereyi engelledi', 'error');
        return;
    }

    const stylesheetLink = document.querySelector('link[rel="stylesheet"]');
    const stylesheetHref = stylesheetLink ? stylesheetLink.href : '';
    const html = `<!DOCTYPE html>
        <html lang="tr">
        <head>
            <meta charset="UTF-8" />
            <title>IHH Raporu</title>
            ${stylesheetHref ? `<link rel="stylesheet" href="${stylesheetHref}">` : ''}
            <style>
                body { padding: 24px; background: #fff; }
            </style>
        </head>
        <body>
            ${reportSection.innerHTML}
        </body>
        </html>`;

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
        try {
            printWindow.print();
        } catch (error) {
            console.error('PDF yazdırma hatası:', error);
        }
    }, 350);

    showAlert('PDF çıktısı için yazdırma penceresi açıldı');
}


document.addEventListener('DOMContentLoaded', function() {
    initializeSearch();
});

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(performSearch, 200));
        searchInput.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        searchInput.addEventListener('focus', function() {
            if (this.value.trim().length >= 1) {
                performSearch();
            }
        });
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function normalizeSearchValue(value) {
    return (value ?? '').toString().toLowerCase();
}

function matchesSearch(values, query) {
    return values.some(value => value && value.includes(query));
}

function formatSearchDate(value) {
    if (!value) return '';
    const parsed = parseDateString(value);
    if (parsed) {
        return parsed.toLocaleDateString(currentLanguage === 'ar' ? 'ar-EG' : 'tr-TR');
    }
    return value;
}

function parseDateString(value) {
    if (!value) return null;
    if (value instanceof Date && !Number.isNaN(value.getTime())) {
        return value;
    }

    const direct = new Date(value);
    if (!Number.isNaN(direct.getTime())) {
        return direct;
    }

    if (typeof value === 'string') {
        const parts = value.split(/[\/\-]/);
        if (parts.length === 3) {
            let day;
            let month;
            let year;

            if (parts[0].length === 4) {
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10);
                day = parseInt(parts[2], 10);
            } else {
                day = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10);
                year = parseInt(parts[2], 10);
            }

            if (![day, month, year].some(Number.isNaN)) {
                return new Date(year, (month || 1) - 1, day || 1);
            }
        }
    }

    return null;
}

async function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const rawQuery = searchInput ? searchInput.value.trim() : '';
    const query = rawQuery ? rawQuery.toLowerCase() : '';

    if (!query || query.length < 1) {
        hideSearchResults();
        return;
    }

    showSearchLoading();

    const loaders = [];
    if (donors.length === 0) loaders.push(loadDonors());
    if (donations.length === 0) loaders.push(loadDonations());
    if (beneficiaries.length === 0) loaders.push(loadBeneficiaries());
    if (staff.length === 0) loaders.push(loadStaff());
    if (aids.length === 0) loaders.push(loadAidDistributions());
    if (sponsorships.length === 0) loaders.push(loadSponsorships());

    try {
        if (loaders.length > 0) {
            await Promise.allSettled(loaders);
        }

        const results = {
            donors: donors.filter(donor => matchesSearch([
                `${normalizeSearchValue(donor.firstName || donor.FirstName)} ${normalizeSearchValue(donor.lastName || donor.LastName)}`.trim(),
                normalizeSearchValue(donor.phone || donor.PhoneNumber),
                normalizeSearchValue(donor.email || donor.Email),
                normalizeSearchValue(donor.city || donor.City),
                normalizeSearchValue(donor.country || donor.Country)
            ], query)),
            donations: donations.filter(donation => matchesSearch([
                normalizeSearchValue(donation.donorName || donation.DonorName),
                normalizeSearchValue(donation.paymentMethod || donation.PaymentMethod),
                normalizeSearchValue(donation.type || donation.DonationType),
                normalizeSearchValue(donation.currency || donation.DonationCurrency),
                normalizeSearchValue(donation.amount ?? donation.DonationAmount)
            ], query)),
            beneficiaries: beneficiaries.filter(beneficiary => matchesSearch([
                `${normalizeSearchValue(beneficiary.firstName || beneficiary.FirstName)} ${normalizeSearchValue(beneficiary.lastName || beneficiary.LastName)}`.trim(),
                normalizeSearchValue(beneficiary.phone || beneficiary.PhoneNumber),
                normalizeSearchValue(beneficiary.city || beneficiary.City),
                normalizeSearchValue(beneficiary.type || beneficiary.BeneficiaryType)
            ], query)),
            aids: aids.filter(aid => matchesSearch([
                normalizeSearchValue(aid.beneficiaryName || aid.BeneficiaryName),
                normalizeSearchValue(aid.aidType || aid.AidTypeName),
                normalizeSearchValue(aid.notes || aid.Notes),
                normalizeSearchValue(aid.date || aid.DistributionDate),
                normalizeSearchValue(aid.estimatedValue ?? aid.EstimatedValue)
            ], query)),
            staff: staff.filter(employee => matchesSearch([
                `${normalizeSearchValue(employee.firstName || employee.FirstName)} ${normalizeSearchValue(employee.lastName || employee.LastName)}`.trim(),
                normalizeSearchValue(employee.phone || employee.PhoneNumber),
                normalizeSearchValue(employee.email || employee.Email),
                normalizeSearchValue(employee.position || employee.Position),
                normalizeSearchValue(employee.department || employee.Department)
            ], query)),
            sponsorships: sponsorships.filter(record => matchesSearch([
                normalizeSearchValue(record.donorName || record.DonorName),
                normalizeSearchValue(record.orphanName || record.BeneficiaryName),
                normalizeSearchValue(record.paymentFrequency || record.PaymentFrequency),
                normalizeSearchValue(record.monthlyAmount ?? record.MonthlyAmount)
            ], query))
        };

        displaySearchResults(results, rawQuery);
    } catch (error) {
        console.error('Arama hatası:', error);
        hideSearchResults();
    }
}

function showSearchLoading() {
    console.log('⏳ Arama yapılıyor...');
}

function hideSearchResults() {
    const dropdown = document.getElementById('searchDropdown');
    if (dropdown) {
        dropdown.remove();
    }
}

function displaySearchResults(results, query) {
    const t = translations[currentLanguage];

    const totalResults =
        results.donors.length +
        results.donations.length +
        results.beneficiaries.length +
        results.aids.length +
        results.staff.length +
        results.sponsorships.length;

    hideSearchResults();

    const searchBox = document.querySelector('.search-box');
    const dropdown = document.createElement('div');
    dropdown.id = 'searchDropdown';
    dropdown.className = 'search-dropdown';

    if (totalResults === 0) {
        dropdown.innerHTML = `
            <div class="search-no-results">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width: 40px; height: 40px; margin-bottom: 8px; opacity: 0.3;">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <p>${t.noResults}</p>
            </div>
        `;
        searchBox.appendChild(dropdown);
        return;
    }

    let html = `<div class="search-dropdown-header">${t.searchResults} <span class="result-count">(${totalResults})</span></div>`;
    html += '<div class="search-dropdown-body">';

    const maxPerCategory = 3;

    if (results.donors.length > 0) {
        html += `<div class="search-category">
            <div class="search-category-title">${t.donors} (${results.donors.length})</div>`;
        results.donors.slice(0, maxPerCategory).forEach(donor => {
            const donorId = donor.DonorID || donor.id;
            const donorName = `${donor.FirstName || donor.firstName || ''} ${donor.LastName || donor.lastName || ''}`.trim();
            const donorPhone = donor.PhoneNumber || donor.phone || '';
            const donorCity = donor.City || donor.city || '';
            html += `
                <div class="search-result-item" onclick="navigateToPage('donors', ${donorId || 'null'})">
                    <span class="search-icon">👤</span>
                    <div class="search-result-info">
                        <div class="search-result-name">${donorName}</div>
                        <div class="search-result-details">${donorPhone} • ${donorCity}</div>
                    </div>
                </div>`;
        });
        if (results.donors.length > maxPerCategory) {
            html += `<div class="search-show-more" onclick="showAllResults('donors')">${t.donors} ${results.donors.length - maxPerCategory}+ ...</div>`;
        }
        html += '</div>';
    }

    if (results.beneficiaries.length > 0) {
        html += `<div class="search-category">
            <div class="search-category-title">${t.beneficiaries} (${results.beneficiaries.length})</div>`;
        results.beneficiaries.slice(0, maxPerCategory).forEach(beneficiary => {
            const beneficiaryName = `${beneficiary.firstName || beneficiary.FirstName || ''} ${beneficiary.lastName || beneficiary.LastName || ''}`.trim();
            const beneficiaryPhone = beneficiary.phone || beneficiary.PhoneNumber || '';
            const beneficiaryType = beneficiary.type || beneficiary.BeneficiaryType || '';
            html += `
                <div class="search-result-item" onclick="navigateToPage('beneficiaries', ${beneficiary.id || beneficiary.BeneficiaryID || 'null'})">
                    <span class="search-icon">🏠</span>
                    <div class="search-result-info">
                        <div class="search-result-name">${beneficiaryName}</div>
                        <div class="search-result-details">${beneficiaryPhone} • ${beneficiaryType}</div>
                    </div>
                </div>`;
        });
        if (results.beneficiaries.length > maxPerCategory) {
            html += `<div class="search-show-more" onclick="showAllResults('beneficiaries')">${t.beneficiaries} ${results.beneficiaries.length - maxPerCategory}+ ...</div>`;
        }
        html += '</div>';
    }

    if (results.aids.length > 0) {
        html += `<div class="search-category">
            <div class="search-category-title">${t.aidDistribution} (${results.aids.length})</div>`;
        results.aids.slice(0, maxPerCategory).forEach(aid => {
            const aidId = aid.id || aid.DistributionID;
            const beneficiaryName = aid.beneficiaryName || aid.BeneficiaryName || '';
            const aidType = aid.aidType || aid.AidTypeName || '';
            const aidDate = formatSearchDate(aid.date || aid.DistributionDate);
            html += `
                <div class="search-result-item" onclick="navigateToPage('aid', ${aidId || 'null'})">
                    <span class="search-icon">🎁</span>
                    <div class="search-result-info">
                        <div class="search-result-name">${beneficiaryName}</div>
                        <div class="search-result-details">${aidType} • ${aidDate}</div>
                    </div>
                </div>`;
        });
        if (results.aids.length > maxPerCategory) {
            html += `<div class="search-show-more" onclick="showAllResults('aid')">${t.aidDistribution} ${results.aids.length - maxPerCategory}+ ...</div>`;
        }
        html += '</div>';
    }

    if (results.donations.length > 0) {
        html += `<div class="search-category">
            <div class="search-category-title">${t.donations} (${results.donations.length})</div>`;
        results.donations.slice(0, maxPerCategory).forEach(donation => {
            const donationId = donation.DonationID || donation.id;
            const donationAmount = donation.DonationAmount || donation.amount || 0;
            const donationCurrency = donation.DonationCurrency || donation.currency || '';
            const donationName = donation.DonorName || donation.donorName || '';
            const donationDate = formatSearchDate(donation.DonationDate || donation.date);
            html += `
                <div class="search-result-item" onclick="navigateToPage('donations', ${donationId || 'null'})">
                    <span class="search-icon">💰</span>
                    <div class="search-result-info">
                        <div class="search-result-name">${donationAmount} ${donationCurrency}</div>
                        <div class="search-result-details">${donationName} • ${donationDate}</div>
                    </div>
                </div>`;
        });
        if (results.donations.length > maxPerCategory) {
            html += `<div class="search-show-more" onclick="showAllResults('donations')">${t.donations} ${results.donations.length - maxPerCategory}+ ...</div>`;
        }
        html += '</div>';
    }

    if (results.staff.length > 0) {
        html += `<div class="search-category">
            <div class="search-category-title">${t.staff} (${results.staff.length})</div>`;
        results.staff.slice(0, maxPerCategory).forEach(employee => {
            const employeeId = employee.id || employee.EmployeeID;
            const staffName = `${employee.firstName || employee.FirstName || ''} ${employee.lastName || employee.LastName || ''}`.trim();
            const staffPosition = employee.position || employee.Position || '';
            const staffDepartment = employee.department || employee.Department || '';
            html += `
                <div class="search-result-item" onclick="navigateToPage('staff', ${employeeId || 'null'})">
                    <span class="search-icon">👔</span>
                    <div class="search-result-info">
                        <div class="search-result-name">${staffName}</div>
                        <div class="search-result-details">${staffPosition} • ${staffDepartment}</div>
                    </div>
                </div>`;
        });
        if (results.staff.length > maxPerCategory) {
            html += `<div class="search-show-more" onclick="showAllResults('staff')">${t.staff} ${results.staff.length - maxPerCategory}+ ...</div>`;
        }
        html += '</div>';
    }

    if (results.sponsorships.length > 0) {
        html += `<div class="search-category">
            <div class="search-category-title">${t.orphanSponsorship} (${results.sponsorships.length})</div>`;
        results.sponsorships.slice(0, maxPerCategory).forEach(record => {
            const sponsorshipId = record.id || record.SponsorshipID;
            const donorName = record.donorName || record.DonorName || '';
            const orphanName = record.orphanName || record.BeneficiaryName || '';
            const monthly = Number(record.monthlyAmount ?? record.MonthlyAmount ?? 0);
            const monthlyLabel = monthly ? `${monthly.toLocaleString('tr-TR')} ₺` : '';
            const details = monthlyLabel ? `${orphanName} • ${monthlyLabel}` : orphanName;
            html += `
                <div class="search-result-item" onclick="navigateToPage('sponsorship', ${sponsorshipId || 'null'})">
                    <span class="search-icon">🤝</span>
                    <div class="search-result-info">
                        <div class="search-result-name">${donorName}</div>
                        <div class="search-result-details">${details}</div>
                    </div>
                </div>`;
        });
        if (results.sponsorships.length > maxPerCategory) {
            html += `<div class="search-show-more" onclick="showAllResults('sponsorship')">${t.orphanSponsorship} ${results.sponsorships.length - maxPerCategory}+ ...</div>`;
        }
        html += '</div>';
    }

    html += '</div>';

    dropdown.innerHTML = html;
    searchBox.appendChild(dropdown);

    setTimeout(() => {
        document.addEventListener('click', closeDropdownOnClickOutside);
    }, 100);
}

function closeDropdownOnClickOutside(event) {
    const searchBox = document.querySelector('.search-box');
    const dropdown = document.getElementById('searchDropdown');

    if (dropdown && !searchBox.contains(event.target)) {
        hideSearchResults();
        document.removeEventListener('click', closeDropdownOnClickOutside);
    }
}

function showAllResults(category) {
    const targetLink = document.querySelector(`.nav-link[data-page="${category}"]`);
    if (targetLink) {
        targetLink.click();
    }
    hideSearchResults();
}

function navigateToPage(pageName, itemId) {
    closeModal();

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageName) {
            link.classList.add('active');
        }
    });

    updatePageTitle(pageName);
    showPage(pageName);

    console.log(`Navigated to ${pageName}, item ID: ${itemId}`);
}
