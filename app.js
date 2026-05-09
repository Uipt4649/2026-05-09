const app = {
  currentView: 'home',
  map: null,
  markers: [],
  favorites: JSON.parse(localStorage.getItem('saizeriya_favorites')) || [],
  history: JSON.parse(localStorage.getItem('saizeriya_history')) || [],
  currentStoreDetail: null,

  init() {
    this.navigate('home');
    this.renderFavorites();
    this.renderHistory();
    console.log('App initialized.');
  },

  navigate(viewId) {
    // Hide all views
    document.querySelectorAll('.view-section').forEach(el => el.classList.remove('active'));
    // Show target view
    document.getElementById(`view-${viewId}`).classList.add('active');
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(el => {
      if(el.dataset.target === viewId) {
        el.classList.add('active');
      } else {
        el.classList.remove('active');
      }
    });

    this.currentView = viewId;

    // View specific logic
    if (viewId === 'search') {
      if (!this.map) {
        this.initMap();
      }
      this.renderStoreList(STORES);
      // Wait for DOM layout to ensure map renders correctly
      setTimeout(() => {
        this.map.invalidateSize();
      }, 100);
    } else if (viewId === 'dashboard') {
      this.renderFavorites();
      this.renderHistory();
    }
    
    window.scrollTo(0, 0);
  },

  handleHomeSearch(e) {
    if (e.key === 'Enter') {
      const val = e.target.value;
      this.navigate('search');
      document.getElementById('list-search-input').value = val;
      this.filterStores();
    }
  },

  initMap() {
    // Initialize map centered on Tokyo
    this.map = L.map('map').setView([35.6895, 139.6917], 12);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    }).addTo(this.map);
  },

  renderStoreList(storesToRender) {
    const container = document.getElementById('store-list-container');
    container.innerHTML = '';
    
    // Clear old markers
    this.markers.forEach(m => this.map.removeLayer(m));
    this.markers = [];
    
    if (storesToRender.length === 0) {
      container.innerHTML = '<div class="empty-state">No stores found matching your criteria.</div>';
      return;
    }

    const bounds = L.latLngBounds();

    storesToRender.forEach(store => {
      // 1. Create List Card
      const card = document.createElement('div');
      card.className = 'store-card';
      card.onclick = () => this.viewStoreDetail(store.id);
      
      const facilitiesHtml = store.facilities.map(f => {
        const fac = FACILITY_ICONS[f];
        return `<div class="facility-icon" title="${fac.label}">
                  <span class="material-symbols-outlined">${fac.icon}</span>
                </div>`;
      }).join('');

      card.innerHTML = `
        <div class="store-card-header">
          <h3>${store.name}</h3>
          <span class="status-badge status-${store.status.replace(' ', '')}">${store.status}</span>
        </div>
        <div class="store-distance">${store.distance}</div>
        <div class="store-address">${store.address}</div>
        <div class="store-facilities">
          ${facilitiesHtml}
        </div>
      `;
      
      // Hover effect for map marker synchronization
      card.addEventListener('mouseenter', () => {
        card.classList.add('highlighted');
        const marker = this.markers.find(m => m.storeId === store.id);
        if (marker) marker.openPopup();
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('highlighted');
        const marker = this.markers.find(m => m.storeId === store.id);
        if (marker) marker.closePopup();
      });

      container.appendChild(card);

      // 2. Create Map Marker
      // Custom green marker
      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: var(--saizeriya-green); width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12],
        popupAnchor: [0, -12]
      });

      const marker = L.marker([store.lat, store.lng], { icon: customIcon }).addTo(this.map);
      marker.storeId = store.id;
      
      marker.bindPopup(`
        <div style="text-align:center;">
          <h3 style="margin-bottom: 4px;">${store.name}</h3>
          <p style="margin-bottom: 8px;">${store.status}</p>
          <button style="background:var(--saizeriya-green); color:white; border:none; padding:4px 12px; border-radius:12px; cursor:pointer;" onclick="app.viewStoreDetail('${store.id}')">View Details</button>
        </div>
      `);
      
      this.markers.push(marker);
      bounds.extend([store.lat, store.lng]);
    });

    // Fit map to markers if there are any
    if (this.markers.length > 0) {
      this.map.fitBounds(bounds, { padding: [50, 50] });
    }
  },

  filterStores() {
    const query = document.getElementById('list-search-input').value.toLowerCase();
    const filtered = STORES.filter(store => 
      store.name.toLowerCase().includes(query) || 
      store.address.toLowerCase().includes(query)
    );
    this.renderStoreList(filtered);
  },

  viewStoreDetail(storeId) {
    const store = STORES.find(s => s.id === storeId);
    if (!store) return;
    
    this.currentStoreDetail = store;
    
    // Update History
    this.history = this.history.filter(id => id !== storeId);
    this.history.unshift(storeId);
    if (this.history.length > 4) this.history.pop();
    localStorage.setItem('saizeriya_history', JSON.stringify(this.history));

    // Populate Details
    document.getElementById('detail-bc-name').textContent = store.name;
    document.getElementById('detail-name').textContent = `Saizeriya ${store.name}`;
    document.getElementById('detail-hero-image').src = store.heroImage;
    document.getElementById('detail-hours').textContent = store.hours;
    document.getElementById('detail-last-order').textContent = store.lastOrder;
    document.getElementById('detail-address').textContent = store.address;
    document.getElementById('detail-phone').textContent = store.phone;
    document.getElementById('detail-distance').textContent = store.distance;
    
    // Status Badge
    const badge = document.getElementById('detail-status-badge');
    badge.className = `status-badge status-${store.status.replace(' ', '')}`;
    badge.innerHTML = store.status === 'Open' ? `<span class="material-symbols-outlined" style="font-size:16px;">check_circle</span> ${store.status}` : store.status;

    // Crowd Level
    const isBusy = store.crowdLevel > 70;
    document.getElementById('detail-crowd-status').textContent = isBusy ? 'Busy' : 'Normal';
    document.getElementById('detail-crowd-status').style.color = isBusy ? '#dc3545' : '#28a745';
    
    const crowdBar = document.getElementById('detail-crowd-bar');
    crowdBar.innerHTML = '';
    const segments = 5;
    const filledSegments = Math.ceil((store.crowdLevel / 100) * segments);
    for(let i=0; i<segments; i++) {
      const seg = document.createElement('div');
      seg.className = `crowd-segment ${i < filledSegments ? 'filled' : ''}`;
      if(isBusy && i < filledSegments) seg.style.background = '#dc3545';
      else if (i < filledSegments) seg.style.background = '#28a745';
      crowdBar.appendChild(seg);
    }

    // Facilities
    const facContainer = document.getElementById('detail-facilities');
    facContainer.innerHTML = store.facilities.map(f => {
      const fac = FACILITY_ICONS[f];
      return `
        <div class="facility-item">
          <span class="material-symbols-outlined">${fac.icon}</span>
          ${fac.label}
        </div>
      `;
    }).join('');

    // Favorite Button
    this.updateFavoriteButton();

    // Fetch Menu (Bonus)
    this.fetchMenu();

    this.navigate('detail');
  },

  toggleFavorite() {
    if (!this.currentStoreDetail) return;
    const id = this.currentStoreDetail.id;
    const index = this.favorites.indexOf(id);
    
    if (index > -1) {
      this.favorites.splice(index, 1);
    } else {
      this.favorites.push(id);
    }
    
    localStorage.setItem('saizeriya_favorites', JSON.stringify(this.favorites));
    this.updateFavoriteButton();
  },

  updateFavoriteButton() {
    const btn = document.getElementById('btn-favorite');
    if(!btn || !this.currentStoreDetail) return;
    
    const isFav = this.favorites.includes(this.currentStoreDetail.id);
    if (isFav) {
      btn.classList.add('active');
      btn.innerHTML = '<span class="material-symbols-outlined" style="font-variation-settings: \'FILL\' 1;">favorite</span>';
    } else {
      btn.classList.remove('active');
      btn.innerHTML = '<span class="material-symbols-outlined">favorite_border</span>';
    }
  },

  async fetchMenu() {
    const container = document.getElementById('menu-container');
    container.innerHTML = `
      <div class="loading-spinner">
        <span class="material-symbols-outlined" style="animation: spin 1s linear infinite;">sync</span>
        <p>Fetching latest menu from server...</p>
      </div>
    `;

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const response = await fetch('mock-menu-api.json');
      if (!response.ok) throw new Error('Failed to fetch menu');
      const menuData = await response.json();
      
      container.innerHTML = '';
      
      menuData.forEach(category => {
        const catDiv = document.createElement('div');
        catDiv.className = 'menu-category';
        
        const itemsHtml = category.items.map(item => `
          <div class="menu-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="menu-item-content">
              <div class="menu-item-header">
                <h4>${item.name}</h4>
                <span class="menu-price">${item.price}</span>
              </div>
              <p class="menu-desc">${item.description}</p>
            </div>
          </div>
        `).join('');

        catDiv.innerHTML = `
          <h3>${category.category}</h3>
          <div class="menu-grid">
            ${itemsHtml}
          </div>
        `;
        container.appendChild(catDiv);
      });

    } catch (error) {
      console.error(error);
      container.innerHTML = `
        <div class="empty-state">
          <span class="material-symbols-outlined" style="font-size: 48px; color: #dc3545;">error</span>
          <p style="margin-top: 1rem;">Could not load menu data at this time. Please try again later.</p>
        </div>
      `;
    }
  },

  renderFavorites() {
    const container = document.getElementById('favorites-grid');
    if(!container) return;
    
    container.innerHTML = '';
    
    this.favorites.forEach(id => {
      const store = STORES.find(s => s.id === id);
      if(!store) return;
      
      const tags = store.facilities.slice(0, 2).map(f => `<span class="fav-tag">${FACILITY_ICONS[f].label}</span>`).join('');
      
      const card = document.createElement('div');
      card.className = 'fav-card';
      card.onclick = () => this.viewStoreDetail(store.id);
      
      card.innerHTML = `
        <div class="fav-btn-absolute" onclick="event.stopPropagation(); app.currentStoreDetail = {id: '${store.id}'}; app.toggleFavorite(); app.renderFavorites();">
          <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">favorite</span>
        </div>
        <img src="${store.heroImage}" alt="${store.name}">
        <div class="fav-card-content">
          <div class="fav-card-header">
            <h3>${store.name}</h3>
            <span class="status-badge status-${store.status.replace(' ', '')}" style="font-size: 0.7rem; padding: 0.15rem 0.5rem;">${store.status}</span>
          </div>
          <div class="fav-distance">
            <span class="material-symbols-outlined" style="font-size: 16px;">location_on</span> ${store.distance}
          </div>
          <div class="fav-tags">
            ${tags}
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Add empty state slot
    const addCard = document.createElement('div');
    addCard.className = 'add-fav-card';
    addCard.onclick = () => this.navigate('search');
    addCard.innerHTML = `
      <div class="icon"><span class="material-symbols-outlined">add</span></div>
      <h3>Add another favorite</h3>
      <p style="font-size: 0.85rem;">Save locations you visit frequently for quick access to menus and hours.</p>
    `;
    container.appendChild(addCard);
  },

  renderHistory() {
    const container = document.getElementById('recent-grid');
    if(!container) return;
    
    container.innerHTML = '';
    
    if (this.history.length === 0) {
      container.innerHTML = '<div style="grid-column: span 2; color: var(--text-secondary);">No recently viewed stores.</div>';
      return;
    }

    this.history.forEach((id, index) => {
      const store = STORES.find(s => s.id === id);
      if(!store) return;
      
      const timeStr = index === 0 ? "Viewed just now" : (index === 1 ? "Viewed 2 hours ago" : "Viewed yesterday");

      const card = document.createElement('div');
      card.className = 'recent-card';
      card.onclick = () => this.viewStoreDetail(store.id);
      
      card.innerHTML = `
        <img src="${store.heroImage}" alt="${store.name}">
        <div class="recent-info">
          <h4>${store.name}</h4>
          <p>${timeStr}</p>
        </div>
        <div class="recent-arrow">
          <span class="material-symbols-outlined">arrow_forward</span>
        </div>
      `;
      container.appendChild(card);
    });
  }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
