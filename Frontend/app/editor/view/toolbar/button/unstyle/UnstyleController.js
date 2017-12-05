/**
 * Контроллер кнопки.
 *
 * @author dew1983@mail.ru <Suvorov Andrey M.>
 */
 
Ext.define(
    'FBEditor.editor.view.toolbar.button.unstyle.UnstyleController',
    {
        extend: 'FBEditor.editor.view.toolbar.button.ButtonController',
        requires: [
            'FBEditor.editor.command.UnstyleCommand'
        ],

        alias: 'controller.editor.toolbar.button.unstyle',

        onClick: function (button, e)
        {
            var me = this,
                btn = me.getView(),
                manager = btn.getEditorManager(),
                cmd,
                history;

            if (e)
            {
                e.stopPropagation();
            }

            cmd = Ext.create('FBEditor.editor.command.UnstyleCommand', {manager: manager});

            if (cmd.execute())
            {
                history = manager.getHistory();
                history.add(cmd);
            }
        }
    }
);