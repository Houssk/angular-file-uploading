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
    let pos_x=0
    let axDiaX=0


    if (femoral_w < 16.9) { //50mm : 14 to 16.9 ; 70mm : 9.9 to 11.7 ; 90mm : 7.6 to 9.1
      size = 'T1'
      w_rod = 51.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 73
        axDiaX = -77
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -73
        axDiaX = 77
      }
    } else if (femoral_w < 19.7) { //50mm : 16.9 to 19.7 ; 70mm : 11.7 to 13.7 ; 90mm : 9.1 to 10.5
      size = 'T2'
      w_rod = 52.8 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 76
        axDiaX = -78
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -76
        axDiaX = 78
      }
    } else if (femoral_w < 22.6) { //50mm : 19.7 to 22.6 ; 70mm : 13.7 to 15.6 ; 90mm : 10.5 to 12
      size = 'T3'
      w_rod = 54.6 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 81.5
        axDiaX = -77.5
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -79.5
        axDiaX = 77.5
      }
    } else if (femoral_w < 25.5) { //50mm : 22.6 to 25.5 ; 70mm : 15.6 to 17.5 ; 90mm : 12 to 13.4
      size = 'T4'
      w_rod = 56.1 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 83.5
        axDiaX = -78.5
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -82.5
        axDiaX = 78.5
      }
    } else if (femoral_w < 28.4) { //50mm : 25.5 to 28.4 ; 70mm : 17.5 to 19.4 ; 90mm : 13.4 to 14.9
      size = 'T5'
      w_rod = 57.9 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 87
        axDiaX = -79
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -86
        axDiaX = 79
      }
    } else if (femoral_w < 31.2) { //50mm : 28.4 to 31.2 ; 70mm : 19.4 to 21.4 ; 90mm : 14.9 to 16.3
      size = 'T6'
      w_rod = 59.7 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 90.5
        axDiaX = -79.5
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -89.5
        axDiaX = 79.5
      }
    } else if (femoral_w < 34.1) { //50mm : 31.2 to 34.1 ; 70mm : 21.4 to 23.3 ; 90mm : 16.3 to 17.8
      size = 'T7'
      w_rod = 61.5 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 94
        axDiaX = -80
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -93
        axDiaX = 80
      }
    } else if (femoral_w < 37) { //50mm : 34.1 to 37 ; 70mm : 23.3 to 25.2 ; 90mm : 17.8 to 19.2
      size = 'T8'
      w_rod = 63 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 97
        axDiaX = -81
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -96
        axDiaX = 81
      }
    } else if (femoral_w < 39.8) { //50mm : 37 to 39.8 ; 70mm : 25.2 to 27.1 ; 90mm : 19.2 to 20.7 
      size = 'T9'
      w_rod = 64.8 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 100.5
        axDiaX = -82.5
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -99.5
        axDiaX = 82.5
      }
    } else if (femoral_w < 42.7) { //50mm : 39.8 to 42.7 ; 70mm : 27.1 to 29.1 ; 90mm : 20.7 to 22.1
      size = 'T10'
      w_rod = 66.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 103.5
        axDiaX = -83.5
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -102.5
        axDiaX = 83.5
      }
    } else if (femoral_w >= 42.7) { //50mm : 42.7 to ?? ; 70mm : 29.1 to ?? ; 90mm : 22.1 to ?? 
      size = 'T11'
      w_rod = 67.3 / scale
      h_rod = 203.2 / scale
      if (side == 'right') {
        side_id = '_R'
        pos_y = 371
        pos_x = 105.5
        axDiaX = -84.5
      } else if (side == 'left') {
        pos_y = 371
        pos_x = -104.5
        axDiaX = 84.5
      }
    }

    console.log('largeur à 50mm :', femoral_w)
    let path = `./assets/images/hype_scs_${size}${side_id}.png`
    return {w_rod : w_rod, h_rod : h_rod, pos_x : pos_x, pos_y : pos_y, axDiaX : axDiaX, pathLink : path}
  }

  getSlope(x1: any, y1: any, x2: any, y2: any) {
    return (x1 - x2) != 0 ? (y2 - y1) / (x2 - x1) : (y2 - y1 / Number.EPSILON);
  }

  getFemoralWidth(markers, ratio: any, scale: any) {
    if (markers[0]=='Error') {
      return 23 //correspond to a T4 stem
    }
    else {
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
}
