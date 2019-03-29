<template>
    <div class="page">
        <div style="margin-bottom: 20px;">
            <input type="file" multiple="false" id="sheetjs-input" accept=".xlsx,.xls" @change="onchange($event)" />
            <button type="button" v-if="list.length" @click="downloadExl">导出XLSX</button>
        </div>
        <p>项目：大数据分析&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工时：{{developersDays}}天/人</p>
        <p>开始日期：{{dateAr.length ? dateAr[0].date : ''}}</p>
        <p>结束日期：{{dateAr.length ? dateAr[dateAr.length - 1].date : ''}}</p>
        <p style="margin-bottom: 20px;">开发人员：{{developersList}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最少：{{devDays.min}}天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最多：{{devDays.max}}天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开发时间(包括周末)：{{dateAr.length}}天</p>
        <el-table :data="list" border style="width: 100%" height="480" :cell-style="getCellStyle">
            <el-table-column fixed :prop="item" :label="item" v-for="(item,idx) in fields" :key="item + idx">
            </el-table-column>
            <el-table-column :class-name="item.weekend ? 'gray' : ''" :label="item.date" v-for="(item,idx) in dateAr" :key="idx" width="100">
            </el-table-column>
        </el-table>
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
            list: [],
            xlsxData: [],
            fields: [],
            fileName: '',
            suffix: 'xlsx',
            startTime: ''
        }
    },
    computed: {
        developersList () {
            var _ar = []
            for (var dev in this.developers) {
                _ar.push(dev)
            }
            return _ar.toString()
        },
        developersDays () {
            var _days = 0
            for (var dev in this.developers) {
                _days += parseInt(this.developers[dev].time * 10)
            }
            return _days / 10
        },
        devDays () {
            var _min = 10000000
            var _max = 0
            for (var dev in this.developers) {
                _min = Math.min(this.developers[dev].time, _min)
                _max = Math.max(this.developers[dev].time, _max)
            }
            return {
                max: _max,
                min: _min
            }
        }
    },
    methods: {
        getCellStyle (__obj) {
            return __obj.columnIndex > (this.fields.length - 1) && __obj.row.dateAr[__obj.columnIndex - this.fields.length] ? 'background-color:' + __obj.row.color : ''
        },
        getTotalTime (__time) {
            var _time = 0
            var _totalTime = 0
            var _ar = []
            while (_time < Math.ceil(__time)) {
                var _date = new Date(Date.parse(this.startTime) + 86400000 * _totalTime)
                if (_date.getDay() != 0 && _date.getDay() != 6) {
                    _time++
                }
                _totalTime++
                var _obj = {
                    date: _date.format('MM月dd日'),
                    weekend: _date.getDay() != 0 && _date.getDay() != 6 ? 0 : 1
                }
                _ar.push(_obj)
            }

            return _ar
        },
        onchange (evt) {
            var _this = this
            var files = evt.target.files

            if (!files || files.length == 0) return

            var file = files[0]
            _this.fileName = file.name.replace('.' + _this.suffix, '')
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
                var _xlsxData = []
                for (var m = 0; m < _sheet.length; m++) {
                    if (_sheet[m].join('').toString().trim() === '') {
                        _xlsxData = _sheet.splice(m + 1, _sheet.length)
                        break
                    }
                }
                // new Date(Date.parse("2007年11月11日".replace('年','-').replace('月','-').replace('日','')))
                _this.xlsxData = _xlsxData
                if (_xlsxData.length) {
                    var _fields = []
                    for (let m = 0; m < _xlsxData[0].length; m++) {
                        if (typeof (_xlsxData[0][m]) == 'number') {
                            break
                        } else {
                            _fields.push(_xlsxData[0][m])
                        }
                    }
                    _this.fields = _fields
                    var _list = []
                    for (let m = 1; m < _xlsxData.length; m++) {
                        let _obj = {}
                        for (let n = 0; n < _fields.length; n++) {
                            if (n < _xlsxData[m].length) {
                                _obj[_fields[n]] = _xlsxData[m][n] || ''
                            } else {
                                _obj[_fields[n]] = ''
                            }
                        }
                        _list.push(_obj)
                    }
                    _this.developers = {}
                    for (let i = 0; i < _list.length; i++) {
                        let _obj = _this.developers[_list[i].开发人员] || {}
                        _obj.time = _obj.time || 0
                        _list[i].min = parseInt(_obj.time)
                        _obj.time += parseFloat(_list[i].评估天数 || 0) + parseFloat(_list[i].延期天数 || 0)
                        _list[i].max = Math.ceil(_obj.time)
                        _this.developers[_list[i].开发人员] = _obj
                    }
                    var _totalTime = 0
                    var _cIndex = 0
                    for (var _dev in _this.developers) {
                        _totalTime = Math.max(_this.developers[_dev].time, _totalTime)
                        _this.developers[_dev].color = _this.colors[Math.floor(_cIndex % _this.colors.length)]
                        _cIndex++
                    }
                    _this.dateAr = _this.getTotalTime(_totalTime)
                    for (let m = 0; m < _list.length; m++) {
                        _list[m].dateAr = []
                        let _index = 0
                        _list[m].color = _this.developers[_list[m].开发人员].color
                        for (let n = 0; n < _this.dateAr.length; n++) {
                            if (_index >= _list[m].min && _index < _list[m].max && _this.dateAr[n].weekend != 1) {
                                _list[m].dateAr.push(1)
                            } else {
                                _list[m].dateAr.push(0)
                            }
                            if (_this.dateAr[n].weekend != 1) {
                                _index++
                            }
                        }
                    }
                    _this.list = _list
                    // eslint-disable-next-line
                    console.log(_sheet)
                }
            }

            reader.readAsArrayBuffer(file)
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
            let _sheetHeader = []
            for (let m = 0; m < this.xlsxData[0].length; m++) {
                if (typeof (this.xlsxData[0][m]) == 'number') {
                    break
                } else {
                    _sheetHeader.push(this.xlsxData[0][m])
                }
            }
            var _obj = {}
            for (let m = 0; m < _sheetHeader.length; m++) {
                _obj[String.fromCharCode(65 + m) + 1] = {
                    v: _sheetHeader[m],
                    c: [
                        {
                            a: 'dd',
                            t: 'This comment is visible',
                            v: 'ddd'
                        }
                    ]
                }
            }
            for (let m = 0; m < this.dateAr.length; m++) {
                if (this.dateAr[m].weekend == 1) {
                    _obj[String.fromCharCode(65 + _sheetHeader.length + m) + 1] = {
                        v: this.dateAr[m].date,
                        s: {
                            fill: {
                                fgColor: {
                                    rgb: 'CCCCCC'
                                }
                            }
                        }
                    }
                } else {
                    _obj[String.fromCharCode(65 + _sheetHeader.length + m) + 1] = {
                        v: this.dateAr[m].date
                    }
                }
            }
            for (let m = 0; m < this.list.length; m++) {
                for (let n = 0; n < _sheetHeader.length; n++) {
                    _obj[String.fromCharCode(65 + n) + (m + 2)] = {
                        t: 'n',
                        v: this.list[m][_sheetHeader[n]]
                    }
                }
                for (let n = 0; n < this.list[m].dateAr.length; n++) {
                    if (this.list[m].dateAr[n] == 1 || this.dateAr[n].weekend == 1) {
                        _obj[String.fromCharCode(65 + _sheetHeader.length + n) + (m + 2)] = {
                            v: '',
                            s: {
                                fill: {
                                    fgColor: {
                                        rgb: this.dateAr[n].weekend == 1 ? 'CCCCCC' : this.list[m].color.replace('#', '')
                                    }
                                }
                            }
                        }
                    } else {
                        _obj[String.fromCharCode(65 + _sheetHeader.length + n) + (m + 2)] = {
                            v: ''
                        }
                    }
                }
            }
            var _outputPos = Object.keys(_obj)
            var _tmpWB = {
                SheetNames: ['排期'], // 保存的表标题
                Sheets: {
                    '排期': Object.assign({},
                        _obj, // 内容
                        {
                            '!ref': _outputPos[0] + ':' + _outputPos[_outputPos.length - 1] // 设置填充区域
                        })
                }
            }
            // eslint-disable-next-line
            console.log(_obj)
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
    }
}

</script>

<style scoped lang="scss">
.page /deep/ {
    .gray {
        background-color: #ccc;
    }
}
</style>
