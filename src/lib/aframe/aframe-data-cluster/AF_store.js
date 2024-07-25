/* global AFRAME */

import "aframe-state-component"

AFRAME.registerState({
  initialState: {
    chartData: []
  },

  handlers: {
    setChartData: (state, action) => {
      state.chartData = action.chartData
    }
  }

})
