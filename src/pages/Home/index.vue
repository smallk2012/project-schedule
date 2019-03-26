<template>
    <div class="page">
        <div>
            <input type="file" multiple="false" id="sheetjs-input" accept=".xlsx,.xlsb,.xlsm,.xls,.xml,.csv,.txt,.ods,.fods,.uos,.sylk,.dif,.dbf,.prn,.qpw,.123,.wb*,.wq*,.html,.htm" @change="onchange($event)" />
            <br/>
            <button type="button" id="export-table" style="visibility:hidden" @click="onexport">Export to XLSX</button>
            <br/>
            <div id="out-table"></div>
        </div>
        <p>项目：大数据分析&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工时：{{developersDays}}天/人</p>
        <p>开始日期：{{dateAr.length ? dateAr[0].date : ''}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;结束日期：{{dateAr.length ? dateAr[dateAr.length - 1].date : ''}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;开发时间(包括周末)：{{dateAr.length}}天</p>
        <p style="margin-bottom: 20px;">开发人员：{{developersList}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最少：{{devDays.min}}天&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;最多：{{devDays.max}}天</p>
        <el-table :data="list" border style="width: 100%" height="480" :cell-style="getCellStyle">
            <el-table-column fixed prop="page0" label="一级页面">
            </el-table-column>
            <el-table-column fixed prop="page1" label="二级页面">
            </el-table-column>
            <el-table-column fixed prop="page2" label="三级页面">
            </el-table-column>
            <el-table-column fixed prop="developer" label="开发人员">
            </el-table-column>
            <el-table-column fixed prop="assessmentDays" label="评估天数">
            </el-table-column>
            <el-table-column fixed prop="extensionDays" label="延期天数">
            </el-table-column>
            <el-table-column fixed prop="actualDays" label="实际天数">
            </el-table-column>
            <el-table-column :class-name="item.weekend ? 'gray' : ''" :label="item.date" v-for="(item,idx) in dateAr" :key="idx" width="100">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
    name: 'Home',
    data () {
        return {
            developers: {},
            colors: ['#7A24A6', '#001E64', '#0070C6', '#00B2F6', '#00B441', '#7ED432', '#FEFF00', '#FFBE00', '#FF0000', '#D20000'],
            dateAr: [],
            list: []
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
        },
        SheetJSFT () {
            return [
                'xlsx', 'xlsb', 'xlsm', 'xls', 'xml', 'csv', 'txt', 'ods', 'fods', 'uos', 'sylk', 'dif', 'dbf', 'prn', 'qpw', '123', 'wb*', 'wq*', 'html', 'htm'
            ].map(function (x) { return '.' + x }).join(',')
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
            var files = evt.target.files

            if (!files || files.length == 0) return

            var file = files[0]

            var reader = new FileReader()
            reader.onload = function (e) {
                // pre-process data
                var binary = ''
                var bytes = new Uint8Array(e.target.result)
                var length = bytes.byteLength
                for (var i = 0; i < length; i++) {
                    binary += String.fromCharCode(bytes[i])
                }

                // read workbook*/
                var wb = XLSX.read(binary, { type: 'binary' })

                // grab first sheet
                var wsname = wb.SheetNames[0]
                var ws = wb.Sheets[wsname]
                // eslint-disable-next-line
                console.log(ws)
                // generate HTML
                var HTML = XLSX.utils.sheet_to_html(ws)

                // update table
                document.getElementById('out-table').innerHTML = HTML
                // show export button
                document.getElementById('export-table').style.visibility = 'visible'
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
        var _list = []
        for (var m = 0; m < 5; m++) {
            let _obj = {
                page0: '一级' + m,
                page1: '二级' + m,
                page2: '三级' + m,
                developer: '陈承' + Math.floor(Math.random() * 6),
                assessmentDays: Math.floor(Math.random() * 5) + (Math.random() >= 0.5 ? 0 : 0.5),
                extensionDays: Math.floor(Math.random() * 3),
                actualDays: 0
            }
            _list.push(_obj)
        }
        this.developers = {}
        for (var i = 0; i < _list.length; i++) {
            let _obj = this.developers[_list[i].developer] || {}
            _obj.time = _obj.time || 0
            _list[i].min = parseInt(_obj.time)
            _obj.time += parseFloat(_list[i].assessmentDays) + parseFloat(_list[i].extensionDays)
            _list[i].max = Math.ceil(_obj.time)
            this.developers[_list[i].developer] = _obj
        }
        var _totalTime = 0
        var _cIndex = 0
        for (var _dev in this.developers) {
            _totalTime = Math.max(this.developers[_dev].time, _totalTime)
            this.developers[_dev].color = this.colors[Math.floor(_cIndex % this.colors.length)]
            _cIndex++
        }
        this.dateAr = this.getTotalTime(_totalTime)
        for (let m = 0; m < _list.length; m++) {
            _list[m].dateAr = []
            let _index = 0
            _list[m].color = this.developers[_list[m].developer].color
            for (let n = 0; n < this.dateAr.length; n++) {
                if (_index >= _list[m].min && _index < _list[m].max && this.dateAr[n].weekend != 1) {
                    _list[m].dateAr.push(1)
                } else {
                    _list[m].dateAr.push(0)
                }
                if (this.dateAr[n].weekend != 1) {
                    _index++
                }
            }
        }
        this.list = _list
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
