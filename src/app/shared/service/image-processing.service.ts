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

  computeSize(femoral_w: number, scale, side) {
    let side_id = ''
    let size=''
    let w_rod=0
    let h_rod=0
    let pos_y=0
    let axDiaX=0


    if (femoral_w < 16.9) { //14 to 16.9
      size = 'T1'
      w_rod = 51.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -77
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 77
      }
    } else if (femoral_w < 19.7) { //16.9 to 19.7
      size = 'T2'
      w_rod = 52.8 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -78
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 78
      }
    } else if (femoral_w < 22.6) { //19.7 to 22.6 
      size = 'T3'
      w_rod = 54.6 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -77.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 77.5
      }
    } else if (femoral_w < 25.5) { //22.6 to 25.5 
      size = 'T4'
      w_rod = 56.1 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -78.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 78.5
      }
    } else if (femoral_w < 28.4) { //25.5 to 28.4 
      size = 'T5'
      w_rod = 57.9 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -79
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 79
      }
    } else if (femoral_w < 31.2) { //28.4 to 31.2 
      size = 'T6'
      w_rod = 59.7 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -79.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 79.5
      }
    } else if (femoral_w < 34.1) { //31.2 to 34.1 
      size = 'T7'
      w_rod = 61.5 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -80
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 80
      }
    } else if (femoral_w < 37) { //34.1 to 37
      size = 'T8'
      w_rod = 63 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -81
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 81
      }
    } else if (femoral_w < 39.8) { //37 to 39.8  
      size = 'T9'
      w_rod = 64.8 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -82.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 82.5
      }
    } else if (femoral_w < 42.7) { //39.8 to 42.7
      size = 'T10'
      w_rod = 66.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -83.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 83.5
      }
    } else if (femoral_w > 42.7) { //no infos
      size = 'T11'
      w_rod = 67.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        axDiaX = -84.5
      } else if (side == 'left') {
        pos_y = 371
        axDiaX = 84.5
      }
    }

    let path = `./assets/images/hype_scs_${size}${side_id}.png`
    return {w_rod : w_rod, h_rod : h_rod, pos_y : pos_y, axDiaX : axDiaX, pathLink : path}
  }

  getSlope(x1: any, y1: any, x2: any, y2: any) {
    return (x1 - x2) != 0 ? (y2 - y1) / (x2 - x1) : (y2 - y1 / Number.EPSILON);
  }

  getFemoralWidth(markers, ratio: any, scale: any) {
    let marker_left = markers[0].split(' ') //left = ['left','x','y']
    let marker_right = markers[1].split(' ') //right = ['right','x','y']
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
