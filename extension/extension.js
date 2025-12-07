const vscode = require('vscode');

/**
 * 激活VSCode扩展的入口函数
 * @param {Object} context - 扩展上下文对象，用于管理订阅和资源
 */
function activate(context) {

    // 创建活动代码块的装饰类型，设置淡蓝色背景和整行显示
    // const activeDeco = vscode.window.createTextEditorDecorationType({
    //     backgroundColor: "rgba(200,200,255,0.12)",
    //     isWholeLine: true
    // });
    /**
     * 创建活动代码块的装饰类型
     * 该函数从VS Code工作区配置中获取活动代码块的背景颜色，并返回一个文本编辑器装饰类型
     * @returns {vscode.TextEditorDecorationType} 返回一个配置好的文本编辑器装饰类型对象
     */
    function createActiveDeco() {
        // 从VS Code工作区配置中获取'codeBlockHighlighter'部分的配置
        const config = vscode.workspace.getConfiguration('codeBlockHighlighter');
        // 获取活动代码块的背景颜色，如果未配置则使用默认值'rgba(200,200,255,0.12)'
        const backgroundColor = config.get('activeBlockBackground', 'rgba(200,200,255,0.12)');
        // 创建并返回一个文本编辑器装饰类型，配置为整行高亮显示
        return vscode.window.createTextEditorDecorationType({
            backgroundColor: backgroundColor, // 设置装饰的背景颜色
            isWholeLine: true // 设置装饰是否应用于整行
        });
    }

    // 初始创建装饰
    let activeDeco = createActiveDeco();

    /**
     * 获取代码块开始标记
     * @returns {string} 返回用户配置的开始标记，默认为">>"
     */
    function getStartMarker() {
        const config = vscode.workspace.getConfiguration('codeBlockHighlighter');
        return config.get('startMarker', '>>');
    }

    /**
     * 获取代码块结束标记
     * @returns {string} 返回用户配置的结束标记，默认为"<<"
     */
    function getEndMarker() {
        const config = vscode.workspace.getConfiguration('codeBlockHighlighter');
        return config.get('endMarker', '<<');
    }

    // 监听配置更改事件，当活动代码块背景颜色或边界颜色更改时，销毁并重新创建装饰
    context.subscriptions.push(vscode.workspace.onDidChangeConfiguration(e => {
        if (e.affectsConfiguration('codeBlockHighlighter.activeBlockBackground')) {
            // 销毁旧的装饰
            activeDeco.dispose();
            // 创建新的装饰
            activeDeco = createActiveDeco();
            // 更新所有可见编辑器
            vscode.window.visibleTextEditors.forEach(ed => updateEditor(ed));
        }
        if (e.affectsConfiguration('codeBlockHighlighter.activeBlockBorderColor')) {
            // 销毁旧的装饰
            activeBoundaryDeco.dispose();
            // 创建新的装饰
            activeBoundaryDeco = createActiveBoundaryDeco();
            // 更新所有可见编辑器
            vscode.window.visibleTextEditors.forEach(ed => updateEditor(ed));
        }
        if (e.affectsConfiguration('codeBlockHighlighter.startMarker') || e.affectsConfiguration('codeBlockHighlighter.endMarker')) {
            // 更新所有可见编辑器
            vscode.window.visibleTextEditors.forEach(ed => updateEditor(ed));
        }
        if (e.affectsConfiguration('codeBlockHighlighter.inactiveBlockBorderColor')) {
            // 销毁旧的装饰
            boundaryDeco.dispose();
            // 创建新的装饰
            boundaryDeco = createBoundaryDeco();
            // 更新所有可见编辑器
            vscode.window.visibleTextEditors.forEach(ed => updateEditor(ed));
        }
    }));

    // 静态边界装饰现在由createBoundaryDeco函数创建
    
    /**
     * 创建活动状态边界标记的装饰类型
     * 该函数从VS Code工作区配置中获取活动代码块的边界颜色，并返回一个文本编辑器装饰类型
     * @returns {vscode.TextEditorDecorationType} 返回一个配置好的文本编辑器装饰类型对象
     */
    function createActiveBoundaryDeco() {
        // 从VS Code工作区配置中获取'codeBlockHighlighter'部分的配置
        const config = vscode.workspace.getConfiguration('codeBlockHighlighter');
        // 获取活动代码块的边界颜色，如果未配置则使用默认值'rgba(100,100,255,0.8)'
        const borderColor = config.get('activeBlockBorderColor', 'rgba(100,100,255,0.8)');
        // 创建并返回一个文本编辑器装饰类型，配置为整行高亮显示，添加斜体样式
        return vscode.window.createTextEditorDecorationType({
            borderWidth: "1px 0 0 0",
            borderStyle: "solid",
            borderColor: borderColor,
            color: borderColor, // 设置文本颜色与边框颜色相同
            fontStyle: "italic", // 设置斜体样式
            isWholeLine: true
        });
    }
    
    // 初始创建活动边界装饰
    let activeBoundaryDeco = createActiveBoundaryDeco();

    /**
     * 创建静态状态边界标记的装饰类型
     * 该函数从VS Code工作区配置中获取静态代码块的边界颜色，并返回一个文本编辑器装饰类型
     * @returns {vscode.TextEditorDecorationType} 返回一个配置好的文本编辑器装饰类型对象
     */
    function createBoundaryDeco() {
        // 从VS Code工作区配置中获取'codeBlockHighlighter'部分的配置
        const config = vscode.workspace.getConfiguration('codeBlockHighlighter');
        // 获取静态代码块的边界颜色，如果未配置则使用默认值'rgba(200,200,255,0.6)'
        const borderColor = config.get('inactiveBlockBorderColor', 'rgba(200,200,255,0.6)');
        // 创建并返回一个文本编辑器装饰类型，配置为整行高亮显示，添加斜体样式
        return vscode.window.createTextEditorDecorationType({
            borderWidth: "1px 0 0 0",
            borderStyle: "solid",
            borderColor: borderColor,
            color: borderColor, // 设置文本颜色与边框颜色相同
            fontStyle: "italic", // 设置斜体样式
            isWholeLine: true
        });
    }

    // 初始创建静态边界装饰
    let boundaryDeco = createBoundaryDeco();

    // 将装饰类型添加到订阅列表，以便在扩展停用时正确释放资源
    context.subscriptions.push(activeDeco, boundaryDeco, activeBoundaryDeco);

    /**
     * 获取文档中的所有边界标记（自定义开始和结束标记）
     * @param {TextDocument} document - 要检查的文档对象
     * @returns {Range[]} 返回包含所有边界标记位置的数组
     */
    function getAllBoundaries(document) {
        const text = document.getText();
        const lines = text.split(/\r?\n/);
        const ranges = [];
        const startMarker = getStartMarker();
        const endMarker = getEndMarker();

        // 遍历文档的每一行
        for (let i = 0; i < lines.length; i++) {
            // 检查是否是开始标记
            const startRegex = new RegExp(`^\\s*//\\s*${escapeRegExp(startMarker)}`, 'i');
            if (startRegex.test(lines[i])) {
                ranges.push(new vscode.Range(i, 0, i, lines[i].length));
            }
            // 检查是否是结束标记
            const endRegex = new RegExp(`^\\s*//\\s*${escapeRegExp(endMarker)}`, 'i');
            if (endRegex.test(lines[i])) {
                ranges.push(new vscode.Range(i, 0, i, lines[i].length));
            }
        }
        return ranges;
    }

    /**
     * 转义正则表达式中的特殊字符
     * @param {string} string - 需要转义的字符串
     * @returns {string} 转义后的字符串
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function getActiveBlockRange(document, position) {
        const text = document.getText();
        const lines = text.split(/\r?\n/);
        const currentLine = position.line;
        const startMarker = getStartMarker();
        const endMarker = getEndMarker();
        
        // 查找当前位置之前的开始标记
        let start = currentLine;
        const startRegex = new RegExp(`^\\s*//\\s*${escapeRegExp(startMarker)}`, 'i');
        while (start >= 0 && !startRegex.test(lines[start])) start--;
        
        // 如果没找到开始标记，返回null
        if (start < 0) return null;
        
        // 从开始标记之后查找第一个结束标记
        let end = start + 1;
        const endRegex = new RegExp(`^\\s*//\\s*${escapeRegExp(endMarker)}`, 'i');
        while (end < lines.length && !endRegex.test(lines[end])) end++;

        // 如果没找到结束标记，返回null
        if (end >= lines.length) return null;
        
        // 检查当前位置是否在开始标记和结束标记之间
        if (currentLine >= start && currentLine <= end) {
            return new vscode.Range(
                new vscode.Position(start, 0),
                new vscode.Position(end, lines[end].length)
            );
        }
        return null;
    }

    /**
     * 更新编辑器的装饰效果
     * @param {Object} editor - 编辑器实例对象
     */
    /**
     * 更新编辑器的装饰和高亮显示
     * @param {Editor} editor - 编辑器实例对象
     */

    // 修改 updateEditor 函数中的边界装饰逻辑
    function updateEditor(editor) {
        if (!editor) return;

        const doc = editor.document;
        const pos = editor.selection.active;

        // 获取当前活动块的范围
        const active = getActiveBlockRange(doc, pos);
        
        // 获取所有边界
        const allBoundaries = getAllBoundaries(doc);
        
        // 清除所有装饰
        editor.setDecorations(boundaryDeco, []);
        editor.setDecorations(activeBoundaryDeco, []);
        
        // 活动状态下，活动块边界使用活动颜色，其他块边界使用默认颜色
        if (active) {
            const activeBoundaries = allBoundaries.filter(range => 
                range.start.line >= active.start.line && 
                range.start.line <= active.end.line
            );
            const inactiveBoundaries = allBoundaries.filter(range =>
                range.start.line < active.start.line ||
                range.start.line > active.end.line
            );
            
            // 为活动代码块的起始和结束标记行创建范围装饰
            const activeBlockLines = [];
            try {
                // 获取起始行和结束行的文本长度，创建整行范围
                const startLineText = doc.lineAt(active.start.line).text;
                const endLineText = doc.lineAt(active.end.line).text;
                // 添加起始行
                activeBlockLines.push(new vscode.Range(active.start.line, 0, active.start.line, startLineText.length));
                // 添加结束行
                activeBlockLines.push(new vscode.Range(active.end.line, 0, active.end.line, endLineText.length));
            } catch (error) {
                console.error('Error creating active block line decorations:', error);
            }
            
            // 合并活动边界标记和活动块起始/结束行
            const allActiveDecorations = [...activeBoundaries, ...activeBlockLines];
            
            editor.setDecorations(activeBoundaryDeco, allActiveDecorations);
            editor.setDecorations(boundaryDeco, inactiveBoundaries);
        } else {
            // 非活动状态下，所有边界使用默认颜色
            editor.setDecorations(boundaryDeco, allBoundaries);
        }

        // 活动块高亮
        if (active) {
            editor.setDecorations(activeDeco, [active]);
        } else {
            editor.setDecorations(activeDeco, []);
        }
    }

    context.subscriptions.push(vscode.window.onDidChangeTextEditorSelection(e => {
        updateEditor(e.textEditor);
    }));

    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor(editor => {
        updateEditor(editor);
    }));

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument(e => {
        if (vscode.window.activeTextEditor &&
            vscode.window.activeTextEditor.document === e.document) {
            updateEditor(vscode.window.activeTextEditor);
        }
    }));

    // 注册代码块标记快速生成命令
    const insertCodeBlockCommand = vscode.commands.registerCommand('sv-block-highlight.insertCodeBlock', () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const position = editor.selection.active;
        // 提示用户输入注释内容
        vscode.window.showInputBox({
            prompt: "请输入代码块注释内容",
            placeHolder: "例如：功能模块描述"
        }).then(comment => {
            if (comment === undefined) return; // 用户取消了输入

            const commentText = comment ? ` ${comment}` : "";
            editor.edit(editBuilder => {
                // 删除已输入的//，避免重复
                const lineStart = new vscode.Position(position.line, 0);
                editBuilder.delete(new vscode.Range(lineStart, position));
                
                // 一次性插入整个代码块结构
                const startMarker = getStartMarker();
                const endMarker = getEndMarker();
                const codeBlockText = `// ${startMarker}${commentText}\n\n// ${endMarker}${commentText}`;
                editBuilder.insert(lineStart, codeBlockText);
            }).then(success => {
                if (success) {
                    const middleLine = position.line + 1;
        
                    // 使用更可靠的方式设置光标位置
                    const cursorPosition = new vscode.Position(middleLine, 0);
                    editor.selection = new vscode.Selection(cursorPosition, cursorPosition);
                    editor.revealRange(new vscode.Range(cursorPosition, cursorPosition));
                }
            });
        });
    });

    context.subscriptions.push(insertCodeBlockCommand);

    // 注册//%触发代码块标记生成
    const disposable = vscode.commands.registerCommand('type', args => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) return;

        const document = editor.document;
        const selection = editor.selection;
        const position = selection.active;

        // 检查用户是否输入了//%
        if (args.text === '%') {
            const rangeBeforeCursor = new vscode.Range(
                new vscode.Position(position.line, 0),
                position
            );
            const textBeforeCursor = document.getText(rangeBeforeCursor);

            // 检查是否是//%模式
            if (textBeforeCursor.trim() === '//') {
                // 取消默认输入
                vscode.commands.executeCommand('default:type', { text: '' });

                // 触发代码块插入命令
                vscode.commands.executeCommand('sv-block-highlight.insertCodeBlock');
                return;
            }
        }

        // 默认输入行为
        vscode.commands.executeCommand('default:type', args);
    });

    context.subscriptions.push(disposable);

    // initial update for all visible editors
    vscode.window.visibleTextEditors.forEach(ed => updateEditor(ed));
}

/**
 * 函数功能：deactivate函数，用于执行停用或禁用操作
 * 
 * @returns {undefined} 该函数不返回任何值
 */
function deactivate() {}

module.exports = { activate, deactivate };
