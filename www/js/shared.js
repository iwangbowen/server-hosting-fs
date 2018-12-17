function generateOptions(el, response) {
    var value = $(el).attr('data-value-mapping') || 'value';
    var text = $(el).attr('data-text-mapping') || 'text';
    response.forEach(function (option) {
        $('<option></option>')
            .val(option[value])
            .text(option[text])
            .appendTo($(el));
    });
}
[].slice.call($('body').find('[data-auto-select-id]'))
    .filter(function (el) {
        return $(el).attr('data-url');
    }).forEach(function (el) {
        var data = {
            owner: 'Common',
            queryId: 'findIdType',
            version: '10001',
            paramSource: null
        };
        $.ajax({
            url: config.fundodooApiDomainUrl + $(el).attr('data-url'),
            dataType: 'json',
            method: 'POST',
            data: data,
            async: true,
            success: function (response) {
                generateOptions(el, response.data);
            }
        });
    });

function onFileInputChange() {
    var formData = new FormData();
    formData.append(this.name, this.files[0]);
    $.ajax({
        url: config.fundodooApiDomainUrl + $(this).attr('data-url'),
        dataType: 'json',
        contentType: false,
        method : 'POST',
        async: true,
        processData: false,
        traditional: true,
        data: formData,
        fundodooAjax: true, //true:开启计时功能，false（或去掉此属性）：不开启计时功能
        success: function (response, status, xhr) {
            layer.alert('文件上传成功', {
                icon: 1,
                shadeClose: true,
                title: '提示'
            });
        }
    });
}

$('form.form-box').find('input[type=file][data-url]').on('change', onFileInputChange);
function submitForm(form, url, successCb, errorCb) {
    var valid = true;
    form.find('input[required], select[required], textarea[required]')
        .each(function () {
            if (!this.value) {
                valid = false;
                layer.alert(this.name + '输入不能为空', {
                    icon: 2,
                    shadeClose: true,
                    title: '提示'
                });
                return false;
            }
        });
    if (valid) {
        var formData = new FormData();
        var data = form.serializeJSON();
        data.tok = sessionStorage.getItem('FUNDODOO_TOKEN');
        $.each($('input[type=file]'), function (i, element) {
            formData.append(element.name, element.files[0]);
        });
        Object.keys(data).forEach(function (value) {
            formData.append(value, data[value]);
        });
        var containsFileInput = form.find('input[type=file]').length > 0;
        $.ajax({
            url: config.fundodooApiDomainUrl + url,
            dataType: 'json',
            contentType: containsFileInput ? false : 'application/x-www-form-urlencoded',
            method : 'POST',
            async: true,
            processData: !containsFileInput,
            traditional: true,
            data: containsFileInput ? formData : data,
            fundodooAjax: true, //true:开启计时功能，false（或去掉此属性）：不开启计时功能
            success: successCb,
            error: errorCb
        });
    }
}

function popupAdd() {
    layer.open({
        type: 1,
        title: '新增',
        area: ['600px', '350px'],
        skin: 'layui-layer-rim', //加上边框
        content: $('div.popup-window#add'),
        end: function end() {
            $('div.popup-window#add form').trigger('reset');
        }
    });
}
function popupEdit() {
    var openPopup = function openPopup() {
        layer.open({
            type: 1,
            title: '修改',
            area: ['600px', '350px'],
            skin: 'layui-layer-rim', //加上边框
            content: $('div.popup-window#edit'),
            end: function end() {
                $('div.popup-window#edit form').trigger('reset');
            }
        });
    };
    var setFormValues = function setFormValues(selectedRow) {
        $('div.popup-window#edit form').find('input:not([type=submit]), select').each(function () {
            var field = $(this).attr('data-row-field') || $(this).attr('name');
            $(this).val(selectedRow[field]);
        });
    };
    if (grids.length) {
        var selectedRows = grids[0].gridOptions.api.getSelectedRows();
        if (selectedRows.length == 0) {
            layer.msg('请选择需要修改的数据', { icon: 5 });
        } else if (selectedRows.length > 1) {
            layer.msg('只允许同时修改一条数据', { icon: 5 });
        } else {
            setFormValues(selectedRows[0]);
            openPopup();
        }
    } else {
        layer.msg('请选择需要修改的数据', { icon: 5 });
    }
}
function popupDelete() {
    var openPopup = function openPopup() {
        layer.confirm('您确定需要删除吗？', {
            btn: ['确定', '取消']
        }, function () {
            $.ajax({
                url: config.fundodooApiDomainUrl + $('button#delete').attr('data-url'),
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                method: 'POST',
                async: true,
                traditional: true,
                data: grids[0].gridOptions.api.getSelectedRows(),
                fundodooAjax: true, //true:开启计时功能，false（或去掉此属性）：不开启计时功能
                success: function success() {
                    layer.closeAll();
                    query();
                },
                error: function error() {}
            });
        }, function () {});
    };
    if (grids.length) {
        var selectedRows = grids[0].gridOptions.api.getSelectedRows();
        if (selectedRows.length == 0) {
            layer.msg('请选择需要删除的数据', { icon: 5 });
        } else {
            openPopup();
        }
    } else {
        layer.msg('请选择需要删除的数据', { icon: 5 });
    }
}
function popupDetail(url, data, popup) {
    // Compatible with previous only one detail popup window
    var content = popup && popup.length ? popup : $('div.popup-window#detail');
    var openPopup = function openPopup() {
        layer.open({
            type: 1,
            title: '信息',
            area: ['660px', '330px'],
            skin: 'layui-layer-rim', //加上边框
            content: content,
            end: function end() {}
        });
    };
    if (content.length) {
        if (url && data) {
            $.ajax({
                url: config.fundodooApiDomainUrl + url,
                dataType: 'json',
                contentType: 'application/x-www-form-urlencoded',
                method: 'POST',
                async: true,
                traditional: true,
                data: data,
                fundodooAjax: true, //true:开启计时功能，false（或去掉此属性）：不开启计时功能
                success: function success(response) {
                    content.find('[data-component-id="html/labelfield@common"]').each(function (_, element) {
                        var key = $(element).children('span:last-child').attr('data-key-mapping');
                        $(element).children('span:last-child').text(key ? response.data[key] || '' : '');
                    });
                    content.find('img').each(function (_, image) {
                        var $image = $(image);
                        var data = response.data[$image.attr('data-key-mapping')];
                        if (data) {
                            $image.attr('src', 'data:image/' + $image.attr('data-image-format') + ';base64,' + data);
                        } else {
                            $image.attr('src', $image.attr('data-image-placeholder'));
                        }
                    });
                    openPopup();
                },
                error: function error() {}
            });
        } else {
            openPopup();
        }
    }
}
function exportData() {
    if (grids.length) {
        grids[0].gridOptions.api.exportDataAsCsv();
    }
}
function popupFormSubmitCallback() {
    submitForm($(this).parents('form'),
        $('button#' + $(this).parents('form').attr('data-related-button')).attr('data-url'),
        function (response) {
            layer.closeAll();
            query();
        },
        function () {
        });
}
$('form.popup-form input[type=submit]').on('click', popupFormSubmitCallback);

function setAgGridData(grid, data) {
    var gridOptions = grid.gridOptions;
    var transposeKey = grid.transposeKey;
    var populateHeaders = grid.populateHeaders;
    var autoSizeColumns = grid.autoSizeColumns;
    if (populateHeaders) {
        if (data.length) {
            var colDefs = Object.keys(data[0]).map(function (key) {
                return {
                    headerName: key,
                    field: key
                };
            });
            gridOptions.api.setColumnDefs(colDefs);
            gridOptions.api.setRowData(data);
        }
    } else {
        if (transposeKey) {
            var transposedData = gridOptions.columnDefs
                .filter(function (colDef) {
                    return colDef.field !== transposeKey;
                })
                .map(function (colDef) {
                    var key = colDef.field;
                    var transposed = {};
                    transposed[transposeKey] = colDef.headerName;
                    data.forEach(function (item) {
                        transposed[item[transposeKey]] = item[key];
                    });
                    return transposed;
                });
            var newColDefs = [
                {
                    headerName: '',
                    field: transposeKey,
                    cellStyle: {
                        'font-size': 'large'
                    },
                    pinned: 'left'
                }
            ].concat(data.map(function (item) {
                return {
                    headerName: item[transposeKey],
                    field: $.isNumeric(item[transposeKey])
                        ? item[transposeKey].toString()
                        : item[transposeKey]
                };
            }));
            gridOptions.api.setColumnDefs(newColDefs);
            gridOptions.api.setRowData(transposedData);
        } else {
            gridOptions.api.setRowData(data);
        }
    }
    if (autoSizeColumns) {
        var allColumnIds = [];
        gridOptions.columnApi.getAllColumns().forEach(function(column) {
            allColumnIds.push(column.colId);
        });
        gridOptions.columnApi.autoSizeColumns(allColumnIds);
    }
}
function query() {
    var queryForm = $(this).parents('form');
    var queryUrl = $(this).attr('data-url');
    submitForm(queryForm, queryUrl,
        function (response) {
            if (Array.isArray(response.data)) {
                if (grids.length) {
                    var grid = grids[0];
                    setAgGridData(grids[0], response.data);
                }
            } else {
                $.each(response.data, function (key, value) {
                    $.each(grids, function (i, grid) {
                        if (grid.key == key) {
                            setAgGridData(grid, value);
                            return false;
                        }
                    });
                });
            }
        },
        function () {
        });
}
$('form button#dataSearch').on('click', query);
$('div.gridster div form button[data-enable-button-click-popup!=true]').on('click', query);

function processResults (res, el) {
    var value = $(el).attr('data-value-mapping') || 'value';
    var text = $(el).attr('data-text-mapping') || 'text';
    return {
        data: res.data.map(function (v) {
            return {
                id: v[value],
                text: v[text]
            };
        })
    };
}
$(document).ready(function () {
    $('.js-example-basic-multiple').each(function () {
        var self = this;
        if ($(self).attr('data-url')) {
            $.ajax({
                url: config.fundodooApiDomainUrl + $(self).attr('data-url'),
                dataType: 'json',
                success: function (res) {
                    $(self).select2(processResults(res, self));
                }
            });
        } else {
            $(self).select2();
        }
    });
});

function buttonClickedPopupCallback() {
    if ($(this).attr('data-enable-button-click-popup') === 'true') {
        popupDetail(null, null, $('#' + 'button_clicked_popup' + $(this).attr('data-button-key')));
    }
}
$('body').on('click', 'button', buttonClickedPopupCallback);

$(function () {
    $('input, select, textarea').tooltip({"position":{"my":"left top","at":"right+5 top-5","collision":"none"}});
});

$('[data-component-id="html/tabs@common"]').tabs();