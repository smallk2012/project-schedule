<template>
    <div class="page">
        <div style="margin: 20px 10px;">
            <input type="file" multiple="false" id="sheetjs-input" accept=".xlsx,.xls" @change="onchange($event)" />
            <span style="color:#ff0000;">导入的excel文件命名格式必须是：项目名称_时间 比如: demo_2019-1-1 或 demo_2019-01-01</span>
            <button type="button" v-if="!isUp" @click="downloadExl">导出EXCEL模板</button>
            <button type="button" v-else @click="downloadExl">导出EXCEL</button>
        </div>
        <div style="margin-left: 10px;margin-bottom: 20px;display: inline-block;border: 1px solid rgb(204, 204, 204);padding: 20px;border-radius: 4px;line-height: 1.4;color: #333;">
            <p ref="info1">项目：{{fileName.split('_')[0]}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工期：{{info.total}}天/人
                <span v-if="info.delay">(原评估{{((info.total - info.delay) * 100)/100}}天/人)</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开发周期：{{timelines.length}}天</p>
            <p ref="info2">开始日期：{{timelines.length ? timelines[0].date : ''}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束日期：{{endDate.date}}
                <span v-if="planTimeLines.length && endDate.time != planTimeLines[planTimeLines.length - 1].time">（原计划{{planTimeLines[planTimeLines.length - 1].date}}结束）</span>
                <span v-if="curTimelines.length && endDate.time != curTimelines[curTimelines.length - 1].time">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;次日日期结算进度结束日期：{{curTimelines[curTimelines.length - 1].date}}</span>
            </p>
            <p ref="info3">人员信息：
                <span v-html="info.devs"></span>
            </p>
        </div>
        <el-table :data="table" border style="width: 100%" height="480" :cell-style="getCellStyle">
            <el-table-column show-overflow-tooltip fixed header-align="center" :prop="field" :label="field" v-for="(field,idx) in fields" :key="field + idx">
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="120" align="center" :class-name="time.mark == 1 ? 'gray' : ''" :label="time.date" v-for="(time,idx) in timelines" :key="idx" width="100">
                <template slot-scope="scope">
                    {{scope.row.timelines[idx] == 5 ? '休息' : ''}}
                </template>
            </el-table-column>
        </el-table>
        <div style="height:20px;background-color:#000;"></div>
        <p style="color: #333;" v-for="(item,index) in remarks" :key="index">{{item}}</p>
    </div>
</template>

<script>
var XLSX = window.XLSX

export default {
    name: 'Excel',
    data () {
        return {
            isUp: false,
            colors: ['#7A24A6', '#001E64', '#0070C6', '#00B2F6', '#00B441', '#7ED432', '#FEFF00', '#FFBE00', '#FF0000', '#D20000'],
            suffix: 'xlsx',
            fileName: '',
            startTime: '',
            remarks: [],
            fields: [],
            timelines: [],
            curTimelines: [],
            planTimeLines: [],
            table: [],
            devInfo: {}
        }
    },
    computed: {
        info () {
            let _total = 0
            let _delay = 0
            let _devs = []
            for (let dev in this.devInfo) {
                _total += this.devInfo[dev].开发总天数 || 0
                _delay += this.devInfo[dev].延期总天数 || 0
                _devs.push(dev + '<span style="color:#ff0000;">' + this.devInfo[dev].开发总天数 + '天</span>')
            }
            return { total: _total, delay: _delay, devs: _devs.toString() }
        },
        endDate () {
            let _endDate = this.timelines.length ? this.timelines[this.timelines.length - 1] : {}
            // 最后一天排期日
            let _lastDevDay = 0
            for (let dev in this.devInfo) {
                for (let m = 0; m < this.devInfo[dev].devlog.length; m++) {
                    _lastDevDay = Math.max(_lastDevDay, this.devInfo[dev].devlog[m])
                }
            }
            // 获取开发进度情况
            let _finishNum = 0
            for (let m = 0; m < this.table.length; m++) {
                if (this.table[m].进度 == 100) {
                    _finishNum++
                }
            }
            return {
                date: _finishNum == this.table.length ? new Date(_lastDevDay).format('MM月dd日') : _endDate.date,
                time: _finishNum == this.table.length ? _lastDevDay : _endDate.time
            }
        }
    },
    methods: {
        getTimeLines (__maxTime, __devMaxTime, __startTime) {
            // 获取开发时间线
            let _timelines = []
            let _timeIndex = 0
            let _timeCount = 0
            while (_timeCount < Math.ceil(__maxTime) || _timeIndex <= __devMaxTime) {
                let _time = Date.parse(__startTime) + 86400000 * _timeIndex
                let _date = new Date(_time)
                let _isNotWeeked = _date.getDay() != 0 && _date.getDay() != 6
                let _obj = {
                    date: _date.format('MM月dd日'),
                    mark: _isNotWeeked ? 0 : 1,
                    time: _time
                }
                _timelines.push(_obj)
                _timeIndex++
                if (_isNotWeeked && _timeCount < Math.ceil(__maxTime)) {
                    _timeCount++
                }
            }
            return _timelines
        },
        colorRgb (__color, __opacity) {
            var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/
            var sColor = __color.toLowerCase()
            if (sColor && reg.test(sColor)) {
                if (sColor.length === 4) {
                    var sColorNew = '#'
                    for (let i = 1; i < 4; i += 1) {
                        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1))
                    }
                    sColor = sColorNew
                }
                var sColorChange = []
                for (let i = 1; i < 7; i += 2) {
                    sColorChange.push(parseInt('0x' + sColor.slice(i, i + 2)))
                }
                sColor = 'rgba(' + sColorChange.join(',') + ',' + (__opacity != undefined ? __opacity : 0.3) + ')'
            }

            let _values = sColor
                .replace(/rgba?\(/, '')
                .replace(/\)/, '')
                .replace(/[\s+]/g, '')
                .split(',')
            let _a = parseFloat(_values[3] || 1)
            let _r = Math.floor(_a * parseInt(_values[0]) + (1 - _a) * 255)
            let _g = Math.floor(_a * parseInt(_values[1]) + (1 - _a) * 255)
            let _b = Math.floor(_a * parseInt(_values[2]) + (1 - _a) * 255)
            return '#' +
                ('0' + _r.toString(16)).slice(-2) +
                ('0' + _g.toString(16)).slice(-2) +
                ('0' + _b.toString(16)).slice(-2)
        },
        getCellStyle (__obj) {
            var _style = ''
            if (__obj.columnIndex > (this.fields.length - 1) && __obj.row.开发人员 != '') {
                let _mark = __obj.row.timelines[__obj.columnIndex - this.fields.length]
                if (_mark == 2) {
                    _style = 'background-color:' + __obj.row.color
                } else if (_mark == 3) {
                    _style = 'background-color:' + this.colorRgb(__obj.row.color)
                } else if (_mark == 4) {
                    _style = 'background-color:' + this.colorRgb(__obj.row.color, 0.7)
                } else if (_mark == 5) {
                    _style = 'color:#FF0000;'
                } else {
                    _style = ''
                }
            }
            return _style
        },
        sheetFmt (__sheet) {
            let _this = this
            if (__sheet.length) {
                // 获取字段
                let _fields = []
                for (let m = 0; m < __sheet[0].length; m++) {
                    _fields.push(__sheet[0][m])
                    if (__sheet[0][m] == '进度') {
                        break
                    }
                }
                _this.fields = _fields
                // 表格内容数据
                let _conts = []
                let _spaceIndex = __sheet.length
                for (let m = 0; m < __sheet.length; m++) {
                    if (__sheet[m].join('').toString().trim() === '') {
                        _spaceIndex = m + 1
                        break
                    } else {
                        _conts.push(__sheet[m])
                    }
                }

                // 备注内容
                let _remarks = []
                for (let m = _spaceIndex; m < __sheet.length; m++) {
                    if (__sheet[m].join('').toString().trim() === '') {
                        _spaceIndex = m + 1
                        break
                    } else {
                        _remarks.push(__sheet[m].join('').toString().trim())
                    }
                }
                _this.remarks = _remarks
                // 表格数据
                let _table = []
                for (let m = 1; m < _conts.length; m++) {
                    var _obj = {}
                    for (let n = 0; n < Math.max(_conts[m].length, _this.fields.length); n++) {
                        if (n < _this.fields.length) {
                            _obj[_this.fields[n]] = _conts[m][n] || ''
                        }
                    }
                    _table.push(_obj)
                }
                // 开发人员数据
                let _dev = {}
                for (let m = 0; m < _table.length; m++) {
                    let _obj = _dev[_table[m].开发人员 || '开发人员'] || {}
                    _obj.开发记录 = (_obj.开发记录 || '') + _table[m].开发记录
                    _obj.休假记录 = (_obj.休假记录 || '') + _table[m].休假记录
                    _dev[_table[m].开发人员 || '开发人员'] = _obj
                }
                // 开发记录和开发者color
                let _cIndex = 0
                for (let dev in _dev) {
                    _dev[dev].color = _this.colors[Math.floor(_cIndex % _this.colors.length)]
                    _cIndex++
                    let _devlog = _dev[dev].开发记录.split('#')
                    _devlog = _devlog.splice(1, _devlog.length)
                    _dev[dev].devlog = []
                    for (let m = 0; m < _devlog.length; m++) {
                        _dev[dev].devlog.push(Date.parse(_devlog[m]))
                    }
                }
                // 延期时间和单个开发记录
                for (let m = 0; m < _table.length; m++) {
                    let _devlog = _table[m].开发记录.split('#')
                    _devlog = _devlog.splice(1, _devlog.length)
                    _table[m].devlog = []
                    let _delayTime = 0
                    for (let j = 0; j < _devlog.length; j++) {
                        let _delayNum = 0
                        let _devTime = Date.parse(_devlog[j])
                        _table[m].devlog.push(_devTime)
                        // 计算本次开发日用在几个进度上，得出用时
                        for (let k = 0; k < _dev[_table[m].开发人员 || '开发人员'].devlog.length; k++) {
                            if (_devTime == _dev[_table[m].开发人员 || '开发人员'].devlog[k]) {
                                _delayNum++
                            }
                        }
                        if (_delayNum > 0) {
                            _delayTime += Math.floor(100 / _delayNum)
                        }
                    }
                    let _pgTime = parseFloat(_table[m].评估天数 || 0) * 100
                    _table[m].延期天数 = _delayTime > _pgTime ? (_delayTime - _pgTime) / 100 : (_delayTime == _pgTime && _table[m].进度 != 100 ? ((_table[m].评估天数 || 0) == 0 ? '' : 0.5) : '')
                }
                // 开发总天数，区间，主题色
                for (let m = 0; m < _table.length; m++) {
                    let _obj = _dev[_table[m].开发人员 || '开发人员'] || {}
                    _table[m].color = _obj.color
                    _obj.开发总天数 = parseFloat(_obj.开发总天数 || 0)
                    _obj.延期总天数 = parseFloat(_obj.延期总天数 || 0)
                    _table[m].min = parseInt(_obj.开发总天数)
                    _obj.开发总天数 += parseFloat(_table[m].评估天数 || 0) + parseFloat(_table[m].延期天数 || 0)
                    _obj.延期总天数 += parseFloat(_table[m].延期天数 || 0)
                    _table[m].max = Math.ceil(_obj.开发总天数)
                    _dev[_table[m].开发人员 || '开发人员'] = _obj
                }
                // 休假天数
                for (let dev in _dev) {
                    let _happylog = _dev[dev].休假记录.split('#')
                    _happylog = _happylog.splice(1, _happylog.length)
                    let _happyTime = []
                    for (let m = 0; m < _happylog.length; m++) {
                        if (m == 0) {
                            _happyTime.push(Date.parse(_happylog[m]))
                        } else {
                            let j = 0
                            for (let n = 0; n < _happyTime.length; n++) {
                                if (_happyTime[m] == _happylog[n]) {
                                    j++
                                    break
                                }
                            }
                            if (j == 0) {
                                _happyTime.push(Date.parse(_happylog[m]))
                            }
                        }
                    }
                    _dev[dev].happyTime = _happyTime
                }
                // 获取开发人员使用最长时间
                let _maxTime = 0
                // 最后一天排期日
                let _lastDevDay = 0
                for (let dev in _dev) {
                    _maxTime = Math.max(_maxTime, _dev[dev].开发总天数 + _dev[dev].happyTime.length)
                    for (let m = 0; m < _dev[dev].devlog.length; m++) {
                        _lastDevDay = Math.max(_lastDevDay, _dev[dev].devlog[m])
                    }
                }
                // 获取当前最长开发时间天数
                let _devMaxTime = (_lastDevDay - Date.parse(_this.startTime)) / 86400000
                // 获取开发时间线
                let _timelines = _this.getTimeLines(_maxTime, _devMaxTime, _this.startTime)
                // 每条数据的时间线
                for (let m = 0; m < _table.length; m++) {
                    _table[m].timelines = []
                    let _timeIndex = 0
                    for (let n = 0; n < _timelines.length; n++) {
                        let _happyNum = 0
                        if (_timeIndex >= _table[m].min && _timeIndex < _table[m].max && _timelines[n].mark != 1) {
                            let _happyTime = _dev[_table[m].开发人员 || '开发人员'].happyTime
                            for (let k = 0; k < _happyTime.length; k++) {
                                if (_timelines[n].time == _happyTime[k]) {
                                    _happyNum++
                                }
                            }
                            if (_happyNum > 0) {
                                _table[m].timelines.push(5)
                            } else {
                                _table[m].timelines.push(2)
                            }
                        } else {
                            if (_timelines[n].mark == 1) {
                                _table[m].timelines.push(1)
                            } else {
                                _table[m].timelines.push(0)
                            }
                        }
                        if (_timelines[n].mark != 1 && _happyNum == 0) {
                            _timeIndex++
                        }
                        // 开发日期重叠颜色
                        for (let j = 0; j < _table[m].devlog.length; j++) {
                            if (_table[m].devlog[j] == _timelines[n].time) {
                                _table[m].timelines[_table[m].timelines.length - 1] = _table[m].timelines[_table[m].timelines.length - 1] == 2 ? 4 : 3
                                break
                            }
                        }
                    }
                }
                // 计算剩余天数
                for (let m = 0; m < _table.length; m++) {
                    let _obj = _dev[_table[m].开发人员 || '开发人员']
                    _obj.剩余天数 = _obj.剩余天数 || 0
                    if (_table[m].进度 != 100) {
                        if ((_table[m].延期天数 || 0) > 0) {
                            _obj.剩余天数 += 1
                        } else {
                            let _usedTime = 0
                            for (let i = 0; i < _table[m].devlog.length; i++) {
                                var _repeat = 0
                                for (let j = 0; j < _obj.devlog.length; j++) {
                                    if (_table[m].devlog[i] == _obj.devlog[j]) {
                                        _repeat++
                                    }
                                }
                                if (_repeat > 0) {
                                    _usedTime += Math.floor(1000 / _repeat)
                                }
                            }
                            _obj.剩余天数 += _table[m].进度 != 100 ? ((_table[m].评估天数 || 0) - (_usedTime / 1000)) : 0
                        }
                    }
                }
                // 推算出完成时长
                let _finishTime = 0
                let _curDate = new Date().format('yyyy/MM/dd')
                var _curTime = Date.parse(_curDate)
                for (let dev in _dev) {
                    let _happyNum = 0
                    for (let m = 0; m < _dev[dev].happyTime.length; m++) {
                        if (_dev[dev].happyTime[m] > _curTime) {
                            _happyNum++
                        }
                    }
                    // 该开发人员进度已经完成，那么评估天数内的休假不统计了
                    let _notFinishNum = 0
                    for (let m = 0; m < _table.length; m++) {
                        if (_table[m].开发人员 == dev && _table[m].进度 != 100) {
                            _notFinishNum++
                        }
                    }
                    _finishTime = Math.max(_dev[dev].剩余天数 + (_notFinishNum > 0 ? _happyNum : 0), _finishTime)
                }
                let _curTimelines = _finishTime > 0 ? _this.getTimeLines(_finishTime, 0, new Date(_curTime + 86400000).format('yyyy/MM/dd')) : []
                // 原计划结束日期
                _maxTime = 0
                for (let dev in _dev) {
                    _maxTime = Math.max(_maxTime, _dev[dev].开发总天数 - _dev[dev].延期总天数 + _dev[dev].happyTime.length)
                }
                let _planTimeLines = _this.getTimeLines(_maxTime, 0, _this.startTime)
                _this.planTimeLines = _planTimeLines
                _this.devInfo = _dev
                _this.curTimelines = _curTimelines
                _this.timelines = _timelines
                _this.table = _table
                // eslint-disable-next-line
                console.log(_table)
                // eslint-disable-next-line
                console.log(_dev)
            }
        },
        onchange (evt) {
            var _this = this
            var files = evt.target.files

            if (!files || files.length == 0) return
            _this.isUp = true
            var file = files[0]
            _this.fileName = file.name.replace('.' + _this.suffix, '').split(' ')[0]
            // eslint-disable-next-line
            _this.startTime = _this.fileName.split('_')[1].replace(/\-/g, '/')
            // eslint-disable-next-line
            console.log(_this.startTime)
            var _reader = new FileReader()
            _reader.onload = function (e) {
                var _binary = ''
                var _bytes = new Uint8Array(e.target.result)
                var _length = _bytes.byteLength
                for (let i = 0; i < _length; i++) {
                    _binary += String.fromCharCode(_bytes[i])
                }
                var _wb = XLSX.read(_binary, { type: 'binary' })
                var _wsname = _wb.SheetNames[0]
                var _ws = _wb.Sheets[_wsname]
                var _sheet = XLSX.utils.sheet_to_json(_ws, { header: 1 })
                // eslint-disable-next-line
                console.log(JSON.stringify(_sheet).replace(/\"/g, "'"))
                _this.sheetFmt(_sheet)
            }
            _reader.readAsArrayBuffer(file)
        },
        // 获取26个英文字母用来表示excel的列
        getCharCol (__n) {
            let _s = ''
            let _m = 0
            while (__n > 0) {
                _m = __n % 26 + 1
                _s = String.fromCharCode(_m + 64) + _s
                __n = (__n - _m) / 26
            }
            return _s
        },
        s2ab (__s) {
            if (typeof ArrayBuffer !== 'undefined') {
                let _buf = new ArrayBuffer(__s.length)
                let _view = new Uint8Array(_buf)
                for (let i = 0; i != __s.length; ++i) {
                    _view[i] = __s.charCodeAt(i) & 0xFF
                }
                return _buf
            } else {
                let _buf = new Array(__s.length)
                for (let i = 0; i != __s.length; ++i) {
                    _buf[i] = __s.charCodeAt(i) & 0xFF
                }
                return _buf
            }
        },
        sheetStyle (__v, __c, __font) {
            __v = __font || __v.toString()
            var _obj = {
                v: __v,
                t: isNaN(Number(__v)) || __v.trim() === '' ? ((__v.indexOf('月') != -1 && __v.indexOf('日') != -1 && __v.length == __v.indexOf('日') + 1) ? 'n' : 's') : 'n'
            }
            if (__c) {
                _obj.s = {
                    fill: {
                        fgColor: {
                            rgb: __c.replace('#', '')
                        }
                    }
                }
            }
            if (__font) {
                _obj.s = _obj.s || {}
                _obj.s.font = {
                    sz: 12,
                    bold: false,
                    color: {
                        rgb: 'FF0000'
                    }
                }
                _obj.s.alignment = {
                    vertical: 'center',
                    horizontal: 'center'
                }
            }
            return _obj
        },
        // 下载功能
        saveAs (__obj) {
            var _tmpa = document.createElement('a')
            _tmpa.download = this.fileName + '.' + this.suffix
            // 兼容ie
            if ('msSaveOrOpenBlob' in navigator) {
                window.navigator.msSaveOrOpenBlob(__obj, _tmpa.download)
            } else {
                _tmpa.href = URL.createObjectURL(__obj)
            }
            _tmpa.click()
            setTimeout(function () {
                URL.revokeObjectURL(__obj)
            }, 100)
        },
        downloadExl () {
            var _this = this
            var _merges = []
            var _fields = _this.fields.map(v => ({ name: v, value: 0 })).concat(_this.isUp ? _this.timelines.map(v => ({ name: v.date, value: v.mark })) : [])
            var _sheetData = {}
            var _endCellName = 'A1'
            for (let m = 0; m < _fields.length; m++) {
                let _cellName = m > 25 ? _this.getCharCol(m) : String.fromCharCode(65 + m)
                _sheetData[_cellName + 1] = _this.sheetStyle(_fields[m].name, _fields[m].value == 1 ? '#CCCCCC' : '')
                _sheetData[_cellName + (_this.table.length + 2)] = _this.sheetStyle('', '#000000')
                _endCellName = _cellName + (_this.table.length + 2)
                for (let n = 0; n < _this.remarks.length; n++) {
                    _sheetData[_cellName + (_this.table.length + 3 + n)] = _this.sheetStyle(m == 0 ? _this.remarks[n].trim() : '')
                    _endCellName = _cellName + (_this.table.length + 3 + n)
                    if (m == 0) {
                        _merges.push(
                            {
                                s: { c: 0, r: (_this.table.length + 3 + n) - 1 },
                                e: { c: _this.fields.length - 1, r: (_this.table.length + 3 + n) - 1 }
                            }
                        )
                    }
                }
            }
            for (let m = 0; m < _this.table.length; m++) {
                for (let n = 0; n < _fields.length; n++) {
                    var _cellName = n > 25 ? _this.getCharCol(n) : String.fromCharCode(65 + n)
                    if (n < _this.fields.length) {
                        _sheetData[_cellName + (m + 2)] = _this.sheetStyle(_this.table[m][_this.fields[n]])
                    } else {
                        let _mark = _this.table[m].timelines[n - _this.fields.length]
                        let _color = ''
                        let _font = ''
                        if (_this.table[m].开发人员 != '' && _mark == 2) {
                            _color = _this.table[m].color
                        } else if (_mark == 1) {
                            _color = '#CCCCCC'
                        } else if (_mark == 3) {
                            _color = _this.colorRgb(_this.table[m].color)
                        } else if (_mark == 4) {
                            _color = _this.colorRgb(_this.table[m].color, 0.7)
                        } else if (_mark == 5) {
                            _font = '休息'
                        } else {
                            _color = ''
                        }
                        _sheetData[_cellName + (m + 2)] = _this.sheetStyle('', _color, _font)
                    }
                }
            }
            _sheetData['!merges'] = _merges // 必须在这里加合并代码，不然keys会出问题
            var _tmpWB = {
                SheetNames: ['排期'], // 保存的表标题
                Sheets: {
                    '排期': Object.assign({},
                        _sheetData, // 内容
                        {
                            '!ref': 'A1:' + _endCellName // 设置填充区域
                        })
                }
            }
            if (_this.isUp) {
                _tmpWB.SheetNames.push('项目信息')
                _tmpWB.Sheets.项目信息 = {
                    '!ref': 'A1:A3',
                    'A1': { v: _this.$refs.info1.innerText, t: 's' },
                    'A2': { v: _this.$refs.info2.innerText, t: 's' },
                    'A3': { v: _this.$refs.info3.innerText, t: 's' }
                }
            }
            // eslint-disable-next-line
            console.log(_tmpWB)
            var _tmpDown = new Blob([_this.s2ab(XLSX.write(_tmpWB, { bookType: _this.suffix, bookSST: false, type: 'binary' }))], { type: '' })
            _this.saveAs(_tmpDown)
        }
    },
    mounted () {
        var _this = this
        _this.fileName = '排期示例_' + (new Date().format())
        // eslint-disable-next-line
        _this.startTime = _this.fileName.split('_')[1].replace(/\-/g, '/')
        let _sheet = [
            ['自定义一级页面', '自定义二级页面', '自定义三级页面', '开发人员', '评估天数', '休假记录', '延期天数', '开发记录', '进度'],
            ['首页', '', 'banner', '路人甲', '2.5', '', '', '', ''], ['新闻', '新闻列表', '', '路人乙', '1.5', '', '', '', ''],
            ['', '', '新闻详情', '路人甲', '1.5', '', '', '', ''], ['', '', '', '', '', '', '', '', ''],
            ['黑色条是一个分界线，每天站会纪要问题可以写在黑色条下面，方便项目跟踪', '', '', '', '', '', '', '', ''],
            ['自定义的东西可以随便添加N个', '', '', '', '', '', '', '', ''],
            ['休假记录和开发记录的日期必须#符号开头，如#2019/1/1或#2019/01/01', '', '', '', '', '', '', '', ''],
            ['但是自定义后面的[开发人员,评估天数,休假记录,延期天数,开发记录,进度]为固定内容', '', '', '', '', '', '', '', ''],
            ['休假记录：把你休息的那天日期记录起来，就不会排期了', '', '', '', '', '', '', '', ''],
            ['延期天数：导入到网站保存的时候，会自动结算(开发记录大于评估天数=延期1天，相等并进度不等于100=延期0.5天)', '', '', '', '', '', '', '', ''],
            ['干活前：你只需要弄自定义页面，开发人员，评估天数', '', '', '', '', '', '', '', ''],
            ['干活后：你只需要填开发记录，进度', '', '', '', '', '', '', '', '']]
        _this.sheetFmt(_sheet)
    }
}

</script>

<style scoped lang="scss">
.page /deep/ {
    font-size: 14px;
    .gray {
        background-color: #ccc;
    }
}
</style>
