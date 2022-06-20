import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessingService {

  getFinalAngle(arg0: any, arg1: any) {
    return arg0 > arg1 ? Math.PI / 2 : -Math.PI / 2;
  }

  constructor() {
  }

  computeSize(femoral_w: number, size: string, w_rod: number, h_rod: number, pos_y: number, axDiaX: number, scale, side) {
    if (femoral_w < 0) {
      size = 'T1'
      w_rod = 51.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -77
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 77
      }
    } else if (femoral_w < 0) {
      size = 'T2'
      w_rod = 52.8 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -78
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 78
      }
    } else if (femoral_w < 0) {
      size = 'T3'
      w_rod = 54.6 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -77.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 77.5
      }
    } else if (femoral_w < 0) {
      size = 'T4'
      w_rod = 56.1 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -78.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 78.5
      }
    } else if (femoral_w < 0) {
      size = 'T5'
      w_rod = 57.9 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -79
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 79
      }
    } else if (femoral_w < 0) {
      size = 'T6'
      w_rod = 59.7 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -79.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 79.5
      }
    } else if (femoral_w < 0) {
      size = 'T7'
      w_rod = 61.5 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -80
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 80
      }
    } else if (femoral_w < 0) {
      size = 'T8'
      w_rod = 63 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -81
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 81
      }
    } else if (femoral_w < 0) {
      size = 'T9'
      w_rod = 64.8 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -82.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 82.5
      }
    } else if (femoral_w < 0) {
      size = 'T10'
      w_rod = 66.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -83.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 83.5
      }
    } else if (femoral_w < 0) {
      size = 'T11'
      w_rod = 67.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        pos_y = 371
        axDiaX = -84.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 84.5
      }
    }

    console.log(size)
  }

  getSlope(x1: any, y1: any, x2: any, y2: any) {
    return (x1 - x2) != 0 ? (y2 - y1) / (x2 - x1) : (y2 - y1 / Number.EPSILON);
  }

  getFemoralWidth(markers, ratio: any, scale: any) {
    let marker_left = markers[0].split(' ') //left = ['left','x','y']
    let marker_right = markers[1].split(' ') //right )= ['right','x','y']
    let x_marker_left = parseFloat(marker_left[1])
    let y_marker_left = parseFloat(marker_left[2])
    let x_marker_right = parseFloat(marker_right[1])
    let y_marker_right = parseFloat(marker_right[2])

    //Find the femoral width
    let c = x_marker_left - x_marker_right;
    let d = y_marker_left - y_marker_right;
    return Math.sqrt(c * c + d * d) * ratio * scale;
  }
}
