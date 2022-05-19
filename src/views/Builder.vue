<template>
  <v-row>
    <v-col>

      <v-row style="padding-left: 20px; padding-right: 20px; padding-top: 20px">
        <v-col align="center">
          <template>
            <v-toolbar dense>
              <v-row>
                <v-col>
                  <v-btn-toggle
                      v-model="selected_item"
                      group
                  >
                    <v-btn v-for="(item, index) in apartment_items" v-bind:key="index" :value=index>
                      {{ item }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-toolbar>

            <v-toolbar dense>
              <v-row>
                <v-col>
                  <v-btn-toggle
                    v-model="fine_selected_item"
                    group
                    >
                    <v-btn v-for="(item, index) in apartment_subitems[selected_item]" v-bind:key="index" :value="index">
                      {{ item }}
                    </v-btn>
                  </v-btn-toggle>
                </v-col>
              </v-row>
            </v-toolbar>
          </template>
        </v-col>
      </v-row>
      <v-row style="padding-left: 20px; padding-right: 20px; padding-bottom: 20px">
        <v-col align="center">
          <template>
            <v-toolbar dense>
              <v-row>
                <v-col>
                  <v-btn style="font-size: 30px;" @click="changeSize(false)">
                    -
                  </v-btn>
                  <v-btn style="font-size: 30px;" @click="changeSize(true)">
                    +
                  </v-btn>
                </v-col>

                <v-col>

                  <v-btn style="font-size: 30px;" @click="rotate(true)">
                    ↺
                  </v-btn>
                  <v-btn style="font-size: 30px;" @click="rotate(false)">
                    ↻
                  </v-btn>
                </v-col>

                <v-col>
                  <v-btn style="background-color: red; color: white;" v-if="!delete_confirm" @click="delete_confirm = !delete_confirm">
                    Delete
                  </v-btn>
                  <v-btn style="background-color: green; color: white;" v-if="delete_confirm" @click="deleteShape">
                    ✓
                  </v-btn>
                  <v-btn style="background-color: red; color: white;" v-if="delete_confirm" @click="delete_confirm = !delete_confirm">
                    X
                  </v-btn>
                </v-col>
              </v-row>
            </v-toolbar>
          </template>
        </v-col>
      </v-row>

      <div>
        <div @mousedown="startDrag" @mousemove="doDrag">
          <v-row class="base-image">
            <v-col>
              <img :src="require('../assets/' + current_image)" :width="image_width" draggable="false">
            </v-col>
          </v-row>
        </div>


        <div v-if="livingroom">
          <v-row
              v-for="(shape, index) in livingroom_current_shapes"
              v-bind:key="shape.z_index"
              :style="getStyle(shape)"
              @mousedown="startMove(shape, $event)"
              @mousemove="moveShape"
          >

            <v-col>
              <ApartmentItem
                  :height="Math.abs(shape.y_end - shape.y_start)"
                  :width="Math.abs(shape.x_end - shape.x_start)"
                  :rotate="shape.rotate"
                  :image="getPNG(shape)"
              ></ApartmentItem>
            </v-col>
            <v-col v-if="index == livingroom_current_shape_index" style="position: absolute; width: 100px">
              {{ calculateWidth(shape) }} ft x {{ calculateHeight(shape) }} ft
            </v-col>
          </v-row>
        </div>

        <div v-else>
          <v-row
              v-for="(shape, index) in bedroom_current_shapes"
              v-bind:key="shape.z_index"
              :style="getStyle(shape)"
              @mousedown="startMove(shape, $event)"
              @mousemove="moveShape"
          >

            <v-col>
              <ApartmentItem
                  :height="Math.abs(shape.y_end - shape.y_start)"
                  :width="Math.abs(shape.x_end - shape.x_start)"
                  :rotate="shape.rotate"
                  :image="getPNG(shape)"
              ></ApartmentItem>
            </v-col>
            <v-col v-if="index == bedroom_current_shape_index" style="position: absolute;">
              {{ calculateWidth(shape) }} ft x {{ calculateHeight(shape) }} ft
            </v-col>
          </v-row>
        </div>

      </div>

      <div style="text-align: left; padding-left: 20px; font-size: 30pt">
        {{ livingroom ? 'Living Room' : 'Bedroom' }}
      </div>

      <v-row class="btn-hover">
        <v-col>
          <v-btn @click="switchImage">
            Switch to {{ livingroom ? 'bedroom' : 'living room' }}
          </v-btn>
        </v-col>
      </v-row>

    </v-col>
  </v-row>
</template>

<script>
// import Header from '@/components/Header.vue'
// 24 pixels per foot
import ApartmentItem from '@/components/ApartmentItem.vue'
export default {
  name: 'BuilderPage',

  components: {
    // Header,
    ApartmentItem
  },

  props: {
    locked: {
      type: Boolean,
      default: true,
      required: true
    }
  },

  mounted: async function() {
    if (this.locked) {
      // this.$router.push({ name: 'home' })
    }
    window.addEventListener('mouseup', this.stopDrag)
  },

  created () {
    const storedItems = this.openStorage()
    if (storedItems) {
      this.livingroom_current_shapes = storedItems['livingroom_current_shapes']
      this.livingroom_z_index_counter = storedItems['livingroom_z_index_counter']
      this.livingroom_current_shape_index = storedItems['livingroom_current_shape_index']

      this.bedroom_current_shapes = storedItems['bedroom_current_shapes']
      this.bedroom_z_index_counter = storedItems['bedroom_z_index_counter']
      this.bedroom_current_shape_index = storedItems['bedroom_current_shape_index']
    }
  },

  data() {
    return {
      delete_confirm: false,

      livingroom: true,

      pixels_per_foot: 24,

      current_image: 'livingroomfinal.png',
      image_width: 900,

      dragging: false,
      livingroom_current_shape_index: 0,
      bedroom_current_shape_index: 0,
      x: 'no',
      y: 'no',
      livingroom_z_index_counter: 1,
      bedroom_z_index_counter: 1,

      moving: false,
      move_x: 'no',
      move_y: 'no',

      livingroom_current_shapes: [
        // {
        //   item: 0, // Refers to the index of the apartment_items list
        //   sub_item: 0, // Refers to the index of the apartment_subitems list
        //   z_index: 0,
        //   x_start: 0,
        //   y_start: 0,
        //   x_end: 0,
        //   y_end: 0,
        //   rotate: 0
        // }
      ],

      bedroom_current_shapes: [
        // {
        //   item: 0, // Refers to the index of the apartment_items list
        //   sub_item: 0, // Refers to the index of the apartment_subitems list
        //   z_index: 0,
        //   x_start: 0,
        //   y_start: 0,
        //   x_end: 0,
        //   y_end: 0,
        //   rotate: 0
        // }
      ],

      apartment_items: [
          'Couch', 'TV', 'Coffee Table', 'TV Stand',
          'Lamp', 'Side Table', 'Arm Chair', 'Mirror',
          'Dresser', 'Desk', 'Desk Chair', 'Ottoman', 'Bed'
      ],
      selected_item: 0,
      apartment_subitems: {
        0: ['L Shaped', 'Bench Shaped'],
        1: ['Big', 'Small'],
        2: ['Style 1', 'Style 2', 'Style 3'],
        3: ['Rounded', 'Rectangle'],
        4: ['Normal'],
        5: ['Square', 'Dark Round', 'Light Round'],
        6: ['Light', 'Dark'],
        7: ['Standing'],
        8: ['Normal'],
        9: ['Square', 'L Shaped'],
        10: ['Normal'],
        11: ['Smooth', 'Deep Button'],
        12: ['King']
      },
      fine_selected_item: 0
    }
  },

  methods: {
    getPNG(shape) {
      switch (shape.item) {
        case 0:
          switch (shape.sub_item) {
            case 0:
              return 'graycouch'
            case 1:
              return 'benchcouch'
            default:
              return 'graycouch'
          }
        case 1:
          switch (shape.sub_item) {
            case 0:
              return 'flattv'
            case 1:
              return 'tv'
            default:
              return 'flattv'
          }
        case 2:
          switch (shape.sub_item) {
            case 0:
              return 'woodcoffeetable'
            case 1:
              return 'roundcoffeetable'
            case 2:
              return 'coffeetablelegs'
            default:
              return 'woodcoffeetable'
          }
        case 3:
          switch (shape.sub_item) {
            case 0:
              return 'woodtvstand'
            case 1:
              return 'rectangletvstand'
            default:
              return 'rectangletvstand'
          }
        case 4:
          switch (shape.sub_item) {
            case 0:
              return 'lamp'
            default:
              return 'lamp'
          }
        case 5:
          switch (shape.sub_item) {
            case 0:
              return 'squaresidetable'
            case 1:
              return 'darkroundsidetable'
            case 2:
              return 'lightroundsidetable'
            default:
              return 'squaresidetable'
          }
        case 6:
          switch (shape.sub_item) {
            case 0:
              return 'lightarmchair'
            case 1:
              return 'darkarmchair'
            default:
              return 'lightarmchair'
          }
        case 7:
          switch (shape.sub_item) {
            case 0:
              return 'standingmirror'
            default:
              return 'standingmirror'
          }
        case 8:
          switch (shape.sub_item) {
            case 0:
              return 'dresser'
            default:
              return 'dresser'
          }
        case 9:
          switch (shape.sub_item) {
            case 0:
              return 'squaredesk'
            case 1:
              return 'ldesk'
            default:
              return 'squaredesk'
          }
        case 10:
          switch (shape.sub_item) {
            case 0:
              return 'deskchair'
            default:
              return 'deskchair'
          }
        case 11:
          switch (shape.sub_item) {
            case 0:
              return 'smoothottoman'
            case 1:
              return 'deepbuttonottoman'
            default:
              return 'smoothottoman'
          }
        case 12:
          switch (shape.sub_item) {
            case 0:
              return 'bed'
            default:
              return 'bed'
          }
        default:
          return ''
      }
    },
    startDrag(event) {
      this.dragging = true
      this.x = event.clientX
      this.y = event.clientY

      if (this.livingroom) {
        this.livingroom_current_shapes.push({
          item: this.selected_item,
          sub_item: this.fine_selected_item,
          z_index: this.livingroom_z_index_counter,
          x_start: event.clientX,
          y_start: event.clientY,
          x_end: event.clientX,
          y_end: event.clientY,
          rotate: 0
        })
        this.livingroom_z_index_counter += 1
        this.livingroom_current_shape_index = this.livingroom_current_shapes.length - 1
      } else {
        this.bedroom_current_shapes.push({
          item: this.selected_item,
          sub_item: this.fine_selected_item,
          z_index: this.bedroom_z_index_counter,
          x_start: event.clientX,
          y_start: event.clientY,
          x_end: event.clientX,
          y_end: event.clientY,
          rotate: 0
        })
        this.bedroom_z_index_counter += 1
        this.bedroom_current_shape_index = this.bedroom_current_shapes.length - 1
      }

      this.saveApartmentItems()
    },

    stopDrag() {
      this.dragging = false
      this.x = this.y = 'no'
      this.moving = false
      this.move_x = this.move_y = 'no'
      this.saveApartmentItems()
    },

    doDrag(event) {
      if (this.dragging) {
        this.x = event.clientX
        this.y = event.clientY

        if (this.livingroom) {
          this.livingroom_current_shapes[this.livingroom_current_shape_index].x_end = event.clientX
          this.livingroom_current_shapes[this.livingroom_current_shape_index].y_end = event.clientY
        } else {
          this.bedroom_current_shapes[this.bedroom_current_shape_index].x_end = event.clientX
          this.bedroom_current_shapes[this.bedroom_current_shape_index].y_end = event.clientY
        }


        this.saveApartmentItems()
      }
    },

    getStyle(shape) {
      return "position:absolute;".concat(
          "left:",
          Math.min(shape.x_start, shape.x_end),
          "px;top:",
          Math.min(shape.y_start, shape.y_end),
          "px;z-index:",
          shape.z_index,
          ";"
      )
    },

    startMove(shape, event) {
      if (this.livingroom) {
        this.livingroom_current_shape_index = this.livingroom_current_shapes.indexOf(shape)
        shape.z_index = this.livingroom_z_index_counter
        this.livingroom_z_index_counter += 1
      } else {
        this.bedroom_current_shape_index = this.bedroom_current_shapes.indexOf(shape)
        shape.z_index = this.bedroom_z_index_counter
        this.bedroom_z_index_counter += 1
      }

      this.move_x = event.clientX
      this.move_y = event.clientY
      this.moving = true
      this.saveApartmentItems()
    },

    moveShape(event) {
      if (this.moving) {
        let x_movement = event.clientX - this.move_x
        let y_movement = event.clientY - this.move_y
        this.move_x = event.clientX
        this.move_y = event.clientY

        if (this.livingroom) {
          this.livingroom_current_shapes[this.livingroom_current_shape_index].x_start += x_movement
          this.livingroom_current_shapes[this.livingroom_current_shape_index].y_start += y_movement
          this.livingroom_current_shapes[this.livingroom_current_shape_index].x_end += x_movement
          this.livingroom_current_shapes[this.livingroom_current_shape_index].y_end += y_movement
        } else {
          this.bedroom_current_shapes[this.bedroom_current_shape_index].x_start += x_movement
          this.bedroom_current_shapes[this.bedroom_current_shape_index].y_start += y_movement
          this.bedroom_current_shapes[this.bedroom_current_shape_index].x_end += x_movement
          this.bedroom_current_shapes[this.bedroom_current_shape_index].y_end += y_movement
        }
        this.saveApartmentItems()
      }
    },

    deleteShape() {
      if (this.livingroom) {
        this.livingroom_current_shapes.splice(this.livingroom_current_shape_index)
        this.livingroom_current_shape_index = this.livingroom_current_shapes.length - 1
      } else {
        this.bedroom_current_shapes.splice(this.bedroom_current_shape_index)
        this.bedroom_current_shape_index = this.bedroom_current_shapes.length - 1
      }
      this.delete_confirm = !this.delete_confirm
      this.saveApartmentItems()
    },

    rotate(clockwise) {
      if (clockwise) {
        if (this.livingroom) {
          this.livingroom_current_shapes[this.livingroom_current_shape_index].rotate -= 5
        } else {
          this.bedroom_current_shapes[this.bedroom_current_shape_index].rotate -= 5
        }

      } else {
        if (this.livingroom) {
          this.livingroom_current_shapes[this.livingroom_current_shape_index].rotate += 5
        } else {
          this.bedroom_current_shapes[this.bedroom_current_shape_index].rotate += 5
        }

      }
      this.saveApartmentItems()
    },

    changeSize(increase) {
      if (increase) {
        if (this.livingroom) {
          this.livingroom_current_shapes[this.livingroom_current_shape_index].x_end *= 1.02
          this.livingroom_current_shapes[this.livingroom_current_shape_index].y_end *= 1.02
        } else {
          this.bedroom_current_shapes[this.bedroom_current_shape_index].x_end *= 1.02
          this.bedroom_current_shapes[this.bedroom_current_shape_index].y_end *= 1.02
        }

      } else {
        if (this.livingroom) {
          this.livingroom_current_shapes[this.livingroom_current_shape_index].x_end *= .98
          this.livingroom_current_shapes[this.livingroom_current_shape_index].y_end *= .98
        } else {
          this.bedroom_current_shapes[this.bedroom_current_shape_index].x_end *= .98
          this.bedroom_current_shapes[this.bedroom_current_shape_index].y_end *= .98
        }

      }
      this.saveApartmentItems()
    },

    saveApartmentItems() {
      let storedItems = this.openStorage()
      if (!storedItems) storedItems = {}
      storedItems['livingroom_current_shapes'] = this.livingroom_current_shapes
      storedItems['livingroom_z_index_counter'] = this.livingroom_z_index_counter
      storedItems['livingroom_current_shape_index'] = this.livingroom_current_shape_index
      storedItems['bedroom_current_shapes'] = this.bedroom_current_shapes
      storedItems['bedroom_z_index_counter'] = this.bedroom_z_index_counter
      storedItems['bedroom_current_shape_index'] = this.bedroom_current_shape_index
      this.saveStorage(storedItems)
    },

    openStorage() {
      return JSON.parse(localStorage.getItem('saved_storage'))
    },

    saveStorage(saved_storage) {
      localStorage.setItem('saved_storage', JSON.stringify(saved_storage))
    },

    calculateWidth(shape) {
      // 24 pixels = 1 foot
      return (Math.abs(shape.x_start - shape.x_end) / this.pixels_per_foot).toFixed(2)
    },

    calculateHeight(shape) {
      // 24 pixels = 1 foot
      return (Math.abs(shape.y_start - shape.y_end) / this.pixels_per_foot).toFixed(2)
    },

    switchImage() {
      if (this.livingroom) {
        this.livingroom = false
        this.current_image = 'bedroomfinal.png'
        this.image_width = 395
        this.pixels_per_foot = 22
      } else {
        this.livingroom = true
        this.current_image = 'livingroomfinal.png'
        this.image_width = 900
        this.pixels_per_foot = 24
      }
    }
  }
}
</script>

<style lang="scss">
.base-image {
  position: absolute;
  z-index: -1;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

.other {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  margin-left: auto;
  margin-right: auto;
}

.btn-hover {
  position: absolute;
  bottom: 10px;
  left: 10px;
}
</style>