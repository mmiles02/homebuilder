<template>
  <v-row>
    <v-col>
      <v-row>
        <v-col>
          <Header/>
        </v-col>
      </v-row>

      <v-row style="padding: 20px">
        <v-col align="center">
          <template>
            <v-toolbar dense>
              <v-btn-toggle
                  v-model="toggle_multiple"
                  group
              >
                <v-btn v-for="(item, index) in apartment_items" v-bind:key="index" :value=index>
                  {{ item }}
                </v-btn>
              </v-btn-toggle>
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



        <v-row class="other">
          <v-col>
            X: {{ x }}, Y: {{ y }}
          </v-col>
        </v-row>


        <v-row
            v-for="shape in current_shapes"
            v-bind:key="shape.z_index"
            :style="getStyle(shape)"
            @mousedown="startMove(shape, $event)"
            @mousemove="moveShape"
        >
          <v-col>
            <Couch :height="Math.abs(shape.y_end - shape.y_start)" :width="Math.abs(shape.x_end - shape.x_start)"></Couch>
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
          y_end: 0
        }
      ],




      apartment_items: ['Couch', 'TV', 'Coffee Table'],
      dropdown_font: [
          { text: 'Arial' },
          { text: 'Calibri' },
          { text: 'Courier' },
          { text: 'Verdana' },
        ],
        dropdown_edit: [
          { text: '100%' },
          { text: '75%' },
          { text: '50%' },
          { text: '25%' },
          { text: '0%' },
        ],
        toggle_exclusive: 2,
        toggle_multiple: [1, 2, 3],
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
        y_end: event.y
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
      console.log("start move")
      console.log(shape)
      console.log(event)
      this.current_shape_index = this.current_shapes.indexOf(shape)
      shape.z_index = this.z_index_counter
      this.z_index_counter += 1
      this.move_x = event.x
      this.move_y = event.y
      this.moving = true
    },

    moveShape(event) {
      if (this.moving) {
        // console.log(event.y - this.move_y)
        // console.log(event.x - this.move_x)
        // this.current_shapes[this.current_shape_index].y_start = event.y
        // this.current_shapes[this.current_shape_index].x_start = event.x
        this.current_shapes[this.current_shape_index].y_start += (event.y - this.move_y)
        this.current_shapes[this.current_shape_index].y_end += (event.y - this.move_y)
        this.current_shapes[this.current_shape_index].x_start += (event.x - this.move_x)
        this.current_shapes[this.current_shape_index].x_end += (event.x - this.move_x)
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