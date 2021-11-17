import {point as getPoint} from '@turf/helpers'
import {toMercator,} from '@turf/projection'

/**
 * 经纬度坐标转墨卡托
 * @param {number} lng 经度
 * @param {number} lat 纬度
 * @returns {mktPoint}
 * @private
 * */
export function jwdToMkt(lng, lat) {
  const jwdInstance = getPoint([lng,lat])
  const mktInstance = toMercator(jwdInstance)
  const result=mktInstance.geometry.coordinates
  return result
}

/**
 * @typedef {array} mktPoint
 * @property {number} 0 x
 * @property {number} 1 y
 * */
