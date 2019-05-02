/**
 * Контроллер кнопки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */

Ext.define(
    'FBEditor.view.panel.main.editor.button.splitsection.SplitSectionController',
    {
        extend: 'FBEditor.editor.view.toolbar.button.ButtonController',

        alias: 'controller.editor.toolbar.button.splitsection',

        onClick: function (button, e)
        {
            var me = this,
                btn = me.getView(),
                manager = btn.getEditorManager(),
                sel = window.getSelection(),
                els = {},
                nodes = {},
                helper,
                range,
                cmd,
                history;

            if (e)
            {
                e.stopPropagation();
            }
	
	        if (manager.isSuspendCmd())
	        {
		        return false;
	        }
	
	        range = sel.rangeCount ? sel.getRangeAt(0) : null;

            if (!range || !range.commonAncestorContainer.getElement)
            {
                return false;
            }

            els.common = range.commonAncestorContainer.getElement();

            // секция
            els.section = els.common.getParentName('section');
            helper = els.section.getNodeHelper();
            nodes.section = helper.getNode();

            cmd = Ext.create('FBEditor.editor.command.section.SplitCommand', {node: nodes.node});

            if (cmd.execute())
            {
                history = manager.getHistory();
                history.add(cmd);
            }
        }
    }
);