# SystemVerilog/Verilog Block Highlight

A VSCode extension for SystemVerilog/Verilog code that highlights code blocks and marks their boundaries.

## Features

- 🎨 Customize code block highlight colors
- 🏷️ Customizable start and end markers for code blocks
- 📐 Visual display of code block boundaries
- ⚡ Quick insertion of code block markers
- 🎯 Highlight entire code blocks when cursor is inside

## Usage

### Basic Usage

Use custom start and end markers (default: `>>` and `<<`) in your code to mark code blocks:

```systemverilog
// >> Module A
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
// << Module A
```

### Quick Insert Code Blocks

- Use shortcut `Ctrl+Shift+B` (Windows/Linux) or `Cmd+Shift+B` (Mac)
- Or type `//%` to trigger auto-completion

## Customization

You can customize the following options through VSCode settings:

1. **Active code block background color**
   ```json
   "codeBlockHighlighter.activeBlockBackground": "rgba(200,200,255,0.12)"
   ```

2. **Active code block border color**
   ```json
   "codeBlockHighlighter.activeBlockBorderColor": "rgba(100,100,255,0.8)"
   ```

3. **Inactive code block border color**
   ```json
   "codeBlockHighlighter.inactiveBlockBorderColor": "rgba(200,200,255,0.6)"
   ```

4. **Code block start marker**
   ```json
   "codeBlockHighlighter.startMarker": ">>"
   ```

5. **Code block end marker**
   ```json
   "codeBlockHighlighter.endMarker": "<<"
   ```

## Supported Languages

- SystemVerilog
- Verilog
- VHDL

## Installation

1. Open VSCode
2. Press `Ctrl+Shift+X` to open the Extensions panel
3. Search for "SystemVerilog Block Highlight"
4. Click Install

## Changelog

### v0.1.1
- Added customizable start and end markers
- Added customizable inactive boundary color
- Optimized code block recognition logic

### v0.1.0
- Initial release
- Basic code block highlighting
- Boundary markers display

## Feedback & Suggestions

If you have any questions or suggestions, please contact us:

- Submit an Issue on [GitHub](https://github.com/hanglingzh/Verilog-SystemVerilog-CodeBlock-Highlight-vsix)
- Send an email to hangling.zh@gmail.com

## License
