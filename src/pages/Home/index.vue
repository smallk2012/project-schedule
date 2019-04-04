<template>
    <div class="page">
        <div style="margin-bottom: 20px;">
            <input type="file" multiple="false" id="sheetjs-input" accept=".xlsx,.xls" @change="onchange($event)" />
            <span style="color:#ff0000;">导入的excel文件命名格式必须是：项目名称_时间 比如: demo_2019-1-1 或 demo_2019-01-01</span>
            <button type="button" v-if="tableData.length" @click="downloadExl">导出EXCEL模板</button>
            <button type="button" v-else @click="downloadExl">导出EXCEL</button>
        </div>
        <p>项目：{{fileName.split('_')[0]}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工作日：{{developersDays.time/10}}天/人
            <span v-if="developersDays.delayTime>0">(包括延期{{developersDays.delayTime/10}}天)</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开发(包括周末)：{{dateAr.length}}天/{{developersList.length}}人</p>
        <p>开始日期：{{dateAr.length ? dateAr[0].date : ''}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束日期：{{dateAr.length ? dateAr[dateAr.length - 1].date : ''}}
            <span v-if="finishDateAr.length">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;当前日期结算进度结束日期：{{finishDateAr[finishDateAr.length - 1].date}}</span>
        </p>
        <p style="margin-bottom: 20px;">开发人员：{{developersList.toString()}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单人最短：{{devDays.min}}天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;单人最长：{{devDays.max}}天</p>
        <el-table :data="tableData" border style="width: 100%" height="480" :cell-style="getCellStyle">
            <el-table-column show-overflow-tooltip fixed header-align="center" :prop="item" :label="item" v-for="(item,idx) in xlsxFields" :key="item + idx">
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="120" align="center" :class-name="item.weekend ? 'gray' : ''" :label="item.date" v-for="(item,idx) in dateAr" :key="idx" width="100">
            </el-table-column>
        </el-table>
        <div style="background-color:#000000;height: 20px;"></div>
        <p v-for="(item,index) in remarks" :key="index">{{item}}</p>
    </div>
</template>

<script>
var XLSX = window.XLSX

export default {
    name: 'Home',
    data () {
        return {
            developers: {},
            colors: ['#7A24A6', '#001E64', '#0070C6', '#00B2F6', '#00B441', '#7ED432', '#FEFF00', '#FFBE00', '#FF0000', '#D20000'],
            dateAr: [],
            tableData: [
                {
                    color: '#7A24A6',
                    dateAr: [],
                    devlog: [],
                    max: 3,
                    min: 0,
                    自定义一级页面: '首页',
                    自定义二级页面: '',
                    自定义三级页面: 'banner',
                    延期天数: '',
                    开发人员: '路人甲',
                    开发记录: '',
                    评估天数: '2.5',
                    进度: ''
                },
                {
                    color: '#001E64',
                    dateAr: [],
                    devlog: [],
                    max: 2,
                    min: 0,
                    自定义一级页面: '新闻',
                    自定义二级页面: '新闻列表',
                    自定义三级页面: '',
                    延期天数: '',
                    开发人员: '路人乙',
                    开发记录: '',
                    评估天数: '1.5',
                    进度: ''
                },
                {
                    color: '#001E64',
                    dateAr: [],
                    devlog: [],
                    max: 2,
                    min: 0,
                    自定义一级页面: '',
                    自定义二级页面: '',
                    自定义三级页面: '新闻详情',
                    延期天数: '',
                    开发人员: '路人甲',
                    开发记录: '',
                    评估天数: '1.5',
                    进度: ''
                }
            ],
            xlsxData: [],
            xlsxFields: [
                '自定义一级页面',
                '自定义二级页面',
                '自定义三级页面',
                '开发人员',
                '评估天数',
                '延期天数',
                '开发记录',
                '进度'
            ],
            fileName: '',
            suffix: 'xlsx',
            startTime: '',
            remarks: [
                '黑色条是一个分界线，每天站会纪要问题可以写在黑色条下面，方便项目跟踪',
                '自定义的东西可以随便添加N个',
                '但是自定义后面的[开发人员,评估天数,延期天数,开发记录,进度]不能变，固定内容'
            ],
            dever: '开发人员',
            devlogDays: [],
            finishDateAr: []
        }
    },
    computed: {
        developersList () {
            var _ar = []
            for (var dev in this.developers) {
                if (dev != this.dever) {
                    _ar.push(dev)
                }
            }
            return _ar
        },
        developersDays () {
            var _days = {
                time: 0,
                delayTime: 0
            }
            for (var dev in this.developers) {
                if (dev != this.dever) {
                    _days.time += parseInt(this.developers[dev].time * 10)
                    _days.delayTime += parseInt(this.developers[dev].delayTime * 10)
                }
            }
            return _days
        },
        devDays () {
            var _min = 10000000
            var _max = 0
            for (var dev in this.developers) {
                if (dev != this.dever) {
                    _min = Math.min(this.developers[dev].time, _min)
                    _max = Math.max(this.developers[dev].time, _max)
                }
            }
            return {
                max: _max,
                min: _min == 10000000 ? 0 : _min
            }
        }
    },
    methods: {
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
            if (__obj.columnIndex > (this.xlsxFields.length - 1) && __obj.row[this.dever] != '') {
                let _weekend = __obj.row.dateAr[__obj.columnIndex - this.xlsxFields.length]
                if (_weekend == 2) {
                    _style = 'background-color:' + __obj.row.color
                } else if (_weekend == 3) {
                    _style = 'background-color:' + this.colorRgb(__obj.row.color)
                } else if (_weekend == 4) {
                    _style = 'background-color:' + this.colorRgb(__obj.row.color, 0.7)
                } else {
                    _style = ''
                }
            }
            return _style
        },
        getTotalTime (__time, __dayTime, __delayTime) {
            var _time = 0
            var _totalTime = 0
            var _ar = []
            while (_time < Math.ceil(__time)) {
                let _date = new Date(Date.parse(__delayTime != undefined ? __delayTime : this.startTime) + 86400000 * _totalTime)
                if (_date.getDay() != 0 && _date.getDay() != 6) {
                    _time++
                }
                _totalTime++
                let _obj = {
                    date: _date.format('MM月dd日'),
                    weekend: _date.getDay() != 0 && _date.getDay() != 6 ? 0 : 1
                }
                _ar.push(_obj)
            }
            while (_totalTime <= __dayTime) {
                let _date = new Date(Date.parse(__delayTime != undefined ? __delayTime : this.startTime) + 86400000 * _totalTime)
                let _obj = {
                    date: _date.format('MM月dd日'),
                    weekend: _date.getDay() != 0 && _date.getDay() != 6 ? 0 : 1
                }
                _ar.push(_obj)
                _totalTime++
            }
            return _ar
        },
        onchange (evt) {
            var _this = this
            var files = evt.target.files

            if (!files || files.length == 0) return

            var file = files[0]
            _this.fileName = file.name.replace('.' + _this.suffix, '').split(' ')[0]
            // eslint-disable-next-line
            _this.startTime = _this.fileName.split('_')[1].replace(/\-/g, '/')
            // eslint-disable-next-line
            console.log(_this.startTime)
            var reader = new FileReader()
            reader.onload = function (e) {
                var binary = ''
                var bytes = new Uint8Array(e.target.result)
                var length = bytes.byteLength
                for (var i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i])
                }
                var wb = XLSX.read(binary, { type: 'binary' })

                var wsname = wb.SheetNames[0]
                var ws = wb.Sheets[wsname]
                // eslint-disable-next-line
                console.log(ws)
                var _sheet = XLSX.utils.sheet_to_json(ws, { header: 1 })
                // 读取排期内容
                var _xlsxData = []
                var _spliceIndex = _sheet.length
                for (let m = 0; m < _sheet.length; m++) {
                    if (_sheet[m].join('').toString().trim() === '') {
                        _spliceIndex = m
                        break
                    }
                }
                _xlsxData = _sheet.splice(0, _spliceIndex)
                // 读取备注内容
                var _remarks = []
                for (let m = 0; m < _sheet.length; m++) {
                    let _remark = _sheet[m].join('').toString().trim()
                    if (_remark !== '') {
                        _remarks.push(_remark)
                    }
                }
                _this.remarks = _remarks
                _this.xlsxData = _xlsxData
                if (_xlsxData.length) {
                    // 表格字段
                    var _xlsxFields = []
                    for (let m = 0; m < _xlsxData[0].length; m++) {
                        if (_xlsxData[0][m] == '进度') {
                            _xlsxFields.push(_xlsxData[0][m])
                            break
                        } else {
                            _xlsxFields.push(_xlsxData[0][m])
                        }
                    }
                    _this.xlsxFields = _xlsxFields
                    // 表格数据
                    var _tableData = []
                    for (let m = 1; m < _xlsxData.length; m++) {
                        let _obj = {}
                        for (let n = 0; n < _xlsxFields.length; n++) {
                            if (n < _xlsxData[m].length) {
                                _obj[_xlsxFields[n]] = _xlsxData[m][n] || ''
                            } else {
                                _obj[_xlsxFields[n]] = ''
                            }
                        }
                        _tableData.push(_obj)
                    }
                    // 开发人员数据
                    _this.developers = {}
                    for (let i = 0; i < _tableData.length; i++) {
                        let _obj = _this.developers[_tableData[i][_this.dever] || _this.dever] || {}
                        _obj.time = _obj.time || 0
                        _obj.delayTime = _obj.delayTime || 0
                        _tableData[i].min = parseInt(_obj.time)
                        _tableData[i].devlog = _tableData[i].devlog || []
                        var _devlog = _tableData[i].开发记录.trim()
                        let _devlogDays = []
                        if (_devlog && _tableData[i][_this.dever].trim() != '') {
                            _devlogDays = _devlog.split('#')
                            _devlogDays = _devlogDays.splice(1, _devlogDays.length)
                            _tableData[i].devlog = _tableData[i].devlog.concat(_devlogDays)
                            _this.devlogDays = _this.devlogDays.concat(_devlogDays)
                            _tableData[i].延期天数 = _devlogDays.length > Math.ceil(parseFloat(_tableData[i].评估天数 || 0)) ? _devlogDays.length - parseFloat(_tableData[i].评估天数 || 0) : ''
                        } else {
                            _tableData[i].延期天数 = ''
                        }
                        _obj.delayTime += parseFloat(_tableData[i].延期天数 || 0)
                        _obj.time += parseFloat(_tableData[i].评估天数 || 0) + parseFloat(_tableData[i].延期天数 || 0)
                        _tableData[i].max = Math.ceil(_obj.time)
                        _this.developers[_tableData[i][_this.dever] || _this.dever] = _obj
                    }
                    // 开发时间
                    var _totalTime = 0
                    var _cIndex = 0
                    for (var _dev in _this.developers) {
                        _totalTime = Math.max(_this.developers[_dev].time, _totalTime)
                        _this.developers[_dev].color = _this.colors[Math.floor(_cIndex % _this.colors.length)]
                        _cIndex++
                    }
                    // 开发记录中最后的天数
                    let _dayTime = 0
                    if (_this.devlogDays.length) {
                        let _endTime = 0
                        for (let m = 0; m < _this.devlogDays.length; m++) {
                            _endTime = Math.max(Date.parse(_this.devlogDays[m]) || 0, _endTime)
                        }
                        _dayTime = Math.abs(Date.parse(_this.startTime) - _endTime) / 86400000
                    }
                    _this.dateAr = _this.getTotalTime(_totalTime, _dayTime)
                    for (let m = 0; m < _tableData.length; m++) {
                        _tableData[m].dateAr = []
                        let _index = 0
                        _tableData[m].color = _this.developers[_tableData[m][_this.dever] || _this.dever].color
                        for (let n = 0; n < _this.dateAr.length; n++) {
                            if (_index >= _tableData[m].min && _index < _tableData[m].max && _this.dateAr[n].weekend != 1) {
                                _tableData[m].dateAr.push(2)
                            } else {
                                if (_this.dateAr[n].weekend == 1) {
                                    _tableData[m].dateAr.push(1)
                                } else {
                                    _tableData[m].dateAr.push(0)
                                }
                            }
                            if (_this.dateAr[n].weekend != 1) {
                                _index++
                            }
                            for (let j = 0; j < _tableData[m].devlog.length; j++) {
                                if (Date.parse(_tableData[m].devlog[j]) == Date.parse(_this.startTime) + 86400000 * n) {
                                    _tableData[m].dateAr[_tableData[m].dateAr.length - 1] = _tableData[m].dateAr[_tableData[m].dateAr.length - 1] == 2 ? 4 : 3
                                    break
                                }
                            }
                        }
                    }
                    // 计算剩余天数
                    for (let m = 0; m < _tableData.length; m++) {
                        let _obj = _this.developers[_tableData[m][_this.dever] || _this.dever]
                        _obj.剩余天数 = _obj.剩余天数 || 0
                        if (_tableData[m].进度 != 100 && (_tableData[m].延期天数 || 0) > 0) {
                            _obj.剩余天数 += 1
                        } else {
                            let _usedTime = 0
                            for (let i = 0; i < _tableData[m].devlog.length; i++) {
                                var _repeat = 0
                                for (let j = 0; j < _this.devlogDays.length; j++) {
                                    if (Date.parse(_tableData[m].devlog[i]) == Date.parse(_this.devlogDays[j])) {
                                        _repeat++
                                    }
                                }
                                if (_repeat > 0) {
                                    _usedTime += Math.floor(1000 / _repeat)
                                }
                            }
                            _obj.剩余天数 += _tableData[m].进度 != 100 ? ((_tableData[m].评估天数 || 0) - (_usedTime / 1000)) : 0
                        }
                    }
                    // 推算出完成日期
                    let _finishTime = 0
                    for (let _dev in _this.developers) {
                        _finishTime = Math.max(_this.developers[_dev].剩余天数, _finishTime)
                    }
                    var _curTime = new Date().format('yyyy/MM/dd')
                    var _delayWork = 1
                    for (let j = 0; j < _this.devlogDays.length; j++) {
                        if (Date.parse(_curTime) == Date.parse(_this.devlogDays[j])) {
                            _delayWork = 0
                            break
                        }
                    }
                    let _date = new Date(Date.parse(_curTime) + 86400000 * _delayWork).format('yyyy/MM/dd')
                    _this.finishDateAr = _this.getTotalTime(Math.ceil(_finishTime), 0, _date)
                    // eslint-disable-next-line
                    console.log(_xlsxData)
                    _this.tableData = _tableData
                }
            }

            reader.readAsArrayBuffer(file)
        },
        sheetStyle (__v, __c) {
            __v = __v.toString()
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
            var _sheetFields = _this.xlsxFields.map(v => ({ name: v, value: 0 })).concat(_this.dateAr.map(v => ({ name: v.date, value: v.weekend })))
            var _sheetData = {}
            var _endCellName = 'A1'
            for (let m = 0; m < _sheetFields.length; m++) {
                let _cellName = m > 25 ? _this.getCharCol(m) : String.fromCharCode(65 + m)
                _sheetData[_cellName + 1] = _this.sheetStyle(_sheetFields[m].name, _sheetFields[m].value == 1 ? '#CCCCCC' : '')
                _sheetData[_cellName + (_this.tableData.length + 2)] = _this.sheetStyle('', '#000000')
                _endCellName = _cellName + (_this.tableData.length + 2)
                for (let n = 0; n < _this.remarks.length; n++) {
                    _sheetData[_cellName + (_this.tableData.length + 3 + n)] = _this.sheetStyle(m == 0 ? this.remarks[n].trim() : '')
                    _endCellName = _cellName + (_this.tableData.length + 3 + n)
                    if (m == 0) {
                        _merges.push(
                            {
                                s: { c: 0, r: (_this.tableData.length + 3 + n) - 1 },
                                e: { c: _this.xlsxFields.length - 1, r: (_this.tableData.length + 3 + n) - 1 }
                            }
                        )
                    }
                }
            }
            for (let m = 0; m < _this.tableData.length; m++) {
                for (let n = 0; n < _sheetFields.length; n++) {
                    var _cellName = n > 25 ? _this.getCharCol(n) : String.fromCharCode(65 + n)
                    if (n < _this.xlsxFields.length) {
                        _sheetData[_cellName + (m + 2)] = _this.sheetStyle(_this.tableData[m][_this.xlsxFields[n]])
                    } else {
                        let _weekend = _this.tableData[m].dateAr[n - _this.xlsxFields.length]
                        var _color = ''
                        if (_this.tableData[m][_this.dever] != '' && _weekend == 2) {
                            _color = _this.tableData[m].color
                        } else if (_weekend == 1) {
                            _color = '#CCCCCC'
                        } else if (_weekend == 3) {
                            _color = _this.colorRgb(_this.tableData[m].color)
                        } else if (_weekend == 4) {
                            _color = _this.colorRgb(_this.tableData[m].color, 0.7)
                        } else {
                            _color = ''
                        }
                        _sheetData[_cellName + (m + 2)] = _this.sheetStyle('', _color)
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
            // eslint-disable-next-line
            console.log(_tmpWB)
            var _tmpDown = new Blob([this.s2ab(XLSX.write(_tmpWB, { bookType: this.suffix, bookSST: false, type: 'binary' }))], { type: '' })
            this.saveAs(_tmpDown)
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
        }
    },
    mounted () {
        var _this = this
        _this.fileName = '排期示例_' + (new Date().format())
        // eslint-disable-next-line
        _this.startTime = _this.fileName.split('_')[1].replace(/\-/g, '/')
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
