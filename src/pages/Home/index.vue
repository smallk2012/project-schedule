<template>
    <div class="page">
        <div style="margin-bottom: 20px;">
            <input type="file" multiple="false" id="sheetjs-input" accept=".xlsx,.xls" @change="onchange($event)" />
            <button type="button" v-if="list.length" @click="onexport">导出XLSX</button>
        </div>
        <p>项目：大数据分析&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工时：{{developersDays}}天/人</p>
        <p>开始日期：{{dateAr.length ? dateAr[0].date : ''}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束日期：{{dateAr.length ? dateAr[dateAr.length - 1].date : ''}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开发时间(包括周末)：{{dateAr.length}}天</p>
        <p style="margin-bottom: 20px;">开发人员：{{developersList}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最少：{{devDays.min}}天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最多：{{devDays.max}}天</p>
        <el-table :data="list" border style="width: 100%" height="480" :cell-style="getCellStyle">
            <el-table-column fixed prop="页面1" :label="item" v-for="(item,idx) in fields" :key="item + idx">
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
            fields: []
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
            return __obj.columnIndex > 6 && __obj.row.dateAr[__obj.columnIndex - 7] ? 'background-color:' + __obj.row.color : ''
        },
        getTotalTime (__time) {
            var _time = 0
            var _totalTime = 0
            var _ar = []
            while (_time < Math.ceil(__time)) {
                var _date = new Date(Date.now() + 86400000 * _totalTime)
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

                var _sheet = XLSX.utils.sheet_to_json(ws, { header: 1 })
                var _xlsxData = []
                for (var m = 0; m < _sheet.length; m++) {
                    if (_sheet[m].join('').toString().trim() === '') {
                        _xlsxData = _sheet.splice(m + 1, _sheet.length)
                        break
                    }
                }
                _this.xlsxData = _xlsxData
                // eslint-disable-next-line
                console.log(ws)
                // eslint-disable-next-line
                console.log(_xlsxData)
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
                    // eslint-disable-next-line
                    console.log(_list)
                    _this.list = _list

                    _this.developers = {}
                    for (let i = 0; i < _list.length; i++) {
                        let _obj = _this.developers[_list[i].开发人员] || {}
                        _obj.time = _obj.time || 0
                        _list[i].min = parseInt(_obj.time)
                        _obj.time += parseFloat(_list[i].评估天数) + parseFloat(_list[i].延期天数)
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
                }
            }

            reader.readAsArrayBuffer(file)
        },
        onexport (evt) {
            // generate workbook object from table
            var wb = XLSX.utils.table_to_book(document.getElementById('out-table'))
            // generate file and force a download
            XLSX.writeFile(wb, 'sheetjs.xlsx')
            // 下载功能
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
