<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <Header/>
        </v-col>
      </v-row>

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
                    <v-btn v-for="(item, index) in apartment_items" v-bind:key="index" :value="index">
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
              <img src="../assets/fullapartment.png" style="width: 600px" draggable="false">
            </v-col>
          </v-row>
        </div>


        <v-row
            v-for="shape in current_shapes"
            v-bind:key="shape.z_index"
            :style="getStyle(shape)"
            @mousedown="startMove(shape, $event)"
            @mousemove="moveShape"
        >
          <v-col>
            <Couch
                :height="Math.abs(shape.y_end - shape.y_start)"
                :width="Math.abs(shape.x_end - shape.x_start)"
                :rotate="shape.rotate"
            ></Couch>
          </v-col>
        </v-row>
      </div>







    </v-col>
  </v-row>
</template>

<script>
import Header from '@/components/Header.vue'
import Couch from '@/components/Couch.vue'
export default {
  name: 'BuilderPage',

  components: {
    Header,
    Couch
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

  data() {
    return {
      show: false,
      password: '',
      delete_confirm: false,

      dragging: false,
      current_shape_index: 0,
      x: 'no',
      y: 'no',
      z_index_counter: 1,

      moving: false,
      move_x: 'no',
      move_y: 'no',

      current_shapes: [
        {
          item: 0, // Refers to the index of the apartment_items list
          z_index: 0,
          x_start: 0,
          y_start: 0,
          x_end: 0,
          y_end: 0,
          rotate: 0
        }
      ],
      apartment_items: [
          'Couch', 'TV', 'Coffee Table', 'TV Stand',
          'Lamp', 'Side Table', 'Arm Chair', 'Mirror',
          'Dresser', 'Desk', 'Desk Chair'
      ],
      selected_item: 'Couch',
      fine_selected_item: 'Red'
    }
  },

  methods: {
    startDrag(event) {
      this.dragging = true
      this.x = event.x
      this.y = event.y
      this.current_shapes.push({
        item: 0,
        z_index: this.z_index_counter,
        x_start: event.x,
        y_start: event.y,
        x_end: event.x,
        y_end: event.y,
        rotate: 0
      })
      this.z_index_counter += 1
      this.current_shape_index = this.current_shapes.length - 1
    },

    stopDrag() {
      this.dragging = false
      this.x = this.y = 'no'
      this.moving = false
      this.move_x = this.move_y = 'no'
    },

    doDrag(event) {
      if (this.dragging) {
        this.x = event.x
        this.y = event.y

        this.current_shapes[this.current_shape_index].x_end = event.x
        this.current_shapes[this.current_shape_index].y_end = event.y
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
      this.current_shape_index = this.current_shapes.indexOf(shape)
      shape.z_index = this.z_index_counter
      this.z_index_counter += 1
      this.move_x = event.x
      this.move_y = event.y
      this.moving = true
    },

    moveShape(event) {
      if (this.moving) {
        let x_movement = event.x - this.move_x
        let y_movement = event.y - this.move_y
        this.move_x = event.x
        this.move_y = event.y

        this.current_shapes[this.current_shape_index].x_start += x_movement
        this.current_shapes[this.current_shape_index].y_start += y_movement
        this.current_shapes[this.current_shape_index].x_end += x_movement
        this.current_shapes[this.current_shape_index].y_end += y_movement
      }
    },

    deleteShape() {
      console.log("deleting")
      console.log(this.current_shapes)
      console.log(this.current_shape_index)
      this.current_shapes.splice(this.current_shape_index)
      console.log(this.current_shapes)
      this.current_shape_index = this.current_shapes.length - 1
      this.delete_confirm = !this.delete_confirm
    },

    rotate(clockwise) {
      if (clockwise) {
        this.current_shapes[this.current_shape_index].rotate -= 5
      } else {
        this.current_shapes[this.current_shape_index].rotate += 5
      }
    },

    changeSize(increase) {
      if (increase) {
        this.current_shapes[this.current_shape_index].x_end += 10
        this.current_shapes[this.current_shape_index].y_end += 10
      } else {
        this.current_shapes[this.current_shape_index].x_end -= 10
        this.current_shapes[this.current_shape_index].y_end -= 10
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
</style>