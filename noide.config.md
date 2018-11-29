# 程序启动及配置参数说明

## 压缩文件说明

noide.zip压缩文件中包含www文件夹和noide.bin.zip压缩文件。www文件夹包含依赖的外部脚本和样式文件，可以根据需要解压到对应的项目路径。noide.bin.zip压缩文件中包含程序、配置文件、配置文件说明和启动以及关闭脚本文件。程序启动时，文件树中显示的是程序所在路径中的文件目录。建议解压到www/html/demo路径。

## 程序启动

双击noide.exe启动，程序窗口前置，可以通过右上角❌关闭程序。
双击startup.bat隐藏程序窗口启动，双击shutdown.bat关闭程序。

## noide.config.json配置参数说明

### builderUrl

类型: `string`

说明：默认值为[测试版地址](http://10.108.7.58/editor.html)，不需要修改。测试地址仍然可以单独使用。

### autoOpenBrowser

类型： `boolean`

说明：启动程序后，是否自动打开默认浏览器，默认值为true。

### browser

类型： `string`

说明：自动启动时打开的浏览器，去掉browser键值对或填写default，
打开系统默认浏览器。可选值：default、chrome、microsoft-edge、iexplore或firefox。

### ignoredDirs

类型：`string[]`

说明：程序文件树不显示和不监控变化的文件夹。例如：["node_modules", "libs"]。

### ignoredFiles

类型：`string[]`

说明：程序文件树不显示和不监控变化的文件。例如：[".project", ".gitignore", "config.ini"]。

### 后期可能添加更多配置参数。
