import { noop } from 'lodash-es'
import { makeChannel } from '../share/channel'
import {markerBuilder} from '../share/services/marker'

export const marker =  markerBuilder.consumer()
