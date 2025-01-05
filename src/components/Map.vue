<template>
  <div class="map-container">
    <!-- 搜索框 -->
    <div class="search-container">
      <div class="search-box">
        <Icon icon="mdi:magnify" class="search-icon"/>
        <input 
          type="text" 
          placeholder="搜索校园地点..." 
          v-model="searchQuery"
          @focus="showSearchResults = true"
          @blur="handleSearchBlur"
        />
      </div>
      <div class="search-results" v-if="showSearchResults">
        <div v-if="filteredLocations.length">
          <div 
            v-for="location in filteredLocations" 
            :key="location.name"
            class="search-result-item"
            @mousedown="navigateToLocation(location)"
          >
            <Icon icon="mdi:map-marker" class="location-icon" />
            <div class="location-info">
              <div class="location-name">{{ location.name }}</div>
              <div class="location-desc">{{ location.description }}</div>
            </div>
          </div>
        </div>
        <div v-else-if="searchHistory.length && !searchQuery" class="search-history">
          <div class="history-title">最近搜索</div>
          <div 
            v-for="name in searchHistory" 
            :key="name"
            class="search-result-item"
            @mousedown="() => {
              const location = locations.find(l => l.name === name)
              if (location) navigateToLocation(location)
            }"
          >
            <Icon icon="mdi:history" class="history-icon" />
            <span>{{ name }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 路线规划面板 -->
    <div class="route-panel" v-if="showRoutePanel">
      <div class="route-header">
        <h3>路线规划</h3>
        <button class="close-btn" @click="showRoutePanel = false">
          <Icon icon="mdi:close" />
        </button>
      </div>
      <div class="route-inputs">
        <div class="route-input">
          <Icon icon="mdi:map-marker" class="route-icon start" />
          <input 
            type="text" 
            v-model="startPoint"
            placeholder="选择起点..."
            @focus="showStartSuggestions = true"
            @blur="handleSuggestionBlur('start')"
          />
        </div>
        <div class="suggestions" v-if="showStartSuggestions && startSuggestions.length">
          <div 
            v-for="location in startSuggestions" 
            :key="location.name"
            class="suggestion-item"
            @mousedown="selectStart(location)"
          >
            {{ location.name }}
          </div>
        </div>
        <div class="route-input">
          <Icon icon="mdi:flag-variant" class="route-icon end" />
          <input 
            type="text" 
            v-model="endPoint"
            placeholder="选择终点..."
            @focus="showEndSuggestions = true"
            @blur="handleSuggestionBlur('end')"
          />
        </div>
        <div class="suggestions" v-if="showEndSuggestions && endSuggestions.length">
          <div 
            v-for="location in endSuggestions" 
            :key="location.name"
            class="suggestion-item"
            @mousedown="selectEnd(location)"
          >
            {{ location.name }}
          </div>
        </div>
      </div>
      <button 
        class="plan-route-btn" 
        @click="planRoute"
        :disabled="!selectedStart || !selectedEnd"
      >
        规划路线
      </button>
    </div>

    <!-- 地图控制按钮 -->
    <div class="map-controls">
      <button class="control-btn" @click="zoomIn" title="放大">
        <Icon icon="mdi:plus" />
      </button>
      <button class="control-btn" @click="zoomOut" title="缩小">
        <Icon icon="mdi:minus" />
      </button>
      <button class="control-btn" @click="resetView" title="返回学校">
        <Icon icon="mdi:home" />
      </button>
      <button class="control-btn" @click="showRoutePanel = true" title="路线规划">
        <Icon icon="mdi:routes" />
      </button>
    </div>

    <div id="map" ref="mapRef"></div>

    <LocationModal
      v-if="showLocationModal"
      :show="showLocationModal"
      :location="selectedLocation"
      @close="showLocationModal = false"
      @plan-route="handlePlanRoute"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, onUnmounted } from 'vue'
import { Icon } from '@iconify/vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.js'
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css'
import LocationModal from './LocationModal.vue'

interface RoutingControl extends L.Control {
  getContainer(): HTMLElement;
  getPlan(): any;
  addTo(map: any): this;
}

interface RoutingStatic {
  control(options: any): RoutingControl;
  osrmv1(options: any): any;
}

// 扩展 L 的类型
declare global {
  interface Window {
    L: typeof L & { Routing: RoutingStatic }
  }
}

// 使用时将 L.Routing 类型转换
const LR = (L as any).Routing as RoutingStatic

interface Location {
  name: string
  coords: [number, number]
  description?: string
  image?: string    // 添加图片URL
  detailId: string  // 用于路由跳转的唯一标识
}

// 重要地点数据
const locations: Location[] = [
  { name: '湖南师范大学逸夫图书馆', coords: [28.18946,112.94339], description: '逸夫图书馆',image: '/images/library.png',detailId: 'library'},
  { name: '田家炳教学楼', coords: [28.1871, 112.9435], description: '岳麓校区主教学楼',image: '/images/library.png',detailId: '' },
  { name: '体育馆', coords: [28.18805, 112.9435], description: '岳麓校区体育馆',image: '/images/library.png',detailId: '' },
  { name: '校医院', coords: [28.1859, 112.9445], description: '岳麓校区医院',image: '/images/library.png',detailId: '' },
  { name: '计算机学院', coords: [28.1868, 112.9442], description: '计算机与信息科学学院',image: '/images/library.png',detailId: '' },
  { name: '文学院', coords: [28.1873, 112.9438], description: '文学院教学楼',image: '/images/library.png',detailId: '' },
  { name: '大礼堂', coords: [28.1880, 112.9440], description: '岳麓校区大礼堂',image: '/images/library.png',detailId: '' },
  { name: '东方红广场', coords: [28.1875, 112.9445], description: '校园中心广场',image: '/images/library.png',detailId: '' },
  { name: '校门', coords: [28.1857, 112.9450], description: '岳麓校区正门',image: '/images/library.png',detailId: '' },
  { name: '中和楼', coords: [28.1911, 112.94226], description: '中和楼',image: '/images/library.png',detailId: '' },
  { name: '木兰食堂', coords: [28.1894, 112.94155], description: '食堂，佳园食堂',image: '/images/library.png',detailId: '' },
  { name: '兰桂苑食堂', coords: [28.18875, 112.94155], description: '食堂，佳园食堂',image: '/images/library.png',detailId: '' },
  
]

const mapRef = ref<HTMLElement | null>(null)
const map = ref<L.Map | null>(null)
const markers = ref<L.Marker[]>([])
const searchQuery = ref('')
const showSearchResults = ref(false)

// 湖南师范大学的坐标
const HNNU_CENTER: [number, number] = [28.1875, 112.9440]
const INITIAL_ZOOM = 16

// 搜索结果过滤
const filteredLocations = computed(() => {
  if (!searchQuery.value) return []
  const query = searchQuery.value.toLowerCase()
  return locations.filter(location => 
    location.name.toLowerCase().includes(query) ||
    (location.description?.toLowerCase().includes(query) || false)
  ).slice(0, 5) // 限制最多显示5个结果
})

// 地图控制函数
const zoomIn = () => map.value?.zoomIn()
const zoomOut = () => map.value?.zoomOut()
const resetView = () => map.value?.setView(HNNU_CENTER, INITIAL_ZOOM)

// 添加搜索历史记录功能
const searchHistory = ref<string[]>([])

const addToHistory = (location: Location) => {
  const index = searchHistory.value.indexOf(location.name)
  if (index > -1) {
    searchHistory.value.splice(index, 1)
  }
  searchHistory.value.unshift(location.name)
  if (searchHistory.value.length > 5) {
    searchHistory.value.pop()
  }
}

// 添加控制弹窗显示的响应式变量
const showLocationModal = ref(false)
const selectedLocation = ref<Location | null>(null)

const navigateToLocation = (location: Location) => {
  map.value?.setView(location.coords, 18)
  markers.value.forEach(marker => {
    if (marker.getLatLng().equals(location.coords)) {
      marker.openPopup()
    }
  })
  addToHistory(location)
  showSearchResults.value = false
  searchQuery.value = location.name
  selectedLocation.value = location
  showLocationModal.value = true
}

const handleSearchBlur = () => {
  setTimeout(() => {
    showSearchResults.value = false
  }, 200)
}

// 添加新的响应式变量
const showRoutePanel = ref(false)
const startPoint = ref('')
const endPoint = ref('')
const showStartSuggestions = ref(false)
const showEndSuggestions = ref(false)
const selectedStart = ref<Location | null>(null)
const selectedEnd = ref<Location | null>(null)
const routeLine = ref<L.Polyline | null>(null)

// 添加建议列表计算属性
const startSuggestions = computed(() => {
  if (!startPoint.value) return []
  return locations.filter(location => 
    location.name.toLowerCase().includes(startPoint.value.toLowerCase())
  )
})

const endSuggestions = computed(() => {
  if (!endPoint.value) return []
  return locations.filter(location => 
    location.name.toLowerCase().includes(endPoint.value.toLowerCase())
  )
})

// 添加选择起点和终点的方法
const selectStart = (location: Location) => {
  selectedStart.value = location
  startPoint.value = location.name
  showStartSuggestions.value = false
}

const selectEnd = (location: Location) => {
  selectedEnd.value = location
  endPoint.value = location.name
  showEndSuggestions.value = false
}

const handleSuggestionBlur = (type: 'start' | 'end') => {
  setTimeout(() => {
    if (type === 'start') {
      showStartSuggestions.value = false
    } else {
      showEndSuggestions.value = false
    }
  }, 200)
}

// 清除现有路线
const clearRoute = () => {
  if (routingControl.value) {
    map.value?.removeControl(routingControl.value)
    routingControl.value = null
  }
}

// 添加路由控制变量
const routingControl = ref<RoutingControl | null>(null)

// 修改路线规划方法
const planRoute = () => {
  if (!selectedStart.value || !selectedEnd.value || !map.value) return

  clearRoute()

  const control = LR.control({
    waypoints: [
      L.latLng(selectedStart.value.coords[0], selectedStart.value.coords[1]),
      L.latLng(selectedEnd.value.coords[0], selectedEnd.value.coords[1])
    ],
    router: LR.osrmv1({
      serviceUrl: 'https://router.project-osrm.org/route/v1',
      profile: 'foot',
      urlParameters: {
        continue_straight: true, // 避免掉头绕远路
        overview: 'simplified', // 使用简化路径数据
      }
    }),
    lineOptions: {
      styles: [{ color: '#3388ff', weight: 6, opacity: 0.7, dashArray: '10, 10' }]
    },
    createMarker: () => null,
    addWaypoints: false,
    draggableWaypoints: false,
    fitSelectedRoutes: true,
    showAlternatives: false,
    show: false
  }) as RoutingControl

  routingControl.value = control
  ;(control as any).addTo(map.value)
}

// 添加样式
const customizeRoutingControl = () => {
  const routingContainer = document.querySelector('.leaflet-routing-container')
  if (routingContainer) {
    routingContainer.classList.add('custom-routing')
  }
}

// 在组件卸载时清理
onUnmounted(() => {
  clearRoute()
})

onMounted(() => {
  // 修复 Leaflet 默认图标路径问题
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
  })

  if (mapRef.value) {
    // 初始化地图
    const mapInstance = L.map(mapRef.value).setView(HNNU_CENTER, INITIAL_ZOOM)
    map.value = mapInstance

    // 添加图层
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap contributors'
    }).addTo(mapInstance)

    // 添加标记
    locations.forEach(location => {
      const marker = L.marker(location.coords).addTo(mapInstance)
        .bindPopup(`<b>${location.name}</b><br>${location.description || ''}`)
      markers.value.push(marker)
    })

    mapInstance.zoomControl.setPosition('bottomright')
  }
})

const handlePlanRoute = () => {
  if (selectedLocation.value) {
    showLocationModal.value = false
    showRoutePanel.value = true
    selectedStart.value = null
    selectedEnd.value = selectedLocation.value
    endPoint.value = selectedLocation.value.name
  }
}
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  position: relative;
  z-index: 1;
}

#map {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.control-btn {
  background: white;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #666;
}

.control-btn:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.control-btn:active {
  transform: translateY(0);
}

:deep(.leaflet-control-attribution) {
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.search-container {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  width: 300px;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: none;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  outline: none;
  transition: all 0.3s ease;
}

input:focus {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.search-results {
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-top: 8px;
}

.search-result-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.search-result-item:hover {
  background-color: #f5f5f5;
}

.location-info {
  display: flex;
  flex-direction: column;
  margin-left: 8px;
}

.location-name {
  font-weight: 500;
}

.location-desc {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}

.location-icon, .history-icon {
  color: #666;
  font-size: 18px;
  margin-right: 4px;
}

.history-title {
  padding: 8px 16px;
  font-size: 12px;
  color: #999;
  background-color: #f5f5f5;
}

.search-history {
  background: white;
  border-radius: 8px;
  padding: 8px 0;
}

:deep(.leaflet-control-container) {
  z-index: 1000;
}

:deep(.leaflet-control-zoom) {
  border: none !important;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
}

:deep(.leaflet-control-zoom a) {
  border-radius: 8px !important;
  margin-bottom: 5px !important;
}

.route-panel {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 1000;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.route-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  width: 100%;
}

.route-header h3 {
  margin: 0;
  font-size: 16px;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
}

.route-inputs {
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 12px;
  width: 80%;
}

.route-input {
  position: relative;
  width: 100%;
}

.route-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.route-icon.start {
  color: #4CAF50;
}

.route-icon.end {
  color: #f44336;
}

.route-input input {
  width: 100%;
  padding: 10px 10px 10px 36px;
  border: 1px solid #eee;
  border-radius: 6px;
  font-size: 14px;
}

.suggestions {
  position: absolute;
  width: 90%;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-top: 4px;
  z-index: 1001;
}

.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
}

.suggestion-item:hover {
  background: #f5f5f5;
}

.plan-route-btn {
  width: 90%;
  padding: 12px;
  background: #3388ff;
  color: white;
  border: none;
  border-radius: 6px;
  margin-top: 16px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.plan-route-btn:hover {
  background: #2979ff;
}

.plan-route-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

:deep(.leaflet-routing-container) {
  display: none;
}

:deep(.leaflet-routing-alt) {
  max-height: none;
}

:deep(.leaflet-routing-geocoder) {
  margin: 0;
}
</style>
