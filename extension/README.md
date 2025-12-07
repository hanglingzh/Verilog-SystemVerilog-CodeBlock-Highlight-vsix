# SystemVerilog/Verilog Block Highlight

一个用于 SystemVerilog/Verilog 代码的 VSCode 扩展，可以高亮显示代码块并标记其边界。

## 功能特性

- 🎨 自定义代码块高亮颜色
- 🏷️ 自定义代码块开始和结束标记
- 📐 可视化显示代码块边界
- ⚡ 快速插入代码块标记
- 🎯 光标位于代码块内时，高亮显示整个代码块

## 使用方法

### 基本用法

在代码中使用自定义的开始和结束标记（默认为 `>>` 和 `<<`）来标记代码块：

```systemverilog
// >> 功能模块A
module module_a (
    input clk,
    input reset,
    output reg out
);
    always @(posedge clk) begin
        if (reset) begin
            out <= 0;
        end else begin
            out <= 1;
        end
    end
endmodule
// << 功能模块A
```

### 快速插入代码块

- 使用快捷键 `Ctrl+Shift+B`（Windows/Linux）或 `Cmd+Shift+B`（Mac）
- 或者输入 `//%` 触发自动补全

## 自定义配置

你可以通过 VSCode 设置自定义以下选项：

1. **活动代码块背景颜色**
   ```json
   "codeBlockHighlighter.activeBlockBackground": "rgba(200,200,255,0.12)"
   ```

2. **活动代码块边界颜色**
   ```json
   "codeBlockHighlighter.activeBlockBorderColor": "rgba(100,100,255,0.8)"
   ```

3. **静态代码块边界颜色**
   ```json
   "codeBlockHighlighter.inactiveBlockBorderColor": "rgba(200,200,255,0.6)"
   ```

4. **代码块开始标记**
   ```json
   "codeBlockHighlighter.startMarker": ">>"
   ```

5. **代码块结束标记**
   ```json
   "codeBlockHighlighter.endMarker": "<<"
   ```

## 支持的语言

- SystemVerilog
- Verilog
- VHDL

## 安装

1. 打开 VSCode
2. 按 `Ctrl+Shift+X` 打开扩展面板
3. 搜索 "SystemVerilog Block Highlight"
4. 点击安装

## 更新日志

### v0.1.1
- 添加自定义开始和结束标记功能
- 添加静态边界标记颜色自定义功能
- 优化代码块识别逻辑

### v0.1.0
- 初始版本发布
- 基本代码块高亮功能
- 边界标记显示

## 反馈与建议

如果你有任何问题或建议，欢迎通过以下方式联系：

- 在 [GitHub](https://github.com/hanglingzh/Verilog-SystemVerilog-CodeBlock-Highlight-vsix) 上提交 Issue
- 发送邮件至 hangling.zh@gmail.com

## License
