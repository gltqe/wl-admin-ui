import {ElMessage} from "element-plus";
import {useDictStore} from "@/stores/modules/dict.js";
import {getDict} from "@/api/system/dict.js";
import {ref, toRefs} from "vue";

export function handleResult(res) {
    if (res.data.code === 200) {
        ElMessage.success(res.data.msg)
    } else {
        ElMessage.error(res.data.msg)
    }
}

export function handleExportResult(res) {
    const contentType = res.headers['content-type']
    if (contentType && contentType.includes('application/json')) {
        const reader = new FileReader();
        reader.onload = function (event) {
            try {
                if (typeof event.target.result === 'string') {
                    const jsonData = JSON.parse(event.target.result);
                    ElMessage.error(jsonData.msg); // 假设 JSON 对象中有一个 msg 属性
                } else {
                    console.error('数据类型异常:', typeof event.target.result);
                }
            } catch (error) {
                console.error('json解析异常:', error);
            }
        };
        // 读取 Blob 作为文本
        reader.readAsText(res.data);
    } else {
        const blob = new Blob([res.data])
        const downloadElement = document.createElement('a')
        // 创建下载链接
        const href = window.URL.createObjectURL(blob)
        downloadElement.href = href
        const fileNameCode = res.headers['content-disposition'].split('filename=')[1]
        // 下载后文件名
        downloadElement.download = decodeURIComponent(fileNameCode)
        document.body.appendChild(downloadElement)
        // 点击下载
        downloadElement.click()
        document.body.removeChild(downloadElement)
        window.URL.revokeObjectURL(href)
    }
}

// 获取行 指定字段
export function getTableRadioParam(row, list, name) {
    if (row && row[name]) {
        return row[name]
    }
    if (list && list.length > 0) {
        return list[0][name]
    }
}

// 获取多行 指定字段 (有单行的只返回单行的指定字段)
export function getCheckboxParam(row, list, name) {
    let r = []
    if (row && row[name]) {
        r.push(row[name])
        return r
    }
    if (list && list.length > 0) {
        list.forEach(item => {
            r.push(item[name])
        })
        return r
    }
}

// object转FormData
export function objectToFormData(obj, formData) {
    for (const [key, value] of Object.entries(obj)) {
        formData.append(key, value);
    }
}

// 获取指定字典的 键值对map
export function getDictMap(...dictCodeList) {
    const result = ref({});
    return (() => {
        dictCodeList.forEach((item, index) => {
            let itemKey = item + "_map"
            result.value[item] = [];
            const dict = useDictStore().getCache(itemKey);
            if (dict) {
                result.value[item] = dict;
            } else {
                getDict({code: item, type: 1}).then(res => {
                    result.value[item] = res.data.data.map
                    useDictStore().addCache(itemKey, res.data.data.map)
                })
            }
        })
        return toRefs(result.value);
    })()
}

// 获取时间范围
export function getDateTimeOfRange(obj) {
    let range = obj.rangeDateTime
    if (range && range instanceof Array && range.length === 2) {
        obj.startDateTime = range[0]
        obj.endDateTime = range[1]
    } else {
        obj.startDateTime = null
        obj.endDateTime = null
    }
}

// 不是null添加进formData
export function isNotNullAppend(formData, key, value) {
    if (value && value !== null && value !== '') {
        formData.append(key, value)
    }
}
