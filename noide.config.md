# 程序启动及配置参数说明

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
